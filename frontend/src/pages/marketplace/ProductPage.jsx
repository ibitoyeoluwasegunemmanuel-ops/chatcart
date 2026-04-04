import { useState } from 'react'
import { useParams, useNavigate, Link } from 'react-router-dom'
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { productsAPI, reviewsAPI } from '../../api'
import { useCart, useWishlist } from '../../hooks/useCart'
import { useAuth } from '../../context/AuthContext'
import Navbar from '../../components/marketplace/Navbar'
import CartDrawer from '../../components/marketplace/CartDrawer'
import ProductCard from '../../components/marketplace/ProductCard'
import toast from 'react-hot-toast'

const fmt = n => String.fromCharCode(8358) + Number(n).toLocaleString()

export default function ProductPage() {
  const { id } = useParams()
  const nav = useNavigate()
  const { add } = useCart()
  const { toggle, has } = useWishlist()
  const { user } = useAuth()
  const qc = useQueryClient()
  const [cartOpen, setCartOpen] = useState(false)
  const [qty, setQty] = useState(1)
  const [activeImg, setActiveImg] = useState(0)
  const [tab, setTab] = useState('description')
  const [review, setReview] = useState({ rating:5, comment:'' })

  const { data: pd, isLoading } = useQuery({ queryKey:['product',id], queryFn:() => productsAPI.getOne(id), enabled:!!id })
  const { data: rd } = useQuery({ queryKey:['reviews',id], queryFn:() => reviewsAPI.getForProduct(id), enabled:!!id })
  const { data: relD } = useQuery({ queryKey:['related',id], queryFn:() => productsAPI.getAll({ limit:4 }), enabled:!!id })

  const submitReview = useMutation({
    mutationFn: () => reviewsAPI.create({ productId:id, rating:review.rating, comment:review.comment }),
    onSuccess: () => { toast.success('Review submitted!'); setReview({rating:5,comment:''}); qc.invalidateQueries(['reviews',id]) },
    onError: err => toast.error(err.response?.data?.message || 'Error submitting review'),
  })

  const p = pd?.data?.product
  const reviews = rd?.data?.reviews || []
  const related = (relD?.data?.products || []).filter(x => x._id !== id).slice(0,4)
  const wished = has(p?._id)

  if (isLoading) return (
    <div style={{ background:'#faf8f3', minHeight:'100vh', fontFamily:"'DM Sans',sans-serif" }}>
      <Navbar onCartOpen={() => setCartOpen(true)}/>
      <div style={{ maxWidth:1320, margin:'0 auto', padding:'32px 16px', display:'grid', gridTemplateColumns:'1fr 1fr', gap:48 }}>
        <div style={{ background:'#f2ede3', borderRadius:16, aspectRatio:'1', animation:'pulse 1.5s infinite' }}/>
        <div style={{ display:'flex', flexDirection:'column', gap:14 }}>{[200,280,120,80,60].map((w,i)=><div key={i} style={{ height:18, background:'#f2ede3', borderRadius:6, width:w, animation:'pulse 1.5s infinite' }}/>)}</div>
      </div>
      <style>{"@keyframes pulse{0%,100%{opacity:1}50%{opacity:.5}}"}</style>
    </div>
  )

  if (!p) return (
    <div style={{ background:'#faf8f3', minHeight:'100vh', fontFamily:"'DM Sans',sans-serif" }}>
      <Navbar onCartOpen={() => setCartOpen(true)}/>
      <div style={{ textAlign:'center', padding:'80px 20px' }}>
        <div style={{ fontSize:52, marginBottom:16 }}>🔍</div>
        <h2 style={{ fontFamily:"'Fraunces',serif", fontSize:24, marginBottom:16 }}>Product not found</h2>
        <button onClick={() => nav('/products')} style={{ padding:'11px 24px', background:'#1c1409', color:'#fff', border:'none', borderRadius:8, fontSize:13, fontWeight:700, cursor:'pointer' }}>Browse Products</button>
      </div>
    </div>
  )

  const images = p.images?.length ? p.images : [null]
  const inStock = p.stock > 0
  const disc = p.oldPrice ? Math.round((1 - p.price/p.oldPrice)*100) : 0

  return (
    <div style={{ background:'#faf8f3', minHeight:'100vh', fontFamily:"'DM Sans',sans-serif" }}>
      <Navbar onCartOpen={() => setCartOpen(true)}/>
      <CartDrawer open={cartOpen} onClose={() => setCartOpen(false)}/>

      <div style={{ background:'#fff', borderBottom:'1px solid #e8e4dc', padding:'10px 0' }}>
        <div style={{ maxWidth:1320, margin:'0 auto', padding:'0 16px', fontSize:12, color:'#7a7268', display:'flex', gap:6, flexWrap:'wrap' }}>
          <Link to="/" style={{ color:'#c8820a', textDecoration:'none' }}>Home</Link><span>/</span>
          <Link to={'/products?category='+p.category} style={{ color:'#c8820a', textDecoration:'none' }}>{p.category}</Link><span>/</span>
          <span style={{ color:'#1c1409', fontWeight:500 }}>{p.name}</span>
        </div>
      </div>

      <div style={{ maxWidth:1320, margin:'0 auto', padding:'28px 16px' }}>
        <div style={{ display:'grid', gridTemplateColumns:'1fr 1fr', gap:'clamp(20px,4vw,52px)', marginBottom:48 }}>
          <div>
            <div style={{ background:'#f2ede3', borderRadius:16, overflow:'hidden', marginBottom:12, aspectRatio:'1', position:'relative' }}>
              {images[activeImg] ? <img src={images[activeImg]} alt={p.name} style={{ width:'100%', height:'100%', objectFit:'cover' }}/> : <div style={{ width:'100%', height:'100%', display:'flex', alignItems:'center', justifyContent:'center', fontSize:100 }}>📦</div>}
              {disc > 0 && <span style={{ position:'absolute', top:14, left:14, background:'#e85528', color:'#fff', fontSize:12, fontWeight:700, padding:'4px 10px', borderRadius:6 }}>-{disc}%</span>}
              {!inStock && <div style={{ position:'absolute', inset:0, background:'rgba(255,255,255,.7)', display:'flex', alignItems:'center', justifyContent:'center' }}><span style={{ background:'#1c1409', color:'#fff', padding:'8px 20px', borderRadius:8, fontWeight:700 }}>Out of Stock</span></div>}
            </div>
            {images.length > 1 && (
              <div style={{ display:'flex', gap:8 }}>
                {images.map((img,i) => (
                  <div key={i} onClick={() => setActiveImg(i)} style={{ width:68, height:68, borderRadius:9, overflow:'hidden', cursor:'pointer', border: i===activeImg?'2px solid #1c1409':'2px solid transparent', background:'#f2ede3', flexShrink:0 }}>
                    {img ? <img src={img} alt="" style={{ width:'100%', height:'100%', objectFit:'cover' }}/> : <div style={{ width:'100%', height:'100%', display:'flex', alignItems:'center', justifyContent:'center', fontSize:24 }}>📦</div>}
                  </div>
                ))}
              </div>
            )}
          </div>

          <div>
            {p.badge && <span style={{ display:'inline-block', padding:'3px 10px', borderRadius:4, fontSize:10, fontWeight:700, background:'#fff0ed', color:'#e85528', marginBottom:12 }}>{p.badge}</span>}
            <h1 style={{ fontFamily:"'Fraunces',serif", fontSize:'clamp(22px,3vw,34px)', fontWeight:700, color:'#1c1409', lineHeight:1.2, marginBottom:10 }}>{p.name}</h1>

            <div style={{ display:'flex', alignItems:'center', gap:10, marginBottom:16 }}>
              <div style={{ display:'flex', gap:2 }}>{[1,2,3,4,5].map(s=><span key={s} style={{ fontSize:13, color:s<=Math.round(p.rating||0)?'#f59e0b':'#ddd' }}>★</span>)}</div>
              <span style={{ fontSize:13, color:'#7a7268' }}>{(p.rating||0).toFixed(1)} · {p.reviewCount||0} reviews</span>
              <span style={{ width:1, height:14, background:'#e8e4dc' }}/>
              <span style={{ fontSize:13, fontWeight:600, color:p.stock>5?'#1a6b3c':p.stock>0?'#d97706':'#dc2626' }}>
                {p.stock>5?'In Stock':p.stock>0?'Only '+p.stock+' left':'Out of Stock'}
              </span>
            </div>

            <div style={{ display:'flex', alignItems:'baseline', gap:12, padding:'18px 0', borderTop:'1px solid #e8e4dc', borderBottom:'1px solid #e8e4dc', marginBottom:20 }}>
              <span style={{ fontFamily:"'Fraunces',serif", fontSize:'clamp(28px,4vw,40px)', fontWeight:900, color:'#1c1409' }}>{fmt(p.price)}</span>
              {p.oldPrice && <><span style={{ fontSize:16, color:'#7a7268', textDecoration:'line-through' }}>{fmt(p.oldPrice)}</span><span style={{ fontSize:13, color:'#e85528', fontWeight:700 }}>Save {fmt(p.oldPrice-p.price)}</span></>}
            </div>

            {p.vendor && (
              <Link to={'/store/'+p.vendor.slug} style={{ display:'flex', alignItems:'center', gap:12, padding:'13px 16px', background:'#fff', borderRadius:10, marginBottom:20, border:'1px solid #e8e4dc', textDecoration:'none', transition:'border-color .2s' }}>
                <div style={{ width:40, height:40, borderRadius:'50%', background:'#f2ede3', display:'flex', alignItems:'center', justifyContent:'center', fontSize:20 }}>🏪</div>
                <div style={{ flex:1 }}><div style={{ fontSize:11, color:'#7a7268' }}>Sold by</div><div style={{ fontSize:14, fontWeight:700, color:'#1c1409' }}>{p.vendor.storeName}</div></div>
                <span style={{ fontSize:12, color:'#c8820a', fontWeight:600 }}>Visit →</span>
              </Link>
            )}

            <div style={{ display:'flex', gap:10, marginBottom:12 }}>
              <div style={{ display:'flex', alignItems:'center', border:'1.5px solid #e8e4dc', borderRadius:9, overflow:'hidden' }}>
                <button onClick={() => setQty(q=>Math.max(1,q-1))} style={{ width:42, height:50, border:'none', background:'#faf8f3', fontSize:20, cursor:'pointer', fontWeight:700, color:'#1c1409' }}>-</button>
                <span style={{ width:46, textAlign:'center', fontSize:15, fontWeight:700, color:'#1c1409' }}>{qty}</span>
                <button onClick={() => setQty(q=>Math.min(p.stock,q+1))} disabled={qty>=p.stock} style={{ width:42, height:50, border:'none', background:'#faf8f3', fontSize:20, cursor:qty>=p.stock?'not-allowed':'pointer', fontWeight:700, color:qty>=p.stock?'#ccc':'#1c1409' }}>+</button>
              </div>
              <button onClick={() => { add(p,qty); toast.success(p.name+' added to cart') }} disabled={!inStock} style={{ flex:1, padding:'14px', background:inStock?'#e85528':'#ccc', color:'#fff', border:'none', borderRadius:9, fontSize:14, fontWeight:700, cursor:inStock?'pointer':'not-allowed' }}>Add to Cart</button>
              <button onClick={() => toggle(p)} style={{ width:50, height:50, borderRadius:9, border:'1.5px solid '+(wished?'#e85528':'#e8e4dc'), background:wished?'#fff0ed':'#fff', fontSize:22, cursor:'pointer' }}>{wished?'❤️':'🤍'}</button>
            </div>

            <button onClick={() => { add(p,qty); nav('/checkout') }} disabled={!inStock} style={{ width:'100%', padding:'14px', background:'#1c1409', color:'#faf8f3', border:'none', borderRadius:9, fontSize:15, fontWeight:800, cursor:inStock?'pointer':'not-allowed', marginBottom:18 }}>
              Buy Now — {fmt(p.price*qty)}
            </button>

            <div style={{ display:'flex', gap:14, flexWrap:'wrap' }}>
              {[['🔒','Secure payment'],['🚚','Fast delivery'],['↩️','Easy returns'],['✅','Verified vendor']].map(([ic,lb]) => (
                <span key={lb} style={{ fontSize:11, color:'#7a7268', display:'flex', alignItems:'center', gap:4 }}>{ic} {lb}</span>
              ))}
            </div>

            {p.vendor?.whatsapp && (
              <a href={'https://wa.me/'+p.vendor.whatsapp.replace(/\D/g,'')} target="_blank" rel="noreferrer" style={{ display:'flex', alignItems:'center', gap:8, padding:'11px 16px', background:'#25d366', color:'#fff', borderRadius:9, textDecoration:'none', fontSize:13, fontWeight:700, marginTop:16 }}>
                💬 Chat with vendor
              </a>
            )}
          </div>
        </div>

        <div style={{ borderBottom:'1px solid #e8e4dc', display:'flex', gap:0, marginBottom:28 }}>
          {['description','reviews'].map(t => (
            <button key={t} onClick={() => setTab(t)} style={{ padding:'11px 22px', border:'none', background:'transparent', fontSize:14, fontWeight:tab===t?700:400, color:tab===t?'#1c1409':'#7a7268', borderBottom:'2px solid '+(tab===t?'#1c1409':'transparent'), cursor:'pointer', fontFamily:"'DM Sans',sans-serif", textTransform:'capitalize' }}>
              {t}{t==='reviews'?' ('+reviews.length+')':''}
            </button>
          ))}
        </div>

        {tab==='description' && <div style={{ maxWidth:720, marginBottom:48, fontSize:15, color:'#2d2926', lineHeight:1.85 }}>{p.description||'No description provided.'}</div>}

        {tab==='reviews' && (
          <div style={{ display:'grid', gridTemplateColumns:'1fr 1fr', gap:24, marginBottom:48 }}>
            <div>
              {reviews.length===0 ? <div style={{ color:'#7a7268', fontSize:14, padding:'40px 0' }}>No reviews yet. Be the first to review!</div>
              : reviews.map(r => (
                <div key={r._id} style={{ background:'#fff', border:'1px solid #e8e4dc', borderRadius:12, padding:'16px 18px', marginBottom:14 }}>
                  <div style={{ display:'flex', justifyContent:'space-between', marginBottom:8 }}>
                    <div style={{ display:'flex', alignItems:'center', gap:9 }}>
                      <div style={{ width:34, height:34, borderRadius:'50%', background:'#f2ede3', display:'flex', alignItems:'center', justifyContent:'center', fontSize:14, fontWeight:700, color:'#7a7268' }}>{(r.customer?.name||'U')[0]}</div>
                      <div><div style={{ fontSize:13, fontWeight:600, color:'#1c1409' }}>{r.customer?.name||'Customer'}</div><div style={{ fontSize:11, color:'#7a7268' }}>{new Date(r.createdAt).toLocaleDateString()}</div></div>
                    </div>
                    <div style={{ display:'flex', gap:2 }}>{[1,2,3,4,5].map(s=><span key={s} style={{ fontSize:13, color:s<=r.rating?'#f59e0b':'#ddd' }}>★</span>)}</div>
                  </div>
                  <p style={{ fontSize:13, color:'#2d2926', lineHeight:1.65 }}>{r.comment}</p>
                </div>
              ))}
            </div>
            {user && (
              <div style={{ background:'#faf8f3', borderRadius:14, padding:22, border:'1px solid #e8e4dc', position:'sticky', top:80, height:'fit-content' }}>
                <h3 style={{ fontFamily:"'Fraunces',serif", fontSize:18, fontWeight:700, marginBottom:16 }}>Write a Review</h3>
                <div style={{ marginBottom:14 }}>
                  <div style={{ fontSize:11, fontWeight:700, color:'#7a7268', letterSpacing:'.05em', textTransform:'uppercase', marginBottom:8 }}>Rating</div>
                  <div style={{ display:'flex', gap:4 }}>
                    {[1,2,3,4,5].map(s=><span key={s} onClick={() => setReview(r=>({...r,rating:s}))} style={{ fontSize:28, color:s<=review.rating?'#f59e0b':'#ddd', cursor:'pointer', transition:'color .15s' }}>★</span>)}
                  </div>
                </div>
                <textarea value={review.comment} onChange={e=>setReview(r=>({...r,comment:e.target.value}))} placeholder="Share your experience..." rows={4} style={{ width:'100%', padding:'10px 12px', border:'1.5px solid #ddd8ce', borderRadius:8, fontSize:13, resize:'vertical', fontFamily:"'DM Sans',sans-serif", outline:'none', marginBottom:14 }}/>
                <button onClick={() => submitReview.mutate()} disabled={!review.comment||submitReview.isLoading} style={{ width:'100%', padding:'11px', background:'#1c1409', color:'#faf8f3', border:'none', borderRadius:8, fontSize:13, fontWeight:700, cursor:'pointer', opacity:!review.comment?.6:1 }}>
                  {submitReview.isLoading?'Submitting...':'Submit Review'}
                </button>
              </div>
            )}
          </div>
        )}

        {related.length > 0 && (
          <div>
            <h2 style={{ fontFamily:"'Fraunces',serif", fontSize:22, fontWeight:700, marginBottom:18 }}>You May Also Like</h2>
            <div style={{ display:'grid', gridTemplateColumns:'repeat(auto-fill,minmax(180px,1fr))', gap:14 }}>
              {related.map(rp => <ProductCard key={rp._id} product={rp}/>)}
            </div>
          </div>
        )}
      </div>
      <style>{"@media(max-width:768px){div[style*='grid-template-columns: 1fr 1fr']{grid-template-columns:1fr!important}}"}</style>
    </div>
  )
}
