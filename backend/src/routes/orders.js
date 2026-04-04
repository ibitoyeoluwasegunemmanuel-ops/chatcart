const router = require('express').Router()
const { Order, Product, Vendor, Notif, Discount } = require('../models')
const { auth, requireRole } = require('../middleware/auth')
const upload = require('../config/multer')
const cloudinary = require('../config/cloudinary')

// POST /api/orders — customer places order
router.post('/', auth, async (req, res) => {
  try {
    const { items, paymentMethod, deliveryName, deliveryPhone, deliveryEmail, deliveryAddress, deliveryCity, deliveryState, discountCode } = req.body

    if (!items || !items.length)
      return res.status(400).json({ success: false, message: 'No items in order' })

    // Validate products and calculate totals
    let subtotal = 0
    const orderItems = []
    let vendorId = null

    for (const item of items) {
      const product = await Product.findById(item.productId).populate('vendor')
      if (!product) return res.status(404).json({ success: false, message: 'Product ' + item.productId + ' not found' })
      if (product.stock < item.qty) return res.status(400).json({ success: false, message: product.name + ' has insufficient stock' })

      vendorId = product.vendor._id
      subtotal += product.price * item.qty
      orderItems.push({ product: product._id, name: product.name, price: product.price, qty: item.qty, image: product.images?.[0], vendor: vendorId })

      // Deduct stock
      await Product.findByIdAndUpdate(product._id, { $inc: { stock: -item.qty, salesCount: item.qty } })
    }

    // Apply discount
    let discount = 0
    if (discountCode) {
      const dc = await Discount.findOne({ code: discountCode.toUpperCase(), isActive: true, vendor: vendorId })
      if (dc && dc.usedCount < dc.maxUses && subtotal >= dc.minOrder) {
        discount = dc.type === 'percent' ? Math.round(subtotal * dc.value / 100) : dc.value
        await Discount.findByIdAndUpdate(dc._id, { $inc: { usedCount: 1 } })
      }
    }

    const delivery = 1500
    const total = subtotal - discount + delivery

    const order = await Order.create({
      customer: req.user._id, vendor: vendorId,
      items: orderItems, subtotal, delivery, discount, total,
      paymentMethod, status: 'pending', paymentStatus: 'unpaid',
      deliveryName, deliveryPhone, deliveryEmail, deliveryAddress, deliveryCity, deliveryState,
      discountCode,
      trackingId: 'CC' + Math.floor(Math.random() * 90000 + 10000),
    })

    // Notify vendor
    const vendor = await Vendor.findById(vendorId).populate('user')
    await Notif.create({ recipient: vendor.user._id, type: 'order', title: 'New Order!', body: 'New order ' + order.orderId + ' — ₦' + total.toLocaleString(), link: '/vendor/orders' })

    res.status(201).json({ success: true, order })
  } catch (err) {
    res.status(500).json({ success: false, message: err.message })
  }
})

// GET /api/orders/customer/mine
router.get('/customer/mine', auth, async (req, res) => {
  try {
    const orders = await Order.find({ customer: req.user._id }).sort({ createdAt: -1 }).populate('vendor', 'storeName')
    res.json({ success: true, orders })
  } catch (err) {
    res.status(500).json({ success: false, message: err.message })
  }
})

// GET /api/orders/vendor/mine
router.get('/vendor/mine', auth, requireRole('vendor'), async (req, res) => {
  try {
    const vendor = await Vendor.findOne({ user: req.user._id })
    const orders = await Order.find({ vendor: vendor._id }).sort({ createdAt: -1 }).populate('customer', 'name email phone')
    res.json({ success: true, orders })
  } catch (err) {
    res.status(500).json({ success: false, message: err.message })
  }
})

// GET /api/orders/:id
router.get('/:id', auth, async (req, res) => {
  try {
    const order = await Order.findById(req.params.id).populate('customer', 'name email phone').populate('vendor', 'storeName bankName bankAccount bankHolder')
    if (!order) return res.status(404).json({ success: false, message: 'Order not found' })
    res.json({ success: true, order })
  } catch (err) {
    res.status(500).json({ success: false, message: err.message })
  }
})

// PUT /api/orders/:id/status — vendor updates order status
router.put('/:id/status', auth, requireRole('vendor', 'admin'), async (req, res) => {
  try {
    const { status } = req.body
    const order = await Order.findByIdAndUpdate(req.params.id, { status }, { new: true })
    // Notify customer
    await Notif.create({ recipient: order.customer, type: 'order_update', title: 'Order ' + order.orderId + ' — ' + status, body: 'Your order status has been updated.' })
    res.json({ success: true, order })
  } catch (err) {
    res.status(500).json({ success: false, message: err.message })
  }
})

// POST /api/orders/:id/proof — customer uploads payment proof
router.post('/:id/proof', auth, upload.single('proof'), async (req, res) => {
  try {
    const result = await cloudinary.uploader.upload(req.file.path, { folder: 'chatcart/proofs' })
    const order  = await Order.findByIdAndUpdate(
      req.params.id,
      { paymentProof: result.secure_url, status: 'payment_uploaded', paymentStatus: 'pending' },
      { new: true }
    )
    // Notify vendor
    const vendor = await Vendor.findById(order.vendor).populate('user')
    await Notif.create({ recipient: vendor.user._id, type: 'payment', title: 'Payment Proof Uploaded', body: 'Customer uploaded payment proof for ' + order.orderId })
    res.json({ success: true, order })
  } catch (err) {
    res.status(500).json({ success: false, message: err.message })
  }
})

// PUT /api/orders/:id/confirm — vendor confirms payment
router.put('/:id/confirm', auth, requireRole('vendor', 'admin'), async (req, res) => {
  try {
    const order = await Order.findByIdAndUpdate(req.params.id, { status: 'payment_confirmed', paymentStatus: 'paid' }, { new: true })
    // Update vendor revenue
    await Vendor.findByIdAndUpdate(order.vendor, { $inc: { totalRevenue: order.total, totalSales: 1 } })
    await Notif.create({ recipient: order.customer, type: 'payment', title: 'Payment Confirmed!', body: 'Your payment for order ' + order.orderId + ' has been confirmed.' })
    res.json({ success: true, order })
  } catch (err) {
    res.status(500).json({ success: false, message: err.message })
  }
})

module.exports = router
