import React, { useState } from 'react'
import Sidebar from '../components/Sidebar'
import Header from '../components/Header'
import { CheckCircle, XCircle, Clock, Filter } from 'lucide-react'

const LOGS = [
  { id:1,  ad:'Honda Civic 2019',        account:'olx_ali',    site:'OLX',     status:'success', time:'2026-07-26 14:32', duration:'1.2s', msg:'Reposted successfully' },
  { id:2,  ad:'2BHK Defence Phase 6',    account:'zameen_pk',  site:'Zameen',  status:'success', time:'2026-07-26 14:15', duration:'2.1s', msg:'Reposted successfully' },
  { id:3,  ad:'iPhone 15 Pro Max',       account:'olx_ali',    site:'OLX',     status:'failed',  time:'2026-07-26 13:48', duration:'—',    msg:'CAPTCHA detected — retry scheduled' },
  { id:4,  ad:'Toyota Corolla 2021',     account:'olx_ali',    site:'OLX',     status:'success', time:'2026-07-26 13:30', duration:'1.8s', msg:'Reposted successfully' },
  { id:5,  ad:'Shop for Rent',           account:'zameen_pk',  site:'Zameen',  status:'success', time:'2026-07-26 12:05', duration:'2.4s', msg:'Reposted successfully' },
  { id:6,  ad:'Dell XPS 15',            account:'olx_ali',    site:'OLX',     status:'success', time:'2026-07-26 11:47', duration:'1.5s', msg:'Reposted successfully' },
  { id:7,  ad:'Honda Civic 2019',        account:'olx_ali',    site:'OLX',     status:'success', time:'2026-07-26 11:32', duration:'1.3s', msg:'Reposted successfully' },
  { id:8,  ad:'Studio Apartment F-10',   account:'zameen_pk',  site:'Zameen',  status:'failed',  time:'2026-07-26 10:55', duration:'—',    msg:'Session expired — re-authenticating' },
  { id:9,  ad:'Suzuki Alto 2022',        account:'pk_prop',    site:'OLX',     status:'success', time:'2026-07-26 10:30', duration:'1.9s', msg:'Reposted successfully' },
  { id:10, ad:'2BHK Defence Phase 6',    account:'zameen_pk',  site:'Zameen',  status:'success', time:'2026-07-26 10:15', duration:'2.2s', msg:'Reposted successfully' },
  { id:11, ad:'Toyota Corolla 2021',     account:'olx_ali',    site:'OLX',     status:'success', time:'2026-07-26 09:30', duration:'1.7s', msg:'Reposted successfully' },
  { id:12, ad:'iPhone 15 Pro Max',       account:'olx_ali',    site:'OLX',     status:'failed',  time:'2026-07-26 09:15', duration:'—',    msg:'Rate limit hit — wait 30 mins' },
  { id:13, ad:'Honda Civic 2019',        account:'olx_ali',    site:'OLX',     status:'success', time:'2026-07-26 08:32', duration:'1.1s', msg:'Reposted successfully' },
  { id:14, ad:'Dell XPS 15',            account:'olx_ali',    site:'OLX',     status:'success', time:'2026-07-25 22:47', duration:'1.6s', msg:'Reposted successfully' },
  { id:15, ad:'Shop for Rent',           account:'zameen_pk',  site:'Zameen',  status:'success', time:'2026-07-25 20:05', duration:'2.0s', msg:'Reposted successfully' },
]

