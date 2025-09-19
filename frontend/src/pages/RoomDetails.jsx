import React, { useState, useEffect } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import Button from '../components/ui/Button.jsx';
import Badge from '../components/ui/Badge.jsx';
import { getRoom } from '../api/room.js';
import { showToast } from '../components/ui/Toast.jsx';

const RoomDetails = () => {
    const { id } = useParams();
    const navigate = useNavigate();
    const [room, setRoom] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchRoom = async () => {
            try {
                setLoading(true);
                const data = await getRoom(id);
                setRoom(data);
            } catch (error) {
                showToast(error.message || 'Failed to fetch room details', 'error');
                navigate('/rooms');
            } finally {
                setLoading(false);
            }
        };

        fetchRoom();
    }, [id, navigate]);

    if (loading) {
        return (
            <div style={{ minHeight: '100vh' }}>
                <header style={{
                    backgroundColor: 'white',
                    boxShadow: 'var(--shadow-soft)',
                    padding: 'var(--spacing-lg) 0'
                }}>
                    <div className="container">
                        <Link to="/rooms">
                            <Button variant="secondary">← Back to Rooms</Button>
                        </Link>
                    </div>
                </header>

                <div className="container" style={{ padding: 'var(--spacing-2xl) var(--spacing-lg)' }}>
                    <div style={{
                        display: 'flex',
                        justifyContent: 'center',
                        alignItems: 'center',
                        minHeight: '200px'
                    }}>
                        <div className="loading-spinner" style={{ width: '40px', height: '40px' }}></div>
                    </div>
                </div>
            </div>
        );
    }

    if (!room) {
        return (
            <div style={{ minHeight: '100vh' }}>
                <header style={{
                    backgroundColor: 'white',
                    boxShadow: 'var(--shadow-soft)',
                    padding: 'var(--spacing-lg) 0'
                }}>
                    <div className="container">
                        <Link to="/rooms">
                            <Button variant="secondary">← Back to Rooms</Button>
                        </Link>
                    </div>
                </header>

                <div className="container" style={{ padding: 'var(--spacing-2xl) var(--spacing-lg)' }}>
                    <div style={{
                        textAlign: 'center',
                        padding: 'var(--spacing-2xl)',
                        backgroundColor: 'white',
                        borderRadius: 'var(--border-radius-lg)',
                        boxShadow: 'var(--shadow-card)'
                    }}>
                        <h2 style={{ color: 'var(--color-navy)' }}>Room not found</h2>
                    </div>
                </div>
            </div>
        );
    }

    return (
        <div style={{ minHeight: '100vh' }}>
            <header style={{
                backgroundColor: 'white',
                boxShadow: 'var(--shadow-soft)',
                padding: 'var(--spacing-lg) 0'
            }}>
                <div className="container">
                    <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--spacing-md)' }}>
                        <Link to="/rooms">
                            <Button variant="secondary">← Back to Rooms</Button>
                        </Link>
                        <h1 style={{
                            fontSize: 'var(--text-3xl)',
                            fontWeight: '700',
                            color: 'var(--color-navy)',
                            margin: 0
                        }}>
                            Room {room.roomNumber}
                        </h1>
                    </div>
                </div>
            </header>

            <div className="container" style={{ padding: 'var(--spacing-2xl) var(--spacing-lg)' }}>
                <div style={{
                    backgroundColor: 'white',
                    borderRadius: 'var(--border-radius-lg)',
                    boxShadow: 'var(--shadow-card)',
                    overflow: 'hidden'
                }}>
                    {/* Room Image Placeholder */}
                    <div style={{
                        height: '300px',
                        background: 'linear-gradient(135deg, var(--color-teal), var(--color-coral))',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        fontSize: '72px'
                    }}>
                        🏨
                    </div>

                    <div style={{ padding: 'var(--spacing-2xl)' }}>
                        <div style={{
                            display: 'flex',
                            justifyContent: 'space-between',
                            alignItems: 'flex-start',
                            marginBottom: 'var(--spacing-2xl)',
                            flexWrap: 'wrap',
                            gap: 'var(--spacing-lg)'
                        }}>
                            <div>
                                <h1 style={{
                                    fontSize: 'var(--text-4xl)',
                                    fontWeight: '700',
                                    color: 'var(--color-navy)',
                                    margin: '0 0 var(--spacing-sm) 0'
                                }}>
                                    Room {room.roomNumber}
                                </h1>
                                <Badge variant={room.available ? 'success' : 'danger'}>
                                    {room.available ? 'Available' : 'Unavailable'}
                                </Badge>
                            </div>

                            <div style={{ textAlign: 'right' }}>
                                <div style={{
                                    fontSize: 'var(--text-4xl)',
                                    fontWeight: '700',
                                    color: 'var(--color-teal)',
                                    marginBottom: 'var(--spacing-xs)'
                                }}>
                                    ${Number(room.pricePerNight).toFixed(2)}
                                </div>
                                <div style={{
                                    fontSize: 'var(--text-lg)',
                                    color: '#666'
                                }}>
                                    per night
                                </div>
                            </div>
                        </div>

                        <div style={{
                            display: 'grid',
                            gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
                            gap: 'var(--spacing-xl)',
                            marginBottom: 'var(--spacing-2xl)'
                        }}>
                            <div style={{
                                padding: 'var(--spacing-lg)',
                                backgroundColor: 'var(--color-sand)',
                                borderRadius: 'var(--border-radius-md)'
                            }}>
                                <h3 style={{
                                    fontSize: 'var(--text-lg)',
                                    fontWeight: '700',
                                    color: 'var(--color-navy)',
                                    marginBottom: 'var(--spacing-sm)'
                                }}>
                                    Room Type
                                </h3>
                                <p style={{
                                    fontSize: 'var(--text-xl)',
                                    fontWeight: '600',
                                    color: 'var(--color-teal)',
                                    margin: 0
                                }}>
                                    {room.type}
                                </p>
                            </div>

                            <div style={{
                                padding: 'var(--spacing-lg)',
                                backgroundColor: 'var(--color-sand)',
                                borderRadius: 'var(--border-radius-md)'
                            }}>
                                <h3 style={{
                                    fontSize: 'var(--text-lg)',
                                    fontWeight: '700',
                                    color: 'var(--color-navy)',
                                    marginBottom: 'var(--spacing-sm)'
                                }}>
                                    Capacity
                                </h3>
                                <p style={{
                                    fontSize: 'var(--text-xl)',
                                    fontWeight: '600',
                                    color: 'var(--color-teal)',
                                    margin: 0
                                }}>
                                    {room.capacity} guests
                                </p>
                            </div>
                        </div>

                        {room.description && (
                            <div style={{ marginBottom: 'var(--spacing-2xl)' }}>
                                <h3 style={{
                                    fontSize: 'var(--text-xl)',
                                    fontWeight: '700',
                                    color: 'var(--color-navy)',
                                    marginBottom: 'var(--spacing-md)'
                                }}>
                                    Description
                                </h3>
                                <p style={{
                                    fontSize: 'var(--text-lg)',
                                    lineHeight: '1.6',
                                    color: '#666'
                                }}>
                                    {room.description}
                                </p>
                            </div>
                        )}

                        {room.available && (
                            <div style={{
                                padding: 'var(--spacing-xl)',
                                backgroundColor: 'var(--color-teal)',
                                borderRadius: 'var(--border-radius-md)',
                                textAlign: 'center',
                                color: 'white'
                            }}>
                                <h3 style={{
                                    fontSize: 'var(--text-xl)',
                                    fontWeight: '700',
                                    margin: '0 0 var(--spacing-md) 0'
                                }}>
                                    Ready to Book?
                                </h3>
                                <p style={{
                                    margin: '0 0 var(--spacing-lg) 0',
                                    opacity: '0.9'
                                }}>
                                    This room is available for immediate booking.
                                </p>
                                <Button
                                    style={{
                                        backgroundColor: 'white',
                                        color: 'var(--color-teal)',
                                        padding: 'var(--spacing-md) var(--spacing-2xl)'
                                    }}
                                >
                                    Book Now
                                </Button>
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default RoomDetails;