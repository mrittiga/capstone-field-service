import React from 'react';
import { useWorkOrders } from '../../context/WorkOrderContext';

export default function WorkOrderBoard() {
  const { orders, loading, updateStatus } = useWorkOrders();

  const statuses: Array<'PENDING' | 'IN_PROGRESS' | 'COMPLETED'> = ['PENDING', 'IN_PROGRESS', 'COMPLETED'];

  if (loading) {
    return <div style={{ padding: '20px', color: '#94a3b8' }}>Loading Kanban board...</div>;
  }

  return (
    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '20px' }}>
      {statuses.map((status) => {
        const columnOrders = orders.filter((o) => o.status === status);
        return (
          <div key={status} style={{ backgroundColor: '#1e293b', padding: '16px', borderRadius: '12px', border: '1px solid #334155' }}>
            <h3 style={{ margin: '0 0 16px 0', fontSize: '14px', textTransform: 'uppercase', color: '#94a3b8', letterSpacing: '1px' }}>
              {status.replace('_', ' ')} ({columnOrders.length})
            </h3>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
              {columnOrders.length === 0 ? (
                <p style={{ color: '#64748b', fontSize: '14px', textAlign: 'center', margin: '20px 0' }}>No work orders</p>
              ) : (
                columnOrders.map((wo) => (
                  <div key={wo.id} style={{ backgroundColor: '#0f172a', padding: '14px', borderRadius: '8px', border: '1px solid #334155' }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '8px' }}>
                      <span style={{ fontSize: '12px', fontWeight: 'bold', color: '#38bdf8', fontFamily: 'monospace' }}>{wo.id}</span>
                      <span style={{ fontSize: '10px', fontWeight: 'bold', padding: '2px 6px', borderRadius: '4px', backgroundColor: wo.priority === 'HIGH' ? '#7f1d1d' : '#713f12', color: wo.priority === 'HIGH' ? '#fca5a5' : '#fde047' }}>
                        {wo.priority}
                      </span>
                    </div>
                    <h4 style={{ margin: '0 0 4px 0', fontSize: '15px' }}>{wo.title}</h4>
                    <p style={{ margin: '0 0 12px 0', fontSize: '12px', color: '#94a3b8' }}>Customer: {wo.customer}</p>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', paddingTop: '8px', borderTop: '1px solid #1e293b' }}>
                      <span style={{ fontSize: '12px', color: '#64748b' }}>{wo.technician}</span>
                      <select
                        value={wo.status}
                        onChange={(e) => updateStatus(wo.id, e.target.value as any)}
                        style={{ backgroundColor: '#1e293b', color: '#fff', border: '1px solid #334155', borderRadius: '4px', padding: '2px 4px', fontSize: '12px' }}
                      >
                        <option value="PENDING">PENDING</option>
                        <option value="IN_PROGRESS">IN_PROGRESS</option>
                        <option value="COMPLETED">COMPLETED</option>
                      </select>
                    </div>
                  </div>
                ))
              )}
            </div>
          </div>
        );
      })}
    </div>
  );
}

