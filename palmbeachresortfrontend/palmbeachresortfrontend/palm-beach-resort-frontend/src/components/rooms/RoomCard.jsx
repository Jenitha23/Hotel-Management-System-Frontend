import React, { useState, useRef, useEffect } from 'react';
import { Link } from 'react-router-dom';
import './RoomCard.css';

const RoomCard = ({ room }) => {
    const [imageLoaded, setImageLoaded] = useState(false);
    const [imageError, setImageError] = useState(false);
    const imgRef = useRef(null);

    // Get room image with fallback
    const getRoomImage = () => {
        if (room.imageUrl) {
            return room.imageUrl;
        }

        // Fallback images based on room type
        const roomImages = {
            STANDARD: '/images/rooms/standard.jpg',
            DELUXE: '/images/rooms/deluxe.jpg',
            SUITE: '/images/rooms/suite.jpg',
            PRESIDENTIAL: '/images/rooms/presidential.jpg',
            HONEYMOON: '/images/rooms/honeymoon.jpg'
        };

        return roomImages[room.roomType] || '/images/rooms/default.jpg';
    };

    const handleImageLoad = () => {
        setImageLoaded(true);
        setImageError(false);
    };

    const handleImageError = () => {
        setImageLoaded(true);
        setImageError(true);
    };

    // Get room type color class
    const getRoomTypeClass = (roomType) => {
        const typeClasses = {
            STANDARD: 'standard',
            DELUXE: 'deluxe',
            SUITE: 'suite',
            PRESIDENTIAL: 'presidential',
            HONEYMOON: 'honeymoon'
        };
        return typeClasses[roomType] || 'standard';
    };

    // Get room icon based on capacity
    const getCapacityIcon = (capacity) => {
        if (capacity === 1) return '👤';
        if (capacity === 2) return '👥';
        if (capacity <= 4) return '👨‍👩‍👧';
        return '👨‍👩‍👧‍👦';
    };

    const imageUrl = getRoomImage();
    const roomTypeClass = getRoomTypeClass(room.roomType);
    const capacityIcon = getCapacityIcon(room.capacity);

    return (
        <div className="room-card">
            <div className={`room-image ${!imageLoaded ? 'loading' : ''}`}>
                {/* Loading spinner */}
                {!imageLoaded && !imageError && (
                    <div className="image-loading"></div>
                )}

                {/* Image placeholder for errors */}
                {(imageError || !imageLoaded) && (
                    <div className="image-placeholder">
                        🏨
                    </div>
                )}

                {/* Actual image */}
                <img
                    ref={imgRef}
                    src={imageUrl}
                    alt={`Room ${room.roomNumber} - ${room.roomType}`}
                    onLoad={handleImageLoad}
                    onError={handleImageError}
                    style={{
                        opacity: imageLoaded && !imageError ? 1 : 0,
                        position: imageLoaded && !imageError ? 'relative' : 'absolute'
                    }}
                />

                {/* Room status badge */}
                {!room.available && (
                    <div className="room-status unavailable">
                        Unavailable
                    </div>
                )}
            </div>

            <div className="room-content">
                <div className="room-header">
                    <h3 className="room-number">Room {room.roomNumber}</h3>
                    <span className={`room-type ${roomTypeClass}`}>
                        {room.roomType}
                    </span>
                </div>

                <p className="room-description">
                    {room.description}
                </p>

                <div className="room-features">
                    <div className="feature">
                        <span className="icon">{capacityIcon}</span>
                        <span>Up to {room.capacity} guests</span>
                    </div>
                    <div className="feature">
                        <span className="icon">💰</span>
                        <span>${room.price}/night</span>
                    </div>
                </div>

                <div className="room-footer">
                    <div className="room-price">
                        <span className="price">${room.price}</span>
                        <span className="period">/ night</span>
                    </div>

                    {room.available ? (
                        <Link
                            to={`/rooms/${room.id}`}
                            className="view-details-btn"
                        >
                            View Details
                        </Link>
                    ) : (
                        <button className="view-details-btn disabled" disabled>
                            Unavailable
                        </button>
                    )}
                </div>
            </div>
        </div>
    );
};

export default RoomCard;