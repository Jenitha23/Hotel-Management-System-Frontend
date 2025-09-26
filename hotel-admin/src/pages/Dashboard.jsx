export default function Dashboard(){
    // simple placeholders; hook to backend KPIs later if you like
    return (
        <>
            <div className="h1">Dashboard</div>
            <div className="cards">
                <div className="card">
                    <div className="kpi-title">Total Rooms</div>
                    <div className="kpi-value">0</div>
                </div>
                <div className="card">
                    <div className="kpi-title">Available</div>
                    <div className="kpi-value">0</div>
                </div>
                <div className="card">
                    <div className="kpi-title">Avg Price</div>
                    <div className="kpi-value">$0.00</div>
                </div>
            </div>
        </>
    );
}

