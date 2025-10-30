import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { roomService } from '../../services/roomService';
import { useAuth } from '../../context/AuthContext';
import Loader from '../../components/ui/Loader';
import './RoomDetailsPage.css';

const RoomDetailsPage = () => {
    const { id } = useParams();
    const { user } = useAuth();
    const [room, setRoom] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');

    useEffect(() => {
        loadRoomDetails();
    }, [id]);

    const loadRoomDetails = async () => {
        try {
            setLoading(true);
            setError('');
            const response = await roomService.getRoomById(id);
            setRoom(response.data);
        } catch (err) {
            setError('Room not found or unavailable.');
            console.error('Error loading room details:', err);
        } finally {
            setLoading(false);
        }
    };

    const getRoomImage = () => {
        if (room.imageUrl) return room.imageUrl;

        const roomImages = {
            STANDARD: '/images/rooms/standard.jpg',
            DELUXE: '/images/rooms/deluxe.jpg',
            SUITE: '/images/rooms/suite.jpg',
            PRESIDENTIAL: '/images/rooms/presidential.jpg',
            HONEYMOON: '/images/rooms/honeymoon.jpg'
        };

        return roomImages[room.roomType] || '/images/rooms/default.jpg';
    };

    if (loading) return <Loader />;
    if (error) return <div className="error-page">{error}</div>;
    if (!room) return <div className="error-page">Room not found.</div>;

    return (
        <div className="room-details-page">
            <div className="room-details-header">
                <Link to="/rooms" className="back-link">← Back to Rooms</Link>
                <h1>Room {room.roomNumber} - {room.roomType}</h1>
            </div>

            <div className="room-details-content">
                <div className="room-gallery">
                    <img
                        src={getRoomImage()}
                        alt={`Room ${room.roomNumber}`}
                        className="room-main-image"
                    />
                </div>

                <div className="room-info">
                    <div className="room-status-badge">
                        <span className={`status ${room.available ? 'available' : 'unavailable'}`}>
                            {room.available ? 'Available' : 'Unavailable'}
                        </span>
                    </div>

                    <div className="room-pricing">
                        <div className="price">${room.price}</div>
                        <div className="price-period">per night</div>
                    </div>

                    <div className="room-features">
                        <div className="feature">
                            <span className="icon">👥</span>
                            <span>Capacity: {room.capacity} guests</span>
                        </div>
                        <div className="feature">
                            <span className="icon">🛏️</span>
                            <span>
                                {room.capacity <= 2 ? 'King/Queen Bed' :
                                    room.capacity <= 4 ? 'Multiple Beds' : 'Suite Configuration'}
                            </span>
                        </div>
                        <div className="feature">
                            <span className="icon">🏷️</span>
                            <span>Type: {room.roomType}</span>
                        </div>
                    </div>

                    <div className="room-description">
                        <h3>Room Description</h3>
                        <p>{room.description}</p>
                    </div>

                    <div className="room-amenities">
                        <h3>Amenities Included</h3>
                        <div className="amenities-list">
                            <div className="amenity">✓ Free WiFi</div>
                            <div className="amenity">✓ Air Conditioning</div>
                            <div className="amenity">✓ Flat Screen TV</div>
                            <div className="amenity">✓ Mini Bar</div>
                            <div className="amenity">✓ Safe Deposit Box</div>
                            <div className="amenity">✓ Coffee Maker</div>
                            {room.roomType !== 'STANDARD' && (
                                <>
                                    <div className="amenity">✓ Ocean View</div>
                                    <div className="amenity">✓ Balcony</div>
                                </>
                            )}
                            {room.roomType === 'SUITE' && (
                                <div className="amenity">✓ Separate Living Area</div>
                            )}
                            {room.roomType === 'PRESIDENTIAL' && (
                                <div className="amenity">✓ Butler Service</div>
                            )}
                        </div>
                    </div>

                    <div className="room-actions">
                        {room.available ? (
                            <div className="booking-actions">
                                {user ? (
                                    <Link
                                        to={`/book-room/${room.id}`}
                                        className="btn btn-primary btn-large"
                                    >
                                        Book This Room
                                    </Link>
                                ) : (
                                    <Link to="/login" className="btn btn-primary btn-large">
                                        Login to Book
                                    </Link>
                                )}
                                <button className="btn btn-secondary">
                                    Contact for Details
                                </button>
                            </div>
                        ) : (
                            <div className="unavailable-message">
                                <p>This room is currently unavailable for booking.</p>
                                <Link to="/rooms" className="btn btn-primary">
                                    View Available Rooms
                                </Link>
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default RoomDetailsPage;