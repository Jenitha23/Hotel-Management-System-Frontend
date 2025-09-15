import { useMemo, useState } from "react";
import { ROOMS, ROOM_TYPES } from "../data/roomData.js";
import { Link } from "react-router-dom";

function Stars({ value=0 }) {
    const full = Math.floor(value), half = value - full >= 0.5, empty = 5 - full - (half?1:0);
    return <span className="stars">{"★".repeat(full)}{half?"☆":""}{"☆".repeat(empty)}</span>;
}

export default function Rooms(){
    const [q,setQ] = useState("");
    const [type,setType] = useState("All");
    const [min,setMin] = useState(0);
    const [max,setMax] = useState(999);
    const [minRating,setMinRating] = useState(0);

    const filtered = useMemo(() => {
        const query = q.trim().toLowerCase();
        return ROOMS.filter(r => {
            const matchText = !query || r.name.toLowerCase().includes(query) || r.description.toLowerCase().includes(query);
            const matchType = type === "All" || r.type === type;
            const matchPrice = r.price >= (+min || 0) && r.price <= (+max || 999999);
            const matchRating = r.rating >= (+minRating || 0);
            return matchText && matchType && matchPrice && matchRating;
        });
    }, [q,type,min,max,minRating]);

    const reset = () => { setQ(""); setType("All"); setMin(0); setMax(999); setMinRating(0); };

    return (
        <section className="section">
            <div className="container">
                <h2 className="section-title">Our Rooms</h2>

                <div className="filters-row">
                    <input className="input" placeholder="Search (name or description)…" value={q} onChange={e=>setQ(e.target.value)} />
                    <select className="select" value={type} onChange={e=>setType(e.target.value)}>
                        {ROOM_TYPES.map(t => <option key={t} value={t}>{t}</option>)}
                    </select>
                    <input className="input" type="number" min="0" placeholder="Min $" value={min} onChange={e=>setMin(e.target.value)} />
                    <input className="input" type="number" min="0" placeholder="Max $" value={max} onChange={e=>setMax(e.target.value)} />
                    <select className="select" value={minRating} onChange={e=>setMinRating(e.target.value)}>
                        <option value="0">Any rating</option>
                        <option value="3">3★ & up</option>
                        <option value="4">4★ & up</option>
                        <option value="4.5">4.5★ & up</option>
                    </select>
                    <button className="btn-grad" onClick={reset}>Reset</button>
                    <span style={{alignSelf:"center", color:"var(--muted)"}}>{filtered.length} result(s)</span>
                </div>

                <div className="grid-rooms">
                    {filtered.map(r => (
                        <article key={r.id} className="card-room">
                            <img src={r.image} alt={r.name} />
                            <div className="card-body">
                                <div className="card-meta"><span className="badge">{r.type}</span></div>
                                <h3 className="card-title">{r.name}</h3>
                                <div className="card-meta">
                                    <Stars value={r.rating} /><span>{r.rating.toFixed(1)}</span>
                                    <span>•</span><strong>${r.price}</strong><span>/ night</span>
                                </div>
                                <p style={{color:"#c9d6ff", margin:"6px 0 10px"}}>{r.description}</p>
                                <div className="card-actions">
                                    <Link className="btn-grad" to={`/booking/${r.id}`}>Book Now</Link>
                                </div>
                            </div>
                        </article>
                    ))}
                </div>
            </div>
        </section>
    );
}
