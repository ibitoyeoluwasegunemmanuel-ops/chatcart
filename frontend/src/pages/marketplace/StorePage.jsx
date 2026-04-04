import { useState } from 'react'
import { useParams, Link } from 'react-router-dom'
import { useQuery } from '@tanstack/react-query'
import { vendorsAPI } from '../../api'
import Navbar from '../../components/marketplace/Navbar'
import CartDrawer from '../../components/marketplace/CartDrawer'
import ProductCard from '../../components/marketplace/ProductCard'

export default function StorePage() {
  const { slug } = useParams()
  const [cartOpen, setCartOpen] = useState(false)
  const [cat, setCat] = useState('all')
  const { data, isLoading } = useQuery({ queryKey:['store',slug], queryFn:() => vendorsAPI.getStore(slug) })

  const vendor   = data?.data?.vendor
  const products = data?.data?.products || []
  const cats     = ['all', ...new Set(products.map(p => p.category))]
  const filtered = cat === 'all' ? products : products.filter(p => p.category === cat)

  return (
    <div style={{ background:"#faf8f3", minHeight:"100vh", fontFamily:"'DM Sans',sans-serif" }}>
      <Navbar onCartOpen={() => setCartOpen(true)}/>
      <CartDrawer open={cartOpen} onClose={() => setCartOpen(false)}/>

      {isLoading ? (
        <div style={{ height:200, background:"#f2ede3", animation:"pulse 1.5s ease infinite" }}/>
      ) : vendor && (
        <div style={{ background:"linear-gradient(135deg,#1c1409,#3d2c0f)", padding:"40px 0" }}>
          <div style={{ maxWidth:1320, margin:"0 auto", padding:"0 16px", display:"flex", alignItems:"center", gap:24, flexWrap:"wrap" }}>
            <div style={{ width:72, height:72, borderRadius:"50%", background:"rgba(255,255,255,.12)", display:"flex", alignItems:"center", justifyContent:"center", fontSize:36, flexShrink:0 }}>🏪</div>
            <div style={{ flex:1 }}>
              <div style={{ display:"flex", alignItems:"center", gap:10, flexWrap:"wrap", marginBottom:8 }}>
                <h1 style={{ fontFamily:"'Fraunces',serif", fontSize:"clamp(22px,3vw,32px)", fontWeight:900, color:"#fff", margin:0 }}>{vendor.storeName}</h1>
                {vendor.status === "active" && <span style={{ background:"rgba(255,255,255,.15)", color:"rgba(255,255,255,.9)", fontSize:10, fontWeight:700, padding:"3px 10px", borderRadius:4, letterSpacing:".06em" }}>✓ VERIFIED</span>}
              </div>
              <p style={{ fontSize:13, color:"rgba(255,255,255,.6)", margin:"0 0 12px" }}>{vendor.description || "Premium products from a verified vendor"}</p>
              <div style={{ display:"flex", gap:20, flexWrap:"wrap" }}>
                {[["⭐", (vendor.rating||0).toFixed(1)+" rating"], ["🛍️", (vendor.totalSales||0).toLocaleString()+" sales"], ["📦", products.length+" products"]].map(([ic,lb]) => (
                  <span key={lb} style={{ fontSize:12, color:"rgba(255,255,255,.65)", display:"flex", alignItems:"center", gap:5 }}>{ic} {lb}</span>
                ))}
              </div>
            </div>
            {vendor.whatsapp && (
              <a href={"https://wa.me/"+vendor.whatsapp.replace(/\D/g,"")} target="_blank" rel="noreferrer"
                style={{ padding:"11px 20px", background:"#25d366", color:"#fff", borderRadius:9, fontSize:13, fontWeight:700, display:"flex", alignItems:"center", gap:8, textDecoration:"none", flexShrink:0 }}>
                💬 Chat on WhatsApp
              </a>
            )}
          </div>
        </div>
      )}

      <div style={{ maxWidth:1320, margin:"0 auto", padding:"28px 16px" }}>
        {cats.length > 1 && (
          <div style={{ display:"flex", gap:8, flexWrap:"wrap", marginBottom:22 }}>
            {cats.map(c => (
              <button key={c} onClick={() => setCat(c)} style={{ padding:"7px 16px", borderRadius:99, border:"1px solid "+(cat===c?"#1c1409":"#e8e4dc"), background:cat===c?"#1c1409":"#fff", color:cat===c?"#fff":"#1c1409", fontSize:12, fontWeight:cat===c?700:400, cursor:"pointer", fontFamily:"'DM Sans',sans-serif", transition:"all .18s" }}>
                {c === "all" ? "All Products ("+products.length+")" : c}
              </button>
            ))}
          </div>
        )}
        {filtered.length === 0
          ? <div style={{ textAlign:"center", padding:"60px", color:"#7a7268" }}>No products in this category yet.</div>
          : <div style={{ display:"grid", gridTemplateColumns:"repeat(auto-fill,minmax(175px,1fr))", gap:14 }}>
              {filtered.map((p,i) => <div key={p._id} style={{ animation:"fadeUp .35s ease "+(i*30)+"ms both" }}><ProductCard product={p}/></div>)}
            </div>
        }
      </div>
      <style>{"@keyframes fadeUp{from{opacity:0;transform:translateY(12px)}to{opacity:1;transform:translateY(0)}} @keyframes pulse{0%,100%{opacity:1}50%{opacity:.5}}"}</style>
    </div>
  )
}
