import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext';

interface WorkOrder {
  id: string;
  title: string;
  customer: string;
  priority: 'High' | 'Medium' | 'Low';
  status: 'Pending' | 'In Progress' | 'Completed';
  technician: string;
}

interface UserRecord {
  id: string;
  name: string;
  email: string;
  role: string;
}

export const DispatcherDashboard: React.FC = () => {
  const { user, logout } = useAuth();
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [activeTab, setActiveTab] = useState<'dashboard' | 'workorders' | 'users'>('dashboard');

  // Work Orders State
  const [workOrders, setWorkOrders] = useState<WorkOrder[]>([
    { id: 'WO-101', title: 'HVAC Inspection', customer: 'Acme Corp', priority: 'High', status: 'In Progress', technician: 'Tech Dave' },
    { id: 'WO-102', title: 'Electrical Wiring Repair', customer: 'Nexus Ltd', priority: 'Medium', status: 'Pending', technician: 'Unassigned' },
  ]);

  // Users State
  const [users, setUsers] = useState<UserRecord[]>([
    { id: 'U-1', name: 'John Dispatcher', email: 'dispatcher@test.com', role: 'Dispatcher' },
    { id: 'U-2', name: 'Dave Tech', email: 'tech@test.com', role: 'Technician' },
  ]);

  // Modals & Form State
  const [showWOModal, setShowWOModal] = useState(false);
  const [newWO, setNewWO] = useState({ title: '', customer: '', priority: 'Medium', technician: 'Unassigned' });

  const [showUserModal, setShowUserModal] = useState(false);
  const [newUser, setNewUser] = useState({ name: '', email: '', role: 'Technician' });

  const handleAddWorkOrder = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newWO.title || !newWO.customer) return;
    const created: WorkOrder = {
      id: `WO-${Date.now().toString().slice(-3)}`,
      title: newWO.title,
      customer: newWO.customer,
      priority: newWO.priority as any,
      status: 'Pending',
      technician: newWO.technician,
    };
    setWorkOrders([created, ...workOrders]);
    setNewWO({ title: '', customer: '', priority: 'Medium', technician: 'Unassigned' });
    setShowWOModal(false);
  };

  const handleAddUser = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newUser.name || !newUser.email) return;
    const created: UserRecord = {
      id: `U-${users.length + 1}`,
      name: newUser.name,
      email: newUser.email,
      role: newUser.role,
    };
    setUsers([...users, created]);
    setNewUser({ name: '', email: '', role: 'Technician' });
    setShowUserModal(false);
  };

  return (
    <div style={{ display: 'flex', minHeight: '100vh', background: 'linear-gradient(135deg, #0f172a 0%, #1e1b4b 100%)', color: '#f8fafc', fontFamily: 'sans-serif' }}>
      
      {/* GLASSMORPHISM SIDEBAR */}
      <aside
        style={{
          width: sidebarOpen ? '260px' : '70px',
          transition: 'all 0.3s ease',
          background: 'rgba(255, 255, 255, 0.05)',
          backdropFilter: 'blur(12px)',
          borderRight: '1px solid rgba(255, 255, 255, 0.1)',
          display: 'flex',
          flexDirection: 'column',
          justify: 'space-between',
          padding: '16px',
          boxSizing: 'border-box',
          overflow: 'hidden',
          whiteSpace: 'nowrap',
        }}
      >
        <div>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '32px' }}>
            {sidebarOpen && <h2 style={{ margin: 0, fontSize: '20px', letterSpacing: '1px', color: '#38bdf8' }}>KEYSTONE</h2>}
            <button
              onClick={() => setSidebarOpen(!sidebarOpen)}
              style={{ background: 'rgba(255,255,255,0.1)', border: 'none', color: '#fff', padding: '8px', borderRadius: '6px', cursor: 'pointer' }}
            >
              {sidebarOpen ? '◀' : '▶'}
            </button>
          </div>

          <nav style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
            <button
              onClick={() => setActiveTab('dashboard')}
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '12px',
                padding: '12px',
                borderRadius: '8px',
                border: 'none',
                background: activeTab === 'dashboard' ? 'rgba(56, 189, 248, 0.2)' : 'transparent',
                color: activeTab === 'dashboard' ? '#38bdf8' : '#94a3b8',
                cursor: 'pointer',
                textAlign: 'left',
                width: '100%',
              }}
            >
              📊 {sidebarOpen && <span>Dashboard</span>}
            </button>

            <button
              onClick={() => setActiveTab('workorders')}
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '12px',
                padding: '12px',
                borderRadius: '8px',
                border: 'none',
                background: activeTab === 'workorders' ? 'rgba(56, 189, 248, 0.2)' : 'transparent',
                color: activeTab === 'workorders' ? '#38bdf8' : '#94a3b8',
                cursor: 'pointer',
                textAlign: 'left',
                width: '100%',
              }}
            >
              📋 {sidebarOpen && <span>Work Orders</span>}
            </button>

            <button
              onClick={() => setActiveTab('users')}
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '12px',
                padding: '12px',
                borderRadius: '8px',
                border: 'none',
                background: activeTab === 'users' ? 'rgba(56, 189, 248, 0.2)' : 'transparent',
                color: activeTab === 'users' ? '#38bdf8' : '#94a3b8',
                cursor: 'pointer',
                textAlign: 'left',
                width: '100%',
              }}
            >
              👥 {sidebarOpen && <span>Manage Users</span>}
            </button>
          </nav>
        </div>

        <div style={{ borderTop: '1px solid rgba(255,255,255,0.1)', pt: '16px' }}>
          {sidebarOpen && (
            <div style={{ fontSize: '12px', color: '#94a3b8', marginBottom: '8px', overflow: 'hidden', textOverflow: 'ellipsis' }}>
              {user?.email || 'dispatcher@test.com'}
            </div>
          )}
          <button
            onClick={logout}
            style={{
              width: '100%',
              padding: '10px',
              borderRadius: '8px',
              border: 'none',
              background: '#ef4444',
              color: '#fff',
              fontWeight: 'bold',
              cursor: 'pointer',
            }}
          >
            {sidebarOpen ? 'Logout' : '🚪'}
          </button>
        </div>
      </aside>

      {/* MAIN CONTENT AREA */}
      <main style={{ flex: 1, padding: '24px', overflowY: 'auto' }}>
        
        {/* TAB 1: DASHBOARD */}
        {activeTab === 'dashboard' && (
          <div>
            <h1 style={{ margin: '0 0 20px 0' }}>Dispatcher Dashboard</h1>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '16px', marginBottom: '24px' }}>
              <div style={{ background: 'rgba(255, 255, 255, 0.05)', backdropFilter: 'blur(10px)', border: '1px solid rgba(255, 255, 255, 0.1)', padding: '20px', borderRadius: '12px' }}>
                <div style={{ color: '#94a3b8', fontSize: '14px' }}>Total Work Orders</div>
                <div style={{ fontSize: '28px', fontWeight: 'bold', color: '#38bdf8', marginTop: '4px' }}>{workOrders.length}</div>
              </div>
              <div style={{ background: 'rgba(255, 255, 255, 0.05)', backdropFilter: 'blur(10px)', border: '1px solid rgba(255, 255, 255, 0.1)', padding: '20px', borderRadius: '12px' }}>
                <div style={{ color: '#94a3b8', fontSize: '14px' }}>Active Technicians</div>
                <div style={{ fontSize: '28px', fontWeight: 'bold', color: '#4ade80', marginTop: '4px' }}>{users.filter(u => u.role === 'Technician').length}</div>
              </div>
            </div>
          </div>
        )}

        {/* TAB 2: WORK ORDERS */}
        {activeTab === 'workorders' && (
          <div>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
              <h1 style={{ margin: 0 }}>Work Orders</h1>
              <button
                onClick={() => setShowWOModal(true)}
                style={{ padding: '10px 16px', background: '#38bdf8', border: 'none', borderRadius: '8px', color: '#000', fontWeight: 'bold', cursor: 'pointer' }}
              >
                + Add Work Order
              </button>
            </div>

            <div style={{ background: 'rgba(255, 255, 255, 0.05)', backdropFilter: 'blur(10px)', borderRadius: '12px', border: '1px solid rgba(255, 255, 255, 0.1)', overflow: 'hidden' }}>
              <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left' }}>
                <thead>
                  <tr style={{ borderBottom: '1px solid rgba(255, 255, 255, 0.1)', background: 'rgba(0,0,0,0.2)' }}>
                    <th style={{ padding: '12px' }}>ID</th>
                    <th style={{ padding: '12px' }}>Title</th>
                    <th style={{ padding: '12px' }}>Customer</th>
                    <th style={{ padding: '12px' }}>Priority</th>
                    <th style={{ padding: '12px' }}>Technician</th>
                  </tr>
                </thead>
                <tbody>
                  {workOrders.map((wo) => (
                    <tr key={wo.id} style={{ borderBottom: '1px solid rgba(255, 255, 255, 0.05)' }}>
                      <td style={{ padding: '12px' }}>{wo.id}</td>
                      <td style={{ padding: '12px' }}>{wo.title}</td>
                      <td style={{ padding: '12px' }}>{wo.customer}</td>
                      <td style={{ padding: '12px', color: wo.priority === 'High' ? '#ef4444' : '#f59e0b' }}>{wo.priority}</td>
                      <td style={{ padding: '12px' }}>{wo.technician}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* TAB 3: USERS */}
        {activeTab === 'users' && (
          <div>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
              <h1 style={{ margin: 0 }}>User Management</h1>
              <button
                onClick={() => setShowUserModal(true)}
                style={{ padding: '10px 16px', background: '#4ade80', border: 'none', borderRadius: '8px', color: '#000', fontWeight: 'bold', cursor: 'pointer' }}
              >
                + Add User
              </button>
            </div>

            <div style={{ background: 'rgba(255, 255, 255, 0.05)', backdropFilter: 'blur(10px)', borderRadius: '12px', border: '1px solid rgba(255, 255, 255, 0.1)', overflow: 'hidden' }}>
              <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left' }}>
                <thead>
                  <tr style={{ borderBottom: '1px solid rgba(255, 255, 255, 0.1)', background: 'rgba(0,0,0,0.2)' }}>
                    <th style={{ padding: '12px' }}>ID</th>
                    <th style={{ padding: '12px' }}>Name</th>
                    <th style={{ padding: '12px' }}>Email</th>
                    <th style={{ padding: '12px' }}>Role</th>
                  </tr>
                </thead>
                <tbody>
                  {users.map((u) => (
                    <tr key={u.id} style={{ borderBottom: '1px solid rgba(255, 255, 255, 0.05)' }}>
                      <td style={{ padding: '12px' }}>{u.id}</td>
                      <td style={{ padding: '12px' }}>{u.name}</td>
                      <td style={{ padding: '12px' }}>{u.email}</td>
                      <td style={{ padding: '12px' }}>{u.role}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}
      </main>

      {/* CREATE WORK ORDER MODAL */}
      {showWOModal && (
        <div style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.7)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
          <div style={{ background: '#1e293b', padding: '24px', borderRadius: '12px', width: '90%', maxWidth: '400px' }}>
            <h2>New Work Order</h2>
            <form onSubmit={handleAddWorkOrder} style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
              <input type="text" placeholder="Title" value={newWO.title} onChange={(e) => setNewWO({ ...newWO, title: e.target.value })} required style={{ padding: '8px' }} />
              <input type="text" placeholder="Customer" value={newWO.customer} onChange={(e) => setNewWO({ ...newWO, customer: e.target.value })} required style={{ padding: '8px' }} />
              <select value={newWO.priority} onChange={(e) => setNewWO({ ...newWO, priority: e.target.value })} style={{ padding: '8px' }}>
                <option value="Low">Low Priority</option>
                <option value="Medium">Medium Priority</option>
                <option value="High">High Priority</option>
              </select>
              <div style={{ display: 'flex', gap: '8px', marginTop: '12px' }}>
                <button type="submit" style={{ flex: 1, padding: '10px', background: '#38bdf8', border: 'none', borderRadius: '6px', cursor: 'pointer' }}>Save</button>
                <button type="button" onClick={() => setShowWOModal(false)} style={{ flex: 1, padding: '10px', background: '#64748b', border: 'none', borderRadius: '6px', color: '#fff', cursor: 'pointer' }}>Cancel</button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* CREATE USER MODAL */}
      {showUserModal && (
        <div style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.7)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
          <div style={{ background: '#1e293b', padding: '24px', borderRadius: '12px', width: '90%', maxWidth: '400px' }}>
            <h2>New User</h2>
            <form onSubmit={handleAddUser} style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
              <input type="text" placeholder="Full Name" value={newUser.name} onChange={(e) => setNewUser({ ...newUser, name: e.target.value })} required style={{ padding: '8px' }} />
              <input type="email" placeholder="Email" value={newUser.email} onChange={(e) => setNewUser({ ...newUser, email: e.target.value })} required style={{ padding: '8px' }} />
              <select value={newUser.role} onChange={(e) => setNewUser({ ...newUser, role: e.target.value })} style={{ padding: '8px' }}>
                <option value="Technician">Technician</option>
                <option value="Dispatcher">Dispatcher</option>
                <option value="Manager">Manager</option>
              </select>
              <div style={{ display: 'flex', gap: '8px', marginTop: '12px' }}>
                <button type="submit" style={{ flex: 1, padding: '10px', background: '#4ade80', border: 'none', borderRadius: '6px', cursor: 'pointer' }}>Save</button>
                <button type="button" onClick={() => setShowUserModal(false)} style={{ flex: 1, padding: '10px', background: '#64748b', border: 'none', borderRadius: '6px', color: '#fff', cursor: 'pointer' }}>Cancel</button>
              </div>
            </form>
          </div>
        </div>
      )}

    </div>
  );
};

export default DispatcherDashboard;
