import { Link } from "react-router-dom";

export default function TopNav({ activePath }) {
    return (
        <div className="nav">
            <div className="nav-inner">
                <div className="brand">Palm Beach Admin</div>
                <Link className={activePath.startsWith("/dashboard") ? "active" : ""} to="/dashboard">Dashboard</Link>
                <Link className={activePath.startsWith("/bookings") ? "active" : ""} to="/bookings">Rooms</Link>
                <Link className={activePath.startsWith("/new-room") ? "active" : ""} to="/new-room">New Room</Link>
                <div className="spacer" />
                <button className="btn">Logout</button>
            </div>
        </div>
    );
}
