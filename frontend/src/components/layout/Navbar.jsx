import React, { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';

const Navbar = () => {
    const [isMenuOpen, setIsMenuOpen] = useState(false);
    const location = useLocation();
    const isAuthenticated = localStorage.getItem('isAuthenticated') === 'true';

    const toggleAuth = () => {
        const newAuthState = !isAuthenticated;
        localStorage.setItem('isAuthenticated', newAuthState.toString());
        window.location.reload();
    };

    const navLinks = [
        { to: '/admin', label: 'Dashboard' },
        { to: '/admin/rooms', label: 'Rooms' },
        { to: '/admin/rooms/new', label: 'New Room' }
    ];

    const isActive = (path) => {
        if (path === '/admin') {
            return location.pathname === '/admin';
        }
        return location.pathname.startsWith(path);
    };

    return (
        <nav style={{
            backgroundColor: 'var(--color-sand)',
            borderBottom: '1px solid #e5e5e5',
            boxShadow: 'var(--shadow-soft)',
            position: 'sticky',
            top: 0,
            zIndex: 100
        }}>
            <div className="container">
                <div style={{
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                    height: '64px'
                }}>
                    {/* Brand */}
                    <Link
                        to="/admin"
                        style={{
                            fontSize: 'var(--text-xl)',
                            fontWeight: '700',
                            color: 'var(--color-navy)',
                            textDecoration: 'none'
                        }}
                    >
                        🏨 Palm Beach Admin
                    </Link>

                    {/* Desktop Navigation */}
                    <div style={{
                        display: 'flex',
                        alignItems: 'center',
                        gap: 'var(--spacing-lg)'
                    }}>
                        <div style={{ display: 'flex', gap: 'var(--spacing-md)' }}>
                            {navLinks.map((link) => (
                                <Link
                                    key={link.to}
                                    to={link.to}
                                    style={{
                                        textDecoration: 'none',
                                        color: isActive(link.to) ? 'var(--color-teal)' : 'var(--color-navy)',
                                        fontWeight: isActive(link.to) ? '600' : '500',
                                        padding: 'var(--spacing-sm) var(--spacing-md)',
                                        borderRadius: 'var(--border-radius-sm)',
                                        transition: 'all var(--transition-fast)',
                                        backgroundColor: isActive(link.to) ? 'rgba(28, 161, 166, 0.1)' : 'transparent',
                                        display: window.innerWidth < 768 ? 'none' : 'block'
                                    }}
                                    onMouseEnter={(e) => {
                                        if (!isActive(link.to)) {
                                            e.target.style.backgroundColor = 'rgba(28, 161, 166, 0.05)';
                                        }
                                    }}
                                    onMouseLeave={(e) => {
                                        if (!isActive(link.to)) {
                                            e.target.style.backgroundColor = 'transparent';
                                        }
                                    }}
                                >
                                    {link.label}
                                </Link>
                            ))}
                        </div>

                        <button
                            onClick={toggleAuth}
                            style={{
                                padding: 'var(--spacing-sm) var(--spacing-md)',
                                backgroundColor: isAuthenticated ? 'var(--color-coral)' : 'var(--color-teal)',
                                color: 'white',
                                border: 'none',
                                borderRadius: 'var(--border-radius-sm)',
                                fontWeight: '600',
                                cursor: 'pointer',
                                transition: 'all var(--transition-fast)',
                                display: window.innerWidth < 768 ? 'none' : 'block'
                            }}
                        >
                            {isAuthenticated ? 'Logout' : 'Login'}
                        </button>

                        {/* Mobile menu button */}
                        <button
                            onClick={() => setIsMenuOpen(!isMenuOpen)}
                            style={{
                                display: window.innerWidth >= 768 ? 'none' : 'flex',
                                flexDirection: 'column',
                                alignItems: 'center',
                                justifyContent: 'center',
                                width: '40px',
                                height: '40px',
                                border: 'none',
                                backgroundColor: 'transparent',
                                cursor: 'pointer'
                            }}
                        >
              <span style={{
                  width: '20px',
                  height: '2px',
                  backgroundColor: 'var(--color-navy)',
                  margin: '2px 0',
                  transition: 'all var(--transition-fast)'
              }}></span>
                            <span style={{
                                width: '20px',
                                height: '2px',
                                backgroundColor: 'var(--color-navy)',
                                margin: '2px 0',
                                transition: 'all var(--transition-fast)'
                            }}></span>
                            <span style={{
                                width: '20px',
                                height: '2px',
                                backgroundColor: 'var(--color-navy)',
                                margin: '2px 0',
                                transition: 'all var(--transition-fast)'
                            }}></span>
                        </button>
                    </div>
                </div>

                {/* Mobile menu */}
                {isMenuOpen && (
                    <div style={{
                        display: window.innerWidth >= 768 ? 'none' : 'block',
                        paddingBottom: 'var(--spacing-md)',
                        borderTop: '1px solid #e5e5e5',
                        marginTop: 'var(--spacing-sm)'
                    }}>
                        {navLinks.map((link) => (
                            <Link
                                key={link.to}
                                to={link.to}
                                onClick={() => setIsMenuOpen(false)}
                                style={{
                                    display: 'block',
                                    padding: 'var(--spacing-md)',
                                    textDecoration: 'none',
                                    color: isActive(link.to) ? 'var(--color-teal)' : 'var(--color-navy)',
                                    fontWeight: isActive(link.to) ? '600' : '500',
                                    backgroundColor: isActive(link.to) ? 'rgba(28, 161, 166, 0.1)' : 'transparent'
                                }}
                            >
                                {link.label}
                            </Link>
                        ))}
                        <button
                            onClick={() => {
                                toggleAuth();
                                setIsMenuOpen(false);
                            }}
                            style={{
                                width: '100%',
                                margin: 'var(--spacing-md)',
                                padding: 'var(--spacing-md)',
                                backgroundColor: isAuthenticated ? 'var(--color-coral)' : 'var(--color-teal)',
                                color: 'white',
                                border: 'none',
                                borderRadius: 'var(--border-radius-sm)',
                                fontWeight: '600',
                                cursor: 'pointer'
                            }}
                        >
                            {isAuthenticated ? 'Logout' : 'Login'}
                        </button>
                    </div>
                )}
            </div>
        </nav>
    );
};

export default Navbar;