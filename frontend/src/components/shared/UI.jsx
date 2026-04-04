import { useState } from 'react'

// ── BUTTON ────────────────────────────────────────────────────────────────────
export function Btn({ children, variant='primary', size='md', onClick, disabled, loading, style={}, type='button', fullWidth }) {
  const base = { display:'inline-flex', alignItems:'center', gap:6, border:'none', cursor: disabled||loading ? 'not-allowed' : 'pointer', fontFamily:"'DM Sans',sans-serif", fontWeight:600, transition:'all .2s', borderRadius:8, opacity: disabled||loading ? 0.65 : 1, width: fullWidth ? '100%' : undefined, justifyContent: fullWidth ? 'center' : undefined }
  const sizes = { sm: { padding:'6px 12px', fontSize:11 }, md: { padding:'10px 18px', fontSize:13 }, lg: { padding:'13px 26px', fontSize:15 } }
  const variants = {
    primary:   { background:'#e85528', color:'#fff' },
    secondary: { background:'transparent', color:'#1c1409', border:'1.5px solid #ddd8ce' },
    dark:      { background:'#1c1409', color:'#faf8f3' },
    ghost:     { background:'transparent', color:'#7a7268', border:'1px solid #ddd8ce' },
    // Dashboard variants
    'dash-primary': { background:'#3b82f6', color:'#fff' },
    'dash-ghost':   { background:'rgba(255,255,255,.05)', color:'rgba(255,255,255,.6)', border:'1px solid rgba(255,255,255,.1)' },
    'dash-danger':  { background:'rgba(244,63,94,.12)', color:'#f43f5e', border:'1px solid rgba(244,63,94,.25)' },
    'dash-success': { background:'rgba(16,185,129,.12)', color:'#10b981', border:'1px solid rgba(16,185,129,.25)' },
    'dash-amber':   { background:'rgba(245,158,11,.12)', color:'#f59e0b', border:'1px solid rgba(245,158,11,.25)' },
  }
  return (
    <button type={type} onClick={onClick} disabled={disabled||loading} style={{ ...base, ...sizes[size], ...variants[variant], ...style }}>
      {loading ? <span style={{ width:14, height:14, border:'2px solid currentColor', borderTopColor:'transparent', borderRadius:'50%', animation:'spin 0.7s linear infinite', display:'inline-block' }} /> : null}
      {children}
    </button>
  )
}

// ── INPUT ─────────────────────────────────────────────────────────────────────
export function Input({ label, error, style={}, dark, ...props }) {
  const inputStyle = dark
    ? { width:'100%', padding:'9px 12px', background:'rgba(255,255,255,.06)', border:'1px solid rgba(255,255,255,.1)', borderRadius:8, color:'#eef2ff', fontSize:13, outline:'none', fontFamily:"'DM Sans',sans-serif", transition:'border-color .2s' }
    : { width:'100%', padding:'10px 13px', border:'1.5px solid #ddd8ce', borderRadius:8, fontSize:13, background:'#fff', color:'#1c1409', fontFamily:"'DM Sans',sans-serif", transition:'border-color .2s' }
  return (
    <div style={{ marginBottom: label ? 13 : 0, ...style }}>
      {label && <div style={{ fontSize:11, fontWeight:700, letterSpacing:'.05em', textTransform:'uppercase', color: dark ? 'rgba(255,255,255,.45)' : '#7a7268', marginBottom:5 }}>{label}</div>}
      <input {...props} style={inputStyle}
        onFocus={e => e.target.style.borderColor = dark ? '#3b82f6' : '#1c1409'}
        onBlur={e  => e.target.style.borderColor = dark ? 'rgba(255,255,255,.1)' : '#ddd8ce'}
      />
      {error && <div style={{ fontSize:11, color:'#dc2626', marginTop:4 }}>{error}</div>}
    </div>
  )
}

