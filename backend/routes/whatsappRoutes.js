const express = require("express");
const {
  receiveCustomerMessage,
  getVendorConversations,
  trackOrderStatus
} = require("../controllers/whatsappController");
const { authRequired, requirePermission } = require("../middleware/auth");

const router = express.Router();

router.post("/message", receiveCustomerMessage);
router.get("/track/:orderId", trackOrderStatus);
router.get("/vendor/conversations", authRequired, requirePermission("manage_orders"), getVendorConversations);

module.exports = router;
