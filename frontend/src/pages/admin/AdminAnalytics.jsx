import { useQuery } from '@tanstack/react-query'
import { adminAPI } from '../../api'

const fmtK = n => n>=1000000?"NGN "+(n/1000000).toFixed(1)+"M":n>=1000?"NGN "+(n/1000).toFixed(0)+"k":"NGN "+n
const fmt  = n => "NGN " + Number(n).toLocaleString()

function StatCard({label,value,icon,sub,color,delay=0}) {
  return (
    <div className="dash-card" style={{padding:'18px 20px',animation:'fadeUp .4s ease '+delay+'ms both'}}>
      <div style={{display:'flex',alignItems:'flex-start',justifyContent:'space-between',marginBottom:10}}>
        <div style={{fontSize:11,fontWeight:600,color:'rgba(255,255,255,.4)',letterSpacing:'.06em',textTransform:'uppercase'}}>{label}</div>
        <div style={{width:34,height:34,borderRadius:9,background:color+'18',display:'flex',alignItems:'center',justifyContent:'center',fontSize:16}}>{icon}</div>
      </div>
      <div style={{fontSize:24,fontWeight:800,color:'#eef2ff',marginBottom:4}}>{value}</div>
      {sub&&<div style={{fontSize:11,color:'rgba(255,255,255,.35)'}}>{sub}</div>}
    </div>
  )
}

