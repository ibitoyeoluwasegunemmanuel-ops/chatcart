const db = require("../db");
const { logActivity } = require("../utils/activity");
const { getPlanLimits, isLimitReached } = require("../utils/subscriptions");

const SUPPORTED_PLATFORMS = ["Instagram", "Facebook", "TikTok", "YouTube"];

function listConnections(req, res) {
  const ownerId = req.accountOwnerId || req.user.id;
  const rows = db
    .prepare(
      `SELECT platform, is_connected AS isConnected, account_name AS accountName,
              updated_at AS updatedAt
       FROM social_connections
       WHERE user_id = ?
       ORDER BY platform ASC`
    )
    .all(ownerId);

  return res.json(rows);
}

function upsertConnection(req, res) {
  const ownerId = req.accountOwnerId || req.user.id;
  const { platform, isConnected, accountName } = req.body;

  if (!SUPPORTED_PLATFORMS.includes(platform)) {
    return res.status(400).json({ message: "Unsupported social platform." });
  }

  db.prepare(
    `INSERT INTO social_connections (user_id, platform, is_connected, account_name)
     VALUES (?, ?, ?, ?)
     ON CONFLICT(user_id, platform)
     DO UPDATE SET
       is_connected = excluded.is_connected,
       account_name = excluded.account_name,
       updated_at = CURRENT_TIMESTAMP`
  ).run(ownerId, platform, isConnected ? 1 : 0, accountName || null);

  logActivity(req.user.id, "social_connection", `Updated ${platform} connection.`, {
    platform,
    isConnected: Boolean(isConnected)
  });

  const row = db
    .prepare(
      `SELECT platform, is_connected AS isConnected, account_name AS accountName,
              updated_at AS updatedAt
       FROM social_connections
       WHERE user_id = ? AND platform = ?`
    )
    .get(ownerId, platform);

  return res.json(row);
}

function createPost(req, res) {
  const ownerId = req.accountOwnerId || req.user.id;
  const { platform, content, mode = "now", scheduledAt = null } = req.body;
  const monthKey = new Date().toISOString().slice(0, 7);

  const userPlan = db
    .prepare("SELECT subscription_plan AS subscriptionPlan FROM users WHERE id = ?")
    .get(ownerId);

  const planLimits = getPlanLimits(userPlan?.subscriptionPlan);
  const postsRow = db
    .prepare(
      `SELECT COUNT(*) AS totalPosts
       FROM social_posts
       WHERE user_id = ? AND substr(created_at, 1, 7) = ?`
    )
    .get(ownerId, monthKey);

  if (isLimitReached(planLimits.maxMonthlyPosts, postsRow?.totalPosts || 0)) {
    return res.status(403).json({
      message: `Monthly post limit reached for ${userPlan?.subscriptionPlan || "creator_starter"}. Upgrade your plan to continue publishing.`
    });
  }

  if (!SUPPORTED_PLATFORMS.includes(platform)) {
    return res.status(400).json({ message: "Unsupported social platform." });
  }

  if (!content || !content.trim()) {
    return res.status(400).json({ message: "content is required." });
  }

  if (!["now", "schedule"].includes(mode)) {
    return res.status(400).json({ message: "mode must be now or schedule." });
  }

  const status = mode === "now" ? "Posted" : "Scheduled";
  const postedAt = mode === "now" ? new Date().toISOString() : null;

  const result = db
    .prepare(
      `INSERT INTO social_posts (user_id, platform, content, mode, scheduled_at, posted_at, status)
       VALUES (?, ?, ?, ?, ?, ?, ?)`
    )
    .run(ownerId, platform, content.trim(), mode, scheduledAt, postedAt, status);

  logActivity(req.user.id, "social_post", `${status} post on ${platform}.`, {
    platform,
    mode
  });

  const post = db
    .prepare(
      `SELECT id, platform, content, mode, scheduled_at AS scheduledAt,
              posted_at AS postedAt, status, created_at AS createdAt
       FROM social_posts
       WHERE id = ?`
    )
    .get(result.lastInsertRowid);

  return res.status(201).json(post);
}

function listPosts(req, res) {
  const ownerId = req.accountOwnerId || req.user.id;
  const posts = db
    .prepare(
      `SELECT id, platform, content, mode, scheduled_at AS scheduledAt,
              posted_at AS postedAt, status, created_at AS createdAt
       FROM social_posts
       WHERE user_id = ?
       ORDER BY id DESC`
    )
    .all(ownerId);

  return res.json(posts);
}

module.exports = {
  listConnections,
  upsertConnection,
  createPost,
  listPosts,
  SUPPORTED_PLATFORMS
};
