import { useState } from 'react'
import { useAuth } from '../auth/AuthContext'

const Profile = () => {
  const { user, updateProfile } = useAuth()
  const [formData, setFormData] = useState({
    username: '',
    email: ''
  })
  const [loading, setLoading] = useState(false)
  const [message, setMessage] = useState('')
  const [messageType, setMessageType] = useState('') // 'success' or 'error'

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    })
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setLoading(true)
    setMessage('')

    // Only send fields that have values
    const updateData = {}
    if (formData.username.trim()) updateData.username = formData.username.trim()
    if (formData.email.trim()) updateData.email = formData.email.trim()

    if (Object.keys(updateData).length === 0) {
      setMessage('Please enter at least one field to update')
      setMessageType('error')
      setLoading(false)
      return
    }

    const result = await updateProfile(updateData)
    
    setMessage(result.message)
    setMessageType(result.success ? 'success' : 'error')
    
    if (result.success) {
      setFormData({ username: '', email: '' }) // Clear form on success
    }
    
    setLoading(false)
  }

  return (
    <div className="max-w-2xl mx-auto">
      <div className="bg-white rounded-2xl shadow-2xl p-8">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-deepNavy mb-2">My Profile</h1>
          <p className="text-gray-600">Manage your account information</p>
        </div>

        {/* Current User Info */}
        <div className="bg-gradient-to-r from-sand to-teal rounded-xl p-6 mb-8">
          <h3 className="text-lg font-semibold text-deepNavy mb-4">Current Information</h3>
          <div className="space-y-2">
            <div className="flex justify-between">
              <span className="text-deepNavy font-medium">Email:</span>
              <span className="text-deepNavy">{user?.email}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-deepNavy font-medium">Role:</span>
              <span className="text-deepNavy">{user?.role}</span>
            </div>
          </div>
        </div>

        {/* Update Form */}
        <div className="mb-8">
          <h3 className="text-lg font-semibold text-deepNavy mb-4">Update Profile</h3>
          
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
              <label htmlFor="username" className="block text-sm font-medium text-deepNavy mb-2">
                New Username (optional)
              </label>
              <input
                type="text"
                id="username"
                name="username"
                value={formData.username}
                onChange={handleChange}
                className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-teal focus:border-transparent transition-colors"
                placeholder="Enter new username"
              />
            </div>

            <div>
              <label htmlFor="email" className="block text-sm font-medium text-deepNavy mb-2">
                New Email (optional)
              </label>
              <input
                type="email"
                id="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-teal focus:border-transparent transition-colors"
                placeholder="Enter new email"
              />
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full bg-teal text-white py-3 rounded-xl hover:bg-teal-600 transition-colors font-semibold shadow-lg disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {loading ? 'Updating...' : 'Update Profile'}
            </button>
          </form>
        </div>

        {/* Note */}
        <div className="bg-blue-50 border border-blue-200 rounded-xl p-4">
          <p className="text-blue-800 text-sm">
            <strong>Note:</strong> You can update either your username or email address. 
            Leave fields empty if you don't want to change them.
          </p>
        </div>
      </div>
    </div>
  )
}

export default Profile