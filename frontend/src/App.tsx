import React from 'react'
import { Routes, Route, Navigate } from 'react-router-dom'
import { ThemeProvider } from './context/ThemeContext'
import { AuthProvider } from './context/AuthContext'
import LoginPage from './pages/LoginPage'
import RegisterPage from './pages/RegisterPage'
import ProtectedRoute from './components/ProtectedRoute'
import DispatcherDashboard from './pages/dispatcher/DispatcherDashboard'
import TechnicianDashboard from './pages/technician/TechnicianDashboard'
import ManagerDashboard from './pages/manager/ManagerDashboard'
import CustomerPortal from './pages/customer/CustomerPortal'

function App() {
  return (
    <ThemeProvider>
      <AuthProvider>
        <Routes>
          <Route path="/" element={<Navigate to="/login" replace />} />
          <Route path="/login" element={<LoginPage />} />
          <Route path="/register" element={<RegisterPage />} />
          
          <Route path="/dispatcher/*" element={<ProtectedRoute requiredRole="DISPATCHER"><DispatcherDashboard /></ProtectedRoute>} />
          <Route path="/technician/*" element={<ProtectedRoute requiredRole="TECHNICIAN"><TechnicianDashboard /></ProtectedRoute>} />
          <Route path="/manager/*" element={<ProtectedRoute requiredRole="MANAGER"><ManagerDashboard /></ProtectedRoute>} />
          <Route path="/customer/*" element={<ProtectedRoute requiredRole="CUSTOMER"><CustomerPortal /></ProtectedRoute>} />
          
          <Route path="*" element={<Navigate to="/login" replace />} />
        </Routes>
      </AuthProvider>
    </ThemeProvider>
  )
}

export default App
