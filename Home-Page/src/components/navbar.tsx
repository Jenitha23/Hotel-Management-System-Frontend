import { useState } from "react";
import { Link } from "react-router-dom";

export default function Navbar() {
    const [open, setOpen] = useState(false);

    return (
        <header className="nav">
            <div className="container nav__inner">
                <a className="brand" href="#">
                    <span className="brand__logo" aria-hidden="true">🎓</span>
                    <span className="brand__text">Palm Beach Reasort</span>
                </a>

                <button
                    className="nav__toggle"
                    aria-label="Toggle navigation menu"
                    aria-expanded={open}
                    onClick={() => setOpen(!open)}
                >
                    ☰
                </button>
                <div className="nav__right">
                <nav className={`nav__links ${open ? "is-open" : ""}`}>
                    <a href="#" className="nav__link">Home</a>
                    <a href="#" className="nav__link">Bookings</a>
                    <a href="#" className="nav__link">Services</a>
                    <a href="#" className="nav__link">Contact</a>
                    <a href="#" className="btn btn--small">Login</a>
                    <a href="#" className="btn btn--small">Profile</a>
                </nav>

                </div>
            </div>
        </header>
    );
}
