import React from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';

import LoginPage from './pages/LoginPage';
import RegisterPage from './pages/RegisterPage';

import DispatcherDashboard from './pages/dispatcher/DispatcherDashboard';
import TechnicianDashboard from './pages/technician/TechnicianDashboard';
import ManagerDashboard from './pages/manager/ManagerDashboard';
import CustomerPortal from './pages/customer/CustomerPortal';

export default function App() {
  return (
    <Routes>
      <Route path="/" element={<Navigate to="/login" replace />} />
      <Route path="/login" element={<LoginPage />} />
      <Route path="/register" element={<RegisterPage />} />

      <Route path="/dispatcher/*" element={<DispatcherDashboard />} />
      <Route path="/technician/*" element={<TechnicianDashboard />} />
      <Route path="/manager/*" element={<ManagerDashboard />} />
      <Route path="/customer/*" element={<CustomerPortal />} />

      <Route path="*" element={<Navigate to="/login" replace />} />
    </Routes>
  );
}

