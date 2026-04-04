import { useState } from 'react'
import toast from 'react-hot-toast'

const PLATFORMS = [
  {id:'instagram',icon:'📸',label:'Instagram',color:'#e1306c'},
  {id:'facebook', icon:'📘',label:'Facebook', color:'#1877f2'},
  {id:'tiktok',   icon:'🎵',label:'TikTok',   color:'#69c9d0'},
  {id:'twitter',  icon:'🐦',label:'Twitter',  color:'#1da1f2'},
  {id:'whatsapp', icon:'💬',label:'WhatsApp', color:'#25d366'},
]

const MOCK_POSTS = [
  {id:1,platform:'instagram',content:'New Ankara collection just dropped!',status:'Published',date:'Mar 14',reach:1240,likes:89},
  {id:2,platform:'facebook', content:'Shea butter sets — buy 2 get 1 free!',status:'Scheduled',date:'Mar 18',reach:0,likes:0},
  {id:3,platform:'tiktok',   content:'How we package orders with love',status:'Draft',date:'',reach:0,likes:0},
]

export default function VendorSocial() {
  const [posts, setPosts]     = useState(MOCK_POSTS)
  const [platform, setPlatform] = useState('instagram')
  const [content, setContent] = useState('')
  const [schedDate, setSchedDate] = useState('')

  const savePost = (status) => {
    if (!content.trim()) { toast.error('Add content first'); return }
    setPosts(p => [{ id: Date.now(), platform, content, status, date: status==='Scheduled'?schedDate:'', reach:0, likes:0 }, ...p])
    setContent('')
    setSchedDate('')
    toast.success(status==='Scheduled' ? 'Post scheduled!' : 'Saved as draft')
  }

  const STATUS_COLOR = { Published:'#10b981', Scheduled:'#3b82f6', Draft:'rgba(255,255,255,.3)' }
  const inp = {width:'100%',padding:'9px 12px',background:'rgba(255,255,255,.06)',border:'1px solid rgba(255,255,255,.1)',borderRadius:8,color:'#eef2ff',fontSize:13,fontFamily:'DM Sans,sans-serif',outline:'none'}

  return (
    <div>
      <div style={{marginBottom:20}}>
        <h2 style={{fontWeight:700,fontSize:18,color:'#eef2ff',margin:0}}>Social Media</h2>
        <div style={{fontSize:12,color:'rgba(255,255,255,.4)',marginTop:2}}>Schedule and publish across all platforms</div>
      </div>

      <div style={{display:'grid',gridTemplateColumns:'1.3fr 1fr',gap:16}}>
        <div>
          <div className="dash-card" style={{padding:20,marginBottom:14}}>
            <div style={{fontWeight:700,fontSize:14,color:'#eef2ff',marginBottom:14}}>Create Post</div>

            <div style={{marginBottom:12}}>
              <div style={{fontSize:11,fontWeight:600,color:'rgba(255,255,255,.45)',letterSpacing:'.05em',textTransform:'uppercase',marginBottom:8}}>Platform</div>
              <div style={{display:'flex',gap:7,flexWrap:'wrap'}}>
                {PLATFORMS.map(pl => (
                  <button key={pl.id} onClick={()=>setPlatform(pl.id)} style={{padding:'6px 13px',border:'1px solid '+(platform===pl.id?pl.color:'rgba(255,255,255,.15)'),borderRadius:99,fontSize:12,cursor:'pointer',background:platform===pl.id?pl.color+'22':'transparent',color:platform===pl.id?pl.color:'rgba(255,255,255,.45)',fontFamily:'DM Sans,sans-serif',transition:'all .18s'}}>
                    {pl.icon} {pl.label}
                  </button>
                ))}
              </div>
            </div>

            <div style={{marginBottom:12}}>
              <div style={{fontSize:11,fontWeight:600,color:'rgba(255,255,255,.45)',letterSpacing:'.05em',textTransform:'uppercase',marginBottom:6}}>Content</div>
              <textarea value={content} onChange={e=>setContent(e.target.value)} rows={5} placeholder="Write your post content here..." style={{...inp,resize:'vertical'}}/>
              <div style={{fontSize:11,color:'rgba(255,255,255,.25)',marginTop:4,textAlign:'right'}}>{content.length} characters</div>
            </div>

            <div style={{marginBottom:16}}>
              <div style={{fontSize:11,fontWeight:600,color:'rgba(255,255,255,.45)',letterSpacing:'.05em',textTransform:'uppercase',marginBottom:6}}>Schedule Date (optional)</div>
              <input type="datetime-local" value={schedDate} onChange={e=>setSchedDate(e.target.value)} style={inp}/>
            </div>

            <div style={{display:'flex',gap:8}}>
              <button onClick={()=>savePost('Draft')} style={{flex:1,padding:'10px',background:'rgba(255,255,255,.05)',border:'1px solid rgba(255,255,255,.1)',borderRadius:8,color:'rgba(255,255,255,.6)',fontSize:13,cursor:'pointer',fontFamily:'DM Sans,sans-serif'}}>Save Draft</button>
              <button onClick={()=>savePost(schedDate?'Scheduled':'Published')} style={{flex:1,padding:'10px',background:'#3b82f6',color:'#fff',border:'none',borderRadius:8,fontSize:13,fontWeight:700,cursor:'pointer'}}>{schedDate?'Schedule':'Post Now'}</button>
            </div>
          </div>

          <div className="dash-card" style={{padding:18}}>
            <div style={{fontWeight:700,fontSize:14,color:'#eef2ff',marginBottom:14}}>Platform Stats</div>
            {[['Instagram','📸',1240,89],['Facebook','📘',820,34],['TikTok','🎵',4200,312],['WhatsApp','💬',214,0]].map(([name,ic,reach,likes]) => (
              <div key={name} style={{display:'flex',alignItems:'center',gap:12,padding:'10px 0',borderBottom:'1px solid rgba(255,255,255,.05)'}}>
                <span style={{fontSize:22}}>{ic}</span>
                <div style={{flex:1}}>
                  <div style={{fontSize:13,fontWeight:600,color:'#eef2ff'}}>{name}</div>
                  <div style={{fontSize:11,color:'rgba(255,255,255,.35)'}}>Reach: {reach.toLocaleString()} {likes>0?'· Likes: '+likes:''}</div>
                </div>
                <button onClick={()=>toast.success('Opening '+name+'...')} style={{padding:'5px 12px',background:'rgba(255,255,255,.06)',border:'1px solid rgba(255,255,255,.1)',borderRadius:6,color:'rgba(255,255,255,.5)',fontSize:11,cursor:'pointer'}}>Connect</button>
              </div>
            ))}
          </div>
        </div>

        <div>
          <div style={{fontWeight:700,fontSize:14,color:'#eef2ff',marginBottom:14}}>Recent Posts</div>
          {posts.map(post => {
            const pl = PLATFORMS.find(p=>p.id===post.platform)
            return (
              <div key={post.id} className="dash-card" style={{padding:14,marginBottom:10,display:'flex',gap:12,alignItems:'flex-start'}}>
                <span style={{fontSize:22,flexShrink:0}}>{pl?.icon||'📱'}</span>
                <div style={{flex:1,minWidth:0}}>
                  <div style={{fontSize:12,color:'rgba(255,255,255,.55)',overflow:'hidden',textOverflow:'ellipsis',whiteSpace:'nowrap',marginBottom:6}}>{post.content}</div>
                  <div style={{display:'flex',gap:10,fontSize:11}}>
                    <span style={{color:STATUS_COLOR[post.status]||'rgba(255,255,255,.3)',fontWeight:600}}>• {post.status}</span>
                    {post.date && <span style={{color:'rgba(255,255,255,.3)'}}>{post.date}</span>}
                    {post.reach > 0 && <span style={{color:'rgba(255,255,255,.3)'}}>Reach: {post.reach.toLocaleString()}</span>}
                  </div>
                </div>
                <button onClick={()=>setPosts(p=>p.filter(x=>x.id!==post.id))} style={{width:22,height:22,borderRadius:'50%',border:'none',background:'rgba(244,63,94,.12)',color:'#f43f5e',cursor:'pointer',fontSize:11,flexShrink:0}}>x</button>
              </div>
            )
          })}
        </div>
      </div>
    </div>
  )
}
