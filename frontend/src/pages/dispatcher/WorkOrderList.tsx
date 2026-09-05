import React from 'react';
import { useWorkOrders } from '../../context/WorkOrderContext';

export const WorkOrderList: React.FC = () => {
  const { orders, loading, updateStatus } = useWorkOrders();

  if (loading) {
    return <div className="p-4 text-slate-400">Loading work orders...</div>;
  }

  return (
    <div className="p-6 bg-slate-900 rounded-xl text-white">
      <h2 className="text-xl font-bold mb-4">Dispatcher Work Orders</h2>
      
      {orders.length === 0 ? (
        <p className="text-slate-400">No work orders available.</p>
      ) : (
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="border-b border-slate-700 text-slate-400 text-sm">
                <th className="p-3">Order ID</th>
                <th className="p-3">Title</th>
                <th className="p-3">Customer</th>
                <th className="p-3">Technician</th>
                <th className="p-3">Priority</th>
                <th className="p-3">Status</th>
                <th className="p-3">Actions</th>
              </tr>
            </thead>
            <tbody>
              {orders.map((order) => (
                <tr key={order.id} className="border-b border-slate-800 hover:bg-slate-800/50">
                  <td className="p-3 font-mono font-bold text-blue-400">{order.id}</td>
                  <td className="p-3 font-medium">{order.title}</td>
                  <td className="p-3 text-slate-300">{order.customer}</td>
                  <td className="p-3 text-slate-300">{order.technician}</td>
                  <td className="p-3">
                    <span className={`px-2 py-1 rounded text-xs font-bold ${
                      order.priority === 'HIGH' ? 'bg-red-500/20 text-red-400' :
                      order.priority === 'MEDIUM' ? 'bg-yellow-500/20 text-yellow-400' :
                      'bg-green-500/20 text-green-400'
                    }`}>
                      {order.priority}
                    </span>
                  </td>
                  <td className="p-3">
                    <span className={`px-2 py-1 rounded text-xs font-bold ${
                      order.status === 'COMPLETED' ? 'bg-emerald-500/20 text-emerald-400' :
                      order.status === 'IN_PROGRESS' ? 'bg-blue-500/20 text-blue-400' :
                      'bg-slate-700 text-slate-300'
                    }`}>
                      {order.status}
                    </span>
                  </td>
                  <td className="p-3">
                    <select
                      value={order.status}
                      onChange={(e) => updateStatus(order.id, e.target.value as any)}
                      className="bg-slate-800 border border-slate-700 text-xs rounded p-1 text-slate-200 cursor-pointer"
                    >
                      <option value="PENDING">PENDING</option>
                      <option value="IN_PROGRESS">IN_PROGRESS</option>
                      <option value="COMPLETED">COMPLETED</option>
                    </select>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
};

export default WorkOrderList;

