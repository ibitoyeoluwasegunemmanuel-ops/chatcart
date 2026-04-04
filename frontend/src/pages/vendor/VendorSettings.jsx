import { useState } from "react"
import { useMutation } from "@tanstack/react-query"
import { vendorsAPI, authAPI } from "../../api"
import { useAuth } from "../../context/AuthContext"
import toast from "react-hot-toast"

export default function VendorSettings() {
  const { user, updateUser } = useAuth()
  const [tab, setTab] = useState("profile")
  const [pass, setPass] = useState({ currentPassword:"", newPassword:"", confirmPassword:"" })
  const [notifs, setNotifs] = useState({ newOrder:true, payment:true, lowStock:true, review:false, marketing:false })
  const [profile, setProfile] = useState({ name:user?.name||"", email:user?.email||"", phone:user?.phone||"" })
  const [store, setStore] = useState({ storeName:"", description:"", whatsapp:"", instagram:"", facebook:"", bankName:"", bankAccount:"", bankHolder:"" })

  const saveProfile = useMutation({ mutationFn:() => authAPI.me(), onSuccess:() => toast.success("Profile saved!") })
  const saveStore   = useMutation({ mutationFn:() => vendorsAPI.update(store), onSuccess:() => toast.success("Store info saved!") })
  const changePass  = useMutation({
    mutationFn: () => authAPI.changePassword({ currentPassword:pass.currentPassword, newPassword:pass.newPassword }),
    onSuccess: () => { toast.success("Password changed!"); setPass({currentPassword:"",newPassword:"",confirmPassword:""}) },
    onError: err => toast.error(err.response?.data?.message||"Error"),
  })

  const tabs = [["profile","Profile"],["store","Store"],["payment","Payment"],["password","Password"],["notifications","Notifications"]]
  const inp = { width:"100%", padding:"9px 12px", background:"rgba(255,255,255,.06)", border:"1px solid rgba(255,255,255,.1)", borderRadius:8, color:"#eef2ff", fontSize:13, fontFamily:"DM Sans,sans-serif", outline:"none", marginBottom:13 }
  const lbl = { fontSize:11, fontWeight:600, color:"rgba(255,255,255,.45)", letterSpacing:".05em", textTransform:"uppercase", marginBottom:5, display:"block" }
  const Toggle = ({on,onChange}) => <div onClick={()=>onChange(!on)} style={{ width:36,height:20,borderRadius:99,background:on?"#3b82f6":"rgba(255,255,255,.1)",position:"relative",cursor:"pointer",transition:"background .2s",flexShrink:0 }}><div style={{ position:"absolute",top:2,left:on?17:2,width:16,height:16,borderRadius:"50%",background:"#fff",transition:"left .2s" }}/></div>

  return (
    <div>
      <div style={{ marginBottom:20 }}><h2 style={{ fontWeight:700, fontSize:18, color:"#eef2ff", margin:0 }}>Settings</h2></div>
      <div style={{ display:"flex", gap:4, marginBottom:20, borderBottom:"1px solid rgba(255,255,255,.07)", flexWrap:"wrap" }}>
        {tabs.map(([k,l]) => <button key={k} onClick={()=>setTab(k)} style={{ padding:"8px 15px", border:"none", background:"transparent", cursor:"pointer", fontSize:12, fontWeight:tab===k?700:400, color:tab===k?"#3b82f6":"rgba(255,255,255,.4)", borderBottom:"2px solid "+(tab===k?"#3b82f6":"transparent"), fontFamily:"DM Sans,sans-serif", marginBottom:-1, transition:"all .18s" }}>{l}</button>)}
      </div>

      {tab==="profile" && <div className="dash-card" style={{ padding:22, maxWidth:560 }}>
        <label style={lbl}>Full Name</label><input value={profile.name} onChange={e=>setProfile(p=>({...p,name:e.target.value}))} style={inp}/>
        <label style={lbl}>Email</label><input type="email" value={profile.email} onChange={e=>setProfile(p=>({...p,email:e.target.value}))} style={inp}/>
        <label style={lbl}>Phone</label><input value={profile.phone} onChange={e=>setProfile(p=>({...p,phone:e.target.value}))} style={inp}/>
        <button onClick={() => saveProfile.mutate()} style={{ padding:"10px 22px", background:"#3b82f6", color:"#fff", border:"none", borderRadius:8, fontSize:13, fontWeight:700, cursor:"pointer" }}>Save Profile</button>
      </div>}

      {tab==="store" && <div className="dash-card" style={{ padding:22, maxWidth:560 }}>
        <label style={lbl}>Store Name</label><input value={store.storeName} onChange={e=>setStore(s=>({...s,storeName:e.target.value}))} placeholder="My Awesome Store" style={inp}/>
        <label style={lbl}>Description</label><textarea value={store.description} onChange={e=>setStore(s=>({...s,description:e.target.value}))} rows={3} style={{...inp,resize:"vertical"}}/>
        <label style={lbl}>WhatsApp Number</label><input value={store.whatsapp} onChange={e=>setStore(s=>({...s,whatsapp:e.target.value}))} placeholder="+234 800 000 0000" style={inp}/>
        <label style={lbl}>Instagram Handle</label><input value={store.instagram} onChange={e=>setStore(s=>({...s,instagram:e.target.value}))} placeholder="@mystore" style={inp}/>
        <button onClick={() => saveStore.mutate()} style={{ padding:"10px 22px", background:"#3b82f6", color:"#fff", border:"none", borderRadius:8, fontSize:13, fontWeight:700, cursor:"pointer" }}>Save Store Info</button>
      </div>}

      {tab==="payment" && <div className="dash-card" style={{ padding:22, maxWidth:560 }}>
        <div style={{ background:"rgba(245,158,11,.08)", border:"1px solid rgba(245,158,11,.2)", borderRadius:9, padding:"12px 14px", marginBottom:16, fontSize:12, color:"rgba(255,255,255,.55)" }}>
          Bank details are shown to customers for manual transfers.
        </div>
        <label style={lbl}>Bank Name</label><input value={store.bankName} onChange={e=>setStore(s=>({...s,bankName:e.target.value}))} placeholder="Access Bank" style={inp}/>
        <label style={lbl}>Account Name</label><input value={store.bankHolder} onChange={e=>setStore(s=>({...s,bankHolder:e.target.value}))} style={inp}/>
        <label style={lbl}>Account Number</label><input value={store.bankAccount} onChange={e=>setStore(s=>({...s,bankAccount:e.target.value}))} style={{...inp,fontFamily:"monospace"}}/>
        <button onClick={() => saveStore.mutate()} style={{ padding:"10px 22px", background:"#3b82f6", color:"#fff", border:"none", borderRadius:8, fontSize:13, fontWeight:700, cursor:"pointer" }}>Save Payment Details</button>
      </div>}

      {tab==="password" && <div className="dash-card" style={{ padding:22, maxWidth:480 }}>
        <label style={lbl}>Current Password</label><input type="password" value={pass.currentPassword} onChange={e=>setPass(p=>({...p,currentPassword:e.target.value}))} style={inp}/>
        <label style={lbl}>New Password</label><input type="password" value={pass.newPassword} onChange={e=>setPass(p=>({...p,newPassword:e.target.value}))} style={inp}/>
        <label style={lbl}>Confirm Password</label><input type="password" value={pass.confirmPassword} onChange={e=>setPass(p=>({...p,confirmPassword:e.target.value}))} style={inp}/>
        <button onClick={() => { if(pass.newPassword!==pass.confirmPassword){toast.error("Passwords don't match");return} changePass.mutate() }} style={{ padding:"10px 22px", background:"#3b82f6", color:"#fff", border:"none", borderRadius:8, fontSize:13, fontWeight:700, cursor:"pointer" }}>Change Password</button>
      </div>}

      {tab==="notifications" && <div className="dash-card" style={{ padding:22, maxWidth:560 }}>
        {[["newOrder","New order received","Email + WhatsApp"],["payment","Payment confirmed","Email"],["lowStock","Low stock alert","Email"],["review","New customer review","Email"],["marketing","Marketing tips","Email"]].map(([k,l,ch],i,arr) => (
          <div key={k} style={{ display:"flex", alignItems:"center", justifyContent:"space-between", padding:"12px 0", borderBottom:i<arr.length-1?"1px solid rgba(255,255,255,.05)":"none" }}>
            <div><div style={{ fontSize:13, color:"#eef2ff" }}>{l}</div><div style={{ fontSize:11, color:"rgba(255,255,255,.35)" }}>{ch}</div></div>
            <Toggle on={notifs[k]} onChange={v=>setNotifs(n=>({...n,[k]:v}))}/>
          </div>
        ))}
        <button onClick={() => toast.success("Preferences saved!")} style={{ marginTop:16, padding:"10px 22px", background:"#3b82f6", color:"#fff", border:"none", borderRadius:8, fontSize:13, fontWeight:700, cursor:"pointer" }}>Save Preferences</button>
      </div>}
    </div>
  )
}
