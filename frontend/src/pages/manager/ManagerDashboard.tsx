import React, { useState } from 'react';
import { useAuth } from '../../context/AuthContext';

interface AnalyticsData {
  totalOrders: number;
  completedOrders: number;
  inProgressOrders: number;
  pendingOrders: number;
  revenueGenerated: string;
  avgResolutionTime: string;
}

interface TeamMember {
  id: string;
  name: string;
  role: string;
  performance: string;
  jobsCompleted: number;
}

interface Review {
  id: string;
  customerName: string;
  rating: number;
  comment: string;
  date: string;
}

interface WorkOrder {
  id: string;
  title: string;
  assignedTo: string;
  status: 'Pending' | 'In Progress' | 'Completed';
  priority: 'Low' | 'Medium' | 'High';
}

export const ManagerDashboard: React.FC = () => {
  const { user, logout } = useAuth();
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [activeTab, setActiveTab] = useState<'analytics' | 'orders' | 'reports' | 'team' | 'reviews'>('analytics');

  const [analytics] = useState<AnalyticsData>({
    totalOrders: 124,
    completedOrders: 98,
    inProgressOrders: 18,
    pendingOrders: 8,
    revenueGenerated: '$42,850',
    avgResolutionTime: '2.4 Hours',
  });

  const [teamMembers, setTeamMembers] = useState<TeamMember[]>([
    { id: 'T-1', name: 'Dave Tech', role: 'Technician', performance: '98%', jobsCompleted: 45 },
    { id: 'T-2', name: 'Sarah Jenkins', role: 'Technician', performance: '94%', jobsCompleted: 38 },
    { id: 'T-3', name: 'John Dispatcher', role: 'Dispatcher', performance: '99%', jobsCompleted: 112 },
  ]);

  const [workOrders, setWorkOrders] = useState<WorkOrder[]>([
    { id: 'WO-667', title: 'System Crash Recovery', assignedTo: 'Dave Tech', status: 'Pending', priority: 'Medium' },
    { id: 'WO-101', title: 'HVAC Unit Inspection', assignedTo: 'Sarah Jenkins', status: 'In Progress', priority: 'High' },
    { id: 'WO-103', title: 'Generator Maintenance', assignedTo: 'Unassigned', status: 'Pending', priority: 'Medium' },
  ]);

  const [reviews] = useState<Review[]>([
    { id: 'R-1', customerName: 'Acme Corp', rating: 5, comment: 'Quick response and fixed our HVAC promptly!', date: '2026-09-02' },
    { id: 'R-2', customerName: 'BioTech Labs', rating: 4, comment: 'Technician was polite and overall work was high quality.', date: '2026-08-28' },
  ]);

  // Form States
  const [newMemberName, setNewMemberName] = useState('');
  const [newMemberRole, setNewMemberRole] = useState('Technician');
  
  const [newOrderTitle, setNewOrderTitle] = useState('');
  const [newOrderAssignee, setNewOrderAssignee] = useState('');
  const [newOrderPriority, setNewOrderPriority] = useState<'Low' | 'Medium' | 'High'>('Medium');

  // Add Employee
  const handleAddMember = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newMemberName.trim()) return;
    const member: TeamMember = {
      id: `T-${teamMembers.length + 1}`,
      name: newMemberName,
      role: newMemberRole,
      performance: '100%',
      jobsCompleted: 0,
    };
    setTeamMembers([...teamMembers, member]);
    setNewMemberName('');
  };

  // Create & Assign Order
  const handleCreateOrder = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newOrderTitle.trim()) return;
    const order: WorkOrder = {
      id: `WO-${Math.floor(100 + Math.random() * 900)}`,
      title: newOrderTitle,
      assignedTo: newOrderAssignee || 'Unassigned',
      status: 'Pending',
      priority: newOrderPriority,
    };
    setWorkOrders([order, ...workOrders]);
    setNewOrderTitle('');
    setNewOrderAssignee('');
  };

  // Re-assign Order
  const handleAssignChange = (orderId: string, newAssignee: string) => {
    setWorkOrders(workOrders.map(o => o.id === orderId ? { ...o, assignedTo: newAssignee } : o));
  };

  // Export Functions
  const exportCSV = () => {
    const csvContent = "data:text/csv;charset=utf-8," 
      + ["ID,Title,Assigned To,Status,Priority", ...workOrders.map(e => `${e.id},"${e.title}",${e.assignedTo},${e.status},${e.priority}`)].join("\n");
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement("a");
    link.setAttribute("href", encodedUri);
    link.setAttribute("download", "work_orders_report.csv");
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const exportPDF = () => {
    window.print();
  };

  return (
    <div style={{ display: 'flex', minHeight: '100vh', background: 'linear-gradient(135deg, #0f172a 0%, #1e1b4b 100%)', color: '#f8fafc', fontFamily: 'sans-serif' }}>
      
      {/* SIDEBAR */}
      <aside style={{ width: sidebarOpen ? '240px' : '65px', transition: 'all 0.3s ease', background: 'rgba(255, 255, 255, 0.05)', backdropFilter: 'blur(12px)', borderRight: '1px solid rgba(255, 255, 255, 0.1)', display: 'flex', flexDirection: 'column', justifyContent: 'space-between', padding: '16px', boxSizing: 'border-box', zIndex: 10 }}>
        <div>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '28px' }}>
            {sidebarOpen && <h3 style={{ margin: 0, fontSize: '18px', color: '#38bdf8' }}>KEYSTONE</h3>}
            <button onClick={() => setSidebarOpen(!sidebarOpen)} style={{ background: 'rgba(255,255,255,0.1)', border: 'none', color: '#fff', padding: '8px', borderRadius: '6px', cursor: 'pointer' }}>
              {sidebarOpen ? '◀' : '▶'}
            </button>
          </div>
          <nav style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
            <button onClick={() => setActiveTab('analytics')} style={{ display: 'flex', alignItems: 'center', gap: '12px', padding: '10px', borderRadius: '8px', border: 'none', background: activeTab === 'analytics' ? 'rgba(56, 189, 248, 0.2)' : 'transparent', color: activeTab === 'analytics' ? '#38bdf8' : '#94a3b8', cursor: 'pointer', textAlign: 'left', width: '100%' }}>
              📈 {sidebarOpen && <span>Analytics</span>}
            </button>
            <button onClick={() => setActiveTab('orders')} style={{ display: 'flex', alignItems: 'center', gap: '12px', padding: '10px', borderRadius: '8px', border: 'none', background: activeTab === 'orders' ? 'rgba(56, 189, 248, 0.2)' : 'transparent', color: activeTab === 'orders' ? '#38bdf8' : '#94a3b8', cursor: 'pointer', textAlign: 'left', width: '100%' }}>
              🛠️ {sidebarOpen && <span>Assign Work</span>}
            </button>
            <button onClick={() => setActiveTab('team')} style={{ display: 'flex', alignItems: 'center', gap: '12px', padding: '10px', borderRadius: '8px', border: 'none', background: activeTab === 'team' ? 'rgba(56, 189, 248, 0.2)' : 'transparent', color: activeTab === 'team' ? '#38bdf8' : '#94a3b8', cursor: 'pointer', textAlign: 'left', width: '100%' }}>
              👥 {sidebarOpen && <span>Appoint Staff</span>}
            </button>
            <button onClick={() => setActiveTab('reviews')} style={{ display: 'flex', alignItems: 'center', gap: '12px', padding: '10px', borderRadius: '8px', border: 'none', background: activeTab === 'reviews' ? 'rgba(56, 189, 248, 0.2)' : 'transparent', color: activeTab === 'reviews' ? '#38bdf8' : '#94a3b8', cursor: 'pointer', textAlign: 'left', width: '100%' }}>
              ⭐ {sidebarOpen && <span>Reviews</span>}
            </button>
            <button onClick={() => setActiveTab('reports')} style={{ display: 'flex', alignItems: 'center', gap: '12px', padding: '10px', borderRadius: '8px', border: 'none', background: activeTab === 'reports' ? 'rgba(56, 189, 248, 0.2)' : 'transparent', color: activeTab === 'reports' ? '#38bdf8' : '#94a3b8', cursor: 'pointer', textAlign: 'left', width: '100%' }}>
              📄 {sidebarOpen && <span>Export Reports</span>}
            </button>
          </nav>
        </div>
        <div style={{ borderTop: '1px solid rgba(255,255,255,0.1)', paddingTop: '12px' }}>
          {sidebarOpen && <div style={{ fontSize: '11px', color: '#94a3b8', marginBottom: '8px', overflow: 'hidden', textOverflow: 'ellipsis' }}>{user?.email || 'manager@test.com'}</div>}
          <button onClick={logout} style={{ width: '100%', padding: '8px', borderRadius: '6px', border: 'none', background: '#ef4444', color: '#fff', fontWeight: 'bold', cursor: 'pointer' }}>
            {sidebarOpen ? 'Logout' : '🚪'}
          </button>
        </div>
      </aside>

      {/* MAIN CONTENT */}
      <main style={{ flex: 1, padding: '16px', overflowY: 'auto' }}>
        <header style={{ marginBottom: '20px' }}>
          <h2 style={{ margin: '0 0 4px 0', color: '#38bdf8', fontSize: '20px' }}>Manager Dashboard</h2>
          <span style={{ fontSize: '12px', color: '#94a3b8' }}>Operations, Staffing & Work Order Control</span>
        </header>

        {/* ANALYTICS */}
        {activeTab === 'analytics' && (
          <div>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(140px, 1fr))', gap: '12px', marginBottom: '20px' }}>
              <div style={{ background: 'rgba(255, 255, 255, 0.05)', border: '1px solid rgba(255, 255, 255, 0.1)', padding: '14px', borderRadius: '10px' }}>
                <div style={{ fontSize: '11px', color: '#94a3b8' }}>Revenue</div>
                <div style={{ fontSize: '20px', fontWeight: 'bold', color: '#4ade80', marginTop: '2px' }}>{analytics.revenueGenerated}</div>
              </div>
              <div style={{ background: 'rgba(255, 255, 255, 0.05)', border: '1px solid rgba(255, 255, 255, 0.1)', padding: '14px', borderRadius: '10px' }}>
                <div style={{ fontSize: '11px', color: '#94a3b8' }}>Total Orders</div>
                <div style={{ fontSize: '20px', fontWeight: 'bold', color: '#38bdf8', marginTop: '2px' }}>{analytics.totalOrders}</div>
              </div>
              <div style={{ background: 'rgba(255, 255, 255, 0.05)', border: '1px solid rgba(255, 255, 255, 0.1)', padding: '14px', borderRadius: '10px' }}>
                <div style={{ fontSize: '11px', color: '#94a3b8' }}>Completed</div>
                <div style={{ fontSize: '20px', fontWeight: 'bold', color: '#a7f3d0', marginTop: '2px' }}>{analytics.completedOrders}</div>
              </div>
              <div style={{ background: 'rgba(255, 255, 255, 0.05)', border: '1px solid rgba(255, 255, 255, 0.1)', padding: '14px', borderRadius: '10px' }}>
                <div style={{ fontSize: '11px', color: '#94a3b8' }}>Avg Time</div>
                <div style={{ fontSize: '20px', fontWeight: 'bold', color: '#f59e0b', marginTop: '2px' }}>{analytics.avgResolutionTime}</div>
              </div>
            </div>

            <div style={{ background: 'rgba(255, 255, 255, 0.05)', border: '1px solid rgba(255, 255, 255, 0.1)', borderRadius: '12px', padding: '16px' }}>
              <h3 style={{ margin: '0 0 12px 0', fontSize: '15px' }}>Job Status Distribution</h3>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                <div>
                  <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '12px', marginBottom: '4px' }}>
                    <span>Completed ({analytics.completedOrders})</span>
                    <span>79%</span>
                  </div>
                  <div style={{ background: 'rgba(255,255,255,0.1)', height: '8px', borderRadius: '4px', overflow: 'hidden' }}>
                    <div style={{ background: '#4ade80', width: '79%', height: '100%' }}></div>
                  </div>
                </div>
                <div>
                  <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '12px', marginBottom: '4px' }}>
                    <span>In Progress ({analytics.inProgressOrders})</span>
                    <span>15%</span>
                  </div>
                  <div style={{ background: 'rgba(255,255,255,0.1)', height: '8px', borderRadius: '4px', overflow: 'hidden' }}>
                    <div style={{ background: '#f59e0b', width: '15%', height: '100%' }}></div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* ASSIGN WORK */}
        {activeTab === 'orders' && (
          <div>
            <div style={{ background: 'rgba(255, 255, 255, 0.05)', border: '1px solid rgba(255, 255, 255, 0.1)', borderRadius: '12px', padding: '16px', marginBottom: '20px' }}>
              <h3 style={{ margin: '0 0 12px 0', fontSize: '15px' }}>Create & Assign Work Order</h3>
              <form onSubmit={handleCreateOrder} style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
                <input 
                  type="text" 
                  placeholder="Order Title (e.g. Server Maintenance)" 
                  value={newOrderTitle} 
                  onChange={(e) => setNewOrderTitle(e.target.value)}
                  style={{ padding: '8px', borderRadius: '6px', border: '1px solid rgba(255,255,255,0.2)', background: 'rgba(0,0,0,0.3)', color: '#fff' }}
                />
                <div style={{ display: 'flex', gap: '10px' }}>
                  <select 
                    value={newOrderAssignee} 
                    onChange={(e) => setNewOrderAssignee(e.target.value)}
                    style={{ flex: 1, padding: '8px', borderRadius: '6px', border: '1px solid rgba(255,255,255,0.2)', background: '#1e293b', color: '#fff' }}
                  >
                    <option value="">-- Assign Technician --</option>
                    {teamMembers.map(m => (
                      <option key={m.id} value={m.name}>{m.name} ({m.role})</option>
                    ))}
                  </select>
                  <select 
                    value={newOrderPriority} 
                    onChange={(e) => setNewOrderPriority(e.target.value as any)}
                    style={{ padding: '8px', borderRadius: '6px', border: '1px solid rgba(255,255,255,0.2)', background: '#1e293b', color: '#fff' }}
                  >
                    <option value="Low">Low</option>
                    <option value="Medium">Medium</option>
                    <option value="High">High</option>
                  </select>
                </div>
                <button type="submit" style={{ padding: '8px', background: '#38bdf8', color: '#0f172a', fontWeight: 'bold', border: 'none', borderRadius: '6px', cursor: 'pointer' }}>
                  Create & Assign Order
                </button>
              </form>
            </div>

            <div style={{ background: 'rgba(255, 255, 255, 0.05)', borderRadius: '12px', border: '1px solid rgba(255, 255, 255, 0.1)', padding: '16px' }}>
              <h3 style={{ margin: '0 0 12px 0', fontSize: '15px' }}>Active Work Orders</h3>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
                {workOrders.map((order) => (
                  <div key={order.id} style={{ background: 'rgba(0,0,0,0.2)', padding: '12px', borderRadius: '8px', display: 'flex', flexDirection: 'column', gap: '6px' }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                      <span style={{ fontSize: '12px', fontWeight: 'bold', color: '#38bdf8' }}>{order.id}</span>
                      <span style={{ fontSize: '11px', color: order.priority === 'High' ? '#ef4444' : '#f59e0b' }}>{order.priority} Priority</span>
                    </div>
                    <div style={{ fontWeight: 'bold', fontSize: '14px' }}>{order.title}</div>
                    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginTop: '4px' }}>
                      <span style={{ fontSize: '12px', color: '#94a3b8' }}>Assignee:</span>
                      <select 
                        value={order.assignedTo} 
                        onChange={(e) => handleAssignChange(order.id, e.target.value)}
                        style={{ padding: '4px 8px', borderRadius: '4px', border: '1px solid rgba(255,255,255,0.2)', background: '#0f172a', color: '#38bdf8', fontSize: '12px' }}
                      >
                        <option value="Unassigned">Unassigned</option>
                        {teamMembers.map(m => (
                          <option key={m.id} value={m.name}>{m.name}</option>
                        ))}
                      </select>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* APPOINT STAFF */}
        {activeTab === 'team' && (
          <div>
            <div style={{ background: 'rgba(255, 255, 255, 0.05)', border: '1px solid rgba(255, 255, 255, 0.1)', borderRadius: '12px', padding: '16px', marginBottom: '20px' }}>
              <h3 style={{ margin: '0 0 12px 0', fontSize: '15px' }}>Appoint New Employee</h3>
              <form onSubmit={handleAddMember} style={{ display: 'flex', gap: '8px' }}>
                <input 
                  type="text" 
                  placeholder="Full Name" 
                  value={newMemberName} 
                  onChange={(e) => setNewMemberName(e.target.value)}
                  style={{ flex: 1, padding: '8px', borderRadius: '6px', border: '1px solid rgba(255,255,255,0.2)', background: 'rgba(0,0,0,0.3)', color: '#fff' }}
                />
                <select 
                  value={newMemberRole} 
                  onChange={(e) => setNewMemberRole(e.target.value)}
                  style={{ padding: '8px', borderRadius: '6px', border: '1px solid rgba(255,255,255,0.2)', background: '#1e293b', color: '#fff' }}
                >
                  <option value="Technician">Technician</option>
                  <option value="Dispatcher">Dispatcher</option>
                </select>
                <button type="submit" style={{ padding: '8px 12px', background: '#4ade80', color: '#0f172a', fontWeight: 'bold', border: 'none', borderRadius: '6px', cursor: 'pointer' }}>
                  Appoint
                </button>
              </form>
            </div>

            <div style={{ background: 'rgba(255, 255, 255, 0.05)', borderRadius: '12px', border: '1px solid rgba(255, 255, 255, 0.1)', overflowX: 'auto' }}>
              <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left', fontSize: '13px' }}>
                <thead>
                  <tr style={{ borderBottom: '1px solid rgba(255, 255, 255, 0.1)', background: 'rgba(0,0,0,0.2)' }}>
                    <th style={{ padding: '10px' }}>Name</th>
                    <th style={{ padding: '10px' }}>Role</th>
                    <th style={{ padding: '10px' }}>Rating</th>
                    <th style={{ padding: '10px' }}>Jobs</th>
                  </tr>
                </thead>
                <tbody>
                  {teamMembers.map((m) => (
                    <tr key={m.id} style={{ borderBottom: '1px solid rgba(255, 255, 255, 0.05)' }}>
                      <td style={{ padding: '10px' }}>{m.name}</td>
                      <td style={{ padding: '10px', color: '#94a3b8' }}>{m.role}</td>
                      <td style={{ padding: '10px', color: '#4ade80' }}>{m.performance}</td>
                      <td style={{ padding: '10px' }}>{m.jobsCompleted}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* CUSTOMER REVIEWS */}
        {activeTab === 'reviews' && (
          <div style={{ background: 'rgba(255, 255, 255, 0.05)', border: '1px solid rgba(255, 255, 255, 0.1)', borderRadius: '12px', padding: '16px' }}>
            <h3 style={{ margin: '0 0 12px 0', fontSize: '15px' }}>Customer Feedback & Reviews</h3>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
              {reviews.map((rev) => (
                <div key={rev.id} style={{ background: 'rgba(0,0,0,0.2)', padding: '12px', borderRadius: '8px' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '4px' }}>
                    <span style={{ fontWeight: 'bold', fontSize: '13px' }}>{rev.customerName}</span>
                    <span style={{ color: '#f59e0b', fontSize: '12px' }}>{'⭐'.repeat(rev.rating)}</span>
                  </div>
                  <p style={{ margin: '4px 0', fontSize: '12px', color: '#cbd5e1' }}>"{rev.comment}"</p>
                  <span style={{ fontSize: '10px', color: '#94a3b8' }}>{rev.date}</span>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* REPORTS & EXPORT */}
        {activeTab === 'reports' && (
          <div style={{ background: 'rgba(255, 255, 255, 0.05)', border: '1px solid rgba(255, 255, 255, 0.1)', borderRadius: '12px', padding: '16px' }}>
            <h3 style={{ margin: '0 0 12px 0', fontSize: '15px' }}>Operational Reports</h3>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
              <div style={{ background: 'rgba(0,0,0,0.2)', padding: '12px', borderRadius: '8px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <div>
                  <div style={{ fontWeight: 'bold', fontSize: '13px' }}>Monthly Work Order Summary</div>
                  <div style={{ fontSize: '11px', color: '#94a3b8' }}>Generated Sept 2026</div>
                </div>
                <button onClick={exportPDF} style={{ padding: '6px 10px', background: '#38bdf8', border: 'none', borderRadius: '6px', fontSize: '12px', cursor: 'pointer', fontWeight: 'bold', color: '#0f172a' }}>
                  Export PDF
                </button>
              </div>

              <div style={{ background: 'rgba(0,0,0,0.2)', padding: '12px', borderRadius: '8px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <div>
                  <div style={{ fontWeight: 'bold', fontSize: '13px' }}>Work Orders Data</div>
                  <div style={{ fontSize: '11px', color: '#94a3b8' }}>Generated Sept 2026</div>
                </div>
                <button onClick={exportCSV} style={{ padding: '6px 10px', background: '#38bdf8', border: 'none', borderRadius: '6px', fontSize: '12px', cursor: 'pointer', fontWeight: 'bold', color: '#0f172a' }}>
                  Export CSV
                </button>
              </div>
            </div>
          </div>
        )}
      </main>
    </div>
  );
};

export default ManagerDashboard;
