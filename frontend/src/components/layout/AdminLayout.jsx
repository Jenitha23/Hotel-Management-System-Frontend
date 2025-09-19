import React, { useState } from "react";
import { NavLink, Outlet } from "react-router-dom";

export default function AdminLayout() {
    const [creds, setCreds] = useState(() => {
        try { return JSON.parse(localStorage.getItem('adminAuth') || 'null'); } catch { return null; }
    });

    const handleLogin = () => {
        const username = prompt('Admin username', 'admin');
        if (!username) return;
        const password = prompt('Admin password', 'password');
        if (password == null) return;
        const auth = { username, password };
        localStorage.setItem('adminAuth', JSON.stringify(auth));
        setCreds(auth);
    };

    const handleLogout = () => {
        localStorage.removeItem('adminAuth');
        setCreds(null);
    };

    return (
        <>
            <header className="navbar">
                <div className="navbar-inner">
                    <div className="brand">Palm Beach Admin</div>

                    <nav className="nav-links">
                        <NavLink to="/admin" end className={({ isActive }) => `nav-link ${isActive ? "active" : ""}`}>Dashboard</NavLink>
                        <NavLink to="/admin/rooms" className={({ isActive }) => `nav-link ${isActive ? "active" : ""}`}>Rooms</NavLink>
                        <NavLink to="/admin/rooms/new" className={({ isActive }) => `nav-link ${isActive ? "active" : ""}`}>New Room</NavLink>
                        {creds ? (
                            <button className="btn btn-ghost" onClick={handleLogout}>Logout</button>
                        ) : (
                            <button className="btn btn-ghost" onClick={handleLogin}>Login</button>
                        )}
                    </nav>

                    <button className="menu-toggle">Menu</button>
                </div>
            </header>

            <main className="container">
                <Outlet />
            </main>
        </>
    );
}
