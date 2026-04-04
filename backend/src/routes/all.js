// ── VENDORS ───────────────────────────────────────────────────────────────────
const vendorRouter = require('express').Router()
const { Vendor, Product, Order, User } = require('../models')
const { auth, requireRole, optionalAuth } = require('../middleware/auth')

vendorRouter.get('/', async (req, res) => {
  try {
    const vendors = await Vendor.find({ status: 'active' }).sort({ totalRevenue: -1 }).limit(20).populate('user', 'name')
    res.json({ success: true, vendors })
  } catch (err) { res.status(500).json({ success: false, message: err.message }) }
})

vendorRouter.get('/:slug', optionalAuth, async (req, res) => {
  try {
    const vendor   = await Vendor.findOne({ slug: req.params.slug }).populate('user', 'name')
    if (!vendor) return res.status(404).json({ success: false, message: 'Store not found' })
    const products = await Product.find({ vendor: vendor._id, isActive: true, isApproved: true })
    res.json({ success: true, vendor, products })
  } catch (err) { res.status(500).json({ success: false, message: err.message }) }
})

vendorRouter.put('/profile', auth, requireRole('vendor'), async (req, res) => {
  try {
    const vendor = await Vendor.findOneAndUpdate({ user: req.user._id }, req.body, { new: true })
    res.json({ success: true, vendor })
  } catch (err) { res.status(500).json({ success: false, message: err.message }) }
})

vendorRouter.get('/analytics', auth, requireRole('vendor'), async (req, res) => {
  try {
    const vendor = await Vendor.findOne({ user: req.user._id })
    const orders = await Order.find({ vendor: vendor._id, paymentStatus: 'paid' })
    const revenue = orders.reduce((s, o) => s + o.total, 0)
    const monthlyData = {}
    orders.forEach(o => {
      const key = o.createdAt.toISOString().slice(0, 7)
      if (!monthlyData[key]) monthlyData[key] = { revenue: 0, orders: 0 }
      monthlyData[key].revenue += o.total
      monthlyData[key].orders++
    })
    res.json({ success: true, data: { revenue, totalOrders: orders.length, monthlyData, vendor } })
  } catch (err) { res.status(500).json({ success: false, message: err.message }) }
})

vendorRouter.get('/customers', auth, requireRole('vendor'), async (req, res) => {
  try {
    const vendor = await Vendor.findOne({ user: req.user._id })
    const orders = await Order.find({ vendor: vendor._id }).populate('customer', 'name email phone createdAt')
    const custMap = {}
    orders.forEach(o => {
      const id = o.customer._id.toString()
      if (!custMap[id]) custMap[id] = { ...o.customer.toObject(), orders: 0, spent: 0 }
      custMap[id].orders++
      custMap[id].spent += o.total
    })
    res.json({ success: true, customers: Object.values(custMap) })
  } catch (err) { res.status(500).json({ success: false, message: err.message }) }
})

// ── DISCOUNTS ─────────────────────────────────────────────────────────────────
const discountRouter = require('express').Router()
const { Discount } = require('../models')

discountRouter.get('/', auth, requireRole('vendor'), async (req, res) => {
  try {
    const vendor    = await Vendor.findOne({ user: req.user._id })
    const discounts = await Discount.find({ vendor: vendor._id }).sort({ createdAt: -1 })
    res.json({ success: true, discounts })
  } catch (err) { res.status(500).json({ success: false, message: err.message }) }
})

discountRouter.post('/', auth, requireRole('vendor'), async (req, res) => {
  try {
    const vendor   = await Vendor.findOne({ user: req.user._id })
    const discount = await Discount.create({ ...req.body, vendor: vendor._id })
    res.status(201).json({ success: true, discount })
  } catch (err) { res.status(500).json({ success: false, message: err.message }) }
})

discountRouter.put('/:id', auth, requireRole('vendor'), async (req, res) => {
  try {
    const discount = await Discount.findByIdAndUpdate(req.params.id, req.body, { new: true })
    res.json({ success: true, discount })
  } catch (err) { res.status(500).json({ success: false, message: err.message }) }
})

discountRouter.delete('/:id', auth, requireRole('vendor'), async (req, res) => {
  try {
    await Discount.findByIdAndDelete(req.params.id)
    res.json({ success: true, message: 'Deleted' })
  } catch (err) { res.status(500).json({ success: false, message: err.message }) }
})

