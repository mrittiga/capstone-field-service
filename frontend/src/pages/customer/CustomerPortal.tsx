import { useState, useEffect } from 'react'
import { Routes, Route, useLocation } from 'react-router-dom'
import Layout from '../../components/Layout'
import RaiseRequest from './RaiseRequest'
import MyRequests from './MyRequests'

export default function CustomerPortal() {
  const location = useLocation()
  const [currentPath, setCurrentPath] = useState(location.pathname)

  useEffect(() => {
    setCurrentPath(location.pathname)
  }, [location.pathname])

  const sidebarItems = [
    { label: 'My Requests', path: '/customer', icon: '📝' },
    { label: 'Raise Request', path: '/customer/raise', icon: '➕' }
  ]

  const getTitle = () => {
    if (currentPath.includes('raise')) return 'Raise New Request'
    return 'My Work Order Requests'
  }

  return (
    <Layout title={getTitle()} sidebarItems={sidebarItems}>
      <Routes>
        <Route path="/" element={<MyRequests />} />
        <Route path="/raise" element={<RaiseRequest />} />
      </Routes>
    </Layout>
  )
}
