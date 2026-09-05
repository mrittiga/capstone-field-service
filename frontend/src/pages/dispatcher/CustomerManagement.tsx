import { useState, useEffect } from 'react'
import { Customer } from '../../types/index'

export default function CustomerManagement() {
  const [customers, setCustomers] = useState<Customer[]>([])
  const [loading, setLoading] = useState(true)
  const [showForm, setShowForm] = useState(false)
  const [formData, setFormData] = useState({
    name: '',
    contactEmail: '',
    phone: ''
  })

  useEffect(() => {
    fetchCustomers()
  }, [])

  const fetchCustomers = async () => {
    setLoading(true)
    try {
      const response = await fetch('/api/customers?size=50', {
        headers: { 'Authorization': `Bearer ${localStorage.getItem('token')}` }
      })
      const data = await response.json()
      setCustomers(data.content || [])
    } catch (error) {
      console.error('Failed to fetch customers', error)
    } finally {
      setLoading(false)
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    try {
      const response = await fetch('/api/customers', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        },
        body: JSON.stringify(formData)
      })
      
      if (response.ok) {
        setFormData({ name: '', contactEmail: '', phone: '' })
        setShowForm(false)
        fetchCustomers()
      }
    } catch (error) {
      console.error('Failed to create customer', error)
    }
  }

  return (
    <div>
      {/* Create Button */}
      <div style={{ marginBottom: '2rem' }}>
        <button 
          onClick={() => setShowForm(!showForm)}
          className="btn btn-primary"
        >
          {showForm ? 'Cancel' : '➕ New Customer'}
        </button>
      </div>

      {/* Create Form */}
      {showForm && (
        <div className="glass" style={{
          padding: '2rem',
          marginBottom: '2rem',
          borderRadius: '1rem'
        }}>
          <h3 style={{ marginBottom: '1.5rem' }}>Create New Customer</h3>
          <form onSubmit={handleSubmit}>
            <div className="form-group">
              <label>Name</label>
              <input
                type="text"
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                required
              />
            </div>
            <div className="form-group">
              <label>Email</label>
              <input
                type="email"
                value={formData.contactEmail}
                onChange={(e) => setFormData({ ...formData, contactEmail: e.target.value })}
                required
              />
            </div>
            <div className="form-group">
              <label>Phone</label>
              <input
                type="tel"
                value={formData.phone}
                onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                required
              />
            </div>
            <button type="submit" className="btn btn-success">
              Create Customer
            </button>
          </form>
        </div>
      )}

      {/* Customers List */}
      {loading ? (
        <div style={{ textAlign: 'center', padding: '2rem' }}>
          <div className="spinner"></div>
        </div>
      ) : (
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))',
          gap: '1.5rem'
        }}>
          {customers.length === 0 ? (
            <div className="glass" style={{
              padding: '3rem',
              textAlign: 'center',
              gridColumn: '1 / -1'
            }}>
              <p style={{ color: 'var(--text-secondary)' }}>No customers yet</p>
            </div>
          ) : (
            customers.map(customer => (
              <div key={customer.id} className="glass" style={{
                padding: '1.5rem',
                borderRadius: '1rem'
              }}>
                <h4 style={{ marginBottom: '0.5rem' }}>{customer.name}</h4>
                <p style={{ margin: '0.25rem 0', fontSize: '0.875rem' }}>
                  ✉️ {customer.contactEmail}
                </p>
                <p style={{ margin: '0.25rem 0', fontSize: '0.875rem' }}>
                  📞 {customer.phone}
                </p>
                <div style={{
                  display: 'flex',
                  gap: '0.5rem',
                  marginTop: '1rem',
                  paddingTop: '1rem',
                  borderTop: '1px solid var(--border-color)'
                }}>
                  <button className="btn btn-primary btn-sm" style={{ flex: 1 }}>
                    View
                  </button>
                  <button className="btn btn-secondary btn-sm" style={{ flex: 1 }}>
                    Edit
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
