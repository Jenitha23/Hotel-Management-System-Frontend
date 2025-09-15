export default function RoomTable({ rooms, onEdit, onDelete }) {
    if (!rooms?.length) return <p style={{margin:0}}>No rooms yet. Click <b>“+ Add Room”</b>.</p>;

    return (
        <div style={{overflowX:"auto"}}>
            <table className="table">
                <thead>
                <tr>
                    <th style={{width:60}}>#</th>
                    <th>Type</th>
                    <th style={{width:140}}>Availability</th>
                    <th>Description</th>
                    <th style={{width:210}}>Actions</th>
                </tr>
                </thead>
                <tbody>
                {rooms.map((r, i) => (
                    <tr key={r.id}>
                        <td>{i + 1}</td>
                        <td style={{fontWeight:600}}>{r.type}</td>
                        <td>
                <span className={`badge ${r.available ? "green" : "red"}`}>
                  {r.available ? "Available" : "Unavailable"}
                </span>
                        </td>
                        <td>{r.description || "—"}</td>
                        <td className="actions">
                            <button className="btn btn-ghost" onClick={()=>onEdit(r)}>✏️ Edit</button>
                            <button className="btn btn-danger" onClick={()=>onDelete(r.id)}>🗑 Delete</button>
                        </td>
                    </tr>
                ))}
                </tbody>
            </table>
        </div>
    );
}
