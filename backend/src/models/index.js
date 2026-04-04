const mongoose = require('mongoose')
const bcrypt   = require('bcryptjs')
const { Schema } = mongoose

// ── USER ─────────────────────────────────────────────────────────────────────
const userSchema = new Schema({
  name:         { type: String, required: true, trim: true },
  email:        { type: String, required: true, unique: true, lowercase: true },
  password:     { type: String, required: true, minlength: 6, select: false },
  role:         { type: String, enum: ['customer','vendor','admin','staff'], default: 'customer' },
  phone:        String,
  avatar:       String,
  country:      { type: String, default: 'Nigeria' },
  isVerified:   { type: Boolean, default: false },
  isSuspended:  { type: Boolean, default: false },
  plan:         { type: String, enum: ['free','starter','pro','business'], default: 'free' },
  planExpiry:   Date,
  resetToken:   String,
  resetExpiry:  Date,
}, { timestamps: true })

userSchema.pre('save', async function(next) {
  if (!this.isModified('password')) return next()
  this.password = await bcrypt.hash(this.password, 12)
  next()
})
userSchema.methods.comparePassword = function(plain) {
  return bcrypt.compare(plain, this.password)
}

// ── VENDOR PROFILE ────────────────────────────────────────────────────────────
const vendorSchema = new Schema({
  user:         { type: Schema.Types.ObjectId, ref: 'User', required: true, unique: true },
  storeName:    { type: String, required: true },
  slug:         { type: String, unique: true, lowercase: true },
  description:  String,
  logo:         String,
  banner:       String,
  whatsapp:     String,
  instagram:    String,
  facebook:     String,
  tiktok:       String,
  bankName:     String,
  bankAccount:  String,
  bankHolder:   String,
  status:       { type: String, enum: ['pending','active','suspended'], default: 'pending' },
  totalSales:   { type: Number, default: 0 },
  totalRevenue: { type: Number, default: 0 },
  rating:       { type: Number, default: 0 },
  reviewCount:  { type: Number, default: 0 },
  // WhatsApp bot settings
  botEnabled:     { type: Boolean, default: true },
  botSettings: {
    autoGreet:      { type: Boolean, default: true },
    showProducts:   { type: Boolean, default: true },
    acceptOrders:   { type: Boolean, default: true },
    trackOrders:    { type: Boolean, default: true },
    escalate:       { type: Boolean, default: true },
    cartRecovery:   { type: Boolean, default: false },
    recommendations:{ type: Boolean, default: true },
  },
  welcomeMessage: String,
  businessHours:  String,
}, { timestamps: true })

// ── PRODUCT ───────────────────────────────────────────────────────────────────
const productSchema = new Schema({
  vendor:       { type: Schema.Types.ObjectId, ref: 'Vendor', required: true },
  name:         { type: String, required: true, trim: true },
  description:  String,
  price:        { type: Number, required: true, min: 0 },
  oldPrice:     Number,
  currency:     { type: String, default: 'NGN' },
  stock:        { type: Number, required: true, default: 0 },
  category:     { type: String, required: true },
  images:       [String],
  badge:        String,
  isApproved:   { type: Boolean, default: false },
  isFlagged:    { type: Boolean, default: false },
  isActive:     { type: Boolean, default: true },
  rating:       { type: Number, default: 0 },
  reviewCount:  { type: Number, default: 0 },
  salesCount:   { type: Number, default: 0 },
  tags:         [String],
  sku:          String,
  weight:       Number,
}, { timestamps: true })

productSchema.index({ name: 'text', description: 'text', category: 'text' })
productSchema.index({ vendor: 1, isActive: 1, isApproved: 1 })

// ── ORDER ─────────────────────────────────────────────────────────────────────
const orderItemSchema = new Schema({
  product:  { type: Schema.Types.ObjectId, ref: 'Product' },
  name:     String,
  price:    Number,
  qty:      Number,
  image:    String,
  vendor:   { type: Schema.Types.ObjectId, ref: 'Vendor' },
})

const orderSchema = new Schema({
  orderId:     { type: String, unique: true },
  customer:    { type: Schema.Types.ObjectId, ref: 'User', required: true },
  vendor:      { type: Schema.Types.ObjectId, ref: 'Vendor', required: true },
  items:       [orderItemSchema],
  subtotal:    Number,
  delivery:    { type: Number, default: 1500 },
  discount:    { type: Number, default: 0 },
  total:       Number,
  status: {
    type: String,
    enum: ['pending','awaiting_payment','payment_uploaded','payment_confirmed','processing','shipped','delivered','cancelled'],
    default: 'pending'
  },
  paymentMethod: { type: String, enum: ['bank_transfer','flutterwave','pay_on_delivery'] },
  paymentStatus: { type: String, enum: ['unpaid','pending','paid','failed'], default: 'unpaid' },
  paymentRef:    String,
  paymentProof:  String,
  deliveryName:  String,
  deliveryPhone: String,
  deliveryEmail: String,
  deliveryAddress: String,
  deliveryCity:  String,
  deliveryState: String,
  trackingId:    String,
  notes:         String,
  flwTxRef:      String,
  discountCode:  String,
}, { timestamps: true })

