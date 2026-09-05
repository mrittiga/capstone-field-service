import { Navigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'
import { UserRole } from '../types/index'

interface ProtectedRouteProps {
  children: React.ReactNode
  requiredRole: UserRole
}

export default function ProtectedRoute({ children, requiredRole }: ProtectedRouteProps) {
  const { user, loading } = useAuth()

  if (loading) {
    return (
      <div className="flex items-center justify-center h-screen">
        <div className="spinner"></div>
      </div>
    )
  }

  if (!user) {
    return <Navigate to="/login" />
  }

  if (user.role !== requiredRole) {
    return <Navigate to="/login" />
  }

  return <>{children}</>
}
