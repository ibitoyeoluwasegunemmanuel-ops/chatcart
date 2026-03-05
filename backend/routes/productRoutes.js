const express = require("express");
const {
  createProduct,
  listProducts,
  updateProduct,
  deleteProduct
} = require("../controllers/productController");
const { authRequired, requirePermission } = require("../middleware/auth");

const router = express.Router();

router.get("/", listProducts);
router.post("/", authRequired, requirePermission("manage_products"), createProduct);
router.patch("/:id", authRequired, requirePermission("manage_products"), updateProduct);
router.delete("/:id", authRequired, requirePermission("manage_products"), deleteProduct);

module.exports = router;
