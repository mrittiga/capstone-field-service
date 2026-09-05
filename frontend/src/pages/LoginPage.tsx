import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'
import { useTheme } from '../context/ThemeContext'

export default function LoginPage() {
  const navigate = useNavigate()
  const { login } = useAuth()
  const { isDark, toggleTheme } = useTheme()
  const [email, setEmail] = useState('dispatcher@test.com')
  const [password, setPassword] = useState('password123')
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError('')
    setLoading(true)
    try {
      await login(email, password)
      navigate('/dispatcher')
    } catch (err) {
      setError('Invalid credentials')
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
            <h1>Welcome Back</h1>
            <p>Sign in to your account</p>
          </div>
          <form onSubmit={handleSubmit}>
            {error && <div className="alert alert-danger">❌ {error}</div>}
            <div className="form-group">
              <label>Email Address</label>
              <input type="email" value={email} onChange={(e) => setEmail(e.target.value)} placeholder="dispatcher@test.com" required />
            </div>
            <div className="form-group">
              <label>Password</label>
              <input type="password" value={password} onChange={(e) => setPassword(e.target.value)} placeholder="••••••••" required />
            </div>
            <button type="submit" className="btn btn-primary" style={{ width: '100%' }}>
              {loading ? '⏳ Signing in...' : 'Sign In'}
            </button>
          </form>
          <div className="auth-footer">
            <p>Don't have an account? <button type="button" onClick={() => navigate('/register')} className="btn btn-secondary btn-sm">Sign up</button></p>
            <button type="button" onClick={toggleTheme} className="theme-toggle"><div className="toggle-circle">{isDark ? '🌙' : '☀️'}</div></button>
          </div>
        </div>
      </div>
    </div>
  )
}
