import React, { useState } from 'react'
import Sidebar from '../components/Sidebar'
import Header from '../components/Header'
import { useAuth } from '../context/AuthContext'
import {
  Users, Radio, RefreshCw, TrendingUp, CheckCircle, XCircle,
  Clock, Zap, ArrowUpRight, Activity
} from 'lucide-react'

const STATS = [
  { label:'Connected Accounts', value:'3', change:'+1 this week', icon:Users,      color:'blue',   iconBg:'rgba(59,130,246,0.12)',  iconColor:'#60a5fa' },
  { label:'Active Ads',         value:'24', change:'+5 this week', icon:Radio,      color:'purple', iconBg:'rgba(139,92,246,0.12)', iconColor:'#a78bfa' },
  { label:'Reposts Today',      value:'47', change:'+12 vs yesterday', icon:RefreshCw, color:'green',  iconBg:'rgba(16,185,129,0.12)',  iconColor:'#34d399' },
  { label:'Success Rate',       value:'96.2%', change:'Last 30 days', icon:TrendingUp, color:'yellow', iconBg:'rgba(245,158,11,0.12)',  iconColor:'#fbbf24' },
]

const ACTIVITY = [
  { id:1, ad:'Honda Civic 2019 - Low Mileage', account:'olx_ali',    status:'success', time:'2 mins ago',  site:'OLX' },
  { id:2, ad:'2BHK Apartment Defence Phase 6', account:'zameen_pk',  status:'success', time:'15 mins ago', site:'Zameen' },
  { id:3, ad:'iPhone 15 Pro Max 256GB',        account:'olx_ali',    status:'failed',  time:'32 mins ago', site:'OLX' },
  { id:4, ad:'Toyota Corolla 2021 Automatic',  account:'olx_ali',    status:'success', time:'1 hr ago',    site:'OLX' },
  { id:5, ad:'Shop for Rent - Main Blvd',      account:'zameen_pk',  status:'success', time:'2 hrs ago',   site:'Zameen' },
]

const QUICK_ADS = [
  { id:1, title:'Honda Civic 2019',         status:'active',  autoRepost:true,  lastRepost:'10 mins ago', interval:'3h' },
  { id:2, title:'2BHK Defence Phase 6',     status:'active',  autoRepost:true,  lastRepost:'20 mins ago', interval:'6h' },
  { id:3, title:'iPhone 15 Pro Max',        status:'paused',  autoRepost:false, lastRepost:'2 hrs ago',   interval:'12h' },
  { id:4, title:'Toyota Corolla 2021',      status:'active',  autoRepost:true,  lastRepost:'1 hr ago',    interval:'3h' },
  { id:5, title:'Shop for Rent Main Blvd',  status:'expired', autoRepost:false, lastRepost:'1 day ago',   interval:'24h' },
]

