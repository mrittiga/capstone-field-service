import { useEffect, useState } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { Navbar } from '../components/Navbar';
import { api } from '../services/api';
import { ArrowLeft, Clock, AlertCircle, CheckCircle } from 'lucide-react';

interface WorkOrder {
  id: number;
  title: string;
  description?: string;
  priority: string;
  status: string;
  siteName: string;
  customerName: string;
  assigneeName?: string;
  slaDueDate?: string;
  createdAt: string;
  updatedAt: string;
  completedAt?: string;
}

interface StatusHistory {
  id: number;
  fromStatus: string;
  toStatus: string;
  changedByName: string;
  changedAt: string;
  note?: string;
}

export const WorkOrderDetail = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [workOrder, setWorkOrder] = useState<WorkOrder | null>(null);
  const [history, setHistory] = useState<StatusHistory[]>([]);
  const [loading, setLoading] = useState(true);
  const [newStatus, setNewStatus] = useState('');
  const [note, setNote] = useState('');
  const [transitioning, setTransitioning] = useState(false);

  useEffect(() => {
    fetchWorkOrder();
  }, [id]);

  const fetchWorkOrder = async () => {
    try {
      setLoading(true);
      const woData = await api.getWorkOrderById(Number(id));
      setWorkOrder(woData);
      setNewStatus(woData.status);

      const historyData = await api.getWorkOrderHistory(Number(id));
      setHistory(historyData || []);
    } catch (error) {
      console.error('Failed to fetch work order:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleTransition = async () => {
    if (!newStatus || newStatus === workOrder?.status) {
      alert('Please select a different status');
      return;
    }

    try {
      setTransitioning(true);
      await api.transitionWorkOrder(Number(id), {
        newStatus,
        note,
      });
      
      setNote('');
      await fetchWorkOrder();
      alert('Status updated successfully!');
    } catch (error) {
      console.error('Failed to transition status:', error);
      alert('Failed to update status. Check the state machine rules.');
    } finally {
      setTransitioning(false);
    }
  };

  const getValidTransitions = (status: string): string[] => {
    const transitions: { [key: string]: string[] } = {
      NEW: ['ASSIGNED', 'CANCELLED'],
      ASSIGNED: ['IN_PROGRESS', 'ON_HOLD', 'CANCELLED'],
      IN_PROGRESS: ['ON_HOLD', 'COMPLETED', 'CANCELLED'],
      ON_HOLD: ['IN_PROGRESS', 'ASSIGNED', 'CANCELLED'],
      COMPLETED: ['CLOSED'],
      CLOSED: [],
      CANCELLED: [],
    };
    return transitions[status] || [];
  };

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'HIGH':
        return 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200';
      case 'MEDIUM':
        return 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200';
      case 'LOW':
        return 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200';
      default:
        return 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200';
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

  if (loading) {
    return (
      <div className="min-h-screen">
        <Navbar />
        <div className="p-8 max-w-4xl mx-auto">
          <div className="glass-card p-12 text-center">
            <div className="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-blue-500"></div>
            <p className="mt-4 text-slate-600 dark:text-slate-400">Loading work order...</p>
          </div>
        </div>
      </div>
    );
  }

  if (!workOrder) {
    return (
      <div className="min-h-screen">
        <Navbar />
        <div className="p-8 max-w-4xl mx-auto">
          <div className="glass-card p-12 text-center">
            <p className="text-red-500">Work order not found</p>
          </div>
        </div>
      </div>
    );
  }

  const validTransitions = getValidTransitions(workOrder.status);

  return (
    <div className="min-h-screen">
      <Navbar />

      <div className="p-8 max-w-4xl mx-auto">
        {/* Back Button */}
        <button
          onClick={() => navigate('/work-orders')}
          className="flex items-center gap-2 text-blue-500 hover:text-blue-600 mb-6 font-semibold"
        >
          <ArrowLeft size={20} /> Back to Work Orders
        </button>

        {/* Header */}
        <div className="glass-card p-8 mb-8">
          <div className="flex justify-between items-start mb-4">
            <div>
              <h1 className="text-3xl font-bold mb-2">{workOrder.title}</h1>
              <p className="text-slate-600 dark:text-slate-400">Work Order #{workOrder.id}</p>
            </div>
            <span className={`px-4 py-2 rounded-full font-semibold text-sm ${getStatusColor(workOrder.status)}`}>
              {workOrder.status}
            </span>
          </div>

          <p className="text-slate-700 dark:text-slate-300 mb-6">{workOrder.description}</p>

          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <div>
              <p className="text-sm text-slate-600 dark:text-slate-400">Priority</p>
              <p className={`font-semibold mt-1 px-3 py-1 rounded inline-block text-sm ${getPriorityColor(workOrder.priority)}`}>
                {workOrder.priority}
              </p>
            </div>
            <div>
              <p className="text-sm text-slate-600 dark:text-slate-400">Customer</p>
              <p className="font-semibold mt-1">{workOrder.customerName}</p>
            </div>
            <div>
              <p className="text-sm text-slate-600 dark:text-slate-400">Site</p>
              <p className="font-semibold mt-1">{workOrder.siteName}</p>
            </div>
            <div>
              <p className="text-sm text-slate-600 dark:text-slate-400">Assignee</p>
              <p className="font-semibold mt-1">{workOrder.assigneeName || '—'}</p>
            </div>
          </div>
        </div>

        {/* Status Transition */}
        {validTransitions.length > 0 && (
          <div className="glass-card p-8 mb-8">
            <h2 className="text-xl font-bold mb-4">Update Status</h2>

            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium mb-2">New Status</label>
                <select
                  value={newStatus}
                  onChange={(e) => setNewStatus(e.target.value)}
                  className="glass-input"
                  disabled={transitioning}
                >
                  <option value={workOrder.status}>{workOrder.status} (Current)</option>
                  {validTransitions.map((status) => (
                    <option key={status} value={status}>
                      {status}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium mb-2">Notes (Optional)</label>
                <textarea
                  value={note}
                  onChange={(e) => setNote(e.target.value)}
                  className="glass-input"
                  placeholder="Add any notes about this status change..."
                  rows={3}
                  disabled={transitioning}
                />
              </div>

              <button
                onClick={handleTransition}
                disabled={transitioning || newStatus === workOrder.status}
                className="glass-button w-full disabled:opacity-50"
              >
                {transitioning ? 'Updating...' : 'Update Status'}
              </button>
            </div>
          </div>
        )}

        {/* SLA Info */}
        {workOrder.slaDueDate && (
          <div className="glass-card p-8 mb-8 border border-blue-500 border-opacity-30">
            <div className="flex items-center gap-3 mb-2">
              <Clock className="text-blue-500" size={20} />
              <h3 className="text-lg font-bold">SLA Due Date</h3>
            </div>
            <p className="text-slate-700 dark:text-slate-300">
              {new Date(workOrder.slaDueDate).toLocaleString()}
            </p>
          </div>
        )}

        {/* Status History */}
        {history.length > 0 && (
          <div className="glass-card p-8">
            <h2 className="text-xl font-bold mb-6">Status History</h2>

            <div className="space-y-4">
              {history.map((item, index) => (
                <div key={item.id} className="flex gap-4">
                  <div className="flex flex-col items-center">
                    <div className="w-3 h-3 rounded-full bg-blue-500 mt-1.5"></div>
                    {index < history.length - 1 && <div className="w-0.5 h-12 bg-slate-300 dark:bg-slate-600 my-1"></div>}
                  </div>

                  <div className="pb-4">
                    <div className="flex gap-2 items-center mb-1">
                      <span className={`px-2 py-1 rounded text-xs font-semibold ${getStatusColor(item.fromStatus)}`}>
                        {item.fromStatus}
                      </span>
                      <span className="text-slate-500">→</span>
                      <span className={`px-2 py-1 rounded text-xs font-semibold ${getStatusColor(item.toStatus)}`}>
                        {item.toStatus}
                      </span>
                    </div>
                    <p className="text-sm text-slate-600 dark:text-slate-400">
                      by {item.changedByName}
                    </p>
                    <p className="text-xs text-slate-500 mt-1">
                      {new Date(item.changedAt).toLocaleString()}
                    </p>
                    {item.note && (
                      <p className="text-sm mt-2 p-2 bg-white bg-opacity-5 rounded italic">
                        "{item.note}"
                      </p>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
