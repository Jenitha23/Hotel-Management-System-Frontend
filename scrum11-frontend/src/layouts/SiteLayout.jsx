import { NavLink, Outlet } from "react-router-dom";

export default function SiteLayout(){
    return (
        <>
            <header className="site-header">
                <div className="container topbar">
                    <div className="brand">
                        <span>🏝️</span>
                        <span>Palm Beach Resort</span>
                    </div>
                    <nav className="nav">
                        <NavLink to="/" end>Home</NavLink>
                        <NavLink to="/rooms">Rooms</NavLink>
                        {/* placeholders to match your header; keep as # or add real routes */}
                        <a href="#">Bookings</a>
                        <a href="#">Services</a>
                        <a href="#">Contact</a>
                        <a className="btn-chip" href="#">Login</a>
                        <a className="btn-chip" href="#">Profile</a>
                    </nav>
                </div>
            </header>

            <main>
                <Outlet />
            </main>

            {/* put your footer here if you have one */}
        </>
    );
}
