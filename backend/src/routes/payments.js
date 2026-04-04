const router   = require('express').Router()
const axios    = require('axios')
const crypto   = require('crypto')
const { Order, Payment, Vendor, Notif } = require('../models')
const { auth, requireRole } = require('../middleware/auth')

const FLW_SECRET    = process.env.FLUTTERWAVE_SECRET_KEY
const FLW_PUBLIC    = process.env.FLUTTERWAVE_PUBLIC_KEY
const FLW_BASE      = 'https://api.flutterwave.com/v3'
const FLW_HASH      = process.env.FLUTTERWAVE_WEBHOOK_HASH

const flwHeaders = () => ({ Authorization: 'Bearer ' + FLW_SECRET, 'Content-Type': 'application/json' })

// POST /api/payments/initiate — create Flutterwave payment link
router.post('/initiate', auth, async (req, res) => {
  try {
    const { orderId, email, name, phone, amount, currency = 'NGN', redirectUrl } = req.body

    const order = await Order.findById(orderId)
    if (!order) return res.status(404).json({ success: false, message: 'Order not found' })

    const txRef = 'CC-' + Date.now() + '-' + Math.random().toString(36).slice(2, 8).toUpperCase()

    const payload = {
      tx_ref:           txRef,
      amount:           amount || order.total,
      currency,
      redirect_url:     redirectUrl || (process.env.FRONTEND_URL + '/payment/verify'),
      customer: { email: email || order.deliveryEmail, name: name || order.deliveryName, phonenumber: phone || order.deliveryPhone },
      customizations: { title: 'ChatCart Payment', description: 'Payment for order ' + order.orderId, logo: 'https://chatcart.vercel.app/logo.png' },
      meta: { orderId: order._id.toString(), orderRef: order.orderId }
    }

    const { data } = await axios.post(FLW_BASE + '/payments', payload, { headers: flwHeaders() })

    // Save tx ref to order
    await Order.findByIdAndUpdate(orderId, { flwTxRef: txRef, paymentStatus: 'pending' })

    res.json({ success: true, paymentLink: data.data.link, txRef })
  } catch (err) {
    console.error('FLW initiate error:', err.response?.data || err.message)
    res.status(500).json({ success: false, message: 'Payment initiation failed' })
  }
})

// GET /api/payments/verify/:ref — verify after redirect
router.get('/verify/:ref', auth, async (req, res) => {
  try {
    const { ref } = req.params
    const { data } = await axios.get(FLW_BASE + '/transactions/verify_by_reference?tx_ref=' + ref, { headers: flwHeaders() })

    const txData = data.data
    if (txData.status !== 'successful')
      return res.status(400).json({ success: false, message: 'Payment not successful', status: txData.status })

    const order = await Order.findOne({ flwTxRef: ref })
    if (!order) return res.status(404).json({ success: false, message: 'Order not found' })

    // Verify amount matches
    if (txData.amount < order.total)
      return res.status(400).json({ success: false, message: 'Amount mismatch' })

    // Update order
    await Order.findByIdAndUpdate(order._id, {
      paymentStatus: 'paid',
      status: 'payment_confirmed',
      paymentRef: txData.id.toString(),
    })

    // Log payment
    await Payment.create({ vendor: order.vendor, order: order._id, type: 'order_payment', amount: txData.amount, currency: txData.currency, status: 'completed', reference: ref, flwRef: txData.flw_ref, provider: 'flutterwave', meta: txData })

    // Update vendor revenue
    await Vendor.findByIdAndUpdate(order.vendor, { $inc: { totalRevenue: order.total, totalSales: 1 } })

    // Notify
    const vendor = await Vendor.findById(order.vendor).populate('user')
    await Notif.create({ recipient: order.customer, type: 'payment', title: 'Payment Successful!', body: 'Your payment for ' + order.orderId + ' was successful.' })
    await Notif.create({ recipient: vendor.user._id, type: 'payment', title: 'Payment Received!', body: order.orderId + ' paid via Flutterwave — ₦' + order.total.toLocaleString() })

    res.json({ success: true, message: 'Payment verified', order })
  } catch (err) {
    console.error('FLW verify error:', err.response?.data || err.message)
    res.status(500).json({ success: false, message: 'Verification failed' })
  }
})

// POST /webhook/flutterwave — Flutterwave webhook
const handleWebhook = async (req, res) => {
  try {
    const signature = req.headers['verif-hash']
    if (!signature || signature !== FLW_HASH)
      return res.status(401).json({ success: false, message: 'Invalid signature' })

    const event = JSON.parse(req.body)
    if (event.event === 'charge.completed' && event.data.status === 'successful') {
      const ref = event.data.tx_ref
      const order = await Order.findOne({ flwTxRef: ref })
      if (order && order.paymentStatus !== 'paid') {
        await Order.findByIdAndUpdate(order._id, { paymentStatus: 'paid', status: 'payment_confirmed', paymentRef: event.data.id.toString() })
        await Vendor.findByIdAndUpdate(order.vendor, { $inc: { totalRevenue: order.total, totalSales: 1 } })
        console.log('Webhook: order', order.orderId, 'marked paid')
      }
    }
    res.json({ success: true })
  } catch (err) {
    console.error('Webhook error:', err.message)
    res.status(500).json({ success: false })
  }
}

// GET /api/payments/history
router.get('/history', auth, async (req, res) => {
  try {
    const payments = await Payment.find({ vendor: req.user.vendor }).sort({ createdAt: -1 }).limit(50)
    res.json({ success: true, payments })
  } catch (err) {
    res.status(500).json({ success: false, message: err.message })
  }
})

// POST /api/payments/payout — vendor requests payout
router.post('/payout', auth, requireRole('vendor'), async (req, res) => {
  try {
    const { amount, bankCode, accountNumber, accountName } = req.body
    const MIN_PAYOUT = 5000
    if (amount < MIN_PAYOUT) return res.status(400).json({ success: false, message: 'Minimum payout is ₦5,000' })

    // Flutterwave Transfer API
    const payload = {
      account_bank:   bankCode,
      account_number: accountNumber,
      amount,
      currency: 'NGN',
      narration: 'ChatCart vendor payout',
      reference: 'PO-' + Date.now(),
      beneficiary_name: accountName,
    }

    const { data } = await axios.post(FLW_BASE + '/transfers', payload, { headers: flwHeaders() })

    const vendor = await Vendor.findOne({ user: req.user._id })
    await Payment.create({ vendor: vendor._id, type: 'payout', amount, currency: 'NGN', status: 'processing', reference: payload.reference, provider: 'flutterwave', meta: data.data })

    res.json({ success: true, message: 'Payout initiated', data: data.data })
  } catch (err) {
    console.error('Payout error:', err.response?.data || err.message)
    res.status(500).json({ success: false, message: 'Payout failed' })
  }
})

// GET /api/payments/payouts
router.get('/payouts', auth, requireRole('vendor', 'admin'), async (req, res) => {
  try {
    const vendor  = await Vendor.findOne({ user: req.user._id })
    const payouts = await Payment.find({ vendor: vendor._id, type: 'payout' }).sort({ createdAt: -1 })
    res.json({ success: true, payouts })
  } catch (err) {
    res.status(500).json({ success: false, message: err.message })
  }
})

module.exports = router
module.exports.handleWebhook = handleWebhook
