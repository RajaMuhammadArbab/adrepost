import React, { useState } from 'react'
import Sidebar from '../components/Sidebar'
import Header from '../components/Header'
import { RefreshCw, Filter, Search, Clock } from 'lucide-react'

const INITIAL_ADS = [
  { id:1, title:'Honda Civic 2019 Low Mileage',   category:'Cars',       price:'PKR 42,00,000', account:'olx_ali',     status:'active',  autoRepost:true,  interval:3,  lastRepost:'10 mins ago' },
  { id:2, title:'2BHK Apartment Defence Phase 6',  category:'Property',   price:'PKR 1,20,00,000',account:'zameen_pk',  status:'active',  autoRepost:true,  interval:6,  lastRepost:'25 mins ago' },
  { id:3, title:'iPhone 15 Pro Max 256GB',          category:'Mobiles',    price:'PKR 3,15,000',  account:'olx_ali',    status:'paused',  autoRepost:false, interval:12, lastRepost:'2 hrs ago' },
  { id:4, title:'Toyota Corolla 2021 Automatic',    category:'Cars',       price:'PKR 55,00,000', account:'olx_ali',    status:'active',  autoRepost:true,  interval:3,  lastRepost:'55 mins ago' },
  { id:5, title:'Shop for Rent Main Boulevard',     category:'Property',   price:'PKR 85,000/mo', account:'zameen_pk',  status:'expired', autoRepost:false, interval:24, lastRepost:'1 day ago' },
  { id:6, title:'Dell XPS 15 Laptop',              category:'Electronics', price:'PKR 2,80,000',  account:'olx_ali',    status:'active',  autoRepost:true,  interval:6,  lastRepost:'3 hrs ago' },
  { id:7, title:'Studio Apartment F-10',           category:'Property',   price:'PKR 45,000/mo', account:'zameen_pk',  status:'active',  autoRepost:false, interval:12, lastRepost:'5 hrs ago' },
  { id:8, title:'Suzuki Alto 2022 VXR',            category:'Cars',       price:'PKR 27,50,000', account:'pk_prop',    status:'active',  autoRepost:true,  interval:3,  lastRepost:'1 hr ago' },
]

const INTERVALS = [1,3,6,12,24]

