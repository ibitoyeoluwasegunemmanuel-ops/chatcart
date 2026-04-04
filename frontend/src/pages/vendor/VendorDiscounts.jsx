import { useState } from "react"
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query"
import { discountsAPI } from "../../api"
import toast from "react-hot-toast"

const fmt = n => "N" + Number(n).toLocaleString()

export default function VendorDiscounts() {
  const [modal, setModal] = useState(false)
  const [form, setForm] = useState({ code:"", type:"percent", value:"", minOrder:"", maxUses:"100", expires:"" })
  const qc = useQueryClient()

  const { data } = useQuery({ queryKey:["discounts"], queryFn: discountsAPI.getAll })
  const discounts = data?.data?.discounts || []

  const gen = () => setForm(f => ({...f, code:"CC"+Math.random().toString(36).slice(2,8).toUpperCase()}))

  const create = useMutation({
    mutationFn: () => discountsAPI.create({ ...form, value:+form.value, minOrder:+form.minOrder||0, maxUses:+form.maxUses||100, expires:form.expires||undefined }),
    onSuccess: () => { toast.success("Discount code created!"); qc.invalidateQueries(["discounts"]); setModal(false); setForm({code:"",type:"percent",value:"",minOrder:"",maxUses:"100",expires:""}) },
    onError: err => toast.error(err.response?.data?.message||"Error"),
  })

  const toggle = useMutation({
    mutationFn: ({id,isActive}) => discountsAPI.update(id, {isActive}),
    onSuccess: () => qc.invalidateQueries(["discounts"]),
  })

  const del = useMutation({
    mutationFn: id => discountsAPI.delete(id),
    onSuccess: () => { toast.success("Deleted"); qc.invalidateQueries(["discounts"]) },
  })

  const inp = { width:"100%", padding:"9px 12px", background:"rgba(255,255,255,.06)", border:"1px solid rgba(255,255,255,.1)", borderRadius:8, color:"#eef2ff", fontSize:13, fontFamily:"DM Sans,sans-serif", outline:"none" }
  const lbl = { fontSize:11, fontWeight:600, color:"rgba(255,255,255,.45)", letterSpacing:".05em", textTransform:"uppercase", marginBottom:5 }

  return (
    <div>
      <div style={{ display:"flex", alignItems:"center", justifyContent:"space-between", marginBottom:20 }}>
        <div><h2 style={{ fontWeight:700, fontSize:18, color:"#eef2ff", margin:0 }}>Discounts</h2><div style={{ fontSize:12, color:"rgba(255,255,255,.4)", marginTop:2 }}>{discounts.length} codes</div></div>
        <button onClick={() => setModal(true)} style={{ padding:"9px 18px", background:"#3b82f6", color:"#fff", border:"none", borderRadius:8, fontSize:13, fontWeight:700, cursor:"pointer" }}>+ Create Code</button>
      </div>
      <div style={{ display:"grid", gap:12 }}>
        {discounts.map(d => (
          <div key={d._id} className="dash-card" style={{ padding:"16px 20px", display:"flex", alignItems:"center", gap:20, flexWrap:"wrap" }}>
            <div style={{ background:d.isActive?"rgba(16,185,129,.1)":"rgba(255,255,255,.04)", border:"1px solid "+(d.isActive?"rgba(16,185,129,.25)":"rgba(255,255,255,.08)"), borderRadius:9, padding:"10px 18px", flexShrink:0 }}>
              <div style={{ fontFamily:"monospace", fontSize:18, fontWeight:700, color:d.isActive?"#10b981":"rgba(255,255,255,.3)", letterSpacing:".06em" }}>{d.code}</div>
            </div>
            <div style={{ flex:1, minWidth:0 }}>
              <div style={{ fontSize:14, fontWeight:700, color:"#eef2ff", marginBottom:4 }}>{d.type==="percent"?d.value+"% off":fmt(d.value)+" off"}{d.minOrder>0?" · min "+fmt(d.minOrder):""}</div>
              <div style={{ height:5, background:"rgba(255,255,255,.06)", borderRadius:3, width:200, overflow:"hidden", marginBottom:5 }}>
                <div style={{ height:"100%", width:(d.usedCount/d.maxUses*100)+"%", background:d.isActive?"#3b82f6":"rgba(255,255,255,.15)", borderRadius:3 }}/>
              </div>
              <div style={{ fontSize:11, color:"rgba(255,255,255,.3)" }}>{d.usedCount}/{d.maxUses} uses{d.expires?" · Expires "+new Date(d.expires).toLocaleDateString():""}</div>
            </div>
            <div style={{ display:"flex", gap:8, alignItems:"center" }}>
              <div onClick={() => toggle.mutate({id:d._id,isActive:!d.isActive})} style={{ width:36, height:20, borderRadius:99, background:d.isActive?"#3b82f6":"rgba(255,255,255,.1)", position:"relative", cursor:"pointer", transition:"background .2s" }}>
                <div style={{ position:"absolute", top:2, left:d.isActive?17:2, width:16, height:16, borderRadius:"50%", background:"#fff", transition:"left .2s", boxShadow:"0 1px 4px rgba(0,0,0,.3)" }}/>
              </div>
              <button onClick={() => del.mutate(d._id)} style={{ width:28, height:28, borderRadius:6, border:"none", background:"rgba(244,63,94,.12)", color:"#f43f5e", cursor:"pointer", fontSize:12 }}>🗑</button>
            </div>
          </div>
        ))}
        {discounts.length === 0 && <div style={{ textAlign:"center", padding:"40px", color:"rgba(255,255,255,.3)", fontSize:13 }}>No discount codes yet. Create your first one!</div>}
      </div>

      {modal && (
        <div onClick={e=>e.target===e.currentTarget&&setModal(false)} style={{ position:"fixed", inset:0, background:"rgba(0,0,0,.75)", zIndex:900, display:"flex", alignItems:"center", justifyContent:"center" }}>
          <div style={{ background:"#0d1320", border:"1px solid rgba(255,255,255,.1)", borderRadius:16, width:480, maxWidth:"94vw", padding:24 }}>
            <div style={{ fontWeight:700, fontSize:16, color:"#eef2ff", marginBottom:20 }}>Create Discount Code</div>
            <div style={{ marginBottom:13 }}>
              <div style={lbl}>Code</div>
              <div style={{ display:"flex", gap:8 }}>
                <input value={form.code} onChange={e=>setForm(f=>({...f,code:e.target.value.toUpperCase()}))} placeholder="e.g. SAVE20" style={{...inp,flex:1}}/>
                <button onClick={gen} style={{ padding:"9px 14px", background:"rgba(255,255,255,.06)", border:"1px solid rgba(255,255,255,.1)", borderRadius:8, color:"rgba(255,255,255,.6)", cursor:"pointer", fontSize:12, whiteSpace:"nowrap" }}>Auto</button>
              </div>
            </div>
            <div style={{ display:"grid", gridTemplateColumns:"1fr 1fr", gap:12, marginBottom:13 }}>
              <div><div style={lbl}>Type</div><select value={form.type} onChange={e=>setForm(f=>({...f,type:e.target.value}))} style={inp}><option value="percent">Percentage (%)</option><option value="fixed">Fixed (N)</option></select></div>
              <div><div style={lbl}>{form.type==="percent"?"Discount %":"Amount (N)"}</div><input type="number" value={form.value} onChange={e=>setForm(f=>({...f,value:e.target.value}))} placeholder={form.type==="percent"?"10":"2000"} style={inp}/></div>
            </div>
            <div style={{ display:"grid", gridTemplateColumns:"1fr 1fr", gap:12, marginBottom:13 }}>
              <div><div style={lbl}>Min Order (N)</div><input type="number" value={form.minOrder} onChange={e=>setForm(f=>({...f,minOrder:e.target.value}))} placeholder="0" style={inp}/></div>
              <div><div style={lbl}>Max Uses</div><input type="number" value={form.maxUses} onChange={e=>setForm(f=>({...f,maxUses:e.target.value}))} placeholder="100" style={inp}/></div>
            </div>
            <div style={{ marginBottom:20 }}><div style={lbl}>Expiry Date (optional)</div><input type="date" value={form.expires} onChange={e=>setForm(f=>({...f,expires:e.target.value}))} style={inp}/></div>
            <div style={{ display:"flex", gap:10, justifyContent:"flex-end" }}>
              <button onClick={() => setModal(false)} style={{ padding:"9px 18px", background:"transparent", border:"1px solid rgba(255,255,255,.1)", borderRadius:8, color:"rgba(255,255,255,.5)", cursor:"pointer" }}>Cancel</button>
              <button onClick={() => create.mutate()} disabled={!form.code||!form.value||create.isLoading} style={{ padding:"9px 18px", background:"#3b82f6", color:"#fff", border:"none", borderRadius:8, fontSize:13, fontWeight:700, cursor:"pointer", opacity:!form.code||!form.value?.6:1 }}>{create.isLoading?"Creating...":"Create Code"}</button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
