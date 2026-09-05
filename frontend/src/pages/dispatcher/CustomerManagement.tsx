import React, { useState, useEffect } from 'react';
import { fetchWithAuth } from '../../services/api';

interface Customer {
  id: string;
  name: string;
  contactEmail: string;
  phone: string;
}

const fallbackCustomers: Customer[] = [
  { id: 'CUST-01', name: 'Acme Corp', contactEmail: 'contact@acme.com', phone: '+1 555-0192' },
  { id: 'CUST-02', name: 'Global Tech', contactEmail: 'info@globaltech.com', phone: '+1 555-0143' },
  { id: 'CUST-03', name: 'Nexus Ltd', contactEmail: 'support@nexus.com', phone: '+1 555-0188' },
];

export default function CustomerManagement() {
  const [customers, setCustomers] = useState<Customer[]>(fallbackCustomers);
  const [loading, setLoading] = useState(false);
  const [showForm, setShowForm] = useState(false);
  const [formData, setFormData] = useState({ name: '', contactEmail: '', phone: '' });

  useEffect(() => {
    const fetchCustomers = async () => {
      setLoading(true);
      const data = await fetchWithAuth('/customers?size=50');
      if (data && data.content && Array.isArray(data.content)) {
        setCustomers(data.content);
      }
      setLoading(false);
    };

    fetchCustomers();
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const newCustomer: Customer = {
      id: `CUST-0${customers.length + 1}`,
      ...formData,
    };

    setCustomers((prev) => [...prev, newCustomer]);
    setFormData({ name: '', contactEmail: '', phone: '' });
    setShowForm(false);

    await fetchWithAuth('/customers', {
      method: 'POST',
      body: JSON.stringify(formData),
    });
  };

  return (
    <div>
      <div style={{ marginBottom: '20px' }}>
        <button
          onClick={() => setShowForm(!showForm)}
          style={{ padding: '10px 18px', backgroundColor: '#0284c7', color: '#fff', border: 'none', borderRadius: '6px', cursor: 'pointer', fontWeight: 'bold' }}
        >
          {showForm ? 'Cancel' : '➕ New Customer'}
        </button>
      </div>

      {showForm && (
        <div style={{ backgroundColor: '#1e293b', padding: '24px', borderRadius: '12px', marginBottom: '24px', border: '1px solid #334155' }}>
          <h3 style={{ margin: '0 0 16px 0' }}>Create New Customer</h3>
          <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
            <div>
              <label style={{ display: 'block', fontSize: '12px', marginBottom: '4px', color: '#94a3b8' }}>Name</label>
              <input
                type="text"
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                required
                style={{ width: '100%', padding: '8px', borderRadius: '6px', backgroundColor: '#0f172a', border: '1px solid #334155', color: '#fff' }}
              />
            </div>
            <div>
              <label style={{ display: 'block', fontSize: '12px', marginBottom: '4px', color: '#94a3b8' }}>Email</label>
              <input
                type="email"
                value={formData.contactEmail}
                onChange={(e) => setFormData({ ...formData, contactEmail: e.target.value })}
                required
                style={{ width: '100%', padding: '8px', borderRadius: '6px', backgroundColor: '#0f172a', border: '1px solid #334155', color: '#fff' }}
              />
            </div>
            <div>
              <label style={{ display: 'block', fontSize: '12px', marginBottom: '4px', color: '#94a3b8' }}>Phone</label>
              <input
                type="tel"
                value={formData.phone}
                onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                required
                style={{ width: '100%', padding: '8px', borderRadius: '6px', backgroundColor: '#0f172a', border: '1px solid #334155', color: '#fff' }}
              />
            </div>
            <button type="submit" style={{ padding: '10px', backgroundColor: '#16a34a', color: '#fff', border: 'none', borderRadius: '6px', fontWeight: 'bold', cursor: 'pointer', marginTop: '8px' }}>
              Create Customer
            </button>
          </form>
        </div>
      )}

      {loading ? (
        <p style={{ color: '#94a3b8' }}>Loading customers...</p>
      ) : (
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))', gap: '16px' }}>
          {customers.map((c) => (
            <div key={c.id} style={{ backgroundColor: '#1e293b', padding: '16px', borderRadius: '12px', border: '1px solid #334155' }}>
              <h4 style={{ margin: '0 0 8px 0', fontSize: '16px', color: '#38bdf8' }}>{c.name}</h4>
              <p style={{ margin: '4px 0', fontSize: '13px', color: '#cbd5e1' }}>✉️ {c.contactEmail}</p>
              <p style={{ margin: '4px 0', fontSize: '13px', color: '#cbd5e1' }}>📞 {c.phone}</p>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

