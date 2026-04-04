import { useState } from 'react'
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { adminAPI } from '../../api'
import toast from 'react-hot-toast'

const fmt = n => "NGN " + Number(n).toLocaleString()

export default function AdminVendors() {
  const [filter, setFilter] = useState('all')
  const qc = useQueryClient()

  const { data, isLoading } = useQuery({ queryKey:['admin-vendors',filter], queryFn:() => adminAPI.getVendors(filter!=='all'?{status:filter}:{}) })
  const vendors = data?.data?.vendors || []

  const approve  = useMutation({ mutationFn: id => adminAPI.approveVendor(id),  onSuccess:() => { toast.success('Vendor approved!'); qc.invalidateQueries(['admin-vendors']) } })
  const suspend  = useMutation({ mutationFn: id => adminAPI.suspendVendor(id),  onSuccess:() => { toast.success('Vendor suspended'); qc.invalidateQueries(['admin-vendors']) } })

  const STATUS_COL = { active:'#10b981', pending:'#f59e0b', suspended:'#f43f5e' }
  const fmtK = n => n>=1000000?"NGN "+(n/1000000).toFixed(1)+"M":n>=1000?"NGN "+(n/1000).toFixed(0)+"k":"NGN "+n

  return (
    <div>
      <div style={{display:'flex',alignItems:'center',justifyContent:'space-between',marginBottom:20}}>
        <div><h2 style={{fontWeight:700,fontSize:18,color:'#eef2ff',margin:0}}>Vendor Management</h2><div style={{fontSize:12,color:'rgba(255,255,255,.4)',marginTop:2}}>{vendors.length} registered vendors</div></div>
        <button onClick={()=>toast.success('Invite sent!')} style={{padding:'9px 18px',background:'#3b82f6',color:'#fff',border:'none',borderRadius:8,fontSize:13,fontWeight:700,cursor:'pointer'}}>+ Invite Vendor</button>
      </div>

      <div style={{display:'flex',gap:6,marginBottom:16}}>
        {['all','active','pending','suspended'].map(s => (
          <button key={s} onClick={()=>setFilter(s)} style={{padding:'5px 13px',borderRadius:99,border:'1px solid '+(filter===s?'#3b82f6':'rgba(255,255,255,.15)'),background:filter===s?'#3b82f6':'transparent',color:filter===s?'#fff':'rgba(255,255,255,.5)',fontSize:11,fontWeight:filter===s?700:400,cursor:'pointer',fontFamily:'DM Sans,sans-serif',textTransform:'capitalize'}}>{s}</button>
        ))}
      </div>

      <div className="dash-card" style={{overflow:'hidden'}}>
        {isLoading ? (
          <div style={{textAlign:'center',padding:'40px',color:'rgba(255,255,255,.4)',fontSize:13}}>Loading vendors...</div>
        ) : vendors.length === 0 ? (
          <div style={{textAlign:'center',padding:'40px'}}><div style={{fontSize:36,marginBottom:12}}>🏪</div><div style={{color:'rgba(255,255,255,.4)',fontSize:13}}>No vendors found</div></div>
        ) : (
          <div style={{overflowX:'auto'}}>
            <table style={{width:'100%',borderCollapse:'collapse'}}>
              <thead><tr>
                {['Vendor','Plan','Products','Sales','Revenue','Status','Actions'].map(h => <th key={h} style={{padding:'10px 14px',textAlign:'left',fontSize:11,fontWeight:600,color:'rgba(255,255,255,.35)',borderBottom:'1px solid rgba(255,255,255,.07)',letterSpacing:'.05em',textTransform:'uppercase',whiteSpace:'nowrap'}}>{h}</th>)}
              </tr></thead>
              <tbody>
                {vendors.map(v => {
                  const col = STATUS_COL[v.status] || '#f59e0b'
                  return (
                    <tr key={v._id} style={{borderBottom:'1px solid rgba(255,255,255,.04)'}}>
                      <td style={{padding:'12px 14px'}}>
                        <div style={{fontSize:13,fontWeight:600,color:'#eef2ff'}}>{v.storeName}</div>
                        <div style={{fontSize:11,color:'rgba(255,255,255,.35)'}}>{v.user?.email}</div>
                      </td>
                      <td style={{padding:'12px 14px'}}><span style={{fontSize:10,fontWeight:700,padding:'3px 8px',borderRadius:6,background:'rgba(139,92,246,.15)',color:'#8b5cf6'}}>{v.user?.plan||'free'}</span></td>
                      <td style={{padding:'12px 14px',fontFamily:'monospace',fontWeight:700,color:'#eef2ff'}}>{v.products||0}</td>
                      <td style={{padding:'12px 14px',fontFamily:'monospace',fontWeight:700,color:'#eef2ff'}}>{(v.totalSales||0).toLocaleString()}</td>
                      <td style={{padding:'12px 14px',fontFamily:'monospace',fontWeight:700,color:'#10b981'}}>{fmtK(v.totalRevenue||0)}</td>
                      <td style={{padding:'12px 14px'}}><span style={{fontSize:10,fontWeight:700,padding:'3px 8px',borderRadius:6,background:col+'18',color:col}}>• {v.status}</span></td>
                      <td style={{padding:'12px 14px'}}>
                        <div style={{display:'flex',gap:5}}>
                          {v.status==='pending'    && <button onClick={()=>approve.mutate(v._id)} style={{padding:'4px 9px',background:'rgba(16,185,129,.12)',color:'#10b981',border:'1px solid rgba(16,185,129,.25)',borderRadius:6,fontSize:10,fontWeight:700,cursor:'pointer',whiteSpace:'nowrap'}}>Approve</button>}
                          {v.status==='active'     && <button onClick={()=>suspend.mutate(v._id)} style={{padding:'4px 9px',background:'rgba(244,63,94,.12)',color:'#f43f5e',border:'1px solid rgba(244,63,94,.25)',borderRadius:6,fontSize:10,fontWeight:700,cursor:'pointer'}}>Suspend</button>}
                          {v.status==='suspended'  && <button onClick={()=>approve.mutate(v._id)} style={{padding:'4px 9px',background:'rgba(245,158,11,.12)',color:'#f59e0b',border:'1px solid rgba(245,158,11,.25)',borderRadius:6,fontSize:10,fontWeight:700,cursor:'pointer'}}>Reinstate</button>}
                          <button style={{padding:'4px 9px',background:'rgba(255,255,255,.05)',border:'1px solid rgba(255,255,255,.1)',borderRadius:6,color:'rgba(255,255,255,.5)',fontSize:10,cursor:'pointer'}}>View</button>
                        </div>
                      </td>
                    </tr>
                  )
                })}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  )
}
