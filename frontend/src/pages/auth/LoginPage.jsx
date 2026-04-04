import { useState } from 'react'
import { useNavigate, Link } from 'react-router-dom'
import { useAuth } from '../../context/AuthContext'
import toast from 'react-hot-toast'

export default function LoginPage() {
  const [mode, setMode]   = useState('login')
  const [role, setRole]   = useState('vendor')
  const [form, setForm]   = useState({ name:'', email:'', password:'', storeName:'' })
  const [loading, setLoading] = useState(false)
  const { login, register } = useAuth()
  const navigate = useNavigate()

  const set = k => e => setForm(f => ({ ...f, [k]: e.target.value }))

  const submit = async e => {
    e.preventDefault()
    setLoading(true)
    try {
      if (mode === 'login') {
        const user = await login(form.email, form.password, role)
        toast.success('Welcome back, ' + user.name + '!')
        navigate(user.role === 'admin' ? '/admin' : '/vendor')
      } else {
        const user = await register({ ...form, role })
        toast.success('Account created! Welcome to ChatCart.')
        navigate(user.role === 'admin' ? '/admin' : '/vendor')
      }
    } catch (err) {
      toast.error(err.response?.data?.message || 'Something went wrong')
    }
    setLoading(false)
  }

  const inputStyle = { width:'100%', padding:'11px 13px', border:'1.5px solid rgba(255,255,255,.1)', borderRadius:8, background:'rgba(255,255,255,.06)', color:'#eef2ff', fontSize:13, fontFamily:"'DM Sans',sans-serif", outline:'none', marginBottom:13 }

  return (
    <div style={{ minHeight:'100vh', background:'#080d18', display:'flex', alignItems:'center', justifyContent:'center', padding:20, fontFamily:"'DM Sans',sans-serif" }}>
      <div style={{ width:460, background:'#0d1320', border:'1px solid rgba(255,255,255,.1)', borderRadius:20, overflow:'hidden' }}>

        {/* Header */}
        <div style={{ padding:'24px 28px', borderBottom:'1px solid rgba(255,255,255,.07)', display:'flex', alignItems:'center', justifyContent:'space-between' }}>
          <div style={{ display:'flex', alignItems:'center', gap:9 }}>
            <div style={{ width:32, height:32, background:'linear-gradient(135deg,#3b82f6,#6366f1)', borderRadius:9, display:'flex', alignItems:'center', justifyContent:'center', fontSize:16 }}>🛒</div>
            <span style={{ fontFamily:"'Fraunces',serif", fontSize:18, fontWeight:900, color:'#eef2ff' }}>ChatCart</span>
          </div>
          <Link to="/" style={{ fontSize:12, color:'rgba(255,255,255,.4)', textDecoration:'none' }}>← Marketplace</Link>
        </div>

        <div style={{ padding:'28px' }}>
          {/* Tabs */}
          <div style={{ display:'flex', background:'rgba(255,255,255,.04)', borderRadius:10, padding:3, marginBottom:22 }}>
            {['login','register'].map(m => (
              <button key={m} onClick={() => setMode(m)} style={{ flex:1, padding:'9px', border:'none', borderRadius:8, fontSize:13, fontWeight:600, cursor:'pointer', background: mode===m ? 'rgba(255,255,255,.09)' : 'transparent', color: mode===m ? '#eef2ff' : 'rgba(255,255,255,.4)', fontFamily:"'DM Sans',sans-serif", transition:'all .2s' }}>
                {m === 'login' ? 'Sign In' : 'Create Account'}
              </button>
            ))}
          </div>

          {/* Role picker */}
          <div style={{ marginBottom:20 }}>
            <div style={{ fontSize:11, fontWeight:700, color:'rgba(255,255,255,.4)', letterSpacing:'.06em', textTransform:'uppercase', marginBottom:10 }}>I am a...</div>
            <div style={{ display:'grid', gridTemplateColumns:'1fr 1fr', gap:10 }}>
              {[{ id:'vendor', icon:'🏪', label:'Vendor', desc:'Manage your store & sell' }, { id:'admin', icon:'⚙️', label:'Admin', desc:'Platform management' }].map(r => (
                <div key={r.id} onClick={() => setRole(r.id)} style={{ padding:'13px', border:'1.5px solid ' + (role===r.id ? '#3b82f6' : 'rgba(255,255,255,.08)'), background: role===r.id ? 'rgba(59,130,246,.1)' : 'rgba(255,255,255,.03)', borderRadius:10, cursor:'pointer', transition:'all .2s' }}>
                  <div style={{ fontSize:22, marginBottom:6 }}>{r.icon}</div>
                  <div style={{ fontSize:13, fontWeight:700, color:'#eef2ff', marginBottom:2 }}>{r.label}</div>
                  <div style={{ fontSize:11, color:'rgba(255,255,255,.4)' }}>{r.desc}</div>
                </div>
              ))}
            </div>
          </div>

          <form onSubmit={submit}>
            {mode === 'register' && <input placeholder="Full Name *" value={form.name} onChange={set('name')} required style={inputStyle} />}
            {mode === 'register' && role === 'vendor' && <input placeholder="Store Name" value={form.storeName} onChange={set('storeName')} style={inputStyle} />}
            <input type="email" placeholder="Email Address *" value={form.email} onChange={set('email')} required style={inputStyle} />
            <input type="password" placeholder="Password *" value={form.password} onChange={set('password')} required minLength={6} style={{ ...inputStyle, marginBottom:22 }} />

            <button type="submit" disabled={loading} style={{ width:'100%', padding:'13px', background:'#3b82f6', color:'#fff', border:'none', borderRadius:9, fontSize:14, fontWeight:700, cursor: loading ? 'wait' : 'pointer', display:'flex', alignItems:'center', justifyContent:'center', gap:8, transition:'background .2s' }}>
              {loading && <span style={{ width:16, height:16, border:'2px solid rgba(255,255,255,.3)', borderTopColor:'#fff', borderRadius:'50%', animation:'spin .7s linear infinite', display:'inline-block' }} />}
              {mode === 'login' ? 'Sign In →' : 'Create Account →'}
            </button>
          </form>

          <div style={{ textAlign:'center', marginTop:14, fontSize:12, color:'rgba(255,255,255,.4)' }}>
            {mode === 'login' ? "Don't have an account? " : 'Already have an account? '}
            <button onClick={() => setMode(m => m==='login'?'register':'login')} style={{ border:'none', background:'transparent', color:'#3b82f6', cursor:'pointer', fontSize:12, fontWeight:600 }}>
              {mode === 'login' ? 'Sign Up' : 'Sign In'}
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}
