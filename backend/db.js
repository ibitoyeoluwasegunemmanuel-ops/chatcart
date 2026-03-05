const fs = require("fs");
const path = require("path");
const { DatabaseSync } = require("node:sqlite");

const databasePath = path.join(__dirname, "..", "database", "chatcart.db");
const schemaPath = path.join(__dirname, "..", "database", "schema.sql");

const dbDir = path.dirname(databasePath);
if (!fs.existsSync(dbDir)) {
  fs.mkdirSync(dbDir, { recursive: true });
}

const db = new DatabaseSync(databasePath);
db.exec("PRAGMA foreign_keys = ON;");

function initializeDatabase() {
  const schemaSql = fs.readFileSync(schemaPath, "utf8");
  db.exec(schemaSql);
}

initializeDatabase();

function hasColumn(table, column) {
  const columns = db.prepare(`PRAGMA table_info(${table})`).all();
  return columns.some((item) => item.name === column);
}

function migrateSchema() {
  const alterations = [
    { table: "users", column: "avatar_url", sql: "ALTER TABLE users ADD COLUMN avatar_url TEXT" },
    { table: "products", column: "currency", sql: "ALTER TABLE products ADD COLUMN currency TEXT NOT NULL DEFAULT 'NGN'" },
    { table: "products", column: "images", sql: "ALTER TABLE products ADD COLUMN images TEXT NOT NULL DEFAULT '[]'" },
    { table: "products", column: "stock_quantity", sql: "ALTER TABLE products ADD COLUMN stock_quantity INTEGER NOT NULL DEFAULT 0" },
    { table: "products", column: "updated_at", sql: "ALTER TABLE products ADD COLUMN updated_at TEXT DEFAULT CURRENT_TIMESTAMP" },
    { table: "orders", column: "currency", sql: "ALTER TABLE orders ADD COLUMN currency TEXT NOT NULL DEFAULT 'NGN'" },
    { table: "orders", column: "updated_at", sql: "ALTER TABLE orders ADD COLUMN updated_at TEXT DEFAULT CURRENT_TIMESTAMP" }
  ];

  for (const alter of alterations) {
    if (!hasColumn(alter.table, alter.column)) {
      db.exec(alter.sql);
    }
  }

  if (!hasColumn("users", "subscription_plan")) {
    db.exec("ALTER TABLE users ADD COLUMN subscription_plan TEXT");
  }

  if (!hasColumn("users", "subscription_status")) {
    db.exec("ALTER TABLE users ADD COLUMN subscription_status TEXT NOT NULL DEFAULT 'active'");
  }

  if (!hasColumn("users", "trial_ends_at")) {
    db.exec("ALTER TABLE users ADD COLUMN trial_ends_at TEXT");
  }

  if (!hasColumn("users", "owner_user_id")) {
    db.exec("ALTER TABLE users ADD COLUMN owner_user_id INTEGER");
  }

  if (!hasColumn("users", "is_staff")) {
    db.exec("ALTER TABLE users ADD COLUMN is_staff INTEGER NOT NULL DEFAULT 0");
  }

  if (!hasColumn("users", "staff_title")) {
    db.exec("ALTER TABLE users ADD COLUMN staff_title TEXT");
  }

  if (!hasColumn("users", "staff_permissions")) {
    db.exec("ALTER TABLE users ADD COLUMN staff_permissions TEXT NOT NULL DEFAULT '[]'");
  }

  if (!hasColumn("users", "is_active")) {
    db.exec("ALTER TABLE users ADD COLUMN is_active INTEGER NOT NULL DEFAULT 1");
  }

  db.exec(
    `UPDATE users
     SET subscription_plan = CASE
       WHEN role = 'vendor' THEN 'vendor_starter'
       WHEN role = 'customer' THEN 'creator_starter'
       WHEN role = 'content_creator' THEN 'creator_starter'
       ELSE 'vendor_starter'
     END
     WHERE subscription_plan IS NULL OR trim(subscription_plan) = ''`
  );

  const usersTable = db
    .prepare("SELECT sql FROM sqlite_master WHERE type = 'table' AND name = 'users'")
    .get();

  if (usersTable?.sql && usersTable.sql.includes("role IN ('vendor', 'customer')")) {
    db.exec("PRAGMA foreign_keys = OFF;");
    db.exec("BEGIN TRANSACTION;");
    db.exec(
      `CREATE TABLE users_new (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        name TEXT NOT NULL,
        email TEXT UNIQUE NOT NULL,
        password TEXT NOT NULL,
        role TEXT NOT NULL,
        subscription_plan TEXT NOT NULL,
        subscription_status TEXT NOT NULL DEFAULT 'active',
        trial_ends_at TEXT,
        owner_user_id INTEGER,
        is_staff INTEGER NOT NULL DEFAULT 0,
        staff_title TEXT,
        staff_permissions TEXT NOT NULL DEFAULT '[]',
        is_active INTEGER NOT NULL DEFAULT 1,
        avatar_url TEXT,
        created_at TEXT DEFAULT CURRENT_TIMESTAMP
      )`
    );

    db.exec(
      `INSERT INTO users_new (id, name, email, password, role, subscription_plan, subscription_status, trial_ends_at, owner_user_id, is_staff, staff_title, staff_permissions, is_active, avatar_url, created_at)
       SELECT
         id,
         name,
         email,
         password,
         CASE WHEN role = 'customer' THEN 'content_creator' ELSE role END,
         CASE
           WHEN role = 'vendor' THEN COALESCE(subscription_plan, 'vendor_starter')
           ELSE COALESCE(subscription_plan, 'creator_starter')
         END,
         COALESCE(subscription_status, 'active'),
         trial_ends_at,
         owner_user_id,
         COALESCE(is_staff, 0),
         staff_title,
         COALESCE(staff_permissions, '[]'),
         COALESCE(is_active, 1),
         avatar_url,
         created_at
       FROM users`
    );

    db.exec("DROP TABLE users;");
    db.exec("ALTER TABLE users_new RENAME TO users;");
    db.exec("COMMIT;");
    db.exec("PRAGMA foreign_keys = ON;");
  } else {
    db.exec("UPDATE users SET role = 'content_creator' WHERE role = 'customer'");
  }

  db.exec(
    "UPDATE orders SET status = 'Pending' WHERE lower(status) = 'placed' OR status IS NULL"
  );

  db.exec(
    `CREATE TABLE IF NOT EXISTS whatsapp_conversations (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      vendor_id INTEGER NOT NULL,
      customer_name TEXT,
      customer_phone TEXT NOT NULL,
      message TEXT NOT NULL,
      ai_response TEXT NOT NULL,
      intent TEXT NOT NULL DEFAULT 'support',
      created_at TEXT DEFAULT CURRENT_TIMESTAMP,
      FOREIGN KEY (vendor_id) REFERENCES users(id)
    )`
  );

  db.exec(
    `CREATE TABLE IF NOT EXISTS payment_proofs (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      order_id INTEGER,
      vendor_id INTEGER NOT NULL,
      customer_name TEXT,
      customer_contact TEXT,
      amount REAL NOT NULL,
      currency TEXT NOT NULL DEFAULT 'NGN',
      proof_url TEXT NOT NULL,
      status TEXT NOT NULL DEFAULT 'pending',
      notes TEXT,
      verified_by INTEGER,
      verified_at TEXT,
      created_at TEXT DEFAULT CURRENT_TIMESTAMP,
      updated_at TEXT DEFAULT CURRENT_TIMESTAMP,
      FOREIGN KEY (order_id) REFERENCES orders(id),
      FOREIGN KEY (vendor_id) REFERENCES users(id),
      FOREIGN KEY (verified_by) REFERENCES users(id)
    )`
  );
}

migrateSchema();

module.exports = db;
