import React, { useState } from 'react';
import RoomForm from '../../components/rooms/RoomForm.jsx';
import { createRoom } from '../../api/room.js';
import { showToast } from '../../components/ui/Toast.jsx';
import { useNavigate } from 'react-router-dom';

export default function AdminRoomNew() {
    const [loading, setLoading] = useState(false);
    const navigate = useNavigate();

    const handleSubmit = async (data) => {
        try {
            setLoading(true);
            await createRoom(data);
            showToast('Room created', 'success');
            navigate('/admin/rooms');
        } catch (e) {
            showToast(e.message || 'Failed to create room', 'error');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div>
            <h2 style={{ margin: 0, color: 'var(--color-navy)' }}>New Room</h2>
            <div style={{ marginTop: 'var(--spacing-lg)' }}>
                <RoomForm onSubmit={handleSubmit} loading={loading} />
            </div>
        </div>
    );
}