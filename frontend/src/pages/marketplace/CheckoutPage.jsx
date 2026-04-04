import { useState } from 'react'
import { useNavigate, Link } from 'react-router-dom'
import { useMutation } from '@tanstack/react-query'
import { useCart } from '../../hooks/useCart'
import { useAuth } from '../../context/AuthContext'
import { ordersAPI, paymentsAPI } from '../../api'
import { useFlutterwave, closePaymentModal } from 'flutterwave-react-v3'
import toast from 'react-hot-toast'

const fmt = n => "₦" + Number(n).toLocaleString()
const STATES = ["Lagos","Abuja","Rivers","Kano","Oyo","Anambra","Delta","Enugu","Kaduna","Ogun","Ondo","Ekiti","Edo","Osun","Kwara","Benue","Nassarawa","Plateau","Cross River","Akwa Ibom","Bayelsa","Imo","Abia","Ebonyi","Kogi","Niger","Zamfara","Kebbi","Sokoto","Katsina","Jigawa","Bauchi","Gombe","Yobe","Borno","Taraba","Adamawa","FCT"]

export default function CheckoutPage() {
  const { items, subtotal, delivery, total, couponSavings, coupon, clear } = useCart()
  const { user } = useAuth()
  const nav = useNavigate()
  const [step, setStep] = useState(1)
  const [cust, setCust] = useState({ name: user?.name||"", email: user?.email||"", phone:"", address:"", city:"Lagos", state:"Lagos" })
  const [payMethod, setPayMethod] = useState("flutterwave")
  const [order, setOrder] = useState(null)
  const [errors, setErrors] = useState({})

  const createOrder = useMutation({
    mutationFn: () => ordersAPI.create({
      items: items.map(i => ({ productId: i.id, qty: i.qty })),
      paymentMethod: payMethod,
      deliveryName: cust.name, deliveryPhone: cust.phone, deliveryEmail: cust.email,
      deliveryAddress: cust.address, deliveryCity: cust.city, deliveryState: cust.state,
      discountCode: coupon || undefined,
    }),
    onSuccess: res => { setOrder(res.data.order); setStep(payMethod === "flutterwave" ? 3 : 4) },
    onError: err => toast.error(err.response?.data?.message || "Order failed"),
  })

  const FLW_CONFIG = {
    public_key: import.meta.env.VITE_FLUTTERWAVE_PUBLIC_KEY,
    tx_ref: "CC-"+ Date.now(),
    amount: total,
    currency: "NGN",
    payment_options: "card,banktransfer,ussd,mobilemoney",
    customer: { email: cust.email, phone_number: cust.phone, name: cust.name },
    customizations: { title:"ChatCart Payment", description:"Order payment", logo:"" },
  }
  const handleFlw = useFlutterwave(FLW_CONFIG)

  const validate = () => {
    const e = {}
    if (!cust.name.trim())    e.name    = "Required"
    if (!cust.phone.trim())   e.phone   = "Required"
    if (!cust.email.trim())   e.email   = "Required"
    if (!cust.address.trim()) e.address = "Required"
    setErrors(e)
    return Object.keys(e).length === 0
  }

  const inpStyle = err => ({ width:"100%", padding:"11px 13px", border:"1.5px solid "+(err?"#dc2626":"#ddd8ce"), borderRadius:8, fontSize:13, fontFamily:"'DM Sans',sans-serif", outline:"none" })

  if (!items.length) return (
    <div style={{ minHeight:"100vh", display:"flex", alignItems:"center", justifyContent:"center", flexDirection:"column", gap:16, fontFamily:"'DM Sans',sans-serif", background:"#faf8f3" }}>
      <div style={{ fontSize:48 }}>🛒</div>
      <h2 style={{ fontFamily:"'Fraunces',serif", fontSize:24 }}>Your cart is empty</h2>
      <Link to="/products" style={{ padding:"11px 24px", background:"#1c1409", color:"#fff", borderRadius:8, textDecoration:"none", fontSize:13, fontWeight:700 }}>Browse Products</Link>
    </div>
  )

  const STEPS = ["Delivery","Payment","Review","Done"]

  return (
    <div style={{ background:"#faf8f3", minHeight:"100vh", fontFamily:"'DM Sans',sans-serif" }}>
      <div style={{ background:"#1c1409", padding:"16px 0" }}>
        <div style={{ maxWidth:900, margin:"0 auto", padding:"0 16px", display:"flex", alignItems:"center", justifyContent:"space-between" }}>
          <Link to="/" style={{ display:"flex", alignItems:"center", gap:8, textDecoration:"none" }}>
            <div style={{ width:30, height:30, background:"rgba(255,255,255,.1)", borderRadius:8, display:"flex", alignItems:"center", justifyContent:"center", fontSize:16 }}>🛒</div>
            <span style={{ fontFamily:"'Fraunces',serif", fontSize:18, fontWeight:900, color:"#faf8f3" }}>ChatCart</span>
          </Link>
          <div style={{ display:"flex", alignItems:"center", gap:0 }}>
            {STEPS.map((s,i) => (
              <div key={s} style={{ display:"flex", alignItems:"center" }}>
                <div style={{ display:"flex", flexDirection:"column", alignItems:"center", gap:3 }}>
                  <div style={{ width:28, height:28, borderRadius:"50%", background:step>i+1?"#10b981":step===i+1?"#e85528":"rgba(255,255,255,.15)", display:"flex", alignItems:"center", justifyContent:"center", fontSize:11, fontWeight:700, color:"#fff", transition:"background .3s" }}>{step>i+1?"✓":i+1}</div>
                  <span style={{ fontSize:9, color:step>=i+1?"rgba(255,255,255,.9)":"rgba(255,255,255,.35)", fontWeight:600 }}>{s}</span>
                </div>
                {i<3 && <div style={{ width:40, height:2, background:step>i+1?"#10b981":"rgba(255,255,255,.2)", marginBottom:16, transition:"background .3s" }}/>}
              </div>
            ))}
          </div>
        </div>
      </div>

      <div style={{ maxWidth:900, margin:"0 auto", padding:"32px 16px" }}>
        <div style={{ display:"grid", gridTemplateColumns:"1.4fr 1fr", gap:28, alignItems:"start" }}>
          <div>

            {step===1 && (
              <div>
                <h2 style={{ fontFamily:"'Fraunces',serif", fontSize:22, fontWeight:700, marginBottom:22 }}>Delivery Details</h2>
                <div style={{ display:"grid", gridTemplateColumns:"1fr 1fr", gap:12, marginBottom:12 }}>
                  <div><div style={{ fontSize:11, fontWeight:700, color:"#7a7268", letterSpacing:".05em", marginBottom:5 }}>FULL NAME *</div><input value={cust.name} onChange={e=>setCust(c=>({...c,name:e.target.value}))} placeholder="Your name" style={inpStyle(errors.name)}/>{errors.name&&<div style={{fontSize:11,color:"#dc2626",marginTop:3}}>{errors.name}</div>}</div>
                  <div><div style={{ fontSize:11, fontWeight:700, color:"#7a7268", letterSpacing:".05em", marginBottom:5 }}>PHONE *</div><input value={cust.phone} onChange={e=>setCust(c=>({...c,phone:e.target.value}))} placeholder="+234 800 000 0000" style={inpStyle(errors.phone)}/>{errors.phone&&<div style={{fontSize:11,color:"#dc2626",marginTop:3}}>{errors.phone}</div>}</div>
                </div>
                <div style={{ marginBottom:12 }}><div style={{ fontSize:11, fontWeight:700, color:"#7a7268", letterSpacing:".05em", marginBottom:5 }}>EMAIL *</div><input type="email" value={cust.email} onChange={e=>setCust(c=>({...c,email:e.target.value}))} placeholder="your@email.com" style={inpStyle(errors.email)}/>{errors.email&&<div style={{fontSize:11,color:"#dc2626",marginTop:3}}>{errors.email}</div>}</div>
                <div style={{ marginBottom:12 }}><div style={{ fontSize:11, fontWeight:700, color:"#7a7268", letterSpacing:".05em", marginBottom:5 }}>DELIVERY ADDRESS *</div><input value={cust.address} onChange={e=>setCust(c=>({...c,address:e.target.value}))} placeholder="Street, house number" style={inpStyle(errors.address)}/>{errors.address&&<div style={{fontSize:11,color:"#dc2626",marginTop:3}}>{errors.address}</div>}</div>
                <div style={{ display:"grid", gridTemplateColumns:"1fr 1fr", gap:12, marginBottom:24 }}>
                  <div><div style={{ fontSize:11, fontWeight:700, color:"#7a7268", letterSpacing:".05em", marginBottom:5 }}>CITY</div><input value={cust.city} onChange={e=>setCust(c=>({...c,city:e.target.value}))} style={inpStyle(false)}/></div>
                  <div><div style={{ fontSize:11, fontWeight:700, color:"#7a7268", letterSpacing:".05em", marginBottom:5 }}>STATE</div><select value={cust.state} onChange={e=>setCust(c=>({...c,state:e.target.value}))} style={{ width:"100%", padding:"11px 13px", border:"1.5px solid #ddd8ce", borderRadius:8, fontSize:13, background:"#fff", fontFamily:"'DM Sans',sans-serif" }}>{STATES.map(s=><option key={s}>{s}</option>)}</select></div>
                </div>
                <button onClick={() => { if(validate()) setStep(2) }} style={{ width:"100%", padding:"13px", background:"#1c1409", color:"#faf8f3", border:"none", borderRadius:9, fontSize:14, fontWeight:700, cursor:"pointer" }}>Continue to Payment →</button>
              </div>
            )}

            {step===2 && (
              <div>
                <h2 style={{ fontFamily:"'Fraunces',serif", fontSize:22, fontWeight:700, marginBottom:22 }}>Payment Method</h2>
                {[
                  { id:"flutterwave", icon:"💳", label:"Pay Online", desc:"Card, bank transfer, USSD, mobile money via Flutterwave" },
                  { id:"bank_transfer", icon:"🏦", label:"Bank Transfer", desc:"Transfer directly and upload your receipt" },
                  { id:"pay_on_delivery", icon:"🚚", label:"Pay on Delivery", desc:"Cash or POS on arrival (Lagos & Abuja only)" },
                ].map(m => (
                  <div key={m.id} onClick={() => setPayMethod(m.id)} style={{ display:"flex", alignItems:"center", gap:14, padding:"16px 18px", border:"2px solid "+(payMethod===m.id?"#1c1409":"#e8e4dc"), background:payMethod===m.id?"#faf8f3":"#fff", borderRadius:12, cursor:"pointer", marginBottom:12, transition:"all .2s" }}>
                    <div style={{ width:44, height:44, borderRadius:10, background:payMethod===m.id?"#1c140912":"#f2ede3", display:"flex", alignItems:"center", justifyContent:"center", fontSize:22 }}>{m.icon}</div>
                    <div style={{ flex:1 }}><div style={{ fontSize:14, fontWeight:700, color:"#1c1409" }}>{m.label}</div><div style={{ fontSize:12, color:"#7a7268", marginTop:2 }}>{m.desc}</div></div>
                    <div style={{ width:20, height:20, borderRadius:"50%", border:"2px solid "+(payMethod===m.id?"#1c1409":"#ddd8ce"), background:payMethod===m.id?"#1c1409":"transparent", display:"flex", alignItems:"center", justifyContent:"center" }}>
                      {payMethod===m.id && <div style={{ width:8, height:8, borderRadius:"50%", background:"#fff" }}/>}
                    </div>
                  </div>
                ))}
                {payMethod==="bank_transfer" && (
                  <div style={{ background:"#faf8f3", borderRadius:10, padding:"16px 18px", marginBottom:16, border:"1px solid #e8e4dc" }}>
                    <div style={{ fontSize:13, fontWeight:700, color:"#1c1409", marginBottom:10 }}>Bank Details</div>
                    {[["Bank","Access Bank"],["Account Name","ChatCart Escrow Ltd"],["Account No.","0123456789"],["Amount",fmt(total)]].map(([l,v])=>(
                      <div key={l} style={{ display:"flex", justifyContent:"space-between", marginBottom:7, fontSize:13 }}>
                        <span style={{ color:"#7a7268" }}>{l}</span><span style={{ fontWeight:700, color:"#1c1409", fontFamily:l==="Account No."||l==="Amount"?"'JetBrains Mono',monospace":"inherit" }}>{v}</span>
                      </div>
                    ))}
                    <div style={{ fontSize:11, color:"#7a7268", marginTop:10, paddingTop:10, borderTop:"1px solid #e8e4dc" }}>⚠️ Transfer exact amount. Upload proof after placing order.</div>
                  </div>
                )}
                <div style={{ display:"flex", gap:10 }}>
                  <button onClick={() => setStep(1)} style={{ flex:0.4, padding:"12px", background:"transparent", color:"#1c1409", border:"1.5px solid #e8e4dc", borderRadius:9, fontSize:13, fontWeight:600, cursor:"pointer" }}>← Back</button>
                  <button onClick={() => setStep(3)} style={{ flex:1, padding:"12px", background:"#1c1409", color:"#faf8f3", border:"none", borderRadius:9, fontSize:14, fontWeight:700, cursor:"pointer" }}>Review Order →</button>
                </div>
              </div>
            )}

            {step===3 && (
              <div>
                <h2 style={{ fontFamily:"'Fraunces',serif", fontSize:22, fontWeight:700, marginBottom:22 }}>Review Your Order</h2>
                <div style={{ background:"#fff", border:"1px solid #e8e4dc", borderRadius:12, padding:20, marginBottom:16 }}>
                  {items.map(item => (
                    <div key={item.key} style={{ display:"flex", gap:12, marginBottom:14, alignItems:"center", paddingBottom:14, borderBottom:"1px solid #f5f5f0" }}>
                      <div style={{ width:50, height:50, background:"#f2ede3", borderRadius:8, display:"flex", alignItems:"center", justifyContent:"center", flexShrink:0 }}>
                        {item.image ? <img src={item.image} alt={item.name} style={{ width:"100%", height:"100%", objectFit:"cover", borderRadius:8 }}/> : <span style={{ fontSize:24 }}>📦</span>}
                      </div>
                      <div style={{ flex:1 }}><div style={{ fontSize:13, fontWeight:600, color:"#1c1409" }}>{item.name}</div><div style={{ fontSize:11, color:"#7a7268" }}>×{item.qty}</div></div>
                      <span style={{ fontFamily:"'Fraunces',serif", fontSize:14, fontWeight:700 }}>{fmt(item.price*item.qty)}</span>
                    </div>
                  ))}
                </div>
                <div style={{ background:"#fff", border:"1px solid #e8e4dc", borderRadius:12, padding:"16px 20px", marginBottom:20 }}>
                  <div style={{ display:"grid", gridTemplateColumns:"1fr 1fr", gap:10, fontSize:13 }}>
                    <div><div style={{ color:"#7a7268", fontSize:11, marginBottom:3 }}>Deliver to</div><div style={{ fontWeight:600 }}>{cust.name}</div><div style={{ color:"#7a7268" }}>{cust.address}, {cust.city}, {cust.state}</div></div>
                    <div><div style={{ color:"#7a7268", fontSize:11, marginBottom:3 }}>Payment</div><div style={{ fontWeight:600 }}>{payMethod==="flutterwave"?"Online (Flutterwave)":payMethod==="bank_transfer"?"Bank Transfer":"Pay on Delivery"}</div></div>
                  </div>
                </div>
                <div style={{ display:"flex", gap:10 }}>
                  <button onClick={() => setStep(2)} style={{ flex:0.4, padding:"12px", background:"transparent", color:"#1c1409", border:"1.5px solid #e8e4dc", borderRadius:9, fontSize:13, fontWeight:600, cursor:"pointer" }}>← Back</button>
                  <button disabled={createOrder.isLoading} onClick={() => {
                    if (payMethod === "flutterwave") {
                      createOrder.mutateAsync().then(res => {
                        const orderId = res.data.order._id
                        handleFlw({
                          callback: (resp) => {
                            closePaymentModal()
                            if (resp.status === "successful") {
                              paymentsAPI.verify(resp.tx_ref).then(() => { clear(); nav("/payment/verify?tx_ref="+resp.tx_ref+"&status=successful") })
                            } else { toast.error("Payment not completed") }
                          },
                          onClose: () => {}
                        })
                      })
                    } else {
                      createOrder.mutate()
                    }
                  }} style={{ flex:1, padding:"12px", background:"#e85528", color:"#fff", border:"none", borderRadius:9, fontSize:15, fontWeight:800, cursor:"pointer", opacity:createOrder.isLoading?.6:1 }}>
                    {createOrder.isLoading ? "Placing Order..." : "✓ Place Order — "+fmt(total)}
                  </button>
                </div>
              </div>
            )}

            {step===4 && order && (
              <div style={{ textAlign:"center", padding:"20px 0" }}>
                <div style={{ width:72, height:72, borderRadius:"50%", background:"#e8f5ee", display:"flex", alignItems:"center", justifyContent:"center", fontSize:36, margin:"0 auto 20px" }}>✅</div>
                <h2 style={{ fontFamily:"'Fraunces',serif", fontSize:28, fontWeight:900, marginBottom:8 }}>Order Placed!</h2>
                <p style={{ color:"#7a7268", fontSize:14, marginBottom:24 }}>Order ID: <strong style={{ fontFamily:"monospace", color:"#1c1409" }}>{order.orderId}</strong></p>
                {payMethod==="bank_transfer" && <div style={{ background:"#fef9e7", border:"1px solid #f59e0b33", borderRadius:12, padding:"16px 20px", marginBottom:20, fontSize:13, color:"#1c1409", textAlign:"left" }}>
                  <strong>Next step:</strong> Transfer {fmt(total)} to Access Bank · 0123456789 · ChatCart Escrow Ltd, then upload your proof on the Orders page.
                </div>}
                <div style={{ display:"flex", gap:10, justifyContent:"center" }}>
                  <button onClick={() => { clear(); nav("/orders") }} style={{ padding:"11px 24px", background:"#1c1409", color:"#fff", border:"none", borderRadius:8, fontSize:13, fontWeight:700, cursor:"pointer" }}>📦 Track Order</button>
                  <button onClick={() => { clear(); nav("/") }} style={{ padding:"11px 24px", background:"transparent", color:"#1c1409", border:"1.5px solid #e8e4dc", borderRadius:8, fontSize:13, fontWeight:600, cursor:"pointer" }}>Continue Shopping →</button>
                </div>
              </div>
            )}
          </div>

          {/* Order summary sidebar */}
          <div style={{ background:"#fff", border:"1px solid #e8e4dc", borderRadius:14, padding:20, position:"sticky", top:20 }}>
            <div style={{ fontFamily:"'Fraunces',serif", fontSize:18, fontWeight:700, marginBottom:16 }}>Order Summary</div>
            {items.map(item => (
              <div key={item.key} style={{ display:"flex", gap:10, marginBottom:12, alignItems:"center" }}>
                <div style={{ width:42, height:42, background:"#f2ede3", borderRadius:8, display:"flex", alignItems:"center", justifyContent:"center", flexShrink:0, fontSize:20 }}>
                  {item.image ? <img src={item.image} alt="" style={{ width:"100%", height:"100%", objectFit:"cover", borderRadius:8 }}/> : "📦"}
                </div>
                <div style={{ flex:1, minWidth:0 }}><div style={{ fontSize:12, fontWeight:600, color:"#1c1409", overflow:"hidden", textOverflow:"ellipsis", whiteSpace:"nowrap" }}>{item.name}</div><div style={{ fontSize:11, color:"#7a7268" }}>×{item.qty}</div></div>
                <span style={{ fontSize:13, fontWeight:700, flexShrink:0 }}>{fmt(item.price*item.qty)}</span>
              </div>
            ))}
            <div style={{ height:1, background:"#e8e4dc", margin:"14px 0" }}/>
            {[["Subtotal",fmt(subtotal)],["Delivery",fmt(delivery)],...(couponSavings>0?[["Discount","−"+fmt(couponSavings)]]:[]),(["Total",fmt(total)])].map(([l,v])=>(
              <div key={l} style={{ display:"flex", justifyContent:"space-between", marginBottom:8, fontSize:13 }}>
                <span style={{ color: l==="Total"?"#1c1409":"#7a7268", fontFamily:l==="Total"?"'Fraunces',serif":"inherit", fontWeight:l==="Total"?700:400, fontSize:l==="Total"?17:13 }}>{l}</span>
                <span style={{ fontWeight:l==="Total"?900:600, fontSize:l==="Total"?20:13, fontFamily:l==="Total"?"'Fraunces',serif":"inherit", color:l==="Discount"?"#1a6b3c":"#1c1409" }}>{v}</span>
              </div>
            ))}
          </div>
        </div>
      </div>
      <style>{"@media(max-width:768px){div[style*=\'grid-template-columns: 1.4fr\']{grid-template-columns:1fr!important}}"}</style>
    </div>
  )
}
