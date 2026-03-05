const db = require("../db");
const { logActivity } = require("../utils/activity");

const SUPPORTED_CURRENCIES = ["NGN", "USD", "GBP", "EUR"];

function ensureSettings(userId) {
  const existing = db
    .prepare("SELECT * FROM vendor_settings WHERE user_id = ?")
    .get(userId);

  if (existing) {
    return existing;
  }

  db.prepare("INSERT INTO vendor_settings (user_id) VALUES (?)").run(userId);
  return db.prepare("SELECT * FROM vendor_settings WHERE user_id = ?").get(userId);
}

function getMySettings(req, res) {
  const ownerId = req.accountOwnerId || req.user.id;
  const settings = ensureSettings(ownerId);
  return res.json(settings);
}

function updateMySettings(req, res) {
  const ownerId = req.accountOwnerId || req.user.id;
  const { preferredCurrency, profileName, companyName, bio, currentPassword, newPassword } = req.body;

  ensureSettings(ownerId);

  if (preferredCurrency && !SUPPORTED_CURRENCIES.includes(preferredCurrency)) {
    return res.status(400).json({ message: "Unsupported preferred currency." });
  }

  const safePreferredCurrency = preferredCurrency ?? null;
  const safeProfileName = profileName ?? null;
  const safeCompanyName = companyName ?? null;
  const safeBio = bio ?? null;

  db.prepare(
    `UPDATE vendor_settings
     SET preferred_currency = COALESCE(?, preferred_currency),
         profile_name = COALESCE(?, profile_name),
         company_name = COALESCE(?, company_name),
         bio = COALESCE(?, bio),
         updated_at = CURRENT_TIMESTAMP
     WHERE user_id = ?`
  ).run(safePreferredCurrency, safeProfileName, safeCompanyName, safeBio, ownerId);

  if (newPassword) {
    const user = db.prepare("SELECT password FROM users WHERE id = ?").get(ownerId);
    if (!user || user.password !== currentPassword) {
      return res.status(400).json({ message: "Current password is incorrect." });
    }

    db.prepare("UPDATE users SET password = ? WHERE id = ?").run(newPassword, ownerId);
  }

  const settings = db
    .prepare("SELECT * FROM vendor_settings WHERE user_id = ?")
    .get(ownerId);

  logActivity(req.user.id, "settings_updated", "Updated account settings.");

  return res.json(settings);
}

module.exports = {
  getMySettings,
  updateMySettings
};
