const express = require("express");
const { authRequired, requireRole, requirePermission } = require("../middleware/auth");
const {
  listConnections,
  upsertConnection,
  createPost,
  listPosts
} = require("../controllers/socialController");

const router = express.Router();

router.get("/connections", authRequired, requireRole("content_creator"), requirePermission("manage_connections"), listConnections);
router.post("/connections", authRequired, requireRole("content_creator"), requirePermission("manage_connections"), upsertConnection);
router.get("/posts", authRequired, requireRole("content_creator"), requirePermission("manage_posts"), listPosts);
router.post("/posts", authRequired, requireRole("content_creator"), requirePermission("manage_posts"), createPost);

module.exports = router;
