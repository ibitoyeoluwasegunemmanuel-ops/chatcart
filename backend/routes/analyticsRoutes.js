const express = require("express");
const { authRequired, requireRole, requirePermission } = require("../middleware/auth");
const { getAnalyticsSummary } = require("../controllers/analyticsController");

const router = express.Router();

router.get("/summary", authRequired, requireRole("vendor"), requirePermission("view_analytics"), getAnalyticsSummary);

module.exports = router;
