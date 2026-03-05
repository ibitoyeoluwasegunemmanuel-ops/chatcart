const express = require("express");
const { authRequired, requireOwner, requirePermission } = require("../middleware/auth");
const {
	getMySubscriptionUsage,
	getAvailablePlans,
	upgradeMyPlan,
	getMyBillingHistory
} = require("../controllers/subscriptionController");

const router = express.Router();

router.get("/plans", authRequired, getAvailablePlans);
router.get("/usage", authRequired, getMySubscriptionUsage);
router.get("/history", authRequired, requirePermission("view_billing"), getMyBillingHistory);
router.patch("/upgrade", authRequired, requireOwner, upgradeMyPlan);

module.exports = router;
