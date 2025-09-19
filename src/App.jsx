import { Routes, Route } from 'react-router-dom'
import NavBar from './components/NavBar'
import ProtectedRoute from './components/ProtectedRoute'
import RoleRoute from './components/RoleRoute'
import Home from './pages/Home'
import Login from './pages/Login'
import Signup from './pages/Signup'
import VerifyEmail from './pages/VerifyEmail'
import ForgotPassword from './pages/ForgotPassword'
import ResetPassword from './pages/ResetPassword'
import Profile from './pages/Profile'
import AdminDashboard from './pages/AdminDashboard'
import StaffDashboard from './pages/StaffDashboard'
import ConnectionTest from './pages/ConnectionTest'

// Tailwind CSS custom colors can be defined in the tailwind.config.js file
function App() {
  return (
    <div className="min-h-screen bg-sand">
      <NavBar />
      <main className="container mx-auto px-4 py-8">
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/login" element={<Login />} />
          <Route path="/signup" element={<Signup />} />
          <Route path="/verify-email" element={<VerifyEmail />} />
          <Route path="/forgot-password" element={<ForgotPassword />} />
          <Route path="/reset-password" element={<ResetPassword />} />
          <Route 
            path="/profile" 
            element={
              <ProtectedRoute>
                <Profile />
              </ProtectedRoute>
            } 
          />
          <Route 
            path="/admin" 
            element={
              <RoleRoute roles={['ADMIN']}>
                <AdminDashboard />
              </RoleRoute>
            } 
          />
          <Route 
            path="/staff" 
            element={
              <RoleRoute roles={['STAFF']}>
                <StaffDashboard />
              </RoleRoute>
            } 
          />
          <Route path="/connection-test" element={<ConnectionTest />} />
        </Routes>
      </main>
    </div>
  )
}

export default App