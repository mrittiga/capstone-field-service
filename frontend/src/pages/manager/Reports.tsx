import { useState, useEffect } from 'react'
import { WorkOrder } from '../../types/index'

export default function Reports() {
  const [overdueOrders, setOverdueOrders] = useState<WorkOrder[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetchOverdueOrders()
  }, [])

  const fetchOverdueOrders = async () => {
    setLoading(true)
    try {
      const response = await fetch('/api/work-orders/reports/overdue', {
        headers: { 'Authorization': `Bearer ${localStorage.getItem('token')}` }
      })
      if (response.ok) {
        const data = await response.json()
        setOverdueOrders(Array.isArray(data) ? data : [])
      }
    } catch (error) {
      console.error('Failed to fetch overdue orders', error)
    } finally {
      setLoading(false)
    }
  }

  const handleExport = () => {
    const csv = [
      ['Work Order Code', 'Title', 'Customer', 'Status', 'Priority', 'SLA Due Date'].join(','),
      ...overdueOrders.map(wo => [
        wo.workOrderCode,
        wo.title,
        wo.customerName,
        wo.status,
        wo.priority,
        new Date(wo.slaDueDate).toLocaleDateString()
      ].join(','))
    ].join('\n')

    const blob = new Blob([csv], { type: 'text/csv' })
    const url = window.URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = 'overdue-work-orders.csv'
    a.click()
  }

  return (
    <div>
      <div className="glass" style={{
        padding: '1.5rem',
        marginBottom: '2rem',
        borderRadius: '1rem',
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center'
      }}>
        <h3 style={{ margin: 0 }}>Overdue Work Orders</h3>
        <button onClick={handleExport} className="btn btn-primary">
          📥 Export CSV
        </button>
      </div>

      {loading ? (
        <div style={{ textAlign: 'center', padding: '2rem' }}>
          <div className="spinner"></div>
        </div>
      ) : overdueOrders.length === 0 ? (
        <div className="glass" style={{
          padding: '3rem',
          textAlign: 'center',
          borderRadius: '1rem'
        }}>
          <p style={{ fontSize: '2rem', marginBottom: '0.5rem' }}>🎉</p>
          <h3>No Overdue Orders!</h3>
          <p style={{ color: 'var(--text-secondary)' }}>
            All work orders are on track. Excellent work!
          </p>
        </div>
      ) : (
        <div className="glass" style={{
          borderRadius: '1rem',
          overflow: 'hidden'
        }}>
          <table style={{ width: '100%' }}>
            <thead>
              <tr style={{ background: 'var(--primary)' }}>
                <th style={{ color: 'white', padding: '1rem' }}>Code</th>
                <th style={{ color: 'white', padding: '1rem' }}>Title</th>
                <th style={{ color: 'white', padding: '1rem' }}>Customer</th>
                <th style={{ color: 'white', padding: '1rem' }}>Priority</th>
                <th style={{ color: 'white', padding: '1rem' }}>Status</th>
                <th style={{ color: 'white', padding: '1rem' }}>Due Date</th>
              </tr>
            </thead>
            <tbody>
              {overdueOrders.map(wo => (
                <tr key={wo.id} style={{ borderBottom: '1px solid var(--border-color)' }}>
                  <td style={{ padding: '1rem' }}>
                    <code style={{ background: 'var(--bg-secondary)', padding: '0.25rem 0.5rem', borderRadius: '0.25rem' }}>
                      {wo.workOrderCode}
                    </code>
                  </td>
                  <td style={{ padding: '1rem' }}>{wo.title}</td>
                  <td style={{ padding: '1rem' }}>{wo.customerName}</td>
                  <td style={{ padding: '1rem' }}>
                    <span className="badge" style={{
                      background: wo.priority === 'HIGH' ? 'rgba(239, 68, 68, 0.2)' : 'rgba(37, 99, 235, 0.2)',
                      color: wo.priority === 'HIGH' ? 'var(--danger)' : 'var(--primary)'
                    }}>
                      {wo.priority}
                    </span>
                  </td>
                  <td style={{ padding: '1rem' }}>
                    <span className="badge badge-primary">{wo.status}</span>
                  </td>
                  <td style={{ padding: '1rem', fontSize: '0.9rem' }}>
                    {new Date(wo.slaDueDate).toLocaleDateString()}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  )
}
