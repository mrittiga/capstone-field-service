import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'
import { useTheme } from '../context/ThemeContext'
import { UserRole } from '../types/index'

export default function RegisterPage() {
  const navigate = useNavigate()
  const { register } = useAuth()
  const { isDark, toggleTheme } = useTheme()
  const [name, setName] = useState('')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [role, setRole] = useState<UserRole>('CUSTOMER')
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError('')
    setLoading(true)
    if (!name.trim()) { setError('Name required'); setLoading(false); return }
    if (!email.trim()) { setError('Email required'); setLoading(false); return }
    if (!password.trim() || password.length < 6) { setError('Password min 6 chars'); setLoading(false); return }
    try {
      await register(name.trim(), email.trim(), password, role)
      navigate('/dispatcher')
    } catch (err: any) {
      setError(err.message || 'Registration failed')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="auth-container">
      <div className="auth-backdrop auth-backdrop-1"></div>
      <div className="auth-backdrop auth-backdrop-2"></div>
      <div className="auth-card">
        <div className="glass">
          <div className="auth-header">
            <div className="auth-icon">⚙️</div>
            <h1>Create Account</h1>
            <p>Join our work order system</p>
          </div>
          <form onSubmit={handleSubmit}>
            {error && <div className="alert alert-danger">❌ {error}</div>}
            <div className="form-group">
              <label>Full Name</label>
              <input type="text" value={name} onChange={(e) => setName(e.target.value)} placeholder="John Doe" required />
            </div>
            <div className="form-group">
              <label>Email Address</label>
              <input type="email" value={email} onChange={(e) => setEmail(e.target.value)} placeholder="you@example.com" required />
            </div>
            <div className="form-group">
              <label>Password</label>
              <input type="password" value={password} onChange={(e) => setPassword(e.target.value)} placeholder="••••••••" required />
            </div>
            <div className="form-group">
              <label>Role</label>
              <select value={role} onChange={(e) => setRole(e.target.value as UserRole)}>
                <option value="CUSTOMER">Customer</option>
                <option value="TECHNICIAN">Technician</option>
                <option value="DISPATCHER">Dispatcher</option>
                <option value="MANAGER">Manager</option>
              </select>
            </div>
            <button type="submit" className="btn btn-primary" style={{ width: '100%' }}>
              {loading ? '⏳ Creating...' : 'Create Account'}
            </button>
          </form>
          <div className="auth-footer">
            <p>Have an account? <button type="button" onClick={() => navigate('/login')} className="btn btn-secondary btn-sm">Sign in</button></p>
            <button type="button" onClick={toggleTheme} className="theme-toggle"><div className="toggle-circle">{isDark ? '🌙' : '☀️'}</div></button>
          </div>
        </div>
      </div>
    </div>
  )
}
