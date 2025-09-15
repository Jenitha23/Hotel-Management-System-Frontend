import Navbar from "../components/navbar";
import Footer from "../components/Footer";

export default function Rooms() {
    return (
        <>
            <Navbar />
            <section className="section">
                <div className="container">
                    <h2 className="section__title">All Rooms</h2>
                    <p>Here we will later show all available rooms from the database.</p>
                </div>
            </section>
            <Footer />
        </>
    );
}
