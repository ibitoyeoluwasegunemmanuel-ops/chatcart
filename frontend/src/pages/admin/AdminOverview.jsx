import { useQuery } from '@tanstack/react-query'
import { adminAPI } from '../../api'

const fmt  = n => "NGN " + Number(n).toLocaleString()
const fmtK = n => n>=1000000?"NGN "+(n/1000000).toFixed(1)+"M":n>=1000?"NGN "+(n/1000).toFixed(0)+"k":"NGN "+n

function StatCard({label,value,icon,sub,color,delay=0}) {
  return (
    <div className="dash-card" style={{padding:'18px 20px',animation:'fadeUp .4s ease '+delay+'ms both'}}>
      <div style={{display:'flex',alignItems:'flex-start',justifyContent:'space-between',marginBottom:12}}>
        <div style={{fontSize:11,fontWeight:600,color:'rgba(255,255,255,.4)',letterSpacing:'.06em',textTransform:'uppercase'}}>{label}</div>
        <div style={{width:34,height:34,borderRadius:9,background:color+'18',display:'flex',alignItems:'center',justifyContent:'center',fontSize:16}}>{icon}</div>
      </div>
      <div style={{fontSize:24,fontWeight:800,color:'#eef2ff',marginBottom:4}}>{value}</div>
      {sub&&<div style={{fontSize:11,color:'rgba(255,255,255,.35)'}}>{sub}</div>}
    </div>
  )
}