export default function AdminAnalytics() {
  const { data } = useQuery({ queryKey:['admin-analytics'], queryFn: adminAPI.getAnalytics })
  const analytics = data?.data?.data || {}

  const totalRev = analytics.totalRevenue || 37660000
  const CATS = [['Fashion',38],['Beauty',24],['Electronics',18],['Home',10],['Jewelry',6],['Food',4]]
  const COLS = ['#3b82f6','#10b981','#8b5cf6','#f59e0b','#f43f5e','#06b6d4']

  const MONTHS = analytics.monthlyOrders || []
  const REV_DATA = MONTHS.length ? MONTHS : [820,1240,2100,1680,1920,2340].map((v,i)=>({rev:v*1000,count:40+i*5}))
  const maxRev   = Math.max(...REV_DATA.map(d=>d.revenue||d.rev||0),1)

  return (
    <div>
      <div style={{marginBottom:20}}><h2 style={{fontWeight:700,fontSize:18,color:'#eef2ff',margin:0}}>Platform Analytics</h2><div style={{fontSize:12,color:'rgba(255,255,255,.4)',marginTop:2}}>Full platform performance — all vendors</div></div>

      <div style={{display:'grid',gridTemplateColumns:'repeat(4,1fr)',gap:14,marginBottom:16}}>
        <StatCard label="Total GMV"       value={fmtK(totalRev)}             icon="💰" sub="Gross merchandise value" color="#10b981" delay={0}/>
        <StatCard label="Platform Revenue" value={fmtK(totalRev*0.05)}       icon="📈" sub="5% commission"           color="#3b82f6" delay={60}/>
        <StatCard label="Total Orders"    value="4,847"                       icon="📦" sub="+18% this month"         color="#8b5cf6" delay={120}/>
        <StatCard label="Active Customers" value="3,420"                      icon="👥" sub="Unique buyers"            color="#f59e0b" delay={180}/>
      </div>

      <div style={{display:'grid',gridTemplateColumns:'2fr 1fr',gap:14,marginBottom:14}}>
        <div className="dash-card" style={{padding:22}}>
          <div style={{fontWeight:700,fontSize:14,color:'#eef2ff',marginBottom:18}}>Monthly Revenue</div>
          <div style={{display:'flex',gap:6,alignItems:'flex-end',height:140,marginBottom:10}}>
            {REV_DATA.slice(-6).map((d,i) => {
              const rev = d.revenue || d.rev || 0
              const h = Math.round((rev/maxRev)*100)
              const cols = ['#3b82f6','#8b5cf6','#10b981','#3b82f6','#8b5cf6','#f59e0b']
              const label = d._id ? String(d._id.month).padStart(2,'0') : ['Oct','Nov','Dec','Jan','Feb','Mar'][i]
              return (
                <div key={i} style={{flex:1,display:'flex',flexDirection:'column',alignItems:'center',gap:5}}>
                  <div style={{fontSize:9,color:'rgba(255,255,255,.3)'}}>{fmtK(rev)}</div>
                  <div style={{width:'100%',height:h+'%',background:cols[i],borderRadius:'4px 4px 0 0',minHeight:4,opacity:.85}}/>
                  <div style={{fontSize:10,color:'rgba(255,255,255,.35)'}}>{label}</div>
                </div>
              )
            })}
          </div>
        </div>
        <div className="dash-card" style={{padding:20}}>
          <div style={{fontWeight:700,fontSize:14,color:'#eef2ff',marginBottom:14}}>Sales by Category</div>
          {CATS.map(([cat,pct],i) => (
            <div key={cat} style={{marginBottom:11}}>
              <div style={{display:'flex',justifyContent:'space-between',marginBottom:5,fontSize:12}}>
                <span style={{color:'rgba(255,255,255,.6)'}}>{cat}</span>
                <span style={{color:'#eef2ff',fontWeight:600}}>{pct}%</span>
              </div>
              <div style={{height:6,background:'rgba(255,255,255,.06)',borderRadius:3,overflow:'hidden'}}>
                <div style={{height:'100%',width:pct+'%',background:COLS[i],borderRadius:3}}/>
              </div>
            </div>
          ))}
        </div>
      </div>

      <div style={{display:'grid',gridTemplateColumns:'repeat(3,1fr)',gap:14}}>
        <div className="dash-card" style={{padding:20}}>
          <div style={{fontWeight:700,fontSize:14,color:'#eef2ff',marginBottom:14}}>Conversion Funnel</div>
          {[['Visitors','12,840','100%','#3b82f6'],['Product Views','7,210','56%','#8b5cf6'],['Add to Cart','2,140','17%','#f59e0b'],['Checkout','980','8%','#f97316'],['Orders','847','7%','#10b981']].map(([l,v,pct,col]) => (
            <div key={l} style={{marginBottom:10}}>
              <div style={{display:'flex',justifyContent:'space-between',marginBottom:4,fontSize:11}}>
                <span style={{color:'rgba(255,255,255,.5)'}}>{l}</span>
                <span style={{color:'#eef2ff',fontWeight:600,fontFamily:'monospace'}}>{v}</span>
              </div>
              <div style={{height:5,background:'rgba(255,255,255,.05)',borderRadius:3,overflow:'hidden'}}>
                <div style={{height:'100%',width:pct,background:col,borderRadius:3}}/>
              </div>
            </div>
          ))}
        </div>
        <div className="dash-card" style={{padding:20}}>
          <div style={{fontWeight:700,fontSize:14,color:'#eef2ff',marginBottom:14}}>Key Metrics</div>
          {[[fmt(21800),'Avg Order Value','#eef2ff'],['34%','Repeat Purchase Rate','#10b981'],[fmt(85000),'Customer LTV','#3b82f6'],['1.2%','Refund Rate','#10b981'],['71%','Cart Abandonment','#f59e0b'],['67%','AI Automation','#8b5cf6']].map(([v,l,c]) => (
            <div key={l} style={{display:'flex',justifyContent:'space-between',padding:'7px 0',borderBottom:'1px solid rgba(255,255,255,.05)'}}>
              <span style={{fontSize:12,color:'rgba(255,255,255,.4)'}}>{l}</span>
              <span style={{fontSize:12,fontWeight:700,color:c,fontFamily:'monospace'}}>{v}</span>
            </div>
          ))}
        </div>
        <div className="dash-card" style={{padding:20}}>
          <div style={{fontWeight:700,fontSize:14,color:'#eef2ff',marginBottom:14}}>AI Usage</div>
          {[['Total AI Requests','12,840','#3b82f6'],['WhatsApp Bot Sessions','8,420','#10b981'],['Content Generated','2,140','#8b5cf6'],['Cart Recoveries','312','#f59e0b'],['AI Orders Placed','67','#10b981']].map(([l,v,c]) => (
            <div key={l} style={{display:'flex',justifyContent:'space-between',padding:'7px 0',borderBottom:'1px solid rgba(255,255,255,.05)'}}>
              <span style={{fontSize:12,color:'rgba(255,255,255,.4)'}}>{l}</span>
              <span style={{fontSize:12,fontWeight:700,color:c,fontFamily:'monospace'}}>{v}</span>
            </div>
          ))}
        </div>
      </div>
      <style>{"@keyframes fadeUp{from{opacity:0;transform:translateY(12px)}to{opacity:1;transform:translateY(0)}}"}</style>
    </div>
  )
}
