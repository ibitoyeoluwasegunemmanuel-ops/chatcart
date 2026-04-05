require('dotenv').config()
const express   = require('express')
const mongoose  = require('mongoose')
const cors      = require('cors')
const helmet    = require('helmet')
const morgan    = require('morgan')
const rateLimit = require('express-rate-limit')

const app  = express()
const PORT = process.env.PORT || 5000

// ── MIDDLEWARE ────────────────────────────────────────────────────────────────
app.use(helmet({ contentSecurityPolicy: false }))
app.use(cors({
  origin: [
    process.env.FRONTEND_URL || 'http://localhost:3000',
    'https://chatcart.vercel.app',
    /\.vercel\.app$/,
    /\.railway\.app$/,
  ],
  credentials: true,
}))
app.use(morgan('combined'))
app.use(express.json({ limit: '10mb' }))
app.use(express.urlencoded({ extended: true }))
app.use('/api/auth', rateLimit({ windowMs: 15*60*1000, max: 30 }))
app.use('/api/', rateLimit({ windowMs: 15*60*1000, max: 500 }))

// ── HEALTH (always works, even before DB connects) ───────────────────────────
app.get('/health', (req, res) => {
  res.json({ ok: true, db: mongoose.connection.readyState === 1 ? 'connected' : 'connecting', uptime: process.uptime() })
})

app.get('/', (req, res) => {
  res.json({ name: 'ChatCart API', version: '2.0.0', status: 'running' })
})

// ── ROUTES ────────────────────────────────────────────────────────────────────
try {
  const authRoutes      = require('./routes/auth')
  const productRoutes   = require('./routes/products')
  const orderRoutes     = require('./routes/orders')
  const paymentRoutes   = require('./routes/payments')
  const vendorRoutes    = require('./routes/vendors')
  const discountRoutes  = require('./routes/discounts')
  const reviewRoutes    = require('./routes/reviews')
  const adminRoutes     = require('./routes/admin')
  const notifRoutes     = require('./routes/notifications')
  const whatsappRoutes  = require('./routes/whatsapp')
  const { searchRouter, shippingRouter, inventoryRouter, affiliateRouter,
    subscriptionRouter, loyaltyRouter, storefrontRouter, currencyRouter,
    feedRouter, appointmentRouter, aiPricingRouter } = require('./routes/extended')

  app.use('/api/auth',          authRoutes)
  app.use('/api/products',      productRoutes)
  app.use('/api/orders',        orderRoutes)
  app.use('/api/payments',      paymentRoutes)
  app.use('/api/vendors',       vendorRoutes)
  app.use('/api/discounts',     discountRoutes)
  app.use('/api/reviews',       reviewRoutes)
  app.use('/api/admin',         adminRoutes)
  app.use('/api/notifications', notifRoutes)
  app.use('/api/whatsapp',      whatsappRoutes)
  app.use('/api/search',        searchRouter)
  app.use('/api/shipping',      shippingRouter)
  app.use('/api/inventory',     inventoryRouter)
  app.use('/api/affiliate',     affiliateRouter)
  app.use('/api/subscriptions', subscriptionRouter)
  app.use('/api/loyalty',       loyaltyRouter)
  app.use('/api/storefront',    storefrontRouter)
  app.use('/api/currency',      currencyRouter)
  app.use('/api/feed',          feedRouter)
  app.use('/api/appointments',  appointmentRouter)
  app.use('/api/ai-pricing',    aiPricingRouter)

  app.post('/webhook/flutterwave',
    express.raw({ type: 'application/json' }),
    require('./routes/payments').handleWebhook
  )
  console.log('All routes loaded OK')
} catch (err) {
  console.error('Route load error:', err.message)
}

// ── ERROR HANDLERS ────────────────────────────────────────────────────────────
app.use((err, req, res, next) => {
  console.error(err.stack)
  res.status(err.statusCode || 500).json({ success: false, message: err.message })
})
app.use((req, res) => res.status(404).json({ success: false, message: 'Route not found' }))

// ── START HTTP SERVER FIRST (so Railway healthcheck passes) ──────────────────
app.listen(PORT, '0.0.0.0', () => {
  console.log('ChatCart API running on port ' + PORT)
  
  // Then connect to MongoDB
  const MONGODB_URI = process.env.MONGODB_URI
  if (!MONGODB_URI) {
    console.error('WARNING: MONGODB_URI not set - add it in Railway Variables')
    return
  }

  mongoose.connect(MONGODB_URI, { serverSelectionTimeoutMS: 10000 })
    .then(() => {
      console.log('MongoDB connected successfully')
      try {
        const { startJobs } = require('./jobs/automation')
        startJobs()
      } catch(e) { console.log('Jobs warning:', e.message) }
    })
    .catch(err => {
      console.error('MongoDB connection failed:', err.message)
      console.error('Check: 1) MONGODB_URI env var is set  2) Atlas Network Access allows 0.0.0.0/0')
    })
})

module.exports = app
