import React, { useState } from 'react';
import { BrowserRouter as Router, Routes, Route, Link, useLocation } from 'react-router-dom';
import BrowsePage from './pages/BrowsePage';
import AdminPage from './pages/AdminPage';

const Navigation = () => {
    const location = useLocation();

    return (
        <nav className="nav">
            <div className="logo">🏝️ Palm Beach Resort</div>
            <div className="nav-links">
                <Link
                    to="/"
                    className={`nav-link ${location.pathname === '/' ? 'active' : ''}`}
                >
                    Browse Menu
                </Link>
                <Link
                    to="/admin"
                    className={`nav-link ${location.pathname === '/admin' ? 'active' : ''}`}
                >
                    Admin Panel
                </Link>
            </div>
        </nav>
    );
};

const App = () => {
    return (
        <Router>
            <div>
                <header className="header">
                    <div className="container">
                        <Navigation />
                    </div>
                </header>

                <main className="container" style={{ padding: '2rem 0' }}>
                    <Routes>
                        <Route path="/" element={<BrowsePage />} />
                        <Route path="/admin" element={<AdminPage />} />
                    </Routes>
                </main>
            </div>
        </Router>
    );
};

export default App;