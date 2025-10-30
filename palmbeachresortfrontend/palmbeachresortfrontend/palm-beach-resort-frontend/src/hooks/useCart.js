import { useState, useEffect, useCallback } from 'react';
import { cartService } from '../services/menuService';

export const useCart = () => {
    const [cart, setCart] = useState({
        items: [],
        totalAmount: 0,
        totalItems: 0,
        id: null,
        customerId: null,
        customerName: '',
        updatedAt: null
    });

    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);

    // Fetch cart data
    const fetchCart = useCallback(async () => {
        try {
            setLoading(true);
            setError(null);
            const cartData = await cartService.getCartWithDetails();

            // Transform data to match your frontend structure
            const transformedCart = {
                ...cartData,
                items: cartData.items || [],
                totalAmount: cartData.totalAmount || 0,
                totalItems: cartData.totalItems || 0
            };

            setCart(transformedCart);
        } catch (err) {
            setError(err.message);
            console.error('Error fetching cart:', err);
            // Set empty cart on unauthorized
            if (err.message.includes('401') || err.message.includes('Unauthorized')) {
                setCart({
                    items: [],
                    totalAmount: 0,
                    totalItems: 0,
                    id: null,
                    customerId: null,
                    customerName: '',
                    updatedAt: null
                });
            }
        } finally {
            setLoading(false);
        }
    }, []);

    // Initialize cart on component mount
    useEffect(() => {
        fetchCart();
    }, [fetchCart]);

    // Add item to cart
    const addToCart = async (menuItemId, quantity) => {
        try {
            setError(null);
            await cartService.addToCart(menuItemId, quantity);
            await fetchCart(); // Refresh cart data
            return true;
        } catch (err) {
            setError(err.message);
            console.error('Error adding to cart:', err);
            return false;
        }
    };

    // Update item quantity in cart
    const updateQuantity = async (cartItemId, quantity) => {
        try {
            setError(null);
            await cartService.updateCartItem(cartItemId, quantity);
            await fetchCart(); // Refresh cart data
        } catch (err) {
            setError(err.message);
            console.error('Error updating cart quantity:', err);
        }
    };

    // Remove item from cart
    const removeFromCart = async (cartItemId) => {
        try {
            setError(null);
            await cartService.removeFromCart(cartItemId);
            await fetchCart(); // Refresh cart data
        } catch (err) {
            setError(err.message);
            console.error('Error removing from cart:', err);
        }
    };

    // Clear entire cart
    const clearCart = async () => {
        try {
            setError(null);
            await cartService.clearCart();
            await fetchCart(); // Refresh cart data
        } catch (err) {
            setError(err.message);
            console.error('Error clearing cart:', err);
        }
    };

    // Calculate total items count (fallback)
    const totalItems = cart?.items?.reduce((total, item) => total + (item.quantity || 0), 0) || 0;

    // Calculate total amount (fallback)
    const totalAmount = cart?.totalAmount || 0;

    return {
        cart,
        loading,
        error,
        addToCart,
        updateQuantity,
        removeFromCart,
        clearCart,
        refreshCart: fetchCart,
        totalItems,
        totalAmount
    };
};