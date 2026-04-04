import { useState } from 'react'
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { ordersAPI } from '../../api'
import toast from 'react-hot-toast'

const fmt = n => "N" + Number(n).toLocaleString()
const STATUS_OPTS = ["pending","awaiting_payment","payment_uploaded","payment_confirmed","processing","shipped","delivered","cancelled"]
const STATUS_COL  = { pending:"#d97706", awaiting_payment:"#d97706", payment_uploaded:"#7c3aed", payment_confirmed:"#2563eb", processing:"#7c3aed", shipped:"#2563eb", delivered:"#1a6b3c", cancelled:"#dc2626" }

export default function VendorOrders() {
  const [filter, setFilter] = useState("all")
  const qc = useQueryClient()

  const { data, isLoading } = useQuery({ queryKey:["vendor-orders"], queryFn: ordersAPI.vendorOrders })
  const orders = data?.data?.orders || []
  const shown = filter === "all" ? orders : orders.filter(o => o.status === filter)

  const updateStatus = useMutation({
    mutationFn: ({id,status}) => ordersAPI.updateStatus(id,status),
    onSuccess: () => { toast.success("Status updated"); qc.invalidateQueries(["vendor-orders"]) },
    onError: () => toast.error("Update failed"),
  })
  const confirm = useMutation({
    mutationFn: id => ordersAPI.confirmPayment(id),
    onSuccess: () => { toast.success("Payment confirmed!"); qc.invalidateQueries(["vendor-orders"]) },
  })

  return (
    <div>
      <div style={{ display:"flex", alignItems:"center", justifyContent:"space-between", marginBottom:20 }}>
        <div><h2 style={{ fontWeight:700, fontSize:18, color:"#eef2ff", margin:0 }}>Orders</h2><div style={{ fontSize:12, color:"rgba(255,255,255,.4)", marginTop:2 }}>{orders.length} total</div></div>
        <button onClick={() => {}} style={{ padding:"8px 16px", background:"rgba(255,255,255,.05)", border:"1px solid rgba(255,255,255,.1)", borderRadius:8, color:"rgba(255,255,255,.6)", fontSize:12, cursor:"pointer" }}>Export CSV</button>
      </div>

      <div style={{ display:"flex", gap:6, marginBottom:16, flexWrap:"wrap" }}>
        {["all",...STATUS_OPTS].map(s => {
          const cnt = s==="all" ? orders.length : orders.filter(o=>o.status===s).length
          return <button key={s} onClick={() => setFilter(s)} style={{ padding:"5px 12px", borderRadius:99, border:"1px solid "+(filter===s?"#3b82f6":"rgba(255,255,255,.15)"), background:filter===s?"#3b82f6":"transparent", color:filter===s?"#fff":"rgba(255,255,255,.5)", fontSize:11, cursor:"pointer", fontFamily:"DM Sans,sans-serif" }}>
            {s==="all"?"All":s.replace(/_/g," ").replace(/\w/g,c=>c.toUpperCase())} ({cnt})
          </button>
        })}
      </div>

      <div className="dash-card" style={{ overflow:"hidden" }}>
        {isLoading ? (
          <div style={{ textAlign:"center", padding:"40px", color:"rgba(255,255,255,.4)", fontSize:13 }}>Loading orders...</div>
        ) : shown.length === 0 ? (
          <div style={{ textAlign:"center", padding:"40px" }}><div style={{ fontSize:36, marginBottom:12 }}>📦</div><div style={{ color:"rgba(255,255,255,.4)", fontSize:13 }}>No orders found</div></div>
        ) : (
          <div style={{ overflowX:"auto" }}>
            <table style={{ width:"100%", borderCollapse:"collapse" }}>
              <thead><tr>
                {["Order ID","Customer","Items","Total","Payment","Status","Date","Actions"].map(h => (
                  <th key={h} style={{ padding:"10px 14px", textAlign:"left", fontSize:11, fontWeight:600, color:"rgba(255,255,255,.35)", borderBottom:"1px solid rgba(255,255,255,.07)", letterSpacing:".05em", textTransform:"uppercase", whiteSpace:"nowrap" }}>{h}</th>
                ))}
              </tr></thead>
              <tbody>
                {shown.map(o => {
                  const col = STATUS_COL[o.status] || "#d97706"
                  return (
                    <tr key={o._id} style={{ borderBottom:"1px solid rgba(255,255,255,.04)" }}>
                      <td style={{ padding:"12px 14px", fontFamily:"monospace", fontSize:12, color:"#3b82f6" }}>{o.orderId}</td>
                      <td style={{ padding:"12px 14px" }}>
                        <div style={{ fontSize:13, fontWeight:600, color:"#eef2ff" }}>{o.customer?.name||"Customer"}</div>
                        <div style={{ fontSize:11, color:"rgba(255,255,255,.35)" }}>{o.customer?.email}</div>
                      </td>
                      <td style={{ padding:"12px 14px", fontSize:12, color:"rgba(255,255,255,.5)" }}>{(o.items||[]).length} item{(o.items||[]).length!==1?"s":""}</td>
                      <td style={{ padding:"12px 14px", fontFamily:"monospace", fontWeight:700, color:"#eef2ff", fontSize:13 }}>{fmt(o.total)}</td>
                      <td style={{ padding:"12px 14px" }}>
                        {o.paymentStatus==="paid" ? <span style={{ fontSize:11, color:"#10b981" }}>Paid</span> : o.paymentProof ? <span style={{ fontSize:11, color:"#8b5cf6" }}>Proof uploaded</span> : <span style={{ fontSize:11, color:"rgba(255,255,255,.3)" }}>Unpaid</span>}
                      </td>
                      <td style={{ padding:"12px 14px" }}><span style={{ display:"inline-flex", alignItems:"center", gap:4, padding:"3px 8px", borderRadius:6, fontSize:10, fontWeight:700, background:col+"18", color:col }}>{"• "+(o.status||"").replace(/_/g," ").replace(/\w/g,c=>c.toUpperCase())}</span></td>
                      <td style={{ padding:"12px 14px", fontSize:11, color:"rgba(255,255,255,.4)", whiteSpace:"nowrap" }}>{new Date(o.createdAt).toLocaleDateString("en-NG",{day:"numeric",month:"short"})}</td>
                      <td style={{ padding:"12px 14px" }}>
                        <div style={{ display:"flex", gap:6, flexWrap:"wrap" }}>
                          {o.status==="payment_uploaded" && (
                            <button onClick={() => confirm.mutate(o._id)} style={{ padding:"4px 9px", background:"rgba(16,185,129,.12)", color:"#10b981", border:"1px solid rgba(16,185,129,.25)", borderRadius:6, fontSize:10, fontWeight:700, cursor:"pointer", whiteSpace:"nowrap" }}>Confirm</button>
                          )}
                          <select value={o.status} onChange={e => updateStatus.mutate({id:o._id,status:e.target.value})} style={{ padding:"4px 8px", background:"rgba(255,255,255,.06)", border:"1px solid rgba(255,255,255,.1)", borderRadius:6, color:"rgba(255,255,255,.6)", fontSize:10, cursor:"pointer", fontFamily:"DM Sans,sans-serif" }}>
                            {STATUS_OPTS.map(s => <option key={s} value={s}>{s.replace(/_/g," ").replace(/\w/g,c=>c.toUpperCase())}</option>)}
                          </select>
                        </div>
                      </td>
                    </tr>
                  )
                })}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  )
}
