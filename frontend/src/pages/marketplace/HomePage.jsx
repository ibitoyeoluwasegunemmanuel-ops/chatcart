import { useState, useEffect, useRef } from 'react'
import { useNavigate, Link } from 'react-router-dom'
import { useQuery } from '@tanstack/react-query'
import Navbar from '../../components/marketplace/Navbar'
import CartDrawer from '../../components/marketplace/CartDrawer'
import ProductCard from '../../components/marketplace/ProductCard'
import { productsAPI, vendorsAPI } from '../../api'

const CATS = [
  { id:'Fashion',     icon:'👗', label:'Fashion'     },
  { id:'Beauty',      icon:'✨', label:'Beauty'      },
  { id:'Electronics', icon:'📱', label:'Electronics' },
  { id:'Home',        icon:'🏡', label:'Home'        },
  { id:'Jewelry',     icon:'💍', label:'Jewelry'     },
  { id:'Food',        icon:'🌶️', label:'Food'       },
  { id:'Sports',      icon:'⚽', label:'Sports'      },
  { id:'Kids',        icon:'🧸', label:'Kids'        },
]

const BANNERS = [
  { bg:'linear-gradient(135deg,#1c1409 0%,#3d2c0f 55%,#c8820a 100%)', tag:'NEW COLLECTION', headline:'Premium African\nFashion, Redefined', sub:'Shop latest Ankara & Kente styles', cta:'Shop Fashion', cat:'Fashion', emoji:'👗' },
  { bg:'linear-gradient(135deg,#0a1628 0%,#1a3a5c 55%,#2563eb 100%)', tag:'FLASH SALE — 40% OFF', headline:'Tech That Moves\nWith You', sub:'Premium electronics at unbeatable prices', cta:'Shop Electronics', cat:'Electronics', emoji:'🎧' },
  { bg:'linear-gradient(135deg,#0d2918 0%,#1a5c30 55%,#16a34a 100%)', tag:'ARTISAN COLLECTION', headline:'Handcrafted With\nSoul & Story', sub:"Authentic pieces from Nigeria's finest", cta:'Explore Crafts', cat:'Home', emoji:'🧺' },
]

const fmt = n => '₦' + Number(n).toLocaleString()

