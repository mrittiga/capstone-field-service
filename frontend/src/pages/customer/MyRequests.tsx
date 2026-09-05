import { useState, useEffect } from 'react'
import { useAuth } from '../../context/AuthContext'
import { WorkOrder, SlaStatus } from '../../types/index'

export default function MyRequests() {
  const { user } = useAuth()
  const [requests, setRequests] = useState<WorkOrder[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetchRequests()
  }, [])

  const fetchRequests = async () => {
    setLoading(true)
    try {
      const response = await fetch(`/api/work-orders?size=50`, {
        headers: { 'Authorization': `Bearer ${localStorage.getItem('token')}` }
      })
      if (response.ok) {
        const data = await response.json()
        setRequests(data.content || [])
      }
    } catch (error) {
      console.error('Failed to fetch requests', error)
    } finally {
      setLoading(false)
    }
  }

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'NEW':
        return '🆕'
      case 'ASSIGNED':
        return '👤'
      case 'IN_PROGRESS':
        return '⚡'
      case 'COMPLETED':
        return '✅'
      case 'CLOSED':
        return '🔒'
      default:
        return '📋'
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

  if (loading) {
    return (
      <div style={{ textAlign: 'center', padding: '2rem' }}>
        <div className="spinner"></div>
      </div>
    )
  }

  return (
    <div>
      {requests.length === 0 ? (
        <div className="glass" style={{
          padding: '3rem',
          textAlign: 'center',
          borderRadius: '1rem'
        }}>
          <p style={{ fontSize: '2rem', marginBottom: '0.5rem' }}>📭</p>
          <h3>No Work Order Requests</h3>
          <p style={{ color: 'var(--text-secondary)', marginBottom: '1rem' }}>
            You haven't created any requests yet.
          </p>
          <button className="btn btn-primary">
            Create Your First Request
          </button>
        </div>
      ) : (
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fill, minmax(320px, 1fr))',
          gap: '1.5rem'
        }}>
          {requests.map(request => (
            <div key={request.id} className="glass" style={{
              padding: '1.5rem',
              borderRadius: '1rem'
            }}>
              <div style={{
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'start',
                marginBottom: '1rem'
              }}>
                <div>
                  <h4 style={{ marginBottom: '0.25rem' }}>{request.title}</h4>
                  <p style={{
                    fontSize: '0.8rem',
                    color: 'var(--text-tertiary)',
                    margin: 0
                  }}>
                    {request.workOrderCode}
                  </p>
                </div>
                <span style={{ fontSize: '1.5rem' }}>
                  {getStatusIcon(request.status)}
                </span>
              </div>

              <p style={{
                margin: '0.75rem 0',
                fontSize: '0.9rem',
                color: 'var(--text-secondary)'
              }}>
                📍 {request.siteName}
              </p>

              <p style={{
                margin: '0.75rem 0',
                fontSize: '0.85rem',
                color: 'var(--text-secondary)',
                minHeight: '40px'
              }}>
                {request.description || 'No description provided'}
              </p>

              <div style={{
                display: 'flex',
                gap: '0.5rem',
                flexWrap: 'wrap',
                marginTop: '1rem',
                marginBottom: '1rem'
              }}>
                <span className="badge badge-primary" style={{ fontSize: '0.75rem' }}>
                  {request.status}
                </span>
                <span className="badge" style={{
                  background: `${getSlaStatusColor(request.slaStatus)}20`,
                  color: getSlaStatusColor(request.slaStatus),
                  fontSize: '0.75rem'
                }}>
                  {request.slaStatus.toUpperCase()}
                </span>
              </div>

              {request.assigneeName && (
                <p style={{
                  fontSize: '0.85rem',
                  color: 'var(--text-secondary)',
                  marginBottom: '1rem',
                  paddingTop: '0.5rem',
                  borderTop: '1px solid var(--border-color)'
                }}>
                  👤 Assigned to: <strong>{request.assigneeName}</strong>
                </p>
              )}

              <button className="btn btn-primary" style={{ width: '100%' }}>
                View Details
              </button>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}
