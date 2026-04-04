import { useVendorOrders, useMyProducts, useVendorAnalytics } from '../../hooks/useData'
import { StatCard } from '../../components/shared/UI'
import { useNavigate } from 'react-router-dom'

const fmt  = (n) => '₦' + Number(n || 0).toLocaleString()
const fmtK = (n) => n >= 1000000 ? '₦' + (n / 1000000).toFixed(1) + 'M' : n >= 1000 ? '₦' + (n / 1000).toFixed(0) + 'k' : '₦' + (n || 0)

const MONTHS = ['Jan','Feb','Mar','Apr','May','Jun','Jul','Aug','Sep','Oct','Nov','Dec']

export default function VendorOverview() {
  const { data: ordersData,    isLoading: oLoad } = useVendorOrders()
  const { data: productsData,  isLoading: pLoad } = useMyProducts()
  const { data: analyticsData, isLoading: aLoad } = useVendorAnalytics()
  const navigate = useNavigate()

  const orders   = ordersData?.orders   || []
  const products = productsData?.products || []
  const analytics = analyticsData?.data  || {}

  const revenue  = analytics.revenue || 0
  const pending  = orders.filter(o => ['pending','awaiting_payment','payment_uploaded'].includes(o.status)).length
  const delivered= orders.filter(o => o.status === 'delivered').length

  // Build monthly chart from analytics data
  const monthly  = analytics.monthlyData || {}
  const months   = Object.entries(monthly).sort((a,b) => a[0].localeCompare(b[0])).slice(-6)
  const maxRev   = Math.max(...months.map(([,v]) => v.revenue || 0), 1)

  const statusColors = {
    delivered: '#10b981', shipped: '#3b82f6', processing: '#8b5cf6',
    payment_confirmed: '#10b981', payment_uploaded: '#f59e0b',
    awaiting_payment: '#f59e0b', pending: '#f59e0b', cancelled: '#f43f5e',
  }

  return (
    <div style={{ animation: 'fadeUp .35s ease' }}>

      {/* Header */}
      <div style={{ display:'flex', alignItems:'center', justifyContent:'space-between', marginBottom:22, flexWrap:'wrap', gap:12 }}>
        <div>
          <h1 style={{ fontFamily:"'DM Sans',sans-serif", fontWeight:700, fontSize:20, color:'var(--dash-text)' }}>Welcome back 👋</h1>
          <div style={{ fontSize:13, color:'var(--dash-muted)', marginTop:3 }}>Here's what's happening in your store today.</div>
        </div>
        <div style={{ display:'flex', gap:8 }}>
          <button onClick={() => navigate('products')} style={{ padding:'9px 16px', background:'rgba(255,255,255,.06)', border:'1px solid rgba(255,255,255,.1)', borderRadius:8, color:'var(--dash-muted)', fontSize:13, cursor:'pointer' }}>📊 Export</button>
          <button onClick={() => navigate('products')} style={{ padding:'9px 18px', background:'var(--blue)', border:'none', borderRadius:8, color:'#fff', fontSize:13, fontWeight:600, cursor:'pointer' }}>+ Add Product</button>
        </div>
      </div>

      {/* Stat cards */}
      <div style={{ display:'grid', gridTemplateColumns:'repeat(4,1fr)', gap:14, marginBottom:20 }} className="mobile-grid-2">
        <StatCard label="Total Revenue"  value={aLoad ? '...' : fmtK(revenue)}       icon="💰" sub="+23% this month"          color="var(--dash-green)"  delay={0}   />
        <StatCard label="Total Orders"   value={aLoad ? '...' : analytics.totalOrders || orders.length} icon="📦" sub={pending + ' pending'} color="var(--blue)"       delay={60}  />
        <StatCard label="Products"       value={pLoad ? '...' : products.length}      icon="🛍️" sub="Active listings"          color="var(--dash-violet)" delay={120} />
        <StatCard label="Delivered"      value={oLoad ? '...' : delivered}            icon="✅" sub="Completed orders"         color="var(--dash-amber)"  delay={180} />
      </div>

      <div style={{ display:'grid', gridTemplateColumns:'1.6fr 1fr', gap:14, marginBottom:14 }} className="mobile-stack">

        {/* Revenue chart */}
        <div className="dash-card" style={{ padding:20 }}>
          <div style={{ display:'flex', alignItems:'center', justifyContent:'space-between', marginBottom:18 }}>
            <div>
              <div style={{ fontWeight:700, fontSize:14, color:'var(--dash-text)' }}>Revenue Overview</div>
              <div style={{ fontSize:12, color:'var(--dash-muted)', marginTop:2 }}>Last 6 months</div>
            </div>
            <span style={{ fontSize:11, fontWeight:700, color:'var(--dash-green)', background:'rgba(16,185,129,.12)', padding:'3px 9px', borderRadius:6 }}>+23%</span>
          </div>
          {aLoad ? (
            <div style={{ height:120, background:'rgba(255,255,255,.04)', borderRadius:8, animation:'pulse 1.5s infinite' }} />
          ) : months.length > 0 ? (
            <div style={{ display:'flex', gap:8, alignItems:'flex-end', height:120, marginBottom:8 }}>
              {months.map(([key, val], i) => {
                const h = Math.round(((val.revenue || 0) / maxRev) * 100)
                const label = key.slice(5) // MM
                const monthName = MONTHS[parseInt(label, 10) - 1] || label
                return (
                  <div key={key} style={{ flex:1, display:'flex', flexDirection:'column', alignItems:'center', gap:5 }}>
                    <div style={{ fontSize:9, color:'var(--dash-muted)' }}>{fmtK(val.revenue || 0)}</div>
                    <div style={{ width:'100%', height: h + '%', background: i === months.length-1 ? 'var(--blue)' : 'rgba(59,130,246,.3)', borderRadius:'4px 4px 0 0', minHeight:4, transition:'height .5s' }} />
                    <div style={{ fontSize:10, color:'var(--dash-muted)' }}>{monthName}</div>
                  </div>
                )
              })}
            </div>
          ) : (
            <div style={{ height:120, display:'flex', alignItems:'center', justifyContent:'center', color:'var(--dash-muted)', fontSize:13 }}>No revenue data yet</div>
          )}
        </div>

        {/* Recent orders */}
        <div className="dash-card" style={{ padding:18 }}>
          <div style={{ display:'flex', alignItems:'center', justifyContent:'space-between', marginBottom:14 }}>
            <div style={{ fontWeight:700, fontSize:14, color:'var(--dash-text)' }}>Recent Orders</div>
            <button onClick={() => navigate('orders')} style={{ fontSize:11, color:'var(--blue)', border:'none', background:'transparent', cursor:'pointer' }}>View all</button>
          </div>
          {oLoad ? [1,2,3,4,5].map(i => (
            <div key={i} style={{ height:44, background:'rgba(255,255,255,.04)', borderRadius:6, marginBottom:8, animation:'pulse 1.5s infinite' }} />
          )) : orders.length === 0 ? (
            <div style={{ textAlign:'center', padding:'30px 0', color:'var(--dash-muted)', fontSize:13 }}>No orders yet</div>
          ) : orders.slice(0, 6).map(o => {
            const col = statusColors[o.status] || '#f59e0b'
            return (
              <div key={o._id} style={{ display:'flex', alignItems:'center', gap:10, padding:'8px 0', borderBottom:'1px solid rgba(255,255,255,.05)' }}>
                <div style={{ width:7, height:7, borderRadius:'50%', background:col, flexShrink:0 }} />
                <div style={{ flex:1, minWidth:0 }}>
                  <div style={{ fontSize:12, fontWeight:600, color:'var(--dash-text)', overflow:'hidden', textOverflow:'ellipsis', whiteSpace:'nowrap' }}>{o.customer?.name || 'Customer'}</div>
                  <div style={{ fontSize:11, color:'var(--dash-muted)' }}>{o.orderId} · {fmt(o.total)}</div>
                </div>
                <span style={{ fontSize:9, fontWeight:700, padding:'2px 7px', borderRadius:5, background: col + '18', color:col, whiteSpace:'nowrap', textTransform:'capitalize' }}>{o.status.replace(/_/g,' ')}</span>
              </div>
            )
          })}
        </div>
      </div>

      {/* Quick actions */}
      <div style={{ display:'grid', gridTemplateColumns:'repeat(4,1fr)', gap:12 }} className="mobile-grid-2">
        {[
          { icon:'📤', title:'Upload Product', sub:'Add a new listing', path:'products' },
          { icon:'🤖', title:'Generate Caption', sub:'AI marketing content', path:'ai' },
          { icon:'📢', title:'Broadcast', sub:'Message customers', path:'whatsapp' },
          { icon:'💸', title:'Request Payout', sub:'Withdraw earnings', path:'payouts' },
        ].map((a, i) => (
          <div key={a.title} onClick={() => navigate(a.path)} className="dash-card" style={{ padding:16, cursor:'pointer', transition:'all .2s', animation:'fadeUp .4s ease ' + (i*60) + 'ms both' }}
            onMouseEnter={e => { e.currentTarget.style.borderColor = 'rgba(59,130,246,.3)'; e.currentTarget.style.transform = 'translateY(-2px)' }}
            onMouseLeave={e => { e.currentTarget.style.borderColor = 'rgba(255,255,255,.07)'; e.currentTarget.style.transform = 'translateY(0)' }}
          >
            <div style={{ fontSize:24, marginBottom:10 }}>{a.icon}</div>
            <div style={{ fontSize:13, fontWeight:600, color:'var(--dash-text)', marginBottom:3 }}>{a.title}</div>
            <div style={{ fontSize:11, color:'var(--dash-muted)' }}>{a.sub}</div>
          </div>
        ))}
      </div>
    </div>
  )
}
