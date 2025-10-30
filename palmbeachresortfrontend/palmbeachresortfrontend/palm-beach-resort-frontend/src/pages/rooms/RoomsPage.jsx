
import React, { useState, useEffect } from 'react';
import { roomService } from '../../services/roomService';
import { useNavigate } from 'react-router-dom';
import RoomCard from '../../components/rooms/RoomCard';
import RoomFilters from '../../components/rooms/RoomFilters';
import Loader from '../../components/ui/Loader';
import './RoomsPage.css';

const RoomsPage = () => {
    const [rooms, setRooms] = useState([]);
    const [filteredRooms, setFilteredRooms] = useState([]);
    const [loading, setLoading] = useState(true);
    const [searchLoading, setSearchLoading] = useState(false);
    const [error, setError] = useState('');
    const navigate = useNavigate();

    // Load all available rooms on component mount
    useEffect(() => {
        loadAvailableRooms();
    }, []);

    const loadAvailableRooms = async () => {
        try {
            setLoading(true);
            setError('');
            const response = await roomService.getAvailableRooms();
            setRooms(response.data);
            setFilteredRooms(response.data);
        } catch (err) {
            setError('Failed to load rooms. Please try again later.');
            console.error('Error loading rooms:', err);
        } finally {
            setLoading(false);
        }
    };

    // Handle filter changes with real backend search
    const handleFiltersChange = async (filters) => {
        try {
            setSearchLoading(true);
            setError('');

            // If no filters are applied, show all available rooms
            if (!filters.roomType && !filters.minPrice && !filters.maxPrice && !filters.capacity) {
                setFilteredRooms(rooms);
                return;
            }

            // Prepare search parameters for backend
            const searchParams = {
                roomType: filters.roomType || null,
                minPrice: filters.minPrice ? parseFloat(filters.minPrice) : null,
                maxPrice: filters.maxPrice ? parseFloat(filters.maxPrice) : null,
                capacity: filters.capacity ? parseInt(filters.capacity) : null
            };

            // Call backend search API
            const response = await roomService.searchRooms(searchParams);
            setFilteredRooms(response.data);

        } catch (err) {
            setError('Failed to search rooms. Please try again.');
            console.error('Error searching rooms:', err);
        } finally {
            setSearchLoading(false);
        }
    };

    const handleRetry = () => {
        loadAvailableRooms();
    };

    const handleBackToHome = () => {
        navigate('/');
    };

    if (loading) {
        return (
            <div className="rooms-page">
                <div className="rooms-header">
                    <button className="back-button" onClick={handleBackToHome}>
                        ← Back to Home
                    </button>
                    <h1>Our Luxury Rooms</h1>
                    <p>Loading available rooms...</p>
                </div>
                <Loader />
            </div>
        );
    }

    return (
        <div className="rooms-page">
            <div className="rooms-header">

                <h1>Our Luxury Rooms</h1>
                <p>Discover your perfect stay with our selection of beautifully appointed rooms and suites</p>
            </div>

            {/* Room Filters */}
            <RoomFilters
                onFiltersChange={handleFiltersChange}
                loading={searchLoading}
            />

            {/* Error Display */}
            {error && (
                <div className="error-message">
                    <p>{error}</p>
                    <button onClick={handleRetry} className="retry-btn">
                        Try Again
                    </button>
                </div>
            )}

            <div className="rooms-content">
                {/* Results Summary */}
                <div className="results-summary">
                    <p>
                        Showing {filteredRooms.length} of {rooms.length} available rooms
                        {searchLoading && ' (searching...)'}
                    </p>
                </div>

                {/* Rooms Grid */}
                {searchLoading ? (
                    <Loader />
                ) : filteredRooms.length === 0 ? (
                    <div className="no-rooms-found">
                        <h3>No rooms match your search criteria</h3>
                        <p>Try adjusting your filters or check back later for new availability</p>
                        <div className="no-rooms-actions">
                            <button onClick={() => handleFiltersChange({})} className="btn btn-primary">
                                Show All Rooms
                            </button>
                            <button onClick={handleBackToHome} className="btn btn-secondary">
                                Back to Home
                            </button>
                        </div>
                    </div>
                ) : (
                    <div className="rooms-grid">
                        {filteredRooms.map(room => (
                            <RoomCard
                                key={room.id}
                                room={room}
                            />
                        ))}
                    </div>
                )}
            </div>
        </div>
    );
};

export default RoomsPage;