// ── SELECT ────────────────────────────────────────────────────────────────────
export function Select({ label, children, dark, style={}, ...props }) {
  const s = dark
    ? { width:'100%', padding:'9px 12px', background:'rgba(255,255,255,.06)', border:'1px solid rgba(255,255,255,.1)', borderRadius:8, color:'#eef2ff', fontSize:13, cursor:'pointer', fontFamily:"'DM Sans',sans-serif" }
    : { width:'100%', padding:'10px 13px', border:'1.5px solid #ddd8ce', borderRadius:8, fontSize:13, background:'#fff', color:'#1c1409', cursor:'pointer', fontFamily:"'DM Sans',sans-serif" }
  return (
    <div style={{ marginBottom: label ? 13 : 0, ...style }}>
      {label && <div style={{ fontSize:11, fontWeight:700, letterSpacing:'.05em', textTransform:'uppercase', color: dark ? 'rgba(255,255,255,.45)' : '#7a7268', marginBottom:5 }}>{label}</div>}
      <select {...props} style={s}>{children}</select>
    </div>
  )
}

// ── TEXTAREA ──────────────────────────────────────────────────────────────────
export function Textarea({ label, dark, rows=4, ...props }) {
  const s = dark
    ? { width:'100%', padding:'9px 12px', background:'rgba(255,255,255,.06)', border:'1px solid rgba(255,255,255,.1)', borderRadius:8, color:'#eef2ff', fontSize:13, resize:'vertical', fontFamily:"'DM Sans',sans-serif", outline:'none' }
    : { width:'100%', padding:'10px 13px', border:'1.5px solid #ddd8ce', borderRadius:8, fontSize:13, resize:'vertical', background:'#fff', color:'#1c1409', fontFamily:"'DM Sans',sans-serif", outline:'none' }
  return (
    <div style={{ marginBottom: label ? 13 : 0 }}>
      {label && <div style={{ fontSize:11, fontWeight:700, letterSpacing:'.05em', textTransform:'uppercase', color: dark ? 'rgba(255,255,255,.45)' : '#7a7268', marginBottom:5 }}>{label}</div>}
      <textarea rows={rows} {...props} style={s} />
    </div>
  )
}

// ── TOGGLE ────────────────────────────────────────────────────────────────────
export function Toggle({ on, onChange }) {
  return (
    <div onClick={() => onChange(!on)} style={{ width:38, height:21, borderRadius:99, background: on ? '#3b82f6' : 'rgba(255,255,255,.1)', position:'relative', cursor:'pointer', transition:'background .2s', border:'1px solid rgba(255,255,255,.08)', flexShrink:0 }}>
      <div style={{ position:'absolute', top:2, left: on ? 18 : 2, width:15, height:15, borderRadius:'50%', background:'#fff', transition:'left .2s', boxShadow:'0 1px 4px rgba(0,0,0,.3)' }} />
    </div>
  )
}

// ── BADGE ─────────────────────────────────────────────────────────────────────
export function Badge({ children, color='blue' }) {
  const colors = {
    blue:   { bg:'rgba(59,130,246,.15)',  text:'#3b82f6' },
    green:  { bg:'rgba(16,185,129,.13)',  text:'#10b981' },
    amber:  { bg:'rgba(245,158,11,.13)',  text:'#f59e0b' },
    red:    { bg:'rgba(244,63,94,.13)',   text:'#f43f5e' },
    violet: { bg:'rgba(139,92,246,.13)',  text:'#8b5cf6' },
    gray:   { bg:'rgba(255,255,255,.07)', text:'rgba(255,255,255,.5)' },
  }
  const c = colors[color] || colors.blue
  return (
    <span style={{ display:'inline-flex', alignItems:'center', gap:4, padding:'3px 8px', borderRadius:6, fontSize:10, fontWeight:700, letterSpacing:'.04em', background:c.bg, color:c.text }}>
      {children}
    </span>
  )
}

// ── MODAL ─────────────────────────────────────────────────────────────────────
export function Modal({ title, onClose, children, width=480 }) {
  return (
    <div onClick={e => e.target === e.currentTarget && onClose()} style={{ position:'fixed', inset:0, background:'rgba(0,0,0,.75)', zIndex:900, display:'flex', alignItems:'center', justifyContent:'center', animation:'fadeIn .2s ease' }}>
      <div style={{ background:'#0d1320', border:'1px solid rgba(255,255,255,.1)', borderRadius:16, width, maxWidth:'94vw', maxHeight:'88vh', overflow:'auto', animation:'popIn .25s ease' }}>
        <div style={{ padding:'18px 22px', borderBottom:'1px solid rgba(255,255,255,.07)', display:'flex', alignItems:'center', justifyContent:'space-between' }}>
          <span style={{ fontFamily:"'DM Sans',sans-serif", fontWeight:700, fontSize:16, color:'#eef2ff' }}>{title}</span>
          <button onClick={onClose} style={{ width:30, height:30, borderRadius:'50%', border:'1px solid rgba(255,255,255,.1)', background:'rgba(255,255,255,.05)', color:'#8b9cb8', cursor:'pointer', fontSize:16 }}>✕</button>
        </div>
        <div style={{ padding:'20px 22px' }}>{children}</div>
      </div>
    </div>
  )
}

