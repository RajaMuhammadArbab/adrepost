import React, { useState } from 'react'
import { useNavigate, Link } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'
import {
  Users, FileText, RefreshCw, DollarSign,
  TrendingUp, CheckCircle, XCircle, Shield,
  ToggleLeft, ToggleRight, ArrowLeft, Zap, Clock
} from 'lucide-react'

const ADMIN_STATS = [
  { label:'Total Users',     value:'128',     change:'+12 this week', icon:Users,     color:'blue',   iconColor:'#60a5fa', iconBg:'rgba(59,130,246,0.12)' },
  { label:'Total Ads',       value:'1,847',   change:'+143 this week', icon:FileText,  color:'purple', iconColor:'#a78bfa', iconBg:'rgba(139,92,246,0.12)' },
  { label:'Reposts Today',   value:'3,241',   change:'+22% vs yesterday',icon:RefreshCw,color:'green',  iconColor:'#34d399', iconBg:'rgba(16,185,129,0.12)' },
  { label:'Monthly Revenue', value:'$4,820',  change:'+18% vs last month',icon:DollarSign,color:'yellow',iconColor:'#fbbf24',iconBg:'rgba(245,158,11,0.12)' },
]

const USERS = [
  { id:1, name:'Ali Hassan',      email:'ali@demo.com',      plan:'PRO',     credits:150, status:'active',   joined:'Jan 15, 2026', ads:14, reposts:241 },
  { id:2, name:'Sara Khan',       email:'sara@email.com',    plan:'STARTER', credits:45,  status:'active',   joined:'Feb 03, 2026', ads:5,  reposts:87  },
  { id:3, name:'Usman Malik',     email:'usman@email.com',   plan:'AGENCY',  credits:900, status:'active',   joined:'Mar 12, 2026', ads:48, reposts:1240},
  { id:4, name:'Fatima Raza',     email:'fatima@email.com',  plan:'FREE',    credits:0,   status:'active',   joined:'Apr 20, 2026', ads:2,  reposts:12  },
  { id:5, name:'Ahmed Siddiqui',  email:'ahmed@email.com',   plan:'PRO',     credits:200, status:'suspended',joined:'May 01, 2026', ads:18, reposts:310 },
  { id:6, name:'Zara Butt',       email:'zara@email.com',    plan:'STARTER', credits:30,  status:'active',   joined:'Jun 10, 2026', ads:4,  reposts:65  },
  { id:7, name:'Bilal Chaudhry',  email:'bilal@email.com',   plan:'PRO',     credits:180, status:'active',   joined:'Jun 28, 2026', ads:12, reposts:188 },
]

const PLATFORM_LOGS = [
  { id:1, user:'ali@demo.com',    ad:'Honda Civic 2019',     status:'success', time:'14:32', site:'OLX' },
  { id:2, user:'usman@email.com', ad:'3BHK Bahria Town',     status:'success', time:'14:28', site:'Zameen' },
  { id:3, user:'sara@email.com',  ad:'Samsung Galaxy S25',   status:'failed',  time:'14:15', site:'OLX' },
  { id:4, user:'bilal@email.com', ad:'Suzuki Mehran 2020',   status:'success', time:'14:10', site:'OLX' },
  { id:5, user:'ali@demo.com',    ad:'2BHK Defence Phase 6', status:'success', time:'13:55', site:'Zameen' },
]

const PLAN_COLORS = { FREE:'#94a3b8', STARTER:'#10b981', PRO:'#3b82f6', AGENCY:'#8b5cf6' }

