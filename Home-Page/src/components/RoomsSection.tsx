import { Link } from "react-router-dom";

const rooms = [
    { id: 1, name: "Deluxe Room", price: "$120 / night", img: "https://via.placeholder.com/350x200?text=Deluxe+Room" },
    { id: 2, name: "Suite Room", price: "$200 / night", img: "https://via.placeholder.com/350x200?text=Suite+Room" },
    { id: 3, name: "Family Room", price: "$150 / night", img: "https://via.placeholder.com/350x200?text=Family+Room" },
];

export default function RoomsSection() {
    return (
        <section id="rooms" className="section">
            <div className="container">
                <h2 className="section__title">Our Rooms</h2>
                <div className="cards">
                    {rooms.map((room) => (
                        <div key={room.id} className="card">
                            <img src={room.img} alt={room.name} style={{width: "100%", borderRadius: "12px"}} />
                            <h3 className="card__title">{room.name}</h3>
                            <p>{room.price}</p>
                            <Link to={`/rooms/${room.id}`} className="btn btn--small">Read More</Link>
                        </div>
                    ))}
                </div>
            </div>
        </section>
    );
}
