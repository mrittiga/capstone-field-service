import { useAuthStore } from '../store/authStore';

const API_BASE = 'http://localhost:8080/api';

export const api = {
  // Customers
  getCustomers: async (page = 0, size = 10) => {
    const response = await fetch(`${API_BASE}/customers?page=${page}&size=${size}`, {
      headers: { 'Authorization': `Bearer ${useAuthStore.getState().token}` },
    });
    return response.json();
  },

  createCustomer: async (data: { name: string; contactEmail: string }) => {
    const response = await fetch(`${API_BASE}/customers`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${useAuthStore.getState().token}`,
      },
      body: JSON.stringify(data),
    });
    return response.json();
  },

  // Work Orders
  getWorkOrders: async (page = 0, size = 10) => {
    const response = await fetch(`${API_BASE}/work-orders?page=${page}&size=${size}`, {
      headers: { 'Authorization': `Bearer ${useAuthStore.getState().token}` },
    });
    return response.json();
  },

  getWorkOrderById: async (id: number) => {
    const response = await fetch(`${API_BASE}/work-orders/${id}`, {
      headers: { 'Authorization': `Bearer ${useAuthStore.getState().token}` },
    });
    return response.json();
  },

  transitionWorkOrder: async (id: number, data: { newStatus: string; note?: string; assigneeId?: number }) => {
    const response = await fetch(`${API_BASE}/work-orders/${id}/transition`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${useAuthStore.getState().token}`,
      },
      body: JSON.stringify(data),
    });
    return response.json();
  },

  getWorkOrderHistory: async (id: number) => {
    const response = await fetch(`${API_BASE}/work-orders/${id}/history`, {
      headers: { 'Authorization': `Bearer ${useAuthStore.getState().token}` },
    });
    return response.json();
  },

  // SLA
  getSLADashboard: async () => {
    const response = await fetch(`${API_BASE}/sla/dashboard`, {
      headers: { 'Authorization': `Bearer ${useAuthStore.getState().token}` },
    });
    return response.json();
  },
};
