import { useState, useEffect, useRef, useCallback } from "react";
import { AreaChart, Area, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, LineChart, Line, PieChart, Pie, Cell } from "recharts";
import { LayoutDashboard, Package, ShoppingCart, Zap, Share2, BarChart2, Settings, LogOut, Menu, X, Plus, Edit2, Trash2, Camera, Upload, Instagram, Facebook, Youtube, Calendar, Clock, Send, Sparkles, TrendingUp, DollarSign, ShoppingBag, AlertCircle, Bell, Search, User, Check, RefreshCw, Eye, Star, ArrowUpRight, ArrowDownRight, Copy, Globe, Target, MessageSquare, Hash, Video, CheckCircle, XCircle, Package2, Wallet, Activity, Cpu, Shield, ChevronLeft, Lock, Mail, Phone, Crown, Users, CreditCard, Mic, FileText, Film, ChevronRight, ChevronDown, AlertTriangle, MessageCircle, GalleryHorizontal, Headphones, PlayCircle, Twitter } from "lucide-react";

// ═══════════════════════════════════════════════════════════════════════════
// DESIGN SYSTEM
// ═══════════════════════════════════════════════════════════════════════════
const GS = `
@import url('https://fonts.googleapis.com/css2?family=Outfit:wght@300;400;500;600;700;800;900&family=DM+Sans:ital,wght@0,300;0,400;0,500;0,600;1,400&family=JetBrains+Mono:wght@400;500&display=swap');
*,*::before,*::after{box-sizing:border-box;margin:0;padding:0}
:root{
--bg:#080c14;--surface:#0d1117;--elevated:#141b27;--card:#0f1624;--hover:#1a2535;
--border:rgba(255,255,255,0.07);--border-s:rgba(255,255,255,0.13);
--tp:#f0f4ff;--ts:#8b9ab5;--tm:#3d4f6b;
--blue:#3b82f6;--blue-s:rgba(59,130,246,0.13);--blue-g:rgba(59,130,246,0.25);
--green:#10b981;--green-s:rgba(16,185,129,0.13);
--amber:#f59e0b;--amber-s:rgba(245,158,11,0.13);
--rose:#f43f5e;--rose-s:rgba(244,63,94,0.13);
--violet:#8b5cf6;--violet-s:rgba(139,92,246,0.13);
--cyan:#06b6d4;--cyan-s:rgba(6,182,212,0.13);
--orange:#f97316;--orange-s:rgba(249,115,22,0.13);
--gold:#eab308;--gold-s:rgba(234,179,8,0.13);
--r:12px;--rsm:8px;--rlg:18px;
--sh:0 4px 24px rgba(0,0,0,0.5);
--tr:all 0.2s cubic-bezier(0.4,0,0.2,1);
}
html,body,#root{height:100%;background:var(--bg);color:var(--tp)}
body{font-family:'DM Sans',sans-serif;font-size:14px;line-height:1.6;overflow:hidden}
h1,h2,h3,h4,h5,h6{font-family:'Outfit',sans-serif}
::-webkit-scrollbar{width:4px;height:4px}
::-webkit-scrollbar-track{background:transparent}
::-webkit-scrollbar-thumb{background:var(--border-s);border-radius:99px}
input,textarea,select,button{font-family:'DM Sans',sans-serif}
button{cursor:pointer}
@keyframes fadeIn{from{opacity:0;transform:translateY(8px)}to{opacity:1;transform:translateY(0)}}
@keyframes fadeInUp{from{opacity:0;transform:translateY(20px)}to{opacity:1;transform:translateY(0)}}
@keyframes scaleIn{from{opacity:0;transform:scale(0.95)}to{opacity:1;transform:scale(1)}}
@keyframes slideLeft{from{opacity:0;transform:translateX(20px)}to{opacity:1;transform:translateX(0)}}
@keyframes spin{from{transform:rotate(0deg)}to{transform:rotate(360deg)}}
@keyframes shimmer{0%{background-position:-200% 0}100%{background-position:200% 0}}
@keyframes pulse{0%,100%{opacity:1}50%{opacity:0.5}}
@keyframes glow{0%,100%{box-shadow:0 0 20px rgba(59,130,246,0.3)}50%{box-shadow:0 0 40px rgba(59,130,246,0.6)}}
@keyframes float{0%,100%{transform:translateY(0)}50%{transform:translateY(-6px)}}
@keyframes countUp{from{opacity:0;transform:translateY(12px)}to{opacity:1;transform:translateY(0)}}
@keyframes borderFlow{0%{background-position:0% 50%}50%{background-position:100% 50%}100%{background-position:0% 50%}}
.ai{animation:fadeIn .35s ease forwards}
.ai-1{animation:fadeIn .35s ease .06s both}
.ai-2{animation:fadeIn .35s ease .12s both}
.ai-3{animation:fadeIn .35s ease .18s both}
.ai-4{animation:fadeIn .35s ease .24s both}
.skel{background:linear-gradient(90deg,var(--elevated) 25%,var(--hover) 50%,var(--elevated) 75%);background-size:200% 100%;animation:shimmer 1.5s infinite;border-radius:var(--rsm)}
.card{background:var(--card);border:1px solid var(--border);border-radius:var(--r);transition:var(--tr)}
.card:hover{border-color:var(--border-s)}
.btn{display:inline-flex;align-items:center;gap:6px;padding:8px 16px;border-radius:var(--rsm);font-size:13px;font-weight:500;border:none;transition:var(--tr);cursor:pointer;white-space:nowrap}
.btn-p{background:var(--blue);color:#fff}
.btn-p:hover{background:#2563eb;box-shadow:0 0 24px rgba(59,130,246,0.45);transform:translateY(-1px)}
.btn-s{background:var(--elevated);color:var(--tp);border:1px solid var(--border-s)}
.btn-s:hover{background:var(--hover);border-color:var(--blue)}
.btn-g{background:transparent;color:var(--ts)}
.btn-g:hover{background:var(--elevated);color:var(--tp)}
.btn-d{background:var(--rose-s);color:var(--rose);border:1px solid rgba(244,63,94,0.2)}
.btn-d:hover{background:var(--rose);color:#fff}
.btn-gold{background:linear-gradient(135deg,#f59e0b,#eab308);color:#000;font-weight:700}
.btn-gold:hover{box-shadow:0 0 24px rgba(234,179,8,0.5);transform:translateY(-1px)}
.btn-sm{padding:5px 12px;font-size:12px}
.btn-lg{padding:12px 24px;font-size:15px}
.btn-ico{padding:7px;border-radius:var(--rsm)}
.badge{display:inline-flex;align-items:center;gap:4px;padding:3px 9px;border-radius:99px;font-size:11px;font-weight:600}
.b-green{background:var(--green-s);color:var(--green)}
.b-blue{background:var(--blue-s);color:var(--blue)}
.b-amber{background:var(--amber-s);color:var(--amber)}
.b-rose{background:var(--rose-s);color:var(--rose)}
.b-violet{background:var(--violet-s);color:var(--violet)}
.b-gray{background:rgba(255,255,255,0.06);color:var(--ts)}
.b-orange{background:var(--orange-s);color:var(--orange)}
.b-cyan{background:var(--cyan-s);color:var(--cyan)}
.b-gold{background:var(--gold-s);color:var(--gold)}
.inp{width:100%;padding:9px 14px;background:var(--elevated);border:1px solid var(--border-s);border-radius:var(--rsm);color:var(--tp);font-size:13px;outline:none;transition:var(--tr)}
.inp:focus{border-color:var(--blue);box-shadow:0 0 0 3px var(--blue-s)}
.inp::placeholder{color:var(--tm)}
.sel{width:100%;padding:9px 14px;background:var(--elevated);border:1px solid var(--border-s);border-radius:var(--rsm);color:var(--tp);font-size:13px;outline:none;transition:var(--tr);cursor:pointer;appearance:none}
.sel:focus{border-color:var(--blue);box-shadow:0 0 0 3px var(--blue-s)}
.lbl{display:block;margin-bottom:6px;font-size:12px;font-weight:500;color:var(--ts)}
.overlay{position:fixed;inset:0;background:rgba(0,0,0,0.75);backdrop-filter:blur(4px);z-index:200;display:flex;align-items:center;justify-content:center;padding:20px;animation:fadeIn .2s ease}
.modal{background:var(--card);border:1px solid var(--border-s);border-radius:var(--rlg);padding:28px;width:100%;max-width:520px;max-height:90vh;overflow-y:auto;animation:scaleIn .25s ease;box-shadow:0 25px 60px rgba(0,0,0,0.7)}
.toast{position:fixed;bottom:24px;right:24px;z-index:300;background:var(--elevated);border:1px solid var(--border-s);border-radius:var(--r);padding:12px 18px;display:flex;align-items:center;gap:10px;font-size:13px;font-weight:500;box-shadow:var(--sh);animation:fadeIn .3s ease;max-width:340px}
.empty{display:flex;flex-direction:column;align-items:center;justify-content:center;padding:60px 20px;color:var(--tm);text-align:center}
.divider{height:1px;background:var(--border);margin:16px 0}
table{width:100%;border-collapse:collapse}
th{padding:11px 15px;text-align:left;font-size:11px;font-weight:600;color:var(--tm);text-transform:uppercase;letter-spacing:.08em;background:var(--elevated);border-bottom:1px solid var(--border)}
td{padding:13px 15px;font-size:13px;color:var(--ts);border-bottom:1px solid var(--border)}
tr:last-child td{border-bottom:none}
tr:hover td{background:rgba(255,255,255,0.02)}
.limit-bar{height:5px;background:var(--elevated);border-radius:99px;overflow:hidden;margin-top:4px}
.limit-fill{height:100%;border-radius:99px;transition:width 1s cubic-bezier(.4,0,.2,1)}
`;

// ═══════════════════════════════════════════════════════════════════════════
// CONSTANTS & DATA
// ═══════════════════════════════════════════════════════════════════════════
const CURRENCIES = { NGN:{s:'₦',n:'Nigerian Naira'}, USD:{s:'$',n:'US Dollar'}, GBP:{s:'£',n:'British Pound'}, EUR:{s:'€',n:'Euro'}, KES:{s:'KSh',n:'Kenyan Shilling'}, GHS:{s:'₵',n:'Ghanaian Cedi'} };
const fmt = (v, c='NGN') => `${CURRENCIES[c]?.s||'₦'}${Number(v).toLocaleString()}`;

const PLANS = {
  free:     { name:'Free',     price:0,   color:'var(--ts)',   icon:'🆓', products:5,   aiMsg:20,  posts:3,   scripts:3,  videos:2, analytics:'basic',    whatsapp:false, noWatermark:false, team:false },
  starter:  { name:'Starter',  price:10,  color:'var(--blue)', icon:'⚡', products:50,  aiMsg:200, posts:30,  scripts:30, videos:10, analytics:'standard', whatsapp:false, noWatermark:true,  team:false },
  pro:      { name:'Pro',      price:30,  color:'var(--violet)',icon:'🔥', products:999, aiMsg:999, posts:999, scripts:999,videos:999,analytics:'advanced', whatsapp:true,  noWatermark:true,  team:false },
  business: { name:'Business', price:69,  color:'var(--gold)', icon:'👑', products:999, aiMsg:999, posts:999, scripts:999,videos:999,analytics:'advanced', whatsapp:true,  noWatermark:true,  team:true  },
};

const ORDER_STATUSES = ['Pending','Awaiting Payment','Payment Uploaded','Payment Confirmed','Processing','Shipped','Delivered','Cancelled'];
const STATUS_CONFIG = {
  'Pending':            { badge:'b-gray',   icon:Clock },
  'Awaiting Payment':   { badge:'b-amber',  icon:CreditCard },
  'Payment Uploaded':   { badge:'b-violet', icon:Upload },
  'Payment Confirmed':  { badge:'b-cyan',   icon:CheckCircle },
  'Processing':         { badge:'b-blue',   icon:RefreshCw },
  'Shipped':            { badge:'b-orange', icon:Package2 },
  'Delivered':          { badge:'b-green',  icon:CheckCircle },
  'Cancelled':          { badge:'b-rose',   icon:XCircle },
};

const SALES_DATA = [
  {month:'Oct',revenue:42000,orders:18},{month:'Nov',revenue:58000,orders:24},
  {month:'Dec',revenue:95000,orders:41},{month:'Jan',revenue:71000,orders:32},
  {month:'Feb',revenue:83000,orders:38},{month:'Mar',revenue:102000,orders:47},
];

const INIT_PRODUCTS = [
  {id:'p1',name:'Ankara Print Dress',desc:'Beautiful handcrafted ankara fabric, perfect for all occasions.',price:15000,currency:'NGN',stock:24,category:'Fashion',image:null,createdAt:'2024-01-15',rating:4.8},
  {id:'p2',name:'Pure Shea Butter Set',desc:'100% organic shea butter for skin and hair care.',price:8500,currency:'NGN',stock:52,category:'Beauty',image:null,createdAt:'2024-01-22',rating:4.6},
  {id:'p3',name:'Handwoven Basket',desc:'Traditional raffia basket, artisan made.',price:4200,currency:'NGN',stock:15,category:'Home & Living',image:null,createdAt:'2024-02-01',rating:4.9},
  {id:'p4',name:'Beaded Necklace Set',desc:'Elegant beaded necklace with matching earrings.',price:6800,currency:'NGN',stock:38,category:'Jewelry',image:null,createdAt:'2024-02-10',rating:4.7},
  {id:'p5',name:'Agbada Senator Set',desc:'Premium senator outfit for men, custom tailored.',price:28000,currency:'NGN',stock:10,category:'Fashion',image:null,createdAt:'2024-03-01',rating:4.9},
];

const INIT_ORDERS = [
  {id:'ORD-0041',customer:'Amara Okafor',email:'amara@email.com',product:'Ankara Print Dress',qty:2,total:30000,status:'Delivered',date:'2024-03-01',currency:'NGN',paymentProof:null,paymentMethod:'Manual Transfer',bank:'Access Bank',acct:'0123456789'},
  {id:'ORD-0042',customer:'Chisom Eze',email:'chisom@email.com',product:'Shea Butter Set',qty:1,total:8500,status:'Payment Uploaded',date:'2024-03-03',currency:'NGN',paymentProof:'proof',paymentMethod:'Manual Transfer',bank:'GTBank',acct:'9876543210'},
  {id:'ORD-0043',customer:'Funmi Adeyemi',email:'funmi@email.com',product:'Beaded Necklace Set',qty:3,total:20400,status:'Pending',date:'2024-03-04',currency:'NGN',paymentProof:null,paymentMethod:'Manual Transfer',bank:'',acct:''},
  {id:'ORD-0044',customer:'Ngozi Obi',email:'ngozi@email.com',product:'Handwoven Basket',qty:1,total:4200,status:'Shipped',date:'2024-03-05',currency:'NGN',paymentProof:null,paymentMethod:'Manual Transfer',bank:'Zenith Bank',acct:'1122334455'},
  {id:'ORD-0045',customer:'Tunde Bello',email:'tunde@email.com',product:'Ankara Print Dress',qty:1,total:15000,status:'Awaiting Payment',date:'2024-03-05',currency:'NGN',paymentProof:null,paymentMethod:'Manual Transfer',bank:'',acct:''},
];

const INIT_POSTS = [
  {id:'sp1',content:'🌟 New arrivals just dropped! Stunning Ankara Print Dresses. Shop now! #AnkaraFashion #AfricanStyle',platform:'Instagram',status:'Published',scheduledAt:'2024-03-01 10:00',type:'Product Promo'},
  {id:'sp2',content:'Glow up with our Pure Shea Butter Set 🧴✨ 100% organic. Limited stock!',platform:'Facebook',status:'Scheduled',scheduledAt:'2024-03-08 14:00',type:'Product Promo'},
];

const INIT_SCRIPTS = [
  {id:'sc1',title:'Shea Butter Product Review',content:'Hey everyone! Today I\'m reviewing the most amazing organic shea butter set...',duration:'2:30',platform:'TikTok',status:'Ready',createdAt:'2024-03-01'},
  {id:'sc2',title:'5 Nigerian Fashion Tips',content:'In this video, I\'m sharing 5 incredible fashion tips using traditional Ankara fabric...',duration:'5:00',platform:'YouTube',status:'Draft',createdAt:'2024-03-03'},
];

const ADMIN_USERS = [
  {id:'u1',name:'Adaeze Vendor',email:'adaeze@chatcart.ng',role:'vendor',plan:'pro',status:'active',joined:'2024-01-15',revenue:102000},
  {id:'u2',name:'Emeka Creator',email:'emeka@chatcart.ng',role:'creator',plan:'starter',status:'active',joined:'2024-02-01',revenue:0},
  {id:'u3',name:'Bisi Shop',email:'bisi@chatcart.ng',role:'vendor',plan:'free',status:'active',joined:'2024-02-20',revenue:15000},
  {id:'u4',name:'Kola Films',email:'kola@chatcart.ng',role:'creator',plan:'business',status:'suspended',joined:'2024-03-01',revenue:0},
  {id:'u5',name:'Ngozi Fashion',email:'ngozi@chatcart.ng',role:'vendor',plan:'starter',status:'active',joined:'2024-03-05',revenue:47000},
];

// ═══════════════════════════════════════════════════════════════════════════
// HOOKS & UTILS
// ═══════════════════════════════════════════════════════════════════════════
const useToast = () => {
  const [t, setT] = useState(null);
  const show = useCallback((msg, type='success') => { setT({msg,type}); setTimeout(()=>setT(null),3200); }, []);
  return { toast:t, show };
};

const usePlan = (plan) => ({
  canAddProduct: (count) => plan==='free' ? count < PLANS.free.products : true,
  canAI: (used) => plan==='free' ? used < PLANS.free.aiMsg : true,
  canPost: (used) => plan==='free' ? used < PLANS.free.posts : true,
  hasWhatsApp: PLANS[plan]?.whatsapp,
  hasAdvancedAnalytics: ['pro','business'].includes(plan),
  isTeam: plan==='business',
});

// ═══════════════════════════════════════════════════════════════════════════
// REUSABLE COMPONENTS
// ═══════════════════════════════════════════════════════════════════════════
function Toast({toast}) {
  if (!toast) return null;
  return (
    <div className={`toast ${toast.type==='error'?'border-rose':''}`} style={{borderColor:toast.type==='error'?'var(--rose)':toast.type==='warn'?'var(--amber)':'var(--green)'}}>
      {toast.type==='success'?<CheckCircle size={15} color="var(--green)"/>:toast.type==='warn'?<AlertTriangle size={15} color="var(--amber)"/>:<XCircle size={15} color="var(--rose)"/>}
      <span style={{color:'var(--tp)'}}>{toast.msg}</span>
    </div>
  );
}

function UpgradeBanner({feature, plan, onUpgrade}) {
  return (
    <div style={{background:'linear-gradient(135deg,rgba(234,179,8,0.1),rgba(245,158,11,0.08))',border:'1px solid rgba(234,179,8,0.25)',borderRadius:'var(--r)',padding:'14px 18px',display:'flex',alignItems:'center',justifyContent:'space-between',gap:12,marginBottom:16}}>
      <div style={{display:'flex',alignItems:'center',gap:10}}>
        <Crown size={16} color="var(--gold)"/>
        <div>
          <div style={{fontSize:13,fontWeight:600,color:'var(--tp)'}}>{feature} requires a paid plan</div>
          <div style={{fontSize:12,color:'var(--ts)'}}>You're on the Free plan · Upgrade to unlock unlimited access</div>
        </div>
      </div>
      <button className="btn btn-gold btn-sm" onClick={onUpgrade} style={{flexShrink:0}}><Crown size={12}/>Upgrade</button>
    </div>
  );
}

function LimitBar({used, max, label, color='var(--blue)'}) {
  const pct = Math.min((used/max)*100, 100);
  const isHigh = pct > 80;
  return (
    <div style={{marginBottom:10}}>
      <div style={{display:'flex',justifyContent:'space-between',marginBottom:4}}>
        <span style={{fontSize:12,color:'var(--ts)'}}>{label}</span>
        <span style={{fontSize:12,fontFamily:'JetBrains Mono',color:isHigh?'var(--rose)':'var(--ts)'}}>{used}/{max}</span>
      </div>
      <div className="limit-bar">
        <div className="limit-fill" style={{width:`${pct}%`,background:isHigh?'var(--rose)':color}}/>
      </div>
    </div>
  );
}

function StatCard({label,value,icon:Icon,change,color,delay=0}) {
  const pos = change>=0;
  return (
    <div className="card" style={{padding:20,animation:`fadeIn .4s ease ${delay}ms both`,position:'relative',overflow:'hidden'}}>
      <div style={{position:'absolute',top:0,left:0,right:0,height:2,background:`linear-gradient(90deg,transparent,${color},transparent)`,opacity:0.6}}/>
      <div style={{display:'flex',alignItems:'flex-start',justifyContent:'space-between',marginBottom:14}}>
        <div style={{width:38,height:38,borderRadius:9,background:`${color}1e`,display:'flex',alignItems:'center',justifyContent:'center'}}>
          <Icon size={17} color={color}/>
        </div>
        <span style={{fontSize:11,fontWeight:600,color:pos?'var(--green)':'var(--rose)',background:pos?'var(--green-s)':'var(--rose-s)',padding:'2px 8px',borderRadius:99,display:'flex',alignItems:'center',gap:3}}>
          {pos?<ArrowUpRight size={10}/>:<ArrowDownRight size={10}/>}{Math.abs(change)}%
        </span>
      </div>
      <div style={{fontSize:22,fontWeight:800,fontFamily:'Outfit',color:'var(--tp)',letterSpacing:'-0.02em'}}>{value}</div>
      <div style={{fontSize:12,color:'var(--tm)',marginTop:3}}>{label}</div>
    </div>
  );
}

function PageHeader({title,subtitle,children}) {
  return (
    <div style={{display:'flex',alignItems:'center',justifyContent:'space-between',marginBottom:22}} className="ai">
      <div>
        <div style={{fontFamily:'Outfit',fontSize:20,fontWeight:700,color:'var(--tp)'}}>{title}</div>
        {subtitle&&<div style={{fontSize:12,color:'var(--tm)',marginTop:2}}>{subtitle}</div>}
      </div>
      <div style={{display:'flex',gap:8,alignItems:'center'}}>{children}</div>
    </div>
  );
}

