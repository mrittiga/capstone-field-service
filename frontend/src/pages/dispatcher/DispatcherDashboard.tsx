import { useState, useEffect } from 'react'
import { Routes, Route } from 'react-router-dom'
import Layout from '../../components/Layout'
import WorkOrderList from './WorkOrderList'
import WorkOrderBoard from './WorkOrderBoard'
import CustomerManagement from './CustomerManagement'

export default function DispatcherDashboard() {
  const sidebarItems = [
    { label: 'Work Orders', path: '/dispatcher', icon: '📋' },
    { label: 'Kanban Board', path: '/dispatcher/board', icon: '📊' },
    { label: 'Customers', path: '/dispatcher/customers', icon: '👥' }
  ]

  return (
    <Layout title="Dispatcher Dashboard" sidebarItems={sidebarItems}>
      <Routes>
        <Route path="/" element={<WorkOrderList />} />
        <Route path="/board" element={<WorkOrderBoard />} />
        <Route path="/customers" element={<CustomerManagement />} />
      </Routes>
    </Layout>
  )
}
