import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import MenuItemCard from '../../components/menu/MenuItemCard';
import CartSidebar from '../../components/menu/CartSidebar';
import { menuService } from '../../services/menuService';
import { orderService } from '../../services/menuService';
import { useCart } from '../../hooks/useCart';
import './MenuPage.css';

const MenuPage = () => {
    const { user } = useAuth();
    const navigate = useNavigate();
    const [menuItems, setMenuItems] = useState([]);
    const [categories, setCategories] = useState([]);
    const [selectedCategory, setSelectedCategory] = useState('ALL');
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [isCartOpen, setIsCartOpen] = useState(false);
    const [placingOrder, setPlacingOrder] = useState(false);

    const {
        cart,
        loading: cartLoading,
        error: cartError,
        addToCart,
        updateQuantity,
        removeFromCart,
        clearCart,
        refreshCart,
        totalItems,
        totalAmount
    } = useCart();

    useEffect(() => {
        fetchMenuData();
    }, []);

    const fetchMenuData = async () => {
        try {
            setLoading(true);
            setError(null);

            const [itemsData, categoriesData] = await Promise.all([
                menuService.getAvailableMenuItems(),
                menuService.getCategories()
            ]);

            setMenuItems(itemsData || []);
            setCategories(['ALL', ...(categoriesData || [])]);
        } catch (err) {
            setError('Failed to load menu. Please try again.');
            console.error('Error fetching menu:', err);
        } finally {
            setLoading(false);
        }
    };

    const handleCategorySelect = async (category) => {
        setSelectedCategory(category);
        setLoading(true);
        try {
            const items = category === 'ALL'
                ? await menuService.getAvailableMenuItems()
                : await menuService.getMenuItemsByCategory(category);
            setMenuItems(items || []);
        } catch (err) {
            setError('Failed to load category items.');
            console.error('Error loading category:', err);
        } finally {
            setLoading(false);
        }
    };

    const handleAddToCart = async (menuItemId, quantity) => {
        const success = await addToCart(menuItemId, quantity);
        if (success) {
            console.log('Item added to cart successfully');
        }
        return success;
    };

    const handlePlaceOrder = async () => {
        try {
            setPlacingOrder(true);

            const orderData = {
                specialInstructions: "Please deliver to my room",
                roomNumber: user?.roomNumber || "101"
            };

            const order = await orderService.placeOrder(orderData);

            // SUCCESS - Show confirmation and navigate
            alert(`Order placed successfully! Order #: ${order.orderNumber}`);

            navigate('/customer/orders');

            setIsCartOpen(false);
            await refreshCart();

        } catch (err) {
            const errorMessage = err.response?.data?.message || err.message || 'Failed to place order';
            alert(errorMessage);
            console.error('Order placement error:', err);
        } finally {
            setPlacingOrder(false);
        }
    };

    const handleBack = () => {
        navigate(-1);
    };

    const handleViewOrderHistory = () => {
        navigate('/customer/orders');
    };

    const handleTrackOrder = () => {
        navigate('/track-order');
    };

    // Function to get user-friendly error message
    const getCartErrorMessage = (error) => {
        if (error?.includes('401')) {
            return 'Please log in to order food';
        }
        return error || 'An error occurred with your cart';
    };

    const filteredItems = selectedCategory === 'ALL'
        ? menuItems
        : menuItems.filter(item => item.category === selectedCategory);

    return (
        <div className="menu-page">
            {/* Custom Header with Back Button */}
            <div className="menu-header">
                <div className="header-content">
                    <div className="header-center">
                        <h1 className="menu-title">Beach Resort Menu</h1>
                        <p className="menu-subtitle">Fresh ingredients, ocean-inspired flavors</p>
                    </div>
                    <div className="header-spacer"></div>
                </div>
            </div>

            <div className="categories-section">
                <div className="categories-container">
                    {categories.map(category => (
                        <button
                            key={category}
                            className={`category-btn ${selectedCategory === category ? 'active' : ''}`}
                            onClick={() => handleCategorySelect(category)}
                        >
                            {category.replace(/_/g, ' ')}
                        </button>
                    ))}
                </div>
            </div>

            {error && (
                <div className="error-banner">
                    <span>{error}</span>
                    <button onClick={fetchMenuData} className="retry-btn">Retry</button>
                </div>
            )}

            {cartError && (
                <div className="error-banner">
                    <span>{getCartErrorMessage(cartError)}</span>
                    <button onClick={refreshCart} className="retry-btn">Retry</button>
                </div>
            )}

            {loading ? (
                <div className="loading-section">
                    <div className="loading-spinner"></div>
                    <p>Loading delicious options...</p>
                </div>
            ) : (
                <div className="menu-grid">
                    {filteredItems.length > 0 ? (
                        filteredItems.map(item => (
                            <MenuItemCard
                                key={item.id}
                                item={item}
                                onAddToCart={handleAddToCart}
                            />
                        ))
                    ) : (
                        <div className="no-items-message">
                            <p>No menu items found in this category.</p>
                        </div>
                    )}
                </div>
            )}

            {/* Cart Icon */}
            <div className="cart-icon" onClick={() => setIsCartOpen(true)}>
                🛒
                {totalItems > 0 && <div className="cart-badge">{totalItems}</div>}
            </div>

            <CartSidebar
                isOpen={isCartOpen}
                onClose={() => setIsCartOpen(false)}
                cart={cart}
                onUpdateQuantity={updateQuantity}
                onRemoveItem={removeFromCart}
                onClearCart={clearCart}
                onCheckout={handlePlaceOrder}
                loading={cartLoading || placingOrder}
            />

            {isCartOpen && <div className="cart-overlay" onClick={() => setIsCartOpen(false)} />}
        </div>
    );
};

export default MenuPage;