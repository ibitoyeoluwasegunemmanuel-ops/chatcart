const jwt     = require('jsonwebtoken')
const { User } = require('../models')

const auth = async (req, res, next) => {
  try {
    const header = req.headers.authorization
    if (!header || !header.startsWith('Bearer '))
      return res.status(401).json({ success: false, message: 'No token provided' })

    const token   = header.split(' ')[1]
    const decoded = jwt.verify(token, process.env.JWT_SECRET)
    const user    = await User.findById(decoded.id).select('-password')

    if (!user)       return res.status(401).json({ success: false, message: 'User not found' })
    if (user.isSuspended) return res.status(403).json({ success: false, message: 'Account suspended' })

    req.user = user
    next()
  } catch (err) {
    res.status(401).json({ success: false, message: 'Invalid token' })
  }
}

const requireRole = (...roles) => (req, res, next) => {
  if (!roles.includes(req.user?.role))
    return res.status(403).json({ success: false, message: 'Access denied' })
  next()
}

const optionalAuth = async (req, res, next) => {
  try {
    const header = req.headers.authorization
    if (header?.startsWith('Bearer ')) {
      const token   = header.split(' ')[1]
      const decoded = jwt.verify(token, process.env.JWT_SECRET)
      req.user = await User.findById(decoded.id).select('-password')
    }
  } catch (_) {}
  next()
}

module.exports = { auth, requireRole, optionalAuth }
