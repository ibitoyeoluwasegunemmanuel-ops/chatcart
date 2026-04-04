const { AbandonedCart, Loyalty, Affiliate, AffiliateClick, Order } = require('../models/extended')
const email = require('../services/email')

// ── ABANDONED CART RECOVERY ───────────────────────────────────────────────────
// Run this every 15 minutes via setInterval or cron
const processAbandonedCarts = async () => {
  const now       = Date.now()
  const oneHour   = 60 * 60 * 1000
  const twentyFour = 24 * oneHour

  // 1-hour reminder
  const hour1 = await AbandonedCart.find({
    reminder1Sent: false,
    recovered:     false,
    lastSeen:      { $lt: new Date(now - oneHour), $gt: new Date(now - oneHour - 15 * 60000) }
  }).populate('customer', 'name email')

  for (const cart of hour1) {
    const emailAddr = cart.email || cart.customer?.email
    if (emailAddr) {
      await email.send(emailAddr, 'abandoned_cart', { name: cart.customer?.name, items: cart.items, total: cart.total, cartId: cart._id })
    }
    // Also send WhatsApp via vendor's bot if phone available
    cart.reminder1Sent = true
    await cart.save()
  }

  // 24-hour reminder
  const hour24 = await AbandonedCart.find({
    reminder1Sent: true,
    reminder2Sent: false,
    recovered:     false,
    lastSeen:      { $lt: new Date(now - twentyFour), $gt: new Date(now - twentyFour - 15 * 60000) }
  }).populate('customer', 'name email')

  for (const cart of hour24) {
    const emailAddr = cart.email || cart.customer?.email
    if (emailAddr) {
      await email.send(emailAddr, 'abandoned_cart', { name: cart.customer?.name, items: cart.items, total: cart.total, cartId: cart._id })
    }
    cart.reminder2Sent = true
    await cart.save()
  }

  const recovered = hour1.length + hour24.length
  if (recovered > 0) console.log('Cart recovery: sent ' + recovered + ' reminders')
}

// ── LOYALTY POINTS ─────────────────────────────────────────────────────────────
const POINTS_PER_NAIRA   = 0.01    // 1 point per ₦100 spent
const POINTS_TO_NAIRA    = 0.5     // 1 point = ₦0.50 discount
const TIER_THRESHOLDS    = { silver: 500, gold: 2000, platinum: 10000 }

const awardPoints = async (customerId, orderId, orderAmount) => {
  const earned = Math.floor(orderAmount * POINTS_PER_NAIRA)
  if (earned <= 0) return

  let loyalty = await Loyalty.findOne({ customer: customerId })
  if (!loyalty) loyalty = await Loyalty.create({ customer: customerId })

  loyalty.points   += earned
  loyalty.lifetime += earned

  // Upgrade tier
  if (loyalty.lifetime >= TIER_THRESHOLDS.platinum) loyalty.tier = 'platinum'
  else if (loyalty.lifetime >= TIER_THRESHOLDS.gold)   loyalty.tier = 'gold'
  else if (loyalty.lifetime >= TIER_THRESHOLDS.silver) loyalty.tier = 'silver'

  loyalty.history.push({ points: earned, action: 'earned_purchase', ref: orderId })
  await loyalty.save()
  return { earned, total: loyalty.points, tier: loyalty.tier }
}

const redeemPoints = async (customerId, points) => {
  const loyalty = await Loyalty.findOne({ customer: customerId })
  if (!loyalty || loyalty.points < points) throw new Error('Insufficient points')
  const discount = Math.floor(points * POINTS_TO_NAIRA)
  loyalty.points -= points
  loyalty.history.push({ points: -points, action: 'redeemed' })
  await loyalty.save()
  return { discount, remaining: loyalty.points }
}

const getLoyalty = async (customerId) => {
  return Loyalty.findOne({ customer: customerId }) || { points: 0, tier: 'bronze', lifetime: 0 }
}

// ── AFFILIATE TRACKING ────────────────────────────────────────────────────────
const trackClick = async (affiliateCode, ip, userAgent) => {
  const aff = await Affiliate.findOne({ code: affiliateCode, status: 'active' })
  if (!aff) return null
  await AffiliateClick.create({ affiliate: aff._id, ip, userAgent })
  await Affiliate.findByIdAndUpdate(aff._id, { $inc: { clicks: 1 } })
  return aff
}

const recordConversion = async (affiliateCode, orderId, orderAmount) => {
  const aff = await Affiliate.findOne({ code: affiliateCode, status: 'active' })
  if (!aff) return

  const commission = Math.floor(orderAmount * aff.commissionPct / 100)
  await Affiliate.findByIdAndUpdate(aff._id, {
    $inc: { conversions: 1, totalEarned: commission, pendingPayout: commission }
  })
  await AffiliateClick.findOneAndUpdate(
    { affiliate: aff._id, converted: false },
    { converted: true, orderId, commission }
  )
  return commission
}

const getAffiliateStats = async (userId) => {
  return Affiliate.findOne({ user: userId })
}

const createAffiliate = async (userId, commissionPct = 5) => {
  const code = 'CC' + Math.random().toString(36).slice(2, 8).toUpperCase()
  return Affiliate.create({ user: userId, code, commissionPct })
}

// ── START BACKGROUND JOBS ─────────────────────────────────────────────────────
const startJobs = () => {
  // Cart recovery — every 15 min
  setInterval(processAbandonedCarts, 15 * 60 * 1000)
  console.log('Background jobs started: cart recovery (15min interval)')
}

module.exports = {
  processAbandonedCarts,
  awardPoints, redeemPoints, getLoyalty,
  trackClick, recordConversion, getAffiliateStats, createAffiliate,
  startJobs,
  POINTS_TO_NAIRA,
}
