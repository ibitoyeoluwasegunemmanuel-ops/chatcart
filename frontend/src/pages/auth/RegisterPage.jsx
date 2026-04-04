import { useNavigate, Link } from 'react-router-dom'
export default function RegisterPage() {
  const nav = useNavigate()
  return (
    <div style={{minHeight:'100vh',background:'#080d18',display:'flex',alignItems:'center',justifyContent:'center'}}>
      <div style={{textAlign:'center',color:'#eef2ff',fontFamily:'DM Sans,sans-serif'}}>
        <div style={{fontSize:40,marginBottom:16}}>🛒</div>
        <div style={{fontFamily:'Fraunces,serif',fontSize:24,fontWeight:700,marginBottom:8}}>Create Account</div>
        <div style={{fontSize:13,color:'rgba(255,255,255,.5)',marginBottom:24}}>Registration is handled on the sign in page</div>
        <button onClick={()=>nav('/login')} style={{padding:'11px 24px',background:'#3b82f6',color:'#fff',border:'none',borderRadius:8,fontSize:13,fontWeight:700,cursor:'pointer'}}>Go to Sign In</button>
      </div>
    </div>
  )
}
