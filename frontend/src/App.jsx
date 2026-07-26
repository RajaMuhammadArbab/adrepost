import React from 'react'
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom'
import { AuthProvider } from './context/AuthContext'
import { ProtectedRoute, AdminRoute } from './components/ProtectedRoute'
import Login        from './pages/Login'
import Register     from './pages/Register'
import Dashboard    from './pages/Dashboard'
import Accounts     from './pages/Accounts'
import Ads          from './pages/Ads'
import Logs         from './pages/Logs'
import Subscription from './pages/Subscription'
import Admin        from './pages/Admin'

export default function App() {
  return (
    <BrowserRouter>
      <AuthProvider>
        <Routes>
          <Route path="/login"    element={<Login />} />
          <Route path="/register" element={<Register />} />

          <Route path="/dashboard" element={<ProtectedRoute><Dashboard /></ProtectedRoute>} />
          <Route path="/accounts"  element={<ProtectedRoute><Accounts /></ProtectedRoute>} />
          <Route path="/ads"       element={<ProtectedRoute><Ads /></ProtectedRoute>} />
          <Route path="/logs"      element={<ProtectedRoute><Logs /></ProtectedRoute>} />
          <Route path="/subscription" element={<ProtectedRoute><Subscription /></ProtectedRoute>} />

          <Route path="/admin" element={<AdminRoute><Admin /></AdminRoute>} />

          <Route path="/" element={<Navigate to="/dashboard" replace />} />
          <Route path="*" element={<Navigate to="/dashboard" replace />} />
        </Routes>
      </AuthProvider>
    </BrowserRouter>
  )
}
