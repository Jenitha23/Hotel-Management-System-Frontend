import StatusDropdown from "./StatusDropdown.jsx";

export default function BookingsTable({ items, onEdit, onDelete, onChangeStatus }) {
    return (
        <div className="card">
            <table className="table">
                <thead>
                <tr>
                    <th>Booking ID</th>
                    <th>Customer</th>
                    <th>Room</th>
                    <th>Check-in</th>
                    <th>Check-out</th>
                    <th>Status</th>
                    <th style={{textAlign:"right"}}>Actions</th>
                </tr>
                </thead>
                <tbody>
                {items.length === 0 && (
                    <tr><td colSpan="7" style={{paddingTop:20,color:"var(--muted)"}}>No bookings found.</td></tr>
                )}
                {items.map(b => (
                    <tr key={b.bookingId} className="tr">
                        <td>#{b.bookingId}</td>
                        <td>{b.customerName ?? `CID:${b.customerId}`}</td>
                        <td>{b.roomType ?? b.roomId}</td>
                        <td>{formatDate(b.checkInDate)}</td>
                        <td>{formatDate(b.checkOutDate)}</td>
                        <td><span className={`badge ${b.status}`}>{b.status}</span></td>
                        <td>
                            <div className="actions">
                                <StatusDropdown
                                    value={b.status}
                                    onChange={(status) => onChangeStatus?.(b.bookingId, status)}
                                />
                                <button className="btn" onClick={()=>onEdit?.(b)}>Edit</button>
                                <button className="btn danger" onClick={()=>onDelete?.(b)}>Delete</button>
                            </div>
                        </td>
                    </tr>
                ))}
                </tbody>
            </table>
        </div>
    );
}

function formatDate(x){
    if(!x) return "-";
    const d = new Date(x);
    if (Number.isNaN(d.getTime())) return x; // already ISO string
    return d.toISOString().slice(0,10);
}

