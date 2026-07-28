import React, { useState } from 'react'
import Sidebar from '../components/Sidebar'
import Header from '../components/Header'
import { Plus, RefreshCw, Wifi, WifiOff, Trash2, X, AlertCircle, Globe } from 'lucide-react'

const INITIAL_ACCOUNTS = [
  { id:1, username:'ali_cars_pk',    site:'OLX Pakistan', status:'active',  lastSync:'2 mins ago',   adsCount:14, color:'#10b981', proxy:'US-East (DataImpulse)' },
  { id:2, username:'zameen_listings', site:'Zameen.com',   status:'active',  lastSync:'18 mins ago',  adsCount:9,  color:'#3b82f6', proxy:'UK-London (DataImpulse)' },
  { id:3, username:'pk_properties',   site:'OLX Pakistan', status:'error',   lastSync:'3 hrs ago',    adsCount:6,  color:'#ef4444', proxy:'US-West (DataImpulse)' },
]

export default function Accounts() {
  const [accounts, setAccounts] = useState(INITIAL_ACCOUNTS)
  const [showModal, setShowModal] = useState(false)
  const [form, setForm]       = useState({ username:'', password:'', site:'OLX Pakistan', proxy:'US-East (DataImpulse)' })
  const [syncing, setSyncing] = useState(null)
  const [toast, setToast]     = useState(null)

  const showToast = (msg, type='success') => {
    setToast({ msg, type })
    setTimeout(() => setToast(null), 3000)
  }

  const handleConnect = (e) => {
    e.preventDefault()
    const newAcc = { id: Date.now(), username: form.username, site: form.site, status:'active', lastSync:'Just now', adsCount:0, color:'#10b981', proxy: form.proxy }
    setAccounts(prev => [...prev, newAcc])
    setShowModal(false)
    setForm({ username:'', password:'', site:'OLX Pakistan', proxy:'US-East (DataImpulse)' })
    showToast(`Account "${newAcc.username}" connected successfully!`)
  }

  const handleSync = async (id) => {
    setSyncing(id)
    await new Promise(r => setTimeout(r, 1800))
    setAccounts(prev => prev.map(a => a.id===id ? {...a, lastSync:'Just now', status:'active'} : a))
    setSyncing(null)
    showToast('Ads synced successfully!')
  }

  const handleDelete = (id) => {
    setAccounts(prev => prev.filter(a => a.id!==id))
    showToast('Account removed', 'error')
  }

  return (
    <div style={{ display:'flex' }}>
      <Sidebar />
      <main className="main-layout">
        <Header title="Connected Accounts" subtitle="Manage your classified ad platform accounts and proxy sessions" />
        <div className="page-content fade-in">
          {/* Top bar */}
          <div style={{ display:'flex', alignItems:'center', justifyContent:'space-between', marginBottom:24 }}>
            <div style={{ fontSize:13, color:'var(--text-muted)' }}>{accounts.length} account{accounts.length!==1?'s':''} connected with dedicated proxies</div>
            <button className="btn-primary" onClick={()=>setShowModal(true)}>
              <Plus size={16} /> Connect Account
            </button>
          </div>

          {/* Account cards */}
          <div style={{ display:'grid', gridTemplateColumns:'repeat(auto-fill, minmax(320px,1fr))', gap:20 }}>
            {accounts.map(acc => (
              <div key={acc.id} style={{ background:'var(--bg-card)', border:'1px solid var(--border)', borderRadius:16, padding:24, transition:'all 0.2s', position:'relative', overflow:'hidden' }}
                onMouseEnter={e=>{e.currentTarget.style.borderColor='var(--accent-blue)';e.currentTarget.style.transform='translateY(-2px)'}}
                onMouseLeave={e=>{e.currentTarget.style.borderColor='var(--border)';e.currentTarget.style.transform='translateY(0)'}}>
                <div style={{ position:'absolute', top:0, left:0, right:0, height:3, background: acc.status==='active' ? 'linear-gradient(90deg,#10b981,#34d399)' : 'linear-gradient(90deg,#ef4444,#f87171)', borderRadius:'16px 16px 0 0' }} />
                
                <div style={{ display:'flex', alignItems:'flex-start', justifyContent:'space-between', marginBottom:16 }}>
                  <div style={{ display:'flex', alignItems:'center', gap:12 }}>
                    <div style={{ width:44, height:44, borderRadius:12, background: acc.status==='active'?'rgba(16,185,129,0.1)':'rgba(239,68,68,0.1)', display:'flex', alignItems:'center', justifyContent:'center' }}>
                      {acc.status==='active' ? <Wifi size={20} color="#10b981" /> : <WifiOff size={20} color="#ef4444" />}
                    </div>
                    <div>
                      <p style={{ fontSize:15, fontWeight:700, color:'var(--text-primary)' }}>{acc.username}</p>
                      <p style={{ fontSize:12, color:'var(--text-muted)', marginTop:2 }}>{acc.site}</p>
                    </div>
                  </div>
                  <span className={`badge ${acc.status==='active'?'badge-success':'badge-error'}`}>{acc.status}</span>
                </div>
                
                <div style={{ display:'flex', alignItems:'center', gap:6, fontSize:11, color:'var(--text-secondary)', marginBottom:16, background:'var(--bg-secondary)', padding:'6px 10px', borderRadius:8 }}>
                  <Globe size={12} color="var(--accent-blue)" /> Session Proxy: <span style={{fontWeight:600}}>{acc.proxy}</span>
                </div>

                <div style={{ display:'grid', gridTemplateColumns:'1fr 1fr', gap:12, marginBottom:16 }}>
                  <div style={{ background:'var(--bg-secondary)', borderRadius:10, padding:'10px 14px' }}>
                    <p style={{ fontSize:11, color:'var(--text-muted)', marginBottom:4 }}>ACTIVE ADS</p>
                    <p style={{ fontSize:22, fontWeight:800, color:'var(--text-primary)' }}>{acc.adsCount}</p>
                  </div>
                  <div style={{ background:'var(--bg-secondary)', borderRadius:10, padding:'10px 14px' }}>
                    <p style={{ fontSize:11, color:'var(--text-muted)', marginBottom:4 }}>LAST SYNC</p>
                    <p style={{ fontSize:13, fontWeight:600, color:'var(--text-secondary)' }}>{acc.lastSync}</p>
                  </div>
                </div>
                <div style={{ display:'flex', gap:8 }}>
                  <button className="btn-secondary" style={{ flex:1, justifyContent:'center', padding:'9px 14px', fontSize:12 }}
                    onClick={()=>handleSync(acc.id)} disabled={syncing===acc.id}>
                    <RefreshCw size={14} style={{ animation: syncing===acc.id?'spin 1s linear infinite':'none' }} />
                    {syncing===acc.id ? 'Syncing...' : 'Sync Ads'}
                  </button>
                  <button className="btn-danger" style={{ padding:'9px 14px' }} onClick={()=>handleDelete(acc.id)}>
                    <Trash2 size={14} />
                  </button>
                </div>
                {acc.status==='error' && (
                  <div style={{ marginTop:12, display:'flex', alignItems:'center', gap:6, fontSize:11, color:'#ef4444' }}>
                    <AlertCircle size={12} /> Session expired — reconnect to restore CAPTCHA token
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      </main>

      {/* Modal */}
      {showModal && (
        <div className="modal-overlay" onClick={()=>setShowModal(false)}>
          <div className="modal-box" onClick={e=>e.stopPropagation()}>
            <div style={{ display:'flex', alignItems:'center', justifyContent:'space-between', marginBottom:24 }}>
              <div>
                <h2 style={{ fontSize:18, fontWeight:700, color:'var(--text-primary)' }}>Connect Account</h2>
                <p style={{ fontSize:13, color:'var(--text-muted)', marginTop:4 }}>Secure connection with dedicated IP proxy</p>
              </div>
              <button onClick={()=>setShowModal(false)} style={{ background:'none', border:'none', color:'var(--text-muted)', cursor:'pointer' }}><X size={20}/></button>
            </div>
            <form onSubmit={handleConnect}>
              <div style={{ marginBottom:14 }}>
                <label style={{ fontSize:13, fontWeight:600, color:'var(--text-secondary)', display:'block', marginBottom:6 }}>Platform</label>
                <select className="select-field" style={{ width:'100%', padding:'11px 14px', borderRadius:10 }}
                  value={form.site} onChange={e=>setForm({...form, site:e.target.value})}>
                  <option>OLX Pakistan</option>
                  <option>Zameen.com</option>
                  <option>PakWheels</option>
                  <option>Rozee.pk</option>
                </select>
              </div>
              <div style={{ marginBottom:14 }}>
                <label style={{ fontSize:13, fontWeight:600, color:'var(--text-secondary)', display:'block', marginBottom:6 }}>Username / Email</label>
                <input className="input-field" type="text" placeholder="Your platform username"
                  value={form.username} onChange={e=>setForm({...form, username:e.target.value})} required />
              </div>
              <div style={{ marginBottom:14 }}>
                <label style={{ fontSize:13, fontWeight:600, color:'var(--text-secondary)', display:'block', marginBottom:6 }}>Password</label>
                <input className="input-field" type="password" placeholder="Your platform password"
                  value={form.password} onChange={e=>setForm({...form, password:e.target.value})} required />
              </div>
              <div style={{ marginBottom:24 }}>
                <label style={{ fontSize:13, fontWeight:600, color:'var(--text-secondary)', display:'block', marginBottom:6 }}>Assign Proxy Region (DataImpulse)</label>
                <select className="select-field" style={{ width:'100%', padding:'11px 14px', borderRadius:10 }}
                  value={form.proxy} onChange={e=>setForm({...form, proxy:e.target.value})}>
                  <option>US-East (DataImpulse)</option>
                  <option>US-West (DataImpulse)</option>
                  <option>UK-London (DataImpulse)</option>
                  <option>PK-Karachi (DataImpulse)</option>
                </select>
              </div>

              <div style={{ background:'rgba(59,130,246,0.06)', border:'1px solid rgba(59,130,246,0.2)', borderRadius:10, padding:'12px 14px', marginBottom:20, fontSize:12, color:'var(--text-secondary)', display:'flex', gap:10, alignItems:'flex-start' }}>
                <Globe size={16} color="var(--accent-blue)" style={{flexShrink:0, marginTop:2}}/>
                <div>
                  <strong style={{color:'var(--text-primary)'}}>Isolated Session:</strong> This account will be connected through the selected proxy to prevent CAPTCHA blocks and bans.
                </div>
              </div>
              <div style={{ display:'flex', gap:10 }}>
                <button type="button" className="btn-secondary" style={{ flex:1, justifyContent:'center' }} onClick={()=>setShowModal(false)}>Cancel</button>
                <button type="submit" className="btn-primary" style={{ flex:1, justifyContent:'center' }}>Connect Account</button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Toast */}
      {toast && (
        <div className={`toast ${toast.type==='success'?'toast-success':'toast-error'}`}>
          {toast.type==='success' ? <span>✅</span> : <span>❌</span>} {toast.msg}
        </div>
      )}
      <style>{`@keyframes spin { from{transform:rotate(0deg)} to{transform:rotate(360deg)} }`}</style>
    </div>
  )
}
