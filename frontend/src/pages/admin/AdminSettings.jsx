import { useState } from 'react'
import { useMutation } from '@tanstack/react-query'
import { adminAPI, authAPI } from '../../api'
import toast from 'react-hot-toast'

const Toggle = ({on,onChange}) => <div onClick={()=>onChange(!on)} style={{width:38,height:21,borderRadius:99,background:on?'#f59e0b':'rgba(255,255,255,.1)',position:'relative',cursor:'pointer',transition:'background .2s',flexShrink:0}}><div style={{position:'absolute',top:2,left:on?18:2,width:15,height:15,borderRadius:'50%',background:'#fff',transition:'left .2s',boxShadow:'0 1px 4px rgba(0,0,0,.3)'}}/></div>

export default function AdminSettings() {
  const [tab, setTab]   = useState('general')
  const [pass, setPass] = useState({ currentPassword:'', newPassword:'', confirmPassword:'' })
  const [flags, setFlags] = useState({ aiEnabled:true, botEnabled:true, socialPosting:true, vendorReg:true, marketplace:true, maintenance:false })
  const [aiFlags, setAiFlags] = useState({ bot:true, descriptions:true, captions:true, hashtags:true, comments:false, dm:false })

  const saveSettings = useMutation({ mutationFn:() => adminAPI.updateSettings({ flags }), onSuccess:()=>toast.success('Settings saved!') })
  const changePass   = useMutation({
    mutationFn: () => authAPI.changePassword({ currentPassword:pass.currentPassword, newPassword:pass.newPassword }),
    onSuccess: () => { toast.success('Admin password changed!'); setPass({currentPassword:'',newPassword:'',confirmPassword:''}) },
    onError: err => toast.error(err.response?.data?.message||'Error'),
  })

  const TABS = [['general','General'],['payments','Payments'],['plans','Plans'],['password','Password'],['ai','AI Config']]
  const inp = {width:'100%',padding:'9px 12px',background:'rgba(255,255,255,.06)',border:'1px solid rgba(255,255,255,.1)',borderRadius:8,color:'#eef2ff',fontSize:13,fontFamily:'DM Sans,sans-serif',outline:'none',marginBottom:13}
  const lbl = {fontSize:11,fontWeight:600,color:'rgba(255,255,255,.45)',letterSpacing:'.05em',textTransform:'uppercase',marginBottom:5,display:'block'}

  return (
    <div>
      <div style={{marginBottom:20}}><h2 style={{fontWeight:700,fontSize:18,color:'#eef2ff',margin:0}}>System Settings</h2></div>
      <div style={{display:'flex',gap:4,marginBottom:20,borderBottom:'1px solid rgba(255,255,255,.07)',flexWrap:'wrap'}}>
        {TABS.map(([k,l]) => <button key={k} onClick={()=>setTab(k)} style={{padding:'8px 15px',border:'none',background:'transparent',cursor:'pointer',fontSize:12,fontWeight:tab===k?700:400,color:tab===k?'#f59e0b':'rgba(255,255,255,.4)',borderBottom:'2px solid '+(tab===k?'#f59e0b':'transparent'),fontFamily:'DM Sans,sans-serif',marginBottom:-1,transition:'all .18s'}}>{l}</button>)}
      </div>

      {tab==='general' && (
        <div style={{display:'grid',gridTemplateColumns:'1fr 1fr',gap:16}}>
          <div className="dash-card" style={{padding:22}}>
            <div style={{fontWeight:700,fontSize:14,color:'#eef2ff',marginBottom:14}}>Platform Settings</div>
            <label style={lbl}>Platform Name</label><input defaultValue="ChatCart" style={inp}/>
            <label style={lbl}>Support Email</label><input defaultValue="support@chatcart.com" style={inp}/>
            <label style={lbl}>Platform Commission %</label><input defaultValue="5" type="number" style={inp}/>
            <label style={lbl}>Default Currency</label><input defaultValue="NGN" style={inp}/>
            <button onClick={()=>saveSettings.mutate()} style={{padding:'10px 22px',background:'#3b82f6',color:'#fff',border:'none',borderRadius:8,fontSize:13,fontWeight:700,cursor:'pointer'}}>Save Settings</button>
          </div>
          <div className="dash-card" style={{padding:22}}>
            <div style={{fontWeight:700,fontSize:14,color:'#eef2ff',marginBottom:14}}>Feature Flags</div>
            {[['aiEnabled','AI automation enabled'],['botEnabled','WhatsApp bot active'],['socialPosting','Social posting'],['vendorReg','Vendor registration open'],['marketplace','Marketplace public'],['maintenance','Maintenance mode']].map(([k,l],i,arr) => (
              <div key={k} style={{display:'flex',alignItems:'center',justifyContent:'space-between',padding:'10px 0',borderBottom:i<arr.length-1?'1px solid rgba(255,255,255,.05)':'none'}}>
                <span style={{fontSize:13,color:'#eef2ff'}}>{l}</span>
                <Toggle on={flags[k]} onChange={v=>setFlags(f=>({...f,[k]:v}))}/>
              </div>
            ))}
          </div>
        </div>
      )}

      {tab==='payments' && (
        <div className="dash-card" style={{padding:22,maxWidth:560}}>
          <div style={{fontWeight:700,fontSize:14,color:'#eef2ff',marginBottom:14}}>Payment Gateway Configuration</div>
          <label style={lbl}>Flutterwave Public Key</label><input type="password" defaultValue="FLWPUBK_TEST-..." style={inp}/>
          <label style={lbl}>Flutterwave Secret Key</label><input type="password" defaultValue="FLWSECK_TEST-..." style={inp}/>
          <label style={lbl}>Paystack Secret Key</label><input type="password" defaultValue="sk_test_..." style={inp}/>
          <label style={lbl}>Webhook Hash</label><input type="password" defaultValue="your_webhook_hash" style={inp}/>
          <button onClick={()=>toast.success('Payment config saved!')} style={{padding:'10px 22px',background:'#3b82f6',color:'#fff',border:'none',borderRadius:8,fontSize:13,fontWeight:700,cursor:'pointer'}}>Save</button>
        </div>
      )}

      {tab==='plans' && (
        <div className="dash-card" style={{padding:22}}>
          <div style={{fontWeight:700,fontSize:14,color:'#eef2ff',marginBottom:16}}>Subscription Plans</div>
          <div style={{display:'grid',gridTemplateColumns:'repeat(auto-fit,minmax(200px,1fr))',gap:14}}>
            {[['Free','$0',['5 products','20 AI msgs','Basic analytics']],['Starter','$10',['50 products','200 AI msgs','WhatsApp bot','Social posting']],['Pro','$30',['Unlimited products','Unlimited AI','Advanced analytics','Priority support']],['Business','$69',['Everything in Pro','Dedicated agent','API access','White label']]].map(([name,price,features]) => (
              <div key={name} style={{background:'rgba(255,255,255,.03)',border:'1px solid rgba(255,255,255,.08)',borderRadius:12,padding:18}}>
                <div style={{fontSize:14,fontWeight:700,color:'#eef2ff',marginBottom:4}}>{name}</div>
                <div style={{fontSize:28,fontWeight:900,color:'#3b82f6',marginBottom:12,fontFamily:'monospace'}}>{price}<span style={{fontSize:12,fontWeight:400,color:'rgba(255,255,255,.4)'}}>/mo</span></div>
                {features.map(f => <div key={f} style={{fontSize:12,color:'rgba(255,255,255,.5)',marginBottom:5,display:'flex',alignItems:'center',gap:6}}><span style={{color:'#10b981'}}>ok</span>{f}</div>)}
                <button onClick={()=>toast.success(name+' plan updated!')} style={{width:'100%',padding:'8px',border:'1px solid rgba(255,255,255,.1)',borderRadius:7,background:'rgba(255,255,255,.05)',color:'rgba(255,255,255,.5)',fontSize:11,cursor:'pointer',marginTop:12}}>Edit Plan</button>
              </div>
            ))}
          </div>
        </div>
      )}

      {tab==='password' && (
        <div className="dash-card" style={{padding:22,maxWidth:480}}>
          <div style={{fontWeight:700,fontSize:14,color:'#eef2ff',marginBottom:16}}>Change Admin Password</div>
          <label style={lbl}>Current Password</label><input type="password" value={pass.currentPassword} onChange={e=>setPass(p=>({...p,currentPassword:e.target.value}))} style={inp}/>
          <label style={lbl}>New Password</label><input type="password" value={pass.newPassword} onChange={e=>setPass(p=>({...p,newPassword:e.target.value}))} style={inp}/>
          <label style={lbl}>Confirm New Password</label><input type="password" value={pass.confirmPassword} onChange={e=>setPass(p=>({...p,confirmPassword:e.target.value}))} style={inp}/>
          <button onClick={()=>{ if(pass.newPassword!==pass.confirmPassword){toast.error("Passwords don't match");return} changePass.mutate() }} style={{padding:'10px 22px',background:'#f59e0b',color:'#1c1409',border:'none',borderRadius:8,fontSize:13,fontWeight:700,cursor:'pointer'}}>
            {changePass.isLoading?'Changing...':'Change Password'}
          </button>
        </div>
      )}

      {tab==='ai' && (
        <div className="dash-card" style={{padding:22}}>
          <div style={{fontWeight:700,fontSize:14,color:'#eef2ff',marginBottom:14}}>AI Configuration</div>
          <div style={{display:'grid',gridTemplateColumns:'1fr 1fr',gap:12,marginBottom:16}}>
            <div><label style={lbl}>AI Model</label><input defaultValue="claude-sonnet-4-20250514" style={{...inp,fontFamily:'monospace',fontSize:12}}/></div>
            <div><label style={lbl}>Max Tokens</label><input defaultValue="1000" type="number" style={inp}/></div>
            <div><label style={lbl}>Free Plan Daily Limit</label><input defaultValue="20" type="number" style={inp}/></div>
            <div><label style={lbl}>Pro Plan Daily Limit</label><input defaultValue="Unlimited" style={inp}/></div>
          </div>
          <div style={{fontWeight:700,fontSize:13,color:'#eef2ff',marginBottom:12}}>AI Feature Toggles</div>
          {[['bot','WhatsApp AI bot'],['descriptions','AI product descriptions'],['captions','AI caption generation'],['hashtags','AI hashtag suggestions'],['comments','AI comment replies'],['dm','AI DM responses']].map(([k,l],i,arr) => (
            <div key={k} style={{display:'flex',alignItems:'center',justifyContent:'space-between',padding:'10px 0',borderBottom:i<arr.length-1?'1px solid rgba(255,255,255,.05)':'none'}}>
              <span style={{fontSize:13,color:'#eef2ff'}}>{l}</span>
              <Toggle on={aiFlags[k]} onChange={v=>setAiFlags(f=>({...f,[k]:v}))}/>
            </div>
          ))}
          <button onClick={()=>toast.success('AI config saved!')} style={{marginTop:16,padding:'10px 22px',background:'#3b82f6',color:'#fff',border:'none',borderRadius:8,fontSize:13,fontWeight:700,cursor:'pointer'}}>Save AI Config</button>
        </div>
      )}
    </div>
  )
}
