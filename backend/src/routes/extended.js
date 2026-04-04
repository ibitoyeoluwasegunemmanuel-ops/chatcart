const express = require('express')
const axios   = require('axios')

// ── ADVANCED SEARCH ROUTE ─────────────────────────────────────────────────────
const searchRouter = express.Router()
const { Product, Vendor } = require('../models')

// GET /api/search?q=ankara&cat=Fashion&minPrice=5000&maxPrice=50000&rating=4&vendor=slug&sort=popular&page=1
searchRouter.get('/', async (req, res) => {
  try {
    const { q, cat, minPrice, maxPrice, rating, vendor: vendorSlug, sort = 'popular', page = 1, limit = 24 } = req.query
    const query = { isActive: true, isApproved: true }

    // Full-text search
    if (q) query.$text = { $search: q }

    // Filters
    if (cat)      query.category = { $in: Array.isArray(cat) ? cat : [cat] }
    if (rating)   query.rating   = { $gte: +rating }
    if (minPrice || maxPrice) {
      query.price = {}
      if (minPrice) query.price.$gte = +minPrice
      if (maxPrice) query.price.$lte = +maxPrice
    }
    if (vendorSlug) {
      const v = await Vendor.findOne({ slug: vendorSlug })
      if (v) query.vendor = v._id
    }

    const sortMap = {
      popular:    { salesCount: -1 },
      rating:     { rating: -1, reviewCount: -1 },
      newest:     { createdAt: -1 },
      'price-asc': { price: 1 },
      'price-desc':{ price: -1 },
      relevance:  q ? { score: { $meta: 'textScore' } } : { salesCount: -1 },
    }
    const sortBy    = sortMap[sort] || sortMap.popular
    const skip      = (+page - 1) * +limit
    const [products, total] = await Promise.all([
      Product.find(query, q ? { score: { $meta: 'textScore' } } : {}).sort(sortBy).skip(skip).limit(+limit).populate('vendor', 'storeName slug rating'),
      Product.countDocuments(query)
    ])

    // Facets for filter sidebar
    const [catFacets, priceFacets] = await Promise.all([
      Product.aggregate([{ $match: { isActive:true, isApproved:true } }, { $group: { _id:'$category', count:{ $sum:1 } } }, { $sort:{ count:-1 } }]),
      Product.aggregate([{ $match: { isActive:true, isApproved:true } }, { $group: { _id:null, min:{ $min:'$price' }, max:{ $max:'$price' } } }]),
    ])

    res.json({ success: true, products, total, page: +page, pages: Math.ceil(total / +limit), facets: { categories: catFacets, priceRange: priceFacets[0] || { min:0, max:500000 } } })
  } catch (err) {
    res.status(500).json({ success: false, message: err.message })
  }
})

// GET /api/search/suggest?q=ankara — instant autocomplete
searchRouter.get('/suggest', async (req, res) => {
  try {
    const { q } = req.query
    if (!q || q.length < 2) return res.json({ success: true, suggestions: [] })
    const products = await Product.find({ isActive:true, isApproved:true, $text:{ $search:q } }, { score:{ $meta:'textScore' } }).sort({ score:{ $meta:'textScore' } }).limit(8).select('name category price')
    res.json({ success: true, suggestions: products })
  } catch (err) {
    res.status(500).json({ success: false, message: err.message })
  }
})

// ── SHIPPING ZONES ROUTE ──────────────────────────────────────────────────────
const shippingRouter = express.Router()
const { ShippingZone } = require('../models/extended')
const { auth, requireRole } = require('../middleware/auth')

