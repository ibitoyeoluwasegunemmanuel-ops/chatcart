import { useState } from 'react'
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { whatsappAPI } from '../../api'
import toast from 'react-hot-toast'

const Toggle = ({on,onChange}) => (
  <div onClick={()=>onChange(!on)} style={{width:38,height:21,borderRadius:99,background:on?'#3b82f6':'rgba(255,255,255,.1)',position:'relative',cursor:'pointer',transition:'background .2s',flexShrink:0}}>
    <div style={{position:'absolute',top:2,left:on?18:2,width:15,height:15,borderRadius:'50%',background:'#fff',transition:'left .2s',boxShadow:'0 1px 4px rgba(0,0,0,.3)'}}/>
  </div>
)

export default function VendorWhatsApp() {
  const [tab, setTab] = useState('config')
  const [msg, setMsg] = useState('')
  const qc = useQueryClient()

  const { data: settingsData } = useQuery({ queryKey:['wa-settings'], queryFn: whatsappAPI.getSettings })
  const { data: broadData }    = useQuery({ queryKey:['wa-broadcasts'], queryFn: whatsappAPI.getBroadcasts })
  const { data: analyticsData } = useQuery({ queryKey:['wa-analytics'], queryFn: whatsappAPI.getAnalytics })

  const settings   = settingsData?.data?.settings || {}
  const broadcasts = broadData?.data?.broadcasts || []
  const analytics  = analyticsData?.data || {}

  const [botSettings, setBotSettings] = useState({
    autoGreet: settings.botSettings?.autoGreet ?? true,
    showProducts: settings.botSettings?.showProducts ?? true,
    acceptOrders: settings.botSettings?.acceptOrders ?? true,
    trackOrders: settings.botSettings?.trackOrders ?? true,
    escalate: settings.botSettings?.escalate ?? true,
    cartRecovery: settings.botSettings?.cartRecovery ?? false,
    recommendations: settings.botSettings?.recommendations ?? true,
  })

  const saveSettings = useMutation({
    mutationFn: () => whatsappAPI.updateSettings({ botEnabled: true, botSettings }),
    onSuccess: () => toast.success('Bot settings saved!'),
  })

  const sendBroadcast = useMutation({
    mutationFn: () => whatsappAPI.sendBroadcast({ message: msg, audience: 'all' }),
    onSuccess: () => { toast.success('Broadcast sent!'); setMsg(''); qc.invalidateQueries(['wa-broadcasts']) },
  })

  const TABS = [['config','⚙️ Bot Settings'],['broadcast','📢 Broadcasts'],['quickreply','⚡ Quick Replies'],['analytics','📊 Analytics']]
  const inp  = {width:'100%',padding:'9px 12px',background:'rgba(255,255,255,.06)',border:'1px solid rgba(255,255,255,.1)',borderRadius:8,color:'#eef2ff',fontSize:13,fontFamily:'DM Sans,sans-serif',outline:'none'}

  return (
    <div>
      <div style={{marginBottom:20}}>
        <h2 style={{fontWeight:700,fontSize:18,color:'#eef2ff',margin:0}}>WhatsApp Bot</h2>
        <div style={{display:'flex',alignItems:'center',gap:8,fontSize:12,color:'rgba(255,255,255,.4)',marginTop:4}}>
          <span style={{width:7,height:7,borderRadius:'50%',background:'#10b981',display:'inline-block',animation:'pulse 2s infinite'}}/>
          Bot active · Configure behaviour below
        </div>
      </div>

      <div style={{background:'rgba(245,158,11,.08)',border:'1px solid rgba(245,158,11,.2)',borderRadius:10,padding:'12px 16px',marginBottom:20,fontSize:12,color:'rgba(255,255,255,.6)',lineHeight:1.6}}>
        <strong style={{color:'#f59e0b'}}>How it works:</strong> Customers message your WhatsApp number. The AI bot handles product discovery, orders and tracking automatically. Conversations happen on WhatsApp — this panel controls what the bot does.
      </div>

      <div style={{display:'flex',gap:4,marginBottom:18,borderBottom:'1px solid rgba(255,255,255,.07)'}}>
        {TABS.map(([k,l]) => <button key={k} onClick={()=>setTab(k)} style={{padding:'8px 16px',border:'none',background:'transparent',cursor:'pointer',fontSize:12,fontWeight:tab===k?700:400,color:tab===k?'#3b82f6':'rgba(255,255,255,.4)',borderBottom:'2px solid '+(tab===k?'#3b82f6':'transparent'),fontFamily:'DM Sans,sans-serif',marginBottom:-1,transition:'all .18s'}}>{l}</button>)}
      </div>

      {tab==='config' && (
        <div style={{display:'grid',gridTemplateColumns:'1fr 1fr',gap:16}}>
          <div className="dash-card" style={{padding:20}}>
            <div style={{fontWeight:700,fontSize:13,color:'#eef2ff',marginBottom:16}}>Bot Behaviour</div>
            {[
              ['autoGreet','Auto-greet new customers','Sends welcome message on first contact'],
              ['showProducts','Show product catalog','AI displays matching products when asked'],
              ['acceptOrders','Accept in-chat orders','Full order flow inside WhatsApp'],
              ['trackOrders','Order status tracking','Customers type Order ID to check status'],
              ['escalate','Human handover','Escalate to you when AI cannot resolve'],
              ['cartRecovery','Cart recovery reminders','Remind customers who did not complete order'],
              ['recommendations','Product recommendations','AI suggests related products'],
            ].map(([k,l,d],i,arr) => (
              <div key={k} style={{display:'flex',alignItems:'center',justifyContent:'space-between',padding:'11px 0',borderBottom:i<arr.length-1?'1px solid rgba(255,255,255,.05)':'none'}}>
                <div><div style={{fontSize:13,fontWeight:500,color:'#eef2ff'}}>{l}</div><div style={{fontSize:11,color:'rgba(255,255,255,.35)',marginTop:1}}>{d}</div></div>
                <Toggle on={botSettings[k]} onChange={v=>setBotSettings(s=>({...s,[k]:v}))}/>
              </div>
            ))}
            <button onClick={()=>saveSettings.mutate()} style={{width:'100%',padding:'10px',background:'#3b82f6',color:'#fff',border:'none',borderRadius:8,fontSize:13,fontWeight:700,cursor:'pointer',marginTop:14}}>Save Settings</button>
          </div>
          <div>
            <div className="dash-card" style={{padding:20,marginBottom:14}}>
              <div style={{fontWeight:700,fontSize:13,color:'#eef2ff',marginBottom:14}}>Quick Stats (This Week)</div>
              {[['Conversations','42','#3b82f6'],['Orders via WhatsApp','8','#10b981'],['Auto-resolved','87%','#8b5cf6'],['Avg response time','1.8s','#f59e0b']].map(([l,v,c]) => (
                <div key={l} style={{display:'flex',justifyContent:'space-between',padding:'8px 0',borderBottom:'1px solid rgba(255,255,255,.05)'}}>
                  <span style={{fontSize:12,color:'rgba(255,255,255,.4)'}}>{l}</span>
                  <span style={{fontSize:13,fontWeight:700,color:c,fontFamily:'monospace'}}>{v}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {tab==='broadcast' && (
        <div style={{display:'grid',gridTemplateColumns:'1fr 1fr',gap:16}}>
          <div className="dash-card" style={{padding:20}}>
            <div style={{fontWeight:700,fontSize:14,color:'#eef2ff',marginBottom:16}}>New Broadcast</div>
            <div style={{marginBottom:13}}>
              <div style={{fontSize:11,fontWeight:600,color:'rgba(255,255,255,.45)',letterSpacing:'.05em',textTransform:'uppercase',marginBottom:5}}>Audience</div>
              <select style={inp}><option>All Customers</option><option>Past Buyers</option><option>Inactive 30 days</option></select>
            </div>
            <div style={{marginBottom:14}}>
              <div style={{fontSize:11,fontWeight:600,color:'rgba(255,255,255,.45)',letterSpacing:'.05em',textTransform:'uppercase',marginBottom:5}}>Message</div>
              <textarea value={msg} onChange={e=>setMsg(e.target.value)} rows={6} placeholder={"New arrivals just dropped!
chatcart.com/store/my-store"} style={{...inp,resize:'vertical'}}/>
            </div>
            <button onClick={()=>sendBroadcast.mutate()} disabled={!msg.trim()||sendBroadcast.isLoading} style={{width:'100%',padding:'10px',background:'#3b82f6',color:'#fff',border:'none',borderRadius:8,fontSize:13,fontWeight:700,cursor:'pointer',opacity:!msg.trim()?.6:1}}>
              {sendBroadcast.isLoading?'Sending...':'Send Broadcast'}
            </button>
          </div>
          <div>
            <div style={{fontWeight:700,fontSize:14,color:'#eef2ff',marginBottom:14}}>Sent Broadcasts</div>
            {broadcasts.length === 0
              ? <div style={{textAlign:'center',padding:'40px',color:'rgba(255,255,255,.3)',fontSize:13}}>No broadcasts yet</div>
              : broadcasts.map(b => (
                <div key={b._id} className="dash-card" style={{padding:14,marginBottom:10}}>
                  <div style={{fontSize:12,color:'rgba(255,255,255,.55)',whiteSpace:'pre-wrap',marginBottom:10,lineHeight:1.5}}>{b.message}</div>
                  <div style={{display:'flex',gap:14,fontSize:11}}>
                    <span style={{color:'rgba(255,255,255,.3)'}}>{new Date(b.createdAt).toLocaleDateString()}</span>
                    <span style={{color:'#3b82f6'}}>Reach: {b.reach}</span>
                    <span style={{color:'#10b981'}}>Opens: {b.opens}</span>
                  </div>
                </div>
              ))
            }
          </div>
        </div>
      )}

      {tab==='quickreply' && (
        <div className="dash-card" style={{padding:20}}>
          <div style={{fontWeight:700,fontSize:14,color:'#eef2ff',marginBottom:16}}>Quick Reply Templates</div>
          {[
            ['Welcome Message','Hello! Welcome to our store. How can I help you today?

1 Browse Products
2 Track Order
3 Payment Methods
4 Talk to Agent'],
            ['Payment Details','Payment Methods:

1 Bank Transfer
   Access Bank 0123456789

2 Pay on Delivery (Lagos)
3 Online via our website'],
            ['Out of Office','Thanks for messaging! We are currently offline. Business hours: Mon-Sat 8am-8pm. We will reply shortly!'],
          ].map(([label,val]) => (
            <div key={label} style={{marginBottom:18}}>
              <div style={{fontSize:11,fontWeight:600,color:'rgba(255,255,255,.45)',letterSpacing:'.05em',textTransform:'uppercase',marginBottom:6}}>{label}</div>
              <textarea defaultValue={val} rows={4} style={{...inp,resize:'vertical',fontSize:12}}/>
            </div>
          ))}
          <button onClick={()=>toast.success('Quick replies saved!')} style={{padding:'10px 22px',background:'#3b82f6',color:'#fff',border:'none',borderRadius:8,fontSize:13,fontWeight:700,cursor:'pointer'}}>Save Quick Replies</button>
        </div>
      )}

      {tab==='analytics' && (
        <div style={{display:'grid',gridTemplateColumns:'repeat(3,1fr)',gap:14}}>
          {[['Conversations','842','+12%','#3b82f6'],['WhatsApp Orders','67','+31%','#10b981'],['Revenue via WA','NGN1.4M','+24%','#f59e0b'],['Auto-resolved','89%','+5%','#8b5cf6'],['Avg Response','1.8s','-0.4s','#06b6d4'],['Cart Recovery','23%','+8%','#10b981']].map(([l,v,ch,c],i) => (
            <div key={l} className="dash-card" style={{padding:18,animation:'fadeUp .35s ease '+(i*60)+'ms both'}}>
              <div style={{fontSize:11,color:'rgba(255,255,255,.4)',fontWeight:600,textTransform:'uppercase',letterSpacing:'.06em',marginBottom:8}}>{l}</div>
              <div style={{fontSize:24,fontWeight:800,color:'#eef2ff',marginBottom:4}}>{v}</div>
              <span style={{fontSize:11,color:c,fontWeight:600}}>{ch} this month</span>
            </div>
          ))}
        </div>
      )}
      <style>{"@keyframes pulse{0%,100%{opacity:1}50%{opacity:.45}} @keyframes fadeUp{from{opacity:0;transform:translateY(12px)}to{opacity:1;transform:translateY(0)}}"}</style>
    </div>
  )
}
