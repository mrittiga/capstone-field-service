import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { fetchWithAuth } from '../services/api';

export interface WorkOrder {
  id: string;
  title: string;
  status: 'PENDING' | 'IN_PROGRESS' | 'COMPLETED';
  customer: string;
  technician: string;
  priority: 'HIGH' | 'MEDIUM' | 'LOW';
}

const initialOrders: WorkOrder[] = [
  { id: 'WO-101', title: 'HVAC Maintenance', status: 'IN_PROGRESS', customer: 'Acme Corp', technician: 'John Doe', priority: 'HIGH' },
  { id: 'WO-102', title: 'Electrical Panel Repair', status: 'PENDING', customer: 'Global Tech', technician: 'Unassigned', priority: 'MEDIUM' },
  { id: 'WO-103', title: 'Plumbing System Inspection', status: 'COMPLETED', customer: 'Nexus Ltd', technician: 'Jane Smith', priority: 'LOW' }
];

interface WorkOrderContextType {
  orders: WorkOrder[];
  addOrder: (order: WorkOrder) => void;
  updateStatus: (id: string, status: WorkOrder['status']) => void;
  loading: boolean;
}

const WorkOrderContext = createContext<WorkOrderContextType | undefined>(undefined);

export const WorkOrderProvider = ({ children }: { children: ReactNode }) => {
  const [orders, setOrders] = useState<WorkOrder[]>(initialOrders);
  const [loading, setLoading] = useState<boolean>(false);

  useEffect(() => {
    const loadBackendOrders = async () => {
      setLoading(true);
      const data = await fetchWithAuth('/work-orders');
      if (data && Array.isArray(data) && data.length > 0) {
        setOrders(data);
      }
      setLoading(false);
    };

    loadBackendOrders();
  }, []);

  const addOrder = async (newOrder: WorkOrder) => {
    setOrders(prev => [...prev, newOrder]);
    await fetchWithAuth('/work-orders', {
      method: 'POST',
      body: JSON.stringify(newOrder),
    });
  };

  const updateStatus = async (id: string, status: WorkOrder['status']) => {
    setOrders(prev => prev.map(o => o.id === id ? { ...o, status } : o));
    await fetchWithAuth(`/work-orders/${id}`, {
      method: 'PUT',
      body: JSON.stringify({ status }),
    });
  };

  return (
    <WorkOrderContext.Provider value={{ orders, addOrder, updateStatus, loading }}>
      {children}
    </WorkOrderContext.Provider>
  );
};

export const useWorkOrders = () => {
  const context = useContext(WorkOrderContext);
  if (!context) throw new Error('useWorkOrders must be used within WorkOrderProvider');
  return context;
};

