import React, { createContext, useContext, useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'

const AuthContext = createContext(null)

const MOCK_USERS = [
  { id: '1', name: 'Ali Hassan', email: 'ali@demo.com', password: 'demo1234', role: 'USER',  credits: 150, plan: 'PRO',     isActive: true  },
  { id: '2', name: 'Admin User',  email: 'admin@demo.com',password: 'admin1234',role: 'ADMIN', credits: 999, plan: 'AGENCY', isActive: true  },
]

export function AuthProvider({ children }) {
  const [user, setUser]       = useState(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const saved = localStorage.getItem('rh_user')
    if (saved) setUser(JSON.parse(saved))
    setLoading(false)
  }, [])

  const login = (email, password) => {
    const found = MOCK_USERS.find(u => u.email === email && u.password === password)
    if (!found) return { success: false, message: 'Invalid email or password' }
    if (!found.isActive) return { success: false, message: 'Account is deactivated' }
    const { password: _, ...safeUser } = found
    setUser(safeUser)
    localStorage.setItem('rh_user', JSON.stringify(safeUser))
    return { success: true, user: safeUser }
  }

  const register = (data) => {
    const exists = MOCK_USERS.find(u => u.email === data.email)
    if (exists) return { success: false, message: 'Email already registered' }
    return { success: true }
  }

  const logout = () => {
    setUser(null)
    localStorage.removeItem('rh_user')
  }

  return (
    <AuthContext.Provider value={{ user, login, logout, register, loading }}>
      {children}
    </AuthContext.Provider>
  )
}

export const useAuth = () => useContext(AuthContext)
