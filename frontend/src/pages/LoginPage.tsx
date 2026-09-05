import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

export default function LoginPage() {
  const [isRegister, setIsRegister] = useState(false);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [role, setRole] = useState<'DISPATCHER' | 'TECHNICIAN' | 'MANAGER' | 'CUSTOMER'>('DISPATCHER');
  
  const { login } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    // Authenticate user & load full session data
    login({
      id: 'USR-' + Math.floor(Math.random() * 1000),
      username: email.split('@')[0] || 'User',
      email,
      role,
    } as any);

    const routes = {
      DISPATCHER: '/dispatcher',
      TECHNICIAN: '/technician',
      MANAGER: '/manager',
      CUSTOMER: '/customer',
    };
    navigate(routes[role]);
  };

  return (
    <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: '100vh', backgroundColor: '#0f172a', color: '#fff', fontFamily: 'sans-serif' }}>
      <form onSubmit={handleSubmit} style={{ backgroundColor: '#1e293b', padding: '32px', borderRadius: '12px', width: '360px', boxShadow: '0 10px 25px rgba(0,0,0,0.5)' }}>
        <h2 style={{ marginBottom: '20px', textAlign: 'center' }}>{isRegister ? 'Create Account' : 'Portal Sign In'}</h2>

        <div style={{ marginBottom: '16px' }}>
          <label style={{ display: 'block', marginBottom: '6px', fontSize: '14px' }}>Email Address</label>
          <input 
            type="email" 
            required 
            value={email} 
            onChange={e => setEmail(e.target.value)} 
            placeholder="user@example.com"
            style={{ width: '100%', padding: '10px', borderRadius: '6px', backgroundColor: '#334155', border: '1px solid #475569', color: '#fff' }}
          />
        </div>

        <div style={{ marginBottom: '16px' }}>
          <label style={{ display: 'block', marginBottom: '6px', fontSize: '14px' }}>Password</label>
          <input 
            type="password" 
            required 
            value={password} 
            onChange={e => setPassword(e.target.value)} 
            placeholder="••••••••"
            style={{ width: '100%', padding: '10px', borderRadius: '6px', backgroundColor: '#334155', border: '1px solid #475569', color: '#fff' }}
          />
        </div>

        <div style={{ marginBottom: '20px' }}>
          <label style={{ display: 'block', marginBottom: '6px', fontSize: '14px' }}>Select Role</label>
          <select 
            value={role} 
            onChange={(e) => setRole(e.target.value as any)}
            style={{ width: '100%', padding: '10px', borderRadius: '6px', backgroundColor: '#334155', color: '#fff', border: '1px solid #475569' }}
          >
            <option value="DISPATCHER">Dispatcher</option>
            <option value="TECHNICIAN">Technician</option>
            <option value="MANAGER">Manager</option>
            <option value="CUSTOMER">Customer</option>
          </select>
        </div>

        <button 
          type="submit" 
          style={{ width: '100%', padding: '12px', backgroundColor: '#2563eb', color: '#fff', border: 'none', borderRadius: '6px', fontWeight: 'bold', cursor: 'pointer', marginBottom: '16px' }}
        >
          {isRegister ? 'Register Account' : 'Sign In'}
        </button>

        <p style={{ textAlign: 'center', fontSize: '14px', color: '#94a3b8' }}>
          {isRegister ? 'Already have an account?' : "Don't have an account?"}{' '}
          <span 
            onClick={() => setIsRegister(!isRegister)} 
            style={{ color: '#38bdf8', cursor: 'pointer', textDecoration: 'underline' }}
          >
            {isRegister ? 'Sign In' : 'Register'}
          </span>
        </p>
      </form>
    </div>
  );
}

