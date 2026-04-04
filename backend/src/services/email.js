const nodemailer = require('nodemailer')

const transporter = nodemailer.createTransport({
  host:   process.env.EMAIL_HOST || 'smtp.gmail.com',
  port:   +process.env.EMAIL_PORT || 587,
  secure: false,
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS,
  }
})

const FROM = process.env.EMAIL_FROM || 'ChatCart <noreply@chatcart.com>'

// ── BASE TEMPLATE ─────────────────────────────────────────────────────────────
const base = (content) => `
<!DOCTYPE html>
<html>
<head>
<meta charset="utf-8">
<meta name="viewport" content="width=device-width,initial-scale=1">
<style>
  body{margin:0;padding:0;background:#f5f5f0;font-family:'Helvetica Neue',Arial,sans-serif;font-size:14px;color:#1c1409}
  .wrap{max-width:580px;margin:0 auto;padding:32px 16px}
  .card{background:#ffffff;border-radius:12px;overflow:hidden;box-shadow:0 2px 12px rgba(0,0,0,.08)}
  .header{background:#1c1409;padding:28px 32px;text-align:center}
  .logo{color:#faf8f3;font-size:24px;font-weight:800;letter-spacing:-.02em;margin:0}
  .logo span{color:#e85528}
  .body{padding:32px}
  .title{font-size:20px;font-weight:700;margin:0 0 8px}
  .subtitle{color:#7a7268;font-size:13px;margin:0 0 24px}
  .btn{display:inline-block;padding:13px 28px;background:#e85528;color:#ffffff;text-decoration:none;border-radius:8px;font-weight:700;font-size:14px}
  .info-box{background:#faf8f3;border-radius:8px;padding:16px 20px;margin:20px 0}
  .info-row{display:flex;justify-content:space-between;padding:6px 0;border-bottom:1px solid #eee;font-size:13px}
  .info-row:last-child{border:none;font-weight:700}
  .footer{text-align:center;padding:20px;color:#aaa;font-size:11px}
  .status{display:inline-block;padding:4px 12px;border-radius:4px;font-weight:700;font-size:12px}
</style>
</head>
<body>
<div class="wrap">
  <div class="card">
    <div class="header">
      <p class="logo">Chat<span>Cart</span></p>
    </div>
    <div class="body">${content}</div>
  </div>
  <div class="footer">
    © 2025 ChatCart · <a href="https://chatcart.com" style="color:#aaa">chatcart.com</a><br>
    You're receiving this because you have an account on ChatCart.
  </div>
</div>
</body>
</html>`