function ChartTooltip({active,payload,label,currency='NGN'}) {
  if(!active||!payload?.length) return null;
  return (
    <div style={{background:'var(--elevated)',border:'1px solid var(--border-s)',borderRadius:8,padding:'10px 14px'}}>
      <p style={{fontSize:11,color:'var(--tm)',marginBottom:6}}>{label}</p>
      {payload.map((p,i)=>(
        <p key={i} style={{fontSize:13,fontWeight:600,color:p.color}}>
          {p.name==='revenue'?fmt(p.value,currency):p.value} {p.name!=='revenue'&&p.name}
        </p>
      ))}
    </div>
  );
}

// ═══════════════════════════════════════════════════════════════════════════
// ONBOARDING / LANDING
// ═══════════════════════════════════════════════════════════════════════════
function OnboardingScreen({onComplete}) {
  const [step, setStep] = useState('welcome'); // welcome | role | plan | final
  const [role, setRole] = useState(null);
  const [plan, setPlan] = useState('free');
  const [form, setForm] = useState({name:'',email:'',password:'',country:'Nigeria',currency:'NGN'});

  const ROLES = [
    {id:'vendor',icon:'🛒',title:'Vendor',subtitle:'Sell products online',desc:'Manage your store, automate marketing, handle orders with AI-powered tools',color:'var(--blue)',features:['Product Management','Order Tracking','WhatsApp AI Sales Bot','Social Media Automation']},
    {id:'creator',icon:'🎬',title:'Content Creator',subtitle:'Faceless content automation',desc:'Generate scripts, voiceovers, and videos with AI for any niche',color:'var(--violet)',features:['AI Script Generator','Voiceover & Video AI','Multi-platform Scheduling','Analytics Dashboard']},
    {id:'admin',icon:'⚙️',title:'Admin',subtitle:'Platform management',desc:'Access the super admin panel to manage all users and platform operations',color:'var(--amber)',features:['User Management','Subscription Control','Revenue Analytics','Platform Monitoring']},
  ];

  const planList = Object.entries(PLANS).filter(([k])=>k!=='free'||(role&&k==='free'));

  if (step==='welcome') return (
    <div style={{minHeight:'100vh',background:'var(--bg)',position:'relative',overflowY:'auto'}}>
      {/* Ambient glow */}
      <div style={{position:'fixed',top:'15%',left:'5%',width:500,height:500,borderRadius:'50%',background:'radial-gradient(circle,rgba(59,130,246,0.07),transparent 70%)',pointerEvents:'none'}}/>
      <div style={{position:'fixed',bottom:'10%',right:'5%',width:450,height:450,borderRadius:'50%',background:'radial-gradient(circle,rgba(139,92,246,0.07),transparent 70%)',pointerEvents:'none'}}/>

      {/* Navbar */}
      <nav style={{position:'sticky',top:0,zIndex:10,background:'rgba(8,12,20,0.85)',backdropFilter:'blur(12px)',borderBottom:'1px solid var(--border)',padding:'0 40px',height:60,display:'flex',alignItems:'center',justifyContent:'space-between'}}>
        <div style={{display:'flex',alignItems:'center',gap:10}}>
          <div style={{width:32,height:32,borderRadius:9,background:'linear-gradient(135deg,var(--blue),var(--violet))',display:'flex',alignItems:'center',justifyContent:'center'}}><ShoppingBag size={15} color="#fff"/></div>
          <span style={{fontFamily:'Outfit',fontWeight:900,fontSize:17,letterSpacing:'-0.02em',color:'var(--tp)'}}>ChatCart</span>
        </div>
        <div style={{display:'flex',gap:8}}>
          <button className="btn btn-g btn-sm" onClick={()=>setStep('role')}>Sign In</button>
          <button className="btn btn-p btn-sm" onClick={()=>setStep('role')}>Get Started Free</button>
        </div>
      </nav>

      {/* Hero */}
      <div style={{maxWidth:700,margin:'0 auto',textAlign:'center',padding:'80px 24px 60px',animation:'fadeInUp .6s ease'}}>
        <div style={{display:'inline-flex',alignItems:'center',gap:8,background:'var(--blue-s)',border:'1px solid rgba(59,130,246,0.25)',borderRadius:99,padding:'5px 14px',marginBottom:24,fontSize:12,fontWeight:600,color:'var(--blue)'}}>
          <Sparkles size={12}/>AI-Powered Commerce Platform · Now Live
        </div>
        <h1 style={{fontFamily:'Outfit',fontSize:52,fontWeight:900,letterSpacing:'-0.03em',lineHeight:1.08,marginBottom:20}}>
          <span style={{color:'var(--tp)'}}>Automate Your<br/></span>
          <span style={{background:'linear-gradient(135deg,var(--blue) 0%,var(--violet) 100%)',WebkitBackgroundClip:'text',WebkitTextFillColor:'transparent'}}>Entire Business</span>
        </h1>
        <p style={{fontSize:17,color:'var(--ts)',lineHeight:1.7,marginBottom:36,maxWidth:520,margin:'0 auto 36px'}}>
          Sell products, automate WhatsApp sales, schedule social media, and create faceless content — all powered by AI.
        </p>
        <div style={{display:'flex',gap:12,justifyContent:'center',flexWrap:'wrap',marginBottom:48}}>
          <button className="btn btn-p btn-lg" onClick={()=>setStep('role')} style={{fontSize:15,padding:'13px 32px',boxShadow:'0 0 32px rgba(59,130,246,0.35)'}}>
            Start Free — No Credit Card <ChevronRight size={16}/>
          </button>
          <button className="btn btn-s btn-lg" onClick={()=>setStep('role')} style={{fontSize:15,padding:'13px 28px'}}>
            View Demo
          </button>
        </div>
        <div style={{display:'flex',gap:28,justifyContent:'center',flexWrap:'wrap'}}>
          {[['5,000+','Active Vendors'],['2M+','Products Listed'],['98%','Uptime SLA'],['50+','Countries']].map(([v,l])=>(
            <div key={l} style={{textAlign:'center'}}>
              <div style={{fontFamily:'Outfit',fontWeight:800,fontSize:22,color:'var(--tp)'}}>{v}</div>
              <div style={{fontSize:11,color:'var(--tm)'}}>{l}</div>
            </div>
          ))}
        </div>
      </div>

      {/* Features Grid */}
      <div style={{maxWidth:960,margin:'0 auto',padding:'0 24px 80px'}}>
        <div style={{textAlign:'center',marginBottom:48}}>
          <div style={{fontFamily:'Outfit',fontWeight:800,fontSize:32,color:'var(--tp)',marginBottom:10}}>Everything You Need to Grow</div>
          <div style={{fontSize:15,color:'var(--ts)'}}>One platform — vendor automation + faceless content creation</div>
        </div>
        <div style={{display:'grid',gridTemplateColumns:'repeat(3,1fr)',gap:16,marginBottom:60}}>
          {[
            {icon:'🛒',title:'Vendor Platform',desc:'Upload products, manage orders, accept manual payments, and automate marketing.',color:'var(--blue)'},
            {icon:'💬',title:'WhatsApp AI Bot',desc:'Customers message your WhatsApp — AI replies, shows products, and closes sales 24/7.',color:'var(--green)'},
            {icon:'📱',title:'Social Media AI',desc:'Generate captions, hashtags, schedule posts to Instagram, TikTok, Facebook & YouTube.',color:'var(--violet)'},
            {icon:'🎬',title:'Faceless Content',desc:'Generate AI scripts, voiceovers, and videos for any niche without showing your face.',color:'var(--rose)'},
            {icon:'💳',title:'Manual Payments',desc:'Accept bank transfers with payment proof uploads. Confirm with one click.',color:'var(--amber)'},
            {icon:'📊',title:'Smart Analytics',desc:'Track revenue, orders, social performance, and AI usage from one dashboard.',color:'var(--cyan)'},
          ].map((f,i)=>(
            <div key={i} className="card" style={{padding:22,animation:`fadeIn .4s ease ${i*60}ms both`}}>
              <div style={{fontSize:28,marginBottom:12}}>{f.icon}</div>
              <div style={{fontFamily:'Outfit',fontWeight:700,fontSize:15,color:'var(--tp)',marginBottom:6}}>{f.title}</div>
              <div style={{fontSize:13,color:'var(--ts)',lineHeight:1.65}}>{f.desc}</div>
            </div>
          ))}
        </div>

        {/* Pricing Section */}
        <div style={{textAlign:'center',marginBottom:40}}>
          <div style={{fontFamily:'Outfit',fontWeight:800,fontSize:32,color:'var(--tp)',marginBottom:10}}>Simple, Transparent Pricing</div>
          <div style={{fontSize:15,color:'var(--ts)'}}>Start free. Upgrade when you're ready.</div>
        </div>
        <div style={{display:'grid',gridTemplateColumns:'repeat(4,1fr)',gap:14,marginBottom:60}}>
          {Object.entries(PLANS).map(([key,p],i)=>{
            const isPopular=key==='pro';
            const colMap={free:'var(--tm)',starter:'var(--blue)',pro:'var(--violet)',business:'var(--gold)'};
            const borderCol=colMap[key];
            return (
              <div key={key} style={{position:'relative',background:isPopular?'var(--elevated)':'var(--card)',border:`2px solid ${isPopular?'var(--violet)':'var(--border)'}`,borderRadius:'var(--rlg)',padding:'24px 20px',transition:'var(--tr)'}}>
                {isPopular&&<div style={{position:'absolute',top:-11,left:'50%',transform:'translateX(-50%)',background:'var(--violet)',color:'#fff',fontSize:10,fontWeight:700,padding:'4px 14px',borderRadius:99,whiteSpace:'nowrap',letterSpacing:'0.05em'}}>MOST POPULAR</div>}
                <div style={{fontSize:24,marginBottom:10}}>{p.icon}</div>
                <div style={{fontFamily:'Outfit',fontWeight:700,fontSize:16,color:'var(--tp)',marginBottom:6}}>{p.name}</div>
                <div style={{fontFamily:'Outfit',fontWeight:900,fontSize:30,color:'var(--tp)',marginBottom:4,letterSpacing:'-0.02em'}}>
                  {p.price===0?'Free':`$${p.price}`}
                  {p.price>0&&<span style={{fontSize:14,color:'var(--ts)',fontWeight:400}}>/mo</span>}
                </div>
                <div style={{fontSize:11,color:'var(--tm)',marginBottom:16}}>{p.price===0?'Forever free':'Billed monthly'}</div>
                <div className="divider"/>
                {[
                  {t:`${p.products>=999?'Unlimited':p.products} products`,ok:true},
                  {t:`${p.aiMsg>=999?'Unlimited':p.aiMsg} AI messages/day`,ok:true},
                  {t:`${p.posts>=999?'Unlimited':p.posts} posts/week`,ok:true},
                  {t:'WhatsApp AI bot',ok:p.whatsapp},
                  {t:'No watermark',ok:p.noWatermark},
                  {t:'Team accounts',ok:p.team},
                ].map((f,fi)=>(
                  <div key={fi} style={{display:'flex',alignItems:'center',gap:7,fontSize:12,color:f.ok?'var(--ts)':'var(--tm)',marginBottom:7,opacity:f.ok?1:0.5}}>
                    {f.ok?<Check size={12} color="var(--green)"/>:<X size={12} color="var(--tm)"/>}{f.t}
                  </div>
                ))}
                <button className={`btn btn-lg ${isPopular?'btn-p':'btn-s'}`} onClick={()=>{setPlan(key);setStep('role')}} style={{width:'100%',justifyContent:'center',marginTop:16,fontSize:13}}>
                  {p.price===0?'Start Free':'Get Started'}
                </button>
              </div>
            );
          })}
        </div>

        {/* Platform split CTA */}
        <div style={{display:'grid',gridTemplateColumns:'1fr 1fr',gap:16}}>
          {[
            {icon:'🛒',title:'For Vendors',subtitle:'Sell products with AI automation',color:'var(--blue)',features:['Product catalog management','WhatsApp AI sales bot','Order & payment tracking','Social media automation']},
            {icon:'🎬',title:'For Content Creators',subtitle:'Faceless content at scale',color:'var(--violet)',features:['AI script generator','Voiceover & video AI','Multi-platform scheduler','Analytics dashboard']},
          ].map((c,i)=>(
            <div key={i} style={{background:'var(--card)',border:`1px solid var(--border)`,borderRadius:'var(--rlg)',padding:'28px 28px',transition:'var(--tr)'}}
              onMouseEnter={e=>{e.currentTarget.style.borderColor=c.color;e.currentTarget.style.background='var(--elevated)'}}
              onMouseLeave={e=>{e.currentTarget.style.borderColor='var(--border)';e.currentTarget.style.background='var(--card)'}}
            >
              <div style={{fontSize:36,marginBottom:14}}>{c.icon}</div>
              <div style={{fontFamily:'Outfit',fontWeight:800,fontSize:20,color:'var(--tp)',marginBottom:4}}>{c.title}</div>
              <div style={{fontSize:13,color:'var(--ts)',marginBottom:18}}>{c.subtitle}</div>
              {c.features.map(f=><div key={f} style={{display:'flex',alignItems:'center',gap:8,fontSize:13,color:'var(--ts)',marginBottom:9}}><Check size={13} color="var(--green)"/>{f}</div>)}
              <button className="btn btn-p" onClick={()=>setStep('role')} style={{marginTop:16,background:c.color}}>{c.title.split(' ')[1]} Dashboard <ChevronRight size={13}/></button>
            </div>
          ))}
        </div>
      </div>

      {/* Footer */}
      <div style={{borderTop:'1px solid var(--border)',padding:'24px 40px',display:'flex',alignItems:'center',justifyContent:'space-between',background:'var(--surface)'}}>
        <div style={{display:'flex',alignItems:'center',gap:8}}>
          <div style={{width:24,height:24,borderRadius:6,background:'linear-gradient(135deg,var(--blue),var(--violet))',display:'flex',alignItems:'center',justifyContent:'center'}}><ShoppingBag size={12} color="#fff"/></div>
          <span style={{fontFamily:'Outfit',fontWeight:700,fontSize:13,color:'var(--tp)'}}>ChatCart</span>
          <span style={{fontSize:12,color:'var(--tm)'}}> © 2025 · All rights reserved</span>
        </div>
        <div style={{display:'flex',gap:20}}>
          {['Privacy Policy','Terms of Service','Support'].map(l=><span key={l} style={{fontSize:12,color:'var(--tm)',cursor:'pointer'}}>{l}</span>)}
        </div>
      </div>
    </div>
  );

  if (step==='role') return (
    <div style={{minHeight:'100vh',display:'flex',alignItems:'center',justifyContent:'center',background:'var(--bg)',padding:24}}>
      <div style={{maxWidth:800,width:'100%',animation:'fadeInUp .5s ease'}}>
        <div style={{textAlign:'center',marginBottom:12}}>
          <div style={{display:'flex',alignItems:'center',justifyContent:'center',gap:8,marginBottom:20}}>
            <div style={{width:28,height:28,borderRadius:7,background:'linear-gradient(135deg,var(--blue),var(--violet))',display:'flex',alignItems:'center',justifyContent:'center'}}><ShoppingBag size={13} color="#fff"/></div>
            <span style={{fontFamily:'Outfit',fontWeight:800,fontSize:15,color:'var(--tp)'}}>ChatCart</span>
          </div>
          <div style={{fontFamily:'Outfit',fontWeight:800,fontSize:30,color:'var(--tp)',marginBottom:8}}>How will you use ChatCart?</div>
          <div style={{fontSize:14,color:'var(--ts)'}}>Choose your role — both have separate dashboards and toolsets</div>
        </div>
        {/* Progress */}
        <div style={{display:'flex',alignItems:'center',justifyContent:'center',gap:8,marginBottom:36}}>
          {['Choose Role','Pick Plan','Create Account'].map((s,i)=>(
            <div key={s} style={{display:'flex',alignItems:'center',gap:8}}>
              <div style={{display:'flex',alignItems:'center',gap:6}}>
                <div style={{width:22,height:22,borderRadius:'50%',background:i===0?'var(--blue)':'var(--elevated)',border:`2px solid ${i===0?'var(--blue)':'var(--border)'}`,display:'flex',alignItems:'center',justifyContent:'center',fontSize:10,fontWeight:700,color:i===0?'#fff':'var(--tm)'}}>{i+1}</div>
                <span style={{fontSize:12,color:i===0?'var(--tp)':'var(--tm)',fontWeight:i===0?600:400}}>{s}</span>
              </div>
              {i<2&&<div style={{width:32,height:1,background:'var(--border)'}}/>}
            </div>
          ))}
        </div>
        <div style={{display:'grid',gridTemplateColumns:'repeat(3,1fr)',gap:16,marginBottom:28}}>
          {ROLES.map(r=>(
            <div key={r.id} onClick={()=>setRole(r.id)} style={{
              background:role===r.id?'var(--elevated)':'var(--card)',
              border:`2px solid ${role===r.id?r.color:'var(--border)'}`,
              borderRadius:'var(--rlg)',padding:26,cursor:'pointer',transition:'var(--tr)',
            }}
            onMouseEnter={e=>{if(role!==r.id){e.currentTarget.style.borderColor='var(--border-s)';e.currentTarget.style.background='var(--elevated)';}}}
            onMouseLeave={e=>{if(role!==r.id){e.currentTarget.style.borderColor='var(--border)';e.currentTarget.style.background='var(--card)';}}}
            >
              <div style={{fontSize:40,marginBottom:14,display:'block'}}>{r.icon}</div>
              <div style={{fontFamily:'Outfit',fontWeight:700,fontSize:18,color:'var(--tp)',marginBottom:4}}>{r.title}</div>
              <div style={{fontSize:12,color:'var(--ts)',marginBottom:13,fontWeight:500}}>{r.subtitle}</div>
              <div style={{height:1,background:'var(--border)',marginBottom:13}}/>
              {r.features.map(f=>(
                <div key={f} style={{display:'flex',alignItems:'center',gap:7,fontSize:12,color:'var(--ts)',marginBottom:7}}>
                  <Check size={11} color={r.color}/>{f}
                </div>
              ))}
              {role===r.id&&(
                <div style={{marginTop:14,display:'flex',alignItems:'center',gap:6,fontSize:12,fontWeight:600,color:r.color,borderTop:'1px solid var(--border)',paddingTop:12}}>
                  <CheckCircle size={13}/>Selected
                </div>
              )}
            </div>
          ))}
        </div>
        <div style={{display:'flex',justifyContent:'space-between',alignItems:'center'}}>
          <button className="btn btn-g" onClick={()=>setStep('welcome')}><ChevronLeft size={14}/>Back to Home</button>
          <button className="btn btn-p btn-lg" onClick={()=>role&&setStep(role==='admin'?'final':'plan')} style={{opacity:role?1:0.45,padding:'10px 30px',cursor:role?'pointer':'not-allowed'}}>
            Continue <ChevronRight size={15}/>
          </button>
        </div>
        {!role&&<div style={{textAlign:'center',marginTop:12,fontSize:12,color:'var(--tm)'}}>Select a role above to continue</div>}
      </div>
    </div>
  );

  if (step==='plan') return (
    <div style={{minHeight:'100vh',background:'var(--bg)',padding:'40px 24px',overflowY:'auto'}}>
      <div style={{maxWidth:960,margin:'0 auto',animation:'fadeInUp .5s ease'}}>
        <div style={{textAlign:'center',marginBottom:12}}>
          <div style={{display:'flex',alignItems:'center',justifyContent:'center',gap:8,marginBottom:20}}>
            <div style={{width:28,height:28,borderRadius:7,background:'linear-gradient(135deg,var(--blue),var(--violet))',display:'flex',alignItems:'center',justifyContent:'center'}}><ShoppingBag size={13} color="#fff"/></div>
            <span style={{fontFamily:'Outfit',fontWeight:800,fontSize:15,color:'var(--tp)'}}>ChatCart</span>
          </div>
          {/* Progress */}
          <div style={{display:'flex',alignItems:'center',justifyContent:'center',gap:8,marginBottom:32}}>
            {['Choose Role','Pick Plan','Create Account'].map((s,i)=>(
              <div key={s} style={{display:'flex',alignItems:'center',gap:8}}>
                <div style={{display:'flex',alignItems:'center',gap:6}}>
                  <div style={{width:22,height:22,borderRadius:'50%',background:i===0?'var(--green)':i===1?'var(--blue)':'var(--elevated)',border:`2px solid ${i<=1?i===0?'var(--green)':'var(--blue)':'var(--border)'}`,display:'flex',alignItems:'center',justifyContent:'center',fontSize:10,fontWeight:700,color:i<=1?'#fff':'var(--tm)'}}>
                    {i===0?<Check size={11}/>:i+1}
                  </div>
                  <span style={{fontSize:12,color:i===1?'var(--tp)':i===0?'var(--green)':'var(--tm)',fontWeight:i<=1?600:400}}>{s}</span>
                </div>
                {i<2&&<div style={{width:32,height:1,background:i===0?'var(--green)':'var(--border)'}}/>}
              </div>
            ))}
          </div>
          <div style={{fontFamily:'Outfit',fontWeight:800,fontSize:30,color:'var(--tp)',marginBottom:8}}>Choose Your Plan</div>
          <div style={{fontSize:14,color:'var(--ts)',marginBottom:36}}>Start free, upgrade anytime · No credit card required to start</div>
        </div>
        <div style={{display:'grid',gridTemplateColumns:'repeat(4,1fr)',gap:14,marginBottom:32}}>
          {Object.entries(PLANS).map(([key,p])=>{
            const isPopular=key==='pro';
            const borderCol={free:'var(--border-s)',starter:'var(--blue)',pro:'var(--violet)',business:'var(--gold)'}[key];
            const sel=plan===key;
            return (
              <div key={key} onClick={()=>setPlan(key)} style={{
                position:'relative',cursor:'pointer',transition:'var(--tr)',
                background:sel?'var(--elevated)':'var(--card)',
                border:`2px solid ${sel?borderCol:'var(--border)'}`,
                borderRadius:'var(--rlg)',padding:'24px 18px',
                transform:isPopular?'scale(1.02)':'scale(1)',
              }}
              onMouseEnter={e=>{if(!sel)e.currentTarget.style.borderColor=borderCol}}
              onMouseLeave={e=>{if(!sel)e.currentTarget.style.borderColor='var(--border)'}}
              >
                {isPopular&&<div style={{position:'absolute',top:-12,left:'50%',transform:'translateX(-50%)',background:'linear-gradient(135deg,var(--violet),var(--blue))',color:'#fff',fontSize:10,fontWeight:700,padding:'4px 14px',borderRadius:99,whiteSpace:'nowrap',letterSpacing:'0.06em'}}>⭐ MOST POPULAR</div>}
                {sel&&<div style={{position:'absolute',top:10,right:10,width:18,height:18,borderRadius:'50%',background:borderCol,display:'flex',alignItems:'center',justifyContent:'center'}}><Check size={10} color="#fff"/></div>}
                <div style={{fontSize:26,marginBottom:12}}>{p.icon}</div>
                <div style={{fontFamily:'Outfit',fontWeight:700,fontSize:15,color:'var(--tp)',marginBottom:6}}>{p.name}</div>
                <div style={{fontFamily:'Outfit',fontWeight:900,fontSize:28,color:'var(--tp)',letterSpacing:'-0.02em',marginBottom:2}}>
                  {p.price===0?'Free':`$${p.price}`}
                  {p.price>0&&<span style={{fontSize:13,color:'var(--ts)',fontWeight:400}}>/mo</span>}
                </div>
                <div style={{fontSize:11,color:'var(--tm)',marginBottom:14}}>{p.price===0?'Forever free · No card needed':'Billed monthly · Cancel anytime'}</div>
                <div style={{height:1,background:'var(--border)',marginBottom:14}}/>
                {[
                  {t:`${p.products>=999?'Unlimited':p.products} products`,ok:true},
                  {t:`${p.aiMsg>=999?'Unlimited':p.aiMsg} AI messages/day`,ok:true},
                  {t:`${p.posts>=999?'Unlimited':p.posts} posts/week`,ok:true},
                  {t:`${p.scripts>=999?'Unlimited':p.scripts} scripts/day`,ok:true},
                  {t:'WhatsApp AI bot',ok:p.whatsapp},
                  {t:'No content watermark',ok:p.noWatermark},
                  {t:'Advanced analytics',ok:p.analytics==='advanced'},
                  {t:'Team accounts',ok:p.team},
                ].map((f,fi)=>(
                  <div key={fi} style={{display:'flex',alignItems:'center',gap:7,fontSize:11,color:f.ok?'var(--ts)':'var(--tm)',marginBottom:6,opacity:f.ok?1:0.45}}>
                    {f.ok?<Check size={10} color="var(--green)"/>:<X size={10} color="var(--tm)"/>}{f.t}
                  </div>
                ))}
              </div>
            );
          })}
        </div>
        <div style={{textAlign:'center',fontSize:13,color:'var(--tm)',marginBottom:24}}>
          💡 All plans include: SSL security · Global CDN · 24/7 AI uptime · Mobile app access
        </div>
        <div style={{display:'flex',justifyContent:'space-between',alignItems:'center'}}>
          <button className="btn btn-g" onClick={()=>setStep('role')}><ChevronLeft size={14}/>Back</button>
          <button className="btn btn-p btn-lg" onClick={()=>setStep('final')} style={{padding:'11px 32px'}}>
            Continue with {PLANS[plan].name} {plan!=='free'&&`— $${PLANS[plan].price}/mo`} <ChevronRight size={15}/>
          </button>
        </div>
      </div>
    </div>
  );

  if (step==='final') return (
    <div style={{minHeight:'100vh',display:'flex',alignItems:'center',justifyContent:'center',background:'var(--bg)',padding:24}}>
      <div style={{maxWidth:860,width:'100%',display:'grid',gridTemplateColumns:role==='admin'?'1fr':'1fr 1fr',gap:32,alignItems:'start',animation:'fadeInUp .5s ease'}}>
        {/* Left: summary */}
        {role!=='admin'&&(
          <div>
            <div style={{display:'flex',alignItems:'center',gap:8,marginBottom:28}}>
              <div style={{width:28,height:28,borderRadius:7,background:'linear-gradient(135deg,var(--blue),var(--violet))',display:'flex',alignItems:'center',justifyContent:'center'}}><ShoppingBag size={13} color="#fff"/></div>
              <span style={{fontFamily:'Outfit',fontWeight:800,fontSize:15,color:'var(--tp)'}}>ChatCart</span>
            </div>
            <div style={{fontFamily:'Outfit',fontWeight:800,fontSize:28,color:'var(--tp)',marginBottom:6}}>You're almost in!</div>
            <div style={{fontSize:14,color:'var(--ts)',marginBottom:28}}>Create your account to access your {PLANS[plan].name} dashboard</div>
            <div className="card" style={{padding:22,marginBottom:16}}>
              <div style={{display:'flex',alignItems:'center',gap:12,marginBottom:16}}>
                <span style={{fontSize:28}}>{PLANS[plan].icon}</span>
                <div>
                  <div style={{fontFamily:'Outfit',fontWeight:700,fontSize:16,color:'var(--tp)'}}>{PLANS[plan].name} Plan</div>
                  <div style={{fontSize:13,color:'var(--ts)'}}>{PLANS[plan].price===0?'Free forever':'$'+PLANS[plan].price+'/month'}</div>
                </div>
                <span className={`badge ${plan==='free'?'b-gray':plan==='starter'?'b-blue':plan==='pro'?'b-violet':'b-gold'}`} style={{marginLeft:'auto'}}>{plan==='free'?'Free':'Paid'}</span>
              </div>
              {[
                `${PLANS[plan].products>=999?'Unlimited':PLANS[plan].products} products`,
                `${PLANS[plan].aiMsg>=999?'Unlimited':PLANS[plan].aiMsg} AI messages/day`,
                PLANS[plan].whatsapp?'✓ WhatsApp AI bot':'✗ WhatsApp bot (upgrade to Pro)',
                PLANS[plan].noWatermark?'✓ No watermark':'✗ Watermark on content',
              ].map((f,i)=>(
                <div key={i} style={{fontSize:13,color:f.startsWith('✗')?'var(--tm)':'var(--ts)',marginBottom:6,display:'flex',alignItems:'center',gap:7}}>
                  {f.startsWith('✓')||(!f.startsWith('✗')&&!f.includes('✗'))?<Check size={11} color="var(--green)"/>:f.startsWith('✗')?<X size={11} color="var(--tm)"/>:null}{f.replace('✓ ','').replace('✗ ','')}
                </div>
              ))}
            </div>
            <div style={{fontSize:12,color:'var(--tm)',display:'flex',flexDirection:'column',gap:7}}>
              {['🔒 SSL encrypted · Your data is secure','🌍 Access from any device, anywhere','💳 No credit card required for free plan','🚀 Live in under 2 minutes'].map(f=>(
                <div key={f}>{f}</div>
              ))}
            </div>
          </div>
        )}
        {/* Right: form */}
        <div>
          <div style={{fontFamily:'Outfit',fontWeight:800,fontSize:22,color:'var(--tp)',marginBottom:4}}>{role==='admin'?'Admin Access':'Create Your Account'}</div>
          <div style={{fontSize:13,color:'var(--ts)',marginBottom:22}}>{role==='admin'?'Enter your admin credentials to continue':'Fill in your details to get started'}</div>
          <div className="card" style={{padding:24}}>
            <div style={{display:'grid',gap:14}}>
              <div><label className="lbl">Full Name *</label><input className="inp" placeholder="Your full name" value={form.name} onChange={e=>setForm({...form,name:e.target.value})}/></div>
              <div><label className="lbl">Email Address *</label><input className="inp" type="email" placeholder="email@example.com" value={form.email} onChange={e=>setForm({...form,email:e.target.value})}/></div>
              <div><label className="lbl">Password *</label><input className="inp" type="password" placeholder="Min. 8 characters" value={form.password} onChange={e=>setForm({...form,password:e.target.value})}/></div>
              {role!=='admin'&&(
                <div style={{display:'grid',gridTemplateColumns:'1fr 1fr',gap:12}}>
                  <div><label className="lbl">Country</label>
                    <select className="sel" value={form.country} onChange={e=>setForm({...form,country:e.target.value})}>
                      {['Nigeria','Ghana','Kenya','South Africa','UK','USA','Canada','UAE','India','Australia'].map(c=><option key={c}>{c}</option>)}
                    </select>
                  </div>
                  <div><label className="lbl">Currency</label>
                    <select className="sel" value={form.currency} onChange={e=>setForm({...form,currency:e.target.value})}>
                      {Object.entries(CURRENCIES).map(([k,v])=><option key={k} value={k}>{v.s} {k}</option>)}
                    </select>
                  </div>
                </div>
              )}
            </div>
            <button className="btn btn-p btn-lg" style={{width:'100%',justifyContent:'center',marginTop:20,boxShadow:'0 4px 20px rgba(59,130,246,0.3)'}} onClick={()=>onComplete({role,plan,...form})}>
              {role==='admin'?'Enter Admin Panel 🔐':'Launch My Dashboard 🚀'}
            </button>
            <div style={{textAlign:'center',marginTop:14,fontSize:11,color:'var(--tm)'}}>
              By creating an account you agree to our <span style={{color:'var(--blue)',cursor:'pointer'}}>Terms of Service</span> & <span style={{color:'var(--blue)',cursor:'pointer'}}>Privacy Policy</span>
            </div>
          </div>
          <button className="btn btn-g" style={{display:'flex',margin:'14px auto 0',gap:6}} onClick={()=>setStep(role==='admin'?'role':'plan')}>
            <ChevronLeft size={14}/>Go back
          </button>
        </div>
      </div>
    </div>
  );
}

