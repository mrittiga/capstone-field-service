import { useEffect, useState } from 'react';
import { Navbar } from '../components/Navbar';
import { api } from '../services/api';
import { Plus, MapPin, Building2, Calendar } from 'lucide-react';

interface Site {
  id: number;
  name: string;
  address?: string;
  customerId: number;
  customerName: string;
  createdAt: string;
  updatedAt: string;
}

export const SiteList = () => {
  const [sites, setSites] = useState<Site[]>([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [formData, setFormData] = useState({
    customerId: '',
    name: '',
    address: '',
  });
  const [submitting, setSubmitting] = useState(false);
  const [customers, setCustomers] = useState<any[]>([]);

  useEffect(() => {
    fetchSites();
    fetchCustomers();
  }, []);

  const fetchSites = async () => {
    try {
      setLoading(true);
      const data = await api.getSites();
      setSites(data.content || []);
    } catch (error) {
      console.error('Failed to fetch sites:', error);
    } finally {
      setLoading(false);
    }
  };

  const fetchCustomers = async () => {
    try {
      const data = await api.getCustomers();
      setCustomers(data.content || []);
    } catch (error) {
      console.error('Failed to fetch customers:', error);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      setSubmitting(true);
      await api.createSite({
        customerId: Number(formData.customerId),
        name: formData.name,
        address: formData.address,
      });
      setFormData({ customerId: '', name: '', address: '' });
      setShowForm(false);
      await fetchSites();
      alert('Site created successfully!');
    } catch (error) {
      console.error('Failed to create site:', error);
      alert('Failed to create site');
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
              Sites
            </h1>
            <p className="text-slate-600 dark:text-slate-400">
              Manage all customer service sites
            </p>
          </div>
          <button
            onClick={() => setShowForm(!showForm)}
            className="glass-button flex items-center gap-2"
          >
            <Plus size={20} /> New Site
          </button>
        </div>

        {/* Create Form */}
        {showForm && (
          <div className="glass-card p-8 mb-8">
            <h2 className="text-xl font-bold mb-4">Create New Site</h2>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block text-sm font-medium mb-2">Customer</label>
                <select
                  className="glass-input"
                  value={formData.customerId}
                  onChange={(e) => setFormData({ ...formData, customerId: e.target.value })}
                  required
                  disabled={submitting}
                >
                  <option value="">Select a customer</option>
                  {customers.map((customer) => (
                    <option key={customer.id} value={customer.id}>
                      {customer.name}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium mb-2">Site Name</label>
                <input
                  type="text"
                  className="glass-input"
                  placeholder="Enter site name"
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  required
                  disabled={submitting}
                />
              </div>

              <div>
                <label className="block text-sm font-medium mb-2">Address</label>
                <input
                  type="text"
                  className="glass-input"
                  placeholder="Enter site address"
                  value={formData.address}
                  onChange={(e) => setFormData({ ...formData, address: e.target.value })}
                  disabled={submitting}
                />
              </div>

              <div className="flex gap-4">
                <button
                  type="submit"
                  className="glass-button"
                  disabled={submitting}
                >
                  {submitting ? 'Creating...' : 'Create Site'}
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

        {/* Sites Grid */}
        {loading ? (
          <div className="glass-card p-12 text-center">
            <div className="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-blue-500"></div>
            <p className="mt-4 text-slate-600 dark:text-slate-400">Loading sites...</p>
          </div>
        ) : sites.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {sites.map((site) => (
              <div key={site.id} className="glass-card p-6 hover:shadow-lg transition-all">
                <div className="flex justify-between items-start mb-4">
                  <h3 className="text-lg font-bold">{site.name}</h3>
                  <span className="text-xl">📍</span>
                </div>

                <div className="space-y-3">
                  <div className="flex items-center gap-2 text-slate-600 dark:text-slate-400">
                    <Building2 size={16} />
                    <span className="text-sm">{site.customerName}</span>
                  </div>

                  {site.address && (
                    <div className="flex items-start gap-2 text-slate-600 dark:text-slate-400">
                      <MapPin size={16} className="mt-0.5 flex-shrink-0" />
                      <span className="text-sm">{site.address}</span>
                    </div>
                  )}

                  <div className="flex items-center gap-2 text-slate-600 dark:text-slate-400 text-sm">
                    <Calendar size={16} />
                    <span>Created {new Date(site.createdAt).toLocaleDateString()}</span>
                  </div>
                </div>

                <button className="w-full mt-4 glass-card px-4 py-2 rounded-lg hover:bg-white hover:bg-opacity-10 transition-all text-sm font-medium">
                  View Work Orders
                </button>
              </div>
            ))}
          </div>
        ) : (
          <div className="glass-card p-12 text-center">
            <p className="text-slate-600 dark:text-slate-400 mb-4">No sites found</p>
            <button
              onClick={() => setShowForm(true)}
              className="glass-button"
            >
              Create First Site
            </button>
          </div>
        )}
      </div>
    </div>
  );
};
