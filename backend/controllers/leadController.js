const db = require("../db");

function createLead(req, res) {
  const { name, email, roleInterest = "unknown", source = "landing" } = req.body;

  if (!name || !email) {
    return res.status(400).json({ message: "name and email are required." });
  }

  const normalizedEmail = String(email).trim().toLowerCase();
  const existing = db
    .prepare("SELECT id FROM marketing_leads WHERE lower(email) = lower(?)")
    .get(normalizedEmail);

  if (existing) {
    return res.status(200).json({ message: "Lead already captured." });
  }

  db.prepare(
    `INSERT INTO marketing_leads (name, email, role_interest, source)
     VALUES (?, ?, ?, ?)`
  ).run(String(name).trim(), normalizedEmail, roleInterest, source);

  return res.status(201).json({ message: "Lead captured successfully." });
}

module.exports = {
  createLead
};
