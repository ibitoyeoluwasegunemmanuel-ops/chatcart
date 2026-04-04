const mongoose = require('mongoose')
const { Schema } = mongoose

// ── PRODUCT VARIANTS ──────────────────────────────────────────────────────────
// Handles size/color/material variants with individual stock & price per variant
const variantSchema = new Schema({
  product:    { type: Schema.Types.ObjectId, ref: 'Product', required: true },
  name:       { type: String, required: true },   // e.g. "Size / Color"
  options:    [{
    label:    String,    // e.g. "XL / Red"
    price:    Number,    // override base price
    stock:    { type: Number, default: 0 },
    sku:      String,
    image:    String,
  }],
}, { timestamps: true })

// ── INVENTORY LOG ─────────────────────────────────────────────────────────────
const inventoryLogSchema = new Schema({
  product:   { type: Schema.Types.ObjectId, ref: 'Product', required: true },
  vendor:    { type: Schema.Types.ObjectId, ref: 'Vendor',  required: true },
  change:    Number,      // +10 restock, -2 sold
  reason:    { type: String, enum: ['sale','restock','adjustment','return','damage'] },
  note:      String,
  stockAfter: Number,
}, { timestamps: true })

// ── SUBSCRIPTION / RECURRING ORDER ───────────────────────────────────────────
const subscriptionSchema = new Schema({
  customer:   { type: Schema.Types.ObjectId, ref: 'User',    required: true },
  vendor:     { type: Schema.Types.ObjectId, ref: 'Vendor',  required: true },
  product:    { type: Schema.Types.ObjectId, ref: 'Product', required: true },
  qty:        { type: Number, default: 1 },
  frequency:  { type: String, enum: ['weekly','biweekly','monthly'], default: 'monthly' },
  nextDate:   Date,
  status:     { type: String, enum: ['active','paused','cancelled'], default: 'active' },
  address:    String,
  paymentMethod: String,
  totalOrders: { type: Number, default: 0 },
}, { timestamps: true })

// ── LOYALTY POINTS ────────────────────────────────────────────────────────────
const loyaltySchema = new Schema({
  customer:  { type: Schema.Types.ObjectId, ref: 'User', required: true, unique: true },
  points:    { type: Number, default: 0 },
  lifetime:  { type: Number, default: 0 },  // total ever earned
  tier:      { type: String, enum: ['bronze','silver','gold','platinum'], default: 'bronze' },
  history:   [{
    points:  Number,
    action:  String,  // 'earned_purchase', 'redeemed', 'bonus'
    ref:     String,  // order ID
    date:    { type: Date, default: Date.now }
  }]
}, { timestamps: true })

// ── AFFILIATE / REFERRAL ──────────────────────────────────────────────────────
const affiliateSchema = new Schema({
  user:         { type: Schema.Types.ObjectId, ref: 'User', required: true, unique: true },
  code:         { type: String, unique: true, required: true },
  commissionPct:{ type: Number, default: 5 },    // 5% of sale
  clicks:       { type: Number, default: 0 },
  conversions:  { type: Number, default: 0 },
  totalEarned:  { type: Number, default: 0 },
  pendingPayout:{ type: Number, default: 0 },
  status:       { type: String, enum: ['active','suspended'], default: 'active' },
  payouts:      [{
    amount:   Number,
    date:     Date,
    status:   String,
    ref:      String,
  }]
}, { timestamps: true })

const affiliateClickSchema = new Schema({
  affiliate: { type: Schema.Types.ObjectId, ref: 'Affiliate', required: true },
  ip:        String,
  userAgent: String,
  converted: { type: Boolean, default: false },
  orderId:   { type: Schema.Types.ObjectId, ref: 'Order' },
  commission:Number,
}, { timestamps: true })

// ── ABANDONED CART ────────────────────────────────────────────────────────────
const abandonedCartSchema = new Schema({
  session:    String,
  customer:   { type: Schema.Types.ObjectId, ref: 'User' },
  email:      String,
  phone:      String,
  items:      [{ productId: Schema.Types.ObjectId, name: String, price: Number, qty: Number, image: String }],
  total:      Number,
  vendor:     { type: Schema.Types.ObjectId, ref: 'Vendor' },
  reminder1Sent: { type: Boolean, default: false },  // 1hr reminder
  reminder2Sent: { type: Boolean, default: false },  // 24hr reminder
  recovered:  { type: Boolean, default: false },
  lastSeen:   { type: Date, default: Date.now },
}, { timestamps: true })

// ── SHIPPING ZONES ────────────────────────────────────────────────────────────
const shippingZoneSchema = new Schema({
  vendor:    { type: Schema.Types.ObjectId, ref: 'Vendor', required: true },
  name:      { type: String, required: true },     // e.g. "Lagos", "South-West"
  states:    [String],                              // e.g. ["Lagos","Ogun","Oyo"]
  countries: [String],
  type:      { type: String, enum: ['flat','weight','free'], default: 'flat' },
  flatRate:  Number,
  perKgRate: Number,
  minWeight: Number,
  maxWeight: Number,
  freeAbove: Number,       // free shipping above this order value
  estimatedDays: String,   // "1-2 days"
  carrier:   String,       // "GIG", "DHL", "Kwik", "Self"
  isActive:  { type: Boolean, default: true },
}, { timestamps: true })

