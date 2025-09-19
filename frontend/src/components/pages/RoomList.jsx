import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import RoomCard from '../components/rooms/RoomCard.jsx';
import RoomFilters from '../components/rooms/RoomFilters.jsx';
import Button from '../components/ui/Button.jsx';
import { listRooms } from '../api/rooms.js';
import { showToast } from '../components/ui/Toast.jsx';

const RoomsList = () => {
    const [rooms, setRooms] = useState([]);
    const [loading, setLoading] = useState(true);
    const [filters, setFilters] = useState(() => {
        const saved = localStorage.getItem('roomFilters');
        return saved ? JSON.parse(saved) : { type: 'ALL', available: false };
    });

    const fetchRooms = async () => {
        try {
            setLoading(true);
            const apiFilters = {
                ...(filters.type && filters.type !== 'ALL' && { type: filters.type }),
                ...(filters.available && { available: true })
            };

            const data = await listRooms(apiFilters);
            setRooms(data);
        } catch (error) {
            showToast(error.message || 'Failed to fetch rooms', 'error');
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchRooms();
    }, [filters]);

    useEffect(() => {
        localStorage.setItem('roomFilters', JSON.stringify(filters));
    }, [filters]);

    const handleFiltersChange = (newFilters) => {
        setFilters(newFilters);
    };

    if (loading) {
        return (
            <div style={{ minHeight: '100vh' }}>
                <header style={{
                    backgroundColor: 'white',
                    boxShadow: 'var(--shadow-soft)',
                    padding: 'var(--spacing-lg) 0'
                }}>
                    <div className="container">
                        <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--spacing-md)' }}>
                            <Link to="/">
                                <Button variant="secondary">← Back to Home</Button>
                            </Link>
                            <h1 style={{
                                fontSize: 'var(--text-3xl)',
                                fontWeight: '700',
                                color: 'var(--color-navy)',
                                margin: 0
                            }}>
                                Our Rooms
                            </h1>
                        </div>
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

    return (
        <div style={{ minHeight: '100vh' }}>
            <header style={{
                backgroundColor: 'white',
                boxShadow: 'var(--shadow-soft)',
                padding: 'var(--spacing-lg) 0'
            }}>
                <div className="container">
                    <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--spacing-md)' }}>
                        <Link to="/">
                            <Button variant="secondary">← Back to Home</Button>
                        </Link>
                        <h1 style={{
                            fontSize: 'var(--text-3xl)',
                            fontWeight: '700',
                            color: 'var(--color-navy)',
                            margin: 0
                        }}>
                            Our Rooms
                        </h1>
                    </div>
                </div>
            </header>

            <div className="container" style={{ padding: 'var(--spacing-2xl) var(--spacing-lg)' }}>
                <RoomFilters
                    filters={filters}
                    onFiltersChange={handleFiltersChange}
                />

                {rooms.length === 0 ? (
                    <div style={{
                        textAlign: 'center',
                        padding: 'var(--spacing-2xl)',
                        backgroundColor: 'white',
                        borderRadius: 'var(--border-radius-lg)',
                        boxShadow: 'var(--shadow-card)'
                    }}>
                        <h3 style={{
                            fontSize: 'var(--text-xl)',
                            color: 'var(--color-navy)',
                            marginBottom: 'var(--spacing-md)'
                        }}>
                            No rooms found
                        </h3>
                        <p style={{ color: '#666', marginBottom: 'var(--spacing-lg)' }}>
                            Try adjusting your filters to see more results.
                        </p>
                        <Button onClick={() => setFilters({ type: 'ALL', available: false })}>
                            Clear Filters
                        </Button>
                    </div>
                ) : (
                    <>
                        <div style={{
                            display: 'flex',
                            justifyContent: 'space-between',
                            alignItems: 'center',
                            marginBottom: 'var(--spacing-lg)'
                        }}>
                            <h2 style={{
                                fontSize: 'var(--text-xl)',
                                color: 'var(--color-navy)',
                                margin: 0
                            }}>
                                {rooms.length} room{rooms.length !== 1 ? 's' : ''} found
                            </h2>
                        </div>

                        <div style={{
                            display: 'grid',
                            gridTemplateColumns: 'repeat(auto-fit, minmax(350px, 1fr))',
                            gap: 'var(--spacing-xl)'
                        }}>
                            {rooms.map((room) => (
                                <RoomCard key={room.id} room={room} />
                            ))}
                        </div>
                    </>
                )}
            </div>
        </div>
    );
};

export default RoomsList;