export default function Admin() {
  const { user, logout } = useAuth()
  const navigate = useNavigate()
  const [users, setUsers] = useState(USERS)
  const [tab, setTab]     = useState('overview')
  const [toast, setToast] = useState(null)

  const showToast = (msg, type='success') => { setToast({msg,type}); setTimeout(()=>setToast(null),3000) }

  const toggleStatus = (id) => {
    setUsers(prev => prev.map(u => {
      if (u.id!==id) return u
      const next = u.status==='active'?'suspended':'active'
      showToast(`${u.name} has been ${next==='active'?'activated':'suspended'}.`, next==='active'?'success':'error')
      return {...u, status:next}
    }))
  }

  return (
    <div style={{minHeight:'100vh',background:'var(--bg-primary)'}}>
      {/* Admin top bar */}
      <div style={{background:'rgba(139,92,246,0.05)',borderBottom:'1px solid rgba(139,92,246,0.15)',padding:'0 32px',height:60,display:'flex',alignItems:'center',justifyContent:'space-between',position:'sticky',top:0,zIndex:100,backdropFilter:'blur(20px)'}}>
        <div style={{display:'flex',alignItems:'center',gap:16}}>
          <Link to="/dashboard" style={{display:'flex',alignItems:'center',gap:6,fontSize:13,color:'var(--text-muted)',textDecoration:'none',transition:'color 0.2s'}}
            onMouseEnter={e=>e.currentTarget.style.color='var(--text-primary)'}
            onMouseLeave={e=>e.currentTarget.style.color='var(--text-muted)'}>
            <ArrowLeft size={15}/> Back to Dashboard
          </Link>
          <div style={{width:1,height:20,background:'var(--border)'}} />
          <div style={{display:'flex',alignItems:'center',gap:8}}>
            <div style={{width:30,height:30,borderRadius:8,background:'linear-gradient(135deg,#8b5cf6,#a78bfa)',display:'flex',alignItems:'center',justifyContent:'center'}}>
              <Shield size={15} color="white"/>
            </div>
            <span style={{fontSize:15,fontWeight:700,color:'var(--text-primary)'}}>Admin Panel</span>
            <span className="badge badge-purple" style={{fontSize:10}}>SUPER ADMIN</span>
          </div>
        </div>
        <div style={{display:'flex',alignItems:'center',gap:10}}>
          <div className="avatar" style={{width:30,height:30,fontSize:12}}>{user?.name?.charAt(0)}</div>
          <span style={{fontSize:13,fontWeight:600,color:'var(--text-primary)'}}>{user?.name}</span>
          <button onClick={()=>{logout();navigate('/login')}} style={{background:'none',border:'none',cursor:'pointer',fontSize:12,color:'var(--text-muted)',fontFamily:'Inter,sans-serif',padding:'6px 10px',borderRadius:6,transition:'color 0.2s'}}
            onMouseEnter={e=>e.target.style.color='#ef4444'} onMouseLeave={e=>e.target.style.color='var(--text-muted)'}>
            Logout
          </button>
        </div>
      </div>

      <div style={{padding:32}}>
        {/* Stats */}
        <div style={{display:'grid',gridTemplateColumns:'repeat(4,1fr)',gap:20,marginBottom:28}}>
          {ADMIN_STATS.map(s=>(
            <div key={s.label} className={`stat-card ${s.color}`}>
              <div style={{display:'flex',alignItems:'flex-start',justifyContent:'space-between',marginBottom:16}}>
                <div style={{width:44,height:44,background:s.iconBg,borderRadius:12,display:'flex',alignItems:'center',justifyContent:'center'}}>
                  <s.icon size={20} color={s.iconColor}/>
                </div>
                <TrendingUp size={14} style={{color:'var(--text-muted)'}}/>
              </div>
              <div style={{fontSize:26,fontWeight:800,color:'var(--text-primary)',letterSpacing:'-0.02em',marginBottom:4}}>{s.value}</div>
              <div style={{fontSize:13,color:'var(--text-secondary)',marginBottom:4}}>{s.label}</div>
              <div style={{fontSize:11,color:'var(--accent-green)'}}>{s.change}</div>
            </div>
          ))}
        </div>

        {/* Tabs */}
        <div style={{display:'flex',gap:4,marginBottom:24,background:'var(--bg-secondary)',border:'1px solid var(--border)',borderRadius:12,padding:4,width:'fit-content'}}>
          {['overview','users','logs'].map(t=>(
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

        {tab==='overview' && (
          <div style={{display:'grid',gridTemplateColumns:'1fr 1fr',gap:20}}>
            {/* Quick user summary */}
            <div style={{background:'var(--bg-card)',border:'1px solid var(--border)',borderRadius:16,overflow:'hidden'}}>
              <div style={{padding:'18px 24px',borderBottom:'1px solid var(--border)',display:'flex',alignItems:'center',justifyContent:'space-between'}}>
                <h3 style={{fontSize:15,fontWeight:700,color:'var(--text-primary)'}}>User Breakdown</h3>
              </div>
              <div style={{padding:24}}>
                {Object.entries({FREE:0,STARTER:0,PRO:0,AGENCY:0}).map(([plan])=>{
                  const count = USERS.filter(u=>u.plan===plan).length
                  const pct   = Math.round((count/USERS.length)*100)
                  return (
                    <div key={plan} style={{marginBottom:14}}>
                      <div style={{display:'flex',justifyContent:'space-between',marginBottom:4}}>
                        <span style={{fontSize:12,fontWeight:600,color:PLAN_COLORS[plan]}}>{plan}</span>
                        <span style={{fontSize:12,color:'var(--text-muted)'}}>{count} users ({pct}%)</span>
                      </div>
                      <div style={{height:6,background:'var(--border)',borderRadius:3,overflow:'hidden'}}>
                        <div style={{height:'100%',width:`${pct}%`,background:PLAN_COLORS[plan],borderRadius:3,transition:'width 0.5s ease'}} />
                      </div>
                    </div>
                  )
                })}
              </div>
            </div>
            {/* Recent logs */}
            <div style={{background:'var(--bg-card)',border:'1px solid var(--border)',borderRadius:16,overflow:'hidden'}}>
              <div style={{padding:'18px 24px',borderBottom:'1px solid var(--border)'}}>
                <h3 style={{fontSize:15,fontWeight:700,color:'var(--text-primary)'}}>Platform Activity</h3>
              </div>
              <div style={{padding:'8px 0'}}>
                {PLATFORM_LOGS.map((log,i)=>(
                  <div key={log.id} style={{padding:'12px 20px',display:'flex',alignItems:'center',gap:12,borderBottom:i<PLATFORM_LOGS.length-1?'1px solid rgba(30,45,69,0.4)':'none'}}>
                    {log.status==='success'?<CheckCircle size={14} color="#10b981"/>:<XCircle size={14} color="#ef4444"/>}
                    <div style={{flex:1,minWidth:0}}>
                      <p style={{fontSize:12,fontWeight:600,color:'var(--text-primary)',overflow:'hidden',textOverflow:'ellipsis',whiteSpace:'nowrap'}}>{log.ad}</p>
                      <p style={{fontSize:11,color:'var(--text-muted)'}}>{log.user} · <span style={{color:'var(--accent-blue)'}}>{log.site}</span></p>
                    </div>
                    <div style={{display:'flex',alignItems:'center',gap:4,fontSize:11,color:'var(--text-muted)'}}><Clock size={11}/>{log.time}</div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {tab==='users' && (
          <div style={{background:'var(--bg-card)',border:'1px solid var(--border)',borderRadius:16,overflow:'hidden'}}>
            <div style={{padding:'18px 24px',borderBottom:'1px solid var(--border)',display:'flex',alignItems:'center',justifyContent:'space-between'}}>
              <h3 style={{fontSize:15,fontWeight:700,color:'var(--text-primary)'}}>All Users ({users.length})</h3>
            </div>
            <div style={{overflowX:'auto'}}>
              <table className="data-table">
                <thead>
                  <tr>
                    <th>User</th>
                    <th>Plan</th>
                    <th>Credits</th>
                    <th>Ads</th>
                    <th>Reposts</th>
                    <th>Joined</th>
                    <th>Status</th>
                    <th>Action</th>
                  </tr>
                </thead>
                <tbody>
                  {users.map(u=>(
                    <tr key={u.id}>
                      <td>
                        <div style={{display:'flex',alignItems:'center',gap:10}}>
                          <div className="avatar" style={{width:32,height:32,fontSize:13}}>{u.name.charAt(0)}</div>
                          <div>
                            <p style={{fontSize:13,fontWeight:600,color:'var(--text-primary)'}}>{u.name}</p>
                            <p style={{fontSize:11,color:'var(--text-muted)'}}>{u.email}</p>
                          </div>
                        </div>
                      </td>
                      <td><span style={{fontSize:12,fontWeight:700,color:PLAN_COLORS[u.plan]}}>{u.plan}</span></td>
                      <td style={{fontWeight:600,color:'#fbbf24'}}>{u.credits}</td>
                      <td style={{color:'var(--text-primary)',fontWeight:500}}>{u.ads}</td>
                      <td style={{color:'var(--text-primary)',fontWeight:500}}>{u.reposts}</td>
                      <td style={{fontSize:12,color:'var(--text-muted)'}}>{u.joined}</td>
                      <td><span className={`badge ${u.status==='active'?'badge-success':'badge-error'}`}>{u.status}</span></td>
                      <td>
                        <button onClick={()=>toggleStatus(u.id)}
                          className={u.status==='active'?'btn-danger':'btn-success'}
                          style={{padding:'6px 12px',fontSize:11}}>
                          {u.status==='active'
                            ?<><ToggleLeft size={13}/> Suspend</>
                            :<><ToggleRight size={13}/> Activate</>}
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {tab==='logs' && (
          <div style={{background:'var(--bg-card)',border:'1px solid var(--border)',borderRadius:16,overflow:'hidden'}}>
            <div style={{padding:'18px 24px',borderBottom:'1px solid var(--border)'}}>
              <h3 style={{fontSize:15,fontWeight:700,color:'var(--text-primary)'}}>Platform Repost Logs</h3>
            </div>
            <table className="data-table">
              <thead><tr><th>#</th><th>User</th><th>Ad</th><th>Site</th><th>Status</th><th>Time</th></tr></thead>
              <tbody>
                {PLATFORM_LOGS.map(log=>(
                  <tr key={log.id}>
                    <td style={{color:'var(--text-muted)',fontSize:12}}>#{log.id}</td>
                    <td style={{fontSize:12,color:'var(--accent-cyan)'}}>{log.user}</td>
                    <td style={{color:'var(--text-primary)',fontWeight:500}}>{log.ad}</td>
                    <td><span className="badge badge-purple">{log.site}</span></td>
                    <td>
                      <div style={{display:'flex',alignItems:'center',gap:6}}>
                        {log.status==='success'?<CheckCircle size={13} color="#10b981"/>:<XCircle size={13} color="#ef4444"/>}
                        <span className={`badge ${log.status==='success'?'badge-success':'badge-error'}`}>{log.status}</span>
                      </div>
                    </td>
                    <td style={{fontSize:12,color:'var(--text-muted)'}}>{log.time}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {toast&&<div className={`toast ${toast.type==='success'?'toast-success':'toast-error'}`}>{toast.type==='success'?'✅':'❌'} {toast.msg}</div>}
    </div>
  )
}
