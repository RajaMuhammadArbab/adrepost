import React, { useState, useRef, useEffect } from 'react'
import { useAuth } from '../context/AuthContext'
import { useNavigate } from 'react-router-dom'
import { Bell, Settings, LogOut, User, ChevronDown, Shield, Menu, X } from 'lucide-react'
import { useLocation, Link } from 'react-router-dom'
import { LayoutDashboard, Radio, FileText, ScrollText, CreditCard, ChevronRight, Zap } from 'lucide-react'

const NAV_ITEMS = [
  { icon: LayoutDashboard, label: 'Dashboard',   path: '/dashboard' },
  { icon: Radio,           label: 'My Accounts', path: '/accounts'  },
  { icon: FileText,        label: 'My Ads',       path: '/ads'       },
  { icon: ScrollText,      label: 'Repost Logs',  path: '/logs'      },
  { icon: CreditCard,      label: 'Subscription', path: '/subscription'},
]

export default function Header({ title, subtitle }) {
  const { user, logout } = useAuth()
  const navigate  = useNavigate()
  const location  = useLocation()
  const [open, setOpen]     = useState(false)
  const [mobileNav, setMobileNav] = useState(false)
  const ref = useRef(null)

  useEffect(() => {
    const handler = (e) => { if (ref.current && !ref.current.contains(e.target)) setOpen(false) }
    document.addEventListener('mousedown', handler)
    return () => document.removeEventListener('mousedown', handler)
  }, [])

  // Close mobile nav when route changes
  useEffect(() => { setMobileNav(false) }, [location.pathname])

  return (
    <>
      <header className="page-header">
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
            {/* Mobile hamburger */}
            <button
              className="mobile-menu-btn"
              onClick={() => setMobileNav(!mobileNav)}
              style={{ display:'none' }}
            >
              <Menu size={20} />
            </button>
            <div>
              <h1 style={{ fontSize: 18, fontWeight: 700, color: 'var(--text-primary)', letterSpacing: '-0.01em' }}>{title}</h1>
              {subtitle && <p style={{ fontSize: 12, color: 'var(--text-muted)', marginTop: 2 }}>{subtitle}</p>}
            </div>
          </div>

          <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
            <button style={{
              width: 36, height: 36, border: '1px solid var(--border)',
              background: 'white', borderRadius: 10, display: 'flex',
              alignItems: 'center', justifyContent: 'center', cursor: 'pointer',
              color: 'var(--text-muted)', position: 'relative', transition: 'all 0.2s'
            }}>
              <Bell size={16} />
              <span style={{
                position:'absolute', top: 6, right: 6, width: 7, height: 7,
                background: '#e11d48', borderRadius: '50%', border: '2px solid white'
              }} />
            </button>

            <div ref={ref} style={{ position: 'relative' }}>
              <button onClick={() => setOpen(!open)} style={{
                display: 'flex', alignItems: 'center', gap: 8,
                background: 'white', border: '1px solid var(--border)',
                borderRadius: 10, padding: '5px 10px 5px 5px', cursor: 'pointer',
                transition: 'all 0.2s'
              }}>
                <div className="avatar" style={{ width: 26, height: 26, fontSize: 11 }}>
                  {user?.name?.charAt(0).toUpperCase()}
                </div>
                <span className="hide-mobile" style={{ fontSize: 13, fontWeight: 600, color: 'var(--text-primary)' }}>
                  {user?.name?.split(' ')[0]}
                </span>
                <ChevronDown size={13} style={{ color: 'var(--text-muted)', transform: open ? 'rotate(180deg)':'rotate(0)', transition:'transform 0.2s' }} />
              </button>
              {open && (
                <div className="dropdown">
                  <div style={{ padding: '8px 12px', borderBottom: '1px solid var(--border)', marginBottom: 4 }}>
                    <div style={{ fontSize: 13, fontWeight: 600, color: 'var(--text-primary)' }}>{user?.name}</div>
                    <div style={{ fontSize: 11, color: 'var(--text-muted)' }}>{user?.email}</div>
                  </div>
                  {user?.role === 'ADMIN' && (
                    <div className="dropdown-item" onClick={() => { navigate('/admin'); setOpen(false) }}>
                      <Shield size={15} style={{color:'var(--accent-purple)'}} /> Admin Panel
                    </div>
                  )}
                  <div className="dropdown-item" onClick={() => setOpen(false)}>
                    <User size={15} /> Profile Settings
                  </div>
                  <div className="dropdown-item" onClick={() => setOpen(false)}>
                    <Settings size={15} /> Preferences
                  </div>
                  <div style={{ borderTop: '1px solid var(--border)', marginTop: 4, paddingTop: 4 }}>
                    <div className="dropdown-item" style={{ color: '#e11d48' }}
                      onClick={() => { logout(); navigate('/login') }}>
                      <LogOut size={15} /> Logout
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </header>

      {/* Mobile Nav Overlay */}
      {mobileNav && (
        <div className="mobile-nav-overlay" onClick={() => setMobileNav(false)}>
          <div className="mobile-nav-panel" onClick={e => e.stopPropagation()}>
            {/* Logo */}
            <div style={{ padding:'20px', borderBottom:'1px solid var(--border)', display:'flex', alignItems:'center', justifyContent:'space-between' }}>
              <div style={{ display:'flex', alignItems:'center', gap:10 }}>
                <div style={{ width:34, height:34, borderRadius:10, background:'linear-gradient(135deg,#4f46e5,#7c3aed)', display:'flex', alignItems:'center', justifyContent:'center' }}>
                  <Zap size={16} color="white" />
                </div>
                <div style={{ fontSize:15, fontWeight:800, color:'var(--text-primary)' }}>RepostHub</div>
              </div>
              <button onClick={() => setMobileNav(false)} style={{ background:'none', border:'none', cursor:'pointer', color:'var(--text-muted)' }}>
                <X size={20} />
              </button>
            </div>
            {/* Nav Links */}
            <nav style={{ padding:'12px' }}>
              {NAV_ITEMS.map(({ icon: Icon, label, path }) => {
                const active = location.pathname === path
                return (
                  <Link key={path} to={path} className={`nav-item ${active ? 'active' : ''}`} style={{ marginBottom:2 }}>
                    <Icon size={17} style={{ color: active ? 'var(--accent-blue)' : 'var(--text-muted)' }} />
                    <span style={{ flex:1 }}>{label}</span>
                    {active && <ChevronRight size={14} style={{ color:'var(--accent-blue)' }} />}
                  </Link>
                )
              })}
              {user?.role === 'ADMIN' && (
                <Link to="/admin" className={`nav-item ${location.pathname === '/admin' ? 'active' : ''}`}>
                  <Shield size={17} style={{ color:'var(--text-muted)' }} />
                  <span style={{ flex:1 }}>Admin Panel</span>
                </Link>
              )}
            </nav>
            {/* User info */}
            <div style={{ padding:'12px', borderTop:'1px solid var(--border)', marginTop:'auto' }}>
              <div style={{ display:'flex', alignItems:'center', gap:10, padding:'10px 12px', background:'#f8fafc', borderRadius:12 }}>
                <div className="avatar" style={{ width:32, height:32, fontSize:12 }}>{user?.name?.charAt(0).toUpperCase()}</div>
                <div style={{ flex:1, minWidth:0 }}>
                  <div style={{ fontSize:13, fontWeight:600, color:'var(--text-primary)', overflow:'hidden', textOverflow:'ellipsis', whiteSpace:'nowrap' }}>{user?.name}</div>
                  <div style={{ fontSize:11, color:'var(--text-muted)' }}>{user?.plan} Plan</div>
                </div>
                <button onClick={() => { logout(); navigate('/login') }} style={{ background:'none', border:'none', cursor:'pointer', color:'#94a3b8' }}>
                  <LogOut size={15} />
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  )
}
