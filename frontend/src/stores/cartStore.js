import { create } from 'zustand'
import { persist } from 'zustand/middleware'

const fmt = (n) => '₦' + Number(n).toLocaleString()

const useCartStore = create(
  persist(
    (set, get) => ({
      items:      [],
      wish:       [],
      cartOpen:   false,

      // ── CART ────────────────────────────────────────────────────────────────
      addItem: (product, qty = 1) => {
        set(state => {
          const existing = state.items.find(x => x._id === product._id)
          if (existing) {
            return { items: state.items.map(x => x._id === product._id ? { ...x, qty: x.qty + qty } : x) }
          }
          return { items: [...state.items, { ...product, qty }] }
        })
      },

      removeItem: (id) => set(state => ({ items: state.items.filter(x => x._id !== id) })),

      updateQty: (id, qty) => {
        if (qty <= 0) { get().removeItem(id); return }
        set(state => ({ items: state.items.map(x => x._id === id ? { ...x, qty } : x) }))
      },

      clearCart: () => set({ items: [] }),

      // ── WISHLIST ─────────────────────────────────────────────────────────────
      toggleWish: (product) => set(state => {
        const exists = state.wish.find(x => x._id === product._id)
        return { wish: exists ? state.wish.filter(x => x._id !== product._id) : [...state.wish, product] }
      }),

      isWished: (id) => get().wish.some(x => x._id === id),

      // ── COMPUTED ──────────────────────────────────────────────────────────────
      cartCount:  () => get().items.reduce((s, x) => s + x.qty, 0),
      cartTotal:  () => get().items.reduce((s, x) => s + x.price * x.qty, 0),
      wishCount:  () => get().wish.length,

      // ── UI ────────────────────────────────────────────────────────────────────
      setCartOpen: (v) => set({ cartOpen: v }),
    }),
    {
      name: 'chatcart-cart',
      partialize: (state) => ({ items: state.items, wish: state.wish }),
    }
  )
)

export default useCartStore
export { fmt }
