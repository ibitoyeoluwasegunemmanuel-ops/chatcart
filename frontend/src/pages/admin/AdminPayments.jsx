import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { adminAPI } from '../../api'
import toast from 'react-hot-toast'

const fmt  = n => "NGN " + Number(n).toLocaleString()
const fmtK = n => n>=1000000?"NGN "+(n/1000000).toFixed(1)+"M":n>=1000?"NGN "+(n/1000).toFixed(0)+"k":"NGN "+n

function StatCard({label,value,icon,sub,color}) {
  return (
    <div className="dash-card" style={{padding:'18px 20px'}}>
      <div style={{display:'flex',alignItems:'flex-start',justifyContent:'space-between',marginBottom:10}}>
        <div style={{fontSize:11,fontWeight:600,color:'rgba(255,255,255,.4)',letterSpacing:'.06em',textTransform:'uppercase'}}>{label}</div>
        <div style={{width:34,height:34,borderRadius:9,background:color+'18',display:'flex',alignItems:'center',justifyContent:'center',fontSize:16}}>{icon}</div>
      </div>
      <div style={{fontSize:24,fontWeight:800,color:'#eef2ff',marginBottom:4}}>{value}</div>
      {sub&&<div style={{fontSize:11,color:'rgba(255,255,255,.35)'}}>{sub}</div>}
    </div>
  )
}

export default function AdminPayments() {
  const qc = useQueryClient()
  const { data, isLoading } = useQuery({ queryKey:['admin-payments'], queryFn: adminAPI.getPayments })
  const payments = data?.data?.payments || []

  const process = useMutation({ mutationFn: id => adminAPI.processPayout(id), onSuccess:()=>{ toast.success('Payout processed!'); qc.invalidateQueries(['admin-payments']) } })

  const payouts   = payments.filter(p => p.type==='payout')
  const pending   = payouts.filter(p => p.status==='pending')
  const totalPaid = payouts.filter(p=>p.status==='completed').reduce((s,p)=>s+p.amount,0)

  const STATUS_COL = { completed:'#10b981', processing:'#3b82f6', pending:'#f59e0b', failed:'#f43f5e' }

  return (
    <div>
      <div style={{display:'flex',alignItems:'center',justifyContent:'space-between',marginBottom:20}}>
        <div><h2 style={{fontWeight:700,fontSize:18,color:'#eef2ff',margin:0}}>Payment Monitoring</h2><div style={{fontSize:12,color:'rgba(255,255,255,.4)',marginTop:2}}>All platform transactions</div></div>
        <button onClick={()=>toast.success('Export started')} style={{padding:'9px 18px',background:'rgba(255,255,255,.05)',border:'1px solid rgba(255,255,255,.1)',borderRadius:8,color:'rgba(255,255,255,.6)',fontSize:13,cursor:'pointer'}}>Export CSV</button>
      </div>

      <div style={{display:'grid',gridTemplateColumns:'repeat(3,1fr)',gap:14,marginBottom:16}}>
        <StatCard label="Total Payouts" value={fmtK(totalPaid)} icon="💸" sub="Completed this month" color="#3b82f6"/>
        <StatCard label="Pending" value={fmtK(pending.reduce((s,p)=>s+p.amount,0))} icon="⏳" sub={pending.length+" requests waiting"} color="#f59e0b"/>
        <StatCard label="Platform Revenue" value={fmtK(payments.filter(p=>p.type==='order_payment'&&p.status==='completed').reduce((s,p)=>s+p.amount*0.05,0))} icon="💰" sub="5% commission" color="#10b981"/>
      </div>

      <div className="dash-card" style={{overflow:'hidden'}}>
        {isLoading ? <div style={{textAlign:'center',padding:'40px',color:'rgba(255,255,255,.4)',fontSize:13}}>Loading...</div> : (
          <div style={{overflowX:'auto'}}>
            <table style={{width:'100%',borderCollapse:'collapse'}}>
              <thead><tr>
                {['ID','Vendor','Amount','Type','Status','Date','Actions'].map(h => <th key={h} style={{padding:'10px 14px',textAlign:'left',fontSize:11,fontWeight:600,color:'rgba(255,255,255,.35)',borderBottom:'1px solid rgba(255,255,255,.07)',letterSpacing:'.05em',textTransform:'uppercase',whiteSpace:'nowrap'}}>{h}</th>)}
              </tr></thead>
              <tbody>
                {payments.map(p => {
                  const col = STATUS_COL[p.status] || '#f59e0b'
                  return (
                    <tr key={p._id} style={{borderBottom:'1px solid rgba(255,255,255,.04)'}}>
                      <td style={{padding:'12px 14px',fontFamily:'monospace',fontSize:11,color:'#3b82f6'}}>{p.reference?.slice(0,12)||p._id?.slice(0,12)}</td>
                      <td style={{padding:'12px 14px',fontSize:13,fontWeight:500,color:'#eef2ff'}}>{p.vendor?.storeName||'—'}</td>
                      <td style={{padding:'12px 14px',fontFamily:'monospace',fontSize:13,fontWeight:700,color:'#eef2ff'}}>{fmt(p.amount)}</td>
                      <td style={{padding:'12px 14px'}}><span style={{fontSize:10,fontWeight:700,padding:'3px 8px',borderRadius:6,background:p.type==='payout'?'rgba(139,92,246,.15)':'rgba(16,185,129,.15)',color:p.type==='payout'?'#8b5cf6':'#10b981',textTransform:'capitalize'}}>{p.type?.replace(/_/g,' ')}</span></td>
                      <td style={{padding:'12px 14px'}}><span style={{fontSize:10,fontWeight:700,padding:'3px 8px',borderRadius:6,background:col+'18',color:col}}>• {p.status}</span></td>
                      <td style={{padding:'12px 14px',fontSize:12,color:'rgba(255,255,255,.4)'}}>{new Date(p.createdAt).toLocaleDateString('en-NG',{day:'numeric',month:'short'})}</td>
                      <td style={{padding:'12px 14px'}}>
                        {p.type==='payout'&&p.status==='pending' && (
                          <button onClick={()=>process.mutate(p._id)} style={{padding:'4px 10px',background:'#3b82f6',color:'#fff',border:'none',borderRadius:6,fontSize:10,fontWeight:700,cursor:'pointer',whiteSpace:'nowrap'}}>Process</button>
                        )}
                      </td>
                    </tr>
                  )
                })}
                {payments.length===0&&<tr><td colSpan={7} style={{padding:'40px',textAlign:'center',color:'rgba(255,255,255,.35)',fontSize:13}}>No payment records found</td></tr>}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  )
}
