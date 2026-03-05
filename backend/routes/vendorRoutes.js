const express = require("express");
const { listVendorProducts } = require("../controllers/productController");
const { listVendorOrders } = require("../controllers/orderController");
const { authRequired, requireRole, requirePermission } = require("../middleware/auth");

const router = express.Router();

router.get("/vendors/me/products", authRequired, requireRole("vendor"), requirePermission("manage_products"), listVendorProducts);
router.get("/vendors/me/orders", authRequired, requireRole("vendor"), requirePermission("manage_orders"), listVendorOrders);

module.exports = router;
