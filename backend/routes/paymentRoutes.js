const express = require("express");
const {
  submitPaymentProof,
  listVendorPaymentProofs,
  verifyPaymentProof
} = require("../controllers/paymentController");
const { authRequired, requirePermission } = require("../middleware/auth");

const router = express.Router();

router.post("/proof", submitPaymentProof);
router.get("/vendor", authRequired, requirePermission("manage_orders"), listVendorPaymentProofs);
router.patch("/:id/verify", authRequired, requirePermission("manage_orders"), verifyPaymentProof);

module.exports = router;
