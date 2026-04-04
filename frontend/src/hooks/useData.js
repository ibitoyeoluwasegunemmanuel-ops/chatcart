import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { productsAPI, ordersAPI, vendorsAPI, discountsAPI, paymentsAPI, adminAPI, reviewsAPI } from '../api'
import toast from 'react-hot-toast'

// ── PRODUCTS ──────────────────────────────────────────────────────────────────
export const useProducts = (params) =>
  useQuery({ queryKey: ['products', params], queryFn: () => productsAPI.getAll(params).then(r => r.data), staleTime: 60000 })

export const useProduct = (id) =>
  useQuery({ queryKey: ['product', id], queryFn: () => productsAPI.getOne(id).then(r => r.data), enabled: !!id })

export const useMyProducts = () =>
  useQuery({ queryKey: ['my-products'], queryFn: () => productsAPI.myProducts().then(r => r.data) })

export const useCreateProduct = () => {
  const qc = useQueryClient()
  return useMutation({
    mutationFn: productsAPI.create,
    onSuccess: () => { qc.invalidateQueries(['my-products']); toast.success('Product created!') },
    onError:   (e) => toast.error(e.response?.data?.message || 'Failed to create product'),
  })
}

export const useUpdateProduct = () => {
  const qc = useQueryClient()
  return useMutation({
    mutationFn: ({ id, data }) => productsAPI.update(id, data),
    onSuccess: () => { qc.invalidateQueries(['my-products']); toast.success('Product updated!') },
    onError:   (e) => toast.error(e.response?.data?.message || 'Failed to update product'),
  })
}

export const useDeleteProduct = () => {
  const qc = useQueryClient()
  return useMutation({
    mutationFn: productsAPI.delete,
    onSuccess: () => { qc.invalidateQueries(['my-products']); toast.success('Product deleted') },
    onError:   (e) => toast.error(e.response?.data?.message || 'Failed to delete'),
  })
}

// ── ORDERS ────────────────────────────────────────────────────────────────────
export const useMyOrders    = () => useQuery({ queryKey: ['my-orders'],    queryFn: () => ordersAPI.myOrders().then(r => r.data)    })
export const useVendorOrders= () => useQuery({ queryKey: ['vendor-orders'],queryFn: () => ordersAPI.vendorOrders().then(r => r.data), refetchInterval: 30000 })

export const usePlaceOrder = () => {
  const qc = useQueryClient()
  return useMutation({
    mutationFn: ordersAPI.create,
    onSuccess: () => qc.invalidateQueries(['my-orders']),
    onError:   (e) => toast.error(e.response?.data?.message || 'Failed to place order'),
  })
}

export const useUpdateOrderStatus = () => {
  const qc = useQueryClient()
  return useMutation({
    mutationFn: ({ id, status }) => ordersAPI.updateStatus(id, status),
    onSuccess: () => { qc.invalidateQueries(['vendor-orders']); toast.success('Order updated') },
    onError:   (e) => toast.error(e.response?.data?.message || 'Failed to update order'),
  })
}

export const useConfirmPayment = () => {
  const qc = useQueryClient()
  return useMutation({
    mutationFn: ordersAPI.confirmPayment,
    onSuccess: () => { qc.invalidateQueries(['vendor-orders']); toast.success('Payment confirmed!') },
    onError:   (e) => toast.error(e.response?.data?.message || 'Failed to confirm'),
  })
}

// ── VENDORS ───────────────────────────────────────────────────────────────────
export const useVendorStore    = (slug) => useQuery({ queryKey: ['store', slug], queryFn: () => vendorsAPI.getStore(slug).then(r => r.data), enabled: !!slug })
export const useVendorAnalytics= () => useQuery({ queryKey: ['vendor-analytics'], queryFn: () => vendorsAPI.analytics().then(r => r.data) })
export const useVendorCustomers= () => useQuery({ queryKey: ['vendor-customers'], queryFn: () => vendorsAPI.customers().then(r => r.data) })

// ── DISCOUNTS ─────────────────────────────────────────────────────────────────
export const useDiscounts = () => useQuery({ queryKey: ['discounts'], queryFn: () => discountsAPI.getAll().then(r => r.data) })