// ── TEMPLATES ─────────────────────────────────────────────────────────────────
const templates = {

  order_placed: (d) => base(`
    <h2 class="title">Order Confirmed! 🎉</h2>
    <p class="subtitle">Hi ${d.customerName}, your order has been received.</p>
    <div class="info-box">
      <div class="info-row"><span>Order ID</span><span style="font-family:monospace">${d.orderId}</span></div>
      ${d.items.map(i => `<div class="info-row"><span>${i.name} ×${i.qty}</span><span>₦${i.price.toLocaleString()}</span></div>`).join('')}
      <div class="info-row"><span>Delivery</span><span>₦1,500</span></div>
      <div class="info-row"><span>Total</span><span>₦${d.total.toLocaleString()}</span></div>
    </div>
    <p style="color:#7a7268;font-size:13px;margin-bottom:24px">Payment method: <strong>${d.paymentMethod}</strong>${d.paymentMethod === 'Bank Transfer' ? '<br>Please transfer the exact amount to confirm your order.' : ''}</p>
    <a href="${process.env.FRONTEND_URL}/orders" class="btn">Track Your Order →</a>
  `),

  payment_confirmed: (d) => base(`
    <h2 class="title">Payment Confirmed ✅</h2>
    <p class="subtitle">Hi ${d.customerName}, we've received your payment.</p>
    <div class="info-box">
      <div class="info-row"><span>Order</span><span style="font-family:monospace">${d.orderId}</span></div>
      <div class="info-row"><span>Amount Paid</span><span style="color:#1a6b3c;font-weight:700">₦${d.amount.toLocaleString()}</span></div>
      <div class="info-row"><span>Status</span><span><span class="status" style="background:#e8f5ee;color:#1a6b3c">Confirmed</span></span></div>
    </div>
    <p style="color:#7a7268;font-size:13px;margin-bottom:24px">Your order is now being prepared by the vendor.</p>
    <a href="${process.env.FRONTEND_URL}/orders" class="btn">Track Your Order →</a>
  `),

  order_shipped: (d) => base(`
    <h2 class="title">Your Order is On Its Way! 🚚</h2>
    <p class="subtitle">Hi ${d.customerName}, ${d.vendorName} has shipped your order.</p>
    <div class="info-box">
      <div class="info-row"><span>Order</span><span style="font-family:monospace">${d.orderId}</span></div>
      <div class="info-row"><span>Tracking ID</span><span style="font-family:monospace">${d.trackingId}</span></div>
      <div class="info-row"><span>Carrier</span><span>${d.carrier || 'Vendor delivery'}</span></div>
      <div class="info-row"><span>ETA</span><span>${d.eta || '1-3 business days'}</span></div>
    </div>
    <a href="${process.env.FRONTEND_URL}/orders" class="btn">Track Live →</a>
  `),

  order_delivered: (d) => base(`
    <h2 class="title">Order Delivered! 🎁</h2>
    <p class="subtitle">Hi ${d.customerName}, your order has been delivered.</p>
    <div class="info-box">
      <div class="info-row"><span>Order</span><span style="font-family:monospace">${d.orderId}</span></div>
    </div>
    <p style="color:#7a7268;font-size:13px;margin-bottom:24px">Enjoying your purchase? Leave a review to help other shoppers!</p>
    <a href="${process.env.FRONTEND_URL}/product/${d.productId}#reviews" class="btn">Leave a Review ⭐</a>
  `),

  new_order_vendor: (d) => base(`
    <h2 class="title">New Order Received! 🛒</h2>
    <p class="subtitle">Hi ${d.vendorName}, you have a new order.</p>
    <div class="info-box">
      <div class="info-row"><span>Order ID</span><span style="font-family:monospace">${d.orderId}</span></div>
      <div class="info-row"><span>Customer</span><span>${d.customerName}</span></div>
      ${d.items.map(i => `<div class="info-row"><span>${i.name} ×${i.qty}</span><span>₦${i.price.toLocaleString()}</span></div>`).join('')}
      <div class="info-row"><span>Total</span><span>₦${d.total.toLocaleString()}</span></div>
      <div class="info-row"><span>Payment</span><span>${d.paymentMethod}</span></div>
    </div>
    <a href="${process.env.FRONTEND_URL}/vendor/orders" class="btn">View Order →</a>
  `),

  payment_proof_uploaded: (d) => base(`
    <h2 class="title">Payment Proof Uploaded 📎</h2>
    <p class="subtitle">Hi ${d.vendorName}, a customer has uploaded payment proof for order ${d.orderId}.</p>
    <p style="color:#7a7268;font-size:13px;margin-bottom:24px">Please review the proof and confirm payment within 24 hours.</p>
    <a href="${process.env.FRONTEND_URL}/vendor/orders" class="btn">Review Payment →</a>
  `),

  abandoned_cart: (d) => base(`
    <h2 class="title">You left something behind! 🛒</h2>
    <p class="subtitle">Hi ${d.name || 'there'}, you have items waiting in your cart.</p>
    <div class="info-box">
      ${d.items.map(i => `<div class="info-row"><span>${i.name} ×${i.qty}</span><span>₦${i.price.toLocaleString()}</span></div>`).join('')}
      <div class="info-row"><span>Total</span><span>₦${d.total.toLocaleString()}</span></div>
    </div>
    <p style="color:#7a7268;font-size:13px;margin-bottom:24px">These items sell out fast — complete your purchase now!</p>
    <a href="${process.env.FRONTEND_URL}/checkout?recover=${d.cartId}" class="btn">Complete Purchase →</a>
  `),

  welcome: (d) => base(`
    <h2 class="title">Welcome to ChatCart! 🎉</h2>
    <p class="subtitle">Hi ${d.name}, your account has been created successfully.</p>
    <p style="margin-bottom:20px">You can now ${d.role === 'vendor' ? 'set up your store and start selling' : 'browse thousands of African products'}.</p>
    <a href="${process.env.FRONTEND_URL}/${d.role === 'vendor' ? 'vendor' : ''}" class="btn">Get Started →</a>
  `),

  vendor_approved: (d) => base(`
    <h2 class="title">Your Store is Live! 🚀</h2>
    <p class="subtitle">Hi ${d.vendorName}, your ChatCart store has been approved.</p>
    <p style="margin-bottom:20px">Your store is now live at <a href="${process.env.FRONTEND_URL}/store/${d.slug}" style="color:#e85528">${process.env.FRONTEND_URL}/store/${d.slug}</a></p>
    <a href="${process.env.FRONTEND_URL}/vendor/products" class="btn">Add Your First Product →</a>
  `),

  payout_processed: (d) => base(`
    <h2 class="title">Payout Processed! 💸</h2>
    <p class="subtitle">Hi ${d.vendorName}, your payout has been sent.</p>
    <div class="info-box">
      <div class="info-row"><span>Amount</span><span style="color:#1a6b3c;font-weight:700">₦${d.amount.toLocaleString()}</span></div>
      <div class="info-row"><span>Bank</span><span>${d.bankName}</span></div>
      <div class="info-row"><span>Account</span><span style="font-family:monospace">${d.accountNumber}</span></div>
      <div class="info-row"><span>ETA</span><span>1-2 business days</span></div>
    </div>
  `),

  subscription_reminder: (d) => base(`
    <h2 class="title">Your Subscription Renews Tomorrow 🔄</h2>
    <p class="subtitle">Hi ${d.name}, your recurring order is due tomorrow.</p>
    <div class="info-box">
      <div class="info-row"><span>Product</span><span>${d.productName}</span></div>
      <div class="info-row"><span>Qty</span><span>${d.qty}</span></div>
      <div class="info-row"><span>Amount</span><span>₦${d.amount.toLocaleString()}</span></div>
    </div>
    <p style="color:#7a7268;font-size:13px;margin-bottom:24px">You can pause or cancel at any time.</p>
    <a href="${process.env.FRONTEND_URL}/orders?tab=subscriptions" class="btn">Manage Subscription →</a>
  `),
}

