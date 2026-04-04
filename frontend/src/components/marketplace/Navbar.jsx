import { useState, useRef, useEffect } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { useCart } from '../../hooks/useCart'
import { useAuth } from '../../context/AuthContext'
import { productsAPI } from '../../api'

const CATS = ['Fashion','Beauty','Electronics','Home','Jewelry','Food','Sports']

export default function Navbar({ onCartOpen }) {
  const [srch,   setSrch]   = useState('')
  const [srchFocus, setSrchFocus] = useState(false)
  const [results, setResults] = useState([])
  const [mobileMenu, setMobileMenu] = useState(false)
  const { count } = useCart()
  const { user, logout } = useAuth()
  const nav = useNavigate()
  const timer = useRef(null)
  const fmt = n => '₦' + Number(n).toLocaleString()

  // Debounced instant search
  useEffect(() => {
    clearTimeout(timer.current)
    if (srch.length < 2) { setResults([]); return }
    timer.current = setTimeout(async () => {
      try {
        const res = await productsAPI.getAll({ search: srch, limit: 6 })
        setResults(res.data.products || [])
      } catch { setResults([]) }
    }, 280)
    return () => clearTimeout(timer.current)
  }, [srch])

  const go = (path) => { nav(path); setSrch(''); setResults([]); setSrchFocus(false); setMobileMenu(false) }

  return (
    <>
      {/* Announcement bar */}
      <div style={{ background:'#1c1409', color:'#faf8f3', fontSize:11, fontWeight:500, letterSpacing:'.04em', textAlign:'center', padding:'7px 16px', display:'flex', gap:24, justifyContent:'center', flexWrap:'wrap' }}>
        <span>🚚 Free delivery above ₦15,000</span>
        <span style={{ opacity:.3 }}>|</span>
        <span>⚡ Up to 60% off — Flash Sale</span>
        <span style={{ opacity:.3 }}>|</span>
        <span>🌍 Delivering across Nigeria & West Africa</span>
      </div>

      {/* Main navbar */}
      <nav style={{ position:'sticky', top:0, zIndex:100, background:'#fff', borderBottom:'1px solid #e8e4dc', boxShadow:'0 1px 6px rgba(28,20,9,.06)' }}>
        <div style={{ maxWidth:1320, margin:'0 auto', padding:'0 16px', height:64, display:'flex', alignItems:'center', gap:12 }}>

          {/* Logo */}
          <Link to="/" style={{ display:'flex', alignItems:'center', gap:8, textDecoration:'none', flexShrink:0 }}>
            <div style={{ width:34, height:34, background:'#1c1409', borderRadius:9, display:'flex', alignItems:'center', justifyContent:'center', fontSize:17 }}>🛒</div>
            <span style={{ fontFamily:"'Fraunces',serif", fontSize:20, fontWeight:900, color:'#1c1409', letterSpacing:'-.02em' }}>ChatCart</span>
          </Link>

          {/* Desktop category links */}
          <div className="hide-mobile" style={{ display:'flex', gap:0, marginLeft:8 }}>
            {CATS.slice(0,5).map(c => (
              <button key={c} onClick={() => go('/products?category='+c)} style={{ padding:'6px 10px', border:'none', background:'transparent', fontSize:12, color:'#2d2926', cursor:'pointer', fontFamily:"'DM Sans',sans-serif", fontWeight:500, borderRadius:6, transition:'color .15s' }}
                onMouseEnter={e => e.currentTarget.style.color='#c8820a'}
                onMouseLeave={e => e.currentTarget.style.color='#2d2926'}>
                {c}
              </button>
            ))}
          </div>

          {/* Search bar */}
          <div style={{ flex:1, position:'relative', maxWidth:440 }}>
            <div style={{ position:'relative' }}>
              <span style={{ position:'absolute', left:11, top:'50%', transform:'translateY(-50%)', fontSize:14, color:'#7a7268' }}>🔍</span>
              <input
                value={srch} onChange={e => setSrch(e.target.value)}
                onFocus={() => setSrchFocus(true)}
                onBlur={() => setTimeout(() => setSrchFocus(false), 200)}
                onKeyDown={e => { if (e.key === 'Enter' && srch) go('/products?q='+srch) }}
                placeholder="Search products, stores..."
                style={{ width:'100%', padding:'10px 12px 10px 36px', border:'1.5px solid #ddd8ce', borderRadius:10, fontSize:13, background:'#faf8f3', fontFamily:"'DM Sans',sans-serif", outline:'none', transition:'border-color .2s' }}
                onFocusCapture={e => e.currentTarget.style.borderColor='#1c1409'}
                onBlurCapture={e => e.currentTarget.style.borderColor='#ddd8ce'}
              />
            </div>

            {/* Search dropdown */}
            {srchFocus && (srch.length >= 2) && (
              <div style={{ position:'absolute', top:'calc(100% + 6px)', left:0, right:0, background:'#fff', border:'1px solid #e8e4dc', borderRadius:12, boxShadow:'0 8px 32px rgba(28,20,9,.12)', zIndex:200, overflow:'hidden' }}>
                {results.length === 0
                  ? <div style={{ padding:'14px 16px', fontSize:13, color:'#7a7268' }}>No results for "{srch}"</div>
                  : results.map(p => (
                    <div key={p._id} onClick={() => go('/product/'+p._id)} style={{ display:'flex', alignItems:'center', gap:10, padding:'10px 14px', cursor:'pointer', transition:'background .15s', borderBottom:'1px solid #f5f5f0' }}
                      onMouseEnter={e => e.currentTarget.style.background='#faf8f3'}
                      onMouseLeave={e => e.currentTarget.style.background='transparent'}
                    >
                      <div style={{ width:36, height:36, background:'#f2ede3', borderRadius:7, display:'flex', alignItems:'center', justifyContent:'center', fontSize:18, flexShrink:0 }}>
                        {p.images?.[0] ? <img src={p.images[0]} style={{ width:'100%', height:'100%', objectFit:'cover', borderRadius:7 }} alt={p.name}/> : '📦'}
                      </div>
                      <div style={{ flex:1, minWidth:0 }}>
                        <div style={{ fontSize:13, fontWeight:600, color:'#1c1409', overflow:'hidden', textOverflow:'ellipsis', whiteSpace:'nowrap' }}>{p.name}</div>
                        <div style={{ fontSize:11, color:'#7a7268' }}>{p.category}</div>
                      </div>
                      <span style={{ fontSize:13, fontWeight:700, color:'#1c1409', flexShrink:0 }}>{fmt(p.price)}</span>
                    </div>
                  ))
                }
                <div onClick={() => go('/products?q='+srch)} style={{ padding:'10px 14px', fontSize:12, color:'#c8820a', fontWeight:600, cursor:'pointer', borderTop:'1px solid #f5f5f0' }}>
                  See all results for "{srch}" →
                </div>
              </div>
            )}
          </div>

          {/* Right actions */}
          <div style={{ display:'flex', alignItems:'center', gap:4, marginLeft:'auto' }}>

            {/* Wishlist */}
            <button onClick={() => go('/wishlist')} className="hide-mobile" style={{ display:'flex', flexDirection:'column', alignItems:'center', gap:1, padding:'5px 8px', border:'none', background:'transparent', cursor:'pointer', borderRadius:8, color:'#2d2926', fontSize:10, fontWeight:500 }}>
              <span style={{ fontSize:19 }}>🤍</span>Saved
            </button>

            {/* Orders */}
            {user && (
              <button onClick={() => go('/orders')} className="hide-mobile" style={{ display:'flex', flexDirection:'column', alignItems:'center', gap:1, padding:'5px 8px', border:'none', background:'transparent', cursor:'pointer', borderRadius:8, color:'#2d2926', fontSize:10, fontWeight:500 }}>
                <span style={{ fontSize:19 }}>📦</span>Orders
              </button>
            )}

            {/* Cart */}
            <button onClick={onCartOpen} style={{ display:'flex', flexDirection:'column', alignItems:'center', gap:1, padding:'5px 8px', border:'none', background:'transparent', cursor:'pointer', borderRadius:8, color:'#2d2926', fontSize:10, fontWeight:500, position:'relative' }}>
              <span style={{ fontSize:19 }}>🛒</span>
              Cart
              {count > 0 && <span style={{ position:'absolute', top:1, right:4, width:16, height:16, background:'#e85528', borderRadius:'50%', fontSize:9, fontWeight:700, color:'#fff', display:'flex', alignItems:'center', justifyContent:'center' }}>{count}</span>}
            </button>

            <div style={{ width:1, height:22, background:'#ddd8ce', margin:'0 4px' }} className="hide-mobile"/>

            {/* Auth / Dashboard */}
            {user
              ? <button onClick={() => go(user.role === 'admin' ? '/admin' : '/vendor')} className="hide-mobile" style={{ padding:'8px 16px', background:'#1c1409', color:'#faf8f3', border:'none', borderRadius:8, fontSize:12, fontWeight:700, cursor:'pointer' }}>
                  Dashboard →
                </button>
              : <button onClick={() => go('/login')} className="hide-mobile" style={{ padding:'8px 16px', background:'#1c1409', color:'#faf8f3', border:'none', borderRadius:8, fontSize:12, fontWeight:700, cursor:'pointer' }}>
                  Sign In
                </button>
            }

            {/* Mobile menu toggle */}
            <button onClick={() => setMobileMenu(m => !m)} className="hide-desktop" style={{ padding:8, border:'none', background:'transparent', cursor:'pointer', fontSize:20 }}>
              {mobileMenu ? '✕' : '☰'}
            </button>
          </div>
        </div>

        {/* Mobile menu */}
        {mobileMenu && (
          <div style={{ background:'#fff', borderTop:'1px solid #e8e4dc', padding:'12px 16px 20px' }}>
            <div style={{ display:'grid', gridTemplateColumns:'repeat(3,1fr)', gap:8, marginBottom:14 }}>
              {CATS.map(c => (
                <button key={c} onClick={() => go('/products?category='+c)} style={{ padding:'10px 8px', border:'1px solid #e8e4dc', borderRadius:9, background:'#faf8f3', fontSize:12, fontWeight:600, color:'#1c1409', cursor:'pointer' }}>{c}</button>
              ))}
            </div>
            <div style={{ display:'flex', gap:10 }}>
              {user
                ? <><button onClick={() => go(user.role==='admin'?'/admin':'/vendor')} style={{ flex:1, padding:'11px', background:'#1c1409', color:'#fff', border:'none', borderRadius:8, fontSize:13, fontWeight:700, cursor:'pointer' }}>Dashboard</button>
                     <button onClick={() => { logout(); setMobileMenu(false) }} style={{ padding:'11px 14px', background:'transparent', color:'#e85528', border:'1px solid #e85528', borderRadius:8, fontSize:13, cursor:'pointer' }}>Sign Out</button></>
                : <button onClick={() => go('/login')} style={{ flex:1, padding:'11px', background:'#1c1409', color:'#fff', border:'none', borderRadius:8, fontSize:13, fontWeight:700, cursor:'pointer' }}>Sign In / Register</button>
              }
            </div>
          </div>
        )}
      </nav>

      <style>{`.hide-desktop { display:none } @media(max-width:768px){ .hide-mobile{display:none!important} .hide-desktop{display:flex!important} }`}</style>
    </>
  )
}
