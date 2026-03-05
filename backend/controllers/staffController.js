const db = require("../db");
const { getPlanLimits, isLimitReached } = require("../utils/subscriptions");
const { logActivity } = require("../utils/activity");

const AVAILABLE_PERMISSIONS = {
  vendor: ["manage_products", "manage_orders", "manage_settings", "view_analytics", "view_billing", "manage_staff"],
  content_creator: ["generate_content", "manage_posts", "manage_connections", "view_billing", "manage_staff"]
};

function parsePermissions(raw) {
  if (!raw) {
    return [];
  }

  if (Array.isArray(raw)) {
    return raw;
  }

  try {
    const parsed = JSON.parse(raw);
    return Array.isArray(parsed) ? parsed : [];
  } catch (_error) {
    return [];
  }
}

function normalizePermissions(role, permissions) {
  const allowed = AVAILABLE_PERMISSIONS[role] || [];
  const list = Array.isArray(permissions) ? permissions : [];
  return [...new Set(list.filter((item) => allowed.includes(item)))];
}

function getOwner(ownerId) {
  return db
    .prepare(
      `SELECT id, role,
              subscription_plan AS subscriptionPlan
       FROM users
       WHERE id = ?`
    )
    .get(ownerId);
}

function listStaff(req, res) {
  const ownerId = req.accountOwnerId || req.user.id;

  const rows = db
    .prepare(
      `SELECT id, name, email,
              staff_title AS staffTitle,
              staff_permissions AS staffPermissions,
              is_active AS isActive,
              created_at AS createdAt
       FROM users
       WHERE owner_user_id = ? AND is_staff = 1
       ORDER BY id DESC`
    )
    .all(ownerId)
    .map((item) => ({
      ...item,
      permissions: parsePermissions(item.staffPermissions),
      isActive: Boolean(item.isActive)
    }));

  return res.json(rows);
}

function getAvailablePermissions(req, res) {
  const ownerId = req.accountOwnerId || req.user.id;
  const owner = getOwner(ownerId);

  if (!owner) {
    return res.status(404).json({ message: "Owner account not found." });
  }

  return res.json({
    role: owner.role,
    permissions: AVAILABLE_PERMISSIONS[owner.role] || []
  });
}

function createStaff(req, res) {
  const ownerId = req.accountOwnerId || req.user.id;
  const { name, email, password, staffTitle = "Staff", permissions = [] } = req.body;

  if (!name || !email || !password) {
    return res.status(400).json({ message: "name, email and password are required." });
  }

  const owner = getOwner(ownerId);
  if (!owner) {
    return res.status(404).json({ message: "Owner account not found." });
  }

  const normalizedPermissions = normalizePermissions(owner.role, permissions);

  const limits = getPlanLimits(owner.subscriptionPlan);
  const staffCount = db
    .prepare("SELECT COUNT(*) AS total FROM users WHERE owner_user_id = ? AND is_staff = 1")
    .get(ownerId);

  if (isLimitReached(limits.maxStaff, staffCount?.total || 0)) {
    return res.status(403).json({
      message: `Staff limit reached for ${owner.subscriptionPlan}. Upgrade your plan to add more staff.`
    });
  }

  const normalizedEmail = String(email).trim().toLowerCase();
  const existing = db
    .prepare("SELECT id FROM users WHERE lower(email) = lower(?)")
    .get(normalizedEmail);

  if (existing) {
    return res.status(409).json({ message: "Email already registered." });
  }

  const result = db
    .prepare(
      `INSERT INTO users (
         name, email, password, role, subscription_plan, subscription_status,
         owner_user_id, is_staff, staff_title, staff_permissions, is_active
       )
       VALUES (?, ?, ?, ?, ?, 'active', ?, 1, ?, ?, 1)`
    )
    .run(
      name.trim(),
      normalizedEmail,
      password,
      owner.role,
      owner.subscriptionPlan,
      ownerId,
      staffTitle,
      JSON.stringify(normalizedPermissions)
    );

  const created = db
    .prepare(
      `SELECT id, name, email,
              staff_title AS staffTitle,
              staff_permissions AS staffPermissions,
              is_active AS isActive,
              created_at AS createdAt
       FROM users
       WHERE id = ?`
    )
    .get(result.lastInsertRowid);

  logActivity(ownerId, "staff_created", `Created staff profile for ${created.email}.`, {
    staffUserId: created.id
  });

  return res.status(201).json({
    ...created,
    permissions: parsePermissions(created.staffPermissions),
    isActive: Boolean(created.isActive)
  });
}

function updateStaffStatus(req, res) {
  const ownerId = req.accountOwnerId || req.user.id;
  const staffId = Number(req.params.id);
  const { isActive } = req.body;

  if (typeof isActive !== "boolean") {
    return res.status(400).json({ message: "isActive must be boolean." });
  }

  const target = db
    .prepare("SELECT id FROM users WHERE id = ? AND owner_user_id = ? AND is_staff = 1")
    .get(staffId, ownerId);

  if (!target) {
    return res.status(404).json({ message: "Staff profile not found." });
  }

  db.prepare("UPDATE users SET is_active = ? WHERE id = ?").run(isActive ? 1 : 0, staffId);

  logActivity(ownerId, "staff_status_updated", `Updated staff status for #${staffId}.`, {
    staffUserId: staffId,
    isActive
  });

  return res.json({ message: "Staff status updated." });
}

function updateStaffPermissions(req, res) {
  const ownerId = req.accountOwnerId || req.user.id;
  const staffId = Number(req.params.id);
  const { permissions = [] } = req.body;

  const owner = getOwner(ownerId);
  if (!owner) {
    return res.status(404).json({ message: "Owner account not found." });
  }

  const target = db
    .prepare("SELECT id FROM users WHERE id = ? AND owner_user_id = ? AND is_staff = 1")
    .get(staffId, ownerId);

  if (!target) {
    return res.status(404).json({ message: "Staff profile not found." });
  }

  const normalizedPermissions = normalizePermissions(owner.role, permissions);

  db.prepare("UPDATE users SET staff_permissions = ? WHERE id = ?")
    .run(JSON.stringify(normalizedPermissions), staffId);

  logActivity(ownerId, "staff_permissions_updated", `Updated permissions for staff #${staffId}.`, {
    staffUserId: staffId,
    permissions: normalizedPermissions
  });

  return res.json({ message: "Staff permissions updated.", permissions: normalizedPermissions });
}

module.exports = {
  getAvailablePermissions,
  listStaff,
  createStaff,
  updateStaffStatus,
  updateStaffPermissions
};
