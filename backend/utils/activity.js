const db = require("../db");

function logActivity(userId, activityType, message, metadata = {}) {
  db.prepare(
    `INSERT INTO activity_logs (user_id, activity_type, message, metadata)
     VALUES (?, ?, ?, ?)`
  ).run(userId, activityType, message, JSON.stringify(metadata));
}

module.exports = {
  logActivity
};
