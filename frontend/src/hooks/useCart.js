import { create } from 'zustand'
import { persist } from 'zustand/middleware'

export const useCart = create(
  persist(
    (set, get) => ({
      items: [],
      coupon: null,
      couponSavings: 0,

      add: (product, qty = 1, variant = null) => {
        set(state => {
          const key = product._id + (variant?.label || '')
          const exists = state.items.find(x => x.key === key)
          if (exists) {
            return { items: state.items.map(x => x.key === key ? { ...x, qty: x.qty + qty } : x) }
          }
          return {
            items: [...state.items, {
              key,
              id:       product._id,
              name:     product.name,
              price:    variant?.price || product.price,
              image:    product.images?.[0],
              emoji:    product.emoji,
              vendor:   product.vendor?.storeName || product.vendor,
              vendorId: product.vendor?._id || product.vendor,
              slug:     product.vendor?.slug,
              stock:    variant?.stock || product.stock,
              qty,
              variant,
            }]
          }
        })
      },

      remove: (key) => set(state => ({ items: state.items.filter(x => x.key !== key) })),

      updateQty: (key, qty) => {
        if (qty <= 0) { get().remove(key); return }
        set(state => ({ items: state.items.map(x => x.key === key ? { ...x, qty } : x) }))
      },

      clear: () => set({ items: [], coupon: null, couponSavings: 0 }),

      setCoupon: (coupon, savings) => set({ coupon, couponSavings: savings }),
      removeCoupon: () => set({ coupon: null, couponSavings: 0 }),

      get count()   { return get().items.reduce((s, x) => s + x.qty, 0) },
      get subtotal(){ return get().items.reduce((s, x) => s + x.price * x.qty, 0) },
      get delivery(){ return get().subtotal > 0 ? 1500 : 0 },
      get total()   { return get().subtotal + get().delivery - get().couponSavings },
    }),
    { name: 'chatcart-cart' }
  )
)

export const useWishlist = create(
  persist(
    (set, get) => ({
      items: [],
      toggle: (product) => {
        const has = get().items.find(x => x.id === product._id)
        if (has) set(state => ({ items: state.items.filter(x => x.id !== product._id) }))
        else     set(state => ({ items: [...state.items, { id: product._id, name: product.name, price: product.price, image: product.images?.[0] }] }))
      },
      has: (id) => !!get().items.find(x => x.id === id),
    }),
    { name: 'chatcart-wishlist' }
  )
)