// ═══════════════════════════════════════════════════════════════════════════
// PRICING MODAL
// ═══════════════════════════════════════════════════════════════════════════
function PricingModal({onClose,onUpgrade,currentPlan}) {
  const [sel,setSel]=useState('pro');
  const borderCol={starter:'var(--blue)',pro:'var(--violet)',business:'var(--gold)'};
  return (
    <div className="overlay" onClick={e=>e.target===e.currentTarget&&onClose()}>
      <div className="modal" style={{maxWidth:780}}>
        <div style={{display:'flex',alignItems:'center',justifyContent:'space-between',marginBottom:20}}>
          <div>
            <div style={{fontFamily:'Outfit',fontWeight:800,fontSize:22,color:'var(--tp)',display:'flex',alignItems:'center',gap:8}}><Crown size={19} color="var(--gold)"/>Upgrade Your Plan</div>
            <div style={{fontSize:13,color:'var(--ts)',marginTop:3}}>Unlock unlimited access · Cancel anytime</div>
          </div>
          <button className="btn btn-g btn-ico" onClick={onClose}><X size={16}/></button>
        </div>
        <div style={{display:'grid',gridTemplateColumns:'repeat(3,1fr)',gap:12,marginBottom:20}}>
          {Object.entries(PLANS).filter(([k])=>k!=='free').map(([key,p])=>{
            const isSel=sel===key;
            return (
              <div key={key} onClick={()=>setSel(key)} style={{
                background:isSel?'var(--elevated)':'var(--card)',
                border:`2px solid ${isSel?borderCol[key]:'var(--border)'}`,
                borderRadius:'var(--r)',padding:20,cursor:'pointer',transition:'var(--tr)',position:'relative',
              }}>
                {key==='pro'&&<div style={{position:'absolute',top:-10,left:'50%',transform:'translateX(-50%)',background:'linear-gradient(135deg,var(--violet),var(--blue))',color:'#fff',fontSize:9,fontWeight:700,padding:'3px 12px',borderRadius:99,whiteSpace:'nowrap'}}>⭐ MOST POPULAR</div>}
                {isSel&&<div style={{position:'absolute',top:10,right:10,width:16,height:16,borderRadius:'50%',background:borderCol[key],display:'flex',alignItems:'center',justifyContent:'center'}}><Check size={9} color="#fff"/></div>}
                <div style={{fontSize:22,marginBottom:8}}>{p.icon}</div>
                <div style={{fontFamily:'Outfit',fontWeight:700,fontSize:15,color:'var(--tp)',marginBottom:4}}>{p.name}</div>
                <div style={{fontFamily:'Outfit',fontWeight:900,fontSize:26,color:'var(--tp)',letterSpacing:'-0.02em',marginBottom:12}}>
                  ${p.price}<span style={{fontSize:13,color:'var(--ts)',fontWeight:400}}>/mo</span>
                </div>
                {[
                  {t:`${p.products>=999?'Unlimited':p.products} products`,ok:true},
                  {t:`${p.aiMsg>=999?'Unlimited':p.aiMsg} AI/day`,ok:true},
                  {t:'WhatsApp AI bot',ok:p.whatsapp},
                  {t:'No watermark',ok:p.noWatermark},
                  {t:'Advanced analytics',ok:p.analytics==='advanced'},
                  {t:'Team accounts',ok:p.team},
                ].map((f,fi)=>(
                  <div key={fi} style={{display:'flex',alignItems:'center',gap:6,fontSize:12,color:f.ok?'var(--ts)':'var(--tm)',marginBottom:6,opacity:f.ok?1:0.4}}>
                    {f.ok?<Check size={10} color="var(--green)"/>:<X size={10} color="var(--tm)"/>}{f.t}
                  </div>
                ))}
              </div>
            );
          })}
        </div>
        <button className="btn btn-gold btn-lg" style={{width:'100%',justifyContent:'center',fontSize:15}} onClick={()=>onUpgrade(sel)}>
          <Crown size={15}/>Upgrade to {PLANS[sel].name} — ${PLANS[sel].price}/month
        </button>
        <div style={{display:'flex',gap:20,justifyContent:'center',marginTop:14,fontSize:12,color:'var(--tm)',flexWrap:'wrap'}}>
          {['✓ Cancel anytime','✓ 14-day money back','✓ Instant activation','✓ No setup fees'].map(f=><span key={f}>{f}</span>)}
        </div>
      </div>
    </div>
  );
}

// ═══════════════════════════════════════════════════════════════════════════
// SIDEBAR
// ═══════════════════════════════════════════════════════════════════════════
function Sidebar({page,setPage,collapsed,setCollapsed,role,plan,pendingCount,onUpgrade}) {
  const vendorNav = [
    {id:'dashboard',label:'Dashboard',icon:LayoutDashboard},
    {id:'products',label:'Products',icon:Package},
    {id:'orders',label:'Orders',icon:ShoppingCart,badge:pendingCount},
    {id:'whatsapp',label:'WhatsApp AI',icon:MessageCircle,locked:plan==='free'||plan==='starter'},
    {id:'automation',label:'Automation',icon:Zap},
    {id:'social',label:'Social Media',icon:Share2},
    {id:'analytics',label:'Analytics',icon:BarChart2},
    {id:'settings',label:'Settings',icon:Settings},
  ];
  const creatorNav = [
    {id:'dashboard',label:'Dashboard',icon:LayoutDashboard},
    {id:'scripts',label:'AI Scripts',icon:FileText},
    {id:'voiceover',label:'Voiceover AI',icon:Mic,locked:plan==='free'},
    {id:'video',label:'Video AI',icon:Film,locked:plan==='free'},
    {id:'scheduler',label:'Scheduler',icon:Calendar},
    {id:'social',label:'Social Media',icon:Share2},
    {id:'analytics',label:'Analytics',icon:BarChart2},
    {id:'settings',label:'Settings',icon:Settings},
  ];
  const adminNav = [
    {id:'dashboard',label:'Overview',icon:LayoutDashboard},
    {id:'users',label:'Users',icon:Users},
    {id:'vendors',label:'Vendors',icon:ShoppingBag},
    {id:'subscriptions',label:'Subscriptions',icon:CreditCard},
    {id:'payments',label:'Payments',icon:Wallet},
    {id:'analytics',label:'Analytics',icon:BarChart2},
    {id:'settings',label:'Settings',icon:Settings},
  ];
  const navItems = role==='admin'?adminNav:role==='creator'?creatorNav:vendorNav;
  const planObj = PLANS[plan];

  return (
    <aside style={{width:collapsed?68:240,minWidth:collapsed?68:240,height:'100vh',background:'var(--surface)',borderRight:'1px solid var(--border)',display:'flex',flexDirection:'column',transition:'width .25s cubic-bezier(.4,0,.2,1),min-width .25s cubic-bezier(.4,0,.2,1)',overflow:'hidden',zIndex:50,flexShrink:0}}>
      {/* Logo */}
      <div style={{padding:collapsed?'18px 0':'18px 18px',display:'flex',alignItems:'center',justifyContent:collapsed?'center':'space-between',borderBottom:'1px solid var(--border)',height:60,flexShrink:0}}>
        {!collapsed&&(
          <div style={{display:'flex',alignItems:'center',gap:9}}>
            <div style={{width:32,height:32,borderRadius:9,background:'linear-gradient(135deg,var(--blue),var(--violet))',display:'flex',alignItems:'center',justifyContent:'center',boxShadow:'0 4px 12px rgba(59,130,246,0.35)'}}>
              <ShoppingBag size={15} color="#fff"/>
            </div>
            <div>
              <div style={{fontFamily:'Outfit',fontWeight:900,fontSize:15,letterSpacing:'-0.02em',color:'var(--tp)'}}>ChatCart</div>
              <div style={{fontSize:9,color:'var(--tm)',fontWeight:600,letterSpacing:'0.08em'}}>{role==='admin'?'ADMIN PANEL':role==='creator'?'CREATOR':'VENDOR'}</div>
            </div>
          </div>
        )}
        {collapsed&&<div style={{width:32,height:32,borderRadius:9,background:'linear-gradient(135deg,var(--blue),var(--violet))',display:'flex',alignItems:'center',justifyContent:'center'}}><ShoppingBag size={15} color="#fff"/></div>}
        {!collapsed&&<button className="btn btn-g btn-ico" onClick={()=>setCollapsed(true)}><ChevronLeft size={14}/></button>}
      </div>

      {/* Nav */}
      <nav style={{flex:1,padding:'10px 7px',overflowY:'auto',overflowX:'hidden'}}>
        {collapsed&&<button className="btn btn-g btn-ico" style={{width:'100%',justifyContent:'center',marginBottom:8,padding:'9px 0'}} onClick={()=>setCollapsed(false)}><Menu size={15}/></button>}
        {navItems.map(item=>{
          const Icon=item.icon;
          const active=page===item.id;
          return (
            <button key={item.id} onClick={()=>item.locked?onUpgrade():setPage(item.id)}
              title={collapsed?item.label:''}
              style={{width:'100%',display:'flex',alignItems:'center',gap:9,padding:collapsed?'9px 0':'8px 11px',justifyContent:collapsed?'center':'flex-start',borderRadius:'var(--rsm)',border:'none',cursor:'pointer',marginBottom:2,transition:'var(--tr)',background:active?'var(--blue-s)':'transparent',color:active?'var(--blue)':'var(--ts)',fontFamily:'DM Sans',fontWeight:active?600:400,fontSize:13,position:'relative',opacity:item.locked?0.6:1}}
              onMouseEnter={e=>{if(!active){e.currentTarget.style.background='var(--elevated)';e.currentTarget.style.color='var(--tp)'}}}
              onMouseLeave={e=>{if(!active){e.currentTarget.style.background='transparent';e.currentTarget.style.color='var(--ts)'}}}
            >
              {active&&<span style={{position:'absolute',left:0,top:'50%',transform:'translateY(-50%)',width:3,height:16,background:'var(--blue)',borderRadius:'0 2px 2px 0'}}/>}
              <Icon size={15}/>
              {!collapsed&&<span style={{flex:1,textAlign:'left'}}>{item.label}</span>}
              {!collapsed&&item.badge>0&&<span style={{background:'var(--blue)',color:'#fff',fontSize:10,fontWeight:700,padding:'1px 6px',borderRadius:99}}>{item.badge}</span>}
              {!collapsed&&item.locked&&<Lock size={11} color="var(--gold)"/>}
            </button>
          );
        })}
      </nav>

      {/* Plan indicator */}
      {!collapsed&&(
        <div style={{padding:'10px 12px',borderTop:'1px solid var(--border)'}}>
          {plan==='free'&&(
            <div style={{background:'linear-gradient(135deg,rgba(234,179,8,0.1),rgba(245,158,11,0.06))',border:'1px solid rgba(234,179,8,0.2)',borderRadius:'var(--rsm)',padding:'10px 12px',marginBottom:8}}>
              <div style={{fontSize:11,fontWeight:600,color:'var(--gold)',marginBottom:4}}>Free Plan</div>
              <LimitBar used={5} max={20} label="AI Messages" color="var(--amber)"/>
              <button className="btn btn-gold btn-sm" style={{width:'100%',justifyContent:'center',fontSize:11,marginTop:6}} onClick={onUpgrade}><Crown size={11}/>Upgrade Now</button>
            </div>
          )}
          <div style={{display:'flex',alignItems:'center',gap:9,padding:'9px 10px',borderRadius:'var(--rsm)',background:'var(--elevated)',border:'1px solid var(--border)'}}>
            <div style={{width:28,height:28,borderRadius:'50%',background:'linear-gradient(135deg,var(--green),var(--blue))',display:'flex',alignItems:'center',justifyContent:'center',fontSize:11,fontWeight:700,color:'#fff',flexShrink:0}}>
              {role==='admin'?'A':'V'}
            </div>
            <div style={{flex:1,minWidth:0}}>
              <div style={{fontSize:11,fontWeight:600,color:'var(--tp)',whiteSpace:'nowrap',overflow:'hidden',textOverflow:'ellipsis'}}>Adaeze {role==='creator'?'Creator':role==='admin'?'Admin':'Vendor'}</div>
              <div style={{fontSize:10,color:'var(--tm)',display:'flex',alignItems:'center',gap:4}}>
                <span>{planObj.icon}</span><span style={{color:planObj.color}}>{planObj.name}</span>
              </div>
            </div>
          </div>
          <button onClick={()=>{}} style={{width:'100%',display:'flex',alignItems:'center',gap:8,padding:'8px 10px',borderRadius:'var(--rsm)',border:'none',background:'transparent',color:'var(--rose)',cursor:'pointer',fontFamily:'DM Sans',fontSize:12,fontWeight:500,transition:'var(--tr)',marginTop:4}}
            onMouseEnter={e=>{e.currentTarget.style.background='var(--rose-s)'}}
            onMouseLeave={e=>{e.currentTarget.style.background='transparent'}}
          ><LogOut size={13}/>Logout</button>
        </div>
      )}
    </aside>
  );
}

