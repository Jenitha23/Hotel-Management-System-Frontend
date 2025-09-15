import { useParams } from "react-router-dom";
import Navbar from "../components/navbar";
import Footer from "../components/Footer";

export default function RoomDetail() {
    const { id } = useParams();

    return (
        <>
            <Navbar />
            <section className="section">
                <div className="container">
                    <h2 className="section__title">Room Details (ID: {id})</h2>
                    <p>Here we will later load details for room #{id} from the backend.</p>
                </div>
            </section>
            <Footer />
        </>
    );
}
