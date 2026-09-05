import { useState, useEffect } from 'react'
import { Routes, Route, useLocation } from 'react-router-dom'
import Layout from '../../components/Layout'
import Dashboard from './Dashboard'
import Reports from './Reports'

export default function ManagerDashboard() {
  const location = useLocation()
  const [currentPath, setCurrentPath] = useState(location.pathname)

  useEffect(() => {
    setCurrentPath(location.pathname)
  }, [location.pathname])

  const sidebarItems = [
    { label: 'Dashboard', path: '/manager', icon: '📊' },
    { label: 'Reports', path: '/manager/reports', icon: '📈' }
  ]

  const getTitle = () => {
    if (currentPath.includes('reports')) return 'Reports'
    return 'Dashboard'
  }

  return (
    <Layout title={getTitle()} sidebarItems={sidebarItems}>
      <Routes>
        <Route path="/" element={<Dashboard />} />
        <Route path="/reports" element={<Reports />} />
      </Routes>
    </Layout>
  )
}
