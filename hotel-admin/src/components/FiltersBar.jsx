import { useEffect, useState } from "react";

const STATUSES = ["ALL","PENDING","CONFIRMED","CANCELLED","COMPLETED"];

export default function FiltersBar({ onChange, initial }) {
    const [status,setStatus] = useState(initial?.status || "ALL");
    const [roomType,setRoomType] = useState(initial?.roomType || "ALL");
    const [date,setDate] = useState(initial?.date || "");

    useEffect(()=>{ onChange?.({status, roomType, date}); }, [status,roomType,date]);

    return (
        <div className="card" style={{marginBottom:16}}>
            <div className="row">
                <div>
                    <div style={{fontSize:12,color:"var(--muted)",marginBottom:6}}>Status</div>
                    <select className="select" value={status} onChange={e=>setStatus(e.target.value)}>
                        {STATUSES.map(s => <option key={s} value={s}>{s}</option>)}
                    </select>
                </div>
                <div>
                    <div style={{fontSize:12,color:"var(--muted)",marginBottom:6}}>Room Type</div>
                    <select className="select" value={roomType} onChange={e=>setRoomType(e.target.value)}>
                        <option value="ALL">ALL</option>
                        <option value="STANDARD">STANDARD</option>
                        <option value="DELUXE">DELUXE</option>
                        <option value="SUITE">SUITE</option>
                    </select>
                </div>
                <div>
                    <div style={{fontSize:12,color:"var(--muted)",marginBottom:6}}>Date</div>
                    <input className="input" type="date" value={date} onChange={e=>setDate(e.target.value)} />
                </div>
                <div style={{display:"flex",alignItems:"end"}}>
                    <button className="btn" onClick={()=>{ setStatus("ALL"); setRoomType("ALL"); setDate(""); }}>
                        Clear Filters
                    </button>
                </div>
            </div>
        </div>
    );
}

