import { useState } from 'react'
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { adminAPI } from '../../api'
import toast from 'react-hot-toast'

export default function AdminProducts() {
  const [filter, setFilter] = useState('pending')
  const qc = useQueryClient()

  const { data, isLoading } = useQuery({ queryKey:['admin-products',filter], queryFn:() => adminAPI.getProducts(filter==='pending'?{approved:'false'}:filter==='flagged'?{flagged:'true'}:{}) })
  const products = data?.data?.products || []

  const approve = useMutation({ mutationFn: id => adminAPI.approveProduct(id), onSuccess:()=>{ toast.success('Product approved!'); qc.invalidateQueries(['admin-products']) } })
  const remove  = useMutation({ mutationFn: id => adminAPI.removeProduct(id),  onSuccess:()=>{ toast.success('Product removed'); qc.invalidateQueries(['admin-products']) } })

  const fmt = n => "NGN " + Number(n).toLocaleString()

  const COUNTS = {
    all: data?.data?.total || 0,
    pending: 0,
    flagged: 0,
  }

  return (
    <div>
      <div style={{display:'flex',alignItems:'center',justifyContent:'space-between',marginBottom:20}}>
        <div><h2 style={{fontWeight:700,fontSize:18,color:'#eef2ff',margin:0}}>Product Moderation</h2><div style={{fontSize:12,color:'rgba(255,255,255,.4)',marginTop:2}}>{products.length} products</div></div>
      </div>

      <div style={{display:'flex',gap:6,marginBottom:16}}>
        {[['pending','Pending Review'],['flagged','Flagged'],['all','All Products']].map(([k,l]) => (
          <button key={k} onClick={()=>setFilter(k)} style={{padding:'5px 13px',borderRadius:99,border:'1px solid '+(filter===k?'#3b82f6':'rgba(255,255,255,.15)'),background:filter===k?'#3b82f6':'transparent',color:filter===k?'#fff':'rgba(255,255,255,.5)',fontSize:11,fontWeight:filter===k?700:400,cursor:'pointer',fontFamily:'DM Sans,sans-serif'}}>{l}</button>
        ))}
      </div>

      <div className="dash-card" style={{overflow:'hidden'}}>
        {isLoading ? <div style={{textAlign:'center',padding:'40px',color:'rgba(255,255,255,.4)',fontSize:13}}>Loading...</div> : products.length===0 ? (
          <div style={{textAlign:'center',padding:'40px'}}><div style={{fontSize:36,marginBottom:12}}>✅</div><div style={{color:'rgba(255,255,255,.4)',fontSize:13}}>No products in this category</div></div>
        ) : (
          <div style={{overflowX:'auto'}}>
            <table style={{width:'100%',borderCollapse:'collapse'}}>
              <thead><tr>
                {['Product','Vendor','Category','Price','Stock','Status','Actions'].map(h => <th key={h} style={{padding:'10px 14px',textAlign:'left',fontSize:11,fontWeight:600,color:'rgba(255,255,255,.35)',borderBottom:'1px solid rgba(255,255,255,.07)',letterSpacing:'.05em',textTransform:'uppercase',whiteSpace:'nowrap'}}>{h}</th>)}
              </tr></thead>
              <tbody>
                {products.map(p => (
                  <tr key={p._id} style={{borderBottom:'1px solid rgba(255,255,255,.04)'}}>
                    <td style={{padding:'12px 14px'}}>
                      <div style={{display:'flex',alignItems:'center',gap:9}}>
                        <div style={{width:36,height:36,background:'rgba(255,255,255,.06)',borderRadius:8,display:'flex',alignItems:'center',justifyContent:'center',flexShrink:0,overflow:'hidden'}}>
                          {p.images?.[0]?<img src={p.images[0]} alt="" style={{width:'100%',height:'100%',objectFit:'cover'}}/>:<span style={{fontSize:18}}>📦</span>}
                        </div>
                        <div style={{fontSize:13,fontWeight:600,color:'#eef2ff',maxWidth:160,overflow:'hidden',textOverflow:'ellipsis',whiteSpace:'nowrap'}}>{p.name}</div>
                      </div>
                    </td>
                    <td style={{padding:'12px 14px',fontSize:12,color:'rgba(255,255,255,.55)'}}>{p.vendor?.storeName||'—'}</td>
                    <td style={{padding:'12px 14px'}}><span style={{fontSize:10,fontWeight:700,padding:'3px 8px',borderRadius:6,background:'rgba(59,130,246,.15)',color:'#3b82f6'}}>{p.category}</span></td>
                    <td style={{padding:'12px 14px',fontFamily:'monospace',fontSize:12,fontWeight:700,color:'#eef2ff'}}>{fmt(p.price)}</td>
                    <td style={{padding:'12px 14px',fontSize:12,color:p.stock<=5?'#f43f5e':'rgba(255,255,255,.5)'}}>{p.stock}</td>
                    <td style={{padding:'12px 14px'}}>
                      {p.isFlagged?<span style={{fontSize:10,fontWeight:700,padding:'3px 8px',borderRadius:6,background:'rgba(244,63,94,.15)',color:'#f43f5e'}}>Flagged</span>
                      :p.isApproved?<span style={{fontSize:10,fontWeight:700,padding:'3px 8px',borderRadius:6,background:'rgba(16,185,129,.15)',color:'#10b981'}}>Live</span>
                      :<span style={{fontSize:10,fontWeight:700,padding:'3px 8px',borderRadius:6,background:'rgba(245,158,11,.15)',color:'#f59e0b'}}>Pending</span>}
                    </td>
                    <td style={{padding:'12px 14px'}}>
                      <div style={{display:'flex',gap:5}}>
                        {!p.isApproved && <button onClick={()=>approve.mutate(p._id)} style={{padding:'4px 9px',background:'rgba(16,185,129,.12)',color:'#10b981',border:'1px solid rgba(16,185,129,.25)',borderRadius:6,fontSize:10,fontWeight:700,cursor:'pointer',whiteSpace:'nowrap'}}>Approve</button>}
                        <button onClick={()=>remove.mutate(p._id)} style={{padding:'4px 9px',background:'rgba(244,63,94,.12)',color:'#f43f5e',border:'1px solid rgba(244,63,94,.25)',borderRadius:6,fontSize:10,fontWeight:700,cursor:'pointer'}}>Remove</button>
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
