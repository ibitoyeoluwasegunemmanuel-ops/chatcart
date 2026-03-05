const express = require("express");
const { authRequired, requireRole, requirePermission } = require("../middleware/auth");
const { getMySettings, updateMySettings } = require("../controllers/settingsController");

const router = express.Router();

router.get("/me", authRequired, requireRole("vendor"), requirePermission("manage_settings"), getMySettings);
router.patch("/me", authRequired, requireRole("vendor"), requirePermission("manage_settings"), updateMySettings);

module.exports = router;
