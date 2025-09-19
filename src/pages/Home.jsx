import { Link } from 'react-router-dom'
import { useAuth } from '../auth/AuthContext'

const Home = () => {
  const { user } = useAuth()

  return (
    <div className="min-h-[80vh] flex flex-col items-center justify-center">
      {/* Hero Section */}
      <div className="text-center max-w-4xl mx-auto mb-12">
        <div className="bg-gradient-to-r from-sand to-teal rounded-3xl p-12 shadow-2xl mb-8">
          <h1 className="text-5xl font-bold text-deepNavy mb-6">
            Welcome to Palm Beach Resort
          </h1>
          <p className="text-xl text-deepNavy mb-8 leading-relaxed">
            Discover paradise with pristine beaches, luxurious accommodations, and world-class service. 
            Your perfect getaway awaits in our tropical paradise.
          </p>
          
          {!user ? (
            <div className="flex gap-6 justify-center">
              <Link 
                to="/signup"
                className="bg-coral text-white px-8 py-4 rounded-xl hover:bg-coral-600 transition-all duration-300 shadow-lg hover:shadow-xl transform hover:scale-105 font-semibold text-lg"
              >
                Book Your Stay
              </Link>
              <Link 
                to="/login"
                className="bg-teal text-white px-8 py-4 rounded-xl hover:bg-teal-600 transition-all duration-300 shadow-lg hover:shadow-xl transform hover:scale-105 font-semibold text-lg"
              >
                Member Login
              </Link>
            </div>
          ) : (
            <div className="text-deepNavy">
              <p className="text-xl mb-6">Welcome back, {user.email}!</p>
              <div className="flex gap-4 justify-center">
                <Link 
                  to="/profile"
                  className="bg-teal text-white px-6 py-3 rounded-xl hover:bg-teal-600 transition-all duration-300 shadow-lg font-semibold"
                >
                  View Profile
                </Link>
                {user.role === 'ADMIN' && (
                  <Link 
                    to="/admin"
                    className="bg-coral text-white px-6 py-3 rounded-xl hover:bg-coral-600 transition-all duration-300 shadow-lg font-semibold"
                  >
                    Admin Dashboard
                  </Link>
                )}
                {user.role === 'STAFF' && (
                  <Link 
                    to="/staff"
                    className="bg-coral text-white px-6 py-3 rounded-xl hover:bg-coral-600 transition-all duration-300 shadow-lg font-semibold"
                  >
                    Staff Dashboard
                  </Link>
                )}
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Features Section */}
      <div className="grid md:grid-cols-3 gap-8 max-w-6xl mx-auto">
        <div className="bg-white rounded-2xl p-8 shadow-lg hover:shadow-xl transition-shadow">
          <div className="text-4xl mb-4">🏖️</div>
          <h3 className="text-xl font-semibold text-deepNavy mb-3">Pristine Beaches</h3>
          <p className="text-gray-600">
            Miles of white sand beaches with crystal clear waters and perfect weather year-round.
          </p>
        </div>
        
        <div className="bg-white rounded-2xl p-8 shadow-lg hover:shadow-xl transition-shadow">
          <div className="text-4xl mb-4">🌺</div>
          <h3 className="text-xl font-semibold text-deepNavy mb-3">Luxury Amenities</h3>
          <p className="text-gray-600">
            World-class spa, fine dining, and premium accommodations for the ultimate experience.
          </p>
        </div>
        
        <div className="bg-white rounded-2xl p-8 shadow-lg hover:shadow-xl transition-shadow">
          <div className="text-4xl mb-4">🏊</div>
          <h3 className="text-xl font-semibold text-deepNavy mb-3">Activities</h3>
          <p className="text-gray-600">
            Snorkeling, sailing, golf, and endless entertainment options for all ages.
          </p>
        </div>
      </div>
    </div>
  )
}

export default Home