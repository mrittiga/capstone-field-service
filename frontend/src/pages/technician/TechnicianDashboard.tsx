import React, { useState } from 'react';
import { useAuth } from '../../context/AuthContext';

interface AssignedTask {
  id: string;
  title: string;
  customer: string;
  address: string;
  priority: 'High' | 'Medium' | 'Low';
  status: 'Pending' | 'In Progress' | 'Completed';
  notes: string;
}

export const TechnicianDashboard: React.FC = () => {
  const { user, logout } = useAuth();
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('All');

  const [tasks, setTasks] = useState<AssignedTask[]>([
    {
      id: 'WO-101',
      title: 'HVAC Unit Inspection',
      customer: 'Acme Corp',
      address: '742 Evergreen Terrace',
      priority: 'High',
      status: 'In Progress',
      notes: 'Checking compressor pressure levels.',
    },
    {
      id: 'WO-103',
      title: 'Generator Maintenance',
      customer: 'BioTech Labs',
      address: '100 Innovation Way',
      priority: 'Medium',
      status: 'Pending',
      notes: 'Scheduled routine oil change and filter replacement.',
    },
  ]);

  const [selectedTask, setSelectedTask] = useState<AssignedTask | null>(null);
  const [noteInput, setNoteInput] = useState('');

  // Modals
  const [showNewTaskModal, setShowNewTaskModal] = useState(false);
  const [newTask, setNewTask] = useState({
    title: '',
    customer: '',
    address: '',
    priority: 'Medium',
  });

  const handleStatusChange = (taskId: string, newStatus: AssignedTask['status']) => {
    setTasks(tasks.map(t => t.id === taskId ? { ...t, status: newStatus } : t));
    if (selectedTask && selectedTask.id === taskId) {
      setSelectedTask({ ...selectedTask, status: newStatus });
    }
  };

  const handleAddNote = (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedTask || !noteInput.trim()) return;
    const updatedNotes = selectedTask.notes ? `${selectedTask.notes}\n• ${noteInput}` : `• ${noteInput}`;
    setTasks(tasks.map(t => t.id === selectedTask.id ? { ...t, notes: updatedNotes } : t));
    setSelectedTask({ ...selectedTask, notes: updatedNotes });
    setNoteInput('');
  };

  const handleCreateTask = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newTask.title || !newTask.customer) return;

    const created: AssignedTask = {
      id: `WO-${Math.floor(100 + Math.random() * 900)}`,
      title: newTask.title,
      customer: newTask.customer,
      address: newTask.address || 'Field Location',
      priority: newTask.priority as any,
      status: 'Pending',
      notes: 'Created by Technician',
    };

    setTasks([created, ...tasks]);
    setNewTask({ title: '', customer: '', address: '', priority: 'Medium' });
    setShowNewTaskModal(false);
  };

  const filteredTasks = tasks.filter(t => {
    const matchesSearch = t.title.toLowerCase().includes(searchTerm.toLowerCase()) || 
                          t.customer.toLowerCase().includes(searchTerm.toLowerCase()) ||
                          t.id.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = statusFilter === 'All' || t.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  return (
    <div style={{ display: 'flex', minHeight: '100vh', background: 'linear-gradient(135deg, #0f172a 0%, #1e1b4b 100%)', color: '#f8fafc', fontFamily: 'sans-serif' }}>
      
      {/* SIDEBAR PANEL */}
      <aside style={{ width: sidebarOpen ? '240px' : '65px', transition: 'all 0.3s ease', background: 'rgba(255, 255, 255, 0.05)', backdropFilter: 'blur(12px)', borderRight: '1px solid rgba(255, 255, 255, 0.1)', display: 'flex', flexDirection: 'column', justifyContent: 'space-between', padding: '16px', boxSizing: 'border-box', zIndex: 10 }}>
        <div>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '28px' }}>
            {sidebarOpen && <h3 style={{ margin: 0, fontSize: '18px', color: '#38bdf8' }}>KEYSTONE</h3>}
            <button onClick={() => setSidebarOpen(!sidebarOpen)} style={{ background: 'rgba(255,255,255,0.1)', border: 'none', color: '#fff', padding: '8px', borderRadius: '6px', cursor: 'pointer' }}>
              {sidebarOpen ? '◀' : '▶'}
            </button>
          </div>
          <nav style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
            <button style={{ display: 'flex', alignItems: 'center', gap: '12px', padding: '10px', borderRadius: '8px', border: 'none', background: 'rgba(56, 189, 248, 0.2)', color: '#38bdf8', cursor: 'pointer', textAlign: 'left', width: '100%' }}>
              🛠️ {sidebarOpen && <span>My Jobs</span>}
            </button>
          </nav>
        </div>
        <div style={{ borderTop: '1px solid rgba(255,255,255,0.1)', paddingTop: '12px' }}>
          {sidebarOpen && <div style={{ fontSize: '11px', color: '#94a3b8', marginBottom: '8px', overflow: 'hidden', textOverflow: 'ellipsis' }}>{user?.email || 'tech@test.com'}</div>}
          <button onClick={logout} style={{ width: '100%', padding: '8px', borderRadius: '6px', border: 'none', background: '#ef4444', color: '#fff', fontWeight: 'bold', cursor: 'pointer' }}>
            {sidebarOpen ? 'Logout' : '🚪'}
          </button>
        </div>
      </aside>

      {/* MAIN CONTENT AREA */}
      <main style={{ flex: 1, padding: '16px', overflowY: 'auto' }}>
        
        {/* TOP BAR WITH ADD ORDER BUTTON */}
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px', gap: '8px', flexWrap: 'wrap' }}>
          <div>
            <h2 style={{ margin: 0, color: '#38bdf8', fontSize: '20px' }}>Field Technician</h2>
            <span style={{ fontSize: '12px', color: '#94a3b8' }}>Manage & Update Work Orders</span>
          </div>
          <button onClick={() => setShowNewTaskModal(true)} style={{ padding: '8px 14px', background: '#38bdf8', border: 'none', borderRadius: '8px', color: '#000', fontWeight: 'bold', cursor: 'pointer', fontSize: '13px' }}>
            + Create Order
          </button>
        </div>

        {/* SEARCH AND FILTER BAR */}
        <div style={{ display: 'flex', gap: '8px', marginBottom: '16px', flexWrap: 'wrap' }}>
          <input
            type="text"
            placeholder="🔍 Search order ID, title, customer..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            style={{ flex: 2, minWidth: '180px', background: '#0f172a', border: '1px solid rgba(255,255,255,0.2)', color: '#fff', padding: '8px 12px', borderRadius: '8px', fontSize: '13px' }}
          />
          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            style={{ flex: 1, minWidth: '120px', background: '#0f172a', color: '#fff', border: '1px solid rgba(255,255,255,0.2)', padding: '8px', borderRadius: '8px', fontSize: '13px' }}
          >
            <option value="All">All Statuses</option>
            <option value="Pending">Pending</option>
            <option value="In Progress">In Progress</option>
            <option value="Completed">Completed</option>
          </select>
        </div>

        {/* METRICS */}
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px', marginBottom: '20px' }}>
          <div style={{ background: 'rgba(255, 255, 255, 0.05)', backdropFilter: 'blur(10px)', border: '1px solid rgba(255, 255, 255, 0.1)', padding: '12px', borderRadius: '10px' }}>
            <div style={{ fontSize: '12px', color: '#94a3b8' }}>Total Jobs</div>
            <div style={{ fontSize: '20px', fontWeight: 'bold', color: '#38bdf8', marginTop: '2px' }}>{tasks.length}</div>
          </div>
          <div style={{ background: 'rgba(255, 255, 255, 0.05)', backdropFilter: 'blur(10px)', border: '1px solid rgba(255, 255, 255, 0.1)', padding: '12px', borderRadius: '10px' }}>
            <div style={{ fontSize: '12px', color: '#94a3b8' }}>In Progress</div>
            <div style={{ fontSize: '20px', fontWeight: 'bold', color: '#f59e0b', marginTop: '2px' }}>{tasks.filter(t => t.status === 'In Progress').length}</div>
          </div>
        </div>

        {/* LIST OF ORDERS */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
          {filteredTasks.length === 0 ? (
            <div style={{ textAlign: 'center', color: '#94a3b8', padding: '30px' }}>No matching work orders found.</div>
          ) : (
            filteredTasks.map(task => (
              <div key={task.id} style={{ background: 'rgba(255, 255, 255, 0.05)', backdropFilter: 'blur(10px)', border: '1px solid rgba(255, 255, 255, 0.1)', borderRadius: '12px', padding: '14px' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '8px' }}>
                  <span style={{ fontSize: '11px', fontWeight: 'bold', color: '#38bdf8', background: 'rgba(56, 189, 248, 0.1)', padding: '2px 6px', borderRadius: '4px' }}>{task.id}</span>
                  <span style={{ fontSize: '11px', fontWeight: 'bold', color: task.priority === 'High' ? '#ef4444' : '#f59e0b' }}>{task.priority} Priority</span>
                </div>

                <h4 style={{ margin: '0 0 4px 0', fontSize: '15px' }}>{task.title}</h4>
                <p style={{ margin: '0 0 2px 0', fontSize: '12px', color: '#94a3b8' }}>🏢 {task.customer}</p>
                <p style={{ margin: '0 0 10px 0', fontSize: '12px', color: '#94a3b8' }}>📍 {task.address}</p>

                <div style={{ display: 'flex', gap: '8px', alignItems: 'center', justifyContent: 'space-between' }}>
                  <select
                    value={task.status}
                    onChange={(e) => handleStatusChange(task.id, e.target.value as any)}
                    style={{ background: '#1e293b', color: '#fff', border: '1px solid rgba(255,255,255,0.2)', padding: '6px 8px', borderRadius: '6px', fontSize: '12px' }}
                  >
                    <option value="Pending">Pending</option>
                    <option value="In Progress">In Progress</option>
                    <option value="Completed">Completed</option>
                  </select>

                  <button
                    onClick={() => setSelectedTask(task)}
                    style={{ padding: '6px 10px', background: 'rgba(255,255,255,0.1)', border: '1px solid rgba(255,255,255,0.2)', color: '#fff', borderRadius: '6px', fontSize: '12px', cursor: 'pointer' }}
                  >
                    Notes & Details
                  </button>
                </div>
              </div>
            ))
          )}
        </div>
      </main>

      {/* CREATE ORDER MODAL */}
      {showNewTaskModal && (
        <div style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.8)', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '16px', zIndex: 50 }}>
          <div style={{ background: '#1e293b', padding: '20px', borderRadius: '12px', width: '100%', maxWidth: '380px' }}>
            <h3 style={{ margin: '0 0 12px 0', color: '#38bdf8' }}>Create Work Order</h3>
            <form onSubmit={handleCreateTask} style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
              <input type="text" placeholder="Title / Issue Description" value={newTask.title} onChange={(e) => setNewTask({ ...newTask, title: e.target.value })} required style={{ background: '#0f172a', border: '1px solid rgba(255,255,255,0.2)', color: '#fff', padding: '8px', borderRadius: '6px' }} />
              <input type="text" placeholder="Customer Name" value={newTask.customer} onChange={(e) => setNewTask({ ...newTask, customer: e.target.value })} required style={{ background: '#0f172a', border: '1px solid rgba(255,255,255,0.2)', color: '#fff', padding: '8px', borderRadius: '6px' }} />
              <input type="text" placeholder="Location / Address" value={newTask.address} onChange={(e) => setNewTask({ ...newTask, address: e.target.value })} style={{ background: '#0f172a', border: '1px solid rgba(255,255,255,0.2)', color: '#fff', padding: '8px', borderRadius: '6px' }} />
              <select value={newTask.priority} onChange={(e) => setNewTask({ ...newTask, priority: e.target.value })} style={{ background: '#0f172a', color: '#fff', border: '1px solid rgba(255,255,255,0.2)', padding: '8px', borderRadius: '6px' }}>
                <option value="Low">Low Priority</option>
                <option value="Medium">Medium Priority</option>
                <option value="High">High Priority</option>
              </select>
              <div style={{ display: 'flex', gap: '8px', marginTop: '8px' }}>
                <button type="submit" style={{ flex: 1, padding: '8px', background: '#38bdf8', border: 'none', borderRadius: '6px', fontWeight: 'bold', cursor: 'pointer' }}>Create</button>
                <button type="button" onClick={() => setShowNewTaskModal(false)} style={{ flex: 1, padding: '8px', background: '#64748b', border: 'none', borderRadius: '6px', color: '#fff', cursor: 'pointer' }}>Cancel</button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* VIEW / EDIT NOTES MODAL */}
      {selectedTask && (
        <div style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.8)', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '16px', zIndex: 50 }}>
          <div style={{ background: '#1e293b', padding: '20px', borderRadius: '12px', width: '100%', maxWidth: '400px' }}>
            <h3 style={{ margin: '0 0 8px 0', color: '#38bdf8' }}>{selectedTask.title}</h3>
            <p style={{ margin: '0 0 4px 0', fontSize: '12px' }}><strong>ID:</strong> {selectedTask.id}</p>
            <p style={{ margin: '0 0 4px 0', fontSize: '12px' }}><strong>Customer:</strong> {selectedTask.customer}</p>
            <p style={{ margin: '0 0 12px 0', fontSize: '12px' }}><strong>Address:</strong> {selectedTask.address}</p>

            <div style={{ background: 'rgba(0,0,0,0.3)', padding: '10px', borderRadius: '6px', marginBottom: '12px', fontSize: '12px', whiteSpace: 'pre-wrap', maxHeight: '120px', overflowY: 'auto' }}>
              <strong>Work Notes:</strong>
              <div style={{ color: '#cbd5e1', marginTop: '4px' }}>{selectedTask.notes || 'No notes added yet.'}</div>
            </div>

            <form onSubmit={handleAddNote} style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
              <textarea
                placeholder="Add service note..."
                value={noteInput}
                onChange={(e) => setNoteInput(e.target.value)}
                rows={2}
                style={{ width: '100%', background: '#0f172a', border: '1px solid rgba(255,255,255,0.2)', color: '#fff', padding: '8px', borderRadius: '6px', boxSizing: 'border-box' }}
              />
              <div style={{ display: 'flex', gap: '8px' }}>
                <button type="submit" style={{ flex: 1, padding: '8px', background: '#38bdf8', border: 'none', borderRadius: '6px', fontWeight: 'bold', cursor: 'pointer' }}>Add Note</button>
                <button type="button" onClick={() => setSelectedTask(null)} style={{ flex: 1, padding: '8px', background: '#64748b', border: 'none', borderRadius: '6px', color: '#fff', cursor: 'pointer' }}>Close</button>
              </div>
            </form>
          </div>
        </div>
      )}

    </div>
  );
};

export default TechnicianDashboard;
