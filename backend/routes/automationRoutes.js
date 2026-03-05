const express = require("express");
const { authRequired, requireRole, requirePermission } = require("../middleware/auth");
const { generateContent, listActivity } = require("../controllers/automationController");

const router = express.Router();

router.post("/generate", authRequired, requireRole("content_creator"), requirePermission("generate_content"), generateContent);
router.get("/activity", authRequired, requireRole("content_creator"), listActivity);

module.exports = router;
