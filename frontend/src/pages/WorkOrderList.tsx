import { useEffect, useState } from 'react';
import { Navbar } from '../components/Navbar';
import { api } from '../services/api';
import { Link } from 'react-router-dom';

interface WorkOrder {
  id: number;
  title: string;
  description?: string;
  priority: string;
  status: string;
  siteName: string;
  customerName: string;
  assigneeName?: string;
  createdAt: string;
}

export const WorkOrderList = () => {
  const [workOrders, setWorkOrders] = useState<WorkOrder[]>([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState('ALL');

  useEffect(() => {
    fetchWorkOrders();
  }, [filter]);

  const fetchWorkOrders = async () => {
    try {
      setLoading(true);
      const data = await api.getWorkOrders();
      let filtered = data.content || [];
      
      if (filter !== 'ALL') {
        filtered = filtered.filter((wo: WorkOrder) => wo.status === filter);
      }
      
      setWorkOrders(filtered);
    } catch (error) {
      console.error('Failed to fetch work orders:', error);
    } finally {
      setLoading(false);
    }
  };

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'HIGH':
        return 'text-red-500';
      case 'MEDIUM':
        return 'text-yellow-500';
      case 'LOW':
        return 'text-green-500';
      default:
        return 'text-blue-500';
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'NEW':
        return 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200';
      case 'ASSIGNED':
        return 'bg-purple-100 text-purple-800 dark:bg-purple-900 dark:text-purple-200';
      case 'IN_PROGRESS':
        return 'bg-orange-100 text-orange-800 dark:bg-orange-900 dark:text-orange-200';
      case 'COMPLETED':
        return 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200';
      case 'CANCELLED':
        return 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200';
      default:
        return 'bg-gray-100 text-gray-800 dark:bg-gray-900 dark:text-gray-200';
    }
  };

  const statuses = ['ALL', 'NEW', 'ASSIGNED', 'IN_PROGRESS', 'COMPLETED', 'CANCELLED'];

  return (
    <div className="min-h-screen">
      <Navbar />

      <div className="p-8 max-w-7xl mx-auto">
        <h1 className="text-4xl font-bold mb-2 bg-gradient-to-r from-blue-500 to-cyan-500 bg-clip-text text-transparent">
          Work Orders
        </h1>
        <p className="text-slate-600 dark:text-slate-400 mb-8">
          Manage all field service work orders
        </p>

        {/* Filter Buttons */}
        <div className="glass-card p-6 mb-8">
          <div className="flex flex-wrap gap-2">
            {statuses.map((status) => (
              <button
                key={status}
                onClick={() => setFilter(status)}
                className={`px-4 py-2 rounded-lg font-medium transition-all ${
                  filter === status
                    ? 'bg-blue-500 text-white'
                    : 'glass-card hover:bg-white hover:bg-opacity-20'
                }`}
              >
                {status}
              </button>
            ))}
          </div>
        </div>

        {/* Work Orders Table */}
        {loading ? (
          <div className="glass-card p-12 text-center">
            <div className="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-blue-500"></div>
            <p className="mt-4 text-slate-600 dark:text-slate-400">Loading work orders...</p>
          </div>
        ) : workOrders.length > 0 ? (
          <div className="glass-card overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-white bg-opacity-5">
                  <tr>
                    <th className="px-6 py-3 text-left text-sm font-semibold">ID</th>
                    <th className="px-6 py-3 text-left text-sm font-semibold">Title</th>
                    <th className="px-6 py-3 text-left text-sm font-semibold">Priority</th>
                    <th className="px-6 py-3 text-left text-sm font-semibold">Status</th>
                    <th className="px-6 py-3 text-left text-sm font-semibold">Customer</th>
                    <th className="px-6 py-3 text-left text-sm font-semibold">Assignee</th>
                    <th className="px-6 py-3 text-left text-sm font-semibold">Action</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-white divide-opacity-10">
                  {workOrders.map((wo) => (
                    <tr key={wo.id} className="hover:bg-white hover:bg-opacity-5 transition-all">
                      <td className="px-6 py-4 text-sm font-medium">#{wo.id}</td>
                      <td className="px-6 py-4 text-sm">
                        <div className="font-medium">{wo.title}</div>
                        <div className="text-xs text-slate-500">{wo.siteName}</div>
                      </td>
                      <td className="px-6 py-4 text-sm">
                        <span className={`font-semibold ${getPriorityColor(wo.priority)}`}>
                          {wo.priority}
                        </span>
                      </td>
                      <td className="px-6 py-4 text-sm">
                        <span className={`px-3 py-1 rounded-full text-xs font-semibold ${getStatusColor(wo.status)}`}>
                          {wo.status}
                        </span>
                      </td>
                      <td className="px-6 py-4 text-sm">{wo.customerName}</td>
                      <td className="px-6 py-4 text-sm">{wo.assigneeName || '—'}</td>
                      <td className="px-6 py-4 text-sm">
                        <Link
                          to={`/work-orders/${wo.id}`}
                          className="text-blue-500 hover:text-blue-600 font-semibold"
                        >
                          View
                        </Link>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        ) : (
          <div className="glass-card p-12 text-center">
            <p className="text-slate-600 dark:text-slate-400">No work orders found</p>
          </div>
        )}
      </div>
    </div>
  );
};
