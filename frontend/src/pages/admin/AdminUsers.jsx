import { useState } from 'react'
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { adminAPI } from '../../api'
import toast from 'react-hot-toast'

export default function AdminUsers() {
  const [filter, setFilter] = useState('all')
  const qc = useQueryClient()

  const { data, isLoading } = useQuery({ queryKey:['admin-users',filter], queryFn:() => adminAPI.getUsers(filter!=='all'?{role:filter}:{}) })
  const users = data?.data?.users || []

  const suspend = useMutation({ mutationFn: id => adminAPI.suspendUser(id), onSuccess:()=>{ toast.success('User suspended'); qc.invalidateQueries(['admin-users']) } })

  const ROLE_COL = { customer:'#3b82f6', vendor:'#10b981', admin:'#f43f5e', staff:'#f59e0b' }

  return (
    <div>
      <div style={{display:'flex',alignItems:'center',justifyContent:'space-between',marginBottom:20}}>
        <div><h2 style={{fontWeight:700,fontSize:18,color:'#eef2ff',margin:0}}>User Management</h2><div style={{fontSize:12,color:'rgba(255,255,255,.4)',marginTop:2}}>{users.length} users</div></div>
        <button onClick={()=>toast.success('Staff invite link sent!')} style={{padding:'9px 18px',background:'#3b82f6',color:'#fff',border:'none',borderRadius:8,fontSize:13,fontWeight:700,cursor:'pointer'}}>+ Add Staff</button>
      </div>

      <div style={{display:'flex',gap:6,marginBottom:16}}>
        {['all','customer','vendor','staff','admin'].map(r => (
          <button key={r} onClick={()=>setFilter(r)} style={{padding:'5px 13px',borderRadius:99,border:'1px solid '+(filter===r?'#3b82f6':'rgba(255,255,255,.15)'),background:filter===r?'#3b82f6':'transparent',color:filter===r?'#fff':'rgba(255,255,255,.5)',fontSize:11,fontWeight:filter===r?700:400,cursor:'pointer',fontFamily:'DM Sans,sans-serif',textTransform:'capitalize'}}>{r}</button>
        ))}
      </div>

      <div className="dash-card" style={{overflow:'hidden'}}>
        {isLoading ? <div style={{textAlign:'center',padding:'40px',color:'rgba(255,255,255,.4)',fontSize:13}}>Loading...</div> : (
          <div style={{overflowX:'auto'}}>
            <table style={{width:'100%',borderCollapse:'collapse'}}>
              <thead><tr>
                {['User','Role','Phone','Joined','Status','Actions'].map(h => <th key={h} style={{padding:'10px 14px',textAlign:'left',fontSize:11,fontWeight:600,color:'rgba(255,255,255,.35)',borderBottom:'1px solid rgba(255,255,255,.07)',letterSpacing:'.05em',textTransform:'uppercase'}}>{h}</th>)}
              </tr></thead>
              <tbody>
                {users.map(u => (
                  <tr key={u._id} style={{borderBottom:'1px solid rgba(255,255,255,.04)'}}>
                    <td style={{padding:'12px 14px'}}>
                      <div style={{display:'flex',alignItems:'center',gap:10}}>
                        <div style={{width:30,height:30,borderRadius:'50%',background:'rgba(59,130,246,.2)',display:'flex',alignItems:'center',justifyContent:'center',fontSize:12,fontWeight:700,color:'#3b82f6',flexShrink:0}}>{(u.name||'U')[0]}</div>
                        <div><div style={{fontSize:13,fontWeight:600,color:'#eef2ff'}}>{u.name}</div><div style={{fontSize:11,color:'rgba(255,255,255,.35)'}}>{u.email}</div></div>
                      </div>
                    </td>
                    <td style={{padding:'12px 14px'}}><span style={{fontSize:10,fontWeight:700,padding:'3px 8px',borderRadius:6,background:(ROLE_COL[u.role]||'#3b82f6')+'18',color:ROLE_COL[u.role]||'#3b82f6',textTransform:'capitalize'}}>{u.role}</span></td>
                    <td style={{padding:'12px 14px',fontSize:12,color:'rgba(255,255,255,.4)'}}>{u.phone||'—'}</td>
                    <td style={{padding:'12px 14px',fontSize:12,color:'rgba(255,255,255,.4)'}}>{new Date(u.createdAt).toLocaleDateString('en-NG',{day:'numeric',month:'short',year:'numeric'})}</td>
                    <td style={{padding:'12px 14px'}}><span style={{fontSize:10,fontWeight:700,padding:'3px 8px',borderRadius:6,background:u.isSuspended?'rgba(244,63,94,.15)':'rgba(16,185,129,.15)',color:u.isSuspended?'#f43f5e':'#10b981'}}>• {u.isSuspended?'Suspended':'Active'}</span></td>
                    <td style={{padding:'12px 14px'}}>
                      <div style={{display:'flex',gap:5}}>
                        {!u.isSuspended && u.role!=='admin' && <button onClick={()=>suspend.mutate(u._id)} style={{padding:'4px 9px',background:'rgba(244,63,94,.12)',color:'#f43f5e',border:'1px solid rgba(244,63,94,.25)',borderRadius:6,fontSize:10,fontWeight:700,cursor:'pointer'}}>Suspend</button>}
                        <button style={{padding:'4px 9px',background:'rgba(255,255,255,.05)',border:'1px solid rgba(255,255,255,.1)',borderRadius:6,color:'rgba(255,255,255,.5)',fontSize:10,cursor:'pointer'}}>View</button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  )
}
