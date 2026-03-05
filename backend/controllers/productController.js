const db = require("../db");
const { logActivity } = require("../utils/activity");
const { getPlanLimits, isLimitReached } = require("../utils/subscriptions");

const SUPPORTED_CURRENCIES = ["NGN", "USD", "GBP", "EUR"];

function parseImages(images) {
  if (!images) {
    return [];
  }

  if (Array.isArray(images)) {
    return images.slice(0, 6);
  }

  try {
    const parsed = JSON.parse(images);
    return Array.isArray(parsed) ? parsed.slice(0, 6) : [];
  } catch (_error) {
    return [];
  }
}

function normalizeProduct(product) {
  return {
    ...product,
    images: parseImages(product.images)
  };
}

function createProduct(req, res) {
  if (req.user.role !== "vendor") {
    return res.status(403).json({ message: "Only vendors can upload products." });
  }

  const ownerId = req.accountOwnerId || req.user.id;

  const { name, description, price, currency = "NGN", stockQuantity = 0, images = [] } = req.body;

  const userPlan = db
    .prepare("SELECT subscription_plan AS subscriptionPlan FROM users WHERE id = ?")
    .get(ownerId);

  const planLimits = getPlanLimits(userPlan?.subscriptionPlan);
  const productsRow = db
    .prepare("SELECT COUNT(*) AS totalProducts FROM products WHERE vendor_id = ?")
    .get(ownerId);

  if (isLimitReached(planLimits.maxProducts, productsRow?.totalProducts || 0)) {
    return res.status(403).json({
      message: `Product limit reached for ${userPlan?.subscriptionPlan || "vendor_starter"}. Upgrade your plan to add more products.`
    });
  }

  if (!name || !description || price === undefined) {
    return res.status(400).json({ message: "name, description and price are required." });
  }

  const numericPrice = Number(price);
  if (Number.isNaN(numericPrice) || numericPrice <= 0) {
    return res.status(400).json({ message: "price must be a positive number." });
  }

  if (!SUPPORTED_CURRENCIES.includes(currency)) {
    return res.status(400).json({ message: "Unsupported currency." });
  }

  const normalizedStock = Number(stockQuantity || 0);
  if (Number.isNaN(normalizedStock) || normalizedStock < 0) {
    return res.status(400).json({ message: "stockQuantity must be 0 or more." });
  }

  const imageList = parseImages(images);

  const result = db
    .prepare(
      `INSERT INTO products (vendor_id, name, description, price, currency, images, stock_quantity)
       VALUES (?, ?, ?, ?, ?, ?, ?)`
    )
    .run(ownerId, name, description, numericPrice, currency, JSON.stringify(imageList), normalizedStock);

  const product = db
    .prepare(
      `SELECT p.id, p.name, p.description, p.price, p.currency, p.images,
              p.stock_quantity AS stockQuantity,
              p.vendor_id AS vendorId, u.name AS vendorName,
              p.updated_at AS updatedAt,
              p.created_at AS createdAt
       FROM products p
       JOIN users u ON u.id = p.vendor_id
       WHERE p.id = ?`
    )
    .get(result.lastInsertRowid);

  logActivity(req.user.id, "product_created", `Created product ${name}.`, {
    productId: product.id
  });

  return res.status(201).json(normalizeProduct(product));
}

function listProducts(_req, res) {
  const products = db
    .prepare(
      `SELECT p.id, p.name, p.description, p.price, p.currency, p.images,
              p.stock_quantity AS stockQuantity,
              p.vendor_id AS vendorId, u.name AS vendorName,
              p.updated_at AS updatedAt,
              p.created_at AS createdAt
       FROM products p
       JOIN users u ON u.id = p.vendor_id
       ORDER BY p.id DESC`
    )
    .all();

  return res.json(products.map(normalizeProduct));
}

