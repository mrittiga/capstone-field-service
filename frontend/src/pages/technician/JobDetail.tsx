import { useState, useEffect } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { useAuth } from '../../context/AuthContext'
import { WorkOrder } from '../../types/index'

export default function JobDetail() {
  const { id } = useParams<{ id: string }>()
  const navigate = useNavigate()
  const { user } = useAuth()
  const [job, setJob] = useState<WorkOrder | null>(null)
  const [loading, setLoading] = useState(true)
  const [actionLoading, setActionLoading] = useState(false)
  const [showTimeForm, setShowTimeForm] = useState(false)
  const [timeData, setTimeData] = useState({ minutesSpent: '', note: '' })

  useEffect(() => {
    fetchJob()
  }, [id])

  const fetchJob = async () => {
    setLoading(true)
    try {
      const response = await fetch(`/api/work-orders/${id}`, {
        headers: { 'Authorization': `Bearer ${localStorage.getItem('token')}` }
      })
      if (response.ok) {
        const data = await response.json()
        setJob(data)
      }
    } catch (error) {
      console.error('Failed to fetch job', error)
    } finally {
      setLoading(false)
    }
  }

  const updateJobStatus = async (status: string) => {
    setActionLoading(true)
    try {
      const endpoint = {
        'IN_PROGRESS': `/api/work-orders/${id}/start`,
        'ON_HOLD': `/api/work-orders/${id}/hold`,
        'COMPLETED': `/api/work-orders/${id}/complete`
      }[status]

      if (!endpoint) return

      const response = await fetch(endpoint, {
        method: 'POST',
        headers: { 'Authorization': `Bearer ${localStorage.getItem('token')}` }
      })

      if (response.ok) {
        const updated = await response.json()
        setJob(updated)
      }
    } catch (error) {
      console.error('Failed to update job', error)
    } finally {
      setActionLoading(false)
    }
  }

  const handleLogTime = async (e: React.FormEvent) => {
    e.preventDefault()
    try {
      const response = await fetch(`/api/work-orders/${id}/time`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        },
        body: JSON.stringify({
          minutesSpent: parseInt(timeData.minutesSpent),
          note: timeData.note
        })
      })

      if (response.ok) {
        setTimeData({ minutesSpent: '', note: '' })
        setShowTimeForm(false)
        fetchJob()
      }
    } catch (error) {
      console.error('Failed to log time', error)
    }
  }

  if (loading) {
    return (
      <div style={{ textAlign: 'center', padding: '2rem' }}>
        <div className="spinner"></div>
      </div>
    )
  }

  if (!job) {
    return (
      <div className="glass" style={{ padding: '2rem', textAlign: 'center' }}>
        <p>Job not found</p>
        <button onClick={() => navigate('/technician')} className="btn btn-primary">
          Back to Jobs
        </button>
      </div>
    )
  }

  return (
    <div style={{ maxWidth: '1000px' }}>
      {/* Header */}
      <div className="glass" style={{
        padding: '2rem',
        marginBottom: '2rem',
        borderRadius: '1rem'
      }}>
        <div style={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'start',
          marginBottom: '1rem'
        }}>
          <div>
            <h2 style={{ marginBottom: '0.5rem' }}>{job.title}</h2>
            <p style={{ color: 'var(--text-tertiary)', marginBottom: '1rem' }}>
              {job.workOrderCode}
            </p>
          </div>
          <span className="badge" style={{
            background: job.priority === 'HIGH' ? 'rgba(239, 68, 68, 0.2)' : 'rgba(37, 99, 235, 0.2)',
            color: job.priority === 'HIGH' ? 'var(--danger)' : 'var(--primary)',
            padding: '0.5rem 1rem',
            fontSize: '0.9rem'
          }}>
            {job.priority} Priority
          </span>
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(150px, 1fr))', gap: '1rem', marginBottom: '1.5rem' }}>
          <div>
            <p style={{ fontSize: '0.8rem', color: 'var(--text-tertiary)', textTransform: 'uppercase' }}>Site</p>
            <p style={{ fontWeight: '600' }}>{job.siteName}</p>
          </div>
          <div>
            <p style={{ fontSize: '0.8rem', color: 'var(--text-tertiary)', textTransform: 'uppercase' }}>Customer</p>
            <p style={{ fontWeight: '600' }}>{job.customerName}</p>
          </div>
          <div>
            <p style={{ fontSize: '0.8rem', color: 'var(--text-tertiary)', textTransform: 'uppercase' }}>Status</p>
            <p style={{ fontWeight: '600' }}>{job.status}</p>
          </div>
          <div>
            <p style={{ fontSize: '0.8rem', color: 'var(--text-tertiary)', textTransform: 'uppercase' }}>Time Logged</p>
            <p style={{ fontWeight: '600' }}>{Math.floor(job.totalTimeMinutes / 60)}h {job.totalTimeMinutes % 60}m</p>
          </div>
        </div>

        <div style={{ borderTop: '1px solid var(--border-color)', paddingTop: '1rem' }}>
          <p style={{ margin: 0, color: 'var(--text-secondary)' }}>
            {job.description}
          </p>
        </div>
      </div>

      {/* Actions */}
      <div className="glass" style={{
        padding: '1.5rem',
        marginBottom: '2rem',
        borderRadius: '1rem'
      }}>
        <h3 style={{ marginBottom: '1rem' }}>Actions</h3>
        <div style={{
          display: 'flex',
          gap: '1rem',
          flexWrap: 'wrap'
        }}>
          {job.status === 'ASSIGNED' && (
            <button
              onClick={() => updateJobStatus('IN_PROGRESS')}
              disabled={actionLoading}
              className="btn btn-success"
            >
              ⚡ Start Work
            </button>
          )}

          {job.status === 'IN_PROGRESS' && (
            <>
              <button
                onClick={() => updateJobStatus('ON_HOLD')}
                disabled={actionLoading}
                className="btn btn-warning"
              >
                ⏸️ Hold Work
              </button>
              <button
                onClick={() => updateJobStatus('COMPLETED')}
                disabled={actionLoading}
                className="btn btn-success"
              >
                ✅ Complete Work
              </button>
            </>
          )}

          {job.status === 'ON_HOLD' && (
            <button
              onClick={() => updateJobStatus('IN_PROGRESS')}
              disabled={actionLoading}
              className="btn btn-primary"
            >
              ▶️ Resume Work
            </button>
          )}

          <button
            onClick={() => setShowTimeForm(!showTimeForm)}
            className="btn btn-secondary"
          >
            ⏱️ {showTimeForm ? 'Cancel' : 'Log Time'}
          </button>
        </div>
      </div>

      {/* Log Time Form */}
      {showTimeForm && (
        <div className="glass" style={{
          padding: '1.5rem',
          marginBottom: '2rem',
          borderRadius: '1rem'
        }}>
          <h3 style={{ marginBottom: '1rem' }}>Log Time Spent</h3>
          <form onSubmit={handleLogTime}>
            <div className="form-group">
              <label>Minutes Spent</label>
              <input
                type="number"
                min="1"
                value={timeData.minutesSpent}
                onChange={(e) => setTimeData({ ...timeData, minutesSpent: e.target.value })}
                placeholder="60"
                required
              />
            </div>
            <div className="form-group">
              <label>Notes (Optional)</label>
              <textarea
                value={timeData.note}
                onChange={(e) => setTimeData({ ...timeData, note: e.target.value })}
                placeholder="What did you do..."
                style={{ minHeight: '80px' }}
              ></textarea>
            </div>
            <div style={{ display: 'flex', gap: '1rem' }}>
              <button type="submit" className="btn btn-success">
                Save Time Log
              </button>
              <button
                type="button"
                onClick={() => setShowTimeForm(false)}
                className="btn btn-secondary"
              >
                Cancel
              </button>
            </div>
          </form>
        </div>
      )}

      {/* Back Button */}
      <button onClick={() => navigate('/technician')} className="btn btn-secondary">
        ← Back to Jobs
      </button>
    </div>
  )
}
