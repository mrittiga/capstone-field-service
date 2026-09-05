import React, { useState } from 'react';
import { useAuth } from '../../context/AuthContext';

interface ServiceRequest {
  id: string;
  title: string;
  description: string;
  status: 'Pending' | 'In Progress' | 'Completed';
  dateSubmitted: string;
  assignedTech?: string;
  reviewGiven?: boolean;
}

export const CustomerPortal: React.FC = () => {
  const { user, logout } = useAuth();
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [activeTab, setActiveTab] = useState<'request' | 'my-requests' | 'support'>('my-requests');

  // Form State
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [serviceType, setServiceType] = useState('HVAC Inspection');

  // Review Modal State
  const [selectedOrderForReview, setSelectedOrderForReview] = useState<string | null>(null);
  const [rating, setRating] = useState(5);
  const [reviewComment, setReviewComment] = useState('');

  const [requests, setRequests] = useState<ServiceRequest[]>([
    {
      id: 'WO-101',
      title: 'HVAC Unit Inspection',
      description: 'Cooling issues in main office floor.',
      status: 'In Progress',
      dateSubmitted: '2026-09-04',
      assignedTech: 'Sarah Jenkins',
    },
    {
      id: 'WO-098',
      title: 'Generator Maintenance',
      description: 'Routine quarterly checkup.',
      status: 'Completed',
      dateSubmitted: '2026-08-20',
      assignedTech: 'Dave Tech',
      reviewGiven: false,
    },
  ]);

  const handleCreateRequest = (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim() || !description.trim()) return;

    const newReq: ServiceRequest = {
      id: `WO-${Math.floor(100 + Math.random() * 900)}`,
      title: `${serviceType}: ${title}`,
      description,
      status: 'Pending',
      dateSubmitted: new Date().toISOString().split('T')[0],
      assignedTech: 'Pending Assignment',
    };

    setRequests([newReq, ...requests]);
    setTitle('');
    setDescription('');
    setActiveTab('my-requests');
  };

  const handleSubmitReview = (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedOrderForReview) return;

    setRequests(requests.map(r => r.id === selectedOrderForReview ? { ...r, reviewGiven: true } : r));
    setSelectedOrderForReview(null);
    setReviewComment('');
    alert('Thank you for your feedback!');
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
            <button onClick={() => setActiveTab('my-requests')} style={{ display: 'flex', alignItems: 'center', gap: '12px', padding: '10px', borderRadius: '8px', border: 'none', background: activeTab === 'my-requests' ? 'rgba(56, 189, 248, 0.2)' : 'transparent', color: activeTab === 'my-requests' ? '#38bdf8' : '#94a3b8', cursor: 'pointer', textAlign: 'left', width: '100%' }}>
              📋 {sidebarOpen && <span>My Requests</span>}
            </button>
            <button onClick={() => setActiveTab('request')} style={{ display: 'flex', alignItems: 'center', gap: '12px', padding: '10px', borderRadius: '8px', border: 'none', background: activeTab === 'request' ? 'rgba(56, 189, 248, 0.2)' : 'transparent', color: activeTab === 'request' ? '#38bdf8' : '#94a3b8', cursor: 'pointer', textAlign: 'left', width: '100%' }}>
              ➕ {sidebarOpen && <span>New Service</span>}
            </button>
            <button onClick={() => setActiveTab('support')} style={{ display: 'flex', alignItems: 'center', gap: '12px', padding: '10px', borderRadius: '8px', border: 'none', background: activeTab === 'support' ? 'rgba(56, 189, 248, 0.2)' : 'transparent', color: activeTab === 'support' ? '#38bdf8' : '#94a3b8', cursor: 'pointer', textAlign: 'left', width: '100%' }}>
              🎧 {sidebarOpen && <span>Support</span>}
            </button>
          </nav>
        </div>
        <div style={{ borderTop: '1px solid rgba(255,255,255,0.1)', paddingTop: '12px' }}>
          {sidebarOpen && <div style={{ fontSize: '11px', color: '#94a3b8', marginBottom: '8px', overflow: 'hidden', textOverflow: 'ellipsis' }}>{user?.email || 'customer@test.com'}</div>}
          <button onClick={logout} style={{ width: '100%', padding: '8px', borderRadius: '6px', border: 'none', background: '#ef4444', color: '#fff', fontWeight: 'bold', cursor: 'pointer' }}>
            {sidebarOpen ? 'Logout' : '🚪'}
          </button>
        </div>
      </aside>

      {/* MAIN CONTENT */}
      <main style={{ flex: 1, padding: '16px', overflowY: 'auto' }}>
        <header style={{ marginBottom: '20px' }}>
          <h2 style={{ margin: '0 0 4px 0', color: '#38bdf8', fontSize: '20px' }}>Customer Portal</h2>
          <span style={{ fontSize: '12px', color: '#94a3b8' }}>Request Services & Track Status</span>
        </header>

        {/* MY REQUESTS */}
        {activeTab === 'my-requests' && (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
            {requests.map((req) => (
              <div key={req.id} style={{ background: 'rgba(255, 255, 255, 0.05)', border: '1px solid rgba(255, 255, 255, 0.1)', borderRadius: '12px', padding: '14px', display: 'flex', flexDirection: 'column', gap: '8px' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <span style={{ fontSize: '12px', color: '#38bdf8', fontWeight: 'bold' }}>{req.id}</span>
                  <span style={{ 
                    fontSize: '11px', 
                    padding: '2px 8px', 
                    borderRadius: '12px', 
                    background: req.status === 'Completed' ? 'rgba(74, 222, 128, 0.2)' : req.status === 'In Progress' ? 'rgba(245, 158, 11, 0.2)' : 'rgba(239, 68, 68, 0.2)',
                    color: req.status === 'Completed' ? '#4ade80' : req.status === 'In Progress' ? '#f59e0b' : '#ef4444' 
                  }}>
                    {req.status}
                  </span>
                </div>
                
                <div style={{ fontWeight: 'bold', fontSize: '15px' }}>{req.title}</div>
                <p style={{ margin: 0, fontSize: '12px', color: '#94a3b8' }}>{req.description}</p>
                
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginTop: '6px', fontSize: '11px', color: '#cbd5e1' }}>
                  <span>Tech: <strong>{req.assignedTech}</strong></span>
                  <span>Submitted: {req.dateSubmitted}</span>
                </div>

                {req.status === 'Completed' && !req.reviewGiven && (
                  <button 
                    onClick={() => setSelectedOrderForReview(req.id)}
                    style={{ marginTop: '8px', padding: '8px', background: '#f59e0b', border: 'none', borderRadius: '6px', color: '#0f172a', fontWeight: 'bold', cursor: 'pointer', fontSize: '12px' }}
                  >
                    ⭐ Submit Feedback & Rating
                  </button>
                )}
                {req.reviewGiven && (
                  <span style={{ fontSize: '11px', color: '#4ade80', fontStyle: 'italic', marginTop: '4px' }}>✓ Review Submitted</span>
                )}
              </div>
            ))}
          </div>
        )}

        {/* NEW SERVICE REQUEST */}
        {activeTab === 'request' && (
          <div style={{ background: 'rgba(255, 255, 255, 0.05)', border: '1px solid rgba(255, 255, 255, 0.1)', borderRadius: '12px', padding: '16px' }}>
            <h3 style={{ margin: '0 0 12px 0', fontSize: '15px' }}>Request New Service</h3>
            <form onSubmit={handleCreateRequest} style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
              <div>
                <label style={{ display: 'block', fontSize: '12px', marginBottom: '4px', color: '#94a3b8' }}>Category</label>
                <select 
                  value={serviceType} 
                  onChange={(e) => setServiceType(e.target.value)}
                  style={{ width: '100%', padding: '8px', borderRadius: '6px', border: '1px solid rgba(255,255,255,0.2)', background: '#1e293b', color: '#fff' }}
                >
                  <option value="HVAC Inspection">HVAC Inspection & Repair</option>
                  <option value="Electrical Repair">Electrical Repair</option>
                  <option value="Plumbing Service">Plumbing Service</option>
                  <option value="Generator Maintenance">Generator Maintenance</option>
                </select>
              </div>

              <div>
                <label style={{ display: 'block', fontSize: '12px', marginBottom: '4px', color: '#94a3b8' }}>Issue Headline</label>
                <input 
                  type="text" 
                  placeholder="e.g. AC unit making loud noise" 
                  value={title} 
                  onChange={(e) => setTitle(e.target.value)}
                  style={{ width: '100%', padding: '8px', borderRadius: '6px', border: '1px solid rgba(255,255,255,0.2)', background: 'rgba(0,0,0,0.3)', color: '#fff', boxSizing: 'border-box' }}
                />
              </div>

              <div>
                <label style={{ display: 'block', fontSize: '12px', marginBottom: '4px', color: '#94a3b8' }}>Detailed Description</label>
                <textarea 
                  rows={4}
                  placeholder="Describe the issue or location details..." 
                  value={description} 
                  onChange={(e) => setDescription(e.target.value)}
                  style={{ width: '100%', padding: '8px', borderRadius: '6px', border: '1px solid rgba(255,255,255,0.2)', background: 'rgba(0,0,0,0.3)', color: '#fff', boxSizing: 'border-box' }}
                />
              </div>

              <button type="submit" style={{ padding: '10px', background: '#38bdf8', color: '#0f172a', fontWeight: 'bold', border: 'none', borderRadius: '6px', cursor: 'pointer', marginTop: '4px' }}>
                Submit Request
              </button>
            </form>
          </div>
        )}

        {/* SUPPORT TAB */}
        {activeTab === 'support' && (
          <div style={{ background: 'rgba(255, 255, 255, 0.05)', border: '1px solid rgba(255, 255, 255, 0.1)', borderRadius: '12px', padding: '16px' }}>
            <h3 style={{ margin: '0 0 12px 0', fontSize: '15px' }}>Help & Emergency Contact</h3>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '10px', fontSize: '13px' }}>
              <div style={{ background: 'rgba(0,0,0,0.2)', padding: '12px', borderRadius: '8px' }}>
                <div style={{ fontWeight: 'bold', color: '#38bdf8' }}>24/7 Dispatch Hotline</div>
                <div style={{ color: '#94a3b8', marginTop: '2px' }}>+1 (800) 555-FIELD</div>
              </div>
              <div style={{ background: 'rgba(0,0,0,0.2)', padding: '12px', borderRadius: '8px' }}>
                <div style={{ fontWeight: 'bold', color: '#38bdf8' }}>Support Email</div>
                <div style={{ color: '#94a3b8', marginTop: '2px' }}>support@keystonefield.com</div>
              </div>
            </div>
          </div>
        )}

        {/* REVIEW MODAL */}
        {selectedOrderForReview && (
          <div style={{ position: 'fixed', top: 0, left: 0, right: 0, bottom: 0, background: 'rgba(0,0,0,0.7)', display: 'flex', justifyContent: 'center', alignItems: 'center', padding: '16px', zIndex: 100 }}>
            <div style={{ background: '#1e293b', border: '1px solid rgba(255,255,255,0.2)', borderRadius: '12px', padding: '20px', width: '100%', maxWidth: '400px' }}>
              <h3 style={{ margin: '0 0 12px 0', fontSize: '16px' }}>Rate & Review Service</h3>
              <form onSubmit={handleSubmitReview} style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                <div>
                  <label style={{ display: 'block', fontSize: '12px', color: '#94a3b8', marginBottom: '4px' }}>Rating</label>
                  <select 
                    value={rating} 
                    onChange={(e) => setRating(Number(e.target.value))}
                    style={{ width: '100%', padding: '8px', borderRadius: '6px', background: '#0f172a', color: '#fff', border: '1px solid rgba(255,255,255,0.2)' }}
                  >
                    <option value={5}>⭐⭐⭐⭐⭐ (5 Stars)</option>
                    <option value={4}>⭐⭐⭐⭐ (4 Stars)</option>
                    <option value={3}>⭐⭐⭐ (3 Stars)</option>
                    <option value={2}>⭐⭐ (2 Stars)</option>
                    <option value={1}>⭐ (1 Star)</option>
                  </select>
                </div>

                <div>
                  <label style={{ display: 'block', fontSize: '12px', color: '#94a3b8', marginBottom: '4px' }}>Feedback</label>
                  <textarea 
                    rows={3} 
                    placeholder="Tell us about the service quality..." 
                    value={reviewComment} 
                    onChange={(e) => setReviewComment(e.target.value)}
                    style={{ width: '100%', padding: '8px', borderRadius: '6px', background: 'rgba(0,0,0,0.3)', color: '#fff', border: '1px solid rgba(255,255,255,0.2)', boxSizing: 'border-box' }}
                  />
                </div>

                <div style={{ display: 'flex', gap: '8px', marginTop: '4px' }}>
                  <button type="submit" style={{ flex: 1, padding: '8px', background: '#4ade80', color: '#0f172a', fontWeight: 'bold', border: 'none', borderRadius: '6px', cursor: 'pointer' }}>Submit</button>
                  <button type="button" onClick={() => setSelectedOrderForReview(null)} style={{ padding: '8px', background: 'rgba(255,255,255,0.1)', color: '#fff', border: 'none', borderRadius: '6px', cursor: 'pointer' }}>Cancel</button>
                </div>
              </form>
            </div>
          </div>
        )}

      </main>
    </div>
  );
};

export default CustomerPortal;
