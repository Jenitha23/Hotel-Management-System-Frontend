import { useEffect, useState } from "react";

export default function BookingDetailsModal({ open, booking, onClose, onSave }) {
    const [form,setForm] = useState({
        roomType:"STANDARD",
        checkInDate:"",
        checkOutDate:"",
        specialRequest:""
    });

    useEffect(()=>{
        if(booking){
            setForm({
                roomType: booking.roomType ?? "STANDARD",
                checkInDate: safeDate(booking.checkInDate),
                checkOutDate: safeDate(booking.checkOutDate),
                specialRequest: booking.specialRequest ?? ""
            });
        }
    }, [booking, open]);

    if(!open) return null;

    function update(k,v){ setForm(prev=>({...prev,[k]:v})); }

    return (
        <div className="modal-backdrop" onClick={onClose}>
            <div className="modal" onClick={(e)=>e.stopPropagation()}>
                <h2>Edit Booking #{booking?.bookingId}</h2>
                <div className="grid">
                    <div>
                        <div style={{fontSize:12,color:"var(--muted)",marginBottom:6}}>Room Type</div>
                        <select className="select" value={form.roomType} onChange={e=>update("roomType", e.target.value)}>
                            <option value="STANDARD">STANDARD</option>
                            <option value="DELUXE">DELUXE</option>
                            <option value="SUITE">SUITE</option>
                        </select>
                    </div>
                    <div>
                        <div style={{fontSize:12,color:"var(--muted)",marginBottom:6}}>Check-in</div>
                        <input className="input" type="date" value={form.checkInDate} onChange={e=>update("checkInDate", e.target.value)} />
                    </div>
                    <div>
                        <div style={{fontSize:12,color:"var(--muted)",marginBottom:6}}>Check-out</div>
                        <input className="input" type="date" value={form.checkOutDate} onChange={e=>update("checkOutDate", e.target.value)} />
                    </div>
                    <div style={{gridColumn:"1/-1"}}>
                        <div style={{fontSize:12,color:"var(--muted)",marginBottom:6}}>Special Request</div>
                        <textarea className="input" rows="3" value={form.specialRequest} onChange={e=>update("specialRequest", e.target.value)} />
                    </div>
                </div>
                <div className="footer">
                    <button className="btn" onClick={onClose}>Cancel</button>
                    <button
                        className="btn primary"
                        onClick={()=>onSave?.(booking.bookingId, form)}
                    >
                        Save Changes
                    </button>
                </div>
            </div>
        </div>
    );
}

function safeDate(x){
    if(!x) return "";
    const d = new Date(x);
    if (Number.isNaN(d.getTime())) return x.slice(0,10);
    return d.toISOString().slice(0,10);
}
