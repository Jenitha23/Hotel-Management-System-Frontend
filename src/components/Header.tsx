import React from 'react';
import { MenuIcon } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

interface HeaderProps {
    toggleSidebar: () => void;
    activeTab: string;
    setActiveTab: (tab: string) => void;
}

const Header = ({
                    toggleSidebar,
                    activeTab,
                    setActiveTab
                }: HeaderProps) => {
    const navigate = useNavigate();
    const navItems = ['Home', 'Our Menu', 'About Us', 'Contact Us'];

    const handleNavigation = (item: string) => {
        setActiveTab(item);
        if (item === 'Home') {
            navigate('/');
        } else if (item === 'Our Menu') {
            navigate('/menu');
        }
    };

    const handleLoginClick = () => {
        navigate('/login');
    };

    return <header className="bg-white shadow-sm py-4 px-6 flex items-center justify-between">
        <div className="flex items-center gap-6">
            <button onClick={toggleSidebar}>
                <MenuIcon size={24} />
            </button>
            <h1 className="text-2xl font-bold text-gray-800">Cafe</h1>
        </div>
        <nav className="hidden md:flex items-center space-x-8">
            {navItems.map(item => <button key={item} onClick={() => handleNavigation(item)} className={`font-medium ${activeTab === item ? 'text-red-500' : 'text-gray-600 hover:text-gray-900'}`}>
                {item}
            </button>)}
        </nav>
        <button
            onClick={handleLoginClick}
            className="bg-red-500 text-white px-4 py-1 rounded font-medium hover:bg-red-600 transition-colors"
        >
            LOGIN
        </button>
    </header>;
};

export default Header;