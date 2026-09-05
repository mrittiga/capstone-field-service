import { useState, useEffect } from 'react'
import { WorkOrder, Priority, WorkOrderStatus, SlaStatus } from '../../types/index'

export default function WorkOrderList() {
  const [workOrders, setWorkOrders] = useState<WorkOrder[]>([])
  const [loading, setLoading] = useState(true)
  const [filter, setFilter] = useState<WorkOrderStatus | 'ALL'>('ALL')

  useEffect(() => {
    fetchWorkOrders()
  }, [filter])

  const fetchWorkOrders = async () => {
    setLoading(true)
    try {
      const url = filter === 'ALL' 
        ? '/api/work-orders'
        : `/api/work-orders?status=${filter}`
      const response = await fetch(url, {
        headers: { 'Authorization': `Bearer ${localStorage.getItem('token')}` }
      })
      const data = await response.json()
      setWorkOrders(data.content || [])
    } catch (error) {
      console.error('Failed to fetch work orders', error)
    } finally {
      setLoading(false)
    }
  }

  const getPriorityColor = (priority: Priority) => {
    switch (priority) {
      case 'HIGH':
        return 'var(--danger)'
      case 'MEDIUM':
        return 'var(--warning)'
      case 'LOW':
        return 'var(--info)'
    }
  }

  const getSlaStatusColor = (status: SlaStatus) => {
    switch (status) {
      case 'on_track':
        return 'var(--success)'
      case 'at_risk':
        return 'var(--warning)'
      case 'breached':
        return 'var(--danger)'
      default:
        return 'var(--text-tertiary)'
    }
  }

  return (
    <div>
      {/* Filters */}
      <div className="glass" style={{
        padding: '1.5rem',
        marginBottom: '2rem',
        display: 'flex',
        gap: '1rem',
        flexWrap: 'wrap',
        alignItems: 'center'
      }}>
        <label style={{ fontWeight: '600' }}>Filter by Status:</label>
        <select 
          value={filter}
          onChange={(e) => setFilter(e.target.value as WorkOrderStatus | 'ALL')}
          style={{ padding: '0.5rem 1rem', borderRadius: '0.5rem' }}
        >
          <option value="ALL">All</option>
          <option value="NEW">New</option>
          <option value="ASSIGNED">Assigned</option>
          <option value="IN_PROGRESS">In Progress</option>
          <option value="ON_HOLD">On Hold</option>
          <option value="COMPLETED">Completed</option>
          <option value="CLOSED">Closed</option>
        </select>
      </div>

      {/* Loading */}
      {loading && (
        <div style={{ textAlign: 'center', padding: '2rem' }}>
          <div className="spinner"></div>
        </div>
      )}

      {/* Work Orders Grid */}
      {!loading && (
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fill, minmax(350px, 1fr))',
          gap: '1.5rem'
        }}>
          {workOrders.length === 0 ? (
            <div className="glass" style={{
              padding: '3rem',
              textAlign: 'center',
              gridColumn: '1 / -1'
            }}>
              <p style={{ color: 'var(--text-secondary)' }}>No work orders found</p>
            </div>
          ) : (
            workOrders.map(wo => (
              <div key={wo.id} className="glass" style={{
                padding: '1.5rem',
                borderRadius: '1rem',
                display: 'flex',
                flexDirection: 'column',
                gap: '1rem'
              }}>
                <div style={{
                  display: 'flex',
                  justifyContent: 'space-between',
                  alignItems: 'start'
                }}>
                  <div>
                    <h4 style={{ marginBottom: '0.25rem' }}>{wo.title}</h4>
                    <p style={{ fontSize: '0.875rem', color: 'var(--text-tertiary)', margin: 0 }}>
                      {wo.workOrderCode}
                    </p>
                  </div>
                  <span className="badge" style={{
                    background: `${getPriorityColor(wo.priority)}20`,
                    color: getPriorityColor(wo.priority)
                  }}>
                    {wo.priority}
                  </span>
                </div>

                <p style={{ margin: '0.5rem 0', fontSize: '0.875rem' }}>
                  {wo.siteName} • {wo.customerName}
                </p>

                <div style={{
                  display: 'flex',
                  gap: '0.5rem',
                  flexWrap: 'wrap'
                }}>
                  <span className="badge badge-primary" style={{ fontSize: '0.75rem' }}>
                    {wo.status}
                  </span>
                  <span className="badge" style={{
                    background: `${getSlaStatusColor(wo.slaStatus)}20`,
                    color: getSlaStatusColor(wo.slaStatus),
                    fontSize: '0.75rem'
                  }}>
                    SLA: {wo.slaStatus}
                  </span>
                </div>

                <div style={{
                  display: 'flex',
                  gap: '1rem',
                  marginTop: '1rem',
                  paddingTop: '1rem',
                  borderTop: '1px solid var(--border-color)'
                }}>
                  <button className="btn btn-primary btn-sm" style={{ flex: 1 }}>
                    View
                  </button>
                  <button className="btn btn-secondary btn-sm" style={{ flex: 1 }}>
                    Assign
                  </button>
                </div>
              </div>
            ))
          )}
        </div>
      )}
    </div>
  )
}
