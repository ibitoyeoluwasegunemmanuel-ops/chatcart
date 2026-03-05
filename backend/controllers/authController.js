const jwt = require("jsonwebtoken");
const db = require("../db");
const { JWT_SECRET } = require("../middleware/auth");
const { logActivity } = require("../utils/activity");

const ROLE_PLAN_OPTIONS = {
  vendor: ["vendor_starter", "vendor_growth", "vendor_scale"],
  content_creator: ["creator_starter", "creator_pro", "creator_studio"]
};

function normalizeRole(input) {
  if (input === "customer") {
    return "content_creator";
  }

  return input;
}

function getDefaultPlan(role) {
  return role === "vendor" ? "vendor_starter" : "creator_starter";
}

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

function signup(req, res) {
  const { name, email, password, role, subscriptionPlan } = req.body;
  const normalizedRole = normalizeRole(role);
  const selectedPlan = subscriptionPlan || getDefaultPlan(normalizedRole);

  if (!name || !email || !password || !normalizedRole) {
    return res.status(400).json({ message: "name, email, password and role are required." });
  }

  if (!Object.prototype.hasOwnProperty.call(ROLE_PLAN_OPTIONS, normalizedRole)) {
    return res.status(400).json({ message: "role must be vendor or content_creator." });
  }

  if (!ROLE_PLAN_OPTIONS[normalizedRole].includes(selectedPlan)) {
    return res.status(400).json({ message: "Invalid subscription plan for selected role." });
  }

  const existingUser = db
    .prepare("SELECT id FROM users WHERE lower(email) = lower(?)")
    .get(email);

  if (existingUser) {
    return res.status(409).json({ message: "Email already registered." });
  }

  db.prepare(
     `INSERT INTO users (name, email, password, role, subscription_plan, subscription_status, trial_ends_at)
      VALUES (?, ?, ?, ?, ?, 'active', datetime('now', '+14 day'))`
    ).run(name, email, password, normalizedRole, selectedPlan);

  const createdUser = db
    .prepare("SELECT id FROM users WHERE lower(email) = lower(?)")
    .get(email);

  if (normalizedRole === "vendor") {
    db.prepare(
      `INSERT OR IGNORE INTO vendor_settings (user_id, profile_name)
       VALUES (?, ?)`
    ).run(createdUser.id, name);
  }

  logActivity(createdUser.id, "signup", "Created a new account.", {
    role: normalizedRole,
    subscriptionPlan: selectedPlan
  });

  return res.status(201).json({
    message: "Account created successfully.",
    role: normalizedRole,
    subscriptionPlan: selectedPlan
  });
}

function login(req, res) {
  const { email, password, role } = req.body;
  const normalizedRole = role ? normalizeRole(role) : null;

  if (!email || !password) {
    return res.status(400).json({ message: "email and password are required." });
  }

  const user = db
    .prepare(
      `SELECT id, name, email, password, role,
              subscription_plan AS subscriptionPlan,
              subscription_status AS subscriptionStatus,
              trial_ends_at AS trialEndsAt,
              owner_user_id AS ownerUserId,
              is_staff AS isStaff,
              staff_title AS staffTitle,
              staff_permissions AS staffPermissions,
              is_active AS isActive
       FROM users
       WHERE lower(email) = lower(?)`
    )
    .get(email);

  if (!user || user.password !== password) {
    return res.status(401).json({ message: "Invalid credentials." });
  }

  if (!user.isActive) {
    return res.status(403).json({ message: "This staff account has been deactivated." });
  }

  if (normalizedRole && user.role !== normalizedRole) {
    return res.status(403).json({
      message: `This account is registered as ${user.role}. Select the correct account type to continue.`
    });
  }

  const ownerUserId = user.ownerUserId || user.id;
  const permissions = parsePermissions(user.staffPermissions);

  const token = jwt.sign(
    {
      id: user.id,
      email: user.email,
      role: user.role,
      name: user.name,
      ownerUserId,
      isStaff: Boolean(user.isStaff),
      staffTitle: user.staffTitle || null,
      permissions
    },
    JWT_SECRET,
    { expiresIn: "8h" }
  );

  const settings = db
    .prepare("SELECT preferred_currency AS preferredCurrency FROM vendor_settings WHERE user_id = ?")
    .get(ownerUserId);

  logActivity(user.id, "login", "Logged in to platform.");

  return res.json({
    token,
    user: {
      id: user.id,
      name: user.name,
      email: user.email,
      role: user.role,
      ownerUserId,
      isStaff: Boolean(user.isStaff),
      staffTitle: user.staffTitle,
      permissions,
      subscriptionPlan: user.subscriptionPlan || getDefaultPlan(user.role),
      subscriptionStatus: user.subscriptionStatus || "active",
      trialEndsAt: user.trialEndsAt,
      preferredCurrency: settings?.preferredCurrency || "NGN"
    },
    settings: {
      preferredCurrency: settings?.preferredCurrency || "NGN"
    }
  });
}

module.exports = {
  signup,
  login
};
