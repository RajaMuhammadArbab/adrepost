import React, { useState } from 'react'
import Sidebar from '../components/Sidebar'
import Header from '../components/Header'
import { useAuth } from '../context/AuthContext'
import { Check, Zap, Crown, Building2, Rocket, CreditCard, Clock } from 'lucide-react'

const PLANS = [
  {
    id:'STARTER', name:'Starter', price:'$9.99', period:'week',
    icon:Rocket, color:'#10b981', iconBg:'rgba(16,185,129,0.1)',
    features:['Up to 5 ads','1 connected account','Repost every 3h','Basic logs','Email support'],
    ads:5, accounts:1
  },
  {
    id:'PRO', name:'Pro', price:'$24.99', period:'week',
    icon:Zap, color:'#3b82f6', iconBg:'rgba(59,130,246,0.1)', featured:true,
    features:['Up to 20 ads','3 connected accounts','Repost every 1h','Full logs & analytics','Priority support','Proxy rotation'],
    ads:20, accounts:3
  },
  {
    id:'AGENCY', name:'Agency', price:'$59.99', period:'week',
    icon:Crown, color:'#8b5cf6', iconBg:'rgba(139,92,246,0.1)',
    features:['Unlimited ads','10 connected accounts','Repost every 30min','Advanced analytics','Dedicated support','DataImpulse proxies','CAPTCHA auto-solve'],
    ads:'∞', accounts:10
  },
]

const CREDIT_PACKS = [
  { credits:50,  price:'$3',  popular:false },
  { credits:150, price:'$7',  popular:true  },
  { credits:400, price:'$15', popular:false },
]

const TX_HISTORY = [
  { id:1, desc:'Pro Plan — Weekly',  amount:'$24.99', date:'Jul 21, 2026', status:'paid' },
  { id:2, desc:'Credits Pack (150)', amount:'$7.00',  date:'Jul 18, 2026', status:'paid' },
  { id:3, desc:'Pro Plan — Weekly',  amount:'$24.99', date:'Jul 14, 2026', status:'paid' },
]

