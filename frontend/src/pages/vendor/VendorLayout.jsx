import { useState } from 'react'
import { Outlet, NavLink, useNavigate } from 'react-router-dom'
import { useAuth } from '../../context/AuthContext'
import { useQuery } from '@tanstack/react-query'
import { notifAPI } from '../../api'

const NAV = [
  { to:'overview',   icon:'📊', label:'Overview'     },
  { to:'products',   icon:'📦', label:'Products'     },
  { to:'orders',     icon:'🛒', label:'Orders'       },
  { to:'customers',  icon:'👥', label:'Customers'    },
  { to:'discounts',  icon:'🏷️', label:'Discounts'   },
  { to:'whatsapp',   icon:'💬', label:'WhatsApp Bot' },
  { to:'ai',         icon:'🤖', label:'AI Tools'     },
  { to:'social',     icon:'📱', label:'Social Media' },
  { to:'payouts',    icon:'💸', label:'Payouts'      },
  { to:'analytics',  icon:'📈', label:'Analytics'    },
  { to:'settings',   icon:'⚙️', label:'Settings'    },
]

export default function VendorLayout() {
  const [collapsed, setCollapsed] = useState(false)
  const [notifOpen, setNotifOpen] = useState(false)
  const { user, logout } = useAuth()
  const navigate = useNavigate()

  const { data: notifData } = useQuery({ queryKey:['notifs'], queryFn: notifAPI.getAll, refetchInterval: 30000 })
  const unread = notifData?.data?.notifs?.filter(n => !n.isRead).length || 0

  return (
    <div style={{ display:'flex', height:'100vh', overflow:'hidden', background:'var(--dash-bg)', color:'var(--dash-text)', fontFamily:"'DM Sans',sans-serif", position:'relative' }}>

      {/* Sidebar */}
      <aside style={{ width: collapsed ? 64 : 220, minWidth: collapsed ? 64 : 220, height:'100vh', background:'var(--dash-surface)', borderRight:'1px solid var(--dash-border)', display:'flex', flexDirection:'column', transition:'width .25s, min-width .25s', overflow:'hidden', flexShrink:0 }}>

        {/* Logo */}
        <div style={{ padding: collapsed ? '16px 0' : '16px', display:'flex', alignItems:'center', justifyContent: collapsed ? 'center' : 'space-between', borderBottom:'1px solid var(--dash-border)', height:58, flexShrink:0 }}>
          {!collapsed && (
            <div style={{ display:'flex', alignItems:'center', gap:8 }}>
              <div style={{ width:30, height:30, borderRadius:8, background:'linear-gradient(135deg,#3b82f6,#6366f1)', display:'flex', alignItems:'center', justifyContent:'center', fontSize:15 }}>🛒</div>
              <div>
                <div style={{ fontWeight:800, fontSize:13, color:'var(--dash-text)' }}>ChatCart</div>
                <div style={{ fontSize:9, color:'rgba(255,255,255,.4)', fontWeight:600, letterSpacing:'.08em' }}>VENDOR</div>
              </div>
            </div>
          )}
          {collapsed && <div style={{ width:30, height:30, borderRadius:8, background:'linear-gradient(135deg,#3b82f6,#6366f1)', display:'flex', alignItems:'center', justifyContent:'center' }}>🛒</div>}
          {!collapsed && <button onClick={() => setCollapsed(true)} style={{ width:24, height:24, border:'1px solid rgba(255,255,255,.1)', borderRadius:6, background:'transparent', color:'rgba(255,255,255,.4)', cursor:'pointer', fontSize:12 }}>‹</button>}
        </div>

        {/* Nav */}
        <nav style={{ flex:1, padding:'10px 8px', overflowY:'auto' }}>
          {collapsed && <button onClick={() => setCollapsed(false)} style={{ width:'100%', display:'flex', justifyContent:'center', padding:'8px 0', border:'none', background:'transparent', color:'rgba(255,255,255,.4)', cursor:'pointer', fontSize:18, marginBottom:8 }}>›</button>}
          {NAV.map(item => (
            <NavLink key={item.to} to={item.to} title={collapsed ? item.label : ''} style={({ isActive }) => ({ display:'flex', alignItems:'center', gap:10, width:'100%', padding: collapsed ? '9px 0' : '8px 12px', justifyContent: collapsed ? 'center' : 'flex-start', borderRadius:8, marginBottom:2, transition:'var(--tr)', background: isActive ? 'rgba(59,130,246,.15)' : 'transparent', color: isActive ? '#3b82f6' : 'rgba(255,255,255,.5)', fontWeight: isActive ? 600 : 400, fontSize:13, textDecoration:'none', borderLeft: isActive && !collapsed ? '3px solid #3b82f6' : '3px solid transparent' })}>
              <span style={{ fontSize:16, flexShrink:0 }}>{item.icon}</span>
              {!collapsed && <span>{item.label}</span>}
            </NavLink>
          ))}
        </nav>

        {/* Footer */}
        {!collapsed && (
          <div style={{ padding:'12px', borderTop:'1px solid var(--dash-border)' }}>
            <div style={{ display:'flex', alignItems:'center', gap:9, padding:'9px 10px', borderRadius:9, background:'rgba(255,255,255,.04)', border:'1px solid rgba(255,255,255,.07)', marginBottom:6 }}>
              <div style={{ width:28, height:28, borderRadius:'50%', background:'linear-gradient(135deg,#3b82f6,#6366f1)', display:'flex', alignItems:'center', justifyContent:'center', fontSize:12, fontWeight:700, color:'#fff', flexShrink:0 }}>{(user?.name||'U')[0]}</div>
              <div style={{ flex:1, minWidth:0 }}>
                <div style={{ fontSize:12, fontWeight:600, color:'var(--dash-text)', overflow:'hidden', textOverflow:'ellipsis', whiteSpace:'nowrap' }}>{user?.name}</div>
                <div style={{ fontSize:10, color:'rgba(255,255,255,.4)' }}>{user?.plan || 'Free'} Plan</div>
              </div>
            </div>
            <button onClick={() => navigate('/')} style={{ width:'100%', display:'flex', alignItems:'center', gap:7, padding:'7px 10px', border:'none', background:'transparent', color:'#10b981', cursor:'pointer', fontSize:12, borderRadius:7, marginBottom:4 }}>
              🌐 View Marketplace
            </button>
            <button onClick={logout} style={{ width:'100%', display:'flex', alignItems:'center', gap:7, padding:'7px 10px', border:'none', background:'transparent', color:'rgba(244,63,94,.7)', cursor:'pointer', fontSize:12, borderRadius:7 }}>
              🚪 Sign Out
            </button>
          </div>
        )}
      </aside>

      {/* Main content */}
      <div style={{ flex:1, display:'flex', flexDirection:'column', overflow:'hidden', minWidth:0 }}>

        {/* Topbar */}
        <div style={{ height:58, background:'var(--dash-surface)', borderBottom:'1px solid var(--dash-border)', display:'flex', alignItems:'center', padding:'0 22px', gap:14, flexShrink:0 }}>
          <div style={{ flex:1, fontSize:15, fontWeight:700, color:'var(--dash-text)' }}>Vendor Dashboard</div>
          <div style={{ position:'relative' }}>
            <span style={{ position:'absolute', left:9, top:'50%', transform:'translateY(-50%)', fontSize:13, color:'rgba(255,255,255,.3)' }}>🔍</span>
            <input placeholder="Search..." style={{ padding:'8px 12px 8px 30px', width:180, background:'rgba(255,255,255,.05)', border:'1px solid rgba(255,255,255,.1)', borderRadius:8, color:'var(--dash-text)', fontSize:12, fontFamily:"'DM Sans',sans-serif", outline:'none' }} />
          </div>
          <button onClick={() => setNotifOpen(o => !o)} style={{ position:'relative', width:36, height:36, borderRadius:9, border:'1px solid rgba(255,255,255,.1)', background: notifOpen ? 'rgba(59,130,246,.15)' : 'rgba(255,255,255,.05)', cursor:'pointer', fontSize:18 }}>
            🔔
            {unread > 0 && <span style={{ position:'absolute', top:-3, right:-3, width:16, height:16, background:'#f43f5e', borderRadius:'50%', fontSize:9, fontWeight:700, color:'#fff', display:'flex', alignItems:'center', justifyContent:'center' }}>{unread}</span>}
          </button>
          <div style={{ width:32, height:32, borderRadius:'50%', background:'linear-gradient(135deg,#3b82f6,#6366f1)', display:'flex', alignItems:'center', justifyContent:'center', fontSize:14, fontWeight:700, color:'#fff', cursor:'pointer' }}>{(user?.name||'U')[0]}</div>
        </div>

        {/* Page content */}
        <main style={{ flex:1, overflowY:'auto', padding:22, background:'var(--dash-bg)' }}>
          <Outlet />
        </main>
      </div>

      {/* Notifications panel */}
      {notifOpen && (
        <div onClick={() => setNotifOpen(false)} style={{ position:'absolute', inset:0, zIndex:400 }}>
          <div onClick={e => e.stopPropagation()} style={{ position:'absolute', top:0, right:0, width:360, height:'100%', background:'var(--dash-surface)', borderLeft:'1px solid var(--dash-border)', display:'flex', flexDirection:'column', animation:'slideR .25s ease' }}>
            <div style={{ padding:'16px 18px', borderBottom:'1px solid var(--dash-border)', display:'flex', alignItems:'center', justifyContent:'space-between' }}>
              <span style={{ fontWeight:700, fontSize:14, color:'var(--dash-text)' }}>Notifications</span>
              <button onClick={() => setNotifOpen(false)} style={{ border:'none', background:'transparent', color:'rgba(255,255,255,.4)', cursor:'pointer', fontSize:18 }}>✕</button>
            </div>
            <div style={{ flex:1, overflowY:'auto' }}>
              {(notifData?.data?.notifs || []).map(n => (
                <div key={n._id} style={{ display:'flex', gap:11, padding:'13px 16px', borderBottom:'1px solid rgba(255,255,255,.05)', background: n.isRead ? 'transparent' : 'rgba(59,130,246,.04)' }}>
                  <div style={{ width:36, height:36, borderRadius:'50%', background:'rgba(59,130,246,.12)', display:'flex', alignItems:'center', justifyContent:'center', fontSize:16, flexShrink:0 }}>
                    {n.type==='order' ? '🛒' : n.type==='payment' ? '💰' : n.type==='vendor' ? '🏪' : '🔔'}
                  </div>
                  <div style={{ flex:1, minWidth:0 }}>
                    <div style={{ fontSize:12, fontWeight: n.isRead ? 500 : 700, color:'var(--dash-text)', lineHeight:1.4 }}>{n.title}</div>
                    <div style={{ fontSize:11, color:'rgba(255,255,255,.4)', marginTop:2 }}>{n.body}</div>
                    <div style={{ fontSize:10, color:'rgba(255,255,255,.25)', marginTop:4 }}>{new Date(n.createdAt).toLocaleString()}</div>
                  </div>
                  {!n.isRead && <div style={{ width:7, height:7, borderRadius:'50%', background:'#3b82f6', flexShrink:0, marginTop:4 }} />}
                </div>
              ))}
              {(!notifData?.data?.notifs?.length) && <div style={{ textAlign:'center', padding:'40px 20px', color:'rgba(255,255,255,.3)', fontSize:13 }}>No notifications</div>}
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
