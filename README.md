# 🛒 ChatCart — AI-Powered African Commerce Platform

> **Shopify for Africa.** Sell products, automate WhatsApp sales, accept Flutterwave payments, schedule social media — all from one dashboard.

![ChatCart](https://img.shields.io/badge/ChatCart-v1.0-orange)
![React](https://img.shields.io/badge/React-18-blue)
![Node.js](https://img.shields.io/badge/Node.js-20-green)
![MongoDB](https://img.shields.io/badge/MongoDB-Atlas-green)
![Flutterwave](https://img.shields.io/badge/Payments-Flutterwave-orange)

---

## ✨ Features

### 🌍 Public Marketplace
- Browse products from all vendors
- Category filtering, search, product detail pages
- Vendor store pages (`/store/:slug`)
- Customer reviews and ratings
- Cart, wishlist, and 4-step checkout

### 💳 Payments (Flutterwave)
- Card, bank transfer, USSD, mobile money
- Automatic webhook verification
- Vendor payouts via Flutterwave Transfer API
- Manual bank transfer with proof upload

### 🏪 Vendor Dashboard (11 pages)
| Page | Features |
|------|----------|
| Overview | Revenue chart, recent orders, quick actions |
| Products | CRUD, image upload (Cloudinary), share to social |
| Orders | Status management, payment confirmation |
| Customers | Customer list, LTV, order history |
| Discounts | Coupon codes, percentage or fixed, expiry |
| WhatsApp Bot | Bot config, broadcast messaging |
| AI Tools | Caption, ad copy, hashtag generation (Claude API) |
| Social Media | Post scheduler across platforms |
| Payouts | Flutterwave payout requests, history |
| Analytics | Revenue charts, top products |
| Settings | Profile, store info, password change |

### ⚙️ Admin Dashboard (7 pages)
- Platform overview with KPIs
- Vendor approval/suspension
- Product moderation
- Payment monitoring and payout processing
- User and staff management
- Platform settings (gateways, plans, AI config)

---

## 🚀 Quick Start

### Prerequisites
- Node.js 18+
- MongoDB Atlas account (free tier works)
- Flutterwave account
- Cloudinary account (free tier works)

### 1. Clone the repo
```bash
git clone https://github.com/ibitoyeoluwasegunemmanuel-ops/chatcart.git
cd chatcart
```

### 2. Set up environment variables

**Backend:**
```bash
cp backend/.env.example backend/.env
# Edit backend/.env with your values
```

**Frontend:**
```bash
cp frontend/.env.example frontend/.env
# Edit frontend/.env with your values
```

### 3. Install dependencies
```bash
npm run install:all
```

### 4. Seed the database (optional)
```bash
cd backend && npm run seed
# Creates admin + sample vendors + products
# Admin: admin@chatcart.com / Admin@2025
# Vendor: adaeze@chatcart.com / Vendor@2025
```

### 5. Run development
```bash
npm run dev
# Frontend: http://localhost:3000
# Backend:  http://localhost:5000
```

---

## 📦 Project Structure

```
chatcart/
├── frontend/                  # React + Vite
│   ├── src/
│   │   ├── api/index.js       # All API calls
│   │   ├── context/           # Auth context
│   │   ├── components/shared/ # Reusable UI components
│   │   └── pages/
│   │       ├── marketplace/   # Public pages
│   │       ├── vendor/        # Vendor dashboard
│   │       ├── admin/         # Admin dashboard
│   │       └── auth/          # Login / Register
│   └── vercel.json            # Vercel deployment config
│
├── backend/                   # Node.js + Express
│   ├── src/
│   │   ├── server.js          # Express app
│   │   ├── models/index.js    # All Mongoose models
│   │   ├── middleware/auth.js  # JWT middleware
│   │   ├── routes/            # API routes
│   │   │   ├── auth.js
│   │   │   ├── products.js
│   │   │   ├── orders.js
│   │   │   ├── payments.js    # Flutterwave integration
│   │   │   ├── admin.js
│   │   │   └── ...
│   │   ├── config/
│   │   │   ├── cloudinary.js  # Image uploads
│   │   │   └── multer.js
│   │   └── utils/seed.js      # Sample data
│   └── .env.example
│
└── railway.json               # Railway deployment config
```

---

## 🌐 Deployment

### Deploy Backend → Railway

1. Go to [railway.app](https://railway.app) → New Project → GitHub repo
2. Select the `chatcart` repo
3. Add environment variables (copy from `backend/.env.example`)
4. Add a **MongoDB** plugin OR use your MongoDB Atlas URI
5. Deploy — Railway auto-detects Node.js

**Environment Variables to set in Railway:**
```
NODE_ENV=production
MONGODB_URI=your_atlas_uri
JWT_SECRET=your_secret
FRONTEND_URL=https://your-app.vercel.app
FLUTTERWAVE_SECRET_KEY=FLWSECK_TEST-xxx
FLUTTERWAVE_PUBLIC_KEY=FLWPUBK_TEST-xxx
FLUTTERWAVE_WEBHOOK_HASH=your_hash
CLOUDINARY_CLOUD_NAME=xxx
CLOUDINARY_API_KEY=xxx
CLOUDINARY_API_SECRET=xxx
```

### Deploy Frontend → Vercel

1. Go to [vercel.com](https://vercel.com) → New Project → Import GitHub repo
2. Set **Root Directory** to `frontend`
3. Framework: **Vite**
4. Add environment variables:
```
VITE_API_URL=https://your-railway-app.railway.app/api
VITE_FLUTTERWAVE_PUBLIC_KEY=FLWPUBK_TEST-xxx
```
5. Deploy

### Set up Flutterwave Webhook

1. In Flutterwave dashboard → Settings → Webhooks
2. Add URL: `https://your-railway-app.railway.app/webhook/flutterwave`
3. Copy the **Secret Hash** → add to Railway as `FLUTTERWAVE_WEBHOOK_HASH`

---

## 🔌 API Reference

### Auth
| Method | Endpoint | Description |
|--------|----------|-------------|
| POST | `/api/auth/register` | Register vendor/customer |
| POST | `/api/auth/login` | Login |
| GET  | `/api/auth/me` | Get current user |
| PUT  | `/api/auth/password` | Change password |

### Products
| Method | Endpoint | Description |
|--------|----------|-------------|
| GET  | `/api/products` | List products (search, filter, paginate) |
| GET  | `/api/products/:id` | Get product |
| POST | `/api/products` | Create product (vendor) |
| PUT  | `/api/products/:id` | Update product |
| DELETE | `/api/products/:id` | Delete product |

### Orders
| Method | Endpoint | Description |
|--------|----------|-------------|
| POST | `/api/orders` | Place order |
| GET  | `/api/orders/customer/mine` | My orders (customer) |
| GET  | `/api/orders/vendor/mine` | Vendor's orders |
| PUT  | `/api/orders/:id/status` | Update order status |
| POST | `/api/orders/:id/proof` | Upload payment proof |
| PUT  | `/api/orders/:id/confirm` | Confirm payment |

### Payments (Flutterwave)
| Method | Endpoint | Description |
|--------|----------|-------------|
| POST | `/api/payments/initiate` | Create payment link |
| GET  | `/api/payments/verify/:ref` | Verify payment |
| POST | `/api/payments/payout` | Request vendor payout |
| POST | `/webhook/flutterwave` | FLW webhook handler |

---

## 🤝 Contributing

1. Fork the repo
2. Create your branch: `git checkout -b feature/new-feature`
3. Commit: `git commit -m 'Add new feature'`
4. Push: `git push origin feature/new-feature`
5. Open a Pull Request

---

## 📄 License

MIT License — built for African vendors 🌍

---

*Built with ❤️ by the ChatCart team*
