import React, { useState } from 'react';
import { WorkOrderProvider } from '../../context/WorkOrderContext';
import WorkOrderList from './WorkOrderList';
import WorkOrderBoard from './WorkOrderBoard';
import CustomerManagement from './CustomerManagement';

export default function DispatcherDashboard() {
  const [activeTab, setActiveTab] = useState<'list' | 'board' | 'customers'>('list');

  return (
    <WorkOrderProvider>
      <div style={{ padding: '24px', backgroundColor: '#0f172a', minHeight: '100vh', color: '#fff' }}>
        <div style={{ maxWidth: '1200px', margin: '0 auto' }}>
          <header style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '24px', paddingBottom: '16px', borderBottom: '1px solid #334155' }}>
            <div>
              <h1 style={{ fontSize: '24px', fontWeight: 'bold', color: '#38bdf8', margin: 0 }}>Dispatcher Dashboard</h1>
              <p style={{ margin: '4px 0 0 0', color: '#94a3b8', fontSize: '14px' }}>Manage active work orders and customer requests</p>
            </div>
            <div style={{ display: 'flex', gap: '8px', backgroundColor: '#1e293b', padding: '4px', borderRadius: '8px' }}>
              <button
                onClick={() => setActiveTab('list')}
                style={{
                  padding: '8px 16px',
                  borderRadius: '6px',
                  border: 'none',
                  backgroundColor: activeTab === 'list' ? '#0284c7' : 'transparent',
                  color: '#fff',
                  cursor: 'pointer',
                  fontWeight: 'bold'
                }}
              >
                Work Orders List
              </button>
              <button
                onClick={() => setActiveTab('board')}
                style={{
                  padding: '8px 16px',
                  borderRadius: '6px',
                  border: 'none',
                  backgroundColor: activeTab === 'board' ? '#0284c7' : 'transparent',
                  color: '#fff',
                  cursor: 'pointer',
                  fontWeight: 'bold'
                }}
              >
                Kanban Board
              </button>
              <button
                onClick={() => setActiveTab('customers')}
                style={{
                  padding: '8px 16px',
                  borderRadius: '6px',
                  border: 'none',
                  backgroundColor: activeTab === 'customers' ? '#0284c7' : 'transparent',
                  color: '#fff',
                  cursor: 'pointer',
                  fontWeight: 'bold'
                }}
              >
                Customers
              </button>
            </div>
          </header>

          <main>
            {activeTab === 'list' && <WorkOrderList />}
            {activeTab === 'board' && <WorkOrderBoard />}
            {activeTab === 'customers' && <CustomerManagement />}
          </main>
        </div>
      </div>
    </WorkOrderProvider>
  );
}

