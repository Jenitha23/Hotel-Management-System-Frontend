import { useState, useEffect } from 'react'
import { useAuth } from '../auth/AuthContext'
import apiClient from '../api/http'

const AdminDashboard = () => {
  const { user } = useAuth()
  const [adminMessage, setAdminMessage] = useState('')
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')

  useEffect(() => {
    const fetchAdminData = async () => {
      try {
        const response = await apiClient.get('/api/user/admin')
        setAdminMessage(response.data || 'Admin access confirmed')
      } catch (error) {
        setError(error.response?.data?.message || error.response?.data || 'Failed to fetch admin data')
      } finally {
        setLoading(false)
      }
    }

    fetchAdminData()
  }, [])

  if (loading) {
    return (
      <div className="max-w-4xl mx-auto">
        <div className="flex justify-center items-center min-h-[50vh]">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-teal"></div>
        </div>
      </div>
    )
  }

  return (
    <div className="max-w-4xl mx-auto">
      <div className="bg-white rounded-2xl shadow-2xl p-8">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-deepNavy mb-2">Admin Dashboard</h1>
          <p className="text-gray-600">Welcome to the administrative control panel</p>
        </div>

        {/* Admin Info */}
        <div className="bg-gradient-to-r from-sand to-teal rounded-xl p-6 mb-8">
          <h3 className="text-lg font-semibold text-deepNavy mb-4">Administrator Information</h3>
          <div className="space-y-2">
            <div className="flex justify-between">
              <span className="text-deepNavy font-medium">Logged in as:</span>
              <span className="text-deepNavy">{user?.email}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-deepNavy font-medium">Role:</span>
              <span className="text-deepNavy font-bold">{user?.role}</span>
            </div>
          </div>
        </div>

        {/* Admin Access Verification */}
        {error ? (
          <div className="bg-red-50 border border-red-200 rounded-xl p-6 mb-8">
            <div className="text-center">
              <div className="text-6xl mb-4">❌</div>
              <h3 className="text-xl font-semibold text-red-800 mb-2">Access Error</h3>
              <p className="text-red-700">{error}</p>
            </div>
          </div>
        ) : (
          <div className="bg-green-50 border border-green-200 rounded-xl p-6 mb-8">
            <div className="text-center">
              <div className="text-6xl mb-4">✅</div>
              <h3 className="text-xl font-semibold text-green-800 mb-2">Admin Access Confirmed</h3>
              <p className="text-green-700">{adminMessage}</p>
            </div>
          </div>
        )}

        {/* Dashboard Features */}
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          <div className="bg-teal-50 border border-teal-200 rounded-xl p-6 text-center">
            <div className="text-4xl mb-4">👥</div>
            <h4 className="text-lg font-semibold text-deepNavy mb-2">User Management</h4>
            <p className="text-gray-600 text-sm">Manage user accounts and permissions</p>
          </div>
          
          <div className="bg-coral-50 border border-coral-200 rounded-xl p-6 text-center">
            <div className="text-4xl mb-4">📊</div>
            <h4 className="text-lg font-semibold text-deepNavy mb-2">Analytics</h4>
            <p className="text-gray-600 text-sm">View system analytics and reports</p>
          </div>
          
          <div className="bg-purple-50 border border-purple-200 rounded-xl p-6 text-center">
            <div className="text-4xl mb-4">⚙️</div>
            <h4 className="text-lg font-semibold text-deepNavy mb-2">System Settings</h4>
            <p className="text-gray-600 text-sm">Configure system preferences</p>
          </div>
          
          <div className="bg-yellow-50 border border-yellow-200 rounded-xl p-6 text-center">
            <div className="text-4xl mb-4">🏨</div>
            <h4 className="text-lg font-semibold text-deepNavy mb-2">Resort Management</h4>
            <p className="text-gray-600 text-sm">Manage resort facilities and services</p>
          </div>
          
          <div className="bg-blue-50 border border-blue-200 rounded-xl p-6 text-center">
            <div className="text-4xl mb-4">📅</div>
            <h4 className="text-lg font-semibold text-deepNavy mb-2">Bookings</h4>
            <p className="text-gray-600 text-sm">Oversee all resort bookings</p>
          </div>
          
          <div className="bg-pink-50 border border-pink-200 rounded-xl p-6 text-center">
            <div className="text-4xl mb-4">💰</div>
            <h4 className="text-lg font-semibold text-deepNavy mb-2">Financial Reports</h4>
            <p className="text-gray-600 text-sm">Access financial data and reports</p>
          </div>
        </div>

        {/* Note */}
        <div className="mt-8 bg-blue-50 border border-blue-200 rounded-xl p-4">
          <p className="text-blue-800 text-sm">
            <strong>Note:</strong> This dashboard displays your admin access status. 
            Additional management features would be implemented based on specific requirements.
          </p>
        </div>
      </div>
    </div>
  )
}

export default AdminDashboard