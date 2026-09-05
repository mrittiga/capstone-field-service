import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { useAuth } from '../../context/AuthContext'
import { WorkOrder, WorkOrderStatus } from '../../types/index'

export default function AssignedJobs() {
  const navigate = useNavigate()
  const { user } = useAuth()
  const [jobs, setJobs] = useState<WorkOrder[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetchAssignedJobs()
  }, [])

  const fetchAssignedJobs = async () => {
    setLoading(true)
    try {
      const response = await fetch(`/api/work-orders/by-technician/${user?.id}?size=50`, {
        headers: { 'Authorization': `Bearer ${localStorage.getItem('token')}` }
      })
      const data = await response.json()
      setJobs(data.content || [])
    } catch (error) {
      console.error('Failed to fetch jobs', error)
    } finally {
      setLoading(false)
    }
  }

  const getStatusIcon = (status: WorkOrderStatus) => {
    switch (status) {
      case 'ASSIGNED':
        return '🆕'
      case 'IN_PROGRESS':
        return '⚡'
      case 'ON_HOLD':
        return '⏸️'
      case 'COMPLETED':
        return '✅'
      default:
        return '📋'
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
      gridTemplateColumns: 'repeat(auto-fill, minmax(320px, 1fr))',
      gap: '1.5rem'
    }}>
      {jobs.length === 0 ? (
        <div className="glass" style={{
          padding: '3rem',
          textAlign: 'center',
          gridColumn: '1 / -1'
        }}>
          <p style={{ fontSize: '2rem', marginBottom: '0.5rem' }}>🎉</p>
          <h3>No assigned jobs</h3>
          <p style={{ color: 'var(--text-secondary)' }}>
            You're all caught up! Check back later for new assignments.
          </p>
        </div>
      ) : (
        jobs.map(job => (
          <div key={job.id} className="glass" style={{
            padding: '1.5rem',
            borderRadius: '1rem',
            cursor: 'pointer',
            transition: 'transform 0.2s ease'
          }}
          onClick={() => navigate(`/technician/${job.id}`)}
          >
            <div style={{
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'start',
              marginBottom: '1rem'
            }}>
              <div>
                <h4 style={{ marginBottom: '0.25rem' }}>{job.title}</h4>
                <p style={{
                  fontSize: '0.8rem',
                  color: 'var(--text-tertiary)',
                  margin: 0
                }}>
                  {job.workOrderCode}
                </p>
              </div>
              <span style={{ fontSize: '1.5rem' }}>
                {getStatusIcon(job.status)}
              </span>
            </div>

            <p style={{
              margin: '0.75rem 0',
              fontSize: '0.9rem',
              color: 'var(--text-secondary)'
            }}>
              📍 {job.siteName}
            </p>

            <p style={{
              margin: '0.75rem 0',
              fontSize: '0.9rem',
              color: 'var(--text-secondary)'
            }}>
              🏢 {job.customerName}
            </p>

            <div style={{
              display: 'flex',
              gap: '0.5rem',
              marginTop: '1rem',
              marginBottom: '1rem'
            }}>
              <span className="badge" style={{
                background: job.priority === 'HIGH' ? 'rgba(239, 68, 68, 0.2)' : 'rgba(37, 99, 235, 0.2)',
                color: job.priority === 'HIGH' ? 'var(--danger)' : 'var(--primary)',
                fontSize: '0.75rem'
              }}>
                {job.priority} Priority
              </span>
              <span className="badge badge-primary" style={{ fontSize: '0.75rem' }}>
                {job.status}
              </span>
            </div>

            <button 
              onClick={(e) => {
                e.stopPropagation()
                navigate(`/technician/${job.id}`)
              }}
              className="btn btn-primary"
              style={{ width: '100%' }}
            >
              View Details
            </button>
          </div>
        ))
      )}
    </div>
  )
}
