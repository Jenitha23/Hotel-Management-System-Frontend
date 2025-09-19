import React, { useState, useEffect } from 'react';
import { getMenuItemsByCategory } from '../api/menuApi'; // Import the API function

const categories = [
    { id: 'burgers', name: 'Burgers' },
    { id: 'pizza', name: 'Pizza' },
    { id: 'pasta', name: 'Pasta' },
    { id: 'desserts', name: 'Desserts' },
    { id: 'drinks', name: 'Drinks' },
];

const MenuPage = () => {
    const [activeCategory, setActiveCategory] = useState('burgers');
    const [menuItems, setMenuItems] = useState([]);
    const [error, setError] = useState<string | null>(null);
    const [loading, setLoading] = useState(false);

    // Fetch menu items from the backend when the active category changes
    useEffect(() => {
        const fetchMenuItems = async () => {
            try {
                setLoading(true);
                setError(null); // Clear any previous errors
                const items = await getMenuItemsByCategory(activeCategory); // Fetch data from the backend
                // Filter out unavailable items
                const availableItems = items.filter((item: any) => item.availability);
                setMenuItems(availableItems);
            } catch (err) {
                setError('Failed to load menu items. Please try again later.');
            } finally {
                setLoading(false);
            }
        };
        fetchMenuItems();
    }, [activeCategory]);

    return (
        <main className="flex-1 p-4 md:p-6 bg-gray-50">
            <h1 className="mb-6 text-3xl font-bold text-gray-800">Our Menu</h1>
            <div className="flex gap-4 pb-4 mb-6 overflow-x-auto">
                {categories.map((category) => (
                    <button
                        key={category.id}
                        onClick={() => setActiveCategory(category.id)}
                        className={`px-6 py-2 rounded-full whitespace-nowrap ${
                            activeCategory === category.id
                                ? 'bg-red-500 text-white'
                                : 'bg-white text-gray-600 hover:bg-gray-100'
                        }`}
                    >
                        {category.name}
                    </button>
                ))}
            </div>
            {loading ? (
                <div className="text-center">Loading...</div>
            ) : error ? (
                <div className="mb-6 text-center text-red-500">{error}</div>
            ) : (
                <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
                    {menuItems.map((item: any) => (
                        <div
                            key={item.id}
                            className="flex overflow-hidden bg-white rounded-lg shadow-sm"
                        >
                            <img
                                src={item.imageUrl} // Ensure your backend provides the correct image URL
                                alt={item.name}
                                className="object-cover w-40 h-40"
                            />
                            <div className="flex flex-col flex-1 p-4">
                                <div className="flex items-start justify-between mb-2">
                                    <h3 className="text-lg font-semibold text-gray-800">
                                        {item.name}
                                    </h3>
                                    <span className="font-bold text-red-500">
                    ${item.price.toFixed(2)}
                  </span>
                                </div>
                                <p className="flex-1 text-sm text-gray-600">{item.description}</p>
                                <button className="px-4 py-2 mt-4 text-white bg-yellow-400 rounded-md hover:bg-yellow-500">
                                    Add to Cart
                                </button>
                            </div>
                        </div>
                    ))}
                </div>
            )}
        </main>
    );
};

export default MenuPage;