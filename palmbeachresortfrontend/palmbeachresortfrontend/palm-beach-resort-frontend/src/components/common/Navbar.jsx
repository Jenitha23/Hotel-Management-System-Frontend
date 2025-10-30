import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import './Navbar.css';

const Navbar = () => {
    const { user, logout } = useAuth();
    const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

    const handleLogout = async () => {
        await logout();
        setIsMobileMenuOpen(false);
    };

    const getDashboardLink = () => {
        if (!user) return null;

        switch (user.role) {
            case 'CUSTOMER':
                return '/customer-dashboard';
            case 'STAFF':
                return '/staff-dashboard';
            case 'ADMIN':
                return '/admin-dashboard';
            default:
                return '/';
        }
    };

    const toggleMobileMenu = () => {
        setIsMobileMenuOpen(!isMobileMenuOpen);
    };

    const closeMobileMenu = () => {
        setIsMobileMenuOpen(false);
    };

    return (
        <nav className="navbar">
            <div className="nav-container">
                {/* Logo - Left Side */}
                <Link to="/" className="nav-logo" onClick={closeMobileMenu}>
                    <span className="logo-icon">🌴</span>
                    <span className="logo-text">Palm Beach Resort</span>
                </Link>

                {/* Navigation Menu - Right Side */}
                <div className={`nav-menu ${isMobileMenuOpen ? 'active' : ''}`}>
                    <Link to="/" className="nav-link" onClick={closeMobileMenu}>Home</Link>
                    <Link to="/rooms" className="nav-link" onClick={closeMobileMenu}>Rooms</Link>
                    <Link to="/menu" className="nav-link" onClick={closeMobileMenu}>Menu</Link>

                    {user ? (
                        <>
                            <Link to={getDashboardLink()} className="nav-link" onClick={closeMobileMenu}>
                                Dashboard
                            </Link>
                            <div className="nav-user">

                                <button onClick={handleLogout} className="logout-btn">
                                    Logout
                                </button>
                            </div>
                        </>
                    ) : (
                        <div className="nav-auth">
                            <Link to="/login" className="login-btn" onClick={closeMobileMenu}>Login</Link>
                            <Link to="/signup" className="signup-btn" onClick={closeMobileMenu}>Sign Up</Link>
                        </div>
                    )}
                </div>

                {/* Mobile Menu Button */}
                <button
                    className="mobile-menu-btn"
                    onClick={toggleMobileMenu}
                    aria-label="Toggle menu"
                >
                    <span></span>
                    <span></span>
                    <span></span>
                </button>
            </div>
        </nav>
    );
};

export default Navbar;
