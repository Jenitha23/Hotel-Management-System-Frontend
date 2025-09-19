import { useAuth } from '../auth/AuthContext'
import { Navigate } from 'react-router-dom'

const RoleRoute = ({ children, roles }) => {
  const { user, accessToken, loading } = useAuth()

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-[50vh]">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-teal"></div>
      </div>
    )
  }

  if (!accessToken || !user || !roles.includes(user.role)) {
    return <Navigate to="/" replace />
  }

  return children
}

export default RoleRoute