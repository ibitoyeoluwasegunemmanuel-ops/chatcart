require('dotenv').config()
const mongoose = require('mongoose')
const { User, Vendor, Product, Order, Settings } = require('../models')

const seed = async () => {
  await mongoose.connect(process.env.MONGODB_URI)
  console.log('Connected to MongoDB')

  // Clear existing
  await Promise.all([User.deleteMany(), Vendor.deleteMany(), Product.deleteMany(), Order.deleteMany()])
  console.log('Cleared existing data')

  // Admin
  const admin = await User.create({ name: 'ChatCart Admin', email: 'admin@chatcart.com', password: 'Admin@2025', role: 'admin', isVerified: true })

  // Vendors
  const vendor1User = await User.create({ name: 'Adaeze Okonkwo', email: 'adaeze@chatcart.com', password: 'Vendor@2025', role: 'vendor', phone: '+2348012345678', plan: 'pro', isVerified: true })
  const vendor1 = await Vendor.create({ user: vendor1User._id, storeName: "Adaeze's Boutique", slug: 'adaeze-boutique', description: 'Premium African fashion and lifestyle products', whatsapp: '+2348012345678', status: 'active', totalSales: 1240, totalRevenue: 4820000, rating: 4.8, reviewCount: 134, bankName: 'Access Bank', bankAccount: '0123456789', bankHolder: 'Adaeze Okonkwo' })

  const vendor2User = await User.create({ name: 'GlowNaija', email: 'glow@chatcart.com', password: 'Vendor@2025', role: 'vendor', phone: '+2348023456789', plan: 'business', isVerified: true })
  const vendor2 = await Vendor.create({ user: vendor2User._id, storeName: 'GlowNaija', slug: 'glownaija', description: '100% organic Nigerian beauty products', status: 'active', totalSales: 3400, totalRevenue: 9600000, rating: 4.9, reviewCount: 312 })

  // Products
  const products = await Product.insertMany([
    { vendor: vendor1._id, name: 'Ankara Wrap Dress', description: 'Hand-crafted Ankara wrap dress made from premium 100% cotton fabric. Each piece is uniquely tailored with traditional African patterns.', price: 18500, oldPrice: 24000, currency: 'NGN', stock: 12, category: 'Fashion', images: [], badge: 'Bestseller', isApproved: true, rating: 4.8, reviewCount: 134, salesCount: 89 },
    { vendor: vendor1._id, name: 'Kente Print Shirt', description: 'Premium quality kente print shirt. Slim fit breathable cotton blend.', price: 12000, oldPrice: 15000, currency: 'NGN', stock: 20, category: 'Fashion', images: [], badge: 'New', isApproved: true, rating: 4.7, reviewCount: 56, salesCount: 34 },
    { vendor: vendor1._id, name: 'Adire Tote Bag', description: 'Hand-dyed Adire indigo tote bag. 100% organic cotton.', price: 7500, currency: 'NGN', stock: 35, category: 'Fashion', images: [], badge: 'New', isApproved: true, rating: 4.7, reviewCount: 78, salesCount: 45 },
    { vendor: vendor2._id, name: 'Shea Butter Body Set', description: 'Premium 100% organic shea butter sourced from Northern Nigeria. Includes body butter, lip balm, face cream.', price: 8900, oldPrice: 12000, currency: 'NGN', stock: 45, category: 'Beauty', images: [], badge: 'Hot', isApproved: true, rating: 4.9, reviewCount: 312, salesCount: 201 },
    { vendor: vendor2._id, name: '24K Glow Face Oil', description: 'Luxurious face oil with rosehip, marula, and argan oil. Brightens and firms.', price: 14500, oldPrice: 18000, currency: 'NGN', stock: 60, category: 'Beauty', images: [], isApproved: true, rating: 4.9, reviewCount: 187, salesCount: 120 },
  ])

  // Platform settings
  await Settings.insertMany([
    { key: 'platformName', value: 'ChatCart' },
    { key: 'commission', value: 5 },
    { key: 'currency', value: 'NGN' },
    { key: 'aiEnabled', value: true },
    { key: 'botEnabled', value: true },
    { key: 'marketplacePublic', value: true },
    { key: 'vendorRegistrationOpen', value: true },
  ])

  console.log('\n✅ Seed complete!')
  console.log('Admin:    admin@chatcart.com  /  Admin@2025')
  console.log('Vendor 1: adaeze@chatcart.com /  Vendor@2025')
  console.log('Vendor 2: glow@chatcart.com   /  Vendor@2025')
  process.exit(0)
}

seed().catch(err => { console.error(err); process.exit(1) })