export default function HomePage() {
  const [cartOpen, setCartOpen] = useState(false)
  const [banner, setBanner]     = useState(0)
  const [timer, setTimer]       = useState({ h:5, m:42, s:17 })
  const nav = useNavigate()
  const pad = n => String(n).padStart(2, '0')

  const { data: flashData }    = useQuery({ queryKey:['flash'],   queryFn: () => productsAPI.getAll({ sort:'rating', limit:8 }) })
  const { data: popularData }  = useQuery({ queryKey:['popular'], queryFn: () => productsAPI.getAll({ sort:'popular', limit:12 }) })
  const { data: vendorData }   = useQuery({ queryKey:['vendors'], queryFn: vendorsAPI.getAll })

  const flashProducts   = flashData?.data?.products || []
  const popularProducts = popularData?.data?.products || []
  const vendors         = vendorData?.data?.vendors || []

  useEffect(() => {
    const t = setInterval(() => setBanner(b => (b + 1) % BANNERS.length), 5000)
    return () => clearInterval(t)
  }, [])

  useEffect(() => {
    const t = setInterval(() => {
      setTimer(prev => {
        let h = prev.h, m = prev.m, s = prev.s - 1
        if (s < 0) { s = 59; m-- }
        if (m < 0) { m = 59; h-- }
        return { h: Math.max(0, h), m, s }
      })
    }, 1000)
    return () => clearInterval(t)
  }, [])

  const B = BANNERS[banner]

  return (
    <div style={{ background:'#faf8f3', minHeight:'100vh', fontFamily:"'DM Sans',sans-serif" }}>
      <Navbar onCartOpen={() => setCartOpen(true)} />
      <CartDrawer open={cartOpen} onClose={() => setCartOpen(false)} />

      {/* ── HERO BANNER ── */}
      <div style={{ position:'relative', height:'clamp(240px,45vw,500px)', overflow:'hidden' }}>
        {BANNERS.map((b, i) => (
          <div key={i} style={{ position:'absolute', inset:0, background:b.bg, opacity: i===banner ? 1 : 0, transition:'opacity .8s ease' }}>
            <div style={{ position:'absolute', inset:0, backgroundImage:'radial-gradient(circle,rgba(255,255,255,.03) 1px,transparent 1px)', backgroundSize:'32px 32px' }}/>
            <div style={{ position:'absolute', right:'8%', top:'50%', transform:'translateY(-52%)', fontSize:'clamp(80px,15vw,160px)', opacity:.14 }}>{b.emoji}</div>
            <div style={{ position:'absolute', right:'12%', top:'50%', transform:'translateY(-52%)', fontSize:'clamp(60px,10vw,120px)', animation: i===banner ? 'popIn .6s ease' : '' }}>{b.emoji}</div>
          </div>
        ))}
        <div style={{ position:'absolute', inset:0, display:'flex', alignItems:'center', padding:'0 clamp(20px,5vw,64px)' }}>
          <div key={banner} style={{ animation:'fadeUp .5s ease', maxWidth:520 }}>
            <div style={{ display:'inline-block', padding:'3px 10px', background:'rgba(255,255,255,.15)', borderRadius:4, fontSize:9, fontWeight:700, letterSpacing:'.1em', color:'rgba(255,255,255,.9)', marginBottom:14 }}>{B.tag}</div>
            <h1 style={{ fontFamily:"'Fraunces',serif", fontSize:'clamp(22px,4vw,48px)', fontWeight:900, color:'#fff', lineHeight:1.05, marginBottom:12, whiteSpace:'pre-line' }}>{B.headline}</h1>
            <p style={{ fontSize:'clamp(11px,1.5vw,15px)', color:'rgba(255,255,255,.75)', marginBottom:24, lineHeight:1.65, maxWidth:380 }}>{B.sub}</p>
            <div style={{ display:'flex', gap:10, flexWrap:'wrap' }}>
              <button onClick={() => nav('/products?category='+B.cat)} style={{ padding:'10px 22px', background:'#fff', color:'#1c1409', border:'none', borderRadius:8, fontSize:13, fontWeight:700, cursor:'pointer' }}>{B.cta} →</button>
              <button onClick={() => nav('/products')} style={{ padding:'10px 18px', background:'transparent', color:'#fff', border:'1.5px solid rgba(255,255,255,.4)', borderRadius:8, fontSize:13, cursor:'pointer' }}>Browse All</button>
            </div>
          </div>
        </div>
        <div style={{ position:'absolute', bottom:14, left:'50%', transform:'translateX(-50%)', display:'flex', gap:6 }}>
          {BANNERS.map((_, i) => <button key={i} onClick={() => setBanner(i)} style={{ width: i===banner ? 22 : 7, height:7, borderRadius:4, background: i===banner ? '#fff' : 'rgba(255,255,255,.35)', border:'none', cursor:'pointer', transition:'all .3s' }}/>)}
        </div>
      </div>

      {/* ── CATEGORIES ── */}
      <div style={{ maxWidth:1320, margin:'0 auto', padding:'32px 16px 0' }}>
        <div style={{ display:'grid', gridTemplateColumns:'repeat(auto-fill,minmax(80px,1fr))', gap:10 }}>
          {CATS.map((c, i) => (
            <div key={c.id} onClick={() => nav('/products?category='+c.id)} style={{ textAlign:'center', padding:'16px 8px 12px', background:'#fff', border:'1px solid #e8e4dc', borderRadius:12, cursor:'pointer', transition:'all .2s', animation:'fadeUp .4s ease '+(i*40)+'ms both' }}
              onMouseEnter={e => { e.currentTarget.style.transform='translateY(-3px)'; e.currentTarget.style.borderColor='#c8820a' }}
              onMouseLeave={e => { e.currentTarget.style.transform='translateY(0)'; e.currentTarget.style.borderColor='#e8e4dc' }}>
              <div style={{ fontSize:28, marginBottom:7 }}>{c.icon}</div>
              <div style={{ fontSize:11, fontWeight:600, color:'#1c1409' }}>{c.label}</div>
            </div>
          ))}
        </div>
      </div>

      {/* ── FLASH DEALS ── */}
      {flashProducts.length > 0 && (
        <div style={{ maxWidth:1320, margin:'0 auto', padding:'36px 16px 0' }}>
          <div style={{ display:'flex', alignItems:'center', justifyContent:'space-between', marginBottom:20, flexWrap:'wrap', gap:10 }}>
            <div style={{ display:'flex', alignItems:'center', gap:14 }}>
              <h2 style={{ fontFamily:"'Fraunces',serif", fontSize:'clamp(20px,3vw,26px)', fontWeight:700, margin:0 }}>⚡ Flash Deals</h2>
              <div style={{ background:'#1c1409', color:'#faf8f3', borderRadius:8, padding:'5px 12px', fontSize:12, fontWeight:700, fontFamily:"'JetBrains Mono',monospace", letterSpacing:'.03em' }}>
                {pad(timer.h)}:{pad(timer.m)}:{pad(timer.s)}
              </div>
            </div>
            <Link to="/products?sort=rating" style={{ fontSize:12, fontWeight:600, color:'#c8820a', textDecoration:'none' }}>See All →</Link>
          </div>
          {/* Horizontal scroll on mobile, grid on desktop */}
          <div className="flash-scroll" style={{ display:'grid', gridTemplateColumns:'repeat(auto-fill,minmax(180px,1fr))', gap:14 }}>
            {flashProducts.slice(0,6).map((p, i) => (
              <div key={p._id} style={{ animation:'fadeUp .4s ease '+(i*50)+'ms both' }}>
                <ProductCard product={p} size="sm"/>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* ── PROMO SPLITS ── */}
      <div style={{ maxWidth:1320, margin:'36px auto 0', padding:'0 16px' }}>
        <div style={{ display:'grid', gridTemplateColumns:'repeat(auto-fit,minmax(260px,1fr))', gap:14 }}>
          {[{ bg:'linear-gradient(135deg,#1a0d00,#4a2800)', t:'Beauty Week 💄', s:'Top skincare deals', cat:'Beauty' },
            { bg:'linear-gradient(135deg,#0d1a0d,#1a4a1a)', t:'Artisan Picks 🪴', s:'Handcrafted with purpose', cat:'Home' },
            { bg:'linear-gradient(135deg,#0a1628,#1a3a5c)', t:'Tech Zone ⚡', s:'Gadgets up to 40% off', cat:'Electronics' }]
          .map((b, i) => (
            <div key={i} onClick={() => nav('/products?category='+b.cat)} style={{ background:b.bg, borderRadius:14, padding:'28px 28px 26px', cursor:'pointer', transition:'transform .2s' }}
              onMouseEnter={e => e.currentTarget.style.transform='translateY(-2px)'}
              onMouseLeave={e => e.currentTarget.style.transform='translateY(0)'}>
              <div style={{ fontSize:10, fontWeight:700, letterSpacing:'.1em', color:'rgba(255,255,255,.45)', marginBottom:8 }}>{b.cat.toUpperCase()}</div>
              <h3 style={{ fontFamily:"'Fraunces',serif", fontSize:'clamp(18px,2vw,24px)', fontWeight:900, color:'#fff', lineHeight:1.1, marginBottom:14 }}>{b.t}</h3>
              <p style={{ fontSize:12, color:'rgba(255,255,255,.6)', marginBottom:16 }}>{b.s}</p>
              <button style={{ padding:'7px 16px', background:'#fff', border:'none', borderRadius:6, fontSize:12, fontWeight:700, cursor:'pointer', color:'#1c1409' }}>Shop Now →</button>
            </div>
          ))}
        </div>
      </div>

      {/* ── FEATURED VENDORS ── */}
      {vendors.length > 0 && (
        <div style={{ maxWidth:1320, margin:'36px auto 0', padding:'0 16px' }}>
          <div style={{ display:'flex', justifyContent:'space-between', alignItems:'flex-end', marginBottom:20 }}>
            <div>
              <h2 style={{ fontFamily:"'Fraunces',serif", fontSize:'clamp(20px,3vw,26px)', fontWeight:700, margin:0 }}>Top Stores</h2>
              <p style={{ fontSize:12, color:'#7a7268', marginTop:4 }}>Verified vendors you can trust</p>
            </div>
            <Link to="/vendors" style={{ fontSize:12, fontWeight:600, color:'#c8820a', textDecoration:'none' }}>All Stores →</Link>
          </div>
          <div style={{ display:'grid', gridTemplateColumns:'repeat(auto-fill,minmax(160px,1fr))', gap:12 }}>
            {vendors.slice(0,6).map(v => (
              <div key={v._id} onClick={() => nav('/store/'+v.slug)} style={{ background:'#fff', border:'1px solid #e8e4dc', borderRadius:12, padding:'18px 14px', textAlign:'center', cursor:'pointer', transition:'all .2s' }}
                onMouseEnter={e => { e.currentTarget.style.transform='translateY(-3px)'; e.currentTarget.style.borderColor='#c8820a' }}
                onMouseLeave={e => { e.currentTarget.style.transform='translateY(0)'; e.currentTarget.style.borderColor='#e8e4dc' }}>
                <div style={{ width:48, height:48, borderRadius:'50%', background:'#f2ede3', display:'flex', alignItems:'center', justifyContent:'center', margin:'0 auto 10px', fontSize:24 }}>🏪</div>
                <div style={{ fontSize:13, fontWeight:700, color:'#1c1409', marginBottom:3, overflow:'hidden', textOverflow:'ellipsis', whiteSpace:'nowrap' }}>{v.storeName}</div>
                <div style={{ fontSize:11, color:'#f59e0b' }}>{'★'.repeat(Math.round(v.rating || 4))} <span style={{ color:'#7a7268' }}>({v.reviewCount || 0})</span></div>
                {v.status === 'active' && <div style={{ fontSize:10, fontWeight:700, color:'#1a6b3c', marginTop:6, background:'#e8f5ee', padding:'2px 8px', borderRadius:4, display:'inline-block' }}>✓ Verified</div>}
              </div>
            ))}
          </div>
        </div>
      )}

      {/* ── ALL PRODUCTS ── */}
      {popularProducts.length > 0 && (
        <div style={{ maxWidth:1320, margin:'36px auto 0', padding:'0 16px 48px' }}>
          <div style={{ display:'flex', justifyContent:'space-between', alignItems:'flex-end', marginBottom:20 }}>
            <div>
              <h2 style={{ fontFamily:"'Fraunces',serif", fontSize:'clamp(20px,3vw,26px)', fontWeight:700, margin:0 }}>Just For You</h2>
              <p style={{ fontSize:12, color:'#7a7268', marginTop:4 }}>Curated picks from verified vendors</p>
            </div>
            <Link to="/products" style={{ fontSize:12, fontWeight:600, color:'#c8820a', textDecoration:'none' }}>View All →</Link>
          </div>
          <div style={{ display:'grid', gridTemplateColumns:'repeat(auto-fill,minmax(170px,1fr))', gap:14 }}>
            {popularProducts.map((p, i) => (
              <div key={p._id} style={{ animation:'fadeUp .4s ease '+(i*30)+'ms both' }}>
                <ProductCard product={p}/>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* ── FOOTER ── */}
      <footer style={{ background:'#1c1409', color:'#faf8f3', marginTop:16 }}>
        <div style={{ maxWidth:1320, margin:'0 auto', padding:'40px 16px 24px' }}>
          <div style={{ display:'grid', gridTemplateColumns:'repeat(auto-fit,minmax(160px,1fr))', gap:32, marginBottom:36 }}>
            <div>
              <div style={{ display:'flex', alignItems:'center', gap:8, marginBottom:12 }}>
                <div style={{ width:30, height:30, background:'rgba(255,255,255,.1)', borderRadius:8, display:'flex', alignItems:'center', justifyContent:'center', fontSize:15 }}>🛒</div>
                <span style={{ fontFamily:"'Fraunces',serif", fontSize:18, fontWeight:900 }}>ChatCart</span>
              </div>
              <p style={{ fontSize:12, color:'rgba(255,255,255,.45)', lineHeight:1.75, maxWidth:220 }}>Africa's AI-powered social commerce platform. Empowering vendors, delighting customers.</p>
            </div>
            {[['Marketplace',['Browse Products','Flash Deals','New Arrivals','Top Vendors']],['Vendors',['Start Selling','Vendor Dashboard','Pricing Plans','AI Tools']],['Company',['About Us','Blog','Careers','Contact']]].map(([t, ls]) => (
              <div key={t}>
                <div style={{ fontSize:11, fontWeight:700, color:'rgba(255,255,255,.7)', letterSpacing:'.08em', textTransform:'uppercase', marginBottom:14 }}>{t}</div>
                {ls.map(l => <div key={l} style={{ fontSize:12, color:'rgba(255,255,255,.4)', marginBottom:9, cursor:'pointer' }}>{l}</div>)}
              </div>
            ))}
          </div>
          <div style={{ borderTop:'1px solid rgba(255,255,255,.08)', paddingTop:20, display:'flex', justifyContent:'space-between', alignItems:'center', flexWrap:'wrap', gap:12 }}>
            <div style={{ fontSize:12, color:'rgba(255,255,255,.3)' }}>© 2025 ChatCart. Built for African commerce.</div>
            <div style={{ display:'flex', gap:16 }}>
              {['Privacy','Terms','Cookies'].map(l => <span key={l} style={{ fontSize:12, color:'rgba(255,255,255,.3)', cursor:'pointer' }}>{l}</span>)}
            </div>
          </div>
        </div>
      </footer>

      <style>{`
        @keyframes fadeUp { from { opacity:0; transform:translateY(14px) } to { opacity:1; transform:translateY(0) } }
        @keyframes popIn  { from { transform:scale(0.92); opacity:0 } to { transform:scale(1); opacity:1 } }
        @media (max-width:600px) {
          .flash-scroll { grid-template-columns: repeat(2,1fr) !important; }
        }
      `}</style>
    </div>
  )
}