// GET /api/shipping/calculate — calculate shipping cost for an order
shippingRouter.post('/calculate', async (req, res) => {
  try {
    const { vendorId, state, country = 'Nigeria', totalAmount, weight } = req.body
    const zones = await ShippingZone.find({ vendor: vendorId, isActive: true })

    // Find matching zone
    let zone = zones.find(z => z.states?.includes(state) || z.countries?.includes(country))
    if (!zone) zone = zones.find(z => !z.states?.length && !z.countries?.length) // default zone

    if (!zone) return res.json({ success: true, cost: 1500, carrier: 'Standard', estimatedDays: '3-5 days' })

    let cost = 0
    if (zone.type === 'free' || (zone.freeAbove && totalAmount >= zone.freeAbove)) cost = 0
    else if (zone.type === 'flat') cost = zone.flatRate
    else if (zone.type === 'weight' && weight) cost = (weight * zone.perKgRate) || zone.flatRate

    res.json({ success: true, cost, carrier: zone.carrier, estimatedDays: zone.estimatedDays })
  } catch (err) {
    res.status(500).json({ success: false, message: err.message })
  }
})

shippingRouter.get('/vendor', auth, requireRole('vendor'), async (req, res) => {
  try {
    const { Vendor } = require('../models')
    const vendor = await Vendor.findOne({ user: req.user._id })
    const zones  = await ShippingZone.find({ vendor: vendor._id })
    res.json({ success: true, zones })
  } catch (err) { res.status(500).json({ success: false, message: err.message }) }
})

shippingRouter.post('/vendor', auth, requireRole('vendor'), async (req, res) => {
  try {
    const { Vendor } = require('../models')
    const vendor = await Vendor.findOne({ user: req.user._id })
    const zone   = await ShippingZone.create({ ...req.body, vendor: vendor._id })
    res.status(201).json({ success: true, zone })
  } catch (err) { res.status(500).json({ success: false, message: err.message }) }
})

shippingRouter.put('/vendor/:id', auth, requireRole('vendor'), async (req, res) => {
  try {
    const zone = await ShippingZone.findByIdAndUpdate(req.params.id, req.body, { new: true })
    res.json({ success: true, zone })
  } catch (err) { res.status(500).json({ success: false, message: err.message }) }
})

shippingRouter.delete('/vendor/:id', auth, requireRole('vendor'), async (req, res) => {
  try {
    await ShippingZone.findByIdAndDelete(req.params.id)
    res.json({ success: true })
  } catch (err) { res.status(500).json({ success: false, message: err.message }) }
})

// ── INVENTORY / VARIANTS ROUTE ────────────────────────────────────────────────
const inventoryRouter = express.Router()
const { ProductVariant, InventoryLog } = require('../models/extended')

inventoryRouter.get('/:productId/variants', async (req, res) => {
  try {
    const variants = await ProductVariant.find({ product: req.params.productId })
    res.json({ success: true, variants })
  } catch (err) { res.status(500).json({ success: false, message: err.message }) }
})

inventoryRouter.post('/:productId/variants', auth, requireRole('vendor'), async (req, res) => {
  try {
    const variant = await ProductVariant.create({ product: req.params.productId, ...req.body })
    res.status(201).json({ success: true, variant })
  } catch (err) { res.status(500).json({ success: false, message: err.message }) }
})

inventoryRouter.put('/variants/:id', auth, requireRole('vendor'), async (req, res) => {
  try {
    const variant = await ProductVariant.findByIdAndUpdate(req.params.id, req.body, { new: true })
    res.json({ success: true, variant })
  } catch (err) { res.status(500).json({ success: false, message: err.message }) }
})

inventoryRouter.get('/:productId/log', auth, requireRole('vendor','admin'), async (req, res) => {
  try {
    const log = await InventoryLog.find({ product: req.params.productId }).sort({ createdAt: -1 }).limit(50)
    res.json({ success: true, log })
  } catch (err) { res.status(500).json({ success: false, message: err.message }) }
})