export const useCreateDiscount = () => {
  const qc = useQueryClient()
  return useMutation({
    mutationFn: discountsAPI.create,
    onSuccess: () => { qc.invalidateQueries(['discounts']); toast.success('Discount created!') },
    onError:   (e) => toast.error(e.response?.data?.message || 'Failed to create discount'),
  })
}

export const useDeleteDiscount = () => {
  const qc = useQueryClient()
  return useMutation({
    mutationFn: discountsAPI.delete,
    onSuccess: () => { qc.invalidateQueries(['discounts']); toast.success('Discount deleted') },
  })
}

// ── REVIEWS ───────────────────────────────────────────────────────────────────
export const useProductReviews = (productId) =>
  useQuery({ queryKey: ['reviews', productId], queryFn: () => reviewsAPI.getForProduct(productId).then(r => r.data), enabled: !!productId })

export const useCreateReview = () => {
  const qc = useQueryClient()
  return useMutation({
    mutationFn: reviewsAPI.create,
    onSuccess: (_, vars) => { qc.invalidateQueries(['reviews', vars.productId]); toast.success('Review submitted!') },
    onError:   (e) => toast.error(e.response?.data?.message || 'Failed to submit review'),
  })
}

// ── PAYMENTS ──────────────────────────────────────────────────────────────────
export const usePayouts = () => useQuery({ queryKey: ['payouts'], queryFn: () => paymentsAPI.getPayouts().then(r => r.data) })

export const useRequestPayout = () => {
  const qc = useQueryClient()
  return useMutation({
    mutationFn: paymentsAPI.requestPayout,
    onSuccess: () => { qc.invalidateQueries(['payouts']); toast.success('Payout requested!') },
    onError:   (e) => toast.error(e.response?.data?.message || 'Payout failed'),
  })
}

// ── ADMIN ─────────────────────────────────────────────────────────────────────
export const useAdminOverview  = () => useQuery({ queryKey: ['admin-overview'],  queryFn: () => adminAPI.overview().then(r => r.data),   refetchInterval: 60000 })
export const useAdminVendors   = (p) => useQuery({ queryKey: ['admin-vendors', p],queryFn: () => adminAPI.getVendors(p).then(r => r.data)  })
export const useAdminUsers     = (p) => useQuery({ queryKey: ['admin-users', p],  queryFn: () => adminAPI.getUsers(p).then(r => r.data)    })
export const useAdminProducts  = (p) => useQuery({ queryKey: ['admin-products',p],queryFn: () => adminAPI.getProducts(p).then(r => r.data) })
export const useAdminPayments  = () => useQuery({ queryKey: ['admin-payments'],   queryFn: () => adminAPI.getPayments().then(r => r.data)  })
export const useAdminAnalytics = () => useQuery({ queryKey: ['admin-analytics'],  queryFn: () => adminAPI.getAnalytics().then(r => r.data) })
export const useAdminSettings  = () => useQuery({ queryKey: ['admin-settings'],   queryFn: () => adminAPI.getSettings().then(r => r.data)  })

export const useApproveVendor = () => {
  const qc = useQueryClient()
  return useMutation({
    mutationFn: adminAPI.approveVendor,
    onSuccess: () => { qc.invalidateQueries(['admin-vendors']); toast.success('Vendor approved!') },
    onError:   (e) => toast.error(e.response?.data?.message || 'Failed'),
  })
}

export const useSuspendVendor = () => {
  const qc = useQueryClient()
  return useMutation({
    mutationFn: adminAPI.suspendVendor,
    onSuccess: () => { qc.invalidateQueries(['admin-vendors']); toast.success('Vendor suspended') },
  })
}

export const useApproveProduct = () => {
  const qc = useQueryClient()
  return useMutation({
    mutationFn: adminAPI.approveProduct,
    onSuccess: () => { qc.invalidateQueries(['admin-products']); toast.success('Product approved!') },
  })
}

export const useRemoveProduct = () => {
  const qc = useQueryClient()
  return useMutation({
    mutationFn: adminAPI.removeProduct,
    onSuccess: () => { qc.invalidateQueries(['admin-products']); toast.success('Product removed') },
  })
}

export const useProcessPayout = () => {
  const qc = useQueryClient()
  return useMutation({
    mutationFn: adminAPI.processPayout,
    onSuccess: () => { qc.invalidateQueries(['admin-payments']); toast.success('Payout processed!') },
  })
}
