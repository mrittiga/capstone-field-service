import { Routes, Route } from 'react-router-dom'
import Layout from '../../components/Layout'
import Dashboard from './Dashboard'
import Reports from './Reports'

export default function ManagerDashboard() {
  const sidebarItems = [
    { label: 'Dashboard', path: '/manager', icon: '📊' },
    { label: 'Reports', path: '/manager/reports', icon: '📈' }
  ]

  return (
    <Layout title="Manager Dashboard" sidebarItems={sidebarItems}>
      <Routes>
        <Route path="/" element={<Dashboard />} />
        <Route path="/reports" element={<Reports />} />
      </Routes>
    </Layout>
  )
}
