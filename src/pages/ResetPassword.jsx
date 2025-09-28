import { useState, useEffect } from 'react'
import { useSearchParams, Link, useNavigate } from 'react-router-dom'
import apiClient from '../api/http'

const ResetPassword = () => {
  const [searchParams] = useSearchParams()
  const navigate = useNavigate()
  const [newPassword, setNewPassword] = useState('')
  const [confirmPassword, setConfirmPassword] = useState('')
  const [loading, setLoading] = useState(false)
  const [message, setMessage] = useState('')
  const [messageType, setMessageType] = useState('') // 'success' or 'error'
  
  const token = searchParams.get('token')

  useEffect(() => {
    if (!token) {
      setMessage('Reset token is missing')
      setMessageType('error')
    }
  }, [token])

  const handleSubmit = async (e) => {
    e.preventDefault()
    
    if (newPassword !== confirmPassword) {
      setMessage('Passwords do not match')
      setMessageType('error')
      return
    }

    setLoading(true)
    setMessage('')

    try {
      const response = await apiClient.post('/api/auth/reset-password', {
        token,
        newPassword
      })
      setMessage(response.data || 'Password reset successful!')
      setMessageType('success')
      

      setTimeout(() => {
        navigate('/login', { 
          state: { message: 'Password reset successful! Please sign in with your new password.' }
        })
      }, 2000)
      
    } catch (error) {
      setMessage(error.response?.data?.message || error.response?.data || 'Failed to reset password')
      setMessageType('error')
    }
    
    setLoading(false)
  }

  if (!token) {
    return (
      <div className="min-h-[80vh] flex items-center justify-center">
        <div className="bg-white rounded-2xl shadow-2xl p-8 w-full max-w-md text-center">
          <div className="text-6xl mb-6">❌</div>
          <h2 className="text-2xl font-bold text-deepNavy mb-4">Invalid Reset Link</h2>
          <p className="text-gray-600 mb-6">This password reset link is invalid or has expired.</p>
          <Link 
            to="/forgot-password"
            className="bg-teal text-white px-6 py-3 rounded-xl hover:bg-teal-600 transition-colors font-semibold shadow-lg inline-block"
          >
            Request New Reset Link
          </Link>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-[80vh] flex items-center justify-center">
      <div className="bg-white rounded-2xl shadow-2xl p-8 w-full max-w-md">
        <div className="text-center mb-8">
          <h2 className="text-3xl font-bold text-deepNavy mb-2">Reset Your Password</h2>
          <p className="text-gray-600">Enter your new password</p>
        </div>

        {message && (
          <div className={`p-4 rounded-xl mb-6 ${
            messageType === 'success' 
              ? 'bg-green-50 text-green-800 border border-green-200' 
              : 'bg-red-50 text-red-800 border border-red-200'
          }`}>
            {message}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <label htmlFor="newPassword" className="block text-sm font-medium text-deepNavy mb-2">
              New Password
            </label>
            <input
              type="password"
              id="newPassword"
              value={newPassword}
              onChange={(e) => setNewPassword(e.target.value)}
              className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-teal focus:border-transparent transition-colors"
              placeholder="••••••••"
              required
              minLength="6"
            />
          </div>

          <div>
            <label htmlFor="confirmPassword" className="block text-sm font-medium text-deepNavy mb-2">
              Confirm New Password
            </label>
            <input
              type="password"
              id="confirmPassword"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-teal focus:border-transparent transition-colors"
              placeholder="••••••••"
              required
              minLength="6"
            />
          </div>

          <button
            type="submit"
            disabled={loading || messageType === 'success'}
            className="w-full bg-teal text-white py-3 rounded-xl hover:bg-teal-600 transition-colors font-semibold shadow-lg disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {loading ? 'Resetting...' : 'Reset Password'}
          </button>
        </form>

        <div className="mt-6 text-center">
          <Link 
            to="/login"
            className="text-teal hover:text-teal-600 transition-colors"
          >
            Back to Sign In
          </Link>
        </div>
      </div>
    </div>
  )
}

export default ResetPassword