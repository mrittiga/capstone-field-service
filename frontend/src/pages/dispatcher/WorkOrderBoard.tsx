import { useState, useEffect } from 'react'
import { WorkOrder, WorkOrderStatus } from '../../types/index'

const STATUSES: WorkOrderStatus[] = ['NEW', 'ASSIGNED', 'IN_PROGRESS', 'ON_HOLD', 'COMPLETED', 'CLOSED']

export default function WorkOrderBoard() {
  const [boardData, setBoardData] = useState<Record<WorkOrderStatus, WorkOrder[]>>({
    NEW: [],
    ASSIGNED: [],
    IN_PROGRESS: [],
    ON_HOLD: [],
    COMPLETED: [],
    CLOSED: [],
    CANCELLED: []
  })
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetchWorkOrders()
  }, [])

  const fetchWorkOrders = async () => {
    setLoading(true)
    try {
      const response = await fetch('/api/work-orders?size=100', {
        headers: { 'Authorization': `Bearer ${localStorage.getItem('token')}` }
      })
      const data = await response.json()
      
      const organized = {
        NEW: [],
        ASSIGNED: [],
        IN_PROGRESS: [],
        ON_HOLD: [],
        COMPLETED: [],
        CLOSED: [],
        CANCELLED: []
      } as Record<WorkOrderStatus, WorkOrder[]>
      
      data.content?.forEach((wo: WorkOrder) => {
        if (organized[wo.status]) {
          organized[wo.status].push(wo)
        }
      })
      
      setBoardData(organized)
    } catch (error) {
      console.error('Failed to fetch work orders', error)
    } finally {
      setLoading(false)
    }
  }

  if (loading) {
    return (
      <div style={{ textAlign: 'center', padding: '2rem' }}>
        <div className="spinner"></div>
      </div>
    )
  }

  return (
    <div style={{
      display: 'grid',
      gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))',
      gap: '1.5rem',
      overflowX: 'auto',
      paddingBottom: '1rem'
    }}>
      {STATUSES.map(status => (
        <div key={status}>
          <h3 style={{
            marginBottom: '1rem',
            padding: '0.75rem 1rem',
            background: 'var(--primary)',
            color: 'white',
            borderRadius: '0.75rem',
            textAlign: 'center'
          }}>
            {status} ({boardData[status].length})
          </h3>
          
          <div style={{
            display: 'flex',
            flexDirection: 'column',
            gap: '1rem',
            minHeight: '400px',
            padding: '1rem',
            background: 'var(--glass-bg)',
            border: '1px solid var(--glass-border)',
            borderRadius: '1rem',
            backdropFilter: 'blur(10px)'
          }}>
            {boardData[status].length === 0 ? (
              <p style={{
                textAlign: 'center',
                color: 'var(--text-tertiary)',
                padding: '2rem 0'
              }}>
                No work orders
              </p>
            ) : (
              boardData[status].map(wo => (
                <div key={wo.id} className="glass" style={{
                  padding: '1rem',
                  cursor: 'grab',
                  borderRadius: '0.75rem'
                }}>
                  <p style={{
                    fontWeight: '600',
                    marginBottom: '0.25rem',
                    fontSize: '0.95rem'
                  }}>
                    {wo.title}
                  </p>
                  <p style={{
                    fontSize: '0.8rem',
                    color: 'var(--text-tertiary)',
                    margin: '0 0 0.5rem'
                  }}>
                    {wo.workOrderCode}
                  </p>
                  <span className="badge badge-primary" style={{ fontSize: '0.75rem' }}>
                    {wo.priority}
                  </span>
                </div>
              ))
            )}
          </div>
        </div>
      ))}
    </div>
  )
}