export default function Dashboard() {
  const { user } = useAuth()
  const [ads, setAds] = useState(QUICK_ADS)

  const toggleAd = (id) => {
    setAds(prev => prev.map(a => a.id === id ? {...a, autoRepost: !a.autoRepost} : a))
  }

  return (
    <div style={{ display:'flex' }}>
      <Sidebar />
      <main className="main-layout">
        <Header title={`Good afternoon, ${user?.name?.split(' ')[0]}! 👋`} subtitle="Here's what's happening with your ads today" />
        <div className="page-content fade-in">

          {/* Stats */}
          <div style={{ display:'grid', gridTemplateColumns:'repeat(4,1fr)', gap:20, marginBottom:28 }}>
            {STATS.map(({ label, value, change, icon:Icon, color, iconBg, iconColor }) => (
              <div key={label} className={`stat-card ${color}`}>
                <div style={{ display:'flex', alignItems:'flex-start', justifyContent:'space-between', marginBottom:16 }}>
                  <div style={{ width:44, height:44, background:iconBg, borderRadius:12, display:'flex', alignItems:'center', justifyContent:'center' }}>
                    <Icon size={20} color={iconColor} />
                  </div>
                  <ArrowUpRight size={16} style={{ color:'var(--text-muted)' }} />
                </div>
                <div style={{ fontSize:28, fontWeight:800, color:'var(--text-primary)', letterSpacing:'-0.02em', marginBottom:4 }}>{value}</div>
                <div style={{ fontSize:13, color:'var(--text-secondary)', marginBottom:4 }}>{label}</div>
                <div style={{ fontSize:11, color:'var(--text-muted)' }}>{change}</div>
              </div>
            ))}
          </div>

          <div style={{ display:'grid', gridTemplateColumns:'1fr 340px', gap:24 }}>
            {/* Ads Quick View */}
            <div style={{ background:'var(--bg-card)', border:'1px solid var(--border)', borderRadius:16, overflow:'hidden' }}>
              <div style={{ padding:'20px 24px', borderBottom:'1px solid var(--border)', display:'flex', alignItems:'center', justifyContent:'space-between' }}>
                <div>
                  <h2 style={{ fontSize:15, fontWeight:700, color:'var(--text-primary)' }}>Your Ads</h2>
                  <p style={{ fontSize:12, color:'var(--text-muted)', marginTop:2 }}>Toggle auto-repost per ad</p>
                </div>
                <a href="/ads" style={{ fontSize:12, color:'var(--accent-blue)', fontWeight:600, textDecoration:'none' }}>View All →</a>
              </div>
              <table className="data-table">
                <thead>
                  <tr>
                    <th>Ad Title</th>
                    <th>Status</th>
                    <th>Last Repost</th>
                    <th>Interval</th>
                    <th>Auto-Repost</th>
                  </tr>
                </thead>
                <tbody>
                  {ads.map(ad => (
                    <tr key={ad.id}>
                      <td style={{ color:'var(--text-primary)', fontWeight:500, maxWidth:200, overflow:'hidden', textOverflow:'ellipsis', whiteSpace:'nowrap' }}>{ad.title}</td>
                      <td>
                        <span className={`badge ${
                          ad.status==='active' ? 'badge-success' :
                          ad.status==='paused' ? 'badge-warning' : 'badge-error'
                        }`}>
                          <span className="pulse-dot" style={{ width:5, height:5, borderRadius:'50%', background:'currentColor', display: ad.status==='active'?'block':'none' }} />
                          {ad.status}
                        </span>
                      </td>
                      <td style={{ fontSize:12 }}>{ad.lastRepost}</td>
                      <td><span className="badge badge-info">Every {ad.interval}</span></td>
                      <td>
                        <div className={`toggle-switch ${ad.autoRepost ? 'active':''}`}
                          onClick={() => toggleAd(ad.id)} />
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            {/* Activity Feed */}
            <div style={{ background:'var(--bg-card)', border:'1px solid var(--border)', borderRadius:16 }}>
              <div style={{ padding:'20px 24px', borderBottom:'1px solid var(--border)' }}>
                <div style={{ display:'flex', alignItems:'center', gap:8 }}>
                  <Activity size={16} style={{ color:'var(--accent-blue)' }} />
                  <h2 style={{ fontSize:15, fontWeight:700, color:'var(--text-primary)' }}>Recent Activity</h2>
                </div>
              </div>
              <div style={{ padding:'8px 0' }}>
                {ACTIVITY.map((item, i) => (
                  <div key={item.id} style={{
                    padding:'14px 20px', display:'flex', alignItems:'flex-start', gap:12,
                    borderBottom: i < ACTIVITY.length-1 ? '1px solid rgba(30,45,69,0.4)' : 'none',
                    transition:'background 0.15s'
                  }}
                    onMouseEnter={e=>e.currentTarget.style.background='rgba(30,45,69,0.3)'}
                    onMouseLeave={e=>e.currentTarget.style.background='transparent'}>
                    <div style={{ marginTop:2 }}>
                      {item.status==='success'
                        ? <CheckCircle size={16} color="#10b981" />
                        : <XCircle size={16} color="#ef4444" />}
                    </div>
                    <div style={{ flex:1, minWidth:0 }}>
                      <p style={{ fontSize:12, fontWeight:600, color:'var(--text-primary)', overflow:'hidden', textOverflow:'ellipsis', whiteSpace:'nowrap' }}>{item.ad}</p>
                      <p style={{ fontSize:11, color:'var(--text-muted)', marginTop:3 }}>
                        <span style={{ color:'var(--accent-blue)' }}>{item.site}</span> · {item.account}
                      </p>
                    </div>
                    <div style={{ display:'flex', alignItems:'center', gap:4, color:'var(--text-muted)', fontSize:11, flexShrink:0 }}>
                      <Clock size={11} />{item.time}
                    </div>
                  </div>
                ))}
              </div>
              <div style={{ padding:'14px 20px', borderTop:'1px solid var(--border)', textAlign:'center' }}>
                <a href="/logs" style={{ fontSize:12, color:'var(--accent-blue)', fontWeight:600, textDecoration:'none' }}>View All Logs →</a>
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  )
}