function listVendorProducts(req, res) {
  if (req.user.role !== "vendor") {
    return res.status(403).json({ message: "Only vendors can access this endpoint." });
  }

  const ownerId = req.accountOwnerId || req.user.id;

  const products = db
    .prepare(
            `SELECT p.id, p.name, p.description, p.price, p.currency, p.images,
              p.stock_quantity AS stockQuantity,
              p.vendor_id AS vendorId, u.name AS vendorName,
              p.updated_at AS updatedAt,
              p.created_at AS createdAt
       FROM products p
       JOIN users u ON u.id = p.vendor_id
       WHERE p.vendor_id = ?
       ORDER BY p.id DESC`
    )
    .all(ownerId);

  return res.json(products.map(normalizeProduct));
}

function updateProduct(req, res) {
  if (req.user.role !== "vendor") {
    return res.status(403).json({ message: "Only vendors can update products." });
  }

  const ownerId = req.accountOwnerId || req.user.id;

  const productId = Number(req.params.id);
  const existingProduct = db
    .prepare("SELECT id, vendor_id AS vendorId FROM products WHERE id = ?")
    .get(productId);

  if (!existingProduct || existingProduct.vendorId !== ownerId) {
    return res.status(404).json({ message: "Product not found." });
  }

  const { name, description, price, currency, stockQuantity, images } = req.body;
  const updates = [];
  const values = [];

  if (name !== undefined) {
    updates.push("name = ?");
    values.push(name);
  }

  if (description !== undefined) {
    updates.push("description = ?");
    values.push(description);
  }

  if (price !== undefined) {
    const numericPrice = Number(price);
    if (Number.isNaN(numericPrice) || numericPrice <= 0) {
      return res.status(400).json({ message: "price must be a positive number." });
    }
    updates.push("price = ?");
    values.push(numericPrice);
  }

  if (currency !== undefined) {
    if (!SUPPORTED_CURRENCIES.includes(currency)) {
      return res.status(400).json({ message: "Unsupported currency." });
    }
    updates.push("currency = ?");
    values.push(currency);
  }

  if (stockQuantity !== undefined) {
    const normalizedStock = Number(stockQuantity);
    if (Number.isNaN(normalizedStock) || normalizedStock < 0) {
      return res.status(400).json({ message: "stockQuantity must be 0 or more." });
    }
    updates.push("stock_quantity = ?");
    values.push(normalizedStock);
  }

  if (images !== undefined) {
    updates.push("images = ?");
    values.push(JSON.stringify(parseImages(images)));
  }

  if (!updates.length) {
    return res.status(400).json({ message: "No updatable fields provided." });
  }

  updates.push("updated_at = CURRENT_TIMESTAMP");
  values.push(productId, ownerId);

  db.prepare(
    `UPDATE products
     SET ${updates.join(", ")}
     WHERE id = ? AND vendor_id = ?`
  ).run(...values);

  const updatedProduct = db
    .prepare(
      `SELECT p.id, p.name, p.description, p.price, p.currency, p.images,
              p.stock_quantity AS stockQuantity,
              p.vendor_id AS vendorId, u.name AS vendorName,
              p.updated_at AS updatedAt,
              p.created_at AS createdAt
       FROM products p
       JOIN users u ON u.id = p.vendor_id
       WHERE p.id = ?`
    )
    .get(productId);

  logActivity(req.user.id, "product_updated", `Updated product #${productId}.`, {
    productId
  });

  return res.json(normalizeProduct(updatedProduct));
}

function deleteProduct(req, res) {
  if (req.user.role !== "vendor") {
    return res.status(403).json({ message: "Only vendors can delete products." });
  }

  const ownerId = req.accountOwnerId || req.user.id;

  const productId = Number(req.params.id);
  const result = db
    .prepare("DELETE FROM products WHERE id = ? AND vendor_id = ?")
    .run(productId, ownerId);

  if (!result.changes) {
    return res.status(404).json({ message: "Product not found." });
  }

  logActivity(req.user.id, "product_deleted", `Deleted product #${productId}.`, {
    productId
  });

  return res.json({ message: "Product deleted." });
}

module.exports = {
  createProduct,
  listProducts,
  listVendorProducts,
  updateProduct,
  deleteProduct
};
