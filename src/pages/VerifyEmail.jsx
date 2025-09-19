import { useState, useEffect } from 'react'
import { useSearchParams, Link } from 'react-router-dom'
import apiClient from '../api/http'

const VerifyEmail = () => {
  const [searchParams] = useSearchParams()
  const [status, setStatus] = useState('loading') // 'loading', 'success', 'error'
  const [message, setMessage] = useState('')
  
  const token = searchParams.get('token')

  useEffect(() => {
    const verifyEmail = async () => {
      if (!token) {
        setStatus('error')
        setMessage('Verification token is missing')
        return
      }

      try {
        const response = await apiClient.get(`/api/auth/verify?token=${token}`)
        setStatus('success')
        setMessage(response.data || 'Email verified successfully!')
      } catch (error) {
        setStatus('error')
        setMessage(error.response?.data?.message || error.response?.data || 'Email verification failed')
      }
    }

    verifyEmail()
  }, [token])

  return (
    <div className="min-h-[80vh] flex items-center justify-center">
      <div className="bg-white rounded-2xl shadow-2xl p-8 w-full max-w-md text-center">
        {status === 'loading' && (
          <>
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-teal mx-auto mb-4"></div>
            <h2 className="text-2xl font-bold text-deepNavy mb-4">Verifying Email</h2>
            <p className="text-gray-600">Please wait while we verify your email address...</p>
          </>
        )}

        {status === 'success' && (
          <>
            <div className="text-6xl mb-6">✅</div>
            <h2 className="text-2xl font-bold text-deepNavy mb-4">Email Verified!</h2>
            <p className="text-gray-600 mb-6">{message}</p>
            <Link 
              to="/login"
              className="bg-teal text-white px-6 py-3 rounded-xl hover:bg-teal-600 transition-colors font-semibold shadow-lg inline-block"
            >
              Sign In Now
            </Link>
          </>
        )}

        {status === 'error' && (
          <>
            <div className="text-6xl mb-6">❌</div>
            <h2 className="text-2xl font-bold text-deepNavy mb-4">Verification Failed</h2>
            <p className="text-gray-600 mb-6">{message}</p>
            <div className="space-y-4">
              <Link 
                to="/signup"
                className="bg-coral text-white px-6 py-3 rounded-xl hover:bg-coral-600 transition-colors font-semibold shadow-lg inline-block mr-4"
              >
                Sign Up Again
              </Link>
              <Link 
                to="/login"
                className="bg-teal text-white px-6 py-3 rounded-xl hover:bg-teal-600 transition-colors font-semibold shadow-lg inline-block"
              >
                Back to Login
              </Link>
            </div>
          </>
        )}
      </div>
    </div>
  )
}

export default VerifyEmail