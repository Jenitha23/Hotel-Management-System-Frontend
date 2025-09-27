import { Routes, Route, Navigate, useLocation, Link } from "react-router-dom";
import Dashboard from "./pages/Dashboard.jsx";
import BookingsPage from "./pages/BookingsPage.jsx";
import NewRoom from "./pages/NewRoom.jsx";
import NotFound from "./pages/NotFound.jsx";
import TopNav from "./components/TopNav.jsx";

export default function App() {
    const location = useLocation();
    return (
        <div className="app">
            <TopNav activePath={location.pathname} />
            <div className="container">
                <Routes>
                    <Route path="/" element={<Navigate to="/dashboard" replace />} />
                    <Route path="/dashboard" element={<Dashboard />} />
                    <Route path="/bookings" element={<BookingsPage />} />
                    <Route path="/new-room" element={<NewRoom />} />
                    <Route path="*" element={<NotFound />} />
                </Routes>
            </div>
        </div>
    );
}