export default function AdminOverview() {
  const { data, isLoading } = useQuery({ queryKey:['admin-overview'], queryFn: adminAPI.overview })
  const d = data?.data?.data || {}

  const MONTHS = ['Oct','Nov','Dec','Jan','Feb','Mar']
  const REV    = [820000,1240000,2100000,1680000,1920000,2340000]
  const maxRev = Math.max(...REV)

  return (
    <div>
      <div style={{marginBottom:20}}>
        <h2 style={{fontWeight:700,fontSize:20,color:'#eef2ff',margin:0}}>Platform Overview</h2>
        <div style={{fontSize:13,color:'rgba(255,255,255,.4)',marginTop:3}}>ChatCart real-time analytics</div>
      </div>

      <div style={{display:'grid',gridTemplateColumns:'repeat(4,1fr)',gap:14,marginBottom:16}}>
        <StatCard label="Total Revenue"    value={fmtK(d.totalRevenue||0)}                    icon="💰" sub="All vendors combined" color="#10b981" delay={0}/>
        <StatCard label="Active Vendors"   value={d.totalVendors||0}                           icon="🏪" sub={(d.pendingVendors||0)+" pending approval"} color="#3b82f6" delay={60}/>
        <StatCard label="Total Orders"     value={(d.totalOrders||0).toLocaleString()}         icon="📦" sub="+12% this month" color="#8b5cf6" delay={120}/>
        <StatCard label="Platform Users"   value={(d.totalUsers||0).toLocaleString()}          icon="👥" sub="Customers and vendors" color="#f59e0b" delay={180}/>
      </div>

      <div style={{display:'grid',gridTemplateColumns:'1.6fr 1fr',gap:14,marginBottom:14}}>
        <div className="dash-card" style={{padding:22}}>
          <div style={{fontWeight:700,fontSize:14,color:'#eef2ff',marginBottom:18}}>Platform Revenue Trend</div>
          <div style={{display:'flex',gap:6,alignItems:'flex-end',height:130,marginBottom:10}}>
            {MONTHS.map((m,i) => {
              const h = Math.round((REV[i]/maxRev)*100)
              const cols = ['#3b82f6','#8b5cf6','#10b981','#3b82f6','#8b5cf6','#f59e0b']
              return (
                <div key={m} style={{flex:1,display:'flex',flexDirection:'column',alignItems:'center',gap:5}}>
                  <div style={{fontSize:9,color:'rgba(255,255,255,.3)'}}>{fmtK(REV[i])}</div>
                  <div style={{width:'100%',height:h+'%',background:cols[i],borderRadius:'4px 4px 0 0',minHeight:4,opacity:.85}}/>
                  <div style={{fontSize:10,color:'rgba(255,255,255,.35)'}}>{m}</div>
                </div>
              )
            })}
          </div>
        </div>

        <div className="dash-card" style={{padding:20}}>
          <div style={{fontWeight:700,fontSize:14,color:'#eef2ff',marginBottom:14}}>Top Vendors</div>
          {(d.topVendors||[{storeName:'GlowNaija',totalRevenue:9600000},{storeName:"Adaeze Boutique",totalRevenue:4820000},{storeName:'TechZone NG',totalRevenue:8700000}]).slice(0,5).map((v,i) => (
            <div key={i} style={{display:'flex',alignItems:'center',gap:10,padding:'8px 0',borderBottom:'1px solid rgba(255,255,255,.05)'}}>
              <div style={{width:24,height:24,borderRadius:'50%',background:['rgba(234,179,8,.2)','rgba(148,163,184,.15)','rgba(205,127,50,.15)','rgba(255,255,255,.06)','rgba(255,255,255,.04)'][i]||'rgba(255,255,255,.04)',display:'flex',alignItems:'center',justifyContent:'center',fontSize:10,fontWeight:700,color:['#eab308','#94a3b8','#cd7f32','rgba(255,255,255,.4)','rgba(255,255,255,.3)'][i]||'rgba(255,255,255,.3)',flexShrink:0}}>{i+1}</div>
              <div style={{flex:1,minWidth:0}}>
                <div style={{fontSize:12,fontWeight:500,color:'#eef2ff',overflow:'hidden',textOverflow:'ellipsis',whiteSpace:'nowrap'}}>{v.storeName||v.user?.name}</div>
              </div>
              <span style={{fontSize:11,fontWeight:700,color:'#10b981',fontFamily:'monospace'}}>{fmtK(v.totalRevenue||0)}</span>
            </div>
          ))}
        </div>
      </div>

      <div style={{display:'grid',gridTemplateColumns:'1fr 1fr 1fr',gap:14}}>
        <div className="dash-card" style={{padding:18}}>
          <div style={{fontWeight:700,fontSize:13,color:'#eef2ff',marginBottom:14}}>Recent Activity</div>
          {[['New vendor application','BeadsByTemi','2 min ago'],['Order delivered','Adaeze Boutique','18 min ago'],['Payment confirmed','TechZone NG','1h ago'],['New product listed','GlowNaija','2h ago']].map(([a,b,c]) => (
            <div key={a} style={{padding:'8px 0',borderBottom:'1px solid rgba(255,255,255,.05)'}}>
              <div style={{fontSize:12,color:'#eef2ff'}}>{a}</div>
              <div style={{display:'flex',justifyContent:'space-between',marginTop:2}}>
                <span style={{fontSize:11,color:'rgba(255,255,255,.35)'}}>{b}</span>
                <span style={{fontSize:10,color:'rgba(255,255,255,.25)'}}>{c}</span>
              </div>
            </div>
          ))}
        </div>
        <div className="dash-card" style={{padding:18}}>
          <div style={{fontWeight:700,fontSize:13,color:'#eef2ff',marginBottom:14}}>Needs Attention</div>
          {[['Vendor approval pending','BeadsByTemi','warning'],['Payment dispute','ORD-7843','danger'],['Low stock alert','Pro Earbuds','warning'],['Product reported','Customer complaint','danger']].map(([a,b,type]) => (
            <div key={a} style={{padding:'8px 0',borderBottom:'1px solid rgba(255,255,255,.05)',display:'flex',gap:10,alignItems:'flex-start'}}>
              <span style={{fontSize:14}}>{type==='danger'?'🔴':'🟡'}</span>
              <div><div style={{fontSize:12,color:'#eef2ff'}}>{a}</div><div style={{fontSize:11,color:'rgba(255,255,255,.35)',marginTop:1}}>{b}</div></div>
            </div>
          ))}
        </div>
        <div className="dash-card" style={{padding:18}}>
          <div style={{fontWeight:700,fontSize:13,color:'#eef2ff',marginBottom:14}}>Platform Health</div>
          {[['Uptime','99.9%','#10b981'],['API Response','142ms','#3b82f6'],['Active Sessions','284','#8b5cf6'],['Error Rate','0.02%','#10b981'],['Pending Payouts',fmtK(2400000),'#f59e0b']].map(([l,v,c]) => (
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
