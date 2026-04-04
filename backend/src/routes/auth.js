const router  = require('express').Router()
const jwt     = require('jsonwebtoken')
const { User, Vendor } = require('../models')
const { auth } = require('../middleware/auth')

const signToken = id => jwt.sign({ id }, process.env.JWT_SECRET, { expiresIn: '30d' })

// POST /api/auth/register
router.post('/register', async (req, res) => {
  try {
    const { name, email, password, role, storeName, phone } = req.body

    if (!name || !email || !password)
      return res.status(400).json({ success: false, message: 'Name, email and password are required' })

    const exists = await User.findOne({ email })
    if (exists) return res.status(400).json({ success: false, message: 'Email already registered' })

    const user = await User.create({ name, email, password, role: role || 'customer', phone })

    // Create vendor profile automatically
    if (role === 'vendor') {
      const slug = (storeName || name).toLowerCase().replace(/\s+/g, '-').replace(/[^a-z0-9-]/g, '') + '-' + Date.now().toString().slice(-4)
      await Vendor.create({ user: user._id, storeName: storeName || name + "'s Store", slug })
    }

    const token = signToken(user._id)
    res.status(201).json({ success: true, token, user: { id: user._id, name: user.name, email: user.email, role: user.role, plan: user.plan } })
  } catch (err) {
    res.status(500).json({ success: false, message: err.message })
  }
})

// POST /api/auth/login
router.post('/login', async (req, res) => {
  try {
    const { email, password } = req.body
    if (!email || !password)
      return res.status(400).json({ success: false, message: 'Email and password required' })

    const user = await User.findOne({ email }).select('+password')
    if (!user || !(await user.comparePassword(password)))
      return res.status(401).json({ success: false, message: 'Invalid credentials' })

    if (user.isSuspended)
      return res.status(403).json({ success: false, message: 'Account suspended. Contact support.' })

    const token = signToken(user._id)
    user.password = undefined
    res.json({ success: true, token, user: { id: user._id, name: user.name, email: user.email, role: user.role, plan: user.plan } })
  } catch (err) {
    res.status(500).json({ success: false, message: err.message })
  }
})

// GET /api/auth/me
router.get('/me', auth, async (req, res) => {
  const user = req.user
  let vendor = null
  if (user.role === 'vendor') {
    vendor = await Vendor.findOne({ user: user._id }).select('-botSettings')
  }
  res.json({ success: true, user, vendor })
})

// PUT /api/auth/password
router.put('/password', auth, async (req, res) => {
  try {
    const { currentPassword, newPassword } = req.body
    const user = await User.findById(req.user._id).select('+password')
    if (!(await user.comparePassword(currentPassword)))
      return res.status(400).json({ success: false, message: 'Current password incorrect' })
    user.password = newPassword
    await user.save()
    res.json({ success: true, message: 'Password updated' })
  } catch (err) {
    res.status(500).json({ success: false, message: err.message })
  }
})

// POST /api/auth/logout
router.post('/logout', auth, (req, res) => {
  res.json({ success: true, message: 'Logged out' })
})

module.exports = router
