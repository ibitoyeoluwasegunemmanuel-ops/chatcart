import { useQuery } from "@tanstack/react-query"
import { vendorsAPI } from "../../api"

const fmt = n => "N" + Number(n).toLocaleString()

export default function VendorCustomers() {
  const { data, isLoading } = useQuery({ queryKey:["vendor-customers"], queryFn: vendorsAPI.customers })
  const customers = data?.data?.customers || []

  return (
    <div>
      <div style={{ marginBottom:20 }}>
        <h2 style={{ fontWeight:700, fontSize:18, color:"#eef2ff", margin:0 }}>Customers</h2>
        <div style={{ fontSize:12, color:"rgba(255,255,255,.4)", marginTop:2 }}>{customers.length} unique buyers</div>
      </div>
      <div style={{ display:"grid", gridTemplateColumns:"repeat(3,1fr)", gap:14, marginBottom:20 }}>
        {[["Total Customers",customers.length,"👥","#3b82f6"],["Repeat Buyers",customers.filter(c=>c.orders>1).length,"🔁","#10b981"],["Total LTV","N"+customers.reduce((s,c)=>s+c.spent,0).toLocaleString(),"💰","#f59e0b"]].map(([l,v,ic,col]) => (
          <div key={l} className="dash-card" style={{ padding:"18px 20px" }}>
            <div style={{ display:"flex", justifyContent:"space-between", marginBottom:10 }}>
              <div style={{ fontSize:11, fontWeight:600, color:"rgba(255,255,255,.4)", textTransform:"uppercase", letterSpacing:".06em" }}>{l}</div>
              <div style={{ width:34, height:34, borderRadius:9, background:col+"18", display:"flex", alignItems:"center", justifyContent:"center", fontSize:16 }}>{ic}</div>
            </div>
            <div style={{ fontSize:24, fontWeight:800, color:"#eef2ff" }}>{v}</div>
          </div>
        ))}
      </div>
      <div className="dash-card" style={{ overflow:"hidden" }}>
        {isLoading ? <div style={{ padding:"40px", textAlign:"center", color:"rgba(255,255,255,.4)", fontSize:13 }}>Loading...</div> : (
          <div style={{ overflowX:"auto" }}>
            <table style={{ width:"100%", borderCollapse:"collapse" }}>
              <thead><tr>
                {["Customer","Orders","Total Spent","Last Order","Status","Actions"].map(h => (
                  <th key={h} style={{ padding:"10px 14px", textAlign:"left", fontSize:11, fontWeight:600, color:"rgba(255,255,255,.35)", borderBottom:"1px solid rgba(255,255,255,.07)", letterSpacing:".05em", textTransform:"uppercase" }}>{h}</th>
                ))}
              </tr></thead>
              <tbody>
                {customers.map(c => (
                  <tr key={c._id} style={{ borderBottom:"1px solid rgba(255,255,255,.04)" }}>
                    <td style={{ padding:"12px 14px" }}>
                      <div style={{ display:"flex", alignItems:"center", gap:10 }}>
                        <div style={{ width:32, height:32, borderRadius:"50%", background:"rgba(59,130,246,.2)", display:"flex", alignItems:"center", justifyContent:"center", fontSize:13, fontWeight:700, color:"#3b82f6", flexShrink:0 }}>{(c.name||"U")[0]}</div>
                        <div><div style={{ fontSize:13, fontWeight:600, color:"#eef2ff" }}>{c.name}</div><div style={{ fontSize:11, color:"rgba(255,255,255,.35)" }}>{c.email}</div></div>
                      </div>
                    </td>
                    <td style={{ padding:"12px 14px", fontWeight:700, color:"#eef2ff", fontFamily:"monospace" }}>{c.orders}</td>
                    <td style={{ padding:"12px 14px", fontWeight:700, color:"#10b981", fontFamily:"monospace" }}>{fmt(c.spent)}</td>
                    <td style={{ padding:"12px 14px", fontSize:12, color:"rgba(255,255,255,.4)" }}>{c.lastOrder ? new Date(c.lastOrder).toLocaleDateString("en-NG",{day:"numeric",month:"short"}) : "—"}</td>
                    <td style={{ padding:"12px 14px" }}><span style={{ display:"inline-flex", padding:"3px 8px", borderRadius:6, fontSize:10, fontWeight:700, background:"rgba(16,185,129,.12)", color:"#10b981" }}>Active</span></td>
                    <td style={{ padding:"12px 14px" }}>
                      <button style={{ padding:"5px 12px", background:"rgba(255,255,255,.05)", border:"1px solid rgba(255,255,255,.1)", borderRadius:6, color:"rgba(255,255,255,.5)", fontSize:11, cursor:"pointer" }}>Message</button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  )
}
