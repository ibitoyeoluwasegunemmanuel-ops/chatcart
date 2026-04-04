import { useState } from 'react'
import { Outlet, NavLink, useNavigate } from 'react-router-dom'
import { useAuth } from '../../context/AuthContext'

const NAV = [
  { to:'overview',   icon:'📊', label:'Overview'          },
  { to:'vendors',    icon:'🏪', label:'Vendors',  badge:1  },
  { to:'users',      icon:'👥', label:'Users'              },
  { to:'products',   icon:'📦', label:'Products', badge:2  },
  { to:'payments',   icon:'💳', label:'Payments'           },
  { to:'analytics',  icon:'📈', label:'Analytics'          },
  { to:'settings',   icon:'⚙️', label:'Settings'          },
]

export default function AdminLayout() {
  const [collapsed, setCollapsed] = useState(false)
  const { user, logout } = useAuth()
  const navigate = useNavigate()

  return (
    <div style={{ display:'flex', height:'100vh', overflow:'hidden', background:'#080d18', color:'#eef2ff', fontFamily:"'DM Sans',sans-serif" }}>
      <aside style={{ width:collapsed?64:220, minWidth:collapsed?64:220, height:'100vh', background:'#0d1320', borderRight:'1px solid rgba(255,255,255,.07)', display:'flex', flexDirection:'column', transition:'width .25s, min-width .25s', overflow:'hidden', flexShrink:0 }}>
        <div style={{ padding:collapsed?'16px 0':'16px', display:'flex', alignItems:'center', justifyContent:collapsed?'center':'space-between', borderBottom:'1px solid rgba(255,255,255,.07)', height:58, flexShrink:0 }}>
          {!collapsed && (
            <div style={{ display:'flex', alignItems:'center', gap:8 }}>
              <div style={{ width:30, height:30, borderRadius:8, background:'linear-gradient(135deg,#f59e0b,#d97706)', display:'flex', alignItems:'center', justifyContent:'center', fontSize:15 }}>⚙️</div>
              <div><div style={{ fontWeight:800, fontSize:13, color:'#eef2ff' }}>ChatCart</div><div style={{ fontSize:9, color:'rgba(255,255,255,.4)', fontWeight:600, letterSpacing:'.08em' }}>ADMIN PANEL</div></div>
            </div>
          )}
          {collapsed && <div style={{ width:30, height:30, borderRadius:8, background:'linear-gradient(135deg,#f59e0b,#d97706)', display:'flex', alignItems:'center', justifyContent:'center' }}>⚙️</div>}
          {!collapsed && <button onClick={() => setCollapsed(true)} style={{ width:24, height:24, border:'1px solid rgba(255,255,255,.1)', borderRadius:6, background:'transparent', color:'rgba(255,255,255,.4)', cursor:'pointer', fontSize:12 }}>close</button>}
        </div>
        <nav style={{ flex:1, padding:'10px 8px', overflowY:'auto' }}>
          {collapsed && <button onClick={() => setCollapsed(false)} style={{ width:'100%', display:'flex', justifyContent:'center', padding:'8px 0', border:'none', background:'transparent', color:'rgba(255,255,255,.4)', cursor:'pointer', fontSize:18, marginBottom:8 }}>open</button>}
          {NAV.map(item => (
            <NavLink key={item.to} to={item.to} style={({ isActive }) => ({ display:'flex', alignItems:'center', gap:10, width:'100%', padding:collapsed?'9px 0':'8px 12px', justifyContent:collapsed?'center':'flex-start', borderRadius:8, marginBottom:2, background:isActive?'rgba(245,158,11,.15)':'transparent', color:isActive?'#f59e0b':'rgba(255,255,255,.5)', fontWeight:isActive?600:400, fontSize:13, textDecoration:'none', borderLeft:isActive&&!collapsed?'3px solid #f59e0b':'3px solid transparent', transition:'all .18s' })}>
              <span style={{ fontSize:16, flexShrink:0 }}>{item.icon}</span>
              {!collapsed && <><span style={{ flex:1 }}>{item.label}</span>{item.badge&&item.badge>0&&<span style={{ background:'#f43f5e', color:'#fff', fontSize:10, fontWeight:700, padding:'1px 6px', borderRadius:99 }}>{item.badge}</span>}</>}
            </NavLink>
          ))}
        </nav>
        {!collapsed && (
          <div style={{ padding:12, borderTop:'1px solid rgba(255,255,255,.07)' }}>
            <div style={{ display:'flex', alignItems:'center', gap:9, padding:'9px 10px', borderRadius:9, background:'rgba(255,255,255,.04)', border:'1px solid rgba(255,255,255,.07)', marginBottom:6 }}>
              <div style={{ width:28, height:28, borderRadius:'50%', background:'linear-gradient(135deg,#f59e0b,#d97706)', display:'flex', alignItems:'center', justifyContent:'center', fontSize:12, fontWeight:700, color:'#fff', flexShrink:0 }}>{(user?.name||'A')[0]}</div>
              <div style={{ flex:1, minWidth:0 }}>
                <div style={{ fontSize:12, fontWeight:600, color:'#eef2ff', overflow:'hidden', textOverflow:'ellipsis', whiteSpace:'nowrap' }}>{user?.name||'Admin'}</div>
                <div style={{ fontSize:10, color:'rgba(255,255,255,.4)' }}>Super Admin</div>
              </div>
            </div>
            <button onClick={() => navigate('/')} style={{ width:'100%', display:'flex', alignItems:'center', gap:7, padding:'7px 10px', border:'none', background:'transparent', color:'#10b981', cursor:'pointer', fontSize:12, borderRadius:7, marginBottom:3 }}>View Marketplace</button>
            <button onClick={logout} style={{ width:'100%', display:'flex', alignItems:'center', gap:7, padding:'7px 10px', border:'none', background:'transparent', color:'rgba(244,63,94,.7)', cursor:'pointer', fontSize:12, borderRadius:7 }}>Sign Out</button>
          </div>
        )}
      </aside>
      <div style={{ flex:1, display:'flex', flexDirection:'column', overflow:'hidden', minWidth:0 }}>
        <div style={{ height:58, background:'#0d1320', borderBottom:'1px solid rgba(255,255,255,.07)', display:'flex', alignItems:'center', padding:'0 22px', gap:14, flexShrink:0 }}>
          <div style={{ flex:1, fontSize:15, fontWeight:700, color:'#eef2ff' }}>Admin Dashboard</div>
          <button onClick={() => navigate('/')} style={{ display:'flex', alignItems:'center', gap:6, padding:'7px 14px', background:'rgba(255,255,255,.05)', border:'1px solid rgba(255,255,255,.1)', borderRadius:8, color:'rgba(255,255,255,.6)', fontSize:12, cursor:'pointer' }}>Marketplace</button>
          <div style={{ width:32, height:32, borderRadius:'50%', background:'linear-gradient(135deg,#f59e0b,#d97706)', display:'flex', alignItems:'center', justifyContent:'center', fontSize:14, fontWeight:700, color:'#fff' }}>{(user?.name||'A')[0]}</div>
        </div>
        <main style={{ flex:1, overflowY:'auto', padding:22, background:'#080d18' }}><Outlet/></main>
      </div>
    </div>
  )
}