// ── SEND FUNCTION ─────────────────────────────────────────────────────────────
const send = async (to, template, data) => {
  try {
    const subjects = {
      order_placed:             'Order Confirmed — ' + data.orderId,
      payment_confirmed:        'Payment Confirmed — ' + data.orderId,
      order_shipped:            'Your order is on its way! — ' + data.orderId,
      order_delivered:          'Order Delivered — ' + data.orderId,
      new_order_vendor:         'New Order — ' + data.orderId,
      payment_proof_uploaded:   'Payment Proof Uploaded — ' + data.orderId,
      abandoned_cart:           'You left something in your cart',
      welcome:                  'Welcome to ChatCart!',
      vendor_approved:          'Your ChatCart store is now live!',
      payout_processed:         'Payout of ₦' + (data.amount || '').toLocaleString() + ' processed',
      subscription_reminder:    'Your subscription renews tomorrow',
    }
    const html = templates[template]?.(data)
    if (!html) throw new Error('Unknown email template: ' + template)
    await transporter.sendMail({ from: FROM, to, subject: subjects[template] || 'ChatCart Notification', html })
    return true
  } catch (err) {
    console.error('Email error:', err.message)
    return false
  }
}

// ── BULK SEND ─────────────────────────────────────────────────────────────────
const sendBulk = async (recipients, template, data) => {
  const results = await Promise.allSettled(recipients.map(r => send(r.email, template, { ...data, ...r })))
  const sent    = results.filter(r => r.status === 'fulfilled' && r.value).length
  console.log('Bulk email: ' + sent + '/' + recipients.length + ' sent')
  return sent
}

module.exports = { send, sendBulk }
