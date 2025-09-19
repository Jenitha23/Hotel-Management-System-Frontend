import React from 'react';
import { LayoutDashboardIcon, UtensilsIcon, HeartIcon, MessageSquareIcon, ClockIcon, ReceiptIcon, SettingsIcon, XIcon } from 'lucide-react';
interface SidebarProps {
    isOpen: boolean;
    onClose: () => void;
}
const Sidebar = ({
                     isOpen,
                     onClose
                 }: SidebarProps) => {
    const menuItems = [{
        name: 'Dashboard',
        icon: <LayoutDashboardIcon size={20} />
    }, {
        name: 'Food Order',
        icon: <UtensilsIcon size={20} />
    }, {
        name: 'Favorite',
        icon: <HeartIcon size={20} />
    }, {
        name: 'Message',
        icon: <MessageSquareIcon size={20} />
    }, {
        name: 'Order History',
        icon: <ClockIcon size={20} />
    }, {
        name: 'Bills',
        icon: <ReceiptIcon size={20} />
    }, {
        name: 'Setting',
        icon: <SettingsIcon size={20} />
    }];
    return <>
        {isOpen && <div className="fixed inset-0 bg-black bg-opacity-50 z-30" onClick={onClose} />}
        <aside className={`bg-white shadow-md w-64 transition-all duration-300 ease-in-out fixed top-0 bottom-0 left-0 z-40 ${isOpen ? 'translate-x-0' : '-translate-x-full'}`}>
            <div className="py-6 px-4">
                <button onClick={onClose} className="absolute top-4 right-4 text-gray-500 hover:text-gray-700">
                    <XIcon size={24} />
                </button>
                <div className="space-y-1 mt-8">
                    {menuItems.map(item => <button key={item.name} className="flex items-center gap-3 px-4 py-3 w-full text-left text-gray-600 hover:bg-gray-100 rounded-md">
                        <span className="text-gray-500">{item.icon}</span>
                        <span>{item.name}</span>
                    </button>)}
                </div>
                <div className="mt-10 bg-red-500 rounded-md p-4 text-white">
                    <div className="font-bold mb-4">Big Big</div>
                    <button className="bg-white text-red-500 px-4 py-1 text-sm rounded-md">
                        Big big
                    </button>
                </div>
            </div>
        </aside>
    </>;
};
export default Sidebar;