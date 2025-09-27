import React from 'react';
import { Link, useLocation } from 'react-router-dom';

const Navbar: React.FC = () => {
    const location = useLocation();

    return (
        <nav className="navbar navbar-expand-lg navbar-dark bg-dark sticky-top">
            <div className="container">
                <Link className="navbar-brand" to="/">
                    <i className="fas fa-hotel me-2"></i>LuxuryStay
                </Link>
                <button
                    className="navbar-toggler"
                    type="button"
                    data-bs-toggle="collapse"
                    data-bs-target="#navbarNav"
                >
                    <span className="navbar-toggler-icon"></span>
                </button>
                <div className="collapse navbar-collapse" id="navbarNav">
                    <ul className="navbar-nav ms-auto">
                        <li className="nav-item">
                            <Link
                                className={`nav-link ${location.pathname === '/' ? 'active' : ''}`}
                                to="/"
                            >
                                Home
                            </Link>
                        </li>
                        <li className="nav-item">
                            <Link
                                className={`nav-link ${location.pathname === '/rooms' ? 'active' : ''}`}
                                to="/rooms"
                            >
                                Rooms
                            </Link>
                        </li>
                        <li className="nav-item">
                            <Link
                                className={`nav-link ${location.pathname === '/bookings' ? 'active' : ''}`}
                                to="/bookings"
                            >
                                My Bookings
                            </Link>
                        </li>
                    </ul>
                </div>
            </div>
        </nav>
    );
};

export default Navbar;