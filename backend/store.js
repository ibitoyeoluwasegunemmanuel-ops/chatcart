const fs = require("fs");
const path = require("path");

const dataDir = path.join(__dirname, "..", "database", "data");
const usersPath = path.join(dataDir, "users.json");
const productsPath = path.join(dataDir, "products.json");
const ordersPath = path.join(dataDir, "orders.json");

function ensureDataFiles() {
  if (!fs.existsSync(dataDir)) {
    fs.mkdirSync(dataDir, { recursive: true });
  }

  const files = [
    { filePath: usersPath, fallback: [] },
    { filePath: productsPath, fallback: [] },
    { filePath: ordersPath, fallback: [] }
  ];

  for (const file of files) {
    if (!fs.existsSync(file.filePath)) {
      fs.writeFileSync(file.filePath, JSON.stringify(file.fallback, null, 2), "utf8");
    }
  }
}

function readJson(filePath) {
  ensureDataFiles();
  const raw = fs.readFileSync(filePath, "utf8");
  return JSON.parse(raw);
}

function writeJson(filePath, data) {
  ensureDataFiles();
  fs.writeFileSync(filePath, JSON.stringify(data, null, 2), "utf8");
}

module.exports = {
  ensureDataFiles,
  readUsers: () => readJson(usersPath),
  writeUsers: (users) => writeJson(usersPath, users),
  readProducts: () => readJson(productsPath),
  writeProducts: (products) => writeJson(productsPath, products),
  readOrders: () => readJson(ordersPath),
  writeOrders: (orders) => writeJson(ordersPath, orders)
};
