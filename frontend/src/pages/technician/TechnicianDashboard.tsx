import { Routes, Route } from 'react-router-dom'
import Layout from '../../components/Layout'
import AssignedJobs from './AssignedJobs'

export default function TechnicianDashboard() {
  const sidebarItems = [
    { label: 'My Jobs', path: '/technician', icon: '🔧' },
    { label: 'Calendar', path: '/technician/calendar', icon: '📅' }
  ]

  return (
    <Layout title="My Jobs" sidebarItems={sidebarItems}>
      <Routes>
        <Route path="/" element={<AssignedJobs />} />
      </Routes>
    </Layout>
  )
}
