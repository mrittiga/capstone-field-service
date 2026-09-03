import { useEffect, useState } from 'react';
import { Navbar } from '../components/Navbar';
import { api } from '../services/api';
import { Plus, Mail, Calendar } from 'lucide-react';

interface Customer {
  id: number;
  name: string;
  contactEmail: string;
  createdAt: string;
  updatedAt: string;
}

export const CustomerList = () => {
  const [customers, setCustomers] = useState<Customer[]>([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    contactEmail: '',
  });
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    fetchCustomers();
  }, []);

  const fetchCustomers = async () => {
    try {
      setLoading(true);
      const data = await api.getCustomers();
      setCustomers(data.content || []);
    } catch (error) {
      console.error('Failed to fetch customers:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      setSubmitting(true);
      await api.createCustomer(formData);
      setFormData({ name: '', contactEmail: '' });
      setShowForm(false);
      await fetchCustomers();
      alert('Customer created successfully!');
    } catch (error) {
      console.error('Failed to create customer:', error);
      alert('Failed to create customer');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen">
      <Navbar />

      <div className="p-8 max-w-6xl mx-auto">
        <div className="flex justify-between items-center mb-8">
          <div>
            <h1 className="text-4xl font-bold mb-2 bg-gradient-to-r from-blue-500 to-cyan-500 bg-clip-text text-transparent">
              Customers
            </h1>
            <p className="text-slate-600 dark:text-slate-400">
              Manage all your customers
            </p>
          </div>
          <button
            onClick={() => setShowForm(!showForm)}
            className="glass-button flex items-center gap-2"
          >
            <Plus size={20} /> New Customer
          </button>
        </div>

        {/* Create Form */}
        {showForm && (
          <div className="glass-card p-8 mb-8">
            <h2 className="text-xl font-bold mb-4">Create New Customer</h2>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block text-sm font-medium mb-2">Customer Name</label>
                <input
                  type="text"
                  className="glass-input"
                  placeholder="Enter customer name"
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  required
                  disabled={submitting}
                />
              </div>

              <div>
                <label className="block text-sm font-medium mb-2">Contact Email</label>
                <input
                  type="email"
                  className="glass-input"
                  placeholder="customer@example.com"
                  value={formData.contactEmail}
                  onChange={(e) => setFormData({ ...formData, contactEmail: e.target.value })}
                  required
                  disabled={submitting}
                />
              </div>

              <div className="flex gap-4">
                <button
                  type="submit"
                  className="glass-button"
                  disabled={submitting}
                >
                  {submitting ? 'Creating...' : 'Create Customer'}
                </button>
                <button
                  type="button"
                  onClick={() => setShowForm(false)}
                  className="glass-card px-6 py-2.5 rounded-lg hover:bg-white hover:bg-opacity-10 transition-all"
                >
                  Cancel
                </button>
              </div>
            </form>
          </div>
        )}

        {/* Customers Grid */}
        {loading ? (
          <div className="glass-card p-12 text-center">
            <div className="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-blue-500"></div>
            <p className="mt-4 text-slate-600 dark:text-slate-400">Loading customers...</p>
          </div>
        ) : customers.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {customers.map((customer) => (
              <div key={customer.id} className="glass-card p-6 hover:shadow-lg transition-all">
                <div className="flex justify-between items-start mb-4">
                  <h3 className="text-lg font-bold">{customer.name}</h3>
                  <span className="text-xl">🏢</span>
                </div>

                <div className="space-y-3">
                  <div className="flex items-center gap-2 text-slate-600 dark:text-slate-400">
                    <Mail size={16} />
                    <a href={`mailto:${customer.contactEmail}`} className="text-blue-500 hover:text-blue-600">
                      {customer.contactEmail}
                    </a>
                  </div>

                  <div className="flex items-center gap-2 text-slate-600 dark:text-slate-400 text-sm">
                    <Calendar size={16} />
                    <span>Created {new Date(customer.createdAt).toLocaleDateString()}</span>
                  </div>
                </div>

                <button className="w-full mt-4 glass-card px-4 py-2 rounded-lg hover:bg-white hover:bg-opacity-10 transition-all text-sm font-medium">
                  View Details
                </button>
              </div>
            ))}
          </div>
        ) : (
          <div className="glass-card p-12 text-center">
            <p className="text-slate-600 dark:text-slate-400 mb-4">No customers found</p>
            <button
              onClick={() => setShowForm(true)}
              className="glass-button"
            >
              Create First Customer
            </button>
          </div>
        )}
      </div>
    </div>
  );
};
