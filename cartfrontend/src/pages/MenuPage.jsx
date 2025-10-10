import React, { useState, useEffect } from 'react';
import { Plus } from 'lucide-react';
import { menuAPI } from '../services/api';
import { useCart } from '../context/CartContext';

const MenuPage = () => {
    const [menuItems, setMenuItems] = useState([]);
    const [categories, setCategories] = useState([]);
    const [selectedCategory, setSelectedCategory] = useState('All');
    const [loading, setLoading] = useState(true);
    const { addToCart } = useCart();

    useEffect(() => {
        fetchMenuItems();
    }, []);

    const fetchMenuItems = async () => {
        try {
            const response = await menuAPI.getAll();
            const items = response.data;
            setMenuItems(items);

            // Extract unique categories
            const uniqueCategories = ['All', ...new Set(items.map(item => item.category))];
            setCategories(uniqueCategories);
        } catch (error) {
            console.error('Error fetching menu:', error);
        } finally {
            setLoading(false);
        }
    };

    const filteredItems = selectedCategory === 'All'
        ? menuItems
        : menuItems.filter(item => item.category === selectedCategory);

    const handleAddToCart = async (menuId) => {
        await addToCart(menuId, 1);
    };

    if (loading) {
        return <div className="container text-center p-4">Loading menu...</div>;
    }

    return (
        <div className="container p-4">
            <h1 style={{
                textAlign: 'center',
                marginBottom: '2rem',
                color: 'var(--deep-navy)'
            }}>
                Our Beachside Menu
            </h1>

            {/* Category Filter */}
            <div style={{
                display: 'flex',
                gap: '10px',
                justifyContent: 'center',
                marginBottom: '2rem',
                flexWrap: 'wrap'
            }}>
                {categories.map(category => (
                    <button
                        key={category}
                        onClick={() => setSelectedCategory(category)}
                        className="btn"
                        style={{
                            backgroundColor: selectedCategory === category ? 'var(--teal)' : 'var(--white)',
                            color: selectedCategory === category ? 'var(--white)' : 'var(--deep-navy)',
                            border: `2px solid var(--teal)`
                        }}
                    >
                        {category}
                    </button>
                ))}
            </div>

            {/* Menu Items Grid */}
            <div className="grid grid-3">
                {filteredItems.map(item => (
                    <div key={item.id} className="card">
                        <div style={{
                            height: '200px',
                            backgroundColor: 'var(--light-teal)',
                            borderRadius: '8px',
                            marginBottom: '1rem',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            color: 'var(--white)',
                            fontSize: '1.2rem'
                        }}>
                            {item.imageUrl ? (
                                <img
                                    src={item.imageUrl}
                                    alt={item.name}
                                    style={{
                                        width: '100%',
                                        height: '100%',
                                        objectFit: 'cover',
                                        borderRadius: '8px'
                                    }}
                                />
                            ) : (
                                '🍽️'
                            )}
                        </div>

                        <h3 style={{
                            marginBottom: '0.5rem',
                            color: 'var(--deep-navy)'
                        }}>
                            {item.name}
                        </h3>

                        <p style={{
                            color: 'var(--coral)',
                            fontSize: '1.2rem',
                            fontWeight: 'bold',
                            marginBottom: '0.5rem'
                        }}>
                            ${item.price}
                        </p>

                        <p style={{
                            color: '#666',
                            marginBottom: '1rem',
                            fontSize: '0.9rem'
                        }}>
                            {item.description}
                        </p>

                        <button
                            onClick={() => handleAddToCart(item.id)}
                            className="btn btn-primary"
                            style={{ width: '100%' }}
                        >
                            <Plus size={16} />
                            Add to Cart
                        </button>
                    </div>
                ))}
            </div>

            {filteredItems.length === 0 && (
                <div className="text-center p-4">
                    <p>No items found in this category.</p>
                </div>
            )}
        </div>
    );
};

export default MenuPage;