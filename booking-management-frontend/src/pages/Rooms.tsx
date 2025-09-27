import React from 'react';
import { useRooms } from '../hooks/useBookings';
import RoomCard from '../components/ RoomCard';

const Rooms: React.FC = () => {
    const { rooms, loading, error } = useRooms();

    const handleBookRoom = (roomId: number) => {
        // Navigate to booking form or show modal
        console.log('Booking room:', roomId);
    };

    return (
        <div className="container my-5">
            <h2 className="section-title text-center mb-5">Our Rooms</h2>

            {loading && <div className="text-center">Loading rooms...</div>}
            {error && <div className="alert alert-danger">{error}</div>}

            <div className="row">
                {rooms.map(room => (
                    <RoomCard
                        key={room.id}
                        room={room}
                        onBook={handleBookRoom}
                    />
                ))}
            </div>
        </div>
    );
};

export default Rooms;