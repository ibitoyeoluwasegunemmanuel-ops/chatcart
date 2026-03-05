const express = require("express");
const {
	createOrder,
	listVendorOrders,
	updateOrderStatus
} = require("../controllers/orderController");
const { authRequired, requirePermission } = require("../middleware/auth");

const router = express.Router();

router.post("/", authRequired, requirePermission("manage_orders"), createOrder);
router.get("/vendor", authRequired, requirePermission("manage_orders"), listVendorOrders);
router.patch("/:id/status", authRequired, requirePermission("manage_orders"), updateOrderStatus);

module.exports = router;
