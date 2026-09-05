import { ReactNode, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'
import { useTheme } from '../context/ThemeContext'
import '../styles/layout.css'

interface LayoutProps {
  title: string
  children: ReactNode
  sidebarItems: Array<{ label: string; path: string; icon: string }>
}

export default function Layout({ title, children, sidebarItems }: LayoutProps) {
  const navigate = useNavigate()
  const { user, logout } = useAuth()
  const { isDark, toggleTheme } = useTheme()

  const handleLogout = () => {
    logout()
    navigate('/login')
  }

  const getUserInitials = () => {
    return user?.name
      .split(' ')
      .map(n => n[0])
      .join('')
      .toUpperCase() || 'U'
  }

  return (
    <div className="app-container">
      {/* Sidebar */}
      <aside className="sidebar">
        <div className="sidebar-brand">
          <div style={{
            width: '32px',
            height: '32px',
            borderRadius: '0.5rem',
            background: 'linear-gradient(135deg, var(--primary) 0%, var(--secondary) 100%)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            color: 'white',
            fontSize: '1.25rem',
            fontWeight: 'bold'
          }}>
            ⚙️
          </div>
          <h2>Capstone</h2>
        </div>

        <nav className="sidebar-nav">
          {sidebarItems.map(item => (
            <button
              key={item.path}
              onClick={() => navigate(item.path)}
              className={`sidebar-nav-item ${location.pathname === item.path ? 'active' : ''}`}
            >
              <span style={{ fontSize: '1.25rem' }}>{item.icon}</span>
              {item.label}
            </button>
          ))}
        </nav>

        <div className="sidebar-footer">
          <div className="user-info">
            <div className="user-avatar">{getUserInitials()}</div>
            <div className="user-details">
              <p className="user-name">{user?.name}</p>
              <p className="user-role">{user?.role}</p>
            </div>
          </div>
          <button onClick={handleLogout} className="btn btn-secondary btn-sm" style={{ width: '100%' }}>
            Logout
          </button>
        </div>
      </aside>

      {/* Main Content */}
      <div className="main-content">
        <header className="header">
          <h1 className="header-title">{title}</h1>
          <div className="header-actions">
            <button 
              className="theme-toggle"
              onClick={toggleTheme}
              style={isDark ? { background: 'var(--primary)' } : {}}
            >
              <div className="toggle-circle">
                {isDark ? '🌙' : '☀️'}
              </div>
            </button>
          </div>
        </header>

        <div className="content">
          {children}
        </div>
      </div>
    </div>
  )
}
