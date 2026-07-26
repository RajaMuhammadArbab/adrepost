import React, { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'
import { Zap, Eye, EyeOff, AlertCircle } from 'lucide-react'

export default function Login() {
  const { login } = useAuth()
  const navigate  = useNavigate()
  const [form, setForm]     = useState({ email: '', password: '' })
  const [showPw, setShowPw] = useState(false)
  const [error, setError]   = useState('')
  const [loading, setLoading] = useState(false)

  const handleChange = e => setForm({ ...form, [e.target.name]: e.target.value })

  const handleSubmit = async (e) => {
    e.preventDefault()
    setError('')
    setLoading(true)
    await new Promise(r => setTimeout(r, 600))
    const result = login(form.email, form.password)
    setLoading(false)
    if (!result.success) { setError(result.message); return }
    navigate(result.user.role === 'ADMIN' ? '/admin' : '/dashboard')
  }

  return (
    <div className="auth-page">
      <div className="auth-card">
        {/* Logo */}
        <div style={{ textAlign: 'center', marginBottom: 32 }}>
          <div style={{
            width: 52, height: 52, borderRadius: 14,
            background: 'linear-gradient(135deg, #3b82f6, #8b5cf6)',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            margin: '0 auto 16px', boxShadow: '0 8px 24px rgba(59,130,246,0.3)'
          }}>
            <Zap size={24} color="white" />
          </div>
          <h1 style={{ fontSize: 24, fontWeight: 800, color: 'var(--text-primary)', letterSpacing: '-0.02em' }}>Welcome back</h1>
          <p style={{ fontSize: 14, color: 'var(--text-muted)', marginTop: 6 }}>Sign in to your RepostHub account</p>
        </div>

        {/* Demo hint */}
        <div style={{
          background: 'rgba(59,130,246,0.06)', border: '1px solid rgba(59,130,246,0.15)',
          borderRadius: 10, padding: '10px 14px', marginBottom: 24, fontSize: 12,
          color: 'var(--text-secondary)', lineHeight: 1.6
        }}>
          <strong style={{color:'var(--accent-blue)'}}>Demo credentials:</strong><br/>
          User: <code style={{color:'#a78bfa'}}>ali@demo.com</code> / <code style={{color:'#a78bfa'}}>demo1234</code><br/>
          Admin: <code style={{color:'#a78bfa'}}>admin@demo.com</code> / <code style={{color:'#a78bfa'}}>admin1234</code>
        </div>

        {error && (
          <div style={{
            display:'flex', alignItems:'center', gap:8, background:'rgba(239,68,68,0.08)',
            border:'1px solid rgba(239,68,68,0.2)', borderRadius:10, padding:'10px 14px', marginBottom:20
          }}>
            <AlertCircle size={15} color="#ef4444" />
            <span style={{fontSize:13, color:'#ef4444'}}>{error}</span>
          </div>
        )}

        <form onSubmit={handleSubmit}>
          <div style={{ marginBottom: 16 }}>
            <label style={{ fontSize: 13, fontWeight: 600, color: 'var(--text-secondary)', display:'block', marginBottom: 6 }}>Email Address</label>
            <input className="input-field" type="email" name="email" placeholder="ali@demo.com"
              value={form.email} onChange={handleChange} required />
          </div>
          <div style={{ marginBottom: 24 }}>
            <label style={{ fontSize: 13, fontWeight: 600, color: 'var(--text-secondary)', display:'block', marginBottom: 6 }}>Password</label>
            <div style={{ position: 'relative' }}>
              <input className="input-field" type={showPw ? 'text':'password'} name="password"
                placeholder="Enter password" value={form.password} onChange={handleChange}
                required style={{ paddingRight: 44 }} />
              <button type="button" onClick={() => setShowPw(!showPw)}
                style={{ position:'absolute', right:12, top:'50%', transform:'translateY(-50%)',
                  background:'none', border:'none', color:'var(--text-muted)', cursor:'pointer' }}>
                {showPw ? <EyeOff size={16}/> : <Eye size={16}/>}
              </button>
            </div>
          </div>
          <button type="submit" className="btn-primary" style={{ width:'100%', justifyContent:'center', padding:'13px 20px', fontSize:15 }} disabled={loading}>
            {loading ? 'Signing in...' : 'Sign In'}
          </button>
        </form>

        <p style={{ textAlign:'center', marginTop:24, fontSize:13, color:'var(--text-muted)' }}>
          Don't have an account? <Link to="/register" style={{ color:'var(--accent-blue)', fontWeight:600, textDecoration:'none' }}>Create one</Link>
        </p>
      </div>
    </div>
  )
}
