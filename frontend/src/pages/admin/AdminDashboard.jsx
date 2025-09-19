import React, { useEffect, useState } from 'react';
import { listRooms } from '../../api/room.js';

export default function AdminDashboard() {
    const [loading, setLoading] = useState(true);
    const [stats, setStats] = useState({ total: 0, available: 0, avgPrice: 0 });

    useEffect(() => {
        const load = async () => {
            try {
                const rooms = await listRooms({});
                const total = rooms.length;
                const available = rooms.filter(r => r.available).length;
                const avgPrice = total ? rooms.reduce((s, r) => s + Number(r.pricePerNight || 0), 0) / total : 0;
                setStats({ total, available, avgPrice });
            } finally {
                setLoading(false);
            }
        };
        load();
    }, []);

    if (loading) return <div>Loading...</div>;

    return (
        <div>
            <h2 style={{ margin: 0, color: 'var(--color-navy)' }}>Dashboard</h2>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: 'var(--spacing-lg)', marginTop: 'var(--spacing-lg)' }}>
                <div style={{ background: 'white', padding: 'var(--spacing-lg)', borderRadius: 'var(--border-radius-lg)', boxShadow: 'var(--shadow-card)' }}>
                    <div style={{ color: '#666' }}>Total Rooms</div>
                    <div style={{ fontSize: '32px', fontWeight: 700, color: 'var(--color-navy)' }}>{stats.total}</div>
                </div>
                <div style={{ background: 'white', padding: 'var(--spacing-lg)', borderRadius: 'var(--border-radius-lg)', boxShadow: 'var(--shadow-card)' }}>
                    <div style={{ color: '#666' }}>Available</div>
                    <div style={{ fontSize: '32px', fontWeight: 700, color: 'var(--color-navy)' }}>{stats.available}</div>
                </div>
                <div style={{ background: 'white', padding: 'var(--spacing-lg)', borderRadius: 'var(--border-radius-lg)', boxShadow: 'var(--shadow-card)' }}>
                    <div style={{ color: '#666' }}>Avg Price</div>
                    <div style={{ fontSize: '32px', fontWeight: 700, color: 'var(--color-navy)' }}>${stats.avgPrice.toFixed(2)}</div>
                </div>
            </div>
        </div>
    );
}