// ── STAT CARD ─────────────────────────────────────────────────────────────────
export function StatCard({ label, value, icon, sub, color='#3b82f6', delay=0 }) {
  return (
    <div className="dash-card" style={{ padding:'18px 20px', animation:'fadeUp .4s ease '+delay+'ms both' }}>
      <div style={{ display:'flex', alignItems:'flex-start', justifyContent:'space-between', marginBottom:12 }}>
        <div style={{ fontSize:11, fontWeight:600, color:'rgba(255,255,255,.4)', letterSpacing:'.06em', textTransform:'uppercase' }}>{label}</div>
        <div style={{ width:34, height:34, borderRadius:9, background:color+'18', display:'flex', alignItems:'center', justifyContent:'center', fontSize:16 }}>{icon}</div>
      </div>
      <div style={{ fontFamily:"'DM Sans',sans-serif", fontSize:24, fontWeight:800, color:'#eef2ff', marginBottom:4 }}>{value}</div>
      {sub && <div style={{ fontSize:11, color:'rgba(255,255,255,.35)' }}>{sub}</div>}
    </div>
  )
}

// ── STARS ─────────────────────────────────────────────────────────────────────
export function Stars({ rating, size=11 }) {
  return (
    <div style={{ display:'flex', gap:1 }}>
      {[1,2,3,4,5].map(s => <span key={s} style={{ fontSize:size, color: s<=Math.round(rating) ? '#f59e0b' : '#ddd' }}>★</span>)}
    </div>
  )
}

// ── LOADING SPINNER ───────────────────────────────────────────────────────────
export function Spinner({ size=24, color='#3b82f6' }) {
  return <div style={{ width:size, height:size, border:'2.5px solid rgba(255,255,255,.1)', borderTopColor:color, borderRadius:'50%', animation:'spin 0.7s linear infinite', flexShrink:0 }} />
}

// ── EMPTY STATE ───────────────────────────────────────────────────────────────
export function EmptyState({ emoji='📦', title, sub, action }) {
  return (
    <div style={{ textAlign:'center', padding:'60px 20px' }}>
      <div style={{ fontSize:56, marginBottom:14 }}>{emoji}</div>
      <div style={{ fontSize:16, fontWeight:700, color:'#eef2ff', fontFamily:"'DM Sans',sans-serif", marginBottom:6 }}>{title}</div>
      {sub && <div style={{ fontSize:13, color:'rgba(255,255,255,.4)', marginBottom:18 }}>{sub}</div>}
      {action}
    </div>
  )
}

// ── DATA TABLE (dashboard) ────────────────────────────────────────────────────
export function Table({ cols, rows, loading }) {
  const tdStyle = { padding:'12px 14px', borderBottom:'1px solid rgba(255,255,255,.04)', fontSize:13, color:'rgba(255,255,255,.6)', verticalAlign:'middle' }
  const thStyle = { padding:'10px 14px', textAlign:'left', fontSize:11, fontWeight:600, color:'rgba(255,255,255,.35)', borderBottom:'1px solid rgba(255,255,255,.07)', letterSpacing:'.05em', textTransform:'uppercase' }
  return (
    <div style={{ overflowX:'auto' }}>
      <table style={{ width:'100%', borderCollapse:'collapse' }}>
        <thead><tr>{cols.map(c => <th key={c} style={thStyle}>{c}</th>)}</tr></thead>
        <tbody>
          {loading
            ? [1,2,3].map(i => <tr key={i}>{cols.map(c => <td key={c} style={tdStyle}><div style={{ height:16, background:'rgba(255,255,255,.06)', borderRadius:4, width:'70%' }} /></td>)}</tr>)
            : rows
          }
        </tbody>
      </table>
    </div>
  )
}
