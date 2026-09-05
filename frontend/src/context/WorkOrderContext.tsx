import React, { createContext, useContext, useState, ReactNode } from 'react';

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
}

const WorkOrderContext = createContext<WorkOrderContextType | undefined>(undefined);

export const WorkOrderProvider = ({ children }: { children: ReactNode }) => {
  const [orders, setOrders] = useState<WorkOrder[]>(initialOrders);

  const addOrder = (newOrder: WorkOrder) => setOrders(prev => [...prev, newOrder]);
  const updateStatus = (id: string, status: WorkOrder['status']) => {
    setOrders(prev => prev.map(o => o.id === id ? { ...o, status } : o));
  };

  return (
    <WorkOrderContext.Provider value={{ orders, addOrder, updateStatus }}>
      {children}
    </WorkOrderContext.Provider>
  );
};

export const useWorkOrders = () => {
  const context = useContext(WorkOrderContext);
  if (!context) throw new Error('useWorkOrders must be used within WorkOrderProvider');
  return context;
};

