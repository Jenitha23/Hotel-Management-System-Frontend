import { BrowserRouter, Routes, Route } from "react-router-dom";
import SiteLayout from "./layouts/SiteLayout.jsx";
import Home from "./pages/Home.jsx";
import Room from "./pages/Room.jsx";


export default function App(){
    return (
        <BrowserRouter>
            <Routes>
                <Route element={<SiteLayout />}>
                    <Route index element={<Home />} />
                    <Route path="rooms" element={<Room />} />

                </Route>
            </Routes>
        </BrowserRouter>
    );
}
