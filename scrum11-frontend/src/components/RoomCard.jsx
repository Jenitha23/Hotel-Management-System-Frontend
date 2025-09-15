// src/components/RoomCard.jsx
import { Link } from "react-router-dom";
import StarRating from "./StarRatings.jsx";

export default function RoomCard({ room }) {
    return (
        <div className="room-card">
            <div className="room-media">
                <img src={room.image} alt={room.name} loading="lazy" />
            </div>
            <div className="room-body">
                <div className="room-meta">
                    <span className="badge">{room.type}</span>
                </div>
                <h3 className="room-title">{room.name}</h3>
                <div className="room-meta" style={{display:"flex", gap:10, alignItems:"center"}}>
                    <StarRating value={room.rating} />
                    <span>{room.rating.toFixed(1)}</span>
                    <span>•</span>
                    <strong>${room.price}</strong><span>/ night</span>
                </div>
                <p style={{margin:"8px 0 12px 0", color:"#c9d6ff"}}>{room.description}</p>
                <Link className="btn-grad" to={`/booking/${room.id}`}>Book Now</Link>
            </div>
        </div>
    );
}
