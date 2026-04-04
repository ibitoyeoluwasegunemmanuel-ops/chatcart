import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useCart, useWishlist } from '../../hooks/useCart'
import toast from 'react-hot-toast'

const fmt   = n => '₦' + Number(n).toLocaleString()
const pctOff = (old, cur) => old ? Math.round((1 - cur / old) * 100) : 0

export default function ProductCard({ product: p, size = 'md' }) {
  const [hovered, setHovered] = useState(false)
  const { add } = useCart()
  const { toggle, has } = useWishlist()
  const wished = has(p._id)
  const nav = useNavigate()

  const disc = pctOff(p.oldPrice, p.price)
  const img  = p.images?.[0]

  const doAdd = (e) => {
    e.stopPropagation()
    add(p, 1)
    toast.success(p.name + ' added to cart', { icon: '🛒' })
  }

  const doWish = (e) => {
    e.stopPropagation()
    toggle(p)
    toast.success(wished ? 'Removed from wishlist' : 'Added to wishlist', { icon: wished ? '💔' : '❤️' })
  }

  const isCompact = size === 'sm'

  return (
    <div
      onClick={() => nav('/product/' + p._id)}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      style={{
        background: '#fff',
        borderRadius: 12,
        overflow: 'hidden',
        border: '1px solid #e8e4dc',
        cursor: 'pointer',
        transform: hovered ? 'translateY(-4px)' : 'translateY(0)',
        boxShadow: hovered ? '0 12px 40px rgba(28,20,9,.14)' : '0 1px 4px rgba(28,20,9,.06)',
        transition: 'all .22s cubic-bezier(.4,0,.2,1)',
        position: 'relative',
      }}
    >
      {/* Image */}
      <div style={{ position:'relative', paddingTop: isCompact ? '80%' : '75%', background:'#f2ede3', overflow:'hidden' }}>
        {img
          ? <img src={img} alt={p.name} loading="lazy" style={{ position:'absolute', inset:0, width:'100%', height:'100%', objectFit:'cover', transform: hovered ? 'scale(1.05)' : 'scale(1)', transition:'transform .4s ease' }}/>
          : <div style={{ position:'absolute', inset:0, display:'flex', alignItems:'center', justifyContent:'center', fontSize: isCompact ? 48 : 72 }}>📦</div>
        }

        {/* Badges */}
        <div style={{ position:'absolute', top:8, left:8, display:'flex', flexDirection:'column', gap:4 }}>
          {disc > 0 && <span style={{ background:'#e85528', color:'#fff', fontSize:10, fontWeight:700, padding:'2px 7px', borderRadius:4 }}>-{disc}%</span>}
          {p.badge && <span style={{ background: p.badge === 'Hot' || p.badge === 'Bestseller' ? '#fff0ed' : p.badge === 'New' ? '#e8f5ee' : '#fef9e7', color: p.badge === 'Hot' || p.badge === 'Bestseller' ? '#e85528' : p.badge === 'New' ? '#1a6b3c' : '#c8820a', fontSize:10, fontWeight:700, padding:'2px 7px', borderRadius:4 }}>{p.badge}</span>}
        </div>

        {/* Wishlist */}
        <button onClick={doWish} style={{ position:'absolute', top:8, right:8, width:30, height:30, borderRadius:'50%', border:'none', background:'rgba(255,255,255,.92)', fontSize:14, cursor:'pointer', display:'flex', alignItems:'center', justifyContent:'center', boxShadow:'0 1px 6px rgba(0,0,0,.1)', transition:'transform .15s' }}
          onMouseEnter={e => e.currentTarget.style.transform='scale(1.15)'}
          onMouseLeave={e => e.currentTarget.style.transform='scale(1)'}
        >{wished ? '❤️' : '🤍'}</button>

        {/* Add to cart overlay */}
        {!isCompact && (
          <div style={{ position:'absolute', bottom:0, left:0, right:0, padding:'8px 10px', background:'linear-gradient(transparent,rgba(28,20,9,.72))', transform: hovered ? 'translateY(0)' : 'translateY(110%)', transition:'transform .22s ease' }}>
            <button onClick={doAdd} style={{ width:'100%', padding:'8px', borderRadius:7, border:'none', background:'#fff', color:'#1c1409', fontSize:12, fontWeight:700, cursor:'pointer', transition:'background .15s' }}
              onMouseEnter={e => e.currentTarget.style.background='#faf8f3'}
              onMouseLeave={e => e.currentTarget.style.background='#fff'}
            >🛒 Add to Cart</button>
          </div>
        )}
      </div>

      {/* Info */}
      <div style={{ padding: isCompact ? '10px 10px 12px' : '12px 14px 14px' }}>
        <div style={{ fontSize:10, color:'#7a7268', marginBottom:3, overflow:'hidden', textOverflow:'ellipsis', whiteSpace:'nowrap' }}>{p.vendor?.storeName || p.vendor}</div>
        <div style={{ fontSize: isCompact ? 12 : 13, fontWeight:600, color:'#1c1409', marginBottom:5, lineHeight:1.35, display:'-webkit-box', WebkitLineClamp:2, WebkitBoxOrient:'vertical', overflow:'hidden' }}>{p.name}</div>
        <div style={{ display:'flex', alignItems:'center', gap:5, marginBottom:6 }}>
          <span style={{ color:'#f59e0b', fontSize:10 }}>{'★'.repeat(Math.round(p.rating || 0))}</span>
          {p.reviewCount > 0 && <span style={{ fontSize:10, color:'#7a7268' }}>({p.reviewCount})</span>}
        </div>
        <div style={{ display:'flex', alignItems:'baseline', gap:7, flexWrap:'wrap' }}>
          <span style={{ fontFamily:"'Fraunces',serif", fontSize: isCompact ? 15 : 17, fontWeight:800, color:'#1c1409' }}>{fmt(p.price)}</span>
          {p.oldPrice && <span style={{ fontSize:11, color:'#7a7268', textDecoration:'line-through' }}>{fmt(p.oldPrice)}</span>}
        </div>
        {isCompact && (
          <button onClick={doAdd} style={{ width:'100%', padding:'7px', marginTop:8, borderRadius:7, border:'1.5px solid #e8e4dc', background:'transparent', color:'#1c1409', fontSize:11, fontWeight:700, cursor:'pointer' }}>+ Add to Cart</button>
        )}
      </div>
    </div>
  )
}
