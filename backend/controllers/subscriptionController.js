const db = require("../db");
const { getPlanLimits, ROLE_PLAN_OPTIONS } = require("../utils/subscriptions");

const PLAN_PRICING = {
  vendor_starter: 19,
  vendor_growth: 79,
  vendor_scale: 199,
  creator_starter: 15,
  creator_pro: 49,
  creator_studio: 129
};

function getAvailablePlans(req, res) {
  const ownerId = req.accountOwnerId || req.user.id;
  const user = db
    .prepare(
      `SELECT role, subscription_plan AS subscriptionPlan
       FROM users
       WHERE id = ?`
    )
    .get(ownerId);

  if (!user) {
    return res.status(404).json({ message: "User not found." });
  }

  return res.json({
    role: user.role,
    currentPlan: user.subscriptionPlan,
    plans: ROLE_PLAN_OPTIONS[user.role] || []
  });
}

function getMySubscriptionUsage(req, res) {
  const ownerId = req.accountOwnerId || req.user.id;
  const user = db
    .prepare(
      `SELECT role, subscription_plan AS subscriptionPlan, subscription_status AS subscriptionStatus
       FROM users
       WHERE id = ?`
    )
    .get(ownerId);

  if (!user) {
    return res.status(404).json({ message: "User not found." });
  }

  const limits = getPlanLimits(user.subscriptionPlan);
  const monthKey = new Date().toISOString().slice(0, 7);

  const usage = {
    products: 0,
    monthlyPosts: 0,
    monthlyAiGenerations: 0,
    staffCount: 0
  };

  const staffRow = db
    .prepare("SELECT COUNT(*) AS total FROM users WHERE owner_user_id = ? AND is_staff = 1")
    .get(ownerId);
  usage.staffCount = staffRow?.total || 0;

  if (user.role === "vendor") {
    const row = db
      .prepare("SELECT COUNT(*) AS total FROM products WHERE vendor_id = ?")
      .get(ownerId);
    usage.products = row?.total || 0;
  }

  if (user.role === "content_creator") {
    const postsRow = db
      .prepare(
        `SELECT COUNT(*) AS total
         FROM social_posts
         WHERE user_id = ? AND substr(created_at, 1, 7) = ?`
      )
      .get(ownerId, monthKey);

    const aiRow = db
      .prepare(
        `SELECT COUNT(*) AS total
         FROM activity_logs
         WHERE user_id = ?
           AND activity_type = 'ai_generated'
           AND substr(created_at, 1, 7) = ?`
      )
      .get(ownerId, monthKey);

    usage.monthlyPosts = postsRow?.total || 0;
    usage.monthlyAiGenerations = aiRow?.total || 0;
  }

  return res.json({
    role: user.role,
    subscriptionPlan: user.subscriptionPlan,
    subscriptionStatus: user.subscriptionStatus,
    limits,
    usage,
    month: monthKey,
    remaining: {
      products: limits.maxProducts == null ? null : Math.max(0, limits.maxProducts - usage.products),
      monthlyPosts: limits.maxMonthlyPosts == null ? null : Math.max(0, limits.maxMonthlyPosts - usage.monthlyPosts),
      monthlyAiGenerations:
        limits.maxMonthlyAiGenerations == null
          ? null
          : Math.max(0, limits.maxMonthlyAiGenerations - usage.monthlyAiGenerations),
      staffCount: limits.maxStaff == null ? null : Math.max(0, limits.maxStaff - usage.staffCount)
    }
  });
}

function upgradeMyPlan(req, res) {
  const ownerId = req.accountOwnerId || req.user.id;
  const { subscriptionPlan } = req.body;

  const user = db
    .prepare(
      `SELECT role, subscription_plan AS subscriptionPlan
       FROM users
       WHERE id = ?`
    )
    .get(ownerId);

  if (!user) {
    return res.status(404).json({ message: "User not found." });
  }

  const validPlans = ROLE_PLAN_OPTIONS[user.role] || [];
  if (!subscriptionPlan || !validPlans.includes(subscriptionPlan)) {
    return res.status(400).json({ message: "Invalid subscription plan for your account type." });
  }

  db.prepare(
    `UPDATE users
     SET subscription_plan = ?,
         subscription_status = 'active'
     WHERE id = ?`
  ).run(subscriptionPlan, ownerId);

  db.prepare(
    `UPDATE users
     SET subscription_plan = ?
     WHERE owner_user_id = ? AND is_staff = 1`
  ).run(subscriptionPlan, ownerId);

  db.prepare(
    `INSERT INTO billing_transactions (user_id, role, plan, amount, currency, status)
     VALUES (?, ?, ?, ?, 'USD', 'paid')`
  ).run(ownerId, user.role, subscriptionPlan, PLAN_PRICING[subscriptionPlan] || 0);

  return res.json({
    message: "Subscription plan updated successfully.",
    subscriptionPlan
  });
}

function getMyBillingHistory(req, res) {
  const ownerId = req.accountOwnerId || req.user.id;
  const rows = db
    .prepare(
      `SELECT id, role, plan, amount, currency, status, created_at AS createdAt
       FROM billing_transactions
       WHERE user_id = ?
       ORDER BY id DESC
       LIMIT 20`
    )
     .all(ownerId);

  return res.json(rows);
}

module.exports = {
  getMySubscriptionUsage,
  getAvailablePlans,
  upgradeMyPlan,
  getMyBillingHistory
};
