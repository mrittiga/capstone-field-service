import { useState, useEffect } from 'react'
import { Routes, Route, useLocation } from 'react-router-dom'
import Layout from '../../components/Layout'
import WorkOrderList from './WorkOrderList'
import WorkOrderBoard from './WorkOrderBoard'
import CustomerManagement from './CustomerManagement'

export default function DispatcherDashboard() {
  const location = useLocation()
  const [currentPath, setCurrentPath] = useState(location.pathname)

  useEffect(() => {
    setCurrentPath(location.pathname)
  }, [location.pathname])

  const sidebarItems = [
    { label: 'Work Orders', path: '/dispatcher', icon: '📋' },
    { label: 'Kanban Board', path: '/dispatcher/board', icon: '📊' },
    { label: 'Customers', path: '/dispatcher/customers', icon: '👥' }
  ]

  const getTitle = () => {
    if (currentPath.includes('board')) return 'Kanban Board'
    if (currentPath.includes('customers')) return 'Customers'
    return 'Work Orders'
  }

  return (
    <Layout title={getTitle()} sidebarItems={sidebarItems}>
      <Routes>
        <Route path="/" element={<WorkOrderList />} />
        <Route path="/board" element={<WorkOrderBoard />} />
        <Route path="/customers" element={<CustomerManagement />} />
      </Routes>
    </Layout>
  )
}
