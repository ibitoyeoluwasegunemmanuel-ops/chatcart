import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useCart } from '../../hooks/useCart'
import { discountsAPI } from '../../api'
import toast from 'react-hot-toast'

export default function CartDrawer({ open, onClose }) {
  const { items, remove, updateQty, subtotal, delivery, total, coupon, couponSavings, setCoupon, removeCoupon, count } = useCart()
  const [code, setCode] = useState('')
  const [applying, setApplying] = useState(false)
  const nav = useNavigate()
  const fmt = n => '₦' + Number(n).toLocaleString()

  const applyCode = async () => {
    if (!code.trim()) return
    setApplying(true)
    try {
      const vendorId = items[0]?.vendorId
      const res = await discountsAPI.validate(code)
      if (res.data.success) {
        setCoupon(res.data.discount.code, res.data.savings)
        toast.success('Code applied! You saved ' + fmt(res.data.savings))
        setCode('')
      }
    } catch (err) {
      toast.error(err.response?.data?.message || 'Invalid code')
    }
    setApplying(false)
  }

  if (!open) return null
  return (
    <>
      {/* Backdrop */}
      <div onClick={onClose} style={{ position:'fixed', inset:0, background:'rgba(28,20,9,.5)', zIndex:300, animation:'fadeIn .2s ease' }}/>

      {/* Drawer */}
      <div style={{ position:'fixed', top:0, right:0, bottom:0, width:'min(440px,100vw)', background:'#fff', zIndex:301, display:'flex', flexDirection:'column', animation:'slideR .28s ease', boxShadow:'-8px 0 40px rgba(28,20,9,.14)' }}>

        {/* Header */}
        <div style={{ padding:'18px 20px', borderBottom:'1px solid #e8e4dc', display:'flex', alignItems:'center', justifyContent:'space-between', flexShrink:0 }}>
          <div>
            <div style={{ fontFamily:"'Fraunces',serif", fontSize:20, fontWeight:700, color:'#1c1409' }}>Your Cart</div>
            <div style={{ fontSize:12, color:'#7a7268', marginTop:2 }}>{count} item{count !== 1 ? 's' : ''}</div>
          </div>
          <button onClick={onClose} style={{ width:34, height:34, borderRadius:'50%', border:'1px solid #e8e4dc', background:'#faf8f3', cursor:'pointer', fontSize:16, display:'flex', alignItems:'center', justifyContent:'center' }}>✕</button>
        </div>

        {/* Items */}
        <div style={{ flex:1, overflowY:'auto', padding:'12px 20px' }}>
          {items.length === 0 ? (
            <div style={{ textAlign:'center', padding:'60px 0' }}>
              <div style={{ fontSize:52, marginBottom:12 }}>🛒</div>
              <div style={{ fontFamily:"'Fraunces',serif", fontSize:18, fontWeight:700, color:'#1c1409', marginBottom:8 }}>Your cart is empty</div>
              <div style={{ fontSize:13, color:'#7a7268', marginBottom:20 }}>Add some amazing African products!</div>
              <button onClick={onClose} style={{ padding:'10px 24px', background:'#1c1409', color:'#faf8f3', border:'none', borderRadius:8, fontSize:13, fontWeight:700, cursor:'pointer' }}>Continue Shopping</button>
            </div>
          ) : items.map(item => (
            <div key={item.key} style={{ display:'flex', gap:12, padding:'14px 0', borderBottom:'1px solid #f5f5f0', alignItems:'center' }}>
              <div style={{ width:60, height:60, background:'#f2ede3', borderRadius:9, display:'flex', alignItems:'center', justifyContent:'center', overflow:'hidden', flexShrink:0 }}>
                {item.image ? <img src={item.image} alt={item.name} style={{ width:'100%', height:'100%', objectFit:'cover' }}/> : <span style={{ fontSize:28 }}>{item.emoji || '📦'}</span>}
              </div>
              <div style={{ flex:1, minWidth:0 }}>
                <div style={{ fontSize:13, fontWeight:600, color:'#1c1409', overflow:'hidden', textOverflow:'ellipsis', whiteSpace:'nowrap', marginBottom:2 }}>{item.name}</div>
                <div style={{ fontSize:11, color:'#7a7268', marginBottom:8 }}>{item.vendor}{item.variant ? ' · ' + item.variant.label : ''}</div>
                <div style={{ display:'flex', alignItems:'center', justifyContent:'space-between' }}>
                  <div style={{ display:'flex', alignItems:'center', border:'1px solid #e8e4dc', borderRadius:7, overflow:'hidden' }}>
                    <button onClick={() => updateQty(item.key, item.qty - 1)} style={{ width:28, height:28, border:'none', background:'#faf8f3', cursor:'pointer', fontSize:16, fontWeight:700, color:'#1c1409' }}>−</button>
                    <span style={{ width:32, textAlign:'center', fontSize:13, fontWeight:700, color:'#1c1409' }}>{item.qty}</span>
                    <button onClick={() => updateQty(item.key, item.qty + 1)} disabled={item.qty >= item.stock} style={{ width:28, height:28, border:'none', background:'#faf8f3', cursor:'pointer', fontSize:16, fontWeight:700, color: item.qty >= item.stock ? '#ccc' : '#1c1409' }}>+</button>
                  </div>
                  <span style={{ fontFamily:"'Fraunces',serif", fontSize:15, fontWeight:700, color:'#1c1409' }}>{fmt(item.price * item.qty)}</span>
                </div>
              </div>
              <button onClick={() => remove(item.key)} style={{ width:26, height:26, borderRadius:'50%', border:'none', background:'#fff0ed', color:'#e85528', cursor:'pointer', fontSize:11, flexShrink:0 }}>✕</button>
            </div>
          ))}
        </div>

        {/* Footer */}
        {items.length > 0 && (
          <div style={{ borderTop:'1px solid #e8e4dc', background:'#faf8f3', padding:'16px 20px', flexShrink:0 }}>
            {/* Coupon */}
            <div style={{ display:'flex', gap:8, marginBottom:14 }}>
              {coupon
                ? <div style={{ display:'flex', alignItems:'center', gap:8, background:'#e8f5ee', border:'1px solid #b6e0c8', borderRadius:8, padding:'8px 12px', flex:1 }}>
                    <span style={{ fontSize:12, fontWeight:700, color:'#1a6b3c', flex:1 }}>🏷️ {coupon} applied! −{fmt(couponSavings)}</span>
                    <button onClick={removeCoupon} style={{ border:'none', background:'transparent', color:'#e85528', cursor:'pointer', fontSize:12, fontWeight:600 }}>Remove</button>
                  </div>
                : <>
                    <input value={code} onChange={e => setCode(e.target.value.toUpperCase())} placeholder="Discount code" style={{ flex:1, padding:'9px 12px', border:'1.5px solid #ddd8ce', borderRadius:8, fontSize:13, fontFamily:"'DM Sans',sans-serif", outline:'none' }} onKeyDown={e => e.key === 'Enter' && applyCode()}/>
                    <button onClick={applyCode} disabled={applying || !code} style={{ padding:'9px 16px', background:'#1c1409', color:'#faf8f3', border:'none', borderRadius:8, fontSize:12, fontWeight:700, cursor:'pointer', opacity: applying || !code ? .5 : 1 }}>{applying ? '...' : 'Apply'}</button>
                  </>
              }
            </div>

            {/* Totals */}
            {[['Subtotal', fmt(subtotal)], ['Delivery', fmt(delivery)], ...(couponSavings > 0 ? [['Discount', '−' + fmt(couponSavings)]] : [])].map(([l, v]) => (
              <div key={l} style={{ display:'flex', justifyContent:'space-between', marginBottom:7, fontSize:13 }}>
                <span style={{ color:'#7a7268' }}>{l}</span>
                <span style={{ fontWeight:600, color: l === 'Discount' ? '#1a6b3c' : '#1c1409' }}>{v}</span>
              </div>
            ))}
            <div style={{ height:1, background:'#e8e4dc', margin:'10px 0' }}/>
            <div style={{ display:'flex', justifyContent:'space-between', marginBottom:16 }}>
              <span style={{ fontFamily:"'Fraunces',serif", fontSize:17, fontWeight:700 }}>Total</span>
              <span style={{ fontFamily:"'Fraunces',serif", fontSize:22, fontWeight:900 }}>{fmt(total)}</span>
            </div>
            <button onClick={() => { onClose(); nav('/checkout') }} style={{ width:'100%', padding:'14px', background:'#e85528', color:'#fff', border:'none', borderRadius:9, fontSize:15, fontWeight:800, cursor:'pointer', transition:'background .18s' }}
              onMouseEnter={e => e.currentTarget.style.background='#d14420'}
              onMouseLeave={e => e.currentTarget.style.background='#e85528'}
            >Proceed to Checkout ⚡</button>
          </div>
        )}
      </div>

      <style>{`@keyframes fadeIn{from{opacity:0}to{opacity:1}} @keyframes slideR{from{opacity:0;transform:translateX(32px)}to{opacity:1;transform:translateX(0)}}`}</style>
    </>
  )
}
