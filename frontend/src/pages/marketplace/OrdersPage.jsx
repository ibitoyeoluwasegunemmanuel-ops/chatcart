import { useState } from 'react'
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { Link, useNavigate } from 'react-router-dom'
import { ordersAPI } from '../../api'
import Navbar from '../../components/marketplace/Navbar'
import CartDrawer from '../../components/marketplace/CartDrawer'
import toast from 'react-hot-toast'

const fmt = n => "N" + Number(n).toLocaleString()
const STATUS_COLORS = { pending:"#d97706", awaiting_payment:"#d97706", payment_uploaded:"#7c3aed", payment_confirmed:"#2563eb", processing:"#7c3aed", shipped:"#2563eb", delivered:"#1a6b3c", cancelled:"#dc2626" }
const STATUS_LABELS = { pending:"Order Placed", awaiting_payment:"Awaiting Payment", payment_uploaded:"Proof Uploaded", payment_confirmed:"Payment Confirmed", processing:"Processing", shipped:"Shipped", delivered:"Delivered", cancelled:"Cancelled" }
const STEPS_IDX = ["pending","awaiting_payment","payment_confirmed","processing","shipped","delivered"]

export default function OrdersPage() {
  const [cartOpen, setCartOpen] = useState(false)
  const [tab, setTab] = useState("active")
  const [proofOrder, setProofOrder] = useState(null)
  const qc = useQueryClient()
  const nav = useNavigate()

  const { data, isLoading } = useQuery({ queryKey:["my-orders"], queryFn: ordersAPI.myOrders })
  const orders = data?.data?.orders || []
  const active = orders.filter(o => o.status !== "delivered" && o.status !== "cancelled")
  const done   = orders.filter(o => o.status === "delivered" || o.status === "cancelled")

  const uploadProof = useMutation({
    mutationFn: ({id,file}) => { const fd=new FormData(); fd.append("proof",file); return ordersAPI.uploadProof(id,fd) },
    onSuccess: () => { toast.success("Proof uploaded!"); setProofOrder(null); qc.invalidateQueries(["my-orders"]) },
    onError: () => toast.error("Upload failed"),
  })

  const shown = tab==="active" ? active : done

  return (
    <div style={{ background:"#faf8f3", minHeight:"100vh", fontFamily:"DM Sans,sans-serif" }}>
      <Navbar onCartOpen={() => setCartOpen(true)}/>
      <CartDrawer open={cartOpen} onClose={() => setCartOpen(false)}/>
      <div style={{ maxWidth:900, margin:"0 auto", padding:"32px 16px" }}>
        <div style={{ display:"flex", alignItems:"center", justifyContent:"space-between", marginBottom:24, flexWrap:"wrap", gap:12 }}>
          <div>
            <Link to="/" style={{ fontSize:12, color:"#c8820a", textDecoration:"none" }}>Back to Home</Link>
            <h1 style={{ fontFamily:"Fraunces,serif", fontSize:"clamp(22px,3vw,28px)", fontWeight:700, color:"#1c1409", margin:"4px 0 0" }}>My Orders</h1>
          </div>
          <div style={{ display:"flex", gap:6 }}>
            {[["active","Active ("+active.length+")"],["done","Completed ("+done.length+")"]].map(([k,l]) => (
              <button key={k} onClick={() => setTab(k)} style={{ padding:"8px 16px", border:"1px solid "+(tab===k?"#1c1409":"#e8e4dc"), borderRadius:99, background:tab===k?"#1c1409":"#fff", color:tab===k?"#fff":"#1c1409", fontSize:12, fontWeight:tab===k?700:400, cursor:"pointer" }}>{l}</button>
            ))}
          </div>
        </div>

        {isLoading ? (
          <div style={{ textAlign:"center", padding:"60px" }}>
            <div style={{ width:32,height:32,border:"3px solid #e8e4dc",borderTopColor:"#1c1409",borderRadius:"50%",animation:"spin .7s linear infinite",margin:"0 auto 16px" }}/>
          </div>
        ) : shown.length === 0 ? (
          <div style={{ textAlign:"center", padding:"60px 20px" }}>
            <div style={{ fontSize:52, marginBottom:14 }}>📦</div>
            <h2 style={{ fontFamily:"Fraunces,serif", fontSize:22, fontWeight:700, marginBottom:8 }}>No {tab} orders</h2>
            <button onClick={() => nav("/products")} style={{ padding:"11px 24px", background:"#1c1409", color:"#fff", border:"none", borderRadius:8, fontSize:13, fontWeight:700, cursor:"pointer" }}>Shop Now</button>
          </div>
        ) : shown.map(order => {
          const col = STATUS_COLORS[order.status] || "#d97706"
          const idx = STEPS_IDX.indexOf(order.status)
          return (
            <div key={order._id} style={{ background:"#fff", border:"1px solid #e8e4dc", borderRadius:16, overflow:"hidden", marginBottom:16 }}>
              <div style={{ padding:"14px 20px", background:"#faf8f3", borderBottom:"1px solid #e8e4dc", display:"flex", alignItems:"center", justifyContent:"space-between", flexWrap:"wrap", gap:10 }}>
                <div style={{ display:"flex", gap:20, flexWrap:"wrap" }}>
                  <div><div style={{ fontSize:10, color:"#7a7268" }}>ORDER ID</div><div style={{ fontFamily:"monospace", fontWeight:700, fontSize:14 }}>{order.orderId}</div></div>
                  <div><div style={{ fontSize:10, color:"#7a7268" }}>DATE</div><div style={{ fontSize:13, fontWeight:600 }}>{new Date(order.createdAt).toLocaleDateString("en-NG",{day:"numeric",month:"short",year:"numeric"})}</div></div>
                  <div><div style={{ fontSize:10, color:"#7a7268" }}>TOTAL</div><div style={{ fontFamily:"Fraunces,serif", fontWeight:900, fontSize:16 }}>{fmt(order.total)}</div></div>
                </div>
                <span style={{ fontSize:11, fontWeight:700, padding:"5px 12px", borderRadius:6, background:col+"18", color:col }}>{"• "+( STATUS_LABELS[order.status]||order.status)}</span>
              </div>
              <div style={{ padding:"18px 20px" }}>
                <div style={{ display:"flex", gap:12, marginBottom:18, flexWrap:"wrap" }}>
                  {(order.items||[]).map((item,i) => (
                    <div key={i} style={{ display:"flex", gap:10, alignItems:"center" }}>
                      <div style={{ width:46, height:46, background:"#f2ede3", borderRadius:9, flexShrink:0, display:"flex", alignItems:"center", justifyContent:"center", overflow:"hidden" }}>
                        {item.image ? <img src={item.image} alt={item.name} style={{ width:"100%",height:"100%",objectFit:"cover" }}/> : "📦"}
                      </div>
                      <div><div style={{ fontSize:13, fontWeight:600, color:"#1c1409" }}>{item.name}</div><div style={{ fontSize:11, color:"#7a7268" }}>x{item.qty} · {fmt(item.price)}</div></div>
                    </div>
                  ))}
                </div>

                {order.status !== "cancelled" && (
                  <div style={{ background:"#faf8f3", borderRadius:10, padding:"14px 16px", marginBottom:16, overflowX:"auto" }}>
                    <div style={{ fontSize:12, fontWeight:700, color:"#1c1409", marginBottom:12 }}>Tracking {order.trackingId ? "— "+order.trackingId : ""}</div>
                    <div style={{ display:"flex", minWidth:400 }}>
                      {["Placed","Awaiting Payment","Payment OK","Processing","Shipped","Delivered"].map((s,i) => {
                        const done2 = idx >= i
                        return (
                          <div key={s} style={{ flex:1, display:"flex", flexDirection:"column", alignItems:"center", position:"relative" }}>
                            {i > 0 && <div style={{ position:"absolute", left:"-50%", top:10, width:"100%", height:2, background:done2?"#1a6b3c":"#e8e4dc", zIndex:0 }}/>}
                            <div style={{ width:22, height:22, borderRadius:"50%", background:done2?"#1a6b3c":"#e8e4dc", display:"flex", alignItems:"center", justifyContent:"center", fontSize:10, color:done2?"#fff":"#7a7268", zIndex:1, marginBottom:6, flexShrink:0, fontWeight:700 }}>{done2 ? "v" : ""}</div>
                            <div style={{ fontSize:9, fontWeight:done2?600:400, color:done2?"#1c1409":"#7a7268", textAlign:"center", lineHeight:1.3 }}>{s}</div>
                          </div>
                        )
                      })}
                    </div>
                  </div>
                )}

                <div style={{ display:"flex", gap:8, flexWrap:"wrap" }}>
                  {order.status==="awaiting_payment" && order.paymentMethod==="bank_transfer" && (
                    <button onClick={() => setProofOrder(order._id)} style={{ padding:"8px 16px", background:"#e85528", color:"#fff", border:"none", borderRadius:7, fontSize:12, fontWeight:700, cursor:"pointer" }}>Upload Payment Proof</button>
                  )}
                  {order.status==="delivered" && <button style={{ padding:"8px 16px", background:"transparent", color:"#c8820a", border:"1.5px solid #c8820a", borderRadius:7, fontSize:12, fontWeight:600, cursor:"pointer" }}>Leave Review</button>}
                  <button style={{ padding:"8px 16px", background:"transparent", color:"#1c1409", border:"1.5px solid #e8e4dc", borderRadius:7, fontSize:12, fontWeight:600, cursor:"pointer" }}>Reorder</button>
                </div>
              </div>
            </div>
          )
        })}
      </div>

      {proofOrder && (
        <div onClick={e => e.target===e.currentTarget&&setProofOrder(null)} style={{ position:"fixed", inset:0, background:"rgba(0,0,0,.55)", zIndex:500, display:"flex", alignItems:"center", justifyContent:"center" }}>
          <div style={{ background:"#fff", borderRadius:16, padding:28, width:440, maxWidth:"94vw" }}>
            <div style={{ fontFamily:"Fraunces,serif", fontSize:20, fontWeight:700, marginBottom:6 }}>Upload Payment Proof</div>
            <div style={{ fontSize:13, color:"#7a7268", marginBottom:20 }}>Upload your bank transfer receipt or screenshot.</div>
            <div style={{ border:"2px dashed #ddd8ce", borderRadius:10, padding:"32px", textAlign:"center", cursor:"pointer", marginBottom:20 }} onClick={() => document.getElementById("proof-file").click()}>
              <div style={{ fontSize:32, marginBottom:8 }}>📎</div>
              <div style={{ fontSize:13, color:"#7a7268" }}>Click to upload image</div>
              <input id="proof-file" type="file" accept="image/*" style={{ display:"none" }} onChange={e => { if(e.target.files[0]) uploadProof.mutate({id:proofOrder,file:e.target.files[0]}) }}/>
            </div>
            <button onClick={() => setProofOrder(null)} style={{ width:"100%", padding:"11px", border:"1px solid #e8e4dc", borderRadius:8, background:"transparent", fontSize:13, cursor:"pointer" }}>Cancel</button>
          </div>
        </div>
      )}
      <style>{"@keyframes spin{to{transform:rotate(360deg)}}"}</style>
    </div>
  )
}
