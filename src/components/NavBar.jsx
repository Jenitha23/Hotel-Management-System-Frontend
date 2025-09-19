import { Link } from 'react-router-dom'
import { useAuth } from '../auth/AuthContext'

const NavBar = () => {
  const { user, logout } = useAuth()

  return (
    <nav className="bg-gradient-to-r from-sand to-teal shadow-lg">
      <div className="container mx-auto px-4">
        <div className="flex justify-between items-center py-4">
          {/* Brand */}
          <Link 
            to="/" 
            className="text-2xl font-bold text-deepNavy hover:text-teal-700 transition-colors"
          >
            🌴 Palm Beach Resort
          </Link>

          {/* Navigation Links */}
          <div className="flex items-center space-x-6">
            {!user ? (
              // Not logged in
              <>
                <Link 
                  to="/" 
                  className="text-deepNavy hover:text-teal-700 font-medium transition-colors"
                >
                  Home
                </Link>
                <Link 
                  to="/login" 
                  className="bg-teal text-white px-4 py-2 rounded-xl hover:bg-teal-600 transition-colors shadow-md"
                >
                  Login
                </Link>
                <Link 
                  to="/signup" 
                  className="bg-coral text-white px-4 py-2 rounded-xl hover:bg-coral-600 transition-colors shadow-md"
                >
                  Sign Up
                </Link>
              </>
            ) : (
              // Logged in
              <>
                <Link 
                  to="/" 
                  className="text-deepNavy hover:text-teal-700 font-medium transition-colors"
                >
                  Home
                </Link>
                <Link 
                  to="/profile" 
                  className="text-deepNavy hover:text-teal-700 font-medium transition-colors"
                >
                  Profile
                </Link>
                {user.role === 'ADMIN' && (
                  <Link 
                    to="/admin" 
                    className="text-deepNavy hover:text-teal-700 font-medium transition-colors"
                  >
                    Admin
                  </Link>
                )}
                {user.role === 'STAFF' && (
                  <Link 
                    to="/staff" 
                    className="text-deepNavy hover:text-teal-700 font-medium transition-colors"
                  >
                    Staff
                  </Link>
                )}
                <span className="text-deepNavy text-sm">
                  {user.email} ({user.role})
                </span>
                <button 
                  onClick={logout}
                  className="bg-coral text-white px-4 py-2 rounded-xl hover:bg-coral-600 transition-colors shadow-md"
                >
                  Logout
                </button>
              </>
            )}
            
            {/* Dev link */}
            <Link 
              to="/connection-test" 
              className="text-xs text-deepNavy opacity-70 hover:opacity-100"
            >
              Test
            </Link>
          </div>
        </div>
      </div>
    </nav>
  )
}

export default NavBar