discountRouter.post('/validate', async (req, res) => {
  try {
    const { code, vendorId, orderAmount } = req.body
    const discount = await Discount.findOne({ code: code.toUpperCase(), vendor: vendorId, isActive: true })
    if (!discount) return res.status(404).json({ success: false, message: 'Invalid discount code' })
    if (discount.usedCount >= discount.maxUses) return res.status(400).json({ success: false, message: 'Code has reached maximum uses' })
    if (discount.expires && new Date() > discount.expires) return res.status(400).json({ success: false, message: 'Code has expired' })
    if (orderAmount < discount.minOrder) return res.status(400).json({ success: false, message: 'Minimum order for this code is ₦' + discount.minOrder.toLocaleString() })
    const savings = discount.type === 'percent' ? Math.round(orderAmount * discount.value / 100) : discount.value
    res.json({ success: true, discount, savings })
  } catch (err) { res.status(500).json({ success: false, message: err.message }) }
})

// ── REVIEWS ───────────────────────────────────────────────────────────────────
const reviewRouter = require('express').Router()
const { Review } = require('../models')

reviewRouter.get('/product/:id', async (req, res) => {
  try {
    const reviews = await Review.find({ product: req.params.id }).sort({ createdAt: -1 }).populate('customer', 'name avatar')
    res.json({ success: true, reviews })
  } catch (err) { res.status(500).json({ success: false, message: err.message }) }
})

reviewRouter.post('/', auth, async (req, res) => {
  try {
    const { productId, rating, comment } = req.body
    const product = await Product.findById(productId)
    if (!product) return res.status(404).json({ success: false, message: 'Product not found' })

    const review = await Review.create({ product: productId, customer: req.user._id, vendor: product.vendor, rating, comment })

    // Update product rating
    const reviews  = await Review.find({ product: productId })
    const avgRating = reviews.reduce((s, r) => s + r.rating, 0) / reviews.length
    await Product.findByIdAndUpdate(productId, { rating: Math.round(avgRating * 10) / 10, reviewCount: reviews.length })

    res.status(201).json({ success: true, review })
  } catch (err) { res.status(500).json({ success: false, message: err.message }) }
})

// ── NOTIFICATIONS ─────────────────────────────────────────────────────────────
const notifRouter = require('express').Router()
const { Notif } = require('../models')

notifRouter.get('/', auth, async (req, res) => {
  try {
    const notifs = await Notif.find({ recipient: req.user._id }).sort({ createdAt: -1 }).limit(30)
    res.json({ success: true, notifs })
  } catch (err) { res.status(500).json({ success: false, message: err.message }) }
})

notifRouter.put('/:id/read', auth, async (req, res) => {
  try {
    await Notif.findByIdAndUpdate(req.params.id, { isRead: true })
    res.json({ success: true })
  } catch (err) { res.status(500).json({ success: false, message: err.message }) }
})

notifRouter.put('/read-all', auth, async (req, res) => {
  try {
    await Notif.updateMany({ recipient: req.user._id, isRead: false }, { isRead: true })
    res.json({ success: true })
  } catch (err) { res.status(500).json({ success: false, message: err.message }) }
})

// ── WHATSAPP BOT ──────────────────────────────────────────────────────────────
const waRouter = require('express').Router()
const { Broadcast } = require('../models')

waRouter.get('/settings', auth, requireRole('vendor'), async (req, res) => {
  try {
    const vendor = await Vendor.findOne({ user: req.user._id })
    res.json({ success: true, settings: { botEnabled: vendor.botEnabled, botSettings: vendor.botSettings, welcomeMessage: vendor.welcomeMessage, businessHours: vendor.businessHours, whatsapp: vendor.whatsapp } })
  } catch (err) { res.status(500).json({ success: false, message: err.message }) }
})

waRouter.put('/settings', auth, requireRole('vendor'), async (req, res) => {
  try {
    const vendor = await Vendor.findOneAndUpdate({ user: req.user._id }, { botEnabled: req.body.botEnabled, botSettings: req.body.botSettings, welcomeMessage: req.body.welcomeMessage, businessHours: req.body.businessHours }, { new: true })
    res.json({ success: true, vendor })
  } catch (err) { res.status(500).json({ success: false, message: err.message }) }
})

waRouter.get('/broadcasts', auth, requireRole('vendor'), async (req, res) => {
  try {
    const vendor     = await Vendor.findOne({ user: req.user._id })
    const broadcasts = await Broadcast.find({ vendor: vendor._id }).sort({ createdAt: -1 })
    res.json({ success: true, broadcasts })
  } catch (err) { res.status(500).json({ success: false, message: err.message }) }
})

waRouter.post('/broadcasts', auth, requireRole('vendor'), async (req, res) => {
  try {
    const vendor    = await Vendor.findOne({ user: req.user._id })
    const broadcast = await Broadcast.create({ ...req.body, vendor: vendor._id, reach: 214, status: 'sent' })
    res.status(201).json({ success: true, broadcast })
  } catch (err) { res.status(500).json({ success: false, message: err.message }) }
})

module.exports = { vendorRouter, discountRouter, reviewRouter, notifRouter, waRouter }
