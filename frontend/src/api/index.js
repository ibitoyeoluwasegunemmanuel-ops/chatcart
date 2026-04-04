import axios from 'axios'

const BASE = import.meta.env.VITE_API_URL || '/api'

const api = axios.create({
  baseURL: BASE,
  timeout: 15000,
  headers: { 'Content-Type': 'application/json' }
})

// Attach JWT token to every request
api.interceptors.request.use(config => {
  const token = localStorage.getItem('chatcart_token')
  if (token) config.headers.Authorization = 'Bearer ' + token
  return config
})

// Handle 401 globally
api.interceptors.response.use(
  res => res,
  err => {
    if (err.response?.status === 401) {
      localStorage.removeItem('chatcart_token')
      window.location.href = '/'
    }
    return Promise.reject(err)
  }
)

// ── AUTH ──────────────────────────────────────────────
export const authAPI = {
  register:  data => api.post('/auth/register', data),
  login:     data => api.post('/auth/login', data),
  me:        ()   => api.get('/auth/me'),
  logout:    ()   => api.post('/auth/logout'),
  changePassword: data => api.put('/auth/password', data),
}

// ── PRODUCTS ──────────────────────────────────────────
export const productsAPI = {
  getAll:    params => api.get('/products', { params }),
  getOne:    id     => api.get('/products/' + id),
  create:    data   => api.post('/products', data),
  update:    (id,d) => api.put('/products/' + id, d),
  delete:    id     => api.delete('/products/' + id),
  myProducts: ()    => api.get('/products/vendor/mine'),
  uploadImage:(id,form) => api.post('/products/' + id + '/image', form, {
    headers: { 'Content-Type': 'multipart/form-data' }
  }),
}

// ── ORDERS ────────────────────────────────────────────
export const ordersAPI = {
  create:    data   => api.post('/orders', data),
  getAll:    params => api.get('/orders', { params }),
  getOne:    id     => api.get('/orders/' + id),
  myOrders:  ()     => api.get('/orders/customer/mine'),
  vendorOrders: ()  => api.get('/orders/vendor/mine'),
  updateStatus: (id,s) => api.put('/orders/' + id + '/status', { status: s }),
  uploadProof: (id,form) => api.post('/orders/' + id + '/proof', form, {
    headers: { 'Content-Type': 'multipart/form-data' }
  }),
  confirmPayment: id => api.put('/orders/' + id + '/confirm'),
}

// ── PAYMENTS / FLUTTERWAVE ────────────────────────────
export const paymentsAPI = {
  initiate:    data => api.post('/payments/initiate', data),
  verify:      ref  => api.get('/payments/verify/' + ref),
  getHistory:  ()   => api.get('/payments/history'),
  requestPayout: data => api.post('/payments/payout', data),
  getPayouts:  ()   => api.get('/payments/payouts'),
}

// ── VENDORS ───────────────────────────────────────────
export const vendorsAPI = {
  getStore:  slug  => api.get('/vendors/' + slug),
  getAll:    ()    => api.get('/vendors'),
  update:    data  => api.put('/vendors/profile', data),
  analytics: ()    => api.get('/vendors/analytics'),
  customers: ()    => api.get('/vendors/customers'),
}

// ── DISCOUNTS ─────────────────────────────────────────
export const discountsAPI = {
  getAll:    ()     => api.get('/discounts'),
  create:    data   => api.post('/discounts', data),
  update:    (id,d) => api.put('/discounts/' + id, d),
  delete:    id     => api.delete('/discounts/' + id),
  validate:  code   => api.post('/discounts/validate', { code }),
}

// ── REVIEWS ───────────────────────────────────────────
export const reviewsAPI = {
  getForProduct: id   => api.get('/reviews/product/' + id),
  create:        data => api.post('/reviews', data),
}

// ── ADMIN ─────────────────────────────────────────────
export const adminAPI = {
  overview:       ()      => api.get('/admin/overview'),
  getVendors:     params  => api.get('/admin/vendors', { params }),
  approveVendor:  id      => api.put('/admin/vendors/' + id + '/approve'),
  suspendVendor:  id      => api.put('/admin/vendors/' + id + '/suspend'),
  getUsers:       params  => api.get('/admin/users', { params }),
  suspendUser:    id      => api.put('/admin/users/' + id + '/suspend'),
  getProducts:    params  => api.get('/admin/products', { params }),
  approveProduct: id      => api.put('/admin/products/' + id + '/approve'),
  removeProduct:  id      => api.delete('/admin/products/' + id),
  getPayments:    params  => api.get('/admin/payments', { params }),
  processPayout:  id      => api.put('/admin/payouts/' + id + '/process'),
  getSettings:    ()      => api.get('/admin/settings'),
  updateSettings: data    => api.put('/admin/settings', data),
  getAnalytics:   ()      => api.get('/admin/analytics'),
}

// ── NOTIFICATIONS ─────────────────────────────────────
export const notifAPI = {
  getAll:    ()  => api.get('/notifications'),
  markRead:  id  => api.put('/notifications/' + id + '/read'),
  markAllRead: () => api.put('/notifications/read-all'),
}

// ── WHATSAPP BOT CONFIG ───────────────────────────────
export const whatsappAPI = {
  getSettings:    ()     => api.get('/whatsapp/settings'),
  updateSettings: data   => api.put('/whatsapp/settings', data),
  getBroadcasts:  ()     => api.get('/whatsapp/broadcasts'),
  sendBroadcast:  data   => api.post('/whatsapp/broadcasts', data),
  getAnalytics:   ()     => api.get('/whatsapp/analytics'),
}

export default api