export default function Logs() {
  const [statusFilter, setStatusFilter] = useState('all')
  const [siteFilter, setSiteFilter]     = useState('all')

  const successCount = LOGS.filter(l=>l.status==='success').length
  const failCount    = LOGS.filter(l=>l.status==='failed').length
  const successRate  = Math.round((successCount/LOGS.length)*100)

  const filtered = LOGS.filter(l => {
    if (statusFilter!=='all' && l.status!==statusFilter) return false
    if (siteFilter!=='all' && l.site!==siteFilter) return false
    return true
  })

  return (
    <div style={{display:'flex'}}>
      <Sidebar/>
      <main className="main-layout">
        <Header title="Repost Logs" subtitle="Complete history of all repost attempts" />
        <div className="page-content fade-in">
          {/* Summary */}
          <div style={{display:'grid',gridTemplateColumns:'repeat(3,1fr)',gap:16,marginBottom:24}}>
            {[
              {label:'Total Reposts',  value:LOGS.length, color:'var(--accent-blue)'},
              {label:'Successful',     value:successCount, color:'var(--accent-green)'},
              {label:'Failed',         value:failCount,   color:'var(--accent-red)'},
            ].map(s=>(
              <div key={s.label} style={{background:'var(--bg-card)',border:'1px solid var(--border)',borderRadius:14,padding:'20px 24px',display:'flex',alignItems:'center',gap:16}}>
                <div style={{fontSize:28,fontWeight:800,color:s.color}}>{s.value}</div>
                <div>
                  <div style={{fontSize:12,color:'var(--text-muted)',fontWeight:600,textTransform:'uppercase',letterSpacing:'0.06em'}}>{s.label}</div>
                  {s.label==='Successful'&&<div style={{fontSize:11,color:'var(--accent-green)',marginTop:2}}>{successRate}% success rate</div>}
                </div>
              </div>
            ))}
          </div>

          {/* Filters */}
          <div style={{display:'flex',gap:10,marginBottom:20,flexWrap:'wrap'}}>
            {['all','success','failed'].map(f=>(
              <button key={f} onClick={()=>setStatusFilter(f)}
                style={{padding:'8px 16px',borderRadius:8,fontSize:12,fontWeight:600,cursor:'pointer',border:'1px solid',
                  background:statusFilter===f?'rgba(59,130,246,0.12)':'transparent',
                  color:statusFilter===f?'#60a5fa':'var(--text-muted)',
                  borderColor:statusFilter===f?'rgba(59,130,246,0.3)':'var(--border-light)',
                  transition:'all 0.15s',fontFamily:'Inter,sans-serif'}}>
                {f==='all'?'All Status':f.charAt(0).toUpperCase()+f.slice(1)}
              </button>
            ))}
            <div style={{width:1,background:'var(--border)',margin:'0 4px'}} />
            {['all','OLX','Zameen'].map(s=>(
              <button key={s} onClick={()=>setSiteFilter(s)}
                style={{padding:'8px 16px',borderRadius:8,fontSize:12,fontWeight:600,cursor:'pointer',border:'1px solid',
                  background:siteFilter===s?'rgba(139,92,246,0.12)':'transparent',
                  color:siteFilter===s?'#a78bfa':'var(--text-muted)',
                  borderColor:siteFilter===s?'rgba(139,92,246,0.3)':'var(--border-light)',
                  transition:'all 0.15s',fontFamily:'Inter,sans-serif'}}>
                {s==='all'?'All Sites':s}
              </button>
            ))}
          </div>

          <div style={{background:'var(--bg-card)',border:'1px solid var(--border)',borderRadius:16,overflow:'hidden'}}>
            <div style={{padding:'14px 24px',borderBottom:'1px solid var(--border)'}}>
              <span style={{fontSize:13,color:'var(--text-muted)'}}>{filtered.length} log entries</span>
            </div>
            <div style={{overflowX:'auto'}}>
              <table className="data-table">
                <thead>
                  <tr>
                    <th>#</th>
                    <th>Ad</th>
                    <th>Account</th>
                    <th>Site</th>
                    <th>Status</th>
                    <th>Duration</th>
                    <th>Message</th>
                    <th>Time</th>
                  </tr>
                </thead>
                <tbody>
                  {filtered.map(log=>(
                    <tr key={log.id}>
                      <td style={{color:'var(--text-muted)',fontSize:12}}>#{log.id}</td>
                      <td style={{color:'var(--text-primary)',fontWeight:500,minWidth:160}}>{log.ad}</td>
                      <td style={{fontSize:12,color:'var(--accent-cyan)'}}>{log.account}</td>
                      <td><span className="badge badge-purple">{log.site}</span></td>
                      <td>
                        <div style={{display:'flex',alignItems:'center',gap:6}}>
                          {log.status==='success'
                            ?<CheckCircle size={14} color="#10b981" />
                            :<XCircle size={14} color="#ef4444" />}
                          <span className={`badge ${log.status==='success'?'badge-success':'badge-error'}`}>{log.status}</span>
                        </div>
                      </td>
                      <td style={{fontSize:12}}>{log.duration}</td>
                      <td style={{fontSize:12,color:log.status==='failed'?'#f87171':'var(--text-muted)',maxWidth:200}}>{log.msg}</td>
                      <td>
                        <div style={{display:'flex',alignItems:'center',gap:4,fontSize:11,color:'var(--text-muted)'}}>
                          <Clock size={11}/>{log.time}
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </main>
    </div>
  )
}
