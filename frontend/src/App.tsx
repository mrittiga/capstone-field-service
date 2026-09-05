import React from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import LoginPage from './pages/LoginPage';
import RegisterPage from './pages/RegisterPage';
import Layout from './components/Layout';
import DispatcherDashboard from './pages/dispatcher/DispatcherDashboard';
import WorkOrderBoard from './pages/dispatcher/WorkOrderBoard';
import CustomerManagement from './pages/dispatcher/CustomerManagement';
import { WorkOrderProvider } from './context/WorkOrderContext';

const dispatcherItems = [
  { label: 'Work Orders', path: '/dispatcher' },
  { label: 'Kanban Board', path: '/dispatcher/kanban' },
  { label: 'Customers', path: '/dispatcher/customers' },
];

export default function App() {
  return (
    <WorkOrderProvider>
      <Routes>
        <Route path="/" element={<Navigate to="/login" replace />} />
        <Route path="/login" element={<LoginPage />} />
        <Route path="/register" element={<RegisterPage />} />

        {/* Dispatcher Nested Routes */}
        <Route path="/dispatcher" element={<Layout sidebarItems={dispatcherItems} />}>
          <Route index element={<DispatcherDashboard />} />
          <Route path="kanban" element={<WorkOrderBoard />} />
          <Route path="customers" element={<CustomerManagement />} />
        </Route>

        <Route path="*" element={<Navigate to="/login" replace />} />
      </Routes>
    </WorkOrderProvider>
  );
}

