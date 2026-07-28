import React, { createContext, useContext, useState, useEffect } from 'react'

const API = import.meta.env.VITE_API_URL || 'http://localhost:5000'

const AuthContext = createContext(null)

export function AuthProvider({ children }) {
  const [user, setUser]       = useState(null)
  const [loading, setLoading] = useState(true)

  const getAuthHeaders = () => {
    const token = localStorage.getItem('token')
    return token ? { Authorization: `Bearer ${token}` } : {}
  }

  // On mount: check if user is already logged in
  useEffect(() => {
    const token = localStorage.getItem('token')
    if (!token) {
      setLoading(false)
      return
    }
    fetch(`${API}/api/auth/me`, {
      headers: { ...getAuthHeaders() },
      credentials: 'include'
    })
      .then(r => r.ok ? r.json() : null)
      .then(data => { if (data?.user) setUser(data.user) })
      .catch(() => {})
      .finally(() => setLoading(false))
  }, [])

  const login = async (email, password) => {
    try {
      const res = await fetch(`${API}/api/auth/login`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include',
        body: JSON.stringify({ email, password })
      })
      const data = await res.json()
      if (!res.ok) return { success: false, message: data.error || 'Login failed' }
      if (data.token) localStorage.setItem('token', data.token)
      setUser(data.user)
      return { success: true, user: data.user }
    } catch {
      return { success: false, message: 'Network error. Is the server running?' }
    }
  }

  const register = async ({ name, email, password }) => {
    try {
      const res = await fetch(`${API}/api/auth/register`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include',
        body: JSON.stringify({ name, email, password })
      })
      const data = await res.json()
      if (!res.ok) return { success: false, message: data.error || 'Registration failed' }
      if (data.token) localStorage.setItem('token', data.token)
      if (data.user) setUser(data.user)
      return { success: true }
    } catch {
      return { success: false, message: 'Network error. Is the server running?' }
    }
  }

  const logout = async () => {
    localStorage.removeItem('token')
    await fetch(`${API}/api/auth/logout`, { method: 'POST', credentials: 'include' }).catch(() => {})
    setUser(null)
  }

  return (
    <AuthContext.Provider value={{ user, loading, login, register, logout, API, getAuthHeaders }}>
      {children}
    </AuthContext.Provider>
  )
}

export const useAuth = () => useContext(AuthContext)
