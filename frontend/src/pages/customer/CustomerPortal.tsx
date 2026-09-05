import { Routes, Route } from 'react-router-dom'
import Layout from '../../components/Layout'
import MyRequests from './MyRequests'
import RaiseRequest from './RaiseRequest'

export default function CustomerPortal() {
  const sidebarItems = [
    { label: 'My Requests', path: '/customer', icon: '📝' },
    { label: 'Raise Request', path: '/customer/raise', icon: '➕' }
  ]

  return (
    <Layout title="Customer Portal" sidebarItems={sidebarItems}>
      <Routes>
        <Route path="/" element={<MyRequests />} />
        <Route path="/raise" element={<RaiseRequest />} />
      </Routes>
    </Layout>
  )
}