inventoryRouter.post('/:productId/adjust', auth, requireRole('vendor'), async (req, res) => {
  try {
    const { Product } = require('../models')
    const { change, reason, note } = req.body
    const { Vendor } = require('../models')
    const vendor  = await Vendor.findOne({ user: req.user._id })
    const product = await Product.findByIdAndUpdate(req.params.productId, { $inc: { stock: change } }, { new: true })
    await InventoryLog.create({ product: product._id, vendor: vendor._id, change, reason, note, stockAfter: product.stock })
    res.json({ success: true, product })
  } catch (err) { res.status(500).json({ success: false, message: err.message }) }
})

// ── AFFILIATE ROUTE ────────────────────────────────────────────────────────────
const affiliateRouter = express.Router()
const automation = require('../jobs/automation')

affiliateRouter.post('/join', auth, async (req, res) => {
  try {
    const existing = await automation.getAffiliateStats(req.user._id)
    if (existing) return res.json({ success: true, affiliate: existing })
    const aff = await automation.createAffiliate(req.user._id, 5)
    res.status(201).json({ success: true, affiliate: aff })
  } catch (err) { res.status(500).json({ success: false, message: err.message }) }
})

affiliateRouter.get('/stats', auth, async (req, res) => {
  try {
    const stats = await automation.getAffiliateStats(req.user._id)
    res.json({ success: true, stats })
  } catch (err) { res.status(500).json({ success: false, message: err.message }) }
})

affiliateRouter.post('/click/:code', async (req, res) => {
  try {
    const aff = await automation.trackClick(req.params.code, req.ip, req.headers['user-agent'])
    res.json({ success: !!aff })
  } catch (err) { res.status(500).json({ success: false, message: err.message }) }
})

// ── SUBSCRIPTION ROUTE ────────────────────────────────────────────────────────
const subscriptionRouter = express.Router()
const { Subscription } = require('../models/extended')

subscriptionRouter.post('/', auth, async (req, res) => {
  try {
    const sub = await Subscription.create({ customer: req.user._id, ...req.body, nextDate: new Date(Date.now() + (req.body.frequency === 'weekly' ? 7 : req.body.frequency === 'biweekly' ? 14 : 30) * 86400000) })
    res.status(201).json({ success: true, subscription: sub })
  } catch (err) { res.status(500).json({ success: false, message: err.message }) }
})

subscriptionRouter.get('/mine', auth, async (req, res) => {
  try {
    const subs = await Subscription.find({ customer: req.user._id, status: { $ne: 'cancelled' } }).populate('product', 'name price images').populate('vendor', 'storeName')
    res.json({ success: true, subscriptions: subs })
  } catch (err) { res.status(500).json({ success: false, message: err.message }) }
})

subscriptionRouter.put('/:id/pause', auth, async (req, res) => {
  try {
    const sub = await Subscription.findByIdAndUpdate(req.params.id, { status: 'paused' }, { new: true })
    res.json({ success: true, subscription: sub })
  } catch (err) { res.status(500).json({ success: false, message: err.message }) }
})

subscriptionRouter.put('/:id/cancel', auth, async (req, res) => {
  try {
    const sub = await Subscription.findByIdAndUpdate(req.params.id, { status: 'cancelled' }, { new: true })
    res.json({ success: true, subscription: sub })
  } catch (err) { res.status(500).json({ success: false, message: err.message }) }
})

// ── LOYALTY ROUTE ─────────────────────────────────────────────────────────────
const loyaltyRouter = express.Router()

loyaltyRouter.get('/mine', auth, async (req, res) => {
  try {
    const loyalty = await automation.getLoyalty(req.user._id)
    res.json({ success: true, loyalty })
  } catch (err) { res.status(500).json({ success: false, message: err.message }) }
})

loyaltyRouter.post('/redeem', auth, async (req, res) => {
  try {
    const result = await automation.redeemPoints(req.user._id, req.body.points)
    res.json({ success: true, ...result })
  } catch (err) { res.status(400).json({ success: false, message: err.message }) }
})

