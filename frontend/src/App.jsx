import React from 'react';
import { Routes, Route } from 'react-router-dom';
import Home from './pages/Home.jsx';
import RoomsList from './pages/RoomsList.jsx';
import RoomDetails from './pages/RoomDetails.jsx';
import AdminLayout from './components/layout/AdminLayout.jsx';
import AdminDashboard from './pages/admin/AdminDashboard.jsx';
import AdminRooms from './pages/admin/AdminRooms.jsx';
import AdminRoomNew from './pages/admin/AdminRoomNew.jsx';
import AdminRoomEdit from './pages/admin/AdminRoomEdit.jsx';
import Toast from './components/ui/Toast.jsx';
import './styles/theme.css';

function App() {
    return (
        <div className="App">
            <Routes>
                    {/* Public Routes */}
                    <Route path="/" element={<Home />} />
                    <Route path="/rooms" element={<RoomsList />} />
                    <Route path="/rooms/:id" element={<RoomDetails />} />

                    {/* Admin Routes */}
                    <Route path="/admin" element={<AdminLayout />}>
                        <Route index element={<AdminDashboard />} />
                        <Route path="rooms" element={<AdminRooms />} />
                        <Route path="rooms/new" element={<AdminRoomNew />} />
                        <Route path="rooms/:id/edit" element={<AdminRoomEdit />} />
                    </Route>

            </Routes>

            <Toast />
        </div>
    );
}

export default App;