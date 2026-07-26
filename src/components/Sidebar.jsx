import React, { useState, useRef, useEffect } from 'react'
import { useNavigate, useLocation, Link } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'
import {
  LayoutDashboard, Radio, FileText, ScrollText,
  CreditCard, Settings, ChevronRight, Zap, LogOut,
  Shield, User, Bell, Menu
} from 'lucide-react'

const NAV_ITEMS = [
  { icon: LayoutDashboard, label: 'Dashboard',    path: '/dashboard' },
  { icon: Radio,           label: 'My Accounts',  path: '/accounts'  },
  { icon: FileText,        label: 'My Ads',        path: '/ads'       },
  { icon: ScrollText,      label: 'Repost Logs',   path: '/logs'      },
  { icon: CreditCard,      label: 'Subscription',  path: '/subscription'},
]

const PLAN_COLORS = {
  FREE:    '#94a3b8',
  STARTER: '#10b981',
  PRO:     '#3b82f6',
  AGENCY:  '#8b5cf6',
}

export default function Sidebar() {
  const { user, logout } = useAuth()
  const navigate  = useNavigate()
  const location  = useLocation()

  const handleLogout = () => {
    logout()
    navigate('/login')
  }

  return (
    <aside className="sidebar">
      {/* Logo */}
      <div style={{ padding: '24px 20px', borderBottom: '1px solid var(--border)' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
          <div style={{
            width: 36, height: 36, borderRadius: 10,
            background: 'linear-gradient(135deg, #3b82f6, #8b5cf6)',
            display: 'flex', alignItems: 'center', justifyContent: 'center'
          }}>
            <Zap size={18} color="white" />
          </div>
          <div>
            <div style={{ fontSize: 16, fontWeight: 800, color: 'var(--text-primary)', letterSpacing: '-0.02em' }}>RepostHub</div>
            <div style={{ fontSize: 10, color: 'var(--text-muted)', fontWeight: 500, letterSpacing: '0.06em', textTransform: 'uppercase' }}>Auto-Repost Platform</div>
          </div>
        </div>
      </div>

      {/* Nav */}
      <nav style={{ flex: 1, padding: '16px 12px' }}>
        <div style={{ fontSize: 10, fontWeight: 700, color: 'var(--text-muted)', letterSpacing: '0.1em', textTransform: 'uppercase', padding: '0 8px', marginBottom: 8 }}>Menu</div>
        {NAV_ITEMS.map(({ icon: Icon, label, path }) => {
          const active = location.pathname === path
          return (
            <Link key={path} to={path} className={`nav-item ${active ? 'active' : ''}`}>
              <Icon size={17} className="nav-icon" style={{ color: active ? 'var(--accent-blue)' : 'var(--text-muted)' }} />
              <span style={{ flex: 1 }}>{label}</span>
              {active && <ChevronRight size={14} style={{ color: 'var(--accent-blue)' }} />}
            </Link>
          )
        })}

        {user?.role === 'ADMIN' && (
          <>
            <div style={{ fontSize: 10, fontWeight: 700, color: 'var(--text-muted)', letterSpacing: '0.1em', textTransform: 'uppercase', padding: '16px 8px 8px', marginTop: 4 }}>Admin</div>
            <Link to="/admin" className={`nav-item ${location.pathname === '/admin' ? 'active' : ''}`}>
              <Shield size={17} style={{ color: location.pathname === '/admin' ? 'var(--accent-blue)' : 'var(--text-muted)' }} />
              <span style={{ flex: 1 }}>Admin Panel</span>
            </Link>
          </>
        )}
      </nav>

      {/* User info */}
      <div style={{ padding: '16px 12px', borderTop: '1px solid var(--border)' }}>
        {/* Plan badge */}
        <div style={{
          display: 'flex', alignItems: 'center', justifyContent: 'space-between',
          background: 'rgba(59,130,246,0.06)', border: '1px solid rgba(59,130,246,0.15)',
          borderRadius: 10, padding: '10px 12px', marginBottom: 12
        }}>
          <div>
            <div style={{ fontSize: 10, color: 'var(--text-muted)', fontWeight: 600, letterSpacing:'0.06em', textTransform:'uppercase' }}>Current Plan</div>
            <div style={{ fontSize: 13, fontWeight: 700, color: PLAN_COLORS[user?.plan] || '#94a3b8', marginTop: 2 }}>{user?.plan || 'FREE'}</div>
          </div>
          <div style={{ textAlign: 'right' }}>
            <div style={{ fontSize: 10, color: 'var(--text-muted)', fontWeight: 600, letterSpacing:'0.06em', textTransform:'uppercase' }}>Credits</div>
            <div style={{ fontSize: 15, fontWeight: 800, color: 'var(--text-primary)', marginTop: 2 }}>{user?.credits ?? 0}</div>
          </div>
        </div>

        {/* User row */}
        <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
          <div className="avatar" style={{ width: 34, height: 34, fontSize: 13 }}>
            {user?.name?.charAt(0).toUpperCase()}
          </div>
          <div style={{ flex: 1, minWidth: 0 }}>
            <div style={{ fontSize: 13, fontWeight: 600, color: 'var(--text-primary)', overflow:'hidden', textOverflow:'ellipsis', whiteSpace:'nowrap' }}>{user?.name}</div>
            <div style={{ fontSize: 11, color: 'var(--text-muted)', overflow:'hidden', textOverflow:'ellipsis', whiteSpace:'nowrap' }}>{user?.email}</div>
          </div>
          <button onClick={handleLogout} style={{ background:'none', border:'none', cursor:'pointer', color:'var(--text-muted)', padding: 4, borderRadius: 6, transition:'color 0.2s' }}
            onMouseEnter={e=>e.target.style.color='#ef4444'} onMouseLeave={e=>e.target.style.color='var(--text-muted)'}>
            <LogOut size={16} />
          </button>
        </div>
      </div>
    </aside>
  )
}
