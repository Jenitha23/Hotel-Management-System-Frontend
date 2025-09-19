import React from 'react';
import { useNavigate } from 'react-router-dom';
import Card from '../ui/Card.jsx';
import Badge from '../ui/Badge.jsx';

const RoomCard = ({ room }) => {
    const navigate = useNavigate();

    const handleClick = () => {
        navigate(`/rooms/${room.id}`);
    };

    return (
        <Card
            onClick={handleClick}
            style={{ cursor: 'pointer', textAlign: 'left' }}
        >
            <div style={{ padding: 'var(--spacing-lg)' }}>
                <div style={{
                    display: 'flex',
                    justifyContent: 'space-between',
                    alignItems: 'flex-start',
                    marginBottom: 'var(--spacing-md)'
                }}>
                    <h3 style={{
                        margin: '0',
                        fontSize: 'var(--text-xl)',
                        color: 'var(--color-navy)',
                        fontWeight: '700'
                    }}>
                        Room {room.roomNumber}
                    </h3>
                    <Badge variant={room.available ? 'success' : 'danger'}>
                        {room.available ? 'Available' : 'Unavailable'}
                    </Badge>
                </div>

                <div style={{ marginBottom: 'var(--spacing-md)' }}>
                    <div style={{
                        display: 'flex',
                        alignItems: 'center',
                        gap: 'var(--spacing-sm)',
                        marginBottom: 'var(--spacing-sm)'
                    }}>
            <span style={{ fontWeight: '600', color: 'var(--color-navy)' }}>
              Type:
            </span>
                        <span style={{
                            padding: '2px 8px',
                            backgroundColor: 'var(--color-sand)',
                            borderRadius: 'var(--border-radius-sm)',
                            fontSize: 'var(--text-sm)',
                            fontWeight: '500'
                        }}>
              {room.type}
            </span>
                    </div>
                    <div style={{
                        display: 'flex',
                        alignItems: 'center',
                        gap: 'var(--spacing-sm)'
                    }}>
            <span style={{ fontWeight: '600', color: 'var(--color-navy)' }}>
              Capacity:
            </span>
                        <span>{room.capacity} guests</span>
                    </div>
                </div>

                <div style={{
                    fontSize: 'var(--text-2xl)',
                    fontWeight: '700',
                    color: 'var(--color-teal)'
                }}>
                    ${Number(room.pricePerNight).toFixed(2)}
                    <span style={{
                        fontSize: 'var(--text-sm)',
                        fontWeight: '500',
                        color: 'var(--color-navy)',
                        marginLeft: 'var(--spacing-xs)'
                    }}>
            / night
          </span>
                </div>

                {room.description && (
                    <p style={{
                        margin: 'var(--spacing-md) 0 0 0',
                        color: '#666',
                        fontSize: 'var(--text-sm)',
                        lineHeight: '1.4'
                    }}>
                        {room.description}
                    </p>
                )}
            </div>
        </Card>
    );
};

export default RoomCard;