import React, { useState, useEffect } from 'react';
import { roomService } from '../../services/roomService';
import AdminRoomForm from '../../components/rooms/AdminRoomForm';
import Loader from '../../components/ui/Loader';
import { useAuth } from '../../context/AuthContext';
import { useNavigate } from 'react-router-dom';
import './AdminRoomsPage.css';

const AdminRoomsPage = () => {
    const [rooms, setRooms] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');
    const [showForm, setShowForm] = useState(false);
    const [editingRoom, setEditingRoom] = useState(null);
    const { user, logout } = useAuth();
    const navigate = useNavigate();

    // Redirect if not admin
    useEffect(() => {
        if (user && user.role !== 'ADMIN') {
            navigate('/dashboard');
        }
    }, [user, navigate]);

    // Load all rooms from backend
    useEffect(() => {
        loadAllRooms();
    }, []);

    const loadAllRooms = async () => {
        try {
            setLoading(true);
            setError('');
            const response = await roomService.getAllRooms();
            setRooms(response.data);
        } catch (err) {
            setError('Failed to load rooms. Please check your connection.');
            console.error('Error loading rooms:', err);
        } finally {
            setLoading(false);
        }
    };

    // Create new room - UPDATED WITH DEBUG LOGGING
    const handleCreateRoom = async (id, roomData) => {
        try {
            console.log('📦 AdminRoomsPage: Received in handleCreateRoom - id:', id, 'roomData:', roomData);
            await roomService.createRoom(roomData);
            await loadAllRooms(); // Refresh the list
            setShowForm(false);
        } catch (err) {
            console.error('❌ AdminRoomsPage: Error in handleCreateRoom:', err);
            throw err; // Let the form handle the error
        }
    };

    // Update existing room - UPDATED WITH DEBUG LOGGING
    const handleUpdateRoom = async (id, roomData) => {
        try {
            console.log('📦 AdminRoomsPage: Received in handleUpdateRoom - id:', id, 'roomData:', roomData);
            await roomService.updateRoom(id, roomData);
            await loadAllRooms(); // Refresh the list
            setEditingRoom(null);
            setShowForm(false);
        } catch (err) {
            console.error('❌ AdminRoomsPage: Error in handleUpdateRoom:', err);
            throw err; // Let the form handle the error
        }
    };

    // Delete room
    const handleDeleteRoom = async (id) => {
        if (!window.confirm('Are you sure you want to delete this room? This action cannot be undone.')) {
            return;
        }

        try {
            await roomService.deleteRoom(id);
            await loadAllRooms(); // Refresh the list
        } catch (err) {
            setError('Failed to delete room. It might be referenced in existing bookings.');
            console.error('Error deleting room:', err);
        }
    };

    // Toggle room availability
    const handleToggleAvailability = async (room) => {
        try {
            await roomService.updateRoomPartial(room.id, {
                available: !room.available
            });
            await loadAllRooms(); // Refresh the list
        } catch (err) {
            setError('Failed to update room availability.');
            console.error('Error updating availability:', err);
        }
    };

    const handleRetry = () => {
        loadAllRooms();
    };

    const handleLogout = async () => {
        await logout();
        navigate('/');
    };

    if (loading) {
        return (
            <div className="admin-rooms-page">
                <div className="admin-header">
                    <h1>Room Management</h1>
                </div>
                <Loader />
            </div>
        );
    }

    return (
        <div className="admin-rooms-page">
            {/* Admin Header */}
            <div className="admin-header">
                <h1>Room Management</h1>
                <button
                    className="btn btn-primary"
                    onClick={() => setShowForm(true)}
                >
                    + Add New Room
                </button>
            </div>

            {/* Error Display */}
            {error && (
                <div className="error-message">
                    <p>{error}</p>
                    <button onClick={handleRetry}>Try Again</button>
                </div>
            )}

            {/* Room Form Modal */}
            {showForm && (
                <AdminRoomForm
                    room={editingRoom}
                    onSubmit={editingRoom ? handleUpdateRoom : handleCreateRoom}
                    onCancel={() => {
                        setShowForm(false);
                        setEditingRoom(null);
                    }}
                />
            )}

            {/* Rooms Table */}
            <div className="rooms-table-container">
                {rooms.length === 0 ? (
                    <div className="no-rooms">
                        <h3>No rooms found</h3>
                        <p>Get started by creating your first room.</p>
                        <button
                            className="btn btn-primary"
                            onClick={() => setShowForm(true)}
                        >
                            Create First Room
                        </button>
                    </div>
                ) : (
                    <table className="rooms-table">
                        <thead>
                        <tr>
                            <th>Room Number</th>
                            <th>Type</th>
                            <th>Price</th>
                            <th>Capacity</th>
                            <th>Status</th>
                            <th>Actions</th>
                        </tr>
                        </thead>
                        <tbody>
                        {rooms.map(room => (
                            <tr key={room.id} className={!room.available ? 'unavailable' : ''}>
                                <td>
                                    <strong>{room.roomNumber}</strong>
                                </td>
                                <td>
                                        <span className={`room-type-badge ${room.roomType.toLowerCase()}`}>
                                            {room.roomType}
                                        </span>
                                </td>
                                <td>
                                    <strong>${room.price}</strong>
                                </td>
                                <td>{room.capacity} guests</td>
                                <td>
                                        <span className={`status ${room.available ? 'available' : 'unavailable'}`}>
                                            {room.available ? 'Available' : 'Unavailable'}
                                        </span>
                                </td>
                                <td className="actions">
                                    <button
                                        className="btn btn-edit"
                                        onClick={() => {
                                            setEditingRoom(room);
                                            setShowForm(true);
                                        }}
                                    >
                                        Edit
                                    </button>
                                    <button
                                        className={`btn ${room.available ? 'btn-warning' : 'btn-success'}`}
                                        onClick={() => handleToggleAvailability(room)}
                                    >
                                        {room.available ? 'Make Unavailable' : 'Make Available'}
                                    </button>
                                    <button
                                        className="btn btn-danger"
                                        onClick={() => handleDeleteRoom(room.id)}
                                    >
                                        Delete
                                    </button>
                                </td>
                            </tr>
                        ))}
                        </tbody>
                    </table>
                )}
            </div>
        </div>
    );
};

export default AdminRoomsPage;