// ── STOREFRONT CUSTOMISER ─────────────────────────────────────────────────────
const storefrontRouter = express.Router()
const { Storefront } = require('../models/extended')

storefrontRouter.get('/:slug', async (req, res) => {
  try {
    const vendor = await require('../models').Vendor.findOne({ slug: req.params.slug })
    if (!vendor) return res.status(404).json({ success: false, message: 'Store not found' })
    const sf = await Storefront.findOne({ vendor: vendor._id }) || {}
    res.json({ success: true, storefront: sf, vendor })
  } catch (err) { res.status(500).json({ success: false, message: err.message }) }
})

storefrontRouter.put('/', auth, requireRole('vendor'), async (req, res) => {
  try {
    const vendor = await require('../models').Vendor.findOne({ user: req.user._id })
    const sf = await Storefront.findOneAndUpdate({ vendor: vendor._id }, { ...req.body, vendor: vendor._id }, { upsert: true, new: true })
    res.json({ success: true, storefront: sf })
  } catch (err) { res.status(500).json({ success: false, message: err.message }) }
})

// ── MULTI-CURRENCY ─────────────────────────────────────────────────────────────
const currencyRouter = express.Router()
const { CurrencyRate } = require('../models/extended')

currencyRouter.get('/rates', async (req, res) => {
  try {
    let rates = await CurrencyRate.findOne()
    // Refresh if older than 1 hour
    if (!rates || Date.now() - rates.updatedAt > 3600000) {
      try {
        const { data } = await axios.get('https://api.exchangerate-api.com/v4/latest/NGN')
        rates = await CurrencyRate.findOneAndUpdate({}, { rates: data.rates, updatedAt: new Date() }, { upsert: true, new: true })
      } catch (e) {
        if (!rates) rates = { rates: { USD: 0.00065, GBP: 0.00052, EUR: 0.00060, GHS: 0.0079, KES: 0.083 } }
      }
    }
    res.json({ success: true, base: 'NGN', rates: rates.rates })
  } catch (err) { res.status(500).json({ success: false, message: err.message }) }
})

// ── GOOGLE SHOPPING FEED ──────────────────────────────────────────────────────
const feedRouter = express.Router()

feedRouter.get('/google/:vendorSlug.xml', async (req, res) => {
  try {
    const vendor   = await require('../models').Vendor.findOne({ slug: req.params.vendorSlug })
    if (!vendor) return res.status(404).send('Feed not found')
    const products = await require('../models').Product.find({ vendor: vendor._id, isActive: true, isApproved: true }).limit(500)

    const items = products.map(p => `
    <item>
      <g:id>${p._id}</g:id>
      <title>${p.name}</title>
      <description>${(p.description || '').replace(/[<>&'"]/g, ' ')}</description>
      <link>${process.env.FRONTEND_URL}/product/${p._id}</link>
      <g:image_link>${p.images?.[0] || ''}</g:image_link>
      <g:price>${p.price} NGN</g:price>
      <g:availability>${p.stock > 0 ? 'in stock' : 'out of stock'}</g:availability>
      <g:condition>new</g:condition>
      <g:brand>${vendor.storeName}</g:brand>
      <g:google_product_category>${p.category}</g:google_product_category>
    </item>`).join('')

    res.set('Content-Type', 'application/xml')
    res.send(`<?xml version="1.0" encoding="UTF-8"?>
<rss version="2.0" xmlns:g="http://base.google.com/ns/1.0">
  <channel>
    <title>${vendor.storeName} on ChatCart</title>
    <link>${process.env.FRONTEND_URL}/store/${vendor.slug}</link>
    <description>${vendor.description || 'Shop from ' + vendor.storeName}</description>
    ${items}
  </channel>
</rss>`)
  } catch (err) { res.status(500).send('Feed error') }
})

// ── APPOINTMENTS ──────────────────────────────────────────────────────────────
const appointmentRouter = express.Router()
const { Appointment } = require('../models/extended')

