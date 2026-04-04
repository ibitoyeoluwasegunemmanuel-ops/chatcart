import { useState, useEffect } from 'react'
import { useSearchParams, Link } from 'react-router-dom'
import { useQuery } from '@tanstack/react-query'
import Navbar from '../../components/marketplace/Navbar'
import CartDrawer from '../../components/marketplace/CartDrawer'
import ProductCard from '../../components/marketplace/ProductCard'
import { productsAPI } from '../../api'

const CATS = ['Fashion','Beauty','Electronics','Home','Jewelry','Food','Sports','Kids']
const SORTS = [['popular','Most Popular'],['newest','Newest'],['rating','Top Rated'],['price-asc','Price: Low to High'],['price-desc','Price: High to Low']]

export default function ListingPage() {
  const [params, setParams] = useSearchParams()
  const [cartOpen, setCartOpen] = useState(false)
  const [filterOpen, setFilterOpen] = useState(false)
  const [page, setPage] = useState(1)

  const cat      = params.get('category') || ''
  const q        = params.get('q') || ''
  const sort     = params.get('sort') || 'popular'
  const minPrice = params.get('minPrice') || ''
  const maxPrice = params.get('maxPrice') || ''
  const minRating = params.get('rating') || ''

  const { data, isLoading } = useQuery({
    queryKey: ['products', cat, q, sort, minPrice, maxPrice, minRating, page],
    queryFn: () => productsAPI.getAll({ category: cat||undefined, search: q||undefined, sort, minPrice:minPrice||undefined, maxPrice:maxPrice||undefined, rating:minRating||undefined, page, limit:24 }),
    keepPreviousData: true,
  })

  const products = data?.data?.products || []
  const total    = data?.data?.total || 0
  const pages    = data?.data?.pages || 1

  const set = (key, val) => { const p = new URLSearchParams(params); if (val) p.set(key,val); else p.delete(key); setParams(p); setPage(1) }

  const FilterPanel = () => (
    <div style={{ background:'#fff', border:'1px solid #e8e4dc', borderRadius:14, padding:20, position:'sticky', top:80 }}>
      <div style={{ fontWeight:700, fontSize:14, color:'#1c1409', marginBottom:16 }}>Filters</div>

      {/* Categories */}
      <div style={{ marginBottom:20 }}>
        <div style={{ fontSize:11, fontWeight:700, color:'#7a7268', letterSpacing:'.05em', textTransform:'uppercase', marginBottom:10 }}>Category</div>
        <div onClick={() => set('category','')} style={{ padding:'7px 10px', borderRadius:7, background:!cat?'#faf8f3':'transparent', border:!cat?'1.5px solid #1c1409':'1.5px solid transparent', cursor:'pointer', fontSize:13, fontWeight:!cat?700:400, color:'#1c1409', marginBottom:4 }}>All Categories</div>
        {CATS.map(c => (
          <div key={c} onClick={() => set('category',c)} style={{ padding:'7px 10px', borderRadius:7, background:cat===c?'#faf8f3':'transparent', border:cat===c?'1.5px solid #1c1409':'1.5px solid transparent', cursor:'pointer', fontSize:13, fontWeight:cat===c?700:400, color:'#1c1409', marginBottom:4 }}>{c}</div>
        ))}
      </div>

      {/* Price */}
      <div style={{ marginBottom:20 }}>
        <div style={{ fontSize:11, fontWeight:700, color:'#7a7268', letterSpacing:'.05em', textTransform:'uppercase', marginBottom:10 }}>Price Range</div>
        {[['0','10000','Under ₦10k'],['10000','30000','₦10k–₦30k'],['30000','100000','₦30k–₦100k'],['100000','','Above ₦100k']].map(([min,max,label]) => (
          <div key={label} onClick={() => { set('minPrice',min); set('maxPrice',max) }} style={{ display:'flex', alignItems:'center', gap:8, padding:'6px 0', cursor:'pointer', fontSize:13, color:'#1c1409' }}>
            <div style={{ width:16, height:16, borderRadius:'50%', border:'2px solid '+(minPrice===min&&maxPrice===max?'#1c1409':'#ddd8ce'), background:minPrice===min&&maxPrice===max?'#1c1409':'transparent', display:'flex', alignItems:'center', justifyContent:'center' }}>
              {minPrice===min&&maxPrice===max&&<div style={{ width:6, height:6, borderRadius:'50%', background:'#fff' }}/>}
            </div>
            {label}
          </div>
        ))}
      </div>

      {/* Rating */}
      <div style={{ marginBottom:20 }}>
        <div style={{ fontSize:11, fontWeight:700, color:'#7a7268', letterSpacing:'.05em', textTransform:'uppercase', marginBottom:10 }}>Minimum Rating</div>
        {[4,3,2].map(r => (
          <div key={r} onClick={() => set('rating',String(r))} style={{ display:'flex', alignItems:'center', gap:8, padding:'6px 0', cursor:'pointer' }}>
            <div style={{ width:16, height:16, borderRadius:'50%', border:'2px solid '+(minRating===String(r)?'#1c1409':'#ddd8ce'), background:minRating===String(r)?'#1c1409':'transparent', display:'flex', alignItems:'center', justifyContent:'center' }}>
              {minRating===String(r)&&<div style={{ width:6, height:6, borderRadius:'50%', background:'#fff' }}/>}
            </div>
            <span style={{ color:'#f59e0b', fontSize:13 }}>{'★'.repeat(r)}</span>
            <span style={{ fontSize:12, color:'#7a7268' }}>& up</span>
          </div>
        ))}
      </div>

      <button onClick={() => { setParams({}); setPage(1) }} style={{ width:'100%', padding:'9px', border:'1px solid #e8e4dc', borderRadius:8, background:'transparent', fontSize:13, cursor:'pointer', color:'#7a7268', fontFamily:"'DM Sans',sans-serif" }}>Clear all filters</button>
    </div>
  )

  return (
    <div style={{ background:'#faf8f3', minHeight:'100vh', fontFamily:"'DM Sans',sans-serif" }}>
      <Navbar onCartOpen={() => setCartOpen(true)} />
      <CartDrawer open={cartOpen} onClose={() => setCartOpen(false)} />

      <div style={{ maxWidth:1320, margin:'0 auto', padding:'24px 16px' }}>
        {/* Breadcrumb + header */}
        <div style={{ display:'flex', alignItems:'center', justifyContent:'space-between', marginBottom:20, flexWrap:'wrap', gap:12 }}>
          <div>
            <div style={{ fontSize:12, color:'#7a7268', marginBottom:6 }}>
              <Link to="/" style={{ color:'#c8820a', textDecoration:'none' }}>Home</Link>
              {cat && <> / <span>{cat}</span></>}
              {q && <> / Search: "{q}"</>}
            </div>
            <h1 style={{ fontFamily:"'Fraunces',serif", fontSize:'clamp(20px,3vw,28px)', fontWeight:700, color:'#1c1409', margin:0 }}>
              {q ? 'Results for "'+q+'"' : cat || 'All Products'}
            </h1>
            <div style={{ fontSize:12, color:'#7a7268', marginTop:4 }}>{isLoading ? 'Loading...' : total.toLocaleString() + ' products'}</div>
          </div>
          <div style={{ display:'flex', gap:10, alignItems:'center' }}>
            {/* Mobile filter button */}
            <button onClick={() => setFilterOpen(true)} className="show-mobile" style={{ display:'none', padding:'9px 16px', border:'1px solid #e8e4dc', borderRadius:8, background:'#fff', fontSize:13, cursor:'pointer', fontFamily:"'DM Sans',sans-serif" }}>⚙️ Filter</button>
            <select value={sort} onChange={e => set('sort',e.target.value)} style={{ padding:'9px 13px', border:'1.5px solid #ddd8ce', borderRadius:8, background:'#fff', fontSize:13, cursor:'pointer', fontFamily:"'DM Sans',sans-serif" }}>
              {SORTS.map(([v,l]) => <option key={v} value={v}>{l}</option>)}
            </select>
          </div>
        </div>

        <div style={{ display:'grid', gridTemplateColumns:'220px 1fr', gap:20, alignItems:'start' }}>
          {/* Desktop filters */}
          <div className="hide-mobile"><FilterPanel/></div>

          {/* Products grid */}
          <div>
            {isLoading ? (
              <div style={{ display:'grid', gridTemplateColumns:'repeat(auto-fill,minmax(170px,1fr))', gap:14 }}>
                {[...Array(12)].map((_,i) => (
                  <div key={i} style={{ background:'#fff', borderRadius:12, overflow:'hidden', border:'1px solid #e8e4dc' }}>
                    <div style={{ paddingTop:'75%', background:'#f2ede3', animation:'pulse 1.5s ease infinite' }}/>
                    <div style={{ padding:'12px 14px' }}>
                      <div style={{ height:12, background:'#f2ede3', borderRadius:4, marginBottom:8, animation:'pulse 1.5s ease infinite' }}/>
                      <div style={{ height:16, background:'#f2ede3', borderRadius:4, width:'60%', animation:'pulse 1.5s ease infinite' }}/>
                    </div>
                  </div>
                ))}
              </div>
            ) : products.length === 0 ? (
              <div style={{ textAlign:'center', padding:'80px 20px' }}>
                <div style={{ fontSize:52, marginBottom:14 }}>🔍</div>
                <div style={{ fontFamily:"'Fraunces',serif", fontSize:22, fontWeight:700, marginBottom:8 }}>No products found</div>
                <div style={{ fontSize:13, color:'#7a7268', marginBottom:20 }}>Try different search terms or clear your filters</div>
                <button onClick={() => { setParams({}); setPage(1) }} style={{ padding:'10px 24px', background:'#1c1409', color:'#faf8f3', border:'none', borderRadius:8, fontSize:13, fontWeight:700, cursor:'pointer' }}>Clear Filters</button>
              </div>
            ) : (
              <>
                <div style={{ display:'grid', gridTemplateColumns:'repeat(auto-fill,minmax(170px,1fr))', gap:14, marginBottom:28 }}>
                  {products.map((p,i) => (
                    <div key={p._id} style={{ animation:'fadeUp .35s ease '+(i%8*35)+'ms both' }}>
                      <ProductCard product={p}/>
                    </div>
                  ))}
                </div>

                {/* Pagination */}
                {pages > 1 && (
                  <div style={{ display:'flex', justifyContent:'center', gap:6, flexWrap:'wrap' }}>
                    <button onClick={() => setPage(p => Math.max(1,p-1))} disabled={page===1} style={{ padding:'8px 14px', border:'1px solid #ddd8ce', borderRadius:8, background:page===1?'#faf8f3':'#fff', cursor:page===1?'default':'pointer', fontSize:13, color:page===1?'#ccc':'#1c1409' }}>← Prev</button>
                    {[...Array(Math.min(5,pages))].map((_,i) => {
                      const pg = Math.max(1, Math.min(pages-4, page-2)) + i
                      return <button key={pg} onClick={() => setPage(pg)} style={{ padding:'8px 13px', border:'1px solid '+(page===pg?'#1c1409':'#ddd8ce'), borderRadius:8, background:page===pg?'#1c1409':'#fff', color:page===pg?'#fff':'#1c1409', cursor:'pointer', fontSize:13, fontWeight:page===pg?700:400 }}>{pg}</button>
                    })}
                    <button onClick={() => setPage(p => Math.min(pages,p+1))} disabled={page===pages} style={{ padding:'8px 14px', border:'1px solid #ddd8ce', borderRadius:8, background:page===pages?'#faf8f3':'#fff', cursor:page===pages?'default':'pointer', fontSize:13, color:page===pages?'#ccc':'#1c1409' }}>Next →</button>
                  </div>
                )}
              </>
            )}
          </div>
        </div>
      </div>

      {/* Mobile filter drawer */}
      {filterOpen && (
        <>
          <div onClick={() => setFilterOpen(false)} style={{ position:'fixed', inset:0, background:'rgba(0,0,0,.5)', zIndex:300 }}/>
          <div style={{ position:'fixed', bottom:0, left:0, right:0, background:'#fff', borderRadius:'16px 16px 0 0', zIndex:301, maxHeight:'80vh', overflow:'auto', padding:20 }}>
            <div style={{ display:'flex', justifyContent:'space-between', marginBottom:16 }}>
              <span style={{ fontWeight:700, fontSize:16, color:'#1c1409' }}>Filters</span>
              <button onClick={() => setFilterOpen(false)} style={{ border:'none', background:'transparent', fontSize:18, cursor:'pointer' }}>✕</button>
            </div>
            <FilterPanel/>
            <button onClick={() => setFilterOpen(false)} style={{ width:'100%', padding:'13px', background:'#1c1409', color:'#fff', border:'none', borderRadius:9, fontSize:14, fontWeight:700, cursor:'pointer', marginTop:16 }}>Show {total} Results</button>
          </div>
        </>
      )}

      <style>{`
        @keyframes fadeUp { from{opacity:0;transform:translateY(12px)}to{opacity:1;transform:translateY(0)} }
        @keyframes pulse { 0%,100%{opacity:1}50%{opacity:.5} }
        @media(max-width:768px){
          .hide-mobile{display:none!important}
          .show-mobile{display:flex!important}
          div[style*="grid-template-columns: 220px"]{grid-template-columns:1fr!important}
        }
      `}</style>
    </div>
  )
}
