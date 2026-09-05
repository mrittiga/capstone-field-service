import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

export const LoginPage: React.FC = () => {
  const navigate = useNavigate();
  const { login } = useAuth();

  const [email, setEmail] = useState<string>('');
  const [password, setPassword] = useState<string>('');
  const [error, setError] = useState<string>('');
  const [loading, setLoading] = useState<boolean>(false);

  const handlePrefill = (prefillEmail: string) => {
    setEmail(prefillEmail);
    setPassword('password123');
    setError('');
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    let role = 'customer';
    let targetPath = '/customer';

    const lowerEmail = email.toLowerCase();
    if (lowerEmail.includes('dispatcher')) {
      role = 'dispatcher';
      targetPath = '/dispatcher';
    } else if (lowerEmail.includes('manager')) {
      role = 'manager';
      targetPath = '/manager';
    } else if (lowerEmail.includes('tech')) {
      role = 'technician';
      targetPath = '/technician';
    }

    const userData = {
      id: 'user-' + Date.now(),
      email: email,
      role: role,
      name: role.toUpperCase(),
      token: 'demo-fake-jwt-token',
    };

    login(userData);
    setLoading(false);
    navigate(targetPath, { replace: true });
  };

  return (
    <div style={{ maxWidth: '400px', margin: '40px auto', padding: '20px', fontFamily: 'sans-serif' }}>
      <h2>KEYSTONE</h2>
      <p>Field Service Management Platform</p>

      {error && <div style={{ color: 'red', marginBottom: '10px' }}>{error}</div>}

      <form onSubmit={handleSubmit}>
        <div style={{ marginBottom: '12px' }}>
          <label style={{ display: 'block', marginBottom: '4px' }}>Email Address</label>
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
            style={{ width: '100%', padding: '8px', boxSizing: 'border-box' }}
          />
        </div>

        <div style={{ marginBottom: '16px' }}>
          <label style={{ display: 'block', marginBottom: '4px' }}>Password</label>
          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
            style={{ width: '100%', padding: '8px', boxSizing: 'border-box' }}
          />
        </div>

        <button type="submit" disabled={loading} style={{ width: '100%', padding: '10px', cursor: 'pointer' }}>
          {loading ? 'Signing in...' : '🚀 Sign In'}
        </button>
      </form>

      <div style={{ marginTop: '24px' }}>
        <p style={{ fontSize: '14px' }}>Quick demo — click to prefill:</p>
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '8px' }}>
          <button type="button" onClick={() => handlePrefill('dispatcher@test.com')}>📡 Dispatcher</button>
          <button type="button" onClick={() => handlePrefill('manager@test.com')}>📊 Manager</button>
          <button type="button" onClick={() => handlePrefill('tech@test.com')}>🔧 Technician</button>
          <button type="button" onClick={() => handlePrefill('customer@test.com')}>🏢 Customer</button>
        </div>
      </div>

      <div style={{ marginTop: '20px', fontSize: '14px' }}>
        Don't have an account? <Link to="/register">Sign up</Link>
      </div>
    </div>
  );
};

export default LoginPage;
