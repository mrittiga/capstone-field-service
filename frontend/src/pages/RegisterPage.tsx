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

    try {
      await register(name, email, password, role)
      navigate('/dispatcher')
    } catch (err) {
      setError('Registration failed. Email might already exist.')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div style={{
      minHeight: '100vh',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      background: isDark 
        ? 'linear-gradient(135deg, #0f172a 0%, #1e293b 100%)'
        : 'linear-gradient(135deg, #f0f9ff 0%, #e0f2fe 100%)',
      position: 'relative',
      overflow: 'hidden'
    }}>
      <div style={{
        position: 'absolute',
        width: '400px',
        height: '400px',
        borderRadius: '50%',
        background: isDark ? 'rgba(59, 130, 246, 0.1)' : 'rgba(37, 99, 235, 0.15)',
        top: '-100px',
        left: '-100px',
        filter: 'blur(60px)'
      }}></div>
      <div style={{
        position: 'absolute',
        width: '300px',
        height: '300px',
        borderRadius: '50%',
        background: isDark ? 'rgba(168, 85, 247, 0.1)' : 'rgba(168, 85, 247, 0.15)',
        bottom: '-50px',
        right: '-50px',
        filter: 'blur(60px)'
      }}></div>

      <div style={{
        position: 'relative',
        zIndex: 10,
        width: '100%',
        maxWidth: '420px',
        padding: '2rem'
      }}>
        <div className="glass" style={{
          padding: '2.5rem',
          borderRadius: '1.5rem'
        }}>
          <div style={{ textAlign: 'center', marginBottom: '2rem' }}>
            <div style={{
              width: '60px',
              height: '60px',
              borderRadius: '1rem',
              background: 'linear-gradient(135deg, var(--primary) 0%, var(--secondary) 100%)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              fontSize: '2rem',
              margin: '0 auto 1rem'
            }}>
              ⚙️
            </div>
            <h1 style={{ marginBottom: '0.5rem', fontSize: '1.75rem' }}>Create Account</h1>
            <p style={{ color: 'var(--text-secondary)', marginBottom: 0 }}>
              Join our work order system
            </p>
          </div>

          <form onSubmit={handleSubmit} style={{ marginBottom: '1.5rem' }}>
            {error && (
              <div className="alert alert-danger" style={{ marginBottom: '1rem' }}>
                {error}
              </div>
            )}

            <div className="form-group">
              <label htmlFor="name">Full Name</label>
              <input
                id="name"
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="John Doe"
                required
              />
            </div>

            <div className="form-group">
              <label htmlFor="email">Email Address</label>
              <input
                id="email"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="you@example.com"
                required
              />
            </div>

            <div className="form-group">
              <label htmlFor="password">Password</label>
              <input
                id="password"
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••"
                required
              />
            </div>

            <div className="form-group">
              <label htmlFor="role">Role</label>
              <select
                id="role"
                value={role}
                onChange={(e) => setRole(e.target.value as UserRole)}
              >
                <option value="CUSTOMER">Customer</option>
                <option value="TECHNICIAN">Technician</option>
                <option value="DISPATCHER">Dispatcher</option>
                <option value="MANAGER">Manager</option>
              </select>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="btn btn-primary"
              style={{ width: '100%', marginBottom: '1rem' }}
            >
              {loading ? 'Creating Account...' : 'Create Account'}
            </button>
          </form>

          <div style={{
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            paddingTop: '1rem',
            borderTop: '1px solid var(--border-color)'
          }}>
            <p style={{ margin: 0, fontSize: '0.875rem' }}>
              Already have an account?{' '}
              <button
                type="button"
                onClick={() => navigate('/login')}
                style={{
                  background: 'none',
                  border: 'none',
                  color: 'var(--primary)',
                  cursor: 'pointer',
                  fontWeight: '600'
                }}
              >
                Sign in
              </button>
            </p>
            <button
              type="button"
              onClick={toggleTheme}
              className="theme-toggle"
            >
              <div className="toggle-circle">
                {isDark ? '🌙' : '☀️'}
              </div>
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}