appointmentRouter.post('/', auth, async (req, res) => {
  try {
    const appt = await Appointment.create({ customer: req.user._id, ...req.body })
    res.status(201).json({ success: true, appointment: appt })
  } catch (err) { res.status(500).json({ success: false, message: err.message }) }
})

appointmentRouter.get('/mine', auth, async (req, res) => {
  try {
    const appts = await Appointment.find({ customer: req.user._id }).sort({ date: 1 }).populate('vendor', 'storeName')
    res.json({ success: true, appointments: appts })
  } catch (err) { res.status(500).json({ success: false, message: err.message }) }
})

appointmentRouter.get('/vendor', auth, requireRole('vendor'), async (req, res) => {
  try {
    const { Vendor } = require('../models')
    const vendor = await Vendor.findOne({ user: req.user._id })
    const appts  = await Appointment.find({ vendor: vendor._id }).sort({ date: 1 }).populate('customer', 'name email phone')
    res.json({ success: true, appointments: appts })
  } catch (err) { res.status(500).json({ success: false, message: err.message }) }
})

appointmentRouter.put('/:id/confirm', auth, requireRole('vendor'), async (req, res) => {
  try {
    const appt = await Appointment.findByIdAndUpdate(req.params.id, { status: 'confirmed' }, { new: true })
    res.json({ success: true, appointment: appt })
  } catch (err) { res.status(500).json({ success: false, message: err.message }) }
})

// ── AI PRICING ENGINE ─────────────────────────────────────────────────────────
const aiPricingRouter = express.Router()

aiPricingRouter.post('/suggest', auth, requireRole('vendor'), async (req, res) => {
  try {
    const { productName, category, currentPrice, cost } = req.body
    const { Product } = require('../models')

    // Get competitor prices in same category
    const comps = await Product.find({ category, isApproved: true, isActive: true }).sort({ salesCount: -1 }).limit(10).select('name price salesCount rating')

    const avgPrice  = comps.reduce((s, p) => s + p.price, 0) / (comps.length || 1)
    const maxPrice  = Math.max(...comps.map(p => p.price))
    const minPrice  = Math.min(...comps.map(p => p.price))
    const topSeller = comps.sort((a, b) => b.salesCount - a.salesCount)[0]

    const response = await fetch('https://api.anthropic.com/v1/messages', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', 'anthropic-version': '2023-06-01', 'x-api-key': process.env.ANTHROPIC_API_KEY },
      body: JSON.stringify({
        model: 'claude-sonnet-4-20250514',
        max_tokens: 400,
        messages: [{ role: 'user', content: 'You are a Nigerian e-commerce pricing expert. For a vendor selling "' + productName + '" in the ' + category + ' category at ₦' + currentPrice + ', with cost of ₦' + (cost || 0) + ', and competitors ranging from ₦' + minPrice + ' to ₦' + maxPrice + ' (avg ₦' + Math.round(avgPrice) + '), suggest an optimal price. Consider the Nigerian market, vendor margins (aim for 40%+), and competitive positioning. Respond as JSON: {"suggestedPrice": number, "reasoning": string, "minViable": number, "premium": number}' }]
      })
    })
    const data  = await response.json()
    const text  = data.content?.[0]?.text || ''
    const json  = JSON.parse(text.match(/\{[\s\S]*\}/)?.[0] || '{}')

    res.json({ success: true, suggestion: json, marketData: { avgPrice: Math.round(avgPrice), minPrice, maxPrice, topSellerPrice: topSeller?.price, competitorCount: comps.length } })
  } catch (err) {
    res.status(500).json({ success: false, message: err.message })
  }
})

module.exports = {
  searchRouter, shippingRouter, inventoryRouter,
  affiliateRouter, subscriptionRouter, loyaltyRouter,
  storefrontRouter, currencyRouter, feedRouter,
  appointmentRouter, aiPricingRouter,
}
