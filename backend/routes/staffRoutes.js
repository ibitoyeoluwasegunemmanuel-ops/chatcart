const express = require("express");
const { authRequired, requireOwner } = require("../middleware/auth");
const {
	getAvailablePermissions,
	listStaff,
	createStaff,
	updateStaffStatus,
	updateStaffPermissions
} = require("../controllers/staffController");

const router = express.Router();

router.get("/permissions", authRequired, getAvailablePermissions);
router.get("/", authRequired, listStaff);
router.post("/", authRequired, requireOwner, createStaff);
router.patch("/:id/status", authRequired, requireOwner, updateStaffStatus);
router.patch("/:id/permissions", authRequired, requireOwner, updateStaffPermissions);

module.exports = router;
