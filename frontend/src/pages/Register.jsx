import React, { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'
import { Zap, Eye, EyeOff, AlertCircle, CheckCircle } from 'lucide-react'

function PasswordStrength({ password }) {
  const getStrength = (pw) => {
    let score = 0
    if (pw.length >= 8) score++
    if (/[A-Z]/.test(pw)) score++
    if (/[0-9]/.test(pw)) score++
    if (/[^A-Za-z0-9]/.test(pw)) score++
    return score
  }
  const score = getStrength(password)
  const labels = ['', 'Weak', 'Fair', 'Strong', 'Very Strong']
  const colors = ['', '#ef4444', '#f59e0b', '#3b82f6', '#10b981']
  if (!password) return null
  return (
    <div style={{ marginTop: 8 }}>
      <div style={{ display:'flex', gap:4, marginBottom:4 }}>
        {[1,2,3,4].map(i => (
          <div key={i} style={{
            flex:1, height:3, borderRadius:2,
            background: i <= score ? colors[score] : 'var(--border-light)',
            transition: 'background 0.3s'
          }} />
        ))}
      </div>
      <span style={{ fontSize:11, color: colors[score], fontWeight:600 }}>{labels[score]}</span>
    </div>
  )
}

export default function Register() {
  const { register } = useAuth()
  const navigate = useNavigate()
  const [form, setForm]   = useState({ name:'', email:'', password:'', confirm:'' })
  const [showPw, setShowPw] = useState(false)
  const [error, setError]   = useState('')
  const [success, setSuccess] = useState(false)
  const [loading, setLoading] = useState(false)

  const handleChange = e => setForm({...form, [e.target.name]: e.target.value})

  const handleSubmit = async (e) => {
    e.preventDefault()
    setError('')
    if (form.password !== form.confirm) { setError('Passwords do not match'); return }
    if (form.password.length < 6) { setError('Password must be at least 6 characters'); return }
    setLoading(true)
    await new Promise(r => setTimeout(r, 700))
    const result = register(form)
    setLoading(false)
    if (!result.success) { setError(result.message); return }
    setSuccess(true)
    setTimeout(() => navigate('/login'), 2000)
  }

  return (
    <div className="auth-page">
      <div className="auth-card">
        <div style={{ textAlign:'center', marginBottom:32 }}>
          <div style={{
            width:52, height:52, borderRadius:14,
            background:'linear-gradient(135deg, #3b82f6, #8b5cf6)',
            display:'flex', alignItems:'center', justifyContent:'center',
            margin:'0 auto 16px', boxShadow:'0 8px 24px rgba(59,130,246,0.3)'
          }}>
            <Zap size={24} color="white" />
          </div>
          <h1 style={{ fontSize:24, fontWeight:800, color:'var(--text-primary)', letterSpacing:'-0.02em' }}>Create Account</h1>
          <p style={{ fontSize:14, color:'var(--text-muted)', marginTop:6 }}>Start automating your classified ads</p>
        </div>

        {success ? (
          <div style={{ textAlign:'center', padding:'20px 0' }}>
            <CheckCircle size={48} color="#10b981" style={{ margin:'0 auto 16px' }} />
            <p style={{ fontSize:16, fontWeight:600, color:'var(--text-primary)' }}>Account created!</p>
            <p style={{ fontSize:13, color:'var(--text-muted)', marginTop:6 }}>Redirecting to login...</p>
          </div>
        ) : (
          <form onSubmit={handleSubmit}>
            {error && (
              <div style={{ display:'flex', alignItems:'center', gap:8, background:'rgba(239,68,68,0.08)',
                border:'1px solid rgba(239,68,68,0.2)', borderRadius:10, padding:'10px 14px', marginBottom:20 }}>
                <AlertCircle size={15} color="#ef4444" />
                <span style={{fontSize:13, color:'#ef4444'}}>{error}</span>
              </div>
            )}
            <div style={{ marginBottom:14 }}>
              <label style={{ fontSize:13, fontWeight:600, color:'var(--text-secondary)', display:'block', marginBottom:6 }}>Full Name</label>
              <input className="input-field" type="text" name="name" placeholder="Ali Hassan"
                value={form.name} onChange={handleChange} required />
            </div>
            <div style={{ marginBottom:14 }}>
              <label style={{ fontSize:13, fontWeight:600, color:'var(--text-secondary)', display:'block', marginBottom:6 }}>Email Address</label>
              <input className="input-field" type="email" name="email" placeholder="ali@example.com"
                value={form.email} onChange={handleChange} required />
            </div>
            <div style={{ marginBottom:14 }}>
              <label style={{ fontSize:13, fontWeight:600, color:'var(--text-secondary)', display:'block', marginBottom:6 }}>Password</label>
              <div style={{ position:'relative' }}>
                <input className="input-field" type={showPw?'text':'password'} name="password"
                  placeholder="Min 6 characters" value={form.password} onChange={handleChange}
                  required style={{ paddingRight:44 }} />
                <button type="button" onClick={()=>setShowPw(!showPw)}
                  style={{ position:'absolute', right:12, top:'50%', transform:'translateY(-50%)',
                    background:'none', border:'none', color:'var(--text-muted)', cursor:'pointer' }}>
                  {showPw ? <EyeOff size={16}/> : <Eye size={16}/>}
                </button>
              </div>
              <PasswordStrength password={form.password} />
            </div>
            <div style={{ marginBottom:24 }}>
              <label style={{ fontSize:13, fontWeight:600, color:'var(--text-secondary)', display:'block', marginBottom:6 }}>Confirm Password</label>
              <input className="input-field" type="password" name="confirm" placeholder="Repeat password"
                value={form.confirm} onChange={handleChange} required />
            </div>
            <button type="submit" className="btn-primary" style={{ width:'100%', justifyContent:'center', padding:'13px 20px', fontSize:15 }} disabled={loading}>
              {loading ? 'Creating Account...' : 'Create Account'}
            </button>
          </form>
        )}

        <p style={{ textAlign:'center', marginTop:24, fontSize:13, color:'var(--text-muted)' }}>
          Already have an account? <Link to="/login" style={{ color:'var(--accent-blue)', fontWeight:600, textDecoration:'none' }}>Sign in</Link>
        </p>
      </div>
    </div>
  )
}
