const router  = require('express').Router()
const { Product, Vendor } = require('../models')
const { auth, requireRole, optionalAuth } = require('../middleware/auth')
const cloudinary = require('../config/cloudinary')
const upload     = require('../config/multer')

// GET /api/products  — public marketplace listing
router.get('/', optionalAuth, async (req, res) => {
  try {
    const { search, category, vendor, minPrice, maxPrice, sort, page = 1, limit = 20 } = req.query
    const q = { isActive: true, isApproved: true }

    if (search) q.$text = { $search: search }
    if (category) q.category = category
    if (vendor)   q.vendor = vendor
    if (minPrice || maxPrice) q.price = {}
    if (minPrice) q.price.$gte = +minPrice
    if (maxPrice) q.price.$lte = +maxPrice

    const sortMap = { popular: { salesCount: -1 }, rating: { rating: -1 }, 'price-asc': { price: 1 }, 'price-desc': { price: -1 }, newest: { createdAt: -1 } }
    const sortBy  = sortMap[sort] || { createdAt: -1 }

    const skip  = (+page - 1) * +limit
    const total = await Product.countDocuments(q)
    const products = await Product.find(q).sort(sortBy).skip(skip).limit(+limit).populate('vendor', 'storeName slug')

    res.json({ success: true, products, total, page: +page, pages: Math.ceil(total / +limit) })
  } catch (err) {
    res.status(500).json({ success: false, message: err.message })
  }
})

// GET /api/products/vendor/mine — vendor's own products
router.get('/vendor/mine', auth, requireRole('vendor'), async (req, res) => {
  try {
    const vendor   = await Vendor.findOne({ user: req.user._id })
    if (!vendor) return res.status(404).json({ success: false, message: 'Vendor profile not found' })
    const products = await Product.find({ vendor: vendor._id }).sort({ createdAt: -1 })
    res.json({ success: true, products })
  } catch (err) {
    res.status(500).json({ success: false, message: err.message })
  }
})

// GET /api/products/:id
router.get('/:id', optionalAuth, async (req, res) => {
  try {
    const product = await Product.findById(req.params.id).populate('vendor', 'storeName slug whatsapp rating')
    if (!product) return res.status(404).json({ success: false, message: 'Product not found' })
    res.json({ success: true, product })
  } catch (err) {
    res.status(500).json({ success: false, message: err.message })
  }
})

// POST /api/products — vendor creates product
router.post('/', auth, requireRole('vendor'), async (req, res) => {
  try {
    const vendor = await Vendor.findOne({ user: req.user._id })
    if (!vendor) return res.status(404).json({ success: false, message: 'Vendor profile not found' })

    // Plan limits
    const planLimits = { free: 5, starter: 50, pro: Infinity, business: Infinity }
    const count = await Product.countDocuments({ vendor: vendor._id, isActive: true })
    if (count >= (planLimits[req.user.plan] || 5))
      return res.status(403).json({ success: false, message: 'Product limit reached for your plan. Upgrade to add more.' })

    const product = await Product.create({ ...req.body, vendor: vendor._id, isApproved: false })
    res.status(201).json({ success: true, product, message: 'Product created. Pending admin approval.' })
  } catch (err) {
    res.status(500).json({ success: false, message: err.message })
  }
})

// PUT /api/products/:id
router.put('/:id', auth, requireRole('vendor', 'admin'), async (req, res) => {
  try {
    const product = await Product.findById(req.params.id)
    if (!product) return res.status(404).json({ success: false, message: 'Product not found' })

    // Vendor can only update own products
    if (req.user.role === 'vendor') {
      const vendor = await Vendor.findOne({ user: req.user._id })
      if (!product.vendor.equals(vendor._id))
        return res.status(403).json({ success: false, message: 'Not authorized' })
    }

    const updated = await Product.findByIdAndUpdate(req.params.id, req.body, { new: true })
    res.json({ success: true, product: updated })
  } catch (err) {
    res.status(500).json({ success: false, message: err.message })
  }
})

// DELETE /api/products/:id
router.delete('/:id', auth, requireRole('vendor', 'admin'), async (req, res) => {
  try {
    const product = await Product.findById(req.params.id)
    if (!product) return res.status(404).json({ success: false, message: 'Product not found' })

    if (req.user.role === 'vendor') {
      const vendor = await Vendor.findOne({ user: req.user._id })
      if (!product.vendor.equals(vendor._id))
        return res.status(403).json({ success: false, message: 'Not authorized' })
    }
    await product.deleteOne()
    res.json({ success: true, message: 'Product deleted' })
  } catch (err) {
    res.status(500).json({ success: false, message: err.message })
  }
})

// POST /api/products/:id/image — upload product image
router.post('/:id/image', auth, requireRole('vendor'), upload.single('image'), async (req, res) => {
  try {
    const result  = await cloudinary.uploader.upload(req.file.path, { folder: 'chatcart/products' })
    const product = await Product.findByIdAndUpdate(
      req.params.id,
      { $push: { images: result.secure_url } },
      { new: true }
    )
    res.json({ success: true, imageUrl: result.secure_url, product })
  } catch (err) {
    res.status(500).json({ success: false, message: err.message })
  }
})

module.exports = router
