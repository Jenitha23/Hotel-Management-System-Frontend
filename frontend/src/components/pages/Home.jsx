export default function Home() {
    return (
        <main className="container">
            <section className="hero card">
                <h1>Palm Beach Resort</h1>
                <p>Welcome! If you can see this, routing and CSS are working.</p>
                <div className="mt-3">
                    <button className="btn btn-primary">Primary</button>
                    <button className="btn btn-danger" style={{ marginLeft: 8 }}>Danger</button>
                    <span className="badge teal" style={{ marginLeft: 8 }}>Available</span>
                    <span className="badge coral" style={{ marginLeft: 8 }}>Unavailable</span>
                </div>
            </section>
        </main>
    );
}