export default function Subscription() {
  const { user } = useAuth()
  const [tab, setTab]     = useState('plans')
  const [toast, setToast] = useState(null)

  const showToast = (msg) => { setToast(msg); setTimeout(()=>setToast(null),3000) }

  const handleSubscribe = (plan) => {
    showToast(`✅ Subscribed to ${plan.name} plan! (Demo mode — no charge made)`)
  }

  const handleBuyCredits = (pack) => {
    showToast(`✅ ${pack.credits} credits added! (Demo mode — no charge made)`)
  }

  return (
    <div style={{display:'flex'}}>
      <Sidebar/>
      <main className="main-layout">
        <Header title="Subscription" subtitle="Manage your plan and credits" />
        <div className="page-content fade-in">

          {/* Current plan banner */}
          <div style={{background:'linear-gradient(135deg,rgba(59,130,246,0.1),rgba(139,92,246,0.1))',border:'1px solid rgba(139,92,246,0.25)',borderRadius:16,padding:'20px 28px',marginBottom:28,display:'flex',alignItems:'center',justifyContent:'space-between'}}>
            <div style={{display:'flex',alignItems:'center',gap:16}}>
              <div style={{width:48,height:48,borderRadius:12,background:'linear-gradient(135deg,#3b82f6,#8b5cf6)',display:'flex',alignItems:'center',justifyContent:'center'}}>
                <Crown size={22} color="white"/>
              </div>
              <div>
                <div style={{fontSize:12,color:'var(--text-muted)',fontWeight:600,letterSpacing:'0.06em',textTransform:'uppercase'}}>Current Plan</div>
                <div style={{fontSize:20,fontWeight:800,color:'var(--text-primary)',marginTop:2}}>{user?.plan || 'FREE'}</div>
              </div>
            </div>
            <div style={{textAlign:'right'}}>
              <div style={{fontSize:12,color:'var(--text-muted)',fontWeight:600,letterSpacing:'0.06em',textTransform:'uppercase'}}>Credits Balance</div>
              <div style={{fontSize:28,fontWeight:800,color:'#fbbf24',marginTop:2}}>{user?.credits ?? 0}</div>
            </div>
          </div>

          {/* Tabs */}
          <div style={{display:'flex',gap:4,marginBottom:28,background:'var(--bg-secondary)',border:'1px solid var(--border)',borderRadius:12,padding:4,width:'fit-content'}}>
            {['plans','credits','history'].map(t=>(
              <button key={t} onClick={()=>setTab(t)}
                style={{padding:'8px 20px',borderRadius:8,fontSize:13,fontWeight:600,cursor:'pointer',border:'none',
                  background:tab===t?'var(--bg-card)':'transparent',
                  color:tab===t?'var(--text-primary)':'var(--text-muted)',
                  boxShadow:tab===t?'0 2px 8px rgba(0,0,0,0.3)':'none',
                  transition:'all 0.2s',fontFamily:'Inter,sans-serif'}}>
                {t.charAt(0).toUpperCase()+t.slice(1)}
              </button>
            ))}
          </div>

          {tab==='plans' && (
            <div style={{display:'grid',gridTemplateColumns:'repeat(3,1fr)',gap:20}}>
              {PLANS.map(plan=>(
                <div key={plan.id} className={`plan-card ${plan.featured?'featured':''}`}>
                  <div style={{width:48,height:48,borderRadius:12,background:plan.iconBg,display:'flex',alignItems:'center',justifyContent:'center',marginBottom:16}}>
                    <plan.icon size={22} color={plan.color}/>
                  </div>
                  <h3 style={{fontSize:18,fontWeight:800,color:'var(--text-primary)',marginBottom:4}}>{plan.name}</h3>
                  <div style={{marginBottom:20}}>
                    <span style={{fontSize:32,fontWeight:800,color:plan.color}}>{plan.price}</span>
                    <span style={{fontSize:13,color:'var(--text-muted)'}}>/{plan.period}</span>
                  </div>
                  <div style={{marginBottom:20}}>
                    {plan.features.map(f=>(
                      <div key={f} style={{display:'flex',alignItems:'center',gap:8,marginBottom:8}}>
                        <Check size={14} color={plan.color}/>
                        <span style={{fontSize:13,color:'var(--text-secondary)'}}>{f}</span>
                      </div>
                    ))}
                  </div>
                  <button onClick={()=>handleSubscribe(plan)}
                    style={{width:'100%',padding:'12px',borderRadius:10,fontSize:14,fontWeight:700,cursor:'pointer',
                      border:`1px solid ${plan.color}44`,
                      background: user?.plan===plan.id?'rgba(16,185,129,0.1)':`${plan.color}18`,
                      color: user?.plan===plan.id?'#10b981':plan.color,
                      transition:'all 0.2s',fontFamily:'Inter,sans-serif'}}
                    onMouseEnter={e=>e.target.style.transform='translateY(-1px)'}
                    onMouseLeave={e=>e.target.style.transform='translateY(0)'}>
                    {user?.plan===plan.id ? '✓ Current Plan' : `Subscribe to ${plan.name}`}
                  </button>
                </div>
              ))}
            </div>
          )}

          {tab==='credits' && (
            <div>
              <p style={{fontSize:13,color:'var(--text-muted)',marginBottom:20}}>Buy credit packs — 1 credit = 1 repost action. No expiry.</p>
              <div style={{display:'grid',gridTemplateColumns:'repeat(3,1fr)',gap:16,marginBottom:32}}>
                {CREDIT_PACKS.map(pack=>(
                  <div key={pack.credits} style={{background:'var(--bg-card)',border:`1px solid ${pack.popular?'rgba(59,130,246,0.4)':'var(--border)'}`,borderRadius:16,padding:24,textAlign:'center',position:'relative',transition:'all 0.2s'}}
                    onMouseEnter={e=>{e.currentTarget.style.transform='translateY(-3px)';e.currentTarget.style.boxShadow='0 12px 40px rgba(0,0,0,0.3)'}}
                    onMouseLeave={e=>{e.currentTarget.style.transform='translateY(0)';e.currentTarget.style.boxShadow='none'}}>
                    {pack.popular&&<div style={{position:'absolute',top:-1,left:'50%',transform:'translateX(-50%)',background:'linear-gradient(135deg,#3b82f6,#8b5cf6)',color:'white',fontSize:10,fontWeight:800,letterSpacing:'0.08em',padding:'3px 14px',borderRadius:'0 0 8px 8px'}}>BEST VALUE</div>}
                    <div style={{fontSize:40,fontWeight:800,color:'var(--text-primary)',marginBottom:4}}>{pack.credits}</div>
                    <div style={{fontSize:13,color:'var(--text-muted)',marginBottom:16}}>credits</div>
                    <div style={{fontSize:22,fontWeight:800,color:'#fbbf24',marginBottom:20}}>{pack.price}</div>
                    <button className="btn-primary" style={{width:'100%',justifyContent:'center'}} onClick={()=>handleBuyCredits(pack)}>
                      <CreditCard size={15}/> Buy Now
                    </button>
                  </div>
                ))}
              </div>
            </div>
          )}

          {tab==='history' && (
            <div style={{background:'var(--bg-card)',border:'1px solid var(--border)',borderRadius:16,overflow:'hidden'}}>
              <table className="data-table">
                <thead><tr><th>#</th><th>Description</th><th>Amount</th><th>Date</th><th>Status</th></tr></thead>
                <tbody>
                  {TX_HISTORY.map(tx=>(
                    <tr key={tx.id}>
                      <td style={{color:'var(--text-muted)',fontSize:12}}>#{tx.id}</td>
                      <td style={{color:'var(--text-primary)',fontWeight:500}}>{tx.desc}</td>
                      <td style={{fontWeight:700,color:'#10b981'}}>{tx.amount}</td>
                      <td style={{fontSize:12,color:'var(--text-muted)'}}>{tx.date}</td>
                      <td><span className="badge badge-success">{tx.status}</span></td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </main>
      {toast&&<div className="toast toast-success">{toast}</div>}
    </div>
  )
}