// ── MULTI-CURRENCY RATES ──────────────────────────────────────────────────────
const currencyRateSchema = new Schema({
  base:     { type: String, default: 'NGN' },
  rates:    { type: Map, of: Number },
  updatedAt:{ type: Date, default: Date.now },
})

// ── STOREFRONT CUSTOMISATION ──────────────────────────────────────────────────
const storefrontSchema = new Schema({
  vendor:        { type: Schema.Types.ObjectId, ref: 'Vendor', required: true, unique: true },
  primaryColor:  { type: String, default: '#e85528' },
  accentColor:   { type: String, default: '#1c1409' },
  font:          { type: String, default: 'DM Sans' },
  layout:        { type: String, enum: ['grid','list','masonry'], default: 'grid' },
  bannerImage:   String,
  bannerTitle:   String,
  bannerSubtitle:String,
  showRatings:   { type: Boolean, default: true },
  showReviews:   { type: Boolean, default: true },
  featuredProducts: [{ type: Schema.Types.ObjectId, ref: 'Product' }],
  announcements: String,
  socialLinks:   { instagram: String, tiktok: String, facebook: String, twitter: String },
  seoTitle:      String,
  seoDesc:       String,
}, { timestamps: true })

// ── LIVE SESSION (streaming) ──────────────────────────────────────────────────
const liveSessionSchema = new Schema({
  vendor:      { type: Schema.Types.ObjectId, ref: 'Vendor', required: true },
  title:       String,
  streamKey:   String,
  status:      { type: String, enum: ['scheduled','live','ended'], default: 'scheduled' },
  viewers:     { type: Number, default: 0 },
  peakViewers: { type: Number, default: 0 },
  products:    [{ type: Schema.Types.ObjectId, ref: 'Product' }],
  orders:      { type: Number, default: 0 },
  revenue:     { type: Number, default: 0 },
  startedAt:   Date,
  endedAt:     Date,
  recordingUrl:String,
}, { timestamps: true })

// ── APPOINTMENT / BOOKING ─────────────────────────────────────────────────────
const appointmentSchema = new Schema({
  vendor:    { type: Schema.Types.ObjectId, ref: 'Vendor',  required: true },
  customer:  { type: Schema.Types.ObjectId, ref: 'User',    required: true },
  service:   String,
  date:      Date,
  duration:  Number,    // minutes
  price:     Number,
  deposit:   Number,
  status:    { type: String, enum: ['pending','confirmed','completed','cancelled'], default: 'pending' },
  notes:     String,
  paymentRef:String,
}, { timestamps: true })

// ── EMAIL QUEUE ───────────────────────────────────────────────────────────────
const emailQueueSchema = new Schema({
  to:        String,
  subject:   String,
  template:  String,
  data:      Schema.Types.Mixed,
  status:    { type: String, enum: ['pending','sent','failed'], default: 'pending' },
  attempts:  { type: Number, default: 0 },
  error:     String,
  sentAt:    Date,
}, { timestamps: true })

// ── GOOGLE SHOPPING FEED ──────────────────────────────────────────────────────
const shoppingFeedSchema = new Schema({
  vendor:    { type: Schema.Types.ObjectId, ref: 'Vendor', required: true, unique: true },
  feedUrl:   String,
  lastSync:  Date,
  productCount: Number,
  status:    { type: String, enum: ['active','inactive'], default: 'active' },
}, { timestamps: true })

module.exports = {
  ProductVariant:  mongoose.model('ProductVariant',  variantSchema),
  InventoryLog:    mongoose.model('InventoryLog',    inventoryLogSchema),
  Subscription:    mongoose.model('Subscription',    subscriptionSchema),
  Loyalty:         mongoose.model('Loyalty',         loyaltySchema),
  Affiliate:       mongoose.model('Affiliate',       affiliateSchema),
  AffiliateClick:  mongoose.model('AffiliateClick',  affiliateClickSchema),
  AbandonedCart:   mongoose.model('AbandonedCart',   abandonedCartSchema),
  ShippingZone:    mongoose.model('ShippingZone',    shippingZoneSchema),
  CurrencyRate:    mongoose.model('CurrencyRate',    currencyRateSchema),
  Storefront:      mongoose.model('Storefront',      storefrontSchema),
  LiveSession:     mongoose.model('LiveSession',     liveSessionSchema),
  Appointment:     mongoose.model('Appointment',     appointmentSchema),
  EmailQueue:      mongoose.model('EmailQueue',      emailQueueSchema),
  ShoppingFeed:    mongoose.model('ShoppingFeed',    shoppingFeedSchema),
}
