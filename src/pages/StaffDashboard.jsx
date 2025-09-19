import { useAuth } from '../auth/AuthContext'

const StaffDashboard = () => {
  const { user } = useAuth()

  return (
    <div className="max-w-4xl mx-auto">
      <div className="bg-white rounded-2xl shadow-2xl p-8">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-deepNavy mb-2">Staff Dashboard</h1>
          <p className="text-gray-600">Staff management and operations center</p>
        </div>

        {/* Staff Info */}
        <div className="bg-gradient-to-r from-sand to-teal rounded-xl p-6 mb-8">
          <h3 className="text-lg font-semibold text-deepNavy mb-4">Staff Information</h3>
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

        {/* Welcome Message */}
        <div className="bg-teal-50 border border-teal-200 rounded-xl p-6 mb-8 text-center">
          <div className="text-6xl mb-4">👋</div>
          <h3 className="text-2xl font-semibold text-deepNavy mb-2">Welcome, Staff Member!</h3>
          <p className="text-teal-700">
            You have staff-level access to the Palm Beach Resort management system.
          </p>
        </div>

        {/* Staff Features */}
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          <div className="bg-blue-50 border border-blue-200 rounded-xl p-6 text-center">
            <div className="text-4xl mb-4">🏨</div>
            <h4 className="text-lg font-semibold text-deepNavy mb-2">Room Management</h4>
            <p className="text-gray-600 text-sm">Manage room assignments and availability</p>
          </div>
          
          <div className="bg-green-50 border border-green-200 rounded-xl p-6 text-center">
            <div className="text-4xl mb-4">🎯</div>
            <h4 className="text-lg font-semibold text-deepNavy mb-2">Guest Services</h4>
            <p className="text-gray-600 text-sm">Handle guest requests and services</p>
          </div>
          
          <div className="bg-yellow-50 border border-yellow-200 rounded-xl p-6 text-center">
            <div className="text-4xl mb-4">📋</div>
            <h4 className="text-lg font-semibold text-deepNavy mb-2">Daily Tasks</h4>
            <p className="text-gray-600 text-sm">View and manage daily work assignments</p>
          </div>
          
          <div className="bg-purple-50 border border-purple-200 rounded-xl p-6 text-center">
            <div className="text-4xl mb-4">🍽️</div>
            <h4 className="text-lg font-semibold text-deepNavy mb-2">Restaurant Orders</h4>
            <p className="text-gray-600 text-sm">Process restaurant and room service orders</p>
          </div>
          
          <div className="bg-pink-50 border border-pink-200 rounded-xl p-6 text-center">
            <div className="text-4xl mb-4">🧹</div>
            <h4 className="text-lg font-semibold text-deepNavy mb-2">Housekeeping</h4>
            <p className="text-gray-600 text-sm">Coordinate housekeeping activities</p>
          </div>
          
          <div className="bg-orange-50 border border-orange-200 rounded-xl p-6 text-center">
            <div className="text-4xl mb-4">📞</div>
            <h4 className="text-lg font-semibold text-deepNavy mb-2">Guest Communication</h4>
            <p className="text-gray-600 text-sm">Handle guest inquiries and feedback</p>
          </div>
        </div>

        {/* Shift Information */}
        <div className="mt-8 bg-coral-50 border border-coral-200 rounded-xl p-6">
          <h4 className="text-lg font-semibold text-deepNavy mb-4">Current Shift Information</h4>
          <div className="grid md:grid-cols-3 gap-4 text-center">
            <div>
              <div className="text-2xl font-bold text-coral">8:00 AM</div>
              <div className="text-sm text-gray-600">Shift Start</div>
            </div>
            <div>
              <div className="text-2xl font-bold text-coral">4:00 PM</div>
              <div className="text-sm text-gray-600">Shift End</div>
            </div>
            <div>
              <div className="text-2xl font-bold text-coral">Active</div>
              <div className="text-sm text-gray-600">Status</div>
            </div>
          </div>
        </div>

        {/* Note */}
        <div className="mt-8 bg-blue-50 border border-blue-200 rounded-xl p-4">
          <p className="text-blue-800 text-sm">
            <strong>Note:</strong> This staff dashboard provides access to operational tools and features. 
            Contact your supervisor if you need access to additional systems.
          </p>
        </div>
      </div>
    </div>
  )
}

export default StaffDashboard