import { useState } from 'react'
import { useQuery, useMutation } from '@tanstack/react-query'
import { paymentsAPI } from '../../api'
import toast from 'react-hot-toast'

const fmt = n => "NGN " + Number(n).toLocaleString()

export default function VendorPayouts() {
  const [tab, setTab]     = useState('earnings')
  const [amount, setAmount] = useState('')

  const { data: payoutData } = useQuery({ queryKey:['payouts'], queryFn: paymentsAPI.getPayouts })
  const payouts = payoutData?.data?.payouts || []

  const request = useMutation({
    mutationFn: () => paymentsAPI.requestPayout({ amount:+amount, bankCode:'044', accountNumber:'0123456789', accountName:'Store Owner' }),
    onSuccess: () => { toast.success('Payout request submitted!'); setAmount('') },
    onError: err => toast.error(err.response?.data?.message || 'Payout failed'),
  })

  const AVAILABLE = 648000
  const PENDING   = 512000
  const TOTAL     = 4820000

  const STATUS_COLOR = { completed:'#10b981', processing:'#3b82f6', pending:'#f59e0b', failed:'#f43f5e' }
  const inp = {width:'100%',padding:'9px 12px',background:'rgba(255,255,255,.06)',border:'1px solid rgba(255,255,255,.1)',borderRadius:8,color:'#eef2ff',fontSize:13,fontFamily:'DM Sans,sans-serif',outline:'none'}

  return (
    <div>
      <div style={{marginBottom:20}}>
        <h2 style={{fontWeight:700,fontSize:18,color:'#eef2ff',margin:0}}>Payouts</h2>
        <div style={{fontSize:12,color:'rgba(255,255,255,.4)',marginTop:2}}>Your earnings and withdrawal history</div>
      </div>

      <div style={{display:'grid',gridTemplateColumns:'repeat(3,1fr)',gap:14,marginBottom:20}}>
        <div className="dash-card" style={{padding:20}}>
          <div style={{fontSize:11,color:'rgba(255,255,255,.4)',fontWeight:600,letterSpacing:'.06em',textTransform:'uppercase',marginBottom:8}}>Available Balance</div>
          <div style={{fontSize:30,fontWeight:900,color:'#10b981',marginBottom:8,fontFamily:'DM Sans,sans-serif'}}>{fmt(AVAILABLE)}</div>
          <button onClick={()=>setTab('withdraw')} style={{padding:'7px 16px',background:'rgba(16,185,129,.12)',border:'1px solid rgba(16,185,129,.25)',borderRadius:8,color:'#10b981',fontSize:12,fontWeight:700,cursor:'pointer'}}>Withdraw</button>
        </div>
        {[['Pending Clearance',PENDING,'⏳','#f59e0b'],['Total Earned',TOTAL,'💰','#3b82f6']].map(([l,v,ic,col]) => (
          <div key={l} className="dash-card" style={{padding:20}}>
            <div style={{display:'flex',justifyContent:'space-between',marginBottom:10}}>
              <div style={{fontSize:11,color:'rgba(255,255,255,.4)',fontWeight:600,letterSpacing:'.06em',textTransform:'uppercase'}}>{l}</div>
              <div style={{width:34,height:34,borderRadius:9,background:col+'18',display:'flex',alignItems:'center',justifyContent:'center',fontSize:16}}>{ic}</div>
            </div>
            <div style={{fontSize:24,fontWeight:800,color:'#eef2ff'}}>{fmt(v)}</div>
          </div>
        ))}
      </div>

      <div style={{display:'flex',gap:4,marginBottom:18,borderBottom:'1px solid rgba(255,255,255,.07)'}}>
        {[['earnings','Earnings'],['withdraw','Withdraw'],['history','History']].map(([k,l]) => (
          <button key={k} onClick={()=>setTab(k)} style={{padding:'8px 16px',border:'none',background:'transparent',cursor:'pointer',fontSize:12,fontWeight:tab===k?700:400,color:tab===k?'#10b981':'rgba(255,255,255,.4)',borderBottom:'2px solid '+(tab===k?'#10b981':'transparent'),fontFamily:'DM Sans,sans-serif',marginBottom:-1,transition:'all .18s'}}>{l}</button>
        ))}
      </div>

      {tab==='earnings' && (
        <div style={{display:'grid',gridTemplateColumns:'1fr 1fr',gap:14}}>
          <div className="dash-card" style={{padding:20}}>
            <div style={{fontWeight:700,fontSize:14,color:'#eef2ff',marginBottom:16}}>Revenue Breakdown</div>
            {[['Gross Sales',fmt(TOTAL),'#eef2ff'],['Platform Fee (5%)','-'+fmt(TOTAL*0.05),'#f43f5e'],['Net Earnings',fmt(TOTAL*0.95),'#10b981'],['Withdrawn',fmt(479000),'#8b5cf6'],['Available',fmt(AVAILABLE),'#10b981']].map(([l,v,c]) => (
              <div key={l} style={{display:'flex',justifyContent:'space-between',padding:'9px 0',borderBottom:'1px solid rgba(255,255,255,.05)'}}>
                <span style={{fontSize:12,color:'rgba(255,255,255,.4)'}}>{l}</span>
                <span style={{fontSize:13,fontWeight:700,color:c,fontFamily:'monospace'}}>{v}</span>
              </div>
            ))}
          </div>
          <div className="dash-card" style={{padding:20}}>
            <div style={{fontWeight:700,fontSize:14,color:'#eef2ff',marginBottom:14}}>Payout Schedule</div>
            {[['Processing time','1-2 business days'],['Minimum withdrawal','NGN 5,000'],['Maximum per day','NGN 2,000,000'],['Fee','Free'],['Method','Direct bank transfer']].map(([l,v]) => (
              <div key={l} style={{display:'flex',justifyContent:'space-between',padding:'8px 0',borderBottom:'1px solid rgba(255,255,255,.05)'}}>
                <span style={{fontSize:12,color:'rgba(255,255,255,.4)'}}>{l}</span>
                <span style={{fontSize:12,fontWeight:600,color:'#eef2ff'}}>{v}</span>
              </div>
            ))}
          </div>
        </div>
      )}

      {tab==='withdraw' && (
        <div style={{display:'grid',gridTemplateColumns:'1fr 1fr',gap:14}}>
          <div className="dash-card" style={{padding:22}}>
            <div style={{fontWeight:700,fontSize:14,color:'#eef2ff',marginBottom:16}}>Request Withdrawal</div>
            <div style={{background:'rgba(16,185,129,.08)',border:'1px solid rgba(16,185,129,.2)',borderRadius:9,padding:'12px 14px',marginBottom:16,display:'flex',justifyContent:'space-between',alignItems:'center'}}>
              <span style={{fontSize:12,color:'rgba(255,255,255,.5)'}}>Available</span>
              <span style={{fontSize:20,fontWeight:900,color:'#10b981'}}>{fmt(AVAILABLE)}</span>
            </div>
            <div style={{marginBottom:14}}>
              <div style={{fontSize:11,fontWeight:600,color:'rgba(255,255,255,.45)',letterSpacing:'.05em',textTransform:'uppercase',marginBottom:6}}>Amount (NGN)</div>
              <input type="number" value={amount} onChange={e=>setAmount(e.target.value)} placeholder="Min. NGN 5,000" style={inp}/>
            </div>
            <div style={{marginBottom:16}}>
              <div style={{fontSize:11,fontWeight:600,color:'rgba(255,255,255,.45)',letterSpacing:'.05em',textTransform:'uppercase',marginBottom:8}}>Withdraw To</div>
              <div style={{background:'rgba(255,255,255,.04)',border:'1px solid rgba(255,255,255,.08)',borderRadius:9,padding:'12px 14px'}}>
                <div style={{fontSize:13,fontWeight:600,color:'#eef2ff'}}>Access Bank</div>
                <div style={{fontSize:12,color:'rgba(255,255,255,.4)',fontFamily:'monospace'}}>0123456789</div>
              </div>
            </div>
            {amount && +amount > 0 && (
              <div style={{background:'rgba(255,255,255,.03)',borderRadius:8,padding:'10px 13px',marginBottom:16,fontSize:12,color:'rgba(255,255,255,.45)'}}>
                You will receive <strong style={{color:'#10b981'}}>{fmt(+amount)}</strong> within 1-2 business days.
              </div>
            )}
            <button onClick={()=>request.mutate()} disabled={!amount||+amount<5000||request.isLoading} style={{width:'100%',padding:'11px',background:'#10b981',color:'#fff',border:'none',borderRadius:8,fontSize:13,fontWeight:700,cursor:'pointer',opacity:!amount||+amount<5000?.5:1}}>
              {request.isLoading?'Processing...':'Request Withdrawal'}
            </button>
          </div>
          <div className="dash-card" style={{padding:18}}>
            <div style={{fontWeight:700,fontSize:13,color:'#eef2ff',marginBottom:14}}>Recent Withdrawals</div>
            {[{id:'PO-441',amount:284000,status:'completed',date:'Mar 12'},{id:'PO-398',amount:195000,status:'completed',date:'Feb 28'},{id:'PO-377',amount:512000,status:'processing',date:'Mar 15'}].map(p => (
              <div key={p.id} style={{display:'flex',justifyContent:'space-between',padding:'10px 0',borderBottom:'1px solid rgba(255,255,255,.05)',alignItems:'center'}}>
                <div><div style={{fontSize:12,fontFamily:'monospace',color:'#3b82f6'}}>{p.id}</div><div style={{fontSize:11,color:'rgba(255,255,255,.3)'}}>{p.date}</div></div>
                <div style={{textAlign:'right'}}><div style={{fontSize:13,fontWeight:700,color:'#eef2ff',fontFamily:'monospace'}}>{fmt(p.amount)}</div><div style={{fontSize:10,fontWeight:700,color:STATUS_COLOR[p.status]}}>{p.status}</div></div>
              </div>
            ))}
          </div>
        </div>
      )}

      {tab==='history' && (
        <div className="dash-card" style={{overflow:'hidden'}}>
          {payouts.length === 0 ? (
            <div style={{textAlign:'center',padding:'40px',color:'rgba(255,255,255,.35)',fontSize:13}}>No payout history yet</div>
          ) : (
            <div style={{overflowX:'auto'}}>
              <table style={{width:'100%',borderCollapse:'collapse'}}>
                <thead><tr>
                  {['Payout ID','Amount','Status','Date','Reference'].map(h=><th key={h} style={{padding:'10px 14px',textAlign:'left',fontSize:11,fontWeight:600,color:'rgba(255,255,255,.35)',borderBottom:'1px solid rgba(255,255,255,.07)',letterSpacing:'.05em',textTransform:'uppercase'}}>{h}</th>)}
                </tr></thead>
                <tbody>
                  {payouts.map(p => <tr key={p._id} style={{borderBottom:'1px solid rgba(255,255,255,.04)'}}>
                    <td style={{padding:'12px 14px',fontFamily:'monospace',fontSize:12,color:'#3b82f6'}}>{p.reference}</td>
                    <td style={{padding:'12px 14px',fontFamily:'monospace',fontWeight:700,color:'#eef2ff'}}>{fmt(p.amount)}</td>
                    <td style={{padding:'12px 14px'}}><span style={{fontSize:10,fontWeight:700,padding:'3px 8px',borderRadius:6,background:(STATUS_COLOR[p.status]||'#f59e0b')+'18',color:STATUS_COLOR[p.status]||'#f59e0b'}}>{p.status}</span></td>
                    <td style={{padding:'12px 14px',fontSize:12,color:'rgba(255,255,255,.4)'}}>{new Date(p.createdAt).toLocaleDateString()}</td>
                    <td style={{padding:'12px 14px',fontFamily:'monospace',fontSize:11,color:'rgba(255,255,255,.3)'}}>{p.flwRef||'—'}</td>
                  </tr>)}
                </tbody>
              </table>
            </div>
          )}
        </div>
      )}
    </div>
  )
}