// ═══════════════════════════════════════════════════════════════════════════
// TOPBAR
// ═══════════════════════════════════════════════════════════════════════════
function Topbar({page,plan,onUpgrade}) {
  const titles={dashboard:'Overview',products:'Products',orders:'Orders',whatsapp:'WhatsApp AI',automation:'Automation',social:'Social Media',analytics:'Analytics',settings:'Settings',scripts:'AI Scripts',voiceover:'Voiceover AI',video:'Video AI',scheduler:'Content Scheduler',users:'Users',vendors:'Vendors',subscriptions:'Subscriptions',payments:'Payments'};
  return (
    <header style={{height:60,background:'var(--surface)',borderBottom:'1px solid var(--border)',display:'flex',alignItems:'center',justifyContent:'space-between',padding:'0 22px',gap:14,flexShrink:0}}>
      <div style={{fontFamily:'Outfit',fontSize:16,fontWeight:700,color:'var(--tp)'}}>{titles[page]||page}</div>
      <div style={{display:'flex',alignItems:'center',gap:8}}>
        {plan==='free'&&(
          <button className="btn btn-gold btn-sm" onClick={onUpgrade} style={{fontSize:11}}>
            <Crown size={11}/>Upgrade
          </button>
        )}
        <div style={{position:'relative'}}>
          <Search size={13} style={{position:'absolute',left:9,top:'50%',transform:'translateY(-50%)',color:'var(--tm)'}}/>
          <input className="inp" placeholder="Search..." style={{paddingLeft:28,width:180,fontSize:12}}/>
        </div>
        <button className="btn btn-g btn-ico" style={{position:'relative'}}>
          <Bell size={15}/>
          <span style={{position:'absolute',top:3,right:3,width:7,height:7,background:'var(--rose)',borderRadius:'50%',border:'2px solid var(--surface)'}}/>
        </button>
        <div style={{width:30,height:30,borderRadius:'50%',background:'linear-gradient(135deg,var(--green),var(--blue))',display:'flex',alignItems:'center',justifyContent:'center',fontSize:12,fontWeight:700,color:'#fff',cursor:'pointer'}}>A</div>
      </div>
    </header>
  );
}

// ═══════════════════════════════════════════════════════════════════════════
// VENDOR DASHBOARD PAGE
// ═══════════════════════════════════════════════════════════════════════════
function VendorDashboard({products,orders,currency}) {
  const rev = orders.filter(o=>o.status==='Delivered').reduce((s,o)=>s+o.total,0);
  return (
    <div>
      <div style={{display:'grid',gridTemplateColumns:'repeat(4,1fr)',gap:14,marginBottom:20}}>
        <StatCard label="Total Products" value={products.length} icon={Package} change={12} color="var(--blue)" delay={0}/>
        <StatCard label="Total Orders" value={orders.length} icon={ShoppingCart} change={8} color="var(--violet)" delay={60}/>
        <StatCard label="Revenue" value={fmt(rev,currency)} icon={DollarSign} change={23} color="var(--green)" delay={120}/>
        <StatCard label="Pending" value={orders.filter(o=>['Pending','Awaiting Payment','Payment Uploaded'].includes(o.status)).length} icon={AlertCircle} change={-5} color="var(--amber)" delay={180}/>
      </div>
      <div style={{display:'grid',gridTemplateColumns:'1.6fr 1fr',gap:16,marginBottom:16}} className="ai-1">
        <div className="card" style={{padding:20}}>
          <div style={{display:'flex',alignItems:'center',justifyContent:'space-between',marginBottom:18}}>
            <div><div style={{fontFamily:'Outfit',fontWeight:700,fontSize:15}}>Revenue Overview</div><div style={{fontSize:12,color:'var(--tm)',marginTop:2}}>6-month performance</div></div>
            <span className="badge b-green"><TrendingUp size={10}/>+23%</span>
          </div>
          <ResponsiveContainer width="100%" height={190}>
            <AreaChart data={SALES_DATA} margin={{top:5,right:5,left:-20,bottom:0}}>
              <defs><linearGradient id="rg" x1="0" y1="0" x2="0" y2="1"><stop offset="5%" stopColor="var(--blue)" stopOpacity={0.25}/><stop offset="95%" stopColor="var(--blue)" stopOpacity={0}/></linearGradient></defs>
              <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.04)"/>
              <XAxis dataKey="month" tick={{fontSize:11,fill:'var(--tm)'}} axisLine={false} tickLine={false}/>
              <YAxis tick={{fontSize:11,fill:'var(--tm)'}} axisLine={false} tickLine={false}/>
              <Tooltip content={<ChartTooltip currency={currency}/>}/>
              <Area type="monotone" dataKey="revenue" name="revenue" stroke="var(--blue)" strokeWidth={2} fill="url(#rg)"/>
            </AreaChart>
          </ResponsiveContainer>
        </div>
        <div className="card" style={{padding:20}}>
          <div style={{fontFamily:'Outfit',fontWeight:700,fontSize:15,marginBottom:18}}>Orders</div>
          <ResponsiveContainer width="100%" height={190}>
            <BarChart data={SALES_DATA} margin={{top:5,right:5,left:-25,bottom:0}}>
              <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.04)"/>
              <XAxis dataKey="month" tick={{fontSize:11,fill:'var(--tm)'}} axisLine={false} tickLine={false}/>
              <YAxis tick={{fontSize:11,fill:'var(--tm)'}} axisLine={false} tickLine={false}/>
              <Tooltip content={<ChartTooltip/>}/>
              <Bar dataKey="orders" fill="var(--violet)" radius={[4,4,0,0]}/>
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>
      <div style={{display:'grid',gridTemplateColumns:'1fr 1fr',gap:16}} className="ai-2">
        <div className="card" style={{padding:20}}>
          <div style={{fontFamily:'Outfit',fontWeight:700,fontSize:15,marginBottom:14}}>Recent Activity</div>
          {[
            {icon:ShoppingCart,color:'var(--blue)',text:'New order from Amara Okafor',time:'2 min ago'},
            {icon:CreditCard,color:'var(--green)',text:'Payment confirmed – ORD-0042',time:'15 min ago'},
            {icon:Upload,color:'var(--violet)',text:'Payment proof uploaded – ORD-0045',time:'1h ago'},
            {icon:Package,color:'var(--amber)',text:'Product "Shea Butter Set" updated',time:'2h ago'},
            {icon:Sparkles,color:'var(--cyan)',text:'AI generated 3 new captions',time:'3h ago'},
          ].map((a,i)=>{
            const Icon=a.icon;
            return (
              <div key={i} style={{display:'flex',alignItems:'center',gap:10,padding:'9px 0',borderBottom:i<4?'1px solid var(--border)':'none'}}>
                <div style={{width:30,height:30,borderRadius:7,background:`${a.color}18`,display:'flex',alignItems:'center',justifyContent:'center',flexShrink:0}}><Icon size={13} color={a.color}/></div>
                <div style={{flex:1,minWidth:0}}>
                  <div style={{fontSize:12,fontWeight:500,color:'var(--tp)',whiteSpace:'nowrap',overflow:'hidden',textOverflow:'ellipsis'}}>{a.text}</div>
                  <div style={{fontSize:11,color:'var(--tm)'}}>{a.time}</div>
                </div>
              </div>
            );
          })}
        </div>
        <div className="card" style={{padding:20}}>
          <div style={{fontFamily:'Outfit',fontWeight:700,fontSize:15,marginBottom:14}}>Payment Queue</div>
          {orders.filter(o=>['Payment Uploaded','Awaiting Payment'].includes(o.status)).slice(0,4).map((o,i)=>(
            <div key={o.id} style={{display:'flex',alignItems:'center',gap:10,padding:'9px 0',borderBottom:i<3?'1px solid var(--border)':'none'}}>
              <div style={{width:30,height:30,borderRadius:7,background:o.status==='Payment Uploaded'?'var(--violet-s)':'var(--amber-s)',display:'flex',alignItems:'center',justifyContent:'center',flexShrink:0}}>
                {o.status==='Payment Uploaded'?<Upload size={13} color="var(--violet)"/>:<Clock size={13} color="var(--amber)"/>}
              </div>
              <div style={{flex:1,minWidth:0}}>
                <div style={{fontSize:12,fontWeight:600,color:'var(--tp)'}}>{o.customer}</div>
                <div style={{fontSize:11,color:'var(--tm)'}}>{o.id} · {fmt(o.total,o.currency)}</div>
              </div>
              <span className={`badge ${o.status==='Payment Uploaded'?'b-violet':'b-amber'}`} style={{fontSize:10}}>{o.status==='Payment Uploaded'?'Review':'Waiting'}</span>
            </div>
          ))}
          {orders.filter(o=>['Payment Uploaded','Awaiting Payment'].includes(o.status)).length===0&&(
            <div style={{textAlign:'center',padding:'20px 0',color:'var(--tm)',fontSize:12}}>All payments up to date ✓</div>
          )}
        </div>
      </div>
    </div>
  );
}

