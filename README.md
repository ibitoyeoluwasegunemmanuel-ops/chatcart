# ChatCart Platform

ChatCart is a multi-role SaaS platform with:

- Vendor workspace (products, orders, automation, analytics)
- Creator workspace (AI content and publishing flows)
- Admin-ready backend controls and billing foundations
- Owner/staff permission model for team delegation
- WhatsApp AI customer automation endpoints
- Payment proof submission and verification workflow

## Project Structure

- `frontend/` - HTML, CSS, JavaScript client
- `backend/` - Node.js + Express API
- `database/` - SQLite schema + runtime database file
- `automation/` - PowerShell setup/run scripts

## Run Locally

1. Backend API
   - `cd backend`
   - `npm install`
   - `npm start`
2. Frontend is served by backend on the same domain
   - Open `http://localhost:4000`
3. React app variant
   - `cd kimi_import/app`
   - `npm install`
   - `npm run dev`

## Go Live Fast (Render)

1. Push this repository to GitHub.
2. In Render, create a new **Blueprint** and select this repo.
3. Render will detect `render.yaml` and create the `chatcart` web service.
4. After deploy, open the generated URL:
   - Landing: `/`
   - Login: `/login`
   - Signup: `/signup`
   - API health: `/api/health`
5. Add custom domain `chatcart.app` in Render dashboard and point DNS records.

Backend runs on `http://localhost:4000`.

## Core API Endpoints

- Auth: `POST /api/auth/signup`, `POST /api/auth/login`
- Products: `GET /api/products`, `POST /api/products`, `PUT /api/products/:id`, `DELETE /api/products/:id`
- Orders: `POST /api/orders`, `GET /api/orders/vendor`, `PATCH /api/orders/:id/status`
- Social: `GET /api/social/connections`, `POST /api/social/connect`, `POST /api/social/posts`
- Automation: `POST /api/automation/generate`, `GET /api/automation/activity`
- Analytics: `GET /api/analytics/summary`
- Subscription: `GET /api/subscription/current`, `POST /api/subscription/upgrade`
- Staff: `GET /api/staff`, `POST /api/staff`, `PATCH /api/staff/:id/permissions`
- WhatsApp: `POST /api/whatsapp/message`, `GET /api/whatsapp/track/:orderId`, `GET /api/whatsapp/vendor/conversations`
- Payments: `POST /api/payments/proof`, `GET /api/payments/vendor`, `PATCH /api/payments/:id/verify`
