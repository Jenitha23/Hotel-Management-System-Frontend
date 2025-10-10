import React, { createContext, useContext, useReducer, useEffect } from 'react';
import { cartAPI } from '../services/api';

const CartContext = createContext();

const cartReducer = (state, action) => {
    switch (action.type) {
        case 'SET_CART':
            return { ...state, cart: action.payload, loading: false, error: null };
        case 'ADD_ITEM':
            return { ...state, cart: action.payload, error: null };
        case 'UPDATE_ITEM':
            return { ...state, cart: action.payload, error: null };
        case 'REMOVE_ITEM':
            return { ...state, cart: action.payload, error: null };
        case 'CLEAR_CART':
            return { ...state, cart: null, error: null };
        case 'SET_LOADING':
            return { ...state, loading: action.payload, error: null };
        case 'SET_ERROR':
            return { ...state, loading: false, error: action.payload };
        default:
            return state;
    }
};

export const CartProvider = ({ children }) => {
    const [state, dispatch] = useReducer(cartReducer, {
        cart: null,
        loading: true,
        error: null
    });

    const fetchCart = async () => {
        try {
            dispatch({ type: 'SET_LOADING', payload: true });
            const response = await cartAPI.get();
            dispatch({ type: 'SET_CART', payload: response.data });
        } catch (error) {
            console.error('Error fetching cart:', error);
            dispatch({ type: 'SET_ERROR', payload: error.message });
        }
    };

    const addToCart = async (menuId, quantity = 1) => {
        try {
            const response = await cartAPI.addItem(menuId, quantity);
            dispatch({ type: 'ADD_ITEM', payload: response.data });
            return { success: true };
        } catch (error) {
            console.error('Error adding to cart:', error);
            dispatch({ type: 'SET_ERROR', payload: error.message });
            return { success: false, error: error.message };
        }
    };

    const updateCartItem = async (itemId, quantity) => {
        try {
            const response = await cartAPI.updateItem(itemId, quantity);
            dispatch({ type: 'UPDATE_ITEM', payload: response.data });
            return { success: true };
        } catch (error) {
            console.error('Error updating cart item:', error);
            dispatch({ type: 'SET_ERROR', payload: error.message });
            return { success: false, error: error.message };
        }
    };

    const removeFromCart = async (itemId) => {
        try {
            const response = await cartAPI.removeItem(itemId);
            dispatch({ type: 'REMOVE_ITEM', payload: response.data });
            return { success: true };
        } catch (error) {
            console.error('Error removing from cart:', error);
            dispatch({ type: 'SET_ERROR', payload: error.message });
            return { success: false, error: error.message };
        }
    };

    const clearCart = async () => {
        try {
            await cartAPI.clear();
            dispatch({ type: 'CLEAR_CART' });
            return { success: true };
        } catch (error) {
            console.error('Error clearing cart:', error);
            dispatch({ type: 'SET_ERROR', payload: error.message });
            return { success: false, error: error.message };
        }
    };

    useEffect(() => {
        fetchCart();
    }, []);

    return (
        <CartContext.Provider value={{
            cart: state.cart,
            loading: state.loading,
            error: state.error,
            addToCart,
            updateCartItem,
            removeFromCart,
            clearCart,
            refreshCart: fetchCart
        }}>
            {children}
        </CartContext.Provider>
    );
};

export const useCart = () => {
    const context = useContext(CartContext);
    if (!context) {
        throw new Error('useCart must be used within a CartProvider');
    }
    return context;
};