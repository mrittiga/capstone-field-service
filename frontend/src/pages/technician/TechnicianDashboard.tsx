import { useState, useEffect } from 'react'
import { Routes, Route, useLocation } from 'react-router-dom'
import Layout from '../../components/Layout'
import AssignedJobs from './AssignedJobs'
import JobDetail from './JobDetail'

export default function TechnicianDashboard() {
  const location = useLocation()
  const [currentPath, setCurrentPath] = useState(location.pathname)

  useEffect(() => {
    setCurrentPath(location.pathname)
  }, [location.pathname])

  const sidebarItems = [
    { label: 'My Jobs', path: '/technician', icon: '🔧' },
    { label: 'Calendar', path: '/technician/calendar', icon: '📅' }
  ]

  const getTitle = () => {
    if (currentPath.includes('calendar')) return 'Calendar'
    return 'Assigned Jobs'
  }

  return (
    <Layout title={getTitle()} sidebarItems={sidebarItems}>
      <Routes>
        <Route path="/" element={<AssignedJobs />} />
        <Route path="/:id" element={<JobDetail />} />
      </Routes>
    </Layout>
  )
}
