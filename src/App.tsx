import React, { useState } from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import Header from './components/Header';
import Sidebar from './components/Sidebar';
import FoodGrid from './components/FoodGrid';
import MenuPage from './pages/MenuPage';
import LoginPage from './pages/LoginPage';
import SignUpPage from './pages/SignUpPage';


// Protected Route component
const ProtectedRoute = ({ children }: { children: React.ReactNode }) => {
    const isAuthenticated = localStorage.getItem('isAuthenticated') === 'true';
    return isAuthenticated ? <>{children}</> : <Navigate to="/login" />;
};

export function App() {
    const [sidebarOpen, setSidebarOpen] = useState(false);
    const [activeTab, setActiveTab] = useState('Home');
    const toggleSidebar = () => {
        setSidebarOpen(!sidebarOpen);
    };
    return <BrowserRouter>
        <div className="flex flex-col min-h-screen w-full bg-white">
            <Header toggleSidebar={toggleSidebar} activeTab={activeTab} setActiveTab={setActiveTab} />
            <Sidebar isOpen={sidebarOpen} onClose={toggleSidebar} />
            <Routes>
                <Route path="/" element={<main className="flex-1 p-4 md:p-6">
                    <FoodGrid />
                </main>} />
                <Route path="/menu" element={<MenuPage />} />
                <Route path="/login" element={<LoginPage />} />
                <Route path="/signup" element={<SignUpPage />} />

            </Routes>
        </div>
    </BrowserRouter>;
}