export default function Ads() {
  const [ads, setAds]         = useState(INITIAL_ADS)
  const [filter, setFilter]   = useState('all')
  const [search, setSearch]   = useState('')
  const [reposting, setReposting] = useState(null)
  const [toast, setToast]     = useState(null)

  const showToast = (msg, type='success') => { setToast({msg,type}); setTimeout(()=>setToast(null),3000) }

  const toggleAd  = id => setAds(p=>p.map(a=>a.id===id?{...a,autoRepost:!a.autoRepost}:a))
  const setInterval_ = (id, val) => setAds(p=>p.map(a=>a.id===id?{...a,interval:+val}:a))

  const handleRepost = async (id) => {
    setReposting(id)
    await new Promise(r=>setTimeout(r,1500))
    setAds(p=>p.map(a=>a.id===id?{...a,lastRepost:'Just now'}:a))
    setReposting(null)
    showToast('Ad reposted successfully!')
  }

  const filtered = ads.filter(a => {
    if (filter!=='all' && a.status!==filter) return false
    if (search && !a.title.toLowerCase().includes(search.toLowerCase())) return false
    return true
  })

  return (
    <div style={{display:'flex'}}>
      <Sidebar />
      <main className="main-layout">
        <Header title="My Ads" subtitle="Manage auto-reposting for all your classified ads" />
        <div className="page-content fade-in">
          {/* Controls */}
          <div style={{display:'flex',gap:12,marginBottom:24,flexWrap:'wrap',alignItems:'center'}}>
            <div style={{position:'relative',flex:1,minWidth:200}}>
              <Search size={15} style={{position:'absolute',left:12,top:'50%',transform:'translateY(-50%)',color:'var(--text-muted)'}} />
              <input className="input-field" style={{paddingLeft:36}} placeholder="Search ads..."
                value={search} onChange={e=>setSearch(e.target.value)} />
            </div>
            {['all','active','paused','expired'].map(f=>(
              <button key={f} onClick={()=>setFilter(f)}
                style={{padding:'9px 16px',borderRadius:8,fontSize:13,fontWeight:600,cursor:'pointer',border:'1px solid',
                  background: filter===f?'rgba(59,130,246,0.15)':'transparent',
                  color: filter===f?'#60a5fa':'var(--text-muted)',
                  borderColor: filter===f?'rgba(59,130,246,0.3)':'var(--border-light)',
                  transition:'all 0.2s', fontFamily:'Inter,sans-serif'}}>
                {f.charAt(0).toUpperCase()+f.slice(1)}
              </button>
            ))}
          </div>

          <div style={{background:'var(--bg-card)',border:'1px solid var(--border)',borderRadius:16,overflow:'hidden'}}>
            <div style={{padding:'16px 24px',borderBottom:'1px solid var(--border)',display:'flex',alignItems:'center',justifyContent:'space-between'}}>
              <span style={{fontSize:13,color:'var(--text-muted)'}}>{filtered.length} ad{filtered.length!==1?'s':''} found</span>
              <div style={{display:'flex',alignItems:'center',gap:6,fontSize:12,color:'var(--text-muted)'}}>
                <Clock size={12}/> Auto-saves on toggle
              </div>
            </div>
            <div style={{overflowX:'auto'}}>
              <table className="data-table">
                <thead>
                  <tr>
                    <th>Ad Title</th>
                    <th>Category</th>
                    <th>Price</th>
                    <th>Account</th>
                    <th>Status</th>
                    <th>Interval</th>
                    <th>Last Repost</th>
                    <th>Auto-Repost</th>
                    <th>Action</th>
                  </tr>
                </thead>
                <tbody>
                  {filtered.map(ad=>(
                    <tr key={ad.id}>
                      <td style={{color:'var(--text-primary)',fontWeight:600,minWidth:200}}>{ad.title}</td>
                      <td><span className="badge badge-purple">{ad.category}</span></td>
                      <td style={{fontWeight:600,color:'var(--text-primary)',fontSize:12}}>{ad.price}</td>
                      <td style={{fontSize:12}}><span style={{color:'var(--accent-cyan)'}}>{ad.account}</span></td>
                      <td>
                        <span className={`badge ${
                          ad.status==='active'?'badge-success':
                          ad.status==='paused'?'badge-warning':'badge-error'
                        }`}>{ad.status}</span>
                      </td>
                      <td>
                        <select className="select-field" style={{padding:'5px 8px'}}
                          value={ad.interval} onChange={e=>setInterval_(ad.id,e.target.value)}>
                          {INTERVALS.map(h=><option key={h} value={h}>Every {h}h</option>)}
                        </select>
                      </td>
                      <td style={{fontSize:12,color:'var(--text-muted)'}}>{ad.lastRepost}</td>
                      <td><div className={`toggle-switch ${ad.autoRepost?'active':''}`} onClick={()=>toggleAd(ad.id)}/></td>
                      <td>
                        <button className="btn-secondary" style={{padding:'6px 12px',fontSize:11}}
                          onClick={()=>handleRepost(ad.id)} disabled={reposting===ad.id}>
                          <RefreshCw size={12} style={{animation:reposting===ad.id?'spin 1s linear infinite':'none'}}/>
                          {reposting===ad.id?'Reposting...':'Repost Now'}
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </main>
      {toast&&<div className={`toast ${toast.type==='success'?'toast-success':'toast-error'}`}>{toast.type==='success'?'✅':'❌'} {toast.msg}</div>}
      <style>{`@keyframes spin{from{transform:rotate(0deg)}to{transform:rotate(360deg)}}`}</style>
    </div>
  )
}
