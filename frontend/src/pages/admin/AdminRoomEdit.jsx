import React, { useEffect, useState } from 'react';
import RoomForm from '../../components/rooms/RoomForm.jsx';
import { getRoom, updateRoom } from '../../api/room.js';
import { showToast } from '../../components/ui/Toast.jsx';
import { useNavigate, useParams } from 'react-router-dom';

export default function AdminRoomEdit() {
    const [loading, setLoading] = useState(true);
    const [saving, setSaving] = useState(false);
    const [room, setRoom] = useState(null);
    const navigate = useNavigate();
    const { id } = useParams();

    useEffect(() => {
        const load = async () => {
            try {
                const data = await getRoom(id);
                setRoom(data);
            } catch (e) {
                showToast(e.message || 'Failed to load room', 'error');
                navigate('/admin/rooms');
            } finally {
                setLoading(false);
            }
        };
        load();
    }, [id, navigate]);

    const handleSubmit = async (data) => {
        try {
            setSaving(true);
            await updateRoom(id, data);
            showToast('Room updated', 'success');
            navigate('/admin/rooms');
        } catch (e) {
            showToast(e.message || 'Failed to update room', 'error');
        } finally {
            setSaving(false);
        }
    };

    if (loading) return <div>Loading...</div>;

    return (
        <div>
            <h2 style={{ margin: 0, color: 'var(--color-navy)' }}>Edit Room</h2>
            <div style={{ marginTop: 'var(--spacing-lg)' }}>
                <RoomForm initialData={room} onSubmit={handleSubmit} loading={saving} />
            </div>
        </div>
    );
}