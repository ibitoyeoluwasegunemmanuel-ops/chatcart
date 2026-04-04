import { useState } from 'react'
import { useMyProducts, useCreateProduct, useUpdateProduct, useDeleteProduct } from '../../hooks/useData'
import { Modal, Btn, Input, Select, Textarea } from '../../components/shared/UI'
import toast from 'react-hot-toast'

const CATEGORIES = ['Fashion','Beauty','Electronics','Home','Jewelry','Food','Health','Sports','Books','Art']
const EMOJIS     = { Fashion:'👗', Beauty:'🧴', Electronics:'🎧', Home:'🧺', Jewelry:'📿', Food:'🌶️', Health:'💊', Sports:'⚽', Books:'📚', Art:'🎨' }
const fmt        = (n) => '₦' + Number(n || 0).toLocaleString()

const EMPTY = { name:'', description:'', price:'', oldPrice:'', stock:'', category:'Fashion', badge:'' }

export default function VendorProducts() {
  const { data, isLoading }    = useMyProducts()
  const createProduct          = useCreateProduct()
  const updateProduct          = useUpdateProduct()
  const deleteProduct          = useDeleteProduct()

  const [modal,  setModal]  = useState(false)
  const [edit,   setEdit]   = useState(null)
  const [share,  setShare]  = useState(null)
  const [form,   setForm]   = useState(EMPTY)
  const [search, setSearch] = useState('')

  const products = (data?.products || []).filter(p =>
    p.name.toLowerCase().includes(search.toLowerCase()) ||
    p.category.toLowerCase().includes(search.toLowerCase())
  )

  const set = (k) => (e) => setForm(f => ({ ...f, [k]: e.target.value }))

  const openCreate = () => { setEdit(null); setForm(EMPTY); setModal(true) }
  const openEdit   = (p)  => { setEdit(p); setForm({ name:p.name, description:p.description||'', price:p.price, oldPrice:p.oldPrice||'', stock:p.stock, category:p.category, badge:p.badge||'' }); setModal(true) }

  const submit = async () => {
    if (!form.name || !form.price || !form.stock) return toast.error('Fill required fields')
    const payload = { ...form, price: +form.price, oldPrice: form.oldPrice ? +form.oldPrice : undefined, stock: +form.stock }
    if (edit) { await updateProduct.mutateAsync({ id: edit._id, data: payload }); setModal(false) }
    else       { await createProduct.mutateAsync(payload); setModal(false) }
  }

  const statusColor = { true:{ bg:'rgba(16,185,129,.12)', text:'#10b981', label:'Live' }, false:{ bg:'rgba(245,158,11,.12)', text:'#f59e0b', label:'Pending' } }

  return (
    <div>
      {/* Header */}
      <div style={{ display:'flex', alignItems:'center', justifyContent:'space-between', marginBottom:20, flexWrap:'wrap', gap:12 }}>
        <div>
          <h2 style={{ fontFamily:"'DM Sans',sans-serif", fontWeight:700, fontSize:18, color:'var(--dash-text)' }}>Products</h2>
          <div style={{ fontSize:12, color:'var(--dash-muted)', marginTop:2 }}>{products.length} listings</div>
        </div>
        <div style={{ display:'flex', gap:10 }}>
          <div style={{ position:'relative' }}>
            <span style={{ position:'absolute', left:9, top:'50%', transform:'translateY(-50%)', color:'var(--dash-muted)', fontSize:13 }}>🔍</span>
            <input value={search} onChange={e => setSearch(e.target.value)} placeholder="Search products..." style={{ padding:'8px 12px 8px 30px', background:'rgba(255,255,255,.05)', border:'1px solid rgba(255,255,255,.1)', borderRadius:8, color:'var(--dash-text)', fontSize:12, fontFamily:"'DM Sans',sans-serif", outline:'none', width:200 }} />
          </div>
          <Btn variant="dash-primary" onClick={openCreate}>+ New Product</Btn>
        </div>
      </div>

      {/* Grid */}
      {isLoading ? (
        <div style={{ display:'grid', gridTemplateColumns:'repeat(auto-fill,minmax(200px,1fr))', gap:14 }}>
          {[1,2,3,4,5,6].map(i => <div key={i} style={{ height:220, background:'rgba(255,255,255,.04)', borderRadius:14, animation:'pulse 1.5s infinite' }} />)}
        </div>
      ) : products.length === 0 ? (
        <div style={{ textAlign:'center', padding:'60px 0' }}>
          <div style={{ fontSize:52, marginBottom:14 }}>📦</div>
          <div style={{ fontSize:16, fontWeight:700, color:'var(--dash-text)', marginBottom:6 }}>No products yet</div>
          <div style={{ fontSize:13, color:'var(--dash-muted)', marginBottom:20 }}>Add your first product to start selling</div>
          <Btn variant="dash-primary" onClick={openCreate}>+ Add Product</Btn>
        </div>
      ) : (
        <div style={{ display:'grid', gridTemplateColumns:'repeat(auto-fill,minmax(210px,1fr))', gap:14 }}>
          {products.map((p, i) => {
            const s = statusColor[p.isApproved]
            return (
              <div key={p._id} className="dash-card" style={{ padding:0, overflow:'hidden', animation:'fadeUp .35s ease ' + (i*30) + 'ms both' }}>
                <div style={{ height:130, background:'rgba(255,255,255,.04)', display:'flex', alignItems:'center', justifyContent:'center', fontSize:56, position:'relative' }}>
                  {p.images?.[0]
                    ? <img src={p.images[0]} alt={p.name} style={{ width:'100%', height:'100%', objectFit:'cover' }} />
                    : <span>{EMOJIS[p.category] || '📦'}</span>
                  }
                  <div style={{ position:'absolute', top:7, left:7 }}>
                    <span style={{ fontSize:9, fontWeight:700, padding:'2px 7px', borderRadius:4, background:s.bg, color:s.text }}>● {s.label}</span>
                  </div>
                  <div style={{ position:'absolute', top:7, right:7, display:'flex', gap:5 }}>
                    <button onClick={() => setShare(p)} style={{ width:26, height:26, borderRadius:6, border:'none', background:'rgba(16,185,129,.15)', color:'#10b981', cursor:'pointer', fontSize:12, display:'flex', alignItems:'center', justifyContent:'center' }}>↗</button>
                    <button onClick={() => openEdit(p)} style={{ width:26, height:26, borderRadius:6, border:'none', background:'rgba(255,255,255,.06)', color:'var(--dash-muted)', cursor:'pointer', fontSize:12 }}>✏️</button>
                    <button onClick={() => { if (confirm('Delete ' + p.name + '?')) deleteProduct.mutate(p._id) }} style={{ width:26, height:26, borderRadius:6, border:'none', background:'rgba(244,63,94,.12)', color:'#f43f5e', cursor:'pointer', fontSize:12 }}>🗑</button>
                  </div>
                </div>
                <div style={{ padding:'12px 14px' }}>
                  <div style={{ fontSize:10, color:'var(--dash-muted)', marginBottom:3 }}>{p.category}</div>
                  <div style={{ fontSize:13, fontWeight:600, color:'var(--dash-text)', marginBottom:6, overflow:'hidden', textOverflow:'ellipsis', whiteSpace:'nowrap' }}>{p.name}</div>
                  <div style={{ display:'flex', alignItems:'center', justifyContent:'space-between' }}>
                    <span style={{ fontSize:15, fontWeight:800, color:'var(--blue)' }}>{fmt(p.price)}</span>
                    <span style={{ fontSize:11, color:'var(--dash-muted)' }}>Stock: {p.stock}</span>
                  </div>
                </div>
              </div>
            )
          })}
        </div>
      )}

      {/* Create / Edit Modal */}
      {modal && (
        <Modal title={edit ? 'Edit Product' : 'Add New Product'} onClose={() => setModal(false)}>
          <div style={{ display:'grid', gap:13 }}>
            <Input dark label="Product Name *" placeholder="e.g. Ankara Wrap Dress" value={form.name} onChange={set('name')} />
            <Textarea dark label="Description" placeholder="Describe your product..." value={form.description} onChange={set('description')} rows={3} />
            <div style={{ display:'grid', gridTemplateColumns:'1fr 1fr', gap:12 }}>
              <Input dark label="Price (₦) *" type="number" placeholder="0" value={form.price} onChange={set('price')} />
              <Input dark label="Old Price (₦)" type="number" placeholder="0" value={form.oldPrice} onChange={set('oldPrice')} />
            </div>
            <div style={{ display:'grid', gridTemplateColumns:'1fr 1fr', gap:12 }}>
              <Input dark label="Stock *" type="number" placeholder="0" value={form.stock} onChange={set('stock')} />
              <Select dark label="Category" value={form.category} onChange={set('category')}>
                {CATEGORIES.map(c => <option key={c}>{c}</option>)}
              </Select>
            </div>
            <Select dark label="Badge" value={form.badge} onChange={set('badge')}>
              <option value="">None</option>
              {['New','Hot','Bestseller','Sale','Low Stock'].map(b => <option key={b}>{b}</option>)}
            </Select>
            <div style={{ border:'2px dashed rgba(255,255,255,.1)', borderRadius:10, padding:24, textAlign:'center', cursor:'pointer' }}>
              <div style={{ fontSize:24, marginBottom:6 }}>📸</div>
              <div style={{ fontSize:12, color:'var(--dash-muted)' }}>Click to upload product images</div>
              <div style={{ fontSize:11, color:'rgba(255,255,255,.2)', marginTop:4 }}>Max 5MB · JPG, PNG, WebP</div>
            </div>
            <div style={{ display:'flex', gap:9, justifyContent:'flex-end', marginTop:4 }}>
              <Btn variant="dash-ghost" onClick={() => setModal(false)}>Cancel</Btn>
              <Btn variant="dash-primary" loading={createProduct.isPending || updateProduct.isPending} onClick={submit}>
                {edit ? '✓ Save Changes' : '✓ Create Product'}
              </Btn>
            </div>
          </div>
        </Modal>
      )}

      {/* Share Modal */}
      {share && (
        <Modal title="Share Product" onClose={() => setShare(null)} width={440}>
          <div>
            <div style={{ background:'rgba(255,255,255,.04)', border:'1px solid rgba(255,255,255,.08)', borderRadius:10, padding:'13px', marginBottom:16, display:'flex', gap:12, alignItems:'center' }}>
              <span style={{ fontSize:30, flexShrink:0 }}>{EMOJIS[share.category] || '📦'}</span>
              <div>
                <div style={{ fontSize:13, fontWeight:600, color:'var(--dash-text)' }}>{share.name}</div>
                <div style={{ fontSize:13, color:'var(--blue)', fontWeight:700 }}>{fmt(share.price)}</div>
                <div style={{ fontSize:10, color:'var(--dash-muted)', fontFamily:"'JetBrains Mono',monospace", marginTop:2 }}>chatcart.com/product/{share._id}</div>
              </div>
            </div>
            <div style={{ marginBottom:14 }}>
              <div style={{ fontSize:11, fontWeight:600, color:'var(--dash-muted)', letterSpacing:'.04em', textTransform:'uppercase', marginBottom:6 }}>Auto-generated message</div>
              <textarea readOnly rows={4} style={{ width:'100%', padding:'9px 12px', background:'rgba(255,255,255,.06)', border:'1px solid rgba(255,255,255,.1)', borderRadius:8, color:'var(--dash-text)', fontSize:12, resize:'none', fontFamily:"'DM Sans',sans-serif" }}
                value={'🔥 ' + share.name + '\nPrice: ' + fmt(share.price) + '\n\n' + (share.description || 'Premium quality product!') + '\n\nOrder here:\nchatcart.com/product/' + share._id}
              />
            </div>
            <div style={{ display:'grid', gridTemplateColumns:'1fr 1fr', gap:8, marginBottom:12 }}>
              {[['💬','WhatsApp','#25d366'],['📘','Facebook','#1877f2'],['📸','Instagram','#e1306c'],['🎵','TikTok','#69c9d0']].map(([ic, lb, col]) => (
                <button key={lb} onClick={() => toast.success('Opening ' + lb + '...')} style={{ display:'flex', alignItems:'center', gap:8, padding:'10px 13px', border:'1px solid ' + col + '33', background: col + '11', borderRadius:9, cursor:'pointer', fontFamily:"'DM Sans',sans-serif", transition:'transform .15s' }}
                  onMouseEnter={e => e.currentTarget.style.transform = 'translateY(-1px)'}
                  onMouseLeave={e => e.currentTarget.style.transform = 'translateY(0)'}
                >
                  <span style={{ fontSize:18 }}>{ic}</span>
                  <span style={{ fontSize:12, fontWeight:700, color:col }}>{lb}</span>
                </button>
              ))}
            </div>
            <Btn variant="dash-ghost" style={{ width:'100%', justifyContent:'center' }} onClick={() => { navigator.clipboard?.writeText('https://chatcart.com/product/' + share._id); toast.success('Link copied!') }}>
              📋 Copy Product Link
            </Btn>
          </div>
        </Modal>
      )}
    </div>
  )
}
