import { createContext, useContext, useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import apiClient from '../api/http'

const AuthContext = createContext()

export const useAuth = () => {
  const context = useContext(AuthContext)
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider')
  }
  return context
}

// JWT decode utility
const decodeJWT = (token) => {
  try {
    const payload = token.split('.')[1]
    const decoded = JSON.parse(atob(payload))
    return {
      email: decoded.sub,
      role: decoded.role,
      exp: decoded.exp
    }
  } catch (error) {
    console.error('Error decoding JWT:', error)
    return null
  }
}

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null)
  const [accessToken, setAccessToken] = useState(null)
  const [refreshToken, setRefreshToken] = useState(null)
  const [loading, setLoading] = useState(true)
  const navigate = useNavigate()

  // Initialize auth state from localStorage
  useEffect(() => {
    const storedAccessToken = localStorage.getItem('accessToken')
    const storedRefreshToken = localStorage.getItem('refreshToken')

    if (storedAccessToken) {
      const decodedUser = decodeJWT(storedAccessToken)
      if (decodedUser && decodedUser.exp * 1000 > Date.now()) {
        setAccessToken(storedAccessToken)
        setRefreshToken(storedRefreshToken)
        setUser(decodedUser)
      } else {
        // Token expired, clear storage
        localStorage.removeItem('accessToken')
        localStorage.removeItem('refreshToken')
      }
    }
    setLoading(false)
  }, [])

  const login = async (email, password) => {
    try {
      const response = await apiClient.post('/api/auth/login', { email, password })
      const { accessToken: newAccessToken, refreshToken: newRefreshToken } = response.data

      // Store tokens
      localStorage.setItem('accessToken', newAccessToken)
      localStorage.setItem('refreshToken', newRefreshToken)
      setAccessToken(newAccessToken)
      setRefreshToken(newRefreshToken)

      // Decode user from token
      const decodedUser = decodeJWT(newAccessToken)
      setUser(decodedUser)

      // Role-based redirect
      if (decodedUser.role === 'ADMIN') {
        navigate('/admin')
      } else if (decodedUser.role === 'STAFF') {
        navigate('/staff')
      } else {
        navigate('/')
      }

      return { success: true }
    } catch (error) {
      return { 
        success: false, 
        message: error.response?.data?.message || error.response?.data || 'Login failed' 
      }
    }
  }

  const signup = async (username, email, password, role = 'CUSTOMER') => {
    try {
      const response = await apiClient.post('/api/auth/register', {
        username,
        email,
        password,
        role
      })
      
      // Do not auto-login, just return success message
      navigate('/login', { 
        state: { message: 'Registration successful! Check your email to verify your account.' }
      })
      
      return { 
        success: true, 
        message: response.data || 'User registered. Check email for verification.'
      }
    } catch (error) {
      return { 
        success: false, 
        message: error.response?.data?.message || error.response?.data || 'Registration failed' 
      }
    }
  }

  const logout = () => {
    localStorage.removeItem('accessToken')
    localStorage.removeItem('refreshToken')
    setAccessToken(null)
    setRefreshToken(null)
    setUser(null)
    navigate('/')
  }

  const updateProfile = async ({ username, email }) => {
    try {
      const params = new URLSearchParams()
      if (username) params.append('newUsername', username)
      if (email) params.append('newEmail', email)

      const response = await apiClient.put(`/api/user/profile?${params}`)
      
      return { 
        success: true, 
        message: response.data || 'Profile updated successfully'
      }
    } catch (error) {
      return { 
        success: false, 
        message: error.response?.data?.message || error.response?.data || 'Profile update failed' 
      }
    }
  }

  const value = {
    user,
    accessToken,
    refreshToken,
    loading,
    login,
    signup,
    logout,
    updateProfile
  }

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>
}