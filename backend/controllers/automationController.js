const db = require("../db");
const { logActivity } = require("../utils/activity");
const { getPlanLimits, isLimitReached } = require("../utils/subscriptions");

function generateContent(req, res) {
  const ownerId = req.accountOwnerId || req.user.id;
  const { productName = "your product", description = "", contentType = "caption" } = req.body;
  const monthKey = new Date().toISOString().slice(0, 7);

  const userPlan = db
    .prepare("SELECT subscription_plan AS subscriptionPlan FROM users WHERE id = ?")
    .get(ownerId);

  const planLimits = getPlanLimits(userPlan?.subscriptionPlan);
  const aiRow = db
    .prepare(
      `SELECT COUNT(*) AS totalAi
       FROM activity_logs
       WHERE user_id = ?
         AND activity_type = 'ai_generated'
         AND substr(created_at, 1, 7) = ?`
    )
    .get(ownerId, monthKey);

  if (isLimitReached(planLimits.maxMonthlyAiGenerations, aiRow?.totalAi || 0)) {
    return res.status(403).json({
      message: `Monthly AI generation limit reached for ${userPlan?.subscriptionPlan || "creator_starter"}. Upgrade your plan for more AI usage.`
    });
  }

  const templates = {
    caption: `✨ ${productName} is now available on ChatCart! ${description} Shop now and upgrade your workflow.`,
    post: `🚀 New launch: ${productName}. ${description} Visit our store today and discover smarter commerce automation!`,
    ad: `Boost your sales with ${productName}. ${description} Start now on ChatCart and convert faster.`,
    hashtags: `#ChatCart #EcommerceAutomation #${String(productName).replace(/\s+/g, "") || "Product"} #VendorGrowth #DigitalCommerce`
  };

  const output = templates[contentType] || templates.caption;

  logActivity(ownerId, "ai_generated", `Generated AI ${contentType} content.`);

  return res.json({
    contentType,
    output
  });
}

function listActivity(req, res) {
  const ownerId = req.accountOwnerId || req.user.id;
  const activities = db
    .prepare(
      `SELECT id, activity_type AS activityType, message, metadata, created_at AS createdAt
       FROM activity_logs
       WHERE user_id = ?
       ORDER BY id DESC
       LIMIT 20`
    )
    .all(ownerId)
    .map((activity) => ({
      ...activity,
      metadata: JSON.parse(activity.metadata || "{}")
    }));

  return res.json(activities);
}

module.exports = {
  generateContent,
  listActivity
};
