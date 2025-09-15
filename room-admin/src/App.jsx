import { useEffect, useMemo, useState } from "react";
import RoomForm from "./components/RoomForm.jsx";
import RoomTable from "./components/RoomTable.jsx";
import Modal from "./components/Modal.jsx";
import Toast from "./components/Toast.jsx";
import { listRooms, createRoom, updateRoom, deleteRoom } from "./store/roomStore.js";

export default function App() {
    const [rooms, setRooms] = useState([]);
    const [query, setQuery] = useState("");
    const [onlyAvail, setOnlyAvail] = useState(false);

    const [openForm, setOpenForm] = useState(false);
    const [editing, setEditing] = useState(null);

    const [toast, setToast] = useState(null);
    function notify(text, type="success"){
        setToast({ text, type });
        setTimeout(()=> setToast(null), 1800);
    }

    function refresh(){ setRooms(listRooms()); }
    useEffect(()=>{ refresh(); }, []);

    const filtered = useMemo(() => {
        const q = query.trim().toLowerCase();
        return rooms.filter(r => {
            const inText = !q || r.type.toLowerCase().includes(q) || (r.description||"").toLowerCase().includes(q);
            const availOk = !onlyAvail || r.available;
            return inText && availOk;
        });
    }, [rooms, query, onlyAvail]);

    function onSave(form){
        if (editing) { updateRoom(editing.id, form); notify("Room updated"); }
        else { createRoom(form); notify("Room added"); }
        setEditing(null); setOpenForm(false); refresh();
    }

    function onEdit(room){ setEditing(room); setOpenForm(true); }

    function onDelete(id){
        if (confirm("Delete this room?")) { deleteRoom(id); notify("Room deleted", "danger"); refresh(); }
    }

    return (
        <>
            <div className="topbar">
                <div className="container topbar-inner">
                    <div className="brand"><span>🏝️</span><h2>Palm Beach — Admin</h2></div>
                    <button className="btn" onClick={()=>{ setEditing(null); setOpenForm(true); }}>+ Add Room</button>
                </div>
            </div>

            <div className="container page">
                <div className="card">
                    <h3 className="section-title">Rooms</h3>

                    <div className="toolbar">
                        <input className="input" placeholder="Search rooms (type or description)…"
                               value={query} onChange={e=>setQuery(e.target.value)} />
                        <div style={{display:"flex", alignItems:"center", gap:10}}>
                            <span style={{color:"var(--muted)"}}>Only available</span>
                            <label className="switch">
                                <input type="checkbox" checked={onlyAvail} onChange={e=>setOnlyAvail(e.target.checked)} />
                                <span className="slider"></span>
                            </label>
                        </div>
                    </div>

                    <RoomTable rooms={filtered} onEdit={onEdit} onDelete={onDelete} />
                </div>
            </div>

            <Modal open={openForm} title={editing ? "Edit Room" : "Add Room"} onClose={()=>{ setEditing(null); setOpenForm(false); }}>
                <RoomForm initial={editing ?? undefined} onSubmit={onSave} onCancel={()=>{ setEditing(null); setOpenForm(false); }} />
            </Modal>

            <Toast text={toast?.text} type={toast?.type} />
        </>
    );
}
