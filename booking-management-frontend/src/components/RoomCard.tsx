import React from 'react';
import type { Room } from '../types';

interface RoomCardProps {
    room: Room;
    onBook: (roomId: number) => void;
}

const RoomCard: React.FC<RoomCardProps> = ({ room, onBook }) => {
    return (
        <div className="col-md-6 col-lg-4 mb-4">
            <div className="card room-card h-100">
                <div className="position-relative">
                    <img
                        src={room.image || 'https://images.unsplash.com/photo-1631049307264-da0ec9d70304?ixlib=rb-4.0.3&auto=format&fit=crop&w=500&h=300&q=60'}
                        className="card-img-top room-image"
                        alt={`${room.type} Room`}
                    />
                    <div className="price-tag">${room.price}/night</div>
                </div>
                <div className="card-body d-flex flex-column">
                    <h5 className="card-title">{room.type} Room #{room.roomNumber}</h5>
                    <p className="card-text flex-grow-1">{room.description}</p>
                    <div className="mb-3">
                        {room.features?.map((feature, index) => (
                            <span key={index} className="badge bg-light text-dark me-1 mb-1">
                {feature}
              </span>
                        ))}
                    </div>
                    <button
                        className="btn btn-primary w-100 mt-auto"
                        onClick={() => onBook(room.id)}
                        disabled={!room.available}
                    >
                        {room.available ? 'Book Now' : 'Not Available'}
                    </button>
                </div>
            </div>
        </div>
    );
};

export default RoomCard;