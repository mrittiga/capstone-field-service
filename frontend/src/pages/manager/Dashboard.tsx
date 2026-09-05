import { useState, useEffect } from 'react'
import { DashboardMetrics } from '../../types/index'

export default function Dashboard() {
  const [metrics, setMetrics] = useState<DashboardMetrics | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetchMetrics()
  }, [])

  const fetchMetrics = async () => {
    setLoading(true)
    try {
      const response = await fetch('/api/work-orders/reports/dashboard', {
        headers: { 'Authorization': `Bearer ${localStorage.getItem('token')}` }
      })
      if (response.ok) {
        const data = await response.json()
        setMetrics(data)
      }
    } catch (error) {
      console.error('Failed to fetch metrics', error)
    } finally {
      setLoading(false)
    }
  }

  const MetricCard = ({ label, value, color }: { label: string; value: number; color: string }) => (
    <div className="glass" style={{
      padding: '1.5rem',
      borderRadius: '1rem',
      textAlign: 'center',
      borderLeft: `4px solid ${color}`
    }}>
      <p style={{ color: 'var(--text-tertiary)', fontSize: '0.9rem', marginBottom: '0.5rem' }}>
        {label}
      </p>
      <h2 style={{ margin: 0, color: color, fontSize: '2.5rem' }}>
        {value}
      </h2>
    </div>
  )

  if (loading) {
    return (
      <div style={{ textAlign: 'center', padding: '2rem' }}>
        <div className="spinner"></div>
      </div>
    )
  }

  if (!metrics) {
    return (
      <div className="glass" style={{ padding: '2rem', textAlign: 'center' }}>
        <p>Failed to load metrics</p>
      </div>
    )
  }

  return (
    <div>
      {/* KPI Cards */}
      <div style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
        gap: '1.5rem',
        marginBottom: '2rem'
      }}>
        <MetricCard label="New" value={metrics.newCount} color="var(--info)" />
        <MetricCard label="Assigned" value={metrics.assignedCount} color="var(--primary)" />
        <MetricCard label="In Progress" value={metrics.inProgressCount} color="var(--warning)" />
        <MetricCard label="On Hold" value={metrics.onHoldCount} color="var(--danger)" />
        <MetricCard label="Completed" value={metrics.completedCount} color="var(--success)" />
        <MetricCard label="Overdue" value={metrics.overdueCount} color="var(--danger)" />
      </div>

      {/* SLA Compliance */}
      <div className="glass" style={{
        padding: '2rem',
        borderRadius: '1rem',
        marginBottom: '2rem'
      }}>
        <h3 style={{ marginBottom: '1rem' }}>SLA Compliance</h3>
        <div style={{
          display: 'flex',
          alignItems: 'center',
          gap: '2rem'
        }}>
          <div style={{
            position: 'relative',
            width: '150px',
            height: '150px'
          }}>
            <svg style={{ width: '100%', height: '100%', transform: 'rotate(-90deg)' }} viewBox="0 0 100 100">
              <circle cx="50" cy="50" r="45" fill="none" stroke="var(--bg-tertiary)" strokeWidth="8" />
              <circle
                cx="50"
                cy="50"
                r="45"
                fill="none"
                stroke="var(--success)"
                strokeWidth="8"
                strokeDasharray={`${metrics.slaCompliancePercentage * 2.83} 283`}
                strokeLinecap="round"
              />
            </svg>
            <div style={{
              position: 'absolute',
              top: 0,
              left: 0,
              right: 0,
              bottom: 0,
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              justifyContent: 'center'
            }}>
              <span style={{ fontSize: '2rem', fontWeight: '700', color: 'var(--success)' }}>
                {Math.round(metrics.slaCompliancePercentage)}%
              </span>
              <span style={{ fontSize: '0.75rem', color: 'var(--text-tertiary)' }}>
                Compliant
              </span>
            </div>
          </div>
          <div>
            <p style={{ marginBottom: '1rem' }}>
              Your team is maintaining <strong>{Math.round(metrics.slaCompliancePercentage)}% SLA compliance</strong>. 
              Keep up the excellent work!
            </p>
            <div style={{ display: 'flex', gap: '1rem' }}>
              <div>
                <p style={{ fontSize: '0.9rem', color: 'var(--text-tertiary)', marginBottom: '0.25rem' }}>
                  Completed
                </p>
                <p style={{ fontSize: '1.5rem', fontWeight: '600', margin: 0 }}>
                  {metrics.completedCount}
                </p>
              </div>
              <div>
                <p style={{ fontSize: '0.9rem', color: 'var(--text-tertiary)', marginBottom: '0.25rem' }}>
                  Closed
                </p>
                <p style={{ fontSize: '1.5rem', fontWeight: '600', margin: 0 }}>
                  {metrics.closedCount}
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Summary Stats */}
      <div style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))',
        gap: '1.5rem'
      }}>
        <div className="glass" style={{ padding: '1.5rem', borderRadius: '1rem' }}>
          <p style={{ color: 'var(--text-tertiary)', fontSize: '0.9rem', marginBottom: '0.5rem' }}>
            Total Work Orders
          </p>
          <h2 style={{ margin: 0 }}>
            {metrics.newCount + metrics.assignedCount + metrics.inProgressCount + 
             metrics.onHoldCount + metrics.completedCount + metrics.closedCount + metrics.cancelledCount}
          </h2>
        </div>
        <div className="glass" style={{ padding: '1.5rem', borderRadius: '1rem' }}>
          <p style={{ color: 'var(--text-tertiary)', fontSize: '0.9rem', marginBottom: '0.5rem' }}>
            Active Jobs
          </p>
          <h2 style={{ margin: 0 }}>
            {metrics.newCount + metrics.assignedCount + metrics.inProgressCount + metrics.onHoldCount}
          </h2>
        </div>
      </div>
    </div>
  )
}
