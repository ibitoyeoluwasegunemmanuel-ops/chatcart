const router = require('express').Router()
const { User, Vendor, Product, Order, Payment, Settings, Notif } = require('../models')
const { auth, requireRole } = require('../middleware/auth')

const adminOnly = [auth, requireRole('admin', 'staff')]

// GET /api/admin/overview
router.get('/overview', ...adminOnly, async (req, res) => {
  try {
    const [totalVendors, totalUsers, totalProducts, totalOrders, pendingVendors, pendingProducts, payments] = await Promise.all([
      Vendor.countDocuments(),
      User.countDocuments({ role: 'customer' }),
      Product.countDocuments(),
      Order.countDocuments(),
      Vendor.countDocuments({ status: 'pending' }),
      Product.countDocuments({ isApproved: false }),
      Payment.find({ type: 'order_payment', status: 'completed' }),
    ])

    const totalRevenue      = payments.reduce((s, p) => s + p.amount, 0)
    const platformRevenue   = totalRevenue * 0.05
    const recentOrders      = await Order.find().sort({ createdAt: -1 }).limit(10).populate('customer', 'name').populate('vendor', 'storeName')
    const topVendors        = await Vendor.find({ status: 'active' }).sort({ totalRevenue: -1 }).limit(5).populate('user', 'name email')

    res.json({ success: true, data: { totalVendors, totalUsers, totalProducts, totalOrders, totalRevenue, platformRevenue, pendingVendors, pendingProducts, recentOrders, topVendors } })
  } catch (err) {
    res.status(500).json({ success: false, message: err.message })
  }
})

// GET /api/admin/vendors
router.get('/vendors', ...adminOnly, async (req, res) => {
  try {
    const { status, page = 1, limit = 20 } = req.query
    const q = status ? { status } : {}
    const vendors = await Vendor.find(q).sort({ createdAt: -1 }).skip((page-1)*limit).limit(+limit).populate('user', 'name email phone plan createdAt')
    const total   = await Vendor.countDocuments(q)
    res.json({ success: true, vendors, total })
  } catch (err) {
    res.status(500).json({ success: false, message: err.message })
  }
})

router.put('/vendors/:id/approve', ...adminOnly, async (req, res) => {
  try {
    const vendor = await Vendor.findByIdAndUpdate(req.params.id, { status: 'active' }, { new: true }).populate('user')
    await Notif.create({ recipient: vendor.user._id, type: 'vendor', title: 'Store Approved!', body: 'Your ChatCart store is now live. Start adding products!' })
    res.json({ success: true, vendor, message: 'Vendor approved' })
  } catch (err) {
    res.status(500).json({ success: false, message: err.message })
  }
})

router.put('/vendors/:id/suspend', ...adminOnly, async (req, res) => {
  try {
    const { reason } = req.body
    const vendor = await Vendor.findByIdAndUpdate(req.params.id, { status: 'suspended' }, { new: true }).populate('user')
    await User.findByIdAndUpdate(vendor.user._id, { isSuspended: true })
    await Notif.create({ recipient: vendor.user._id, type: 'vendor', title: 'Store Suspended', body: reason || 'Your store has been suspended. Contact support.' })
    res.json({ success: true, message: 'Vendor suspended' })
  } catch (err) {
    res.status(500).json({ success: false, message: err.message })
  }
})

// GET /api/admin/users
router.get('/users', ...adminOnly, async (req, res) => {
  try {
    const { role, page = 1, limit = 20 } = req.query
    const q = role ? { role } : {}
    const users = await User.find(q).sort({ createdAt: -1 }).skip((page-1)*limit).limit(+limit)
    const total = await User.countDocuments(q)
    res.json({ success: true, users, total })
  } catch (err) {
    res.status(500).json({ success: false, message: err.message })
  }
})

router.put('/users/:id/suspend', ...adminOnly, async (req, res) => {
  try {
    await User.findByIdAndUpdate(req.params.id, { isSuspended: true })
    res.json({ success: true, message: 'User suspended' })
  } catch (err) {
    res.status(500).json({ success: false, message: err.message })
  }
})

