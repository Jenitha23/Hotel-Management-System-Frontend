import { Link } from "react-router-dom";
export default function NotFound(){
    return (
        <div className="card">
            <h2>Page not found</h2>
            <p>Return to <Link to="/dashboard">Dashboard</Link></p>
        </div>
    );
}
