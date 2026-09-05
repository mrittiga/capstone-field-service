// src/components/Layout.tsx
import React from 'react';
import { useLocation, useNavigate, Outlet } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

interface SidebarItem {
  label: string;
  path: string;
}

interface LayoutProps {
  sidebarItems?: SidebarItem[];
}

export default function Layout({ sidebarItems = [] }: LayoutProps) {
  const location = useLocation();
  const navigate = useNavigate();
  const { user, logout } = useAuth();

  const currentPath = location.pathname || '';

  return (
    <div style={{ display: 'flex', minHeight: '100vh', backgroundColor: '#0f172a' }}>
      {/* Navigation Sidebar */}
      <aside style={{ width: '240px', backgroundColor: '#1e293b', padding: '16px', color: '#fff', display: 'flex', flexDirection: 'column' }}>
        <h2 style={{ marginBottom: '20px', color: '#38bdf8' }}>Portal</h2>
        
        <nav style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
          {Array.isArray(sidebarItems) && sidebarItems.map((item) => {
            const isActive = currentPath === item.path;
            return (
              <button
                key={item.path}
                onClick={() => navigate(item.path)}
                style={{
                  padding: '10px',
                  borderRadius: '6px',
                  border: 'none',
                  backgroundColor: isActive ? '#2563eb' : 'transparent',
                  color: '#fff',
                  textAlign: 'left',
                  cursor: 'pointer',
                }}
              >
                {item.label}
              </button>
            );
          })}
        </nav>

        <div style={{ marginTop: 'auto', paddingTop: '16px' }}>
          <p style={{ fontSize: '14px', marginBottom: '8px', wordBreak: 'break-all' }}>
            {user?.email || 'User'}
          </p>
          <button
            onClick={logout}
            style={{
              width: '100%',
              padding: '8px',
              backgroundColor: '#dc2626',
              color: '#fff',
              border: 'none',
              borderRadius: '4px',
              cursor: 'pointer',
            }}
          >
            Logout
          </button>
        </div>
      </aside>

      {/* Main Dashboard Content Area */}
      <main style={{ flex: 1, padding: '24px', color: '#fff', backgroundColor: '#0f172a' }}>
        <Outlet />
      </main>
    </div>
  );
}

