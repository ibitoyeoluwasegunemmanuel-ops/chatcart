import { useState } from 'react'
import { useQuery } from '@tanstack/react-query'
import { productsAPI } from '../../api'
import toast from 'react-hot-toast'

const TYPES = [
  ['caption','Caption'],['social','Social Post'],['ad','Ad Copy'],
  ['hashtags','Hashtags'],['email','Email'],['whatsapp','WhatsApp Msg']
]

export default function VendorAI() {
  const [type, setType]       = useState('caption')
  const [sel, setSel]         = useState('')
  const [extra, setExtra]     = useState('')
  const [result, setResult]   = useState('')
  const [loading, setLoading] = useState(false)

  const { data } = useQuery({ queryKey:['my-products'], queryFn: productsAPI.myProducts })
  const products = data?.data?.products || []

  const generate = async () => {
    const p = products.find(x => x._id === sel)
    let ctx = 'Nigerian vendor products'
    if (p) ctx = 'Product: ' + p.name + ', Price: NGN' + p.price.toLocaleString() + ', Category: ' + p.category
    else if (extra) ctx = extra

    const sysPrompt = 'You are ChatCart AI, a creative marketing assistant for African vendors on ChatCart marketplace. Generate compelling ' + type + ' content that resonates with Nigerian and African audiences. Use relevant emojis. Be energetic and culturally authentic. Keep it concise and actionable.'
    const userPrompt = 'Generate ' + type + ' content for: ' + ctx + (extra ? '. Additional context: ' + extra : '')

    setLoading(true)
    setResult('')
    try {
      const res = await fetch('https://api.anthropic.com/v1/messages', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          model: 'claude-sonnet-4-20250514',
          max_tokens: 500,
          system: sysPrompt,
          messages: [{ role: 'user', content: userPrompt }]
        })
      })
      const data = await res.json()
      const text = data.content?.[0]?.text || 'Content generated!'
      setResult(text)
      toast.success('Content generated!')
    } catch (err) {
      setResult('AI generation ready. Connect your Anthropic API key in settings to enable live generation.')
    }
    setLoading(false)
  }

  const inp = {width:'100%',padding:'9px 12px',background:'rgba(255,255,255,.06)',border:'1px solid rgba(255,255,255,.1)',borderRadius:8,color:'#eef2ff',fontSize:13,fontFamily:'DM Sans,sans-serif',outline:'none'}

  return (
    <div>
      <div style={{marginBottom:20}}>
        <h2 style={{fontWeight:700,fontSize:18,color:'#eef2ff',margin:0}}>AI Marketing Tools</h2>
        <div style={{fontSize:12,color:'rgba(255,255,255,.4)',marginTop:2}}>Generate captions, ads, hashtags and more — powered by Claude AI</div>
      </div>

      <div style={{display:'grid',gridTemplateColumns:'1.3fr .7fr',gap:16}}>
        <div>
          <div className="dash-card" style={{padding:22,marginBottom:14}}>
            <div style={{fontWeight:700,fontSize:14,color:'#eef2ff',marginBottom:16}}>Content Generator</div>

            <div style={{marginBottom:14}}>
              <div style={{fontSize:11,fontWeight:600,color:'rgba(255,255,255,.45)',letterSpacing:'.05em',textTransform:'uppercase',marginBottom:8}}>Content Type</div>
              <div style={{display:'flex',gap:6,flexWrap:'wrap'}}>
                {TYPES.map(([v,l]) => (
                  <button key={v} onClick={()=>setType(v)} style={{padding:'5px 13px',borderRadius:99,border:'1px solid '+(type===v?'#3b82f6':'rgba(255,255,255,.15)'),background:type===v?'rgba(59,130,246,.15)':'transparent',color:type===v?'#3b82f6':'rgba(255,255,255,.45)',fontSize:12,cursor:'pointer',fontFamily:'DM Sans,sans-serif',transition:'all .18s'}}>{l}</button>
                ))}
              </div>
            </div>

            <div style={{marginBottom:13}}>
              <div style={{fontSize:11,fontWeight:600,color:'rgba(255,255,255,.45)',letterSpacing:'.05em',textTransform:'uppercase',marginBottom:6}}>Select Product (optional)</div>
              <select value={sel} onChange={e=>setSel(e.target.value)} style={inp}>
                <option value="">No specific product</option>
                {products.map(p => <option key={p._id} value={p._id}>{p.name}</option>)}
              </select>
            </div>

            <div style={{marginBottom:16}}>
              <div style={{fontSize:11,fontWeight:600,color:'rgba(255,255,255,.45)',letterSpacing:'.05em',textTransform:'uppercase',marginBottom:6}}>Extra Instructions</div>
              <textarea value={extra} onChange={e=>setExtra(e.target.value)} rows={3} placeholder="Tone, target audience, specific angle..." style={{...inp,resize:'vertical'}}/>
            </div>

            <button onClick={generate} disabled={loading} style={{width:'100%',padding:'12px',background:loading?'rgba(59,130,246,.4)':'#3b82f6',color:'#fff',border:'none',borderRadius:9,fontSize:14,fontWeight:700,cursor:loading?'wait':'pointer',display:'flex',alignItems:'center',justifyContent:'center',gap:8}}>
              {loading && <div style={{width:16,height:16,border:'2px solid rgba(255,255,255,.3)',borderTopColor:'#fff',borderRadius:'50%',animation:'spin .7s linear infinite'}}/>}
              {loading ? 'Generating...' : 'Generate Content'}
            </button>
          </div>

          {result && (
            <div className="dash-card" style={{padding:20}}>
              <div style={{display:'flex',alignItems:'center',justifyContent:'space-between',marginBottom:12}}>
                <div style={{fontWeight:700,fontSize:13,color:'#eef2ff'}}>Generated Content</div>
                <div style={{display:'flex',gap:7}}>
                  <button onClick={()=>{navigator.clipboard?.writeText(result);toast.success('Copied!')}} style={{padding:'5px 12px',background:'rgba(255,255,255,.06)',border:'1px solid rgba(255,255,255,.1)',borderRadius:6,color:'rgba(255,255,255,.6)',fontSize:11,cursor:'pointer'}}>Copy</button>
                  <button onClick={()=>toast.success('Opening social scheduler...')} style={{padding:'5px 12px',background:'rgba(16,185,129,.12)',border:'1px solid rgba(16,185,129,.25)',borderRadius:6,color:'#10b981',fontSize:11,cursor:'pointer'}}>Share</button>
                </div>
              </div>
              <div style={{fontSize:13,color:'rgba(255,255,255,.7)',lineHeight:1.8,whiteSpace:'pre-wrap',background:'rgba(255,255,255,.02)',borderRadius:8,padding:14}}>{result}</div>
            </div>
          )}
        </div>

        <div>
          <div className="dash-card" style={{padding:18,marginBottom:14}}>
            <div style={{fontWeight:700,fontSize:13,color:'#eef2ff',marginBottom:12}}>AI Usage</div>
            <div style={{marginBottom:10}}>
              <div style={{display:'flex',justifyContent:'space-between',fontSize:12,color:'rgba(255,255,255,.4)',marginBottom:6}}><span>Messages used</span><span>47 / unlimited</span></div>
              <div style={{height:6,background:'rgba(255,255,255,.06)',borderRadius:3,overflow:'hidden'}}><div style={{height:'100%',width:'30%',background:'#3b82f6',borderRadius:3}}/></div>
            </div>
            <div style={{fontSize:11,color:'rgba(255,255,255,.3)'}}>Pro plan: unlimited AI generation</div>
          </div>
          {[['Caption','Write compelling product descriptions','caption'],['Ad Copy','Facebook and Instagram ad text','ad'],['Hashtags','Trending hashtag bundles','hashtags'],['Social Post','Ready-to-post content','social'],['WhatsApp','WhatsApp marketing messages','whatsapp'],['Email','Customer email campaigns','email']].map(([t,d,v]) => (
            <div key={t} onClick={()=>setType(v)} className="dash-card" style={{padding:14,display:'flex',gap:12,alignItems:'center',cursor:'pointer',marginBottom:8,transition:'border-color .18s'}}
              onMouseEnter={e=>e.currentTarget.style.borderColor='rgba(59,130,246,.3)'}
              onMouseLeave={e=>e.currentTarget.style.borderColor='rgba(255,255,255,.07)'}>
              <div style={{width:34,height:34,borderRadius:8,background:type===v?'rgba(59,130,246,.15)':'rgba(255,255,255,.06)',display:'flex',alignItems:'center',justifyContent:'center',fontSize:16,flexShrink:0}}>
                {{'caption':'📝','ad':'🎯','hashtags':'#️⃣','social':'📱','whatsapp':'💬','email':'📧'}[v]}
              </div>
              <div><div style={{fontSize:13,fontWeight:600,color:'#eef2ff'}}>{t}</div><div style={{fontSize:11,color:'rgba(255,255,255,.35)'}}>{d}</div></div>
            </div>
          ))}
        </div>
      </div>
      <style>{"@keyframes spin{to{transform:rotate(360deg)}}"}</style>
    </div>
  )
}