orderSchema.pre('save', function(next) {
  if (!this.orderId) {
    this.orderId = 'ORD-' + Date.now().toString().slice(-6) + Math.random().toString(36).slice(-3).toUpperCase()
  }
  next()
})

// ── PAYMENT / PAYOUT ─────────────────────────────────────────────────────────
const paymentSchema = new Schema({
  vendor:      { type: Schema.Types.ObjectId, ref: 'Vendor' },
  order:       { type: Schema.Types.ObjectId, ref: 'Order' },
  type:        { type: String, enum: ['order_payment','payout','refund'] },
  amount:      Number,
  currency:    { type: String, default: 'NGN' },
  status:      { type: String, enum: ['pending','processing','completed','failed'], default: 'pending' },
  reference:   String,
  flwRef:      String,
  provider:    { type: String, enum: ['flutterwave','manual','platform'], default: 'flutterwave' },
  meta:        Schema.Types.Mixed,
}, { timestamps: true })

// ── DISCOUNT ──────────────────────────────────────────────────────────────────
const discountSchema = new Schema({
  vendor:    { type: Schema.Types.ObjectId, ref: 'Vendor', required: true },
  code:      { type: String, required: true, uppercase: true },
  type:      { type: String, enum: ['percent','fixed'], default: 'percent' },
  value:     { type: Number, required: true },
  minOrder:  { type: Number, default: 0 },
  maxUses:   { type: Number, default: 100 },
  usedCount: { type: Number, default: 0 },
  expires:   Date,
  isActive:  { type: Boolean, default: true },
}, { timestamps: true })

discountSchema.index({ vendor: 1, code: 1 }, { unique: true })

// ── REVIEW ────────────────────────────────────────────────────────────────────
const reviewSchema = new Schema({
  product:  { type: Schema.Types.ObjectId, ref: 'Product', required: true },
  customer: { type: Schema.Types.ObjectId, ref: 'User', required: true },
  vendor:   { type: Schema.Types.ObjectId, ref: 'Vendor', required: true },
  rating:   { type: Number, required: true, min: 1, max: 5 },
  comment:  { type: String, required: true },
  images:   [String],
  verified: { type: Boolean, default: false },
}, { timestamps: true })

reviewSchema.index({ product: 1, customer: 1 }, { unique: true })

// ── NOTIFICATION ──────────────────────────────────────────────────────────────
const notifSchema = new Schema({
  recipient:  { type: Schema.Types.ObjectId, ref: 'User', required: true },
  type:       String,
  title:      String,
  body:       String,
  link:       String,
  isRead:     { type: Boolean, default: false },
  meta:       Schema.Types.Mixed,
}, { timestamps: true })

// ── BROADCAST ─────────────────────────────────────────────────────────────────
const broadcastSchema = new Schema({
  vendor:    { type: Schema.Types.ObjectId, ref: 'Vendor', required: true },
  message:   { type: String, required: true },
  audience:  { type: String, default: 'all' },
  reach:     { type: Number, default: 0 },
  opens:     { type: Number, default: 0 },
  status:    { type: String, enum: ['sending','sent','failed'], default: 'sent' },
}, { timestamps: true })

// ── PLATFORM SETTINGS ─────────────────────────────────────────────────────────
const settingsSchema = new Schema({
  key:   { type: String, unique: true, required: true },
  value: Schema.Types.Mixed,
}, { timestamps: true })

module.exports = {
  User:      mongoose.model('User', userSchema),
  Vendor:    mongoose.model('Vendor', vendorSchema),
  Product:   mongoose.model('Product', productSchema),
  Order:     mongoose.model('Order', orderSchema),
  Payment:   mongoose.model('Payment', paymentSchema),
  Discount:  mongoose.model('Discount', discountSchema),
  Review:    mongoose.model('Review', reviewSchema),
  Notif:     mongoose.model('Notif', notifSchema),
  Broadcast: mongoose.model('Broadcast', broadcastSchema),
  Settings:  mongoose.model('Settings', settingsSchema),
}
