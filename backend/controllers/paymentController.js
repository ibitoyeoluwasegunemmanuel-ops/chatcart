const db = require("../db");
const { logActivity } = require("../utils/activity");

function submitPaymentProof(req, res) {
  const {
    orderId,
    vendorId,
    customerName,
    customerContact,
    amount,
    currency = "NGN",
    proofUrl
  } = req.body;

  if (!vendorId || !amount || !proofUrl) {
    return res.status(400).json({
      message: "vendorId, amount, and proofUrl are required."
    });
  }

  const vendor = db
    .prepare("SELECT id, role FROM users WHERE id = ?")
    .get(Number(vendorId));

  if (!vendor || vendor.role !== "vendor") {
    return res.status(404).json({ message: "Vendor not found." });
  }

  const parsedAmount = Number(amount);
  if (Number.isNaN(parsedAmount) || parsedAmount <= 0) {
    return res.status(400).json({ message: "amount must be a positive number." });
  }

  if (orderId) {
    const order = db
      .prepare("SELECT id FROM orders WHERE id = ? AND vendor_id = ?")
      .get(Number(orderId), vendor.id);

    if (!order) {
      return res.status(404).json({ message: "Order not found for this vendor." });
    }
  }

  const inserted = db
    .prepare(
      `INSERT INTO payment_proofs
       (order_id, vendor_id, customer_name, customer_contact, amount, currency, proof_url, status)
       VALUES (?, ?, ?, ?, ?, ?, ?, 'pending')`
    )
    .run(
      orderId ? Number(orderId) : null,
      vendor.id,
      customerName || null,
      customerContact || null,
      parsedAmount,
      String(currency || "NGN").toUpperCase(),
      proofUrl
    );

  logActivity(vendor.id, "payment_proof_submitted", "Customer submitted payment proof.", {
    paymentProofId: inserted.lastInsertRowid,
    orderId: orderId ? Number(orderId) : null
  });

  const row = db
    .prepare(
      `SELECT id, order_id AS orderId, vendor_id AS vendorId,
              customer_name AS customerName, customer_contact AS customerContact,
              amount, currency, proof_url AS proofUrl, status,
              notes, verified_by AS verifiedBy, verified_at AS verifiedAt,
              created_at AS createdAt, updated_at AS updatedAt
       FROM payment_proofs
       WHERE id = ?`
    )
    .get(inserted.lastInsertRowid);

  return res.status(201).json(row);
}

function listVendorPaymentProofs(req, res) {
  if (req.user.role !== "vendor" && req.user.role !== "admin") {
    return res.status(403).json({ message: "Only vendors and admins can access this endpoint." });
  }

  const vendorId = req.user.role === "admin"
    ? Number(req.query.vendorId || 0)
    : (req.accountOwnerId || req.user.id);

  if (req.user.role === "admin" && !vendorId) {
    return res.status(400).json({ message: "vendorId query parameter is required for admin view." });
  }

  const proofs = db
    .prepare(
      `SELECT id, order_id AS orderId, vendor_id AS vendorId,
              customer_name AS customerName, customer_contact AS customerContact,
              amount, currency, proof_url AS proofUrl, status,
              notes, verified_by AS verifiedBy, verified_at AS verifiedAt,
              created_at AS createdAt, updated_at AS updatedAt
       FROM payment_proofs
       WHERE vendor_id = ?
       ORDER BY id DESC`
    )
    .all(vendorId);

  return res.json(proofs);
}

function verifyPaymentProof(req, res) {
  if (req.user.role !== "vendor" && req.user.role !== "admin") {
    return res.status(403).json({ message: "Only vendors and admins can verify payments." });
  }

  const proofId = Number(req.params.id);
  const { status, notes = "" } = req.body;

  if (!["approved", "rejected"].includes(status)) {
    return res.status(400).json({ message: "status must be approved or rejected." });
  }

  const existing = db
    .prepare(
      `SELECT id, order_id AS orderId, vendor_id AS vendorId
       FROM payment_proofs
       WHERE id = ?`
    )
    .get(proofId);

  if (!existing) {
    return res.status(404).json({ message: "Payment proof not found." });
  }

  if (req.user.role === "vendor") {
    const ownerId = req.accountOwnerId || req.user.id;
    if (existing.vendorId !== ownerId) {
      return res.status(403).json({ message: "You cannot verify this payment proof." });
    }
  }

  db.prepare(
    `UPDATE payment_proofs
     SET status = ?, notes = ?, verified_by = ?, verified_at = CURRENT_TIMESTAMP, updated_at = CURRENT_TIMESTAMP
     WHERE id = ?`
  ).run(status, notes, req.user.id, proofId);

  if (existing.orderId) {
    const nextOrderStatus = status === "approved" ? "Processing" : "Pending";
    db.prepare(
      `UPDATE orders
       SET status = ?, updated_at = CURRENT_TIMESTAMP
       WHERE id = ?`
    ).run(nextOrderStatus, existing.orderId);
  }

  logActivity(existing.vendorId, "payment_proof_verified", `Payment proof #${proofId} ${status}.`, {
    paymentProofId: proofId,
    orderId: existing.orderId,
    verifiedBy: req.user.id,
    status
  });

  const row = db
    .prepare(
      `SELECT id, order_id AS orderId, vendor_id AS vendorId,
              customer_name AS customerName, customer_contact AS customerContact,
              amount, currency, proof_url AS proofUrl, status,
              notes, verified_by AS verifiedBy, verified_at AS verifiedAt,
              created_at AS createdAt, updated_at AS updatedAt
       FROM payment_proofs
       WHERE id = ?`
    )
    .get(proofId);

  return res.json(row);
}

module.exports = {
  submitPaymentProof,
  listVendorPaymentProofs,
  verifyPaymentProof
};
