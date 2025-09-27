import { BrowserRouter as Router, Routes, Route } from 'react-router-dom'
import Navbar from './components/Navbar'
import Footer from './components/Footer'
import Home from './pages/ Home'
import Rooms from './pages/Rooms'
import Bookings from './pages/Bookings'
import './App.css'

function App() {
  return (
    <Router>
      <div className="app">
        <Navbar />
        <main className="main-content">
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/rooms" element={<Rooms />} />
            <Route path="/bookings" element={<Bookings />} />
          </Routes>
        </main>
        <Footer />
      </div>
    </Router>
  )
}

export default App