// GET /api/admin/products
router.get('/products', ...adminOnly, async (req, res) => {
  try {
    const { approved, flagged, page = 1, limit = 20 } = req.query
    const q = {}
    if (approved !== undefined) q.isApproved = approved === 'true'
    if (flagged  !== undefined) q.isFlagged  = flagged  === 'true'
    const products = await Product.find(q).sort({ createdAt: -1 }).skip((page-1)*limit).limit(+limit).populate('vendor', 'storeName')
    const total    = await Product.countDocuments(q)
    res.json({ success: true, products, total })
  } catch (err) {
    res.status(500).json({ success: false, message: err.message })
  }
})

router.put('/products/:id/approve', ...adminOnly, async (req, res) => {
  try {
    const product = await Product.findByIdAndUpdate(req.params.id, { isApproved: true, isFlagged: false }, { new: true }).populate('vendor')
    await Notif.create({ recipient: product.vendor.user, type: 'product', title: 'Product Approved!', body: '"' + product.name + '" is now live on the marketplace.' })
    res.json({ success: true, product })
  } catch (err) {
    res.status(500).json({ success: false, message: err.message })
  }
})

router.delete('/products/:id', ...adminOnly, async (req, res) => {
  try {
    await Product.findByIdAndDelete(req.params.id)
    res.json({ success: true, message: 'Product removed' })
  } catch (err) {
    res.status(500).json({ success: false, message: err.message })
  }
})

// GET /api/admin/payments
router.get('/payments', ...adminOnly, async (req, res) => {
  try {
    const payments = await Payment.find().sort({ createdAt: -1 }).limit(50).populate('vendor', 'storeName').populate('order', 'orderId total')
    res.json({ success: true, payments })
  } catch (err) {
    res.status(500).json({ success: false, message: err.message })
  }
})

router.put('/payouts/:id/process', ...adminOnly, async (req, res) => {
  try {
    const payment = await Payment.findByIdAndUpdate(req.params.id, { status: 'completed' }, { new: true })
    res.json({ success: true, payment, message: 'Payout processed' })
  } catch (err) {
    res.status(500).json({ success: false, message: err.message })
  }
})

// GET/PUT /api/admin/settings
router.get('/settings', ...adminOnly, async (req, res) => {
  try {
    const settings = await Settings.find()
    const result = {}
    settings.forEach(s => { result[s.key] = s.value })
    res.json({ success: true, settings: result })
  } catch (err) {
    res.status(500).json({ success: false, message: err.message })
  }
})

router.put('/settings', auth, requireRole('admin'), async (req, res) => {
  try {
    for (const [key, value] of Object.entries(req.body)) {
      await Settings.findOneAndUpdate({ key }, { value }, { upsert: true, new: true })
    }
    res.json({ success: true, message: 'Settings saved' })
  } catch (err) {
    res.status(500).json({ success: false, message: err.message })
  }
})

// GET /api/admin/analytics
router.get('/analytics', ...adminOnly, async (req, res) => {
  try {
    const sixMonthsAgo = new Date()
    sixMonthsAgo.setMonth(sixMonthsAgo.getMonth() - 6)

    const monthlyOrders = await Order.aggregate([
      { $match: { createdAt: { $gte: sixMonthsAgo }, paymentStatus: 'paid' } },
      { $group: { _id: { year: { $year: '$createdAt' }, month: { $month: '$createdAt' } }, revenue: { $sum: '$total' }, count: { $sum: 1 } } },
      { $sort: { '_id.year': 1, '_id.month': 1 } }
    ])

    const categoryBreakdown = await Product.aggregate([
      { $group: { _id: '$category', count: { $sum: 1 } } },
      { $sort: { count: -1 } }
    ])

    const totalRevenue = await Payment.aggregate([
      { $match: { type: 'order_payment', status: 'completed' } },
      { $group: { _id: null, total: { $sum: '$amount' } } }
    ])

    res.json({ success: true, data: { monthlyOrders, categoryBreakdown, totalRevenue: totalRevenue[0]?.total || 0 } })
  } catch (err) {
    res.status(500).json({ success: false, message: err.message })
  }
})

module.exports = router
