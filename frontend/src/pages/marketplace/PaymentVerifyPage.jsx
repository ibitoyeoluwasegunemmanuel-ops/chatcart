import { useEffect, useState } from 'react'
import { useSearchParams, Link } from 'react-router-dom'
import { paymentsAPI } from '../../api'

export default function PaymentVerifyPage() {
  const [params]  = useSearchParams()
  const [status,  setStatus]  = useState('verifying') // verifying | success | failed
  const [order,   setOrder]   = useState(null)
  const [message, setMessage] = useState('')

  useEffect(() => {
    const txRef  = params.get('tx_ref')  || params.get('transaction_id')
    const status = params.get('status')

    if (!txRef) { setStatus('failed'); setMessage('No transaction reference found'); return }
    if (status === 'cancelled') { setStatus('failed'); setMessage('Payment was cancelled'); return }

    paymentsAPI.verify(txRef)
      .then(res => {
        setStatus('success')
        setOrder(res.data.order)
      })
      .catch(err => {
        setStatus('failed')
        setMessage(err.response?.data?.message || 'Payment verification failed')
      })
  }, [])

  const fmt = n => '₦' + Number(n).toLocaleString()

  return (
    <div style={{ minHeight:'100vh', background:'#faf8f3', display:'flex', alignItems:'center', justifyContent:'center', fontFamily:"'DM Sans',sans-serif", padding:20 }}>
      <div style={{ maxWidth:480, width:'100%', background:'#fff', border:'1px solid #ddd8ce', borderRadius:20, padding:36, textAlign:'center' }}>

        {status === 'verifying' && (
          <>
            <div style={{ width:64, height:64, border:'4px solid #e85528', borderTopColor:'transparent', borderRadius:'50%', animation:'spin .8s linear infinite', margin:'0 auto 20px' }} />
            <h2 style={{ fontFamily:"'Fraunces',serif", fontSize:24, marginBottom:8 }}>Verifying Payment...</h2>
            <p style={{ color:'#7a7268', fontSize:14 }}>Please wait while we confirm your payment</p>
          </>
        )}

        {status === 'success' && (
          <>
            <div style={{ width:72, height:72, background:'#e8f5ee', borderRadius:'50%', display:'flex', alignItems:'center', justifyContent:'center', fontSize:36, margin:'0 auto 20px' }}>✅</div>
            <h2 style={{ fontFamily:"'Fraunces',serif", fontSize:28, fontWeight:900, marginBottom:8 }}>Payment Successful!</h2>
            <p style={{ color:'#7a7268', fontSize:14, marginBottom:24 }}>Your order has been confirmed and is being processed.</p>
            {order && (
              <div style={{ background:'#faf8f3', borderRadius:12, padding:'18px 20px', marginBottom:24, textAlign:'left' }}>
                {[['Order ID', order.orderId],['Total', fmt(order.total)],['Status', 'Payment Confirmed']].map(([l,v]) => (
                  <div key={l} style={{ display:'flex', justifyContent:'space-between', marginBottom:8, fontSize:13 }}>
                    <span style={{ color:'#7a7268' }}>{l}</span>
                    <span style={{ fontWeight:700, color:'#1c1409' }}>{v}</span>
                  </div>
                ))}
              </div>
            )}
            <div style={{ display:'flex', gap:10 }}>
              <Link to="/orders" style={{ flex:1, padding:'12px', background:'#1c1409', color:'#faf8f3', borderRadius:9, fontSize:13, fontWeight:700, textDecoration:'none', display:'flex', alignItems:'center', justifyContent:'center' }}>📦 Track Order</Link>
              <Link to="/" style={{ flex:1, padding:'12px', background:'transparent', color:'#1c1409', border:'1.5px solid #ddd8ce', borderRadius:9, fontSize:13, fontWeight:600, textDecoration:'none', display:'flex', alignItems:'center', justifyContent:'center' }}>Continue Shopping</Link>
            </div>
          </>
        )}

        {status === 'failed' && (
          <>
            <div style={{ width:72, height:72, background:'#fff0f0', borderRadius:'50%', display:'flex', alignItems:'center', justifyContent:'center', fontSize:36, margin:'0 auto 20px' }}>❌</div>
            <h2 style={{ fontFamily:"'Fraunces',serif", fontSize:26, fontWeight:900, marginBottom:8 }}>Payment Failed</h2>
            <p style={{ color:'#7a7268', fontSize:14, marginBottom:24 }}>{message || 'Something went wrong with your payment. Please try again.'}</p>
            <div style={{ display:'flex', gap:10, justifyContent:'center' }}>
              <Link to="/checkout" style={{ padding:'12px 24px', background:'#e85528', color:'#fff', borderRadius:9, fontSize:13, fontWeight:700, textDecoration:'none' }}>Try Again</Link>
              <Link to="/" style={{ padding:'12px 24px', background:'transparent', color:'#1c1409', border:'1.5px solid #ddd8ce', borderRadius:9, fontSize:13, fontWeight:600, textDecoration:'none' }}>Go Home</Link>
            </div>
          </>
        )}
      </div>
      <style>{`@keyframes spin { to { transform: rotate(360deg) } }`}</style>
    </div>
  )
}