// ═══════════════════════════════════════════════════════════════════════════
// PRODUCTS PAGE
// ═══════════════════════════════════════════════════════════════════════════
function ProductsPage({products,setProducts,currency,plan,toast,onUpgrade}) {
  const [modal,setModal]=useState(false);
  const [edit,setEdit]=useState(null);
  const [search,setSearch]=useState('');
  const [form,setForm]=useState({name:'',desc:'',price:'',stock:'',category:'Fashion',currency});
  const [img,setImg]=useState(null);
  const fileRef=useRef();
  const cats=['Fashion','Beauty','Home & Living','Jewelry','Electronics','Food & Drink','Art & Crafts','Other'];
  const emojis={Fashion:'👗',Beauty:'🧴','Home & Living':'🏠',Jewelry:'📿',Electronics:'📱','Food & Drink':'🍽️','Art & Crafts':'🎨',Other:'📦'};

  const canAdd = plan==='free'?products.length<PLANS.free.products:true;

  const openCreate=()=>{
    if(!canAdd){onUpgrade();return;}
    setEdit(null);setForm({name:'',desc:'',price:'',stock:'',category:'Fashion',currency});setImg(null);setModal(true);
  };
  const openEdit=(p)=>{setEdit(p);setForm({name:p.name,desc:p.desc,price:p.price,stock:p.stock,category:p.category,currency:p.currency});setImg(p.image);setModal(true);};

  const save=()=>{
    if(!form.name||!form.price)return toast.show('Fill required fields','error');
    if(edit){
      setProducts(ps=>ps.map(p=>p.id===edit.id?{...p,...form,price:+form.price,stock:+form.stock,image:img}:p));
      toast.show('Product updated');
    } else {
      setProducts(ps=>[...ps,{id:'p'+Date.now(),...form,price:+form.price,stock:+form.stock,image:img,createdAt:new Date().toISOString().split('T')[0],rating:4.5}]);
      toast.show('Product created');
    }
    setModal(false);
  };

  const filtered=products.filter(p=>p.name.toLowerCase().includes(search.toLowerCase()));

  return (
    <div>
      <PageHeader title="Products" subtitle={`${products.length} products · ${plan==='free'?`${products.length}/${PLANS.free.products} free limit`:'Unlimited'}`}>
        {plan==='free'&&<div style={{fontSize:12,color:'var(--amber)',display:'flex',alignItems:'center',gap:5}}><AlertTriangle size={12}/>{products.length}/{PLANS.free.products} used</div>}
        <div style={{position:'relative'}}>
          <Search size={12} style={{position:'absolute',left:9,top:'50%',transform:'translateY(-50%)',color:'var(--tm)'}}/>
          <input className="inp" placeholder="Search..." style={{paddingLeft:28,width:170,fontSize:12}} value={search} onChange={e=>setSearch(e.target.value)}/>
        </div>
        <button className="btn btn-p" onClick={openCreate}><Plus size={13}/>New Product</button>
      </PageHeader>

      {!canAdd&&<UpgradeBanner feature={`More than ${PLANS.free.products} products`} plan={plan} onUpgrade={onUpgrade}/>}

      {filtered.length===0?(
        <div className="empty"><Package size={36} style={{opacity:0.2,marginBottom:12}}/><div style={{fontSize:14,fontWeight:600,color:'var(--ts)',marginBottom:6}}>No products</div><button className="btn btn-p" style={{marginTop:8}} onClick={openCreate}><Plus size={13}/>Add Product</button></div>
      ):(
        <div style={{display:'grid',gridTemplateColumns:'repeat(auto-fill,minmax(230px,1fr))',gap:14}}>
          {filtered.map((p,i)=>(
            <div key={p.id} className="card" style={{padding:0,overflow:'hidden',animation:`fadeIn .35s ease ${i*40}ms both`}}>
              <div style={{height:130,background:'var(--elevated)',display:'flex',alignItems:'center',justifyContent:'center',position:'relative',borderBottom:'1px solid var(--border)'}}>
                {p.image?<img src={p.image} alt={p.name} style={{width:'100%',height:'100%',objectFit:'cover'}}/>:<span style={{fontSize:44}}>{emojis[p.category]||'📦'}</span>}
                <div style={{position:'absolute',top:7,right:7,display:'flex',gap:4}}>
                  <button className="btn btn-ico" style={{background:'rgba(13,17,23,.85)',color:'var(--ts)',padding:5,borderRadius:6}} onClick={()=>openEdit(p)}><Edit2 size={11}/></button>
                  <button className="btn btn-ico" style={{background:'rgba(244,63,94,.2)',color:'var(--rose)',padding:5,borderRadius:6}} onClick={()=>{setProducts(ps=>ps.filter(x=>x.id!==p.id));toast.show('Deleted');}}><Trash2 size={11}/></button>
                </div>
                <span style={{position:'absolute',top:7,left:7}} className="badge b-gray">{p.category}</span>
              </div>
              <div style={{padding:'13px 14px'}}>
                <div style={{fontWeight:600,fontSize:13,color:'var(--tp)',marginBottom:4,whiteSpace:'nowrap',overflow:'hidden',textOverflow:'ellipsis'}}>{p.name}</div>
                <div style={{fontSize:11,color:'var(--tm)',marginBottom:10,display:'-webkit-box',WebkitLineClamp:2,WebkitBoxOrient:'vertical',overflow:'hidden',lineHeight:1.5}}>{p.desc}</div>
                <div style={{display:'flex',alignItems:'center',justifyContent:'space-between'}}>
                  <span style={{fontSize:15,fontWeight:800,fontFamily:'Outfit',color:'var(--blue)'}}>{fmt(p.price,p.currency)}</span>
                  <div style={{display:'flex',alignItems:'center',gap:7}}>
                    <span style={{fontSize:11,color:'var(--tm)',display:'flex',alignItems:'center',gap:2}}><Package size={10}/>{p.stock}</span>
                    <span style={{display:'flex',alignItems:'center',gap:2}}><Star size={10} fill="var(--amber)" color="var(--amber)"/><span style={{fontSize:11,color:'var(--tm)'}}>{p.rating}</span></span>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {modal&&(
        <div className="overlay" onClick={e=>e.target===e.currentTarget&&setModal(false)}>
          <div className="modal">
            <div style={{display:'flex',alignItems:'center',justifyContent:'space-between',marginBottom:22}}>
              <div style={{fontFamily:'Outfit',fontWeight:700,fontSize:17}}>{edit?'Edit Product':'New Product'}</div>
              <button className="btn btn-g btn-ico" onClick={()=>setModal(false)}><X size={15}/></button>
            </div>
            <div style={{marginBottom:14}}>
              <div className="lbl">Product Image</div>
              <div style={{height:110,background:'var(--elevated)',borderRadius:'var(--rsm)',border:'2px dashed var(--border-s)',display:'flex',alignItems:'center',justifyContent:'center',cursor:'pointer',overflow:'hidden',transition:'var(--tr)'}}
                onClick={()=>fileRef.current?.click()}
                onMouseEnter={e=>e.currentTarget.style.borderColor='var(--blue)'}
                onMouseLeave={e=>e.currentTarget.style.borderColor='var(--border-s)'}
              >
                {img?<img src={img} alt="" style={{width:'100%',height:'100%',objectFit:'cover'}}/>:<div style={{textAlign:'center',color:'var(--tm)'}}><Upload size={20} style={{marginBottom:6,display:'block',margin:'0 auto 8px'}}/><div style={{fontSize:12}}>Upload image</div></div>}
                <input ref={fileRef} type="file" accept="image/*" style={{display:'none'}} onChange={e=>{const f=e.target.files[0];if(f){const r=new FileReader();r.onload=ev=>setImg(ev.target.result);r.readAsDataURL(f);}}}/>
              </div>
              <div style={{display:'flex',gap:7,marginTop:7}}>
                <button className="btn btn-s btn-sm" onClick={()=>fileRef.current?.click()}><Camera size={11}/>Camera/Gallery</button>
                {img&&<button className="btn btn-g btn-sm" style={{color:'var(--rose)'}} onClick={()=>setImg(null)}><X size={11}/>Remove</button>}
              </div>
            </div>
            <div style={{display:'grid',gap:13}}>
              <div><label className="lbl">Product Name *</label><input className="inp" placeholder="Product name" value={form.name} onChange={e=>setForm({...form,name:e.target.value})}/></div>
              <div><label className="lbl">Description</label><textarea className="inp" rows={3} placeholder="Describe your product..." value={form.desc} onChange={e=>setForm({...form,desc:e.target.value})} style={{resize:'vertical'}}/></div>
              <div style={{display:'grid',gridTemplateColumns:'1fr 1fr',gap:12}}>
                <div><label className="lbl">Price *</label><input className="inp" type="number" placeholder="0.00" value={form.price} onChange={e=>setForm({...form,price:e.target.value})}/></div>
                <div><label className="lbl">Currency</label><select className="sel" value={form.currency} onChange={e=>setForm({...form,currency:e.target.value})}>{Object.entries(CURRENCIES).map(([k,v])=><option key={k} value={k}>{v.s} {k}</option>)}</select></div>
              </div>
              <div style={{display:'grid',gridTemplateColumns:'1fr 1fr',gap:12}}>
                <div><label className="lbl">Stock</label><input className="inp" type="number" placeholder="0" value={form.stock} onChange={e=>setForm({...form,stock:e.target.value})}/></div>
                <div><label className="lbl">Category</label><select className="sel" value={form.category} onChange={e=>setForm({...form,category:e.target.value})}>{cats.map(c=><option key={c}>{c}</option>)}</select></div>
              </div>
            </div>
            <div style={{display:'flex',gap:9,marginTop:20,justifyContent:'flex-end'}}>
              <button className="btn btn-s" onClick={()=>setModal(false)}>Cancel</button>
              <button className="btn btn-p" onClick={save}><Check size={13}/>{edit?'Save Changes':'Create Product'}</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

// ═══════════════════════════════════════════════════════════════════════════
// ORDERS PAGE — with Manual Payment System
// ═══════════════════════════════════════════════════════════════════════════
function OrdersPage({orders,setOrders,currency,toast}) {
  const [filter,setFilter]=useState('All');
  const [search,setSearch]=useState('');
  const [viewPayment,setViewPayment]=useState(null);
  const [uploadOrder,setUploadOrder]=useState(null);
  const proofRef=useRef();

  const filtered=orders.filter(o=>{
    const mf=filter==='All'||o.status===filter;
    const ms=o.customer.toLowerCase().includes(search.toLowerCase())||o.id.toLowerCase().includes(search.toLowerCase());
    return mf&&ms;
  });

  const confirmPayment=(id)=>{
    setOrders(os=>os.map(o=>o.id===id?{...o,status:'Payment Confirmed'}:o));
    toast.show('Payment confirmed! Customer notified via email.');
    setViewPayment(null);
  };

  const handleProofUpload=(e,orderId)=>{
    const file=e.target.files[0];
    if(!file)return;
    const r=new FileReader();
    r.onload=ev=>{
      setOrders(os=>os.map(o=>o.id===orderId?{...o,paymentProof:ev.target.result,status:'Payment Uploaded'}:o));
      toast.show('Payment proof uploaded! Awaiting vendor confirmation.');
      setUploadOrder(null);
    };
    r.readAsDataURL(file);
  };

  const statuses=['All','Pending','Awaiting Payment','Payment Uploaded','Payment Confirmed','Processing','Shipped','Delivered','Cancelled'];

  return (
    <div>
      <PageHeader title="Orders" subtitle={`${orders.length} total orders`}>
        <div style={{position:'relative'}}>
          <Search size={12} style={{position:'absolute',left:9,top:'50%',transform:'translateY(-50%)',color:'var(--tm)'}}/>
          <input className="inp" placeholder="Search orders..." style={{paddingLeft:28,width:180,fontSize:12}} value={search} onChange={e=>setSearch(e.target.value)}/>
        </div>
      </PageHeader>

      {/* Bank Details Card */}
      <div className="card" style={{padding:16,marginBottom:16,display:'flex',alignItems:'center',gap:20,flexWrap:'wrap'}}>
        <div style={{display:'flex',alignItems:'center',gap:9}}>
          <div style={{width:36,height:36,borderRadius:9,background:'var(--green-s)',display:'flex',alignItems:'center',justifyContent:'center'}}><Wallet size={16} color="var(--green)"/></div>
          <div>
            <div style={{fontSize:12,fontWeight:600,color:'var(--tp)'}}>Your Payment Details</div>
            <div style={{fontSize:11,color:'var(--tm)'}}>Customers transfer to this account</div>
          </div>
        </div>
        {[['Bank','Access Bank'],['Account Name','Adaeze Vendor'],['Account Number','0123456789']].map(([k,v])=>(
          <div key={k} style={{background:'var(--elevated)',borderRadius:'var(--rsm)',padding:'7px 12px',border:'1px solid var(--border)'}}>
            <div style={{fontSize:10,color:'var(--tm)',marginBottom:2}}>{k}</div>
            <div style={{fontSize:13,fontWeight:600,color:'var(--tp)',fontFamily:k==='Account Number'?'JetBrains Mono':'inherit'}}>{v}</div>
          </div>
        ))}
        <button className="btn btn-s btn-sm" style={{marginLeft:'auto'}}><Edit2 size={11}/>Edit</button>
      </div>

      {/* Status Tabs */}
      <div style={{display:'flex',gap:4,marginBottom:14,overflowX:'auto',paddingBottom:4}}>
        {['All','Pending','Awaiting Payment','Payment Uploaded','Payment Confirmed','Processing','Shipped','Delivered'].map(s=>{
          const count=s==='All'?orders.length:orders.filter(o=>o.status===s).length;
          return(
            <button key={s} onClick={()=>setFilter(s)} style={{padding:'5px 12px',borderRadius:99,border:'1px solid',fontSize:11,fontWeight:500,cursor:'pointer',transition:'var(--tr)',whiteSpace:'nowrap',background:filter===s?'var(--blue)':'transparent',color:filter===s?'#fff':'var(--ts)',borderColor:filter===s?'var(--blue)':'var(--border)',fontFamily:'DM Sans'}}>
              {s} {count>0&&<span style={{opacity:.7,marginLeft:3}}>({count})</span>}
            </button>
          );
        })}
      </div>

      <div style={{background:'var(--card)',border:'1px solid var(--border)',borderRadius:'var(--rlg)',overflow:'hidden'}}>
        {filtered.length===0?(
          <div className="empty"><ShoppingCart size={32} style={{opacity:.2,marginBottom:10}}/><div style={{fontSize:13,color:'var(--ts)'}}>No orders found</div></div>
        ):(
          <table>
            <thead><tr><th>Order ID</th><th>Customer</th><th>Product</th><th>Total</th><th>Payment</th><th>Status</th><th>Date</th><th>Actions</th></tr></thead>
            <tbody>
              {filtered.map((o,i)=>{
                const sc=STATUS_CONFIG[o.status]||STATUS_CONFIG['Pending'];
                const SI=sc.icon;
                return (
                  <tr key={o.id} style={{animation:`fadeIn .3s ease ${i*30}ms both`}}>
                    <td style={{fontFamily:'JetBrains Mono',fontSize:11,color:'var(--blue)'}}>{o.id}</td>
                    <td><div style={{fontWeight:600,color:'var(--tp)',fontSize:13}}>{o.customer}</div><div style={{fontSize:11,color:'var(--tm)'}}>{o.email}</div></td>
                    <td style={{maxWidth:130}}><div style={{whiteSpace:'nowrap',overflow:'hidden',textOverflow:'ellipsis'}}>{o.product}</div></td>
                    <td style={{fontFamily:'JetBrains Mono',fontSize:12,fontWeight:600,color:'var(--tp)'}}>{fmt(o.total,o.currency)}</td>
                    <td>
                      {o.paymentProof?(
                        <button className="btn btn-s btn-sm" onClick={()=>setViewPayment(o)} style={{fontSize:11}}>
                          <Eye size={11}/>View Proof
                        </button>
                      ):(
                        <span style={{fontSize:11,color:'var(--tm)'}}>No proof</span>
                      )}
                    </td>
                    <td><span className={`badge ${sc.badge}`}><SI size={9}/>{o.status}</span></td>
                    <td style={{fontSize:11}}>{o.date}</td>
                    <td>
                      <div style={{display:'flex',gap:5}}>
                        {o.status==='Payment Uploaded'&&(
                          <button className="btn btn-s btn-sm" style={{fontSize:11,borderColor:'var(--green)',color:'var(--green)'}} onClick={()=>confirmPayment(o.id)}>
                            <CheckCircle size={11}/>Confirm
                          </button>
                        )}
                        {o.status==='Pending'&&(
                          <button className="btn btn-s btn-sm" style={{fontSize:11}} onClick={()=>setUploadOrder(o)}>
                            <Upload size={11}/>Upload Proof
                          </button>
                        )}
                        <select className="sel" value={o.status} onChange={e=>setOrders(os=>os.map(x=>x.id===o.id?{...x,status:e.target.value}:x))} style={{width:120,padding:'5px 9px',fontSize:11}}>
                          {ORDER_STATUSES.map(s=><option key={s}>{s}</option>)}
                        </select>
                      </div>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        )}
      </div>

      {/* Payment Proof Modal */}
      {viewPayment&&(
        <div className="overlay" onClick={e=>e.target===e.currentTarget&&setViewPayment(null)}>
          <div className="modal" style={{maxWidth:480}}>
            <div style={{display:'flex',alignItems:'center',justifyContent:'space-between',marginBottom:20}}>
              <div style={{fontFamily:'Outfit',fontWeight:700,fontSize:17}}>Payment Proof — {viewPayment.id}</div>
              <button className="btn btn-g btn-ico" onClick={()=>setViewPayment(null)}><X size={15}/></button>
            </div>
            <div style={{display:'grid',gridTemplateColumns:'1fr 1fr',gap:10,marginBottom:16}}>
              {[['Customer',viewPayment.customer],['Amount',fmt(viewPayment.total,viewPayment.currency)],['Product',viewPayment.product],['Date',viewPayment.date]].map(([k,v])=>(
                <div key={k} style={{background:'var(--elevated)',borderRadius:'var(--rsm)',padding:'10px 12px'}}>
                  <div style={{fontSize:10,color:'var(--tm)',marginBottom:3}}>{k}</div>
                  <div style={{fontSize:13,fontWeight:600,color:'var(--tp)'}}>{v}</div>
                </div>
              ))}
            </div>
            <div style={{borderRadius:'var(--r)',overflow:'hidden',marginBottom:16,background:'var(--elevated)',border:'1px solid var(--border)'}}>
              {viewPayment.paymentProof&&viewPayment.paymentProof!=='proof'?
                <img src={viewPayment.paymentProof} alt="Payment proof" style={{width:'100%',maxHeight:280,objectFit:'contain'}}/>:
                <div style={{height:180,display:'flex',flexDirection:'column',alignItems:'center',justifyContent:'center',color:'var(--tm)'}}>
                  <CreditCard size={36} style={{opacity:.3,marginBottom:12}}/>
                  <div style={{fontSize:13}}>Transfer receipt uploaded</div>
                  <div style={{fontSize:11,marginTop:4,color:'var(--tm)'}}>Manual bank transfer proof</div>
                </div>
              }
            </div>
            <div style={{background:'var(--elevated)',borderRadius:'var(--rsm)',padding:'12px 14px',marginBottom:16,fontSize:12,color:'var(--ts)'}}>
              <div style={{fontWeight:600,color:'var(--tp)',marginBottom:6}}>Customer Bank Transfer Details</div>
              <div>Bank: <strong style={{color:'var(--tp)'}}>Access Bank</strong></div>
              <div style={{marginTop:4}}>Payment Method: <strong style={{color:'var(--tp)'}}>Manual Transfer</strong></div>
            </div>
            {viewPayment.status==='Payment Uploaded'&&(
              <button className="btn btn-p btn-lg" style={{width:'100%',justifyContent:'center',background:'var(--green)'}} onClick={()=>confirmPayment(viewPayment.id)}>
                <CheckCircle size={15}/>Confirm Payment & Process Order
              </button>
            )}
            {viewPayment.status==='Payment Confirmed'&&(
              <div style={{background:'var(--green-s)',border:'1px solid rgba(16,185,129,0.3)',borderRadius:'var(--rsm)',padding:'12px',display:'flex',alignItems:'center',gap:8,fontSize:13,color:'var(--green)'}}>
                <CheckCircle size={15}/>Payment confirmed — order is processing
              </div>
            )}
          </div>
        </div>
      )}

      {/* Upload Proof Modal */}
      {uploadOrder&&(
        <div className="overlay" onClick={e=>e.target===e.currentTarget&&setUploadOrder(null)}>
          <div className="modal" style={{maxWidth:440}}>
            <div style={{display:'flex',alignItems:'center',justifyContent:'space-between',marginBottom:22}}>
              <div style={{fontFamily:'Outfit',fontWeight:700,fontSize:17}}>Upload Payment Proof</div>
              <button className="btn btn-g btn-ico" onClick={()=>setUploadOrder(null)}><X size={15}/></button>
            </div>
            <div style={{background:'var(--elevated)',borderRadius:'var(--r)',padding:'16px 18px',marginBottom:18,fontSize:13}}>
              <div style={{fontWeight:600,color:'var(--tp)',marginBottom:10}}>Order Summary</div>
              <div style={{display:'grid',gap:6}}>
                <div style={{display:'flex',justifyContent:'space-between'}}><span style={{color:'var(--ts)'}}>Order</span><span style={{color:'var(--tp)',fontFamily:'JetBrains Mono',fontSize:12}}>{uploadOrder.id}</span></div>
                <div style={{display:'flex',justifyContent:'space-between'}}><span style={{color:'var(--ts)'}}>Product</span><span style={{color:'var(--tp)'}}>{uploadOrder.product}</span></div>
                <div style={{display:'flex',justifyContent:'space-between'}}><span style={{color:'var(--ts)'}}>Amount</span><span style={{color:'var(--blue)',fontWeight:700,fontSize:15,fontFamily:'Outfit'}}>{fmt(uploadOrder.total,uploadOrder.currency)}</span></div>
              </div>
              <div className="divider"/>
              <div style={{fontWeight:600,color:'var(--tp)',marginBottom:8}}>Transfer to:</div>
              <div style={{display:'grid',gap:5}}>
                {[['Bank','Access Bank'],['Account Name','Adaeze Vendor'],['Account Number','0123456789']].map(([k,v])=>(
                  <div key={k} style={{display:'flex',justifyContent:'space-between'}}>
                    <span style={{color:'var(--ts)',fontSize:12}}>{k}</span>
                    <span style={{color:'var(--tp)',fontWeight:600,fontFamily:k==='Account Number'?'JetBrains Mono':'inherit'}}>{v}</span>
                  </div>
                ))}
              </div>
            </div>
            <div>
              <div className="lbl">Upload Payment Proof *</div>
              <div style={{border:'2px dashed var(--border-s)',borderRadius:'var(--r)',padding:'30px 20px',textAlign:'center',cursor:'pointer',transition:'var(--tr)',background:'var(--elevated)'}}
                onClick={()=>proofRef.current?.click()}
                onMouseEnter={e=>e.currentTarget.style.borderColor='var(--blue)'}
                onMouseLeave={e=>e.currentTarget.style.borderColor='var(--border-s)'}
              >
                <Upload size={28} style={{margin:'0 auto 10px',display:'block',opacity:.4}}/>
                <div style={{fontSize:13,color:'var(--ts)',marginBottom:4}}>Click to upload transfer screenshot</div>
                <div style={{fontSize:11,color:'var(--tm)'}}>Transfer screenshot · Payment receipt · Bank confirmation</div>
                <div style={{fontSize:11,color:'var(--tm)',marginTop:4}}>PNG, JPG accepted</div>
                <input ref={proofRef} type="file" accept="image/*" style={{display:'none'}} onChange={e=>handleProofUpload(e,uploadOrder.id)}/>
              </div>
              <div style={{display:'flex',gap:8,marginTop:10}}>
                <button className="btn btn-s btn-sm" style={{flex:1,justifyContent:'center'}} onClick={()=>proofRef.current?.click()}><Camera size={12}/>Use Camera</button>
                <button className="btn btn-s btn-sm" style={{flex:1,justifyContent:'center'}} onClick={()=>proofRef.current?.click()}><GalleryHorizontal size={12}/>From Gallery</button>
              </div>
            </div>
            <div style={{fontSize:12,color:'var(--ts)',marginTop:14,padding:'10px 12px',background:'var(--elevated)',borderRadius:'var(--rsm)',display:'flex',alignItems:'flex-start',gap:8}}>
              <AlertCircle size={13} color="var(--amber)" style={{flexShrink:0,marginTop:1}}/>
              After uploading, the vendor will review your proof and confirm payment within 24 hours.
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

// ═══════════════════════════════════════════════════════════════════════════
// WHATSAPP AI AUTOMATION
// ═══════════════════════════════════════════════════════════════════════════
function WhatsAppPage({products,currency,plan,onUpgrade,toast}) {
  const [messages,setMessages]=useState([
    {from:'bot',text:'Hello 👋 Welcome to Adaeze\'s Boutique! How can I help you today?\n\n1️⃣ View Products\n2️⃣ Track Order\n3️⃣ Talk to Vendor',time:'10:00'},
  ]);
  const [input,setInput]=useState('');
  const [isTyping,setIsTyping]=useState(false);
  const [botEnabled,setBotEnabled]=useState(true);
  const [aiUsed,setAiUsed]=useState(3);
  const chatRef=useRef();

  const MAX_AI = plan==='free'?PLANS.free.aiMsg:999;

  useEffect(()=>{ if(chatRef.current) chatRef.current.scrollTop=chatRef.current.scrollHeight; },[messages]);

  const addMsg=(from,text)=>setMessages(m=>[...m,{from,text,time:new Date().toLocaleTimeString('en',{hour:'2-digit',minute:'2-digit'})}]);

  const botReply=async(userMsg)=>{
    if(aiUsed>=MAX_AI){onUpgrade();return;}
    setIsTyping(true);
    setAiUsed(n=>n+1);
    await new Promise(r=>setTimeout(r,1200));
    const lower=userMsg.toLowerCase();
    let reply='';
    if(lower.includes('1')||lower.includes('view product')||lower.includes('product')){
      reply=`Here are our available products:\n\n${products.slice(0,4).map((p,i)=>`${i+1}. ${p.name} – ${fmt(p.price,p.currency)}`).join('\n')}\n\nReply with a product number to order, or type the name to search 🛍️`;
    } else if(lower.includes('2')||lower.includes('track')||lower.includes('order')){
      reply='Please share your Order ID (e.g. ORD-0041) and I will check the status for you 📦';
    } else if(lower.includes('3')||lower.includes('vendor')||lower.includes('human')){
      reply='Connecting you with the vendor... 🔄\n\nThe vendor will respond shortly. For urgent matters, call: +234 801 234 5678';
    } else if(lower.includes('ord-')){
      const oid=userMsg.match(/ORD-\d+/i)?.[0]?.toUpperCase();
      const ord=oid&&[{id:'ORD-0041',status:'Delivered'},{id:'ORD-0042',status:'Processing'}].find(o=>o.id===oid);
      reply=ord?`📦 Order Status: ${ord.id}\n\nStatus: ${ord.status} ✅\nLast updated: Today, 2:00 PM\n\nNeed help? Reply 3 to talk to vendor.`:`Sorry, I couldn't find order "${oid}". Please check the ID and try again.`;
    } else {
      try {
        const res=await fetch('https://api.anthropic.com/v1/messages',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({model:'claude-sonnet-4-20250514',max_tokens:1000,system:`You are a friendly WhatsApp sales assistant for Adaeze's Boutique, a Nigerian fashion and beauty store. You help customers view products, track orders, and answer questions. Available products: ${products.map(p=>`${p.name} (${fmt(p.price,p.currency)})`).join(', ')}. Be brief, warm, and use relevant emojis. Keep responses under 100 words.`,messages:[{role:'user',content:userMsg}]})});
        const d=await res.json();
        reply=d.content?.[0]?.text||'Thanks for your message! How can I help you today? 😊';
      } catch{
        reply='Thanks for your message! 😊 How can I assist you today?\n\n1️⃣ View Products\n2️⃣ Track Order\n3️⃣ Talk to Vendor';
      }
    }
    setIsTyping(false);
    addMsg('bot',reply);
  };

  const send=()=>{
    if(!input.trim())return;
    addMsg('customer',input);
    const msg=input;
    setInput('');
    if(botEnabled) botReply(msg);
  };

  if(plan==='free'||plan==='starter') return (
    <div>
      <PageHeader title="WhatsApp AI" subtitle="Automate your WhatsApp sales"/>
      <UpgradeBanner feature="WhatsApp AI Sales Bot" plan={plan} onUpgrade={onUpgrade}/>
      <div style={{display:'grid',gridTemplateColumns:'1fr 1fr',gap:16}}>
        {['Auto-reply to customer messages','Show products from your catalog','Track orders via WhatsApp','AI-powered sales conversations'].map((f,i)=>(
          <div key={i} className="card" style={{padding:20,opacity:.5,filter:'blur(1px)'}}>
            <MessageCircle size={20} color="var(--green)" style={{marginBottom:10}}/>
            <div style={{fontSize:13,fontWeight:600,color:'var(--tp)'}}>{f}</div>
          </div>
        ))}
      </div>
    </div>
  );

  return (
    <div>
      <PageHeader title="WhatsApp AI Sales Bot" subtitle="Automated customer conversations">
        <div style={{display:'flex',alignItems:'center',gap:8}}>
          <span style={{fontSize:12,color:'var(--ts)'}}>AI Responses:</span>
          <span style={{fontFamily:'JetBrains Mono',fontSize:12,color:aiUsed>=MAX_AI*0.8?'var(--rose)':'var(--green)'}}>{aiUsed}/{MAX_AI==='999'?'∞':MAX_AI} today</span>
        </div>
        <div style={{display:'flex',alignItems:'center',gap:8,background:'var(--elevated)',border:'1px solid var(--border)',borderRadius:99,padding:'5px 12px'}}>
          <div style={{width:8,height:8,borderRadius:'50%',background:botEnabled?'var(--green)':'var(--tm)',animation:botEnabled?'pulse 2s infinite':'none'}}/>
          <span style={{fontSize:12,fontWeight:500,color:botEnabled?'var(--green)':'var(--tm)'}}>{botEnabled?'Bot Active':'Bot Paused'}</span>
          <div style={{width:36,height:20,borderRadius:99,background:botEnabled?'var(--green)':'var(--elevated)',border:'1px solid var(--border-s)',position:'relative',cursor:'pointer',transition:'var(--tr)',marginLeft:4}} onClick={()=>setBotEnabled(b=>!b)}>
            <div style={{position:'absolute',top:2,left:botEnabled?18:2,width:14,height:14,borderRadius:'50%',background:'#fff',transition:'left .2s',boxShadow:'0 1px 4px rgba(0,0,0,.3)'}}/>
          </div>
        </div>
      </PageHeader>

      <div style={{display:'grid',gridTemplateColumns:'1fr 380px',gap:16}}>
        {/* Chat Simulator */}
        <div className="card" style={{display:'flex',flexDirection:'column',height:560}}>
          <div style={{padding:'14px 18px',borderBottom:'1px solid var(--border)',display:'flex',alignItems:'center',gap:10,background:'rgba(37,211,102,0.08)',borderRadius:'var(--r) var(--r) 0 0'}}>
            <div style={{width:38,height:38,borderRadius:'50%',background:'var(--green)',display:'flex',alignItems:'center',justifyContent:'center',fontSize:18}}>👗</div>
            <div>
              <div style={{fontWeight:600,fontSize:14,color:'var(--tp)'}}>Adaeze's Boutique</div>
              <div style={{fontSize:11,color:'var(--green)',display:'flex',alignItems:'center',gap:4}}><div style={{width:6,height:6,borderRadius:'50%',background:'var(--green)'}}/>AI Bot Online</div>
            </div>
          </div>
          <div ref={chatRef} style={{flex:1,overflowY:'auto',padding:16,display:'flex',flexDirection:'column',gap:10,background:'linear-gradient(180deg,rgba(8,12,20,0.5),var(--bg))'}}>
            {messages.map((m,i)=>(
              <div key={i} style={{display:'flex',justifyContent:m.from==='customer'?'flex-end':'flex-start',animation:'fadeIn .2s ease'}}>
                <div style={{
                  maxWidth:'78%',padding:'9px 13px',borderRadius:m.from==='customer'?'14px 14px 4px 14px':'14px 14px 14px 4px',
                  background:m.from==='customer'?'var(--green)':'var(--elevated)',
                  color:'var(--tp)',fontSize:13,lineHeight:1.5,whiteSpace:'pre-wrap',
                  border:`1px solid ${m.from==='customer'?'transparent':'var(--border)'}`,
                }}>
                  {m.text}
                  <div style={{fontSize:10,color:m.from==='customer'?'rgba(255,255,255,0.6)':'var(--tm)',marginTop:4,textAlign:'right'}}>{m.time}</div>
                </div>
              </div>
            ))}
            {isTyping&&(
              <div style={{display:'flex',justifyContent:'flex-start'}}>
                <div style={{padding:'10px 14px',background:'var(--elevated)',borderRadius:'14px 14px 14px 4px',border:'1px solid var(--border)',display:'flex',gap:4,alignItems:'center'}}>
                  {[0,1,2].map(i=><div key={i} style={{width:6,height:6,borderRadius:'50%',background:'var(--ts)',animation:`pulse 1.2s ease ${i*0.2}s infinite`}}/>)}
                </div>
              </div>
            )}
          </div>
          <div style={{padding:'12px 14px',borderTop:'1px solid var(--border)',display:'flex',gap:8}}>
            <input className="inp" placeholder="Simulate customer message..." value={input} onChange={e=>setInput(e.target.value)} onKeyDown={e=>e.key==='Enter'&&send()} style={{flex:1}}/>
            <button className="btn btn-p" onClick={send}><Send size={14}/></button>
          </div>
        </div>

        {/* Settings & Stats */}
        <div style={{display:'flex',flexDirection:'column',gap:14}}>
          <div className="card" style={{padding:18}}>
            <div style={{fontFamily:'Outfit',fontWeight:700,fontSize:14,marginBottom:14}}>Bot Settings</div>
            {[['Auto-greet new customers','Enabled'],['Show product catalog','Enabled'],['Accept order enquiries','Enabled'],['Track orders automatically','Enabled'],['Escalate to human','Enabled']].map(([k,v],i)=>(
              <div key={k} style={{display:'flex',justifyContent:'space-between',alignItems:'center',padding:'9px 0',borderBottom:i<4?'1px solid var(--border)':'none'}}>
                <span style={{fontSize:12,color:'var(--ts)'}}>{k}</span>
                <span className="badge b-green" style={{fontSize:10}}>{v}</span>
              </div>
            ))}
          </div>
          <div className="card" style={{padding:18}}>
            <div style={{fontFamily:'Outfit',fontWeight:700,fontSize:14,marginBottom:14}}>This Week</div>
            {[['Conversations',42,'var(--blue)'],['Orders via WhatsApp',8,'var(--green)'],['Auto-resolved',87,'var(--violet)'],['Avg response time','<2s','var(--amber)']].map(([l,v,c])=>(
              <div key={l} style={{display:'flex',justifyContent:'space-between',alignItems:'center',padding:'8px 0',borderBottom:'1px solid var(--border)'}}>
                <span style={{fontSize:12,color:'var(--ts)'}}>{l}</span>
                <span style={{fontSize:13,fontWeight:700,color:c,fontFamily:typeof v==='number'?'JetBrains Mono':'DM Sans'}}>{typeof v==='number'?v:v}{l==='Auto-resolved'?'%':''}</span>
              </div>
            ))}
          </div>
          <div className="card" style={{padding:18}}>
            <div style={{fontFamily:'Outfit',fontWeight:700,fontSize:14,marginBottom:10}}>Quick Replies</div>
            {['Welcome message','Products catalog','Order tracking','Payment details'].map((r,i)=>(
              <div key={i} style={{display:'flex',alignItems:'center',justifyContent:'space-between',padding:'8px 0',borderBottom:i<3?'1px solid var(--border)':'none'}}>
                <span style={{fontSize:12,color:'var(--ts)'}}>{r}</span>
                <button className="btn btn-g btn-sm" style={{fontSize:11}}><Edit2 size={10}/>Edit</button>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

// ═══════════════════════════════════════════════════════════════════════════
// AUTOMATION / AI CONTENT
// ═══════════════════════════════════════════════════════════════════════════
function AutomationPage({products,plan,toast,onUpgrade}) {
  const [prompt,setPrompt]=useState('');
  const [result,setResult]=useState('');
  const [loading,setLoading]=useState(false);
  const [type,setType]=useState('caption');
  const [selProduct,setSelProduct]=useState('');
  const [aiUsed,setAiUsed]=useState(5);
  const MAX=plan==='free'?PLANS.free.aiMsg:9999;

  const types=[{v:'caption',l:'Product Caption',i:MessageSquare},{v:'social',l:'Social Post',i:Share2},{v:'ad',l:'Ad Copy',i:Target},{v:'hashtags',l:'Hashtags',i:Hash},{v:'email',l:'Email Campaign',i:Mail}];

  const generate=async()=>{
    if(aiUsed>=MAX){onUpgrade();return;}
    const p=products.find(x=>x.id===selProduct);
    const ctx=p?`Product: "${p.name}" — ${p.desc} — Price: ${fmt(p.price,p.currency)}`:'';
    const userMsg=prompt||ctx||'Generate marketing content for an African vendor';
    setLoading(true);setResult('');
    try{
      const res=await fetch('https://api.anthropic.com/v1/messages',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({model:'claude-sonnet-4-20250514',max_tokens:1000,system:`You are ChatCart AI, a creative marketing assistant for African vendors. Generate compelling ${type} content that resonates with African audiences. Be energetic, authentic, and culturally aware. Use relevant emojis. ${plan==='free'?'Add a subtle "via ChatCart" watermark at the end.':''}`,messages:[{role:'user',content:userMsg}]})});
      const d=await res.json();
      setResult(d.content?.[0]?.text||'Could not generate content.');
      setAiUsed(n=>n+1);
      toast.show('Content generated!');
    }catch{
      setResult('Failed to generate. Please try again.');
      toast.show('Generation failed','error');
    }
    setLoading(false);
  };

  return (
    <div>
      <PageHeader title="AI Automation" subtitle="Generate marketing content with ChatCart AI">
        <span className="badge b-violet"><Cpu size={11}/>AI Powered</span>
        {plan==='free'&&<span style={{fontSize:12,color:'var(--ts)'}}>{aiUsed}/{MAX} today</span>}
      </PageHeader>

      {plan==='free'&&<LimitBar used={aiUsed} max={MAX} label="Daily AI Messages"/>}
      {aiUsed>=MAX&&<UpgradeBanner feature="Unlimited AI content generation" plan={plan} onUpgrade={onUpgrade}/>}

      <div style={{display:'grid',gridTemplateColumns:'1.2fr 0.8fr',gap:16}}>
        <div>
          <div className="card" style={{padding:22,marginBottom:14}}>
            <div style={{fontFamily:'Outfit',fontWeight:700,fontSize:15,marginBottom:18,display:'flex',alignItems:'center',gap:8}}><Sparkles size={15} color="var(--amber)"/>Content Generator</div>
            <div style={{marginBottom:14}}>
              <div className="lbl">Content Type</div>
              <div style={{display:'flex',gap:6,flexWrap:'wrap'}}>
                {types.map(t=>{const I=t.i;return(
                  <button key={t.v} onClick={()=>setType(t.v)} style={{display:'flex',alignItems:'center',gap:5,padding:'5px 11px',borderRadius:99,border:'1px solid',fontSize:12,cursor:'pointer',transition:'var(--tr)',background:type===t.v?'var(--blue-s)':'transparent',color:type===t.v?'var(--blue)':'var(--ts)',borderColor:type===t.v?'var(--blue)':'var(--border)',fontFamily:'DM Sans'}}>
                    <I size={11}/>{t.l}
                  </button>
                );})}
              </div>
            </div>
            <div style={{marginBottom:13}}><div className="lbl">Select Product (optional)</div><select className="sel" value={selProduct} onChange={e=>setSelProduct(e.target.value)}><option value="">No specific product</option>{products.map(p=><option key={p.id} value={p.id}>{p.name}</option>)}</select></div>
            <div style={{marginBottom:16}}><div className="lbl">Custom Instructions</div><textarea className="inp" rows={3} placeholder="Target audience, tone, special requirements..." value={prompt} onChange={e=>setPrompt(e.target.value)} style={{resize:'vertical'}}/></div>
            <button className="btn btn-p btn-lg" onClick={generate} disabled={loading} style={{width:'100%',justifyContent:'center',opacity:loading?.8:1}}>
              {loading?<><RefreshCw size={14} style={{animation:'spin 1s linear infinite'}}/>Generating...</>:<><Sparkles size={14}/>Generate Content</>}
            </button>
          </div>
          {(result||loading)&&(
            <div className="card" style={{padding:20}}>
              <div style={{display:'flex',alignItems:'center',justifyContent:'space-between',marginBottom:12}}>
                <div style={{fontFamily:'Outfit',fontWeight:700,fontSize:14,display:'flex',alignItems:'center',gap:6}}><Sparkles size={13} color="var(--amber)"/>Result</div>
                {result&&<button className="btn btn-s btn-sm" onClick={()=>{navigator.clipboard?.writeText(result);toast.show('Copied!')}}><Copy size={11}/>Copy</button>}
              </div>
              {loading?[80,60,90,45].map((w,i)=><div key={i} className="skel" style={{height:13,width:`${w}%`,marginBottom:8}}/>):(
                <div style={{background:'var(--elevated)',borderRadius:'var(--rsm)',padding:13,fontSize:13,color:'var(--tp)',lineHeight:1.7,whiteSpace:'pre-wrap',border:'1px solid var(--border)'}}>{result}</div>
              )}
            </div>
          )}
        </div>
        <div>
          <div className="card" style={{padding:18,marginBottom:14}}>
            <div style={{fontFamily:'Outfit',fontWeight:700,fontSize:14,marginBottom:13}}>Quick Actions</div>
            {[{l:'Promote All Products',i:Zap,c:'var(--blue)'},{l:'Generate Hashtag Pack',i:Hash,c:'var(--violet)'},{l:'Write Email Campaign',i:Mail,c:'var(--amber)'},{l:'Schedule Weekly Posts',i:Calendar,c:'var(--green)'}].map((a,i)=>{const I=a.i;return(
              <button key={i} onClick={generate} style={{width:'100%',display:'flex',alignItems:'center',gap:9,padding:'10px 11px',borderRadius:'var(--rsm)',background:'var(--elevated)',border:'1px solid var(--border)',color:'var(--tp)',cursor:'pointer',marginBottom:7,transition:'var(--tr)',fontFamily:'DM Sans',fontSize:13}}
                onMouseEnter={e=>{e.currentTarget.style.borderColor=a.c;e.currentTarget.style.background='var(--hover)'}}
                onMouseLeave={e=>{e.currentTarget.style.borderColor='var(--border)';e.currentTarget.style.background='var(--elevated)'}}
              >
                <div style={{width:28,height:28,borderRadius:7,background:`${a.c}18`,display:'flex',alignItems:'center',justifyContent:'center'}}><I size={13} color={a.c}/></div>{a.l}
              </button>
            );})}
          </div>
          <div className="card" style={{padding:18}}>
            <div style={{fontFamily:'Outfit',fontWeight:700,fontSize:14,marginBottom:12}}>Usage Today</div>
            <LimitBar used={aiUsed} max={MAX} label="AI Messages" color="var(--blue)"/>
            <LimitBar used={2} max={plan==='free'?3:30} label="Scheduled Posts" color="var(--violet)"/>
            {plan==='free'&&<button className="btn btn-gold btn-sm" style={{width:'100%',justifyContent:'center',marginTop:10}} onClick={onUpgrade}><Crown size={11}/>Upgrade for Unlimited</button>}
          </div>
        </div>
      </div>
    </div>
  );
}

// ═══════════════════════════════════════════════════════════════════════════
// SOCIAL MEDIA PAGE
// ═══════════════════════════════════════════════════════════════════════════
function SocialPage({posts,setPosts,plan,toast,onUpgrade}) {
  const [modal,setModal]=useState(false);
  const [form,setForm]=useState({content:'',platform:'Instagram',scheduleType:'now',date:'',time:'',type:'Product Promo'});
  const [postsUsed,setPostsUsed]=useState(2);
  const MAX_POSTS=plan==='free'?PLANS.free.posts:9999;
  const platforms=[{n:'Instagram',i:Instagram,c:'#e1306c'},{n:'Facebook',i:Facebook,c:'#1877f2'},{n:'TikTok',i:Video,c:'#69c9d0'},{n:'YouTube',i:Youtube,c:'#ff0000'},{n:'Twitter',i:Twitter,c:'#1da1f2'}];
  const connected=['Instagram','Facebook'];

  const submit=()=>{
    if(!form.content)return toast.show('Write post content','error');
    if(postsUsed>=MAX_POSTS){onUpgrade();return;}
    setPosts(ps=>[{id:'sp'+Date.now(),content:form.content,platform:form.platform,status:form.scheduleType==='now'?'Published':'Scheduled',scheduledAt:form.scheduleType==='schedule'?`${form.date} ${form.time}`:null,type:form.type},...ps]);
    setPostsUsed(n=>n+1);
    setModal(false);
    setForm({content:'',platform:'Instagram',scheduleType:'now',date:'',time:'',type:'Product Promo'});
    toast.show(form.scheduleType==='now'?'Post published!':'Post scheduled!');
  };

  const pColors={Published:'b-green',Scheduled:'b-blue',Draft:'b-gray'};

  return (
    <div>
      <PageHeader title="Social Media" subtitle="Manage and schedule content">
        {plan==='free'&&<span style={{fontSize:12,color:'var(--ts)'}}>{postsUsed}/{MAX_POSTS} posts this week</span>}
        <button className="btn btn-p" onClick={()=>postsUsed>=MAX_POSTS?onUpgrade():setModal(true)}><Plus size={13}/>Create Post</button>
      </PageHeader>

      {plan==='free'&&postsUsed>=MAX_POSTS&&<UpgradeBanner feature="Unlimited post scheduling" plan={plan} onUpgrade={onUpgrade}/>}

      <div className="card" style={{padding:18,marginBottom:16}}>
        <div style={{fontFamily:'Outfit',fontWeight:700,fontSize:14,marginBottom:13}}>Connected Accounts</div>
        <div style={{display:'flex',gap:11,flexWrap:'wrap'}}>
          {platforms.map(p=>{const I=p.i;const ok=connected.includes(p.n);return(
            <div key={p.n} style={{display:'flex',alignItems:'center',gap:9,padding:'9px 14px',borderRadius:'var(--rsm)',background:ok?`${p.c}12`:'var(--elevated)',border:`1px solid ${ok?p.c+'40':'var(--border)'}`,cursor:'pointer',transition:'var(--tr)'}}>
              <I size={17} color={ok?p.c:'var(--tm)'}/>
              <div>
                <div style={{fontSize:12,fontWeight:600,color:ok?'var(--tp)':'var(--tm)'}}>{p.n}</div>
                <div style={{fontSize:10,color:ok?'var(--green)':'var(--tm)'}}>{ok?'✓ Connected':'Not connected'}</div>
              </div>
              {!ok&&<button className="btn btn-s btn-sm" style={{marginLeft:6,fontSize:11}}>Connect</button>}
            </div>
          );})}
        </div>
      </div>

      {posts.length===0?(
        <div className="empty"><Share2 size={32} style={{opacity:.2,marginBottom:10}}/><div style={{fontSize:13,color:'var(--ts)'}}>No posts yet</div><button className="btn btn-p" style={{marginTop:12}} onClick={()=>setModal(true)}><Plus size={13}/>Create Post</button></div>
      ):(
        <div style={{display:'grid',gridTemplateColumns:'repeat(auto-fill,minmax(290px,1fr))',gap:13}}>
          {posts.map((p,i)=>{
            const Pl=platforms.find(x=>x.n===p.platform);
            const PI=Pl?Pl.i:Globe;
            const pc=Pl?.c||'var(--blue)';
            return (
              <div key={p.id} className="card" style={{padding:17,animation:`fadeIn .3s ease ${i*40}ms both`}}>
                <div style={{display:'flex',alignItems:'flex-start',justifyContent:'space-between',marginBottom:11}}>
                  <div style={{display:'flex',alignItems:'center',gap:8}}>
                    <div style={{width:30,height:30,borderRadius:7,background:`${pc}18`,display:'flex',alignItems:'center',justifyContent:'center'}}><PI size={15} color={pc}/></div>
                    <div><div style={{fontSize:12,fontWeight:600,color:'var(--tp)'}}>{p.platform}</div><div style={{fontSize:10,color:'var(--tm)'}}>{p.type}</div></div>
                  </div>
                  <span className={`badge ${pColors[p.status]}`}>{p.status}</span>
                </div>
                <p style={{fontSize:12,color:'var(--ts)',lineHeight:1.6,display:'-webkit-box',WebkitLineClamp:3,WebkitBoxOrient:'vertical',overflow:'hidden',marginBottom:10}}>{p.content}</p>
                {p.scheduledAt&&<div style={{display:'flex',alignItems:'center',gap:5,fontSize:11,color:'var(--tm)',marginBottom:9}}><Clock size={10}/>{p.scheduledAt}</div>}
                <div style={{display:'flex',gap:6}}>
                  <button className="btn btn-s btn-sm" style={{flex:1,justifyContent:'center',fontSize:11}}><Edit2 size={10}/>Edit</button>
                  <button className="btn btn-d btn-sm" onClick={()=>setPosts(ps=>ps.filter(x=>x.id!==p.id))}><Trash2 size={10}/></button>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {modal&&(
        <div className="overlay" onClick={e=>e.target===e.currentTarget&&setModal(false)}>
          <div className="modal" style={{maxWidth:540}}>
            <div style={{display:'flex',alignItems:'center',justifyContent:'space-between',marginBottom:22}}>
              <div style={{fontFamily:'Outfit',fontWeight:700,fontSize:17}}>Create Post</div>
              <button className="btn btn-g btn-ico" onClick={()=>setModal(false)}><X size={15}/></button>
            </div>
            <div style={{display:'grid',gap:13}}>
              <div style={{display:'grid',gridTemplateColumns:'1fr 1fr',gap:12}}>
                <div><div className="lbl">Platform</div><select className="sel" value={form.platform} onChange={e=>setForm({...form,platform:e.target.value})}>{platforms.map(p=><option key={p.n}>{p.n}</option>)}</select></div>
                <div><div className="lbl">Post Type</div><select className="sel" value={form.type} onChange={e=>setForm({...form,type:e.target.value})}>{'Product Promo,Brand Story,Announcement,Engagement,Campaign'.split(',').map(t=><option key={t}>{t}</option>)}</select></div>
              </div>
              <div><div className="lbl">Content</div><textarea className="inp" rows={5} placeholder="Write your post content..." value={form.content} onChange={e=>setForm({...form,content:e.target.value})} style={{resize:'vertical'}}/><div style={{fontSize:11,color:'var(--tm)',marginTop:3,textAlign:'right'}}>{form.content.length} chars</div></div>
              <div><div className="lbl">Schedule</div>
                <div style={{display:'flex',gap:7}}>
                  {[{v:'now',l:'Post Now'},{v:'schedule',l:'Schedule'},{v:'draft',l:'Draft'}].map(o=>(
                    <button key={o.v} onClick={()=>setForm({...form,scheduleType:o.v})} style={{flex:1,padding:'8px',borderRadius:'var(--rsm)',border:'1px solid',fontSize:12,fontWeight:500,cursor:'pointer',background:form.scheduleType===o.v?'var(--blue-s)':'transparent',color:form.scheduleType===o.v?'var(--blue)':'var(--ts)',borderColor:form.scheduleType===o.v?'var(--blue)':'var(--border)',fontFamily:'DM Sans',transition:'var(--tr)'}}>{o.l}</button>
                  ))}
                </div>
              </div>
              {form.scheduleType==='schedule'&&(
                <div style={{display:'grid',gridTemplateColumns:'1fr 1fr',gap:12}}>
                  <div><div className="lbl">Date</div><input type="date" className="inp" value={form.date} onChange={e=>setForm({...form,date:e.target.value})}/></div>
                  <div><div className="lbl">Time</div><input type="time" className="inp" value={form.time} onChange={e=>setForm({...form,time:e.target.value})}/></div>
                </div>
              )}
            </div>
            <div style={{display:'flex',gap:9,marginTop:20,justifyContent:'flex-end'}}>
              <button className="btn btn-s" onClick={()=>setModal(false)}>Cancel</button>
              <button className="btn btn-p" onClick={submit}>
                {form.scheduleType==='now'?<><Send size={13}/>Publish Now</>:form.scheduleType==='schedule'?<><Calendar size={13}/>Schedule</>:<><Check size={13}/>Save Draft</>}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

// ═══════════════════════════════════════════════════════════════════════════
// ANALYTICS PAGE
// ═══════════════════════════════════════════════════════════════════════════
function AnalyticsPage({orders,products,currency,plan,onUpgrade}) {
  const total=orders.reduce((s,o)=>s+o.total,0);
  const cats=products.reduce((a,p)=>{a[p.category]=(a[p.category]||0)+1;return a;},{});
  const pieD=Object.entries(cats).map(([n,v])=>({n,v}));
  const PIE=['var(--blue)','var(--green)','var(--violet)','var(--amber)','var(--rose)','var(--cyan)'];

  return (
    <div>
      <PageHeader title="Analytics" subtitle="Track your business performance">
        <select className="sel" style={{width:140}}>
          {['Last 7 days','Last 30 days','Last 90 days','This year'].map(o=><option key={o}>{o}</option>)}
        </select>
      </PageHeader>

      {plan==='free'&&<UpgradeBanner feature="Advanced analytics & insights" plan={plan} onUpgrade={onUpgrade}/>}

      <div style={{display:'grid',gridTemplateColumns:'repeat(4,1fr)',gap:13,marginBottom:18}}>
        {[
          {l:'Total Revenue',v:fmt(total,currency),c:'+23%',col:'var(--green)',i:DollarSign},
          {l:'Avg Order Value',v:fmt(Math.round(total/orders.length)||0,currency),c:'+5%',col:'var(--blue)',i:TrendingUp},
          {l:'Conversion Rate',v:'3.4%',c:'+0.8%',col:'var(--violet)',i:Target},
          {l:'Repeat Buyers',v:'28%',c:'+4%',col:'var(--amber)',i:Users},
        ].map((s,i)=>{const I=s.i;return(
          <div key={i} className="card" style={{padding:18,animation:`fadeIn .35s ease ${i*50}ms both`}}>
            <div style={{display:'flex',alignItems:'center',justifyContent:'space-between',marginBottom:10}}><I size={15} color={s.col}/><span style={{fontSize:11,fontWeight:600,color:'var(--green)',background:'var(--green-s)',padding:'2px 7px',borderRadius:99}}>{s.c}</span></div>
            <div style={{fontFamily:'Outfit',fontWeight:800,fontSize:20,color:'var(--tp)',letterSpacing:'-0.02em'}}>{s.v}</div>
            <div style={{fontSize:11,color:'var(--tm)',marginTop:3}}>{s.l}</div>
          </div>
        );})}
      </div>

      <div style={{display:'grid',gridTemplateColumns:'1.5fr 1fr',gap:14,marginBottom:14}}>
        <div className="card" style={{padding:20,filter:plan==='free'?'blur(2px)':'none',pointerEvents:plan==='free'?'none':'auto'}}>
          <div style={{fontFamily:'Outfit',fontWeight:700,fontSize:15,marginBottom:16}}>Revenue & Orders Trend</div>
          <ResponsiveContainer width="100%" height={210}>
            <LineChart data={SALES_DATA} margin={{top:5,right:5,left:-20,bottom:0}}>
              <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.04)"/>
              <XAxis dataKey="month" tick={{fontSize:11,fill:'var(--tm)'}} axisLine={false} tickLine={false}/>
              <YAxis tick={{fontSize:11,fill:'var(--tm)'}} axisLine={false} tickLine={false}/>
              <Tooltip content={<ChartTooltip currency={currency}/>}/>
              <Line type="monotone" dataKey="revenue" name="revenue" stroke="var(--blue)" strokeWidth={2.5} dot={{fill:'var(--blue)',r:4}}/>
              <Line type="monotone" dataKey="orders" stroke="var(--violet)" strokeWidth={2} strokeDasharray="5 3" dot={false}/>
            </LineChart>
          </ResponsiveContainer>
        </div>
        <div className="card" style={{padding:20}}>
          <div style={{fontFamily:'Outfit',fontWeight:700,fontSize:15,marginBottom:16}}>Categories</div>
          <ResponsiveContainer width="100%" height={140}>
            <PieChart><Pie data={pieD} cx="50%" cy="50%" outerRadius={55} dataKey="v" label={({n,percent})=>`${n} ${(percent*100).toFixed(0)}%`} labelLine={false} fontSize={9}>{pieD.map((_,i)=><Cell key={i} fill={PIE[i%PIE.length]}/>)}</Pie><Tooltip/></PieChart>
          </ResponsiveContainer>
          <div style={{display:'flex',flexWrap:'wrap',gap:7,marginTop:10}}>
            {pieD.map((d,i)=><div key={d.n} style={{display:'flex',alignItems:'center',gap:4,fontSize:11,color:'var(--ts)'}}><div style={{width:7,height:7,borderRadius:2,background:PIE[i%PIE.length]}}/>{d.n}</div>)}
          </div>
        </div>
      </div>

      <div className="card" style={{padding:20}}>
        <div style={{fontFamily:'Outfit',fontWeight:700,fontSize:15,marginBottom:16}}>Order Status Breakdown</div>
        <div style={{display:'grid',gridTemplateColumns:'repeat(4,1fr)',gap:11}}>
          {['Pending','Processing','Delivered','Cancelled'].map(s=>{
            const count=orders.filter(o=>o.status===s).length;
            const pct=Math.round((count/orders.length)*100)||0;
            const sc=STATUS_CONFIG[s];
            const SI=sc.icon;
            const cols={Pending:'var(--amber)',Processing:'var(--blue)',Delivered:'var(--green)',Cancelled:'var(--rose)'};
            return(
              <div key={s} style={{textAlign:'center',padding:14,background:'var(--elevated)',borderRadius:'var(--rsm)',border:'1px solid var(--border)'}}>
                <SI size={16} color={cols[s]} style={{marginBottom:7}}/>
                <div style={{fontSize:20,fontWeight:800,fontFamily:'Outfit',color:'var(--tp)'}}>{count}</div>
                <div style={{fontSize:11,color:'var(--tm)',marginTop:3}}>{s}</div>
                <div style={{fontSize:11,color:cols[s],marginTop:4}}>{pct}%</div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}

// ═══════════════════════════════════════════════════════════════════════════
// SETTINGS PAGE
// ═══════════════════════════════════════════════════════════════════════════
function SettingsPage({currency,setCurrency,plan,onUpgrade,toast}) {
  const [tab,setTab]=useState('profile');
  const [profile,setProfile]=useState({name:'Adaeze Vendor',email:'adaeze@chatcart.ng',phone:'+234 801 234 5678',store:"Adaeze's Boutique",country:'Nigeria',bio:'Premium African fashion and beauty.'});
  const [bank,setBank]=useState({bank:'Access Bank',name:'Adaeze Vendor',account:'0123456789'});
  const [pw,setPw]=useState({current:'',new:'',confirm:''});

  const tabs=[{id:'profile',l:'Profile',i:User},{id:'currency',l:'Currency',i:DollarSign},{id:'bank',l:'Bank Details',i:Wallet},{id:'security',l:'Security',i:Shield},{id:'plan',l:'Plan & Billing',i:CreditCard},{id:'notifications',l:'Notifications',i:Bell}];

  return (
    <div>
      <PageHeader title="Settings" subtitle="Manage your account"/>
      <div style={{display:'grid',gridTemplateColumns:'210px 1fr',gap:14}}>
        <div className="card" style={{padding:7,alignSelf:'start'}}>
          {tabs.map(t=>{const I=t.i;return(
            <button key={t.id} onClick={()=>setTab(t.id)} style={{width:'100%',display:'flex',alignItems:'center',gap:9,padding:'8px 11px',borderRadius:'var(--rsm)',border:'none',background:tab===t.id?'var(--blue-s)':'transparent',color:tab===t.id?'var(--blue)':'var(--ts)',cursor:'pointer',fontFamily:'DM Sans',fontSize:13,fontWeight:500,transition:'var(--tr)',marginBottom:2}}
              onMouseEnter={e=>{if(tab!==t.id)e.currentTarget.style.background='var(--elevated)'}}
              onMouseLeave={e=>{if(tab!==t.id)e.currentTarget.style.background='transparent'}}
            ><I size={14}/>{t.l}</button>
          );})}
        </div>
        <div>
          {tab==='profile'&&(
            <div className="card" style={{padding:24}}>
              <div style={{fontFamily:'Outfit',fontWeight:700,fontSize:16,marginBottom:22}}>Profile Information</div>
              <div style={{display:'flex',alignItems:'center',gap:14,marginBottom:22}}>
                <div style={{width:64,height:64,borderRadius:'50%',background:'linear-gradient(135deg,var(--green),var(--blue))',display:'flex',alignItems:'center',justifyContent:'center',fontSize:24,fontWeight:700,color:'#fff'}}>A</div>
                <div><button className="btn btn-s btn-sm"><Upload size={11}/>Upload Photo</button><div style={{fontSize:11,color:'var(--tm)',marginTop:5}}>JPG, PNG up to 2MB</div></div>
              </div>
              <div style={{display:'grid',gap:14}}>
                <div style={{display:'grid',gridTemplateColumns:'1fr 1fr',gap:13}}>
                  <div><label className="lbl">Full Name</label><input className="inp" value={profile.name} onChange={e=>setProfile({...profile,name:e.target.value})}/></div>
                  <div><label className="lbl">Store Name</label><input className="inp" value={profile.store} onChange={e=>setProfile({...profile,store:e.target.value})}/></div>
                </div>
                <div style={{display:'grid',gridTemplateColumns:'1fr 1fr',gap:13}}>
                  <div><label className="lbl">Email</label><input className="inp" type="email" value={profile.email} onChange={e=>setProfile({...profile,email:e.target.value})}/></div>
                  <div><label className="lbl">Phone</label><input className="inp" value={profile.phone} onChange={e=>setProfile({...profile,phone:e.target.value})}/></div>
                </div>
                <div style={{display:'grid',gridTemplateColumns:'1fr 1fr',gap:13}}>
                  <div><label className="lbl">Country</label><select className="sel" value={profile.country} onChange={e=>setProfile({...profile,country:e.target.value})}>{['Nigeria','Ghana','Kenya','South Africa','UK','USA','Canada','UAE'].map(c=><option key={c}>{c}</option>)}</select></div>
                </div>
                <div><label className="lbl">Bio</label><textarea className="inp" rows={3} value={profile.bio} onChange={e=>setProfile({...profile,bio:e.target.value})} style={{resize:'vertical'}}/></div>
                <button className="btn btn-p" onClick={()=>toast.show('Profile saved!')}><Check size={13}/>Save Changes</button>
              </div>
            </div>
          )}
          {tab==='currency'&&(
            <div className="card" style={{padding:24}}>
              <div style={{fontFamily:'Outfit',fontWeight:700,fontSize:16,marginBottom:6}}>Currency</div>
              <div style={{fontSize:13,color:'var(--tm)',marginBottom:20}}>Choose your preferred display currency.</div>
              <div style={{display:'grid',gridTemplateColumns:'repeat(3,1fr)',gap:11}}>
                {Object.entries(CURRENCIES).map(([code,c])=>(
                  <div key={code} onClick={()=>{setCurrency(code);toast.show(`Currency set to ${c.n}`)}} style={{padding:'14px 16px',borderRadius:'var(--rsm)',border:`2px solid ${currency===code?'var(--blue)':'var(--border)'}`,background:currency===code?'var(--blue-s)':'var(--elevated)',cursor:'pointer',transition:'var(--tr)',display:'flex',alignItems:'center',gap:11}}>
                    <div style={{width:38,height:38,borderRadius:9,background:currency===code?'var(--blue)':'var(--card)',display:'flex',alignItems:'center',justifyContent:'center',fontSize:17,fontFamily:'JetBrains Mono',fontWeight:700,color:currency===code?'#fff':'var(--ts)'}}>{c.s}</div>
                    <div><div style={{fontWeight:600,fontSize:13,color:'var(--tp)'}}>{code}</div><div style={{fontSize:11,color:'var(--tm)'}}>{c.n}</div></div>
                    {currency===code&&<Check size={14} color="var(--blue)" style={{marginLeft:'auto'}}/>}
                  </div>
                ))}
              </div>
            </div>
          )}
          {tab==='bank'&&(
            <div className="card" style={{padding:24}}>
              <div style={{fontFamily:'Outfit',fontWeight:700,fontSize:16,marginBottom:6}}>Bank Details</div>
              <div style={{fontSize:13,color:'var(--tm)',marginBottom:20}}>These details are shown to customers for manual bank transfers.</div>
              <div style={{display:'grid',gap:14,maxWidth:440}}>
                <div><label className="lbl">Bank Name</label><input className="inp" value={bank.bank} onChange={e=>setBank({...bank,bank:e.target.value})}/></div>
                <div><label className="lbl">Account Name</label><input className="inp" value={bank.name} onChange={e=>setBank({...bank,name:e.target.value})}/></div>
                <div><label className="lbl">Account Number</label><input className="inp" value={bank.account} onChange={e=>setBank({...bank,account:e.target.value})} style={{fontFamily:'JetBrains Mono'}}/></div>
                <div style={{background:'var(--amber-s)',border:'1px solid rgba(245,158,11,0.25)',borderRadius:'var(--rsm)',padding:'11px 14px',fontSize:12,color:'var(--amber)',display:'flex',gap:8}}>
                  <AlertTriangle size={14} style={{flexShrink:0,marginTop:1}}/>
                  Ensure your bank details are correct. Customers will transfer payment to this account.
                </div>
                <button className="btn btn-p" onClick={()=>toast.show('Bank details saved!')}><Check size={13}/>Save Bank Details</button>
              </div>
            </div>
          )}
          {tab==='security'&&(
            <div className="card" style={{padding:24}}>
              <div style={{fontFamily:'Outfit',fontWeight:700,fontSize:16,marginBottom:22}}>Security</div>
              <div style={{display:'grid',gap:14,maxWidth:400}}>
                <div><label className="lbl">Current Password</label><input className="inp" type="password" placeholder="••••••••" value={pw.current} onChange={e=>setPw({...pw,current:e.target.value})}/></div>
                <div><label className="lbl">New Password</label><input className="inp" type="password" placeholder="••••••••" value={pw.new} onChange={e=>setPw({...pw,new:e.target.value})}/></div>
                <div><label className="lbl">Confirm Password</label><input className="inp" type="password" placeholder="••••••••" value={pw.confirm} onChange={e=>setPw({...pw,confirm:e.target.value})}/></div>
                <button className="btn btn-p" onClick={()=>{if(pw.new!==pw.confirm)return toast.show('Passwords do not match','error');toast.show('Password updated!');setPw({current:'',new:'',confirm:''});}}><Lock size={13}/>Update Password</button>
              </div>
            </div>
          )}
          {tab==='plan'&&(
            <div className="card" style={{padding:24}}>
              <div style={{fontFamily:'Outfit',fontWeight:700,fontSize:16,marginBottom:6}}>Plan & Billing</div>
              <div style={{fontSize:13,color:'var(--tm)',marginBottom:20}}>Manage your subscription</div>
              <div style={{background:'linear-gradient(135deg,rgba(59,130,246,0.1),rgba(139,92,246,0.08))',border:'1px solid rgba(59,130,246,0.25)',borderRadius:'var(--r)',padding:20,marginBottom:20}}>
                <div style={{display:'flex',alignItems:'center',justifyContent:'space-between',marginBottom:8}}>
                  <div style={{fontFamily:'Outfit',fontWeight:700,fontSize:18,color:'var(--tp)'}}>{PLANS[plan].icon} {PLANS[plan].name} Plan</div>
                  <span className="badge b-blue">{plan==='free'?'Free':`$${PLANS[plan].price}/mo`}</span>
                </div>
                {plan==='free'&&(
                  <div style={{marginBottom:14}}>
                    <LimitBar used={5} max={20} label="AI Messages" color="var(--amber)"/>
                    <LimitBar used={2} max={3} label="Weekly Posts" color="var(--violet)"/>
                    <LimitBar used={4} max={5} label="Products" color="var(--rose)"/>
                  </div>
                )}
                <button className="btn btn-gold" onClick={onUpgrade}><Crown size={14}/>Upgrade Plan</button>
              </div>
              <div style={{fontFamily:'Outfit',fontWeight:600,fontSize:14,marginBottom:14}}>All Plans</div>
              <div style={{display:'grid',gap:10}}>
                {Object.entries(PLANS).filter(([k])=>k!=='free').map(([key,p])=>(
                  <div key={key} style={{display:'flex',alignItems:'center',justifyContent:'space-between',padding:'14px 18px',borderRadius:'var(--r)',border:`1px solid ${plan===key?'var(--blue)':'var(--border)'}`,background:plan===key?'var(--blue-s)':'var(--elevated)'}}>
                    <div style={{display:'flex',alignItems:'center',gap:12}}>
                      <span style={{fontSize:20}}>{p.icon}</span>
                      <div><div style={{fontWeight:600,fontSize:14,color:'var(--tp)'}}>{p.name}</div><div style={{fontSize:12,color:'var(--tm)'}}>${p.price}/month</div></div>
                    </div>
                    {plan===key?<span className="badge b-blue">Current</span>:<button className="btn btn-s btn-sm" onClick={onUpgrade}>Upgrade</button>}
                  </div>
                ))}
              </div>
            </div>
          )}
          {tab==='notifications'&&(
            <div className="card" style={{padding:24}}>
              <div style={{fontFamily:'Outfit',fontWeight:700,fontSize:16,marginBottom:22}}>Notifications</div>
              {[['New Order','Notify when a new order is placed',true],['Payment Uploaded','Customer uploads payment proof',true],['Payment Confirmed','After you confirm a payment',true],['Low Stock Alert','When stock falls below 5',true],['AI Content Ready','When AI content is generated',false],['Weekly Report','Weekly performance summary',false]].map(([n,d,on],i)=>(
                <div key={n} style={{display:'flex',alignItems:'center',justifyContent:'space-between',padding:'13px 0',borderBottom:i<5?'1px solid var(--border)':'none'}}>
                  <div><div style={{fontSize:13,fontWeight:600,color:'var(--tp)'}}>{n}</div><div style={{fontSize:11,color:'var(--tm)',marginTop:2}}>{d}</div></div>
                  <div style={{width:38,height:21,borderRadius:99,background:on?'var(--green)':'var(--elevated)',border:'1px solid',borderColor:on?'var(--green)':'var(--border)',position:'relative',cursor:'pointer',transition:'var(--tr)',flexShrink:0}} onClick={()=>toast.show('Saved')}>
                    <div style={{position:'absolute',top:2,left:on?19:2,width:15,height:15,borderRadius:'50%',background:'#fff',transition:'left .2s',boxShadow:'0 1px 4px rgba(0,0,0,.3)'}}/>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

// ═══════════════════════════════════════════════════════════════════════════
// CONTENT CREATOR PLATFORM
// ═══════════════════════════════════════════════════════════════════════════
function ScriptPage({scripts,setScripts,plan,toast,onUpgrade}) {
  const [modal,setModal]=useState(false);
  const [generating,setGenerating]=useState(false);
  const [form,setForm]=useState({topic:'',niche:'',platform:'TikTok',duration:'60',tone:'energetic'});
  const [result,setResult]=useState('');
  const [used,setUsed]=useState(1);
  const MAX=plan==='free'?3:999;

  const generate=async()=>{
    if(used>=MAX){onUpgrade();return;}
    setGenerating(true);setResult('');
    try{
      const res=await fetch('https://api.anthropic.com/v1/messages',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({model:'claude-sonnet-4-20250514',max_tokens:1000,system:'You are an expert faceless content creator and scriptwriter. Create engaging scripts optimized for social media. Format clearly with intro, body sections, and outro. Include speaking cues.',messages:[{role:'user',content:`Write a ${form.duration}-second ${form.tone} script for ${form.platform} about "${form.topic}" in the ${form.niche} niche. Include hooks, transitions, and call to action.`}]})});
      const d=await res.json();
      setResult(d.content?.[0]?.text||'Generation failed');
      setUsed(n=>n+1);
      toast.show('Script generated!');
    }catch{setResult('Failed to generate.');toast.show('Failed','error');}
    setGenerating(false);
  };

  const saveScript=()=>{
    if(!result||!form.topic)return;
    setScripts(ss=>[{id:'sc'+Date.now(),title:form.topic,content:result,duration:form.duration+'s',platform:form.platform,status:'Ready',createdAt:new Date().toISOString().split('T')[0]},...ss]);
    toast.show('Script saved!');setModal(false);setResult('');setForm({topic:'',niche:'',platform:'TikTok',duration:'60',tone:'energetic'});
  };

  return (
    <div>
      <PageHeader title="AI Script Generator" subtitle={`${used}/${MAX==='999'?'∞':MAX} scripts today`}>
        {plan==='free'&&<span style={{fontSize:12,color:used>=MAX?'var(--rose)':'var(--ts)'}}>{used}/{MAX} used</span>}
        <button className="btn btn-p" onClick={()=>used>=MAX?onUpgrade():setModal(true)}><Plus size={13}/>New Script</button>
      </PageHeader>

      {plan==='free'&&<LimitBar used={used} max={MAX} label="Daily Scripts"/>}

      {scripts.length===0?(
        <div className="empty"><FileText size={32} style={{opacity:.2,marginBottom:10}}/><div style={{fontSize:13,color:'var(--ts)'}}>No scripts yet</div><button className="btn btn-p" style={{marginTop:12}} onClick={()=>setModal(true)}><Plus size={13}/>Generate Script</button></div>
      ):(
        <div style={{display:'grid',gridTemplateColumns:'repeat(auto-fill,minmax(280px,1fr))',gap:14}}>
          {scripts.map((s,i)=>(
            <div key={s.id} className="card" style={{padding:18,animation:`fadeIn .3s ease ${i*40}ms both`}}>
              <div style={{display:'flex',alignItems:'flex-start',justifyContent:'space-between',marginBottom:10}}>
                <div style={{width:36,height:36,borderRadius:9,background:'var(--violet-s)',display:'flex',alignItems:'center',justifyContent:'center'}}><FileText size={16} color="var(--violet)"/></div>
                <span className={`badge ${s.status==='Ready'?'b-green':'b-gray'}`}>{s.status}</span>
              </div>
              <div style={{fontWeight:600,fontSize:14,color:'var(--tp)',marginBottom:4}}>{s.title}</div>
              <p style={{fontSize:12,color:'var(--ts)',lineHeight:1.6,display:'-webkit-box',WebkitLineClamp:3,WebkitBoxOrient:'vertical',overflow:'hidden',marginBottom:12}}>{s.content}</p>
              <div style={{display:'flex',gap:8,flexWrap:'wrap',marginBottom:12}}>
                <span className="badge b-blue" style={{fontSize:10}}>{s.platform}</span>
                <span className="badge b-gray" style={{fontSize:10}}><Clock size={9}/>{s.duration}</span>
              </div>
              <div style={{display:'flex',gap:6}}>
                <button className="btn btn-s btn-sm" style={{flex:1,justifyContent:'center',fontSize:11}}><Eye size={10}/>View</button>
                <button className="btn btn-s btn-sm" style={{flex:1,justifyContent:'center',fontSize:11}}><Copy size={10}/>Copy</button>
                <button className="btn btn-d btn-sm" onClick={()=>setScripts(ss=>ss.filter(x=>x.id!==s.id))}><Trash2 size={10}/></button>
              </div>
            </div>
          ))}
        </div>
      )}

      {modal&&(
        <div className="overlay" onClick={e=>e.target===e.currentTarget&&setModal(false)}>
          <div className="modal" style={{maxWidth:560}}>
            <div style={{display:'flex',alignItems:'center',justifyContent:'space-between',marginBottom:22}}>
              <div style={{fontFamily:'Outfit',fontWeight:700,fontSize:17}}>Generate AI Script</div>
              <button className="btn btn-g btn-ico" onClick={()=>setModal(false)}><X size={15}/></button>
            </div>
            <div style={{display:'grid',gap:13}}>
              <div><label className="lbl">Video Topic *</label><input className="inp" placeholder="e.g. 5 skincare tips for glowing skin" value={form.topic} onChange={e=>setForm({...form,topic:e.target.value})}/></div>
              <div><label className="lbl">Content Niche</label><input className="inp" placeholder="e.g. beauty, finance, fashion, fitness" value={form.niche} onChange={e=>setForm({...form,niche:e.target.value})}/></div>
              <div style={{display:'grid',gridTemplateColumns:'1fr 1fr 1fr',gap:11}}>
                <div><label className="lbl">Platform</label><select className="sel" value={form.platform} onChange={e=>setForm({...form,platform:e.target.value})}>{['TikTok','YouTube','Instagram','Facebook'].map(p=><option key={p}>{p}</option>)}</select></div>
                <div><label className="lbl">Duration (sec)</label><select className="sel" value={form.duration} onChange={e=>setForm({...form,duration:e.target.value})}>{['15','30','60','90','120','300'].map(d=><option key={d}>{d}</option>)}</select></div>
                <div><label className="lbl">Tone</label><select className="sel" value={form.tone} onChange={e=>setForm({...form,tone:e.target.value})}>{['energetic','calm','professional','humorous','motivational'].map(t=><option key={t}>{t}</option>)}</select></div>
              </div>
            </div>
            <button className="btn btn-p btn-lg" onClick={generate} disabled={generating} style={{width:'100%',justifyContent:'center',margin:'18px 0 0',opacity:generating?.8:1}}>
              {generating?<><RefreshCw size={14} style={{animation:'spin 1s linear infinite'}}/>Generating Script...</>:<><Sparkles size={14}/>Generate Script</>}
            </button>
            {result&&(
              <div style={{marginTop:16}}>
                <div style={{fontFamily:'Outfit',fontWeight:600,fontSize:14,marginBottom:8,display:'flex',alignItems:'center',justifyContent:'space-between'}}>
                  Generated Script
                  <button className="btn btn-s btn-sm" onClick={()=>{navigator.clipboard?.writeText(result);toast.show('Copied!')}}><Copy size={11}/>Copy</button>
                </div>
                <div style={{background:'var(--elevated)',borderRadius:'var(--rsm)',padding:13,fontSize:12,color:'var(--tp)',lineHeight:1.7,whiteSpace:'pre-wrap',maxHeight:220,overflowY:'auto',border:'1px solid var(--border)'}}>{result}</div>
                <button className="btn btn-p" style={{marginTop:12}} onClick={saveScript}><Check size={13}/>Save Script</button>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}

function VoicePage({plan,onUpgrade,toast}) {
  if(plan==='free') return(
    <div>
      <PageHeader title="Voiceover AI" subtitle="Generate AI voiceovers for your content"/>
      <UpgradeBanner feature="AI Voiceover Generation" plan={plan} onUpgrade={onUpgrade}/>
      <div style={{display:'grid',gridTemplateColumns:'1fr 1fr',gap:14,opacity:.4,pointerEvents:'none'}}>
        {['Natural human voices','Multiple languages','Script to audio','Background music'].map((f,i)=>(
          <div key={i} className="card" style={{padding:20}}><Mic size={20} color="var(--cyan)" style={{marginBottom:10}}/><div style={{fontSize:13,fontWeight:600,color:'var(--tp)'}}>{f}</div></div>
        ))}
      </div>
    </div>
  );
  const [text,setText]=useState('');
  const [voice,setVoice]=useState('Bella');
  const [generating,setGenerating]=useState(false);

  return(
    <div>
      <PageHeader title="Voiceover AI" subtitle="Generate realistic AI voiceovers">
        <span className="badge b-cyan"><Mic size={11}/>AI Voices</span>
      </PageHeader>
      <div style={{display:'grid',gridTemplateColumns:'1.2fr 0.8fr',gap:16}}>
        <div className="card" style={{padding:22}}>
          <div style={{fontFamily:'Outfit',fontWeight:700,fontSize:15,marginBottom:18,display:'flex',alignItems:'center',gap:8}}><Mic size={15} color="var(--cyan)"/>Generate Voiceover</div>
          <div style={{marginBottom:14}}><label className="lbl">Script / Text</label><textarea className="inp" rows={6} placeholder="Paste your script here to convert to voice..." value={text} onChange={e=>setText(e.target.value)} style={{resize:'vertical'}}/><div style={{fontSize:11,color:'var(--tm)',marginTop:3,textAlign:'right'}}>{text.length} chars</div></div>
          <div style={{display:'grid',gridTemplateColumns:'1fr 1fr',gap:12,marginBottom:16}}>
            <div><label className="lbl">Voice</label><select className="sel" value={voice} onChange={e=>setVoice(e.target.value)}>{['Bella','James','Amara','Kofi','Sofia'].map(v=><option key={v}>{v}</option>)}</select></div>
            <div><label className="lbl">Language</label><select className="sel"><option>English</option><option>Pidgin</option><option>Yoruba</option><option>Igbo</option></select></div>
          </div>
          <button className="btn btn-p btn-lg" style={{width:'100%',justifyContent:'center'}} onClick={async()=>{setGenerating(true);await new Promise(r=>setTimeout(r,2000));setGenerating(false);toast.show('Voiceover generated! (Demo mode)');}} disabled={generating||!text}>
            {generating?<><RefreshCw size={14} style={{animation:'spin 1s linear infinite'}}/>Generating...</>:<><Headphones size={14}/>Generate Voiceover</>}
          </button>
        </div>
        <div>
          <div className="card" style={{padding:20,marginBottom:14}}>
            <div style={{fontFamily:'Outfit',fontWeight:700,fontSize:14,marginBottom:14}}>Voice Library</div>
            {[{n:'Bella',lang:'English',style:'Warm & Clear'},{n:'James',lang:'English',style:'Deep & Professional'},{n:'Amara',lang:'English/Pidgin',style:'Natural African'},{n:'Kofi',lang:'English',style:'Upbeat & Energetic'}].map((v,i)=>(
              <div key={v.n} onClick={()=>setVoice(v.n)} style={{display:'flex',alignItems:'center',gap:10,padding:'10px 0',borderBottom:i<3?'1px solid var(--border)':'none',cursor:'pointer'}}>
                <div style={{width:34,height:34,borderRadius:'50%',background:`hsl(${i*60},60%,40%)`,display:'flex',alignItems:'center',justifyContent:'center',fontSize:13,fontWeight:700,color:'#fff'}}>{v.n[0]}</div>
                <div style={{flex:1}}><div style={{fontSize:12,fontWeight:600,color:'var(--tp)'}}>{v.n}</div><div style={{fontSize:11,color:'var(--tm)'}}>{v.style}</div></div>
                <div style={{display:'flex',gap:6}}>
                  <button className="btn btn-g btn-ico btn-sm"><Play size={11}/></button>
                  {voice===v.n&&<Check size={13} color="var(--green)"/>}
                </div>
              </div>
            ))}
          </div>
          <div className="card" style={{padding:20}}>
            <div style={{fontFamily:'Outfit',fontWeight:700,fontSize:14,marginBottom:10}}>Recent Voiceovers</div>
            <div style={{textAlign:'center',padding:'16px 0',color:'var(--tm)',fontSize:12}}>No voiceovers yet</div>
          </div>
        </div>
      </div>
    </div>
  );
}

function VideoPage({plan,onUpgrade,toast}) {
  if(plan==='free') return(
    <div>
      <PageHeader title="Video AI" subtitle="Generate AI videos for social media"/>
      <UpgradeBanner feature="AI Video Generation" plan={plan} onUpgrade={onUpgrade}/>
    </div>
  );
  return(
    <div>
      <PageHeader title="Video AI" subtitle="Generate faceless AI videos">
        <span className="badge b-rose"><Film size={11}/>Video AI</span>
      </PageHeader>
      <div style={{display:'grid',gridTemplateColumns:'1.2fr 0.8fr',gap:16}}>
        <div className="card" style={{padding:22}}>
          <div style={{fontFamily:'Outfit',fontWeight:700,fontSize:15,marginBottom:18}}>Create AI Video</div>
          <div style={{display:'grid',gap:13}}>
            <div><label className="lbl">Script / Prompt</label><textarea className="inp" rows={5} placeholder="Describe your video or paste a script..." style={{resize:'vertical'}}/></div>
            <div style={{display:'grid',gridTemplateColumns:'1fr 1fr',gap:12}}>
              <div><label className="lbl">Video Style</label><select className="sel"><option>Talking head</option><option>Slideshow</option><option>Animation</option><option>B-roll</option></select></div>
              <div><label className="lbl">Aspect Ratio</label><select className="sel"><option>9:16 (TikTok/Reels)</option><option>16:9 (YouTube)</option><option>1:1 (Instagram)</option></select></div>
            </div>
            <div><label className="lbl">Background Music</label><select className="sel"><option>Upbeat pop</option><option>Chill lo-fi</option><option>Inspirational</option><option>No music</option></select></div>
          </div>
          <button className="btn btn-p btn-lg" style={{width:'100%',justifyContent:'center',marginTop:16}} onClick={()=>toast.show('Video queued for generation! (Demo)')}><Film size={14}/>Generate Video</button>
        </div>
        <div className="card" style={{padding:20}}>
          <div style={{fontFamily:'Outfit',fontWeight:700,fontSize:14,marginBottom:14}}>Recent Videos</div>
          <div className="empty" style={{padding:'30px 0'}}><Film size={28} style={{opacity:.2,marginBottom:10}}/><div style={{fontSize:12}}>No videos generated yet</div></div>
        </div>
      </div>
    </div>
  );
}

function CreatorDashboard({scripts,plan}) {
  return(
    <div>
      <div style={{display:'grid',gridTemplateColumns:'repeat(4,1fr)',gap:13,marginBottom:18}}>
        <StatCard label="Scripts Created" value={scripts.length} icon={FileText} change={20} color="var(--violet)" delay={0}/>
        <StatCard label="Total Views" value="12.4K" icon={Eye} change={35} color="var(--blue)" delay={60}/>
        <StatCard label="Posts Scheduled" value="8" icon={Calendar} change={5} color="var(--green)" delay={120}/>
        <StatCard label="Platforms" value="4" icon={Globe} change={0} color="var(--amber)" delay={180}/>
      </div>
      <div style={{display:'grid',gridTemplateColumns:'1fr 1fr',gap:14}} className="ai-1">
        <div className="card" style={{padding:20}}>
          <div style={{fontFamily:'Outfit',fontWeight:700,fontSize:15,marginBottom:14}}>Quick Create</div>
          {[{l:'Generate Script',i:FileText,c:'var(--violet)'},{l:'Create Voiceover',i:Mic,c:'var(--cyan)'},{l:'Make Video',i:Film,c:'var(--rose)'},{l:'Schedule Post',i:Calendar,c:'var(--green)'}].map((a,i)=>{const I=a.i;return(
            <div key={i} style={{display:'flex',alignItems:'center',gap:10,padding:'11px 13px',borderRadius:'var(--rsm)',background:'var(--elevated)',border:'1px solid var(--border)',marginBottom:8,cursor:'pointer',transition:'var(--tr)'}}
              onMouseEnter={e=>{e.currentTarget.style.borderColor=a.c;e.currentTarget.style.background='var(--hover)'}}
              onMouseLeave={e=>{e.currentTarget.style.borderColor='var(--border)';e.currentTarget.style.background='var(--elevated)'}}
            >
              <div style={{width:34,height:34,borderRadius:8,background:`${a.c}18`,display:'flex',alignItems:'center',justifyContent:'center'}}><I size={15} color={a.c}/></div>
              <span style={{fontSize:13,fontWeight:500,color:'var(--tp)'}}>{a.l}</span>
              <ChevronRight size={14} color="var(--tm)" style={{marginLeft:'auto'}}/>
            </div>
          );})}
        </div>
        <div className="card" style={{padding:20}}>
          <div style={{fontFamily:'Outfit',fontWeight:700,fontSize:15,marginBottom:14}}>Platform Performance</div>
          {[{n:'TikTok',views:'5.2K',c:'#69c9d0'},{n:'YouTube',views:'4.1K',c:'#ff0000'},{n:'Instagram',views:'2.8K',c:'#e1306c'},{n:'Facebook',views:'0.3K',c:'#1877f2'}].map((p,i)=>(
            <div key={p.n} style={{display:'flex',alignItems:'center',gap:10,padding:'9px 0',borderBottom:i<3?'1px solid var(--border)':'none'}}>
              <div style={{width:28,height:28,borderRadius:6,background:`${p.c}20`,display:'flex',alignItems:'center',justifyContent:'center',fontSize:13}}>{['🎵','📺','📸','👥'][i]}</div>
              <div style={{flex:1}}><div style={{fontSize:13,fontWeight:600,color:'var(--tp)'}}>{p.n}</div></div>
              <div style={{fontSize:13,fontWeight:700,color:'var(--tp)',fontFamily:'JetBrains Mono'}}>{p.views}</div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

// ═══════════════════════════════════════════════════════════════════════════
// ADMIN PANEL
// ═══════════════════════════════════════════════════════════════════════════
function AdminDashboard() {
  return(
    <div>
      <div style={{display:'grid',gridTemplateColumns:'repeat(4,1fr)',gap:13,marginBottom:18}}>
        <StatCard label="Total Users" value={ADMIN_USERS.length} icon={Users} change={12} color="var(--blue)" delay={0}/>
        <StatCard label="Active Vendors" value={ADMIN_USERS.filter(u=>u.role==='vendor').length} icon={ShoppingBag} change={8} color="var(--green)" delay={60}/>
        <StatCard label="Monthly Revenue" value="$3,240" icon={DollarSign} change={23} color="var(--violet)" delay={120}/>
        <StatCard label="Subscriptions" value={ADMIN_USERS.filter(u=>u.plan!=='free').length} icon={CreditCard} change={15} color="var(--amber)" delay={180}/>
      </div>
      <div style={{display:'grid',gridTemplateColumns:'1.5fr 1fr',gap:14}} className="ai-1">
        <div className="card" style={{padding:20}}>
          <div style={{fontFamily:'Outfit',fontWeight:700,fontSize:15,marginBottom:14}}>Recent Users</div>
          {ADMIN_USERS.slice(0,5).map((u,i)=>(
            <div key={u.id} style={{display:'flex',alignItems:'center',gap:10,padding:'9px 0',borderBottom:i<4?'1px solid var(--border)':'none'}}>
              <div style={{width:32,height:32,borderRadius:'50%',background:'linear-gradient(135deg,var(--blue),var(--violet))',display:'flex',alignItems:'center',justifyContent:'center',fontSize:12,fontWeight:700,color:'#fff'}}>{u.name[0]}</div>
              <div style={{flex:1}}><div style={{fontSize:12,fontWeight:600,color:'var(--tp)'}}>{u.name}</div><div style={{fontSize:11,color:'var(--tm)'}}>{u.email}</div></div>
              <span className={`badge ${u.role==='vendor'?'b-blue':'b-violet'}`} style={{fontSize:10}}>{u.role}</span>
              <span className={`badge ${u.status==='active'?'b-green':'b-rose'}`} style={{fontSize:10}}>{u.status}</span>
            </div>
          ))}
        </div>
        <div className="card" style={{padding:20}}>
          <div style={{fontFamily:'Outfit',fontWeight:700,fontSize:15,marginBottom:14}}>Plan Distribution</div>
          {Object.entries(PLANS).map(([k,p])=>{
            const count=ADMIN_USERS.filter(u=>u.plan===k).length;
            const pct=(count/ADMIN_USERS.length)*100;
            return(
              <div key={k} style={{marginBottom:12}}>
                <div style={{display:'flex',justifyContent:'space-between',marginBottom:4}}><span style={{fontSize:12,color:'var(--ts)'}}>{p.icon} {p.name}</span><span style={{fontSize:12,fontFamily:'JetBrains Mono',color:'var(--ts)'}}>{count}</span></div>
                <div className="limit-bar"><div className="limit-fill" style={{width:`${pct}%`,background:k==='free'?'var(--tm)':k==='starter'?'var(--blue)':k==='pro'?'var(--violet)':'var(--gold)'}}/></div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}

function AdminUsers({toast}) {
  const [users,setUsers]=useState(ADMIN_USERS);
  const [search,setSearch]=useState('');
  const filtered=users.filter(u=>u.name.toLowerCase().includes(search.toLowerCase())||u.email.toLowerCase().includes(search.toLowerCase()));

  return(
    <div>
      <PageHeader title="User Management" subtitle={`${users.length} total users`}>
        <div style={{position:'relative'}}>
          <Search size={12} style={{position:'absolute',left:9,top:'50%',transform:'translateY(-50%)',color:'var(--tm)'}}/>
          <input className="inp" placeholder="Search users..." style={{paddingLeft:28,width:180,fontSize:12}} value={search} onChange={e=>setSearch(e.target.value)}/>
        </div>
      </PageHeader>
      <div style={{background:'var(--card)',border:'1px solid var(--border)',borderRadius:'var(--rlg)',overflow:'hidden'}}>
        <table>
          <thead><tr><th>User</th><th>Role</th><th>Plan</th><th>Status</th><th>Joined</th><th>Revenue</th><th>Actions</th></tr></thead>
          <tbody>
            {filtered.map((u,i)=>(
              <tr key={u.id} style={{animation:`fadeIn .3s ease ${i*30}ms both`}}>
                <td><div style={{fontWeight:600,color:'var(--tp)',fontSize:13}}>{u.name}</div><div style={{fontSize:11,color:'var(--tm)'}}>{u.email}</div></td>
                <td><span className={`badge ${u.role==='vendor'?'b-blue':'b-violet'}`}>{u.role}</span></td>
                <td><span className={`badge ${u.plan==='free'?'b-gray':u.plan==='starter'?'b-blue':u.plan==='pro'?'b-violet':'b-gold'}`}>{PLANS[u.plan].icon} {PLANS[u.plan].name}</span></td>
                <td><span className={`badge ${u.status==='active'?'b-green':'b-rose'}`}>{u.status}</span></td>
                <td style={{fontSize:12}}>{u.joined}</td>
                <td style={{fontFamily:'JetBrains Mono',fontSize:12,color:'var(--tp)'}}>{u.revenue>0?`₦${u.revenue.toLocaleString()}`:'—'}</td>
                <td>
                  <div style={{display:'flex',gap:6}}>
                    <button className="btn btn-s btn-sm" style={{fontSize:11}}><Eye size={10}/>View</button>
                    <button className="btn btn-s btn-sm" style={{fontSize:11,color:u.status==='active'?'var(--rose)':'var(--green)'}} onClick={()=>{setUsers(us=>us.map(x=>x.id===u.id?{...x,status:x.status==='active'?'suspended':'active'}:x));toast.show('User status updated');}}>
                      {u.status==='active'?<><XCircle size={10}/>Suspend</>:<><CheckCircle size={10}/>Activate</>}
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

function AdminPayments() {
  return(
    <div>
      <PageHeader title="Payment Monitoring" subtitle="Review all transactions and disputes">
        <select className="sel" style={{width:130}}><option>All Statuses</option><option>Pending</option><option>Confirmed</option><option>Disputed</option></select>
      </PageHeader>
      <div style={{display:'grid',gridTemplateColumns:'repeat(4,1fr)',gap:13,marginBottom:18}}>
        {[{l:'Total Payments',v:'₦1.2M',c:'var(--green)',i:Wallet},{l:'Pending Review',v:'3',c:'var(--amber)',i:Clock},{l:'Confirmed Today',v:'12',c:'var(--blue)',i:CheckCircle},{l:'Disputes',v:'1',c:'var(--rose)',i:AlertTriangle}].map((s,i)=>{const I=s.i;return(
          <div key={i} className="card" style={{padding:16}}>
            <I size={15} color={s.c} style={{marginBottom:8}}/>
            <div style={{fontFamily:'Outfit',fontWeight:800,fontSize:18,color:'var(--tp)'}}>{s.v}</div>
            <div style={{fontSize:11,color:'var(--tm)',marginTop:3}}>{s.l}</div>
          </div>
        );})}
      </div>
      <div style={{background:'var(--card)',border:'1px solid var(--border)',borderRadius:'var(--rlg)',overflow:'hidden'}}>
        <table>
          <thead><tr><th>Order ID</th><th>Vendor</th><th>Customer</th><th>Amount</th><th>Method</th><th>Status</th><th>Date</th><th>Actions</th></tr></thead>
          <tbody>
            {INIT_ORDERS.map((o,i)=>(
              <tr key={o.id} style={{animation:`fadeIn .3s ease ${i*30}ms both`}}>
                <td style={{fontFamily:'JetBrains Mono',fontSize:11,color:'var(--blue)'}}>{o.id}</td>
                <td style={{fontSize:13,fontWeight:500,color:'var(--tp)'}}>Adaeze's Boutique</td>
                <td>{o.customer}</td>
                <td style={{fontFamily:'JetBrains Mono',fontSize:12,fontWeight:600,color:'var(--tp)'}}>{fmt(o.total,o.currency)}</td>
                <td><span className="badge b-gray" style={{fontSize:10}}>Manual Transfer</span></td>
                <td><span className={`badge ${STATUS_CONFIG[o.status]?.badge||'b-gray'}`} style={{fontSize:10}}>{o.status}</span></td>
                <td style={{fontSize:11}}>{o.date}</td>
                <td>
                  <div style={{display:'flex',gap:5}}>
                    <button className="btn btn-s btn-sm" style={{fontSize:11}}><Eye size={10}/>View</button>
                    {o.status==='Payment Uploaded'&&<button className="btn btn-s btn-sm" style={{fontSize:11,color:'var(--amber)'}}><AlertTriangle size={10}/>Dispute</button>}
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

// ═══════════════════════════════════════════════════════════════════════════
// MAIN APP
// ═══════════════════════════════════════════════════════════════════════════
export default function ChatCart() {
  const [appState, setAppState]=useState('onboarding');
  const [user, setUser]=useState({role:'vendor',plan:'free',name:'Adaeze',country:'Nigeria',currency:'NGN'});
  const [page, setPage]=useState('dashboard');
  const [sidebarCollapsed, setSidebarCollapsed]=useState(false);
  const [showPricing, setShowPricing]=useState(false);
  const [products, setProducts]=useState(INIT_PRODUCTS);
  const [orders, setOrders]=useState(INIT_ORDERS);
  const [posts, setPosts]=useState(INIT_POSTS);
  const [scripts, setScripts]=useState(INIT_SCRIPTS);
  const [currency, setCurrency]=useState('NGN');
  const {toast,show:showToast}=useToast();
  const toastObj={show:showToast};

  const onboard=(data)=>{
    setUser(data);
    setCurrency(data.currency||'NGN');
    setPage('dashboard');
    setAppState('app');
  };

  const onUpgrade=useCallback(()=>setShowPricing(true),[]);
  const doUpgrade=(plan)=>{
    setUser(u=>({...u,plan}));
    setShowPricing(false);
    showToast(`Upgraded to ${PLANS[plan].name}! 🎉`);
  };

  const pendingCount=orders.filter(o=>['Pending','Awaiting Payment','Payment Uploaded'].includes(o.status)).length;

  const renderPage=()=>{
    const {role,plan}=user;
    if(role==='admin'){
      switch(page){
        case 'dashboard': return <AdminDashboard/>;
        case 'users': return <AdminUsers toast={toastObj}/>;
        case 'vendors': return <AdminUsers toast={toastObj}/>;
        case 'payments': return <AdminPayments/>;
        case 'analytics': return <AnalyticsPage orders={orders} products={products} currency={currency} plan="pro" onUpgrade={onUpgrade}/>;
        case 'settings': return <SettingsPage currency={currency} setCurrency={setCurrency} plan={plan} onUpgrade={onUpgrade} toast={toastObj}/>;
        default: return <AdminDashboard/>;
      }
    }
    if(role==='creator'){
      switch(page){
        case 'dashboard': return <CreatorDashboard scripts={scripts} plan={plan}/>;
        case 'scripts': return <ScriptPage scripts={scripts} setScripts={setScripts} plan={plan} toast={toastObj} onUpgrade={onUpgrade}/>;
        case 'voiceover': return <VoicePage plan={plan} onUpgrade={onUpgrade} toast={toastObj}/>;
        case 'video': return <VideoPage plan={plan} onUpgrade={onUpgrade} toast={toastObj}/>;
        case 'scheduler': return <SocialPage posts={posts} setPosts={setPosts} plan={plan} toast={toastObj} onUpgrade={onUpgrade}/>;
        case 'social': return <SocialPage posts={posts} setPosts={setPosts} plan={plan} toast={toastObj} onUpgrade={onUpgrade}/>;
        case 'analytics': return <AnalyticsPage orders={[]} products={[]} currency={currency} plan={plan} onUpgrade={onUpgrade}/>;
        case 'settings': return <SettingsPage currency={currency} setCurrency={setCurrency} plan={plan} onUpgrade={onUpgrade} toast={toastObj}/>;
        default: return <CreatorDashboard scripts={scripts} plan={plan}/>;
      }
    }
    // vendor
    switch(page){
      case 'dashboard': return <VendorDashboard products={products} orders={orders} currency={currency}/>;
      case 'products': return <ProductsPage products={products} setProducts={setProducts} currency={currency} plan={plan} toast={toastObj} onUpgrade={onUpgrade}/>;
      case 'orders': return <OrdersPage orders={orders} setOrders={setOrders} currency={currency} toast={toastObj}/>;
      case 'whatsapp': return <WhatsAppPage products={products} currency={currency} plan={plan} onUpgrade={onUpgrade} toast={toastObj}/>;
      case 'automation': return <AutomationPage products={products} plan={plan} toast={toastObj} onUpgrade={onUpgrade}/>;
      case 'social': return <SocialPage posts={posts} setPosts={setPosts} plan={plan} toast={toastObj} onUpgrade={onUpgrade}/>;
      case 'analytics': return <AnalyticsPage orders={orders} products={products} currency={currency} plan={plan} onUpgrade={onUpgrade}/>;
      case 'settings': return <SettingsPage currency={currency} setCurrency={setCurrency} plan={plan} onUpgrade={onUpgrade} toast={toastObj}/>;
      default: return <VendorDashboard products={products} orders={orders} currency={currency}/>;
    }
  };

  if(appState==='onboarding') return (
    <>
      <style>{GS}</style>
      <OnboardingScreen onComplete={onboard}/>
    </>
  );

  return (
    <>
      <style>{GS}</style>
      <div style={{display:'flex',height:'100vh',overflow:'hidden',background:'var(--bg)'}}>
        <Sidebar
          page={page} setPage={setPage}
          collapsed={sidebarCollapsed} setCollapsed={setSidebarCollapsed}
          role={user.role} plan={user.plan}
          pendingCount={pendingCount}
          onUpgrade={onUpgrade}
        />
        <div style={{flex:1,display:'flex',flexDirection:'column',overflow:'hidden',minWidth:0}}>
          <Topbar page={page} plan={user.plan} onUpgrade={onUpgrade}/>
          <main style={{flex:1,overflowY:'auto',padding:22,background:'var(--bg)'}}>
            {renderPage()}
          </main>
        </div>
      </div>
      {showPricing&&<PricingModal onClose={()=>setShowPricing(false)} onUpgrade={doUpgrade} currentPlan={user.plan}/>}
      <Toast toast={toast}/>
    </>
  );
}
