import { useQuery } from '@tanstack/react-query'
import { vendorsAPI } from '../../api'

const fmt  = n => "NGN " + Number(n).toLocaleString()
const fmtK = n => n>=1000000?"NGN "+(n/1000000).toFixed(1)+"M":n>=1000?"NGN "+(n/1000).toFixed(0)+"k":"NGN "+n

export default function VendorAnalytics() {
  const { data } = useQuery({ queryKey:['vendor-analytics'], queryFn: vendorsAPI.analytics })
  const analytics = data?.data || {}
  const vendor    = analytics.vendor || {}
  const monthly   = analytics.monthlyData || {}

  const months    = Object.entries(monthly).sort(([a],[b])=>a.localeCompare(b)).slice(-6)
  const maxRev    = Math.max(...months.map(([,d])=>d.revenue), 1)

  const METRICS = [
    ['Total Revenue',   fmtK(vendor.totalRevenue||0),   '💰', '#10b981'],
    ['Total Orders',    analytics.totalOrders||0,       '📦', '#3b82f6'],
    ['Store Rating',    (vendor.rating||0).toFixed(1)+' ★', '⭐', '#f59e0b'],
    ['Total Customers', analytics.uniqueCustomers||0,    '👥', '#8b5cf6'],
  ]

  return (
    <div>
      <div style={{marginBottom:20}}>
        <h2 style={{fontWeight:700,fontSize:18,color:'#eef2ff',margin:0}}>Analytics</h2>
        <div style={{fontSize:12,color:'rgba(255,255,255,.4)',marginTop:2}}>Your store performance overview</div>
      </div>

      <div style={{display:'grid',gridTemplateColumns:'repeat(4,1fr)',gap:14,marginBottom:16}}>
        {METRICS.map(([l,v,ic,col],i) => (
          <div key={l} className="dash-card" style={{padding:18,animation:'fadeUp .4s ease '+(i*60)+'ms both'}}>
            <div style={{display:'flex',justifyContent:'space-between',marginBottom:10}}>
              <div style={{fontSize:11,color:'rgba(255,255,255,.4)',fontWeight:600,textTransform:'uppercase',letterSpacing:'.06em'}}>{l}</div>
              <div style={{width:34,height:34,borderRadius:9,background:col+'18',display:'flex',alignItems:'center',justifyContent:'center',fontSize:16}}>{ic}</div>
            </div>
            <div style={{fontSize:24,fontWeight:800,color:'#eef2ff'}}>{v}</div>
          </div>
        ))}
      </div>

      <div style={{display:'grid',gridTemplateColumns:'2fr 1fr',gap:14,marginBottom:14}}>
        <div className="dash-card" style={{padding:22}}>
          <div style={{fontWeight:700,fontSize:14,color:'#eef2ff',marginBottom:18}}>Monthly Revenue</div>
          {months.length === 0 ? (
            <div style={{textAlign:'center',padding:'40px',color:'rgba(255,255,255,.3)',fontSize:13}}>No data yet. Start making sales to see your analytics!</div>
          ) : (
            <div style={{display:'flex',gap:8,alignItems:'flex-end',height:140,marginBottom:10}}>
              {months.map(([month,d],i) => {
                const h = Math.round((d.revenue/maxRev)*100)
                const label = month.slice(5)
                return (
                  <div key={month} style={{flex:1,display:'flex',flexDirection:'column',alignItems:'center',gap:5}}>
                    <div style={{fontSize:9,color:'rgba(255,255,255,.3)'}}>{fmtK(d.revenue)}</div>
                    <div style={{width:'100%',height:h+'%',background:i===months.length-1?'#10b981':'rgba(16,185,129,.3)',borderRadius:'4px 4px 0 0',minHeight:4,transition:'height .5s'}}/>
                    <div style={{fontSize:10,color:'rgba(255,255,255,.35)'}}>{label}</div>
                  </div>
                )
              })}
            </div>
          )}
        </div>
        <div className="dash-card" style={{padding:20}}>
          <div style={{fontWeight:700,fontSize:14,color:'#eef2ff',marginBottom:14}}>Key Metrics</div>
          {[
            ['Conversion Rate','4.2%','#10b981'],
            ['Avg Order Value',fmtK(21800),'#eef2ff'],
            ['Return Rate','1.8%','#10b981'],
            ['Total Reviews',(vendor.reviewCount||0).toString(),'#f59e0b'],
            ['WhatsApp Orders','8','#25d366'],
            ['Social Reach','5.2k','#8b5cf6'],
          ].map(([l,v,c]) => (
            <div key={l} style={{display:'flex',justifyContent:'space-between',padding:'8px 0',borderBottom:'1px solid rgba(255,255,255,.05)'}}>
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
