import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { useAuth } from '../../context/AuthContext'
import { Site, Priority } from '../../types/index'

export default function RaiseRequest() {
  const navigate = useNavigate()
  const { user } = useAuth()
  const [sites, setSites] = useState<Site[]>([])
  const [loading, setLoading] = useState(false)
  const [submitting, setSubmitting] = useState(false)
  const [formData, setFormData] = useState({
    siteId: '',
    title: '',
    description: '',
    priority: 'MEDIUM' as Priority
  })

  useEffect(() => {
    fetchSites()
  }, [])

  const fetchSites = async () => {
    setLoading(true)
    try {
      const response = await fetch(`/api/sites/customer/${user?.id}?size=50`, {
        headers: { 'Authorization': `Bearer ${localStorage.getItem('token')}` }
      })
      if (response.ok) {
        const data = await response.json()
        setSites(data || [])
      }
    } catch (error) {
      console.error('Failed to fetch sites', error)
    } finally {
      setLoading(false)
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setSubmitting(true)

    try {
      const response = await fetch('/api/work-orders', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        },
        body: JSON.stringify(formData)
      })

      if (response.ok) {
        navigate('/customer')
      }
    } catch (error) {
      console.error('Failed to create request', error)
    } finally {
      setSubmitting(false)
    }
  }

  return (
    <div style={{ maxWidth: '600px' }}>
      <div className="glass" style={{
        padding: '2rem',
        borderRadius: '1rem'
      }}>
        <h2 style={{ marginBottom: '1.5rem' }}>Create New Work Order Request</h2>

        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label htmlFor="site">Select Site *</label>
            {loading ? (
              <div className="spinner"></div>
            ) : (
              <select
                id="site"
                value={formData.siteId}
                onChange={(e) => setFormData({ ...formData, siteId: e.target.value })}
                required
              >
                <option value="">Choose a site...</option>
                {sites.map(site => (
                  <option key={site.id} value={site.id}>
                    {site.name} - {site.address}
                  </option>
                ))}
              </select>
            )}
          </div>

          <div className="form-group">
            <label htmlFor="title">Title *</label>
            <input
              id="title"
              type="text"
              value={formData.title}
              onChange={(e) => setFormData({ ...formData, title: e.target.value })}
              placeholder="e.g., Pump Replacement"
              required
            />
          </div>

          <div className="form-group">
            <label htmlFor="description">Description</label>
            <textarea
              id="description"
              value={formData.description}
              onChange={(e) => setFormData({ ...formData, description: e.target.value })}
              placeholder="Describe the issue or work needed..."
              style={{ minHeight: '120px' }}
            ></textarea>
          </div>

          <div className="form-group">
            <label htmlFor="priority">Priority *</label>
            <select
              id="priority"
              value={formData.priority}
              onChange={(e) => setFormData({ ...formData, priority: e.target.value as Priority })}
            >
              <option value="LOW">Low</option>
              <option value="MEDIUM">Medium</option>
              <option value="HIGH">High</option>
            </select>
          </div>

          <div style={{ display: 'flex', gap: '1rem' }}>
            <button
              type="submit"
              disabled={submitting || loading}
              className="btn btn-success"
              style={{ flex: 1 }}
            >
              {submitting ? 'Creating...' : '✅ Create Request'}
            </button>
            <button
              type="button"
              onClick={() => navigate('/customer')}
              className="btn btn-secondary"
              style={{ flex: 1 }}
            >
              Cancel
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}
