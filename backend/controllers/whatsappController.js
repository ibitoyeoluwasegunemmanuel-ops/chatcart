const db = require("../db");
const { logActivity } = require("../utils/activity");

function detectIntent(message = "") {
  const text = String(message).toLowerCase();
  if (/(track|status|where).*(order)/.test(text)) return "track_order";
  if (/(buy|order|purchase|want).*/.test(text)) return "place_order";
  if (/(price|cost|amount|have|available|show).*/.test(text)) return "product_search";
  return "support";
}

function searchVendorProducts(vendorId, message) {
  const words = String(message || "")
    .toLowerCase()
    .split(/\s+/)
    .filter((item) => item.length > 2)
    .slice(0, 6);

  const rows = db
    .prepare(
      `SELECT id, name, description, price, currency, images, stock_quantity AS stockQuantity
       FROM products
       WHERE vendor_id = ?
       ORDER BY id DESC
       LIMIT 100`
    )
    .all(vendorId);

  if (!words.length) return rows.slice(0, 5);

  const matched = rows.filter((item) => {
    const blob = `${item.name} ${item.description}`.toLowerCase();
    return words.some((word) => blob.includes(word));
  });

  return matched.slice(0, 5);
}

function formatProductsReply(products) {
  if (!products.length) {
    return "I could not find matching products right now. Please share the product name or category you need.";
  }

  const lines = products.map((item) => {
    const imageList = JSON.parse(item.images || "[]");
    const image = imageList[0] ? ` | image: ${imageList[0]}` : "";
    return `${item.name} - ${item.currency} ${Number(item.price).toFixed(2)}${image}`;
  });

  return `Here are available products:\n${lines.join("\n")}\nReply with 'order <product name> <qty>' to place an order.`;
}

function buildSupportReply() {
  return "I can help with product search, order placement, payment proof, and order tracking. Tell me what you need.";
}

function createGuestCustomer(vendorId, customerPhone) {
  const existing = db
    .prepare("SELECT id FROM users WHERE email = ? LIMIT 1")
    .get(`guest-${vendorId}-${customerPhone}@chatcart.local`);

  if (existing) {
    return existing.id;
  }

  const result = db
    .prepare(
      `INSERT INTO users (name, email, password, role, subscription_plan)
       VALUES (?, ?, ?, 'content_creator', 'creator_starter')`
    )
    .run(
      `Guest ${customerPhone}`,
      `guest-${vendorId}-${customerPhone}@chatcart.local`,
      "guest-account"
    );

  return result.lastInsertRowid;
}

function tryCreateOrderFromMessage(vendorId, customerPhone, message) {
  const orderRegex = /order\s+(.+?)\s+(\d+)$/i;
  const found = String(message || "").match(orderRegex);
  if (!found) return null;

  const productHint = found[1].trim().toLowerCase();
  const quantity = Number(found[2]);

  if (!quantity || quantity <= 0) {
    return { error: "Quantity must be greater than 0." };
  }

  const products = db
    .prepare(
      `SELECT id, name, vendor_id AS vendorId, price, currency
       FROM products
       WHERE vendor_id = ?
       ORDER BY id DESC`
    )
    .all(vendorId);

  const product = products.find((item) => item.name.toLowerCase().includes(productHint));
  if (!product) {
    return { error: "Product not found for the order request." };
  }

  const customerId = createGuestCustomer(vendorId, customerPhone);
  const totalAmount = Number((product.price * quantity).toFixed(2));

  const inserted = db
    .prepare(
      `INSERT INTO orders (product_id, vendor_id, customer_id, quantity, total_amount, currency, status)
       VALUES (?, ?, ?, ?, ?, ?, 'Pending')`
    )
    .run(product.id, vendorId, customerId, quantity, totalAmount, product.currency || "NGN");

  return {
    orderId: inserted.lastInsertRowid,
    productName: product.name,
    quantity,
    totalAmount,
    currency: product.currency || "NGN"
  };
}

function receiveCustomerMessage(req, res) {
  const { vendorId, customerPhone, customerName, message } = req.body;

  if (!vendorId || !customerPhone || !message) {
    return res.status(400).json({
      message: "vendorId, customerPhone, and message are required."
    });
  }

  const vendor = db
    .prepare("SELECT id, role FROM users WHERE id = ?")
    .get(Number(vendorId));

  if (!vendor || vendor.role !== "vendor") {
    return res.status(404).json({ message: "Vendor not found." });
  }

  const intent = detectIntent(message);
  const autoOrder = tryCreateOrderFromMessage(vendor.id, customerPhone, message);

  let aiResponse;
  if (autoOrder?.orderId) {
    aiResponse = `Order placed successfully. Order #${autoOrder.orderId} for ${autoOrder.productName} x${autoOrder.quantity}. Total: ${autoOrder.currency} ${autoOrder.totalAmount.toFixed(2)}. Please upload payment proof to continue processing.`;
  } else if (autoOrder?.error) {
    aiResponse = autoOrder.error;
  } else if (intent === "product_search") {
    const products = searchVendorProducts(vendor.id, message);
    aiResponse = formatProductsReply(products);
  } else if (intent === "track_order") {
    aiResponse = "Please share your order number (e.g., #123). I will return the latest status immediately.";
  } else {
    aiResponse = buildSupportReply();
  }

  const created = db
    .prepare(
      `INSERT INTO whatsapp_conversations (vendor_id, customer_name, customer_phone, message, ai_response, intent)
       VALUES (?, ?, ?, ?, ?, ?)`
    )
    .run(vendor.id, customerName || null, customerPhone, message, aiResponse, intent);

  logActivity(vendor.id, "whatsapp_message", "Processed WhatsApp AI message.", {
    conversationId: created.lastInsertRowid,
    customerPhone,
    intent,
    orderId: autoOrder?.orderId || null
  });

  return res.status(201).json({
    conversationId: created.lastInsertRowid,
    intent,
    response: aiResponse,
    order: autoOrder?.orderId ? autoOrder : null
  });
}

function getVendorConversations(req, res) {
  if (req.user.role !== "vendor") {
    return res.status(403).json({ message: "Only vendors can access conversations." });
  }

  const ownerId = req.accountOwnerId || req.user.id;
  const rows = db
    .prepare(
      `SELECT id, customer_name AS customerName, customer_phone AS customerPhone,
              message, ai_response AS aiResponse, intent, created_at AS createdAt
       FROM whatsapp_conversations
       WHERE vendor_id = ?
       ORDER BY id DESC
       LIMIT 100`
    )
    .all(ownerId);

  return res.json(rows);
}

function trackOrderStatus(req, res) {
  const orderId = Number(req.params.orderId);
  if (!orderId) {
    return res.status(400).json({ message: "Invalid order id." });
  }

  const order = db
    .prepare(
      `SELECT id, status, updated_at AS updatedAt, total_amount AS totalAmount, currency
       FROM orders
       WHERE id = ?`
    )
    .get(orderId);

  if (!order) {
    return res.status(404).json({ message: "Order not found." });
  }

  return res.json(order);
}

module.exports = {
  receiveCustomerMessage,
  getVendorConversations,
  trackOrderStatus
};
