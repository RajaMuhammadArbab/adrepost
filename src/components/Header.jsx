import React, { useState, useRef, useEffect } from 'react'
import { useAuth } from '../context/AuthContext'
import { useNavigate } from 'react-router-dom'
import { Bell, Settings, LogOut, User, ChevronDown, Shield } from 'lucide-react'

export default function Header({ title, subtitle }) {
  const { user, logout } = useAuth()
  const navigate = useNavigate()
  const [open, setOpen] = useState(false)
  const ref = useRef(null)

  useEffect(() => {
    const handler = (e) => { if (ref.current && !ref.current.contains(e.target)) setOpen(false) }
    document.addEventListener('mousedown', handler)
    return () => document.removeEventListener('mousedown', handler)
  }, [])

  return (
    <header className="page-header">
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
        <div>
          <h1 style={{ fontSize: 20, fontWeight: 700, color: 'var(--text-primary)', letterSpacing: '-0.01em' }}>{title}</h1>
          {subtitle && <p style={{ fontSize: 13, color: 'var(--text-muted)', marginTop: 2 }}>{subtitle}</p>}
        </div>
        <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
          {/* Notification */}
          <button style={{
            width: 36, height: 36, border: '1px solid var(--border-light)',
            background: 'var(--bg-card)', borderRadius: 10, display: 'flex',
            alignItems: 'center', justifyContent: 'center', cursor: 'pointer',
            color: 'var(--text-muted)', position: 'relative', transition: 'all 0.2s'
          }}
            onMouseEnter={e=>{e.currentTarget.style.borderColor='var(--accent-blue)';e.currentTarget.style.color='var(--text-primary)'}}
            onMouseLeave={e=>{e.currentTarget.style.borderColor='var(--border-light)';e.currentTarget.style.color='var(--text-muted)'}}>
            <Bell size={16} />
            <span style={{
              position:'absolute', top: 6, right: 6, width: 8, height: 8,
              background: '#ef4444', borderRadius: '50%', border: '2px solid var(--bg-primary)'
            }} />
          </button>

          {/* Avatar + dropdown */}
          <div ref={ref} style={{ position: 'relative' }}>
            <button onClick={() => setOpen(!open)} style={{
              display: 'flex', alignItems: 'center', gap: 8,
              background: 'var(--bg-card)', border: '1px solid var(--border-light)',
              borderRadius: 10, padding: '6px 12px 6px 6px', cursor: 'pointer',
              transition: 'all 0.2s'
            }}
              onMouseEnter={e=>e.currentTarget.style.borderColor='var(--accent-blue)'}
              onMouseLeave={e=>e.currentTarget.style.borderColor='var(--border-light)'}>
              <div className="avatar" style={{ width: 28, height: 28, fontSize: 12 }}>
                {user?.name?.charAt(0).toUpperCase()}
              </div>
              <span style={{ fontSize: 13, fontWeight: 600, color: 'var(--text-primary)' }}>{user?.name?.split(' ')[0]}</span>
              <ChevronDown size={14} style={{ color: 'var(--text-muted)', transform: open ? 'rotate(180deg)':'rotate(0)', transition:'transform 0.2s' }} />
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
                  <div className="dropdown-item" style={{ color: '#ef4444' }}
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
  )
}
