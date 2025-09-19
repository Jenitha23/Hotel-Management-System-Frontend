import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import Button from '../../components/ui/Button.jsx';
import Card from '../../components/ui/Card.jsx';
import ConfirmDialog from '../../components/dialogs/confirmDialog.jsx';
import { listRooms, deleteRoom } from '../../api/room.js';
import { showToast } from '../../components/ui/Toast.jsx';

export default function AdminRooms() {
    const [rooms, setRooms] = useState([]);
    const [loading, setLoading] = useState(true);
    const [confirm, setConfirm] = useState({ open: false, id: null });
    const [deleting, setDeleting] = useState(false);

    const fetchRooms = async () => {
        try {
            setLoading(true);
            const data = await listRooms({});
            setRooms(data);
        } catch (e) {
            showToast(e.message || 'Failed to load rooms', 'error');
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => { fetchRooms(); }, []);

    const onDelete = async () => {
        if (!confirm.id) return;
        try {
            setDeleting(true);
            await deleteRoom(confirm.id);
            showToast('Room deleted', 'success');
            setConfirm({ open: false, id: null });
            fetchRooms();
        } catch (e) {
            showToast(e.message || 'Failed to delete room', 'error');
        } finally {
            setDeleting(false);
        }
    };

    return (
        <div>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 'var(--spacing-lg)' }}>
                <h2 style={{ margin: 0, color: 'var(--color-navy)' }}>Rooms</h2>
                <Link to="/admin/rooms/new"><Button>New Room</Button></Link>
            </div>

            {loading ? (
                <div>Loading...</div>
            ) : rooms.length === 0 ? (
                <Card>
                    <div style={{ padding: 'var(--spacing-lg)' }}>
                        <p style={{ margin: 0 }}>No rooms yet.</p>
                    </div>
                </Card>
            ) : (
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))', gap: 'var(--spacing-lg)' }}>
                    {rooms.map(room => (
                        <Card key={room.id}>
                            <div style={{ padding: 'var(--spacing-lg)' }}>
                                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'start' }}>
                                    <div>
                                        <div style={{ fontWeight: 700, color: 'var(--color-navy)' }}>Room {room.roomNumber}</div>
                                        <div style={{ color: '#666' }}>{room.type} • {room.capacity} guests</div>
                                    </div>
                                    <div style={{ fontWeight: 700, color: 'var(--color-teal)' }}>${Number(room.pricePerNight).toFixed(2)}</div>
                                </div>

                                <div style={{ marginTop: 'var(--spacing-md)', display: 'flex', gap: 'var(--spacing-sm)' }}>
                                    <Link to={`/admin/rooms/${room.id}/edit`}><Button variant="secondary">Edit</Button></Link>
                                    <Button variant="danger" onClick={() => setConfirm({ open: true, id: room.id })}>Delete</Button>
                                </div>
                            </div>
                        </Card>
                    ))}
                </div>
            )}

            <ConfirmDialog
                isOpen={confirm.open}
                onClose={() => setConfirm({ open: false, id: null })}
                onConfirm={onDelete}
                loading={deleting}
                title="Delete room?"
                message="This action cannot be undone."
                confirmText="Delete"
            />
        </div>
    );
}