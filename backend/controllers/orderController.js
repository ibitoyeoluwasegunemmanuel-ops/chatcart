const db = require("../db");
const { logActivity } = require("../utils/activity");

const ALLOWED_ORDER_STATUSES = ["Pending", "Processing", "Shipped", "Delivered", "Cancelled"];

function createOrder(req, res) {
    const ownerId = req.accountOwnerId || req.user.id;
  if (req.user.role !== "content_creator") {
    return res.status(403).json({ message: "Only content creators can place orders." });
  }

  const { productId, quantity } = req.body;
  const product = db
    .prepare("SELECT id, name, vendor_id AS vendorId, price, currency FROM products WHERE id = ?")
    .get(Number(productId));

  if (!product) {
    return res.status(404).json({ message: "Product not found." });
  }

  const orderQuantity = Number(quantity || 1);
  if (Number.isNaN(orderQuantity) || orderQuantity <= 0) {
    return res.status(400).json({ message: "quantity must be a positive number." });
  }

  const totalAmount = Number((product.price * orderQuantity).toFixed(2));

  const result = db
    .prepare(
      `INSERT INTO orders (product_id, vendor_id, customer_id, quantity, total_amount, currency, status)
       VALUES (?, ?, ?, ?, ?, ?, 'Pending')`
    )
    .run(product.id, product.vendorId, ownerId, orderQuantity, totalAmount, product.currency || "NGN");

  const newOrder = db
    .prepare(
      `SELECT o.id, o.product_id AS productId, p.name AS productName,
              o.vendor_id AS vendorId, o.customer_id AS customerId,
              c.name AS customerName, o.quantity, o.total_amount AS totalAmount,
              o.currency, o.status, o.updated_at AS updatedAt, o.created_at AS createdAt
       FROM orders o
       JOIN products p ON p.id = o.product_id
       JOIN users c ON c.id = o.customer_id
       WHERE o.id = ?`
    )
    .get(result.lastInsertRowid);

  logActivity(req.user.id, "order_created", `Placed order #${newOrder.id}.`, {
    orderId: newOrder.id,
    productId: product.id
  });

  return res.status(201).json(newOrder);
}

function listVendorOrders(req, res) {
  if (req.user.role !== "vendor") {
    return res.status(403).json({ message: "Only vendors can access this endpoint." });
  }

  const ownerId = req.accountOwnerId || req.user.id;

  const orders = db
    .prepare(
      `SELECT o.id, o.product_id AS productId, p.name AS productName,
              o.vendor_id AS vendorId, o.customer_id AS customerId,
              c.name AS customerName, o.quantity, o.total_amount AS totalAmount,
              o.currency, o.status, o.updated_at AS updatedAt, o.created_at AS createdAt
       FROM orders o
       JOIN products p ON p.id = o.product_id
       JOIN users c ON c.id = o.customer_id
       WHERE o.vendor_id = ?
       ORDER BY o.id DESC`
    )
    .all(ownerId);

  return res.json(orders);
}

function updateOrderStatus(req, res) {
  if (req.user.role !== "vendor") {
    return res.status(403).json({ message: "Only vendors can update order status." });
  }

  const ownerId = req.accountOwnerId || req.user.id;

  const orderId = Number(req.params.id);
  const { status } = req.body;

  if (!ALLOWED_ORDER_STATUSES.includes(status)) {
    return res.status(400).json({ message: "Invalid order status." });
  }

  const result = db
    .prepare(
      `UPDATE orders
       SET status = ?, updated_at = CURRENT_TIMESTAMP
       WHERE id = ? AND vendor_id = ?`
    )
    .run(status, orderId, ownerId);

  if (!result.changes) {
    return res.status(404).json({ message: "Order not found." });
  }

  const updatedOrder = db
    .prepare(
      `SELECT o.id, o.product_id AS productId, p.name AS productName,
              o.vendor_id AS vendorId, o.customer_id AS customerId,
              c.name AS customerName, o.quantity, o.total_amount AS totalAmount,
              o.currency, o.status, o.updated_at AS updatedAt, o.created_at AS createdAt
       FROM orders o
       JOIN products p ON p.id = o.product_id
       JOIN users c ON c.id = o.customer_id
       WHERE o.id = ?`
    )
    .get(orderId);

  logActivity(req.user.id, "order_status_updated", `Order #${orderId} status changed to ${status}.`, {
    orderId,
    status
  });

  return res.json(updatedOrder);
}

module.exports = {
  createOrder,
  listVendorOrders,
  updateOrderStatus,
  ALLOWED_ORDER_STATUSES
};
