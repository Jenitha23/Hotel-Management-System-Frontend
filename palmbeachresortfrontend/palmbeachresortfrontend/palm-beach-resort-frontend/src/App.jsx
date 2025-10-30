import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider, useAuth } from './context/AuthContext';
import Navbar from './components/common/Navbar';
import Footer from './components/common/Footer';
import Home from './pages/Home';
import Login from './components/auth/Login';
import Signup from './components/auth/Signup';
import CustomerDashboard from './pages/CustomerDashboard';
import StaffDashboard from './pages/StaffDashboard';
import AdminDashboard from './pages/AdminDashboard';
import RoomsPage from './pages/rooms/RoomsPage';
import RoomDetailsPage from './pages/rooms/RoomDetailsPage';
import AdminRoomsPage from './pages/rooms/AdminRoomsPage';
import BookingForm from './components/booking/BookingForm';
import CustomerBookings from './pages/booking/CustomerBookings';
import AdminBookings from './pages/booking/AdminBookings';
import BookingDetails from './pages/booking/BookingDetails';
import AdminMenuPage from './pages/menu/AdminMenuPage';
import MenuPage from './pages/menu/MenuPage';
import CustomerOrderHistory from './pages/menu/CustomerOrderHistory';
import OrderTracking from './pages/menu/OrderTracking';
import AdminOrdersPage from './pages/menu/AdminOrdersPage';
import KitchenDashboard from './pages/menu/KitchenDashboard';
import OrderStatistics from './pages/menu/OrderStatistics';
import AdminTasks from './pages/tasks/AdminTasks';
import StaffTasks from './pages/tasks/StaffTasks';
import TaskDetails from './pages/tasks/TaskDetails';
import TaskForm from './components/tasks/TaskForm';
import Invoice from './components/Invoice';
import './App.css';

const ProtectedRoute = ({ children, allowedRoles = [] }) => {
    const { user, loading } = useAuth();

    if (loading) {
        return <div className="loading-spinner"></div>;
    }

    if (!user) {
        return <Navigate to="/login" replace />;
    }

    if (allowedRoles.length > 0 && !allowedRoles.includes(user.role)) {
        return <Navigate to="/" replace />;
    }

    return children;
};


// Layout component for pages that need Navbar and Footer
const DefaultLayout = ({ children }) => (
    <>
        <Navbar />
        <main className="main-content">
            {children}
        </main>
        <Footer />
    </>
);

// Layout component for pages that don't need Navbar and Footer
const MinimalLayout = ({ children }) => (
    <main className="main-content">
        {children}
    </main>
);

function App() {
    return (
        <AuthProvider>
            <Router future={{ v7_startTransition: true }}>
                <div className="App">
                    <Routes>
                        {/* Routes with Default Layout (Navbar + Footer) */}
                        <Route path="/" element={<DefaultLayout><Home /></DefaultLayout>} />
                        <Route path="/login" element={<DefaultLayout><Login /></DefaultLayout>} />
                        <Route path="/signup" element={<DefaultLayout><Signup /></DefaultLayout>} />

                        {/* Room Routes with Default Layout */}
                        <Route path="/rooms" element={<DefaultLayout><RoomsPage /></DefaultLayout>} />
                        <Route path="/rooms/:id" element={<DefaultLayout><RoomDetailsPage /></DefaultLayout>} />

                        {/* Booking Routes with Default Layout */}
                        <Route path="/book-room/:id" element={<DefaultLayout><BookingForm /></DefaultLayout>} />
                        <Route path="/customer/bookings" element={<DefaultLayout><CustomerBookings /></DefaultLayout>} />
                        <Route path="/admin/bookings" element={<DefaultLayout><AdminBookings /></DefaultLayout>} />
                        <Route path="/bookings/:id" element={<DefaultLayout><BookingDetails /></DefaultLayout>} />

                        {/* Menu Routes with Minimal Layout (No Navbar/Footer) */}
                        <Route path="/menu" element={<DefaultLayout><MenuPage /></DefaultLayout>} />
                        <Route path="/customer/orders" element={<DefaultLayout><CustomerOrderHistory /></DefaultLayout>} />
                        <Route path="/track-order" element={<DefaultLayout><OrderTracking /></DefaultLayout>} />

                        {/* Admin Menu Routes */}
                        <Route path="/admin/menu" element={<DefaultLayout><AdminMenuPage /></DefaultLayout>} />
                        <Route path="/admin/orders" element={<DefaultLayout><AdminOrdersPage /></DefaultLayout>} />
                        <Route path="/admin/kitchen" element={<DefaultLayout><KitchenDashboard /></DefaultLayout>} />
                        <Route path="/admin/statistics" element={<DefaultLayout><OrderStatistics /></DefaultLayout>} />

                        <Route path="/staff/tasks" element={<DefaultLayout><StaffTasks /></DefaultLayout>} />
                        <Route path="/staff/tasks/:taskId" element={<DefaultLayout><TaskDetails /></DefaultLayout>} />

                        <Route path="/dashboard" element={<CustomerDashboard />} />
                        <Route path="/admin/tasks" element={<DefaultLayout><AdminTasks /></DefaultLayout>} />
                        <Route path="/admin/tasks/create" element={<DefaultLayout><TaskForm /></DefaultLayout>} />
                        <Route path="/admin/tasks/:taskId" element={<DefaultLayout><TaskDetails /></DefaultLayout>} />
                        <Route path="/admin/tasks/edit/:taskId" element={<DefaultLayout><TaskForm /></DefaultLayout>} />

                        <Route path="/customer/invoice" element={<Invoice />} />
                        <Route path="/customer/invoice/:bookingReference" element={<Invoice />} />




                        {/* Dashboard Routes with Default Layout */}
                        <Route
                            path="/customer-dashboard"
                            element={
                                <ProtectedRoute allowedRoles={['CUSTOMER']}>
                                    <DefaultLayout>
                                        <CustomerDashboard />
                                    </DefaultLayout>
                                </ProtectedRoute>
                            }
                        />
                        <Route
                            path="/staff-dashboard"
                            element={
                                <ProtectedRoute allowedRoles={['STAFF']}>
                                    <DefaultLayout>
                                        <StaffDashboard />
                                    </DefaultLayout>
                                </ProtectedRoute>
                            }
                        />
                        <Route
                            path="/admin-dashboard"
                            element={
                                <ProtectedRoute allowedRoles={['ADMIN']}>
                                    <DefaultLayout>
                                        <AdminDashboard />
                                    </DefaultLayout>
                                </ProtectedRoute>
                            }
                        />

                        {/* Admin Room Management with Default Layout */}
                        <Route
                            path="/admin/rooms"
                            element={
                                <ProtectedRoute allowedRoles={['ADMIN']}>
                                    <DefaultLayout>
                                        <AdminRoomsPage />
                                    </DefaultLayout>
                                </ProtectedRoute>
                            }
                        />

                        <Route path="*" element={<Navigate to="/" replace />} />
                    </Routes>
                </div>
            </Router>
        </AuthProvider>
    );
}

export default App;
