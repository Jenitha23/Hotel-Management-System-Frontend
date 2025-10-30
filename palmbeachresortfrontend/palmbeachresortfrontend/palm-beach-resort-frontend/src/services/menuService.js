import { API_BASE_URL, API_ENDPOINTS } from '../utils/constants';

// Common request handler
const handleResponse = async (response) => {
    if (!response.ok) {
        const errorText = await response.text();
        throw new Error(errorText || `HTTP error! status: ${response.status}`);
    }

    // For 204 No Content responses
    if (response.status === 204) {
        return null;
    }

    return response.json();
};

// Customer Menu Services
export const menuService = {
    // Get all available menu items
    getAvailableMenuItems: async () => {
        const response = await fetch(`${API_BASE_URL}${API_ENDPOINTS.CUSTOMER_MENU}`, {
            method: 'GET',
            credentials: 'include'
        });
        return handleResponse(response);
    },

    // Get menu items by category
    getMenuItemsByCategory: async (category) => {
        const response = await fetch(`${API_BASE_URL}${API_ENDPOINTS.CUSTOMER_MENU_CATEGORY}/${category}`, {
            method: 'GET',
            credentials: 'include'
        });
        return handleResponse(response);
    },

    // Get all categories
    getCategories: async () => {
        const response = await fetch(`${API_BASE_URL}${API_ENDPOINTS.CUSTOMER_MENU_CATEGORIES}`, {
            method: 'GET',
            credentials: 'include'
        });
        return handleResponse(response);
    }
};

// Admin Menu Services
export const adminMenuService = {
    // Get all menu items (including unavailable)
    getAllMenuItems: async () => {
        const response = await fetch(`${API_BASE_URL}${API_ENDPOINTS.ADMIN_MENU}`, {
            method: 'GET',
            credentials: 'include'
        });
        return handleResponse(response);
    },

    // Create new menu item
    createMenuItem: async (menuItemData) => {
        const response = await fetch(`${API_BASE_URL}${API_ENDPOINTS.ADMIN_MENU}`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            credentials: 'include',
            body: JSON.stringify(menuItemData)
        });
        return handleResponse(response);
    },

    // Update menu item
    updateMenuItem: async (itemId, menuItemData) => {
        const response = await fetch(`${API_BASE_URL}${API_ENDPOINTS.ADMIN_MENU}/${itemId}`, {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json',
            },
            credentials: 'include',
            body: JSON.stringify(menuItemData)
        });
        return handleResponse(response);
    },

    // Partial update (e.g., availability toggle)
    updateMenuItemPartial: async (itemId, updates) => {
        const response = await fetch(`${API_BASE_URL}${API_ENDPOINTS.ADMIN_MENU}/${itemId}`, {
            method: 'PATCH',
            headers: {
                'Content-Type': 'application/json',
            },
            credentials: 'include',
            body: JSON.stringify(updates)
        });
        return handleResponse(response);
    },

    // Delete menu item
    deleteMenuItem: async (itemId) => {
        const response = await fetch(`${API_BASE_URL}${API_ENDPOINTS.ADMIN_MENU}/${itemId}`, {
            method: 'DELETE',
            credentials: 'include'
        });
        return handleResponse(response);
    }
};

// Cart Services
export const cartService = {
    // Get current cart
    getCart: async () => {
        const response = await fetch(`${API_BASE_URL}${API_ENDPOINTS.CUSTOMER_CART}`, {
            method: 'GET',
            credentials: 'include'
        });
        return handleResponse(response);
    },

    // Get cart with detailed items
    getCartWithDetails: async () => {
        const response = await fetch(`${API_BASE_URL}${API_ENDPOINTS.CUSTOMER_CART_DETAILS}`, {
            method: 'GET',
            credentials: 'include'
        });
        return handleResponse(response);
    },

    // Add item to cart
    addToCart: async (menuItemId, quantity) => {
        const response = await fetch(`${API_BASE_URL}${API_ENDPOINTS.CUSTOMER_CART_ITEMS}`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            credentials: 'include',
            body: JSON.stringify({
                menuItemId,
                quantity
            })
        });
        return handleResponse(response);
    },

    // Update item quantity in cart
    updateCartItem: async (cartItemId, quantity) => {
        const response = await fetch(`${API_BASE_URL}${API_ENDPOINTS.CUSTOMER_CART_ITEMS}/${cartItemId}?quantity=${quantity}`, {
            method: 'PUT',
            credentials: 'include'
        });
        return handleResponse(response);
    },

    // Remove item from cart
    removeFromCart: async (cartItemId) => {
        const response = await fetch(`${API_BASE_URL}${API_ENDPOINTS.CUSTOMER_CART_ITEMS}/${cartItemId}`, {
            method: 'DELETE',
            credentials: 'include'
        });
        return handleResponse(response);
    },

    // Clear entire cart
    clearCart: async () => {
        const response = await fetch(`${API_BASE_URL}${API_ENDPOINTS.CUSTOMER_CART}`, {
            method: 'DELETE',
            credentials: 'include'
        });
        return handleResponse(response);
    }
};

// Order Services
export const orderService = {
    // Place new order
    placeOrder: async (orderData) => {
        const response = await fetch(`${API_BASE_URL}${API_ENDPOINTS.CUSTOMER_ORDERS}`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            credentials: 'include',
            body: JSON.stringify(orderData)
        });
        return handleResponse(response);
    },

    // Get customer's orders
    getCustomerOrders: async () => {
        const response = await fetch(`${API_BASE_URL}${API_ENDPOINTS.CUSTOMER_ORDERS}`, {
            method: 'GET',
            credentials: 'include'
        });
        return handleResponse(response);
    },

    // Get specific order
    getCustomerOrder: async (orderId) => {
        const response = await fetch(`${API_BASE_URL}${API_ENDPOINTS.CUSTOMER_ORDERS}/${orderId}`, {
            method: 'GET',
            credentials: 'include'
        });
        return handleResponse(response);
    },

    // Track order by order number
    trackOrder: async (orderNumber) => {
        const response = await fetch(`${API_BASE_URL}${API_ENDPOINTS.CUSTOMER_ORDERS_TRACK}/${orderNumber}`, {
            method: 'GET',
            credentials: 'include'
        });
        return handleResponse(response);
    },

    // Cancel order
    cancelOrder: async (orderId) => {
        const response = await fetch(`${API_BASE_URL}${API_ENDPOINTS.CUSTOMER_ORDERS}/${orderId}/cancel`, {
            method: 'POST',
            credentials: 'include'
        });
        return handleResponse(response);
    }
};

// Admin Order Services
export const adminOrderService = {
    // Get all orders
    getAllOrders: async () => {
        const response = await fetch(`${API_BASE_URL}${API_ENDPOINTS.ADMIN_ORDERS}`, {
            method: 'GET',
            credentials: 'include'
        });
        return handleResponse(response);
    },

    // Get orders by status
    getOrdersByStatus: async (status) => {
        const response = await fetch(`${API_BASE_URL}${API_ENDPOINTS.ADMIN_ORDERS_STATUS}/${status}`, {
            method: 'GET',
            credentials: 'include'
        });
        return handleResponse(response);
    },

    // Get active kitchen orders
    getActiveKitchenOrders: async () => {
        const response = await fetch(`${API_BASE_URL}${API_ENDPOINTS.ADMIN_ORDERS_KITCHEN}`, {
            method: 'GET',
            credentials: 'include'
        });
        return handleResponse(response);
    },

    // Get order statistics
    getOrderStatistics: async () => {
        const response = await fetch(`${API_BASE_URL}${API_ENDPOINTS.ADMIN_ORDERS_STATS}`, {
            method: 'GET',
            credentials: 'include'
        });
        return handleResponse(response);
    },

    // Update order status
    updateOrderStatus: async (orderId, status) => {
        const response = await fetch(`${API_BASE_URL}${API_ENDPOINTS.ADMIN_ORDERS}/${orderId}/status`, {
            method: 'PATCH',
            headers: {
                'Content-Type': 'application/json',
            },
            credentials: 'include',
            body: JSON.stringify({ status })
        });
        return handleResponse(response);
    },

    // Delete order
    deleteOrder: async (orderId) => {
        const response = await fetch(`${API_BASE_URL}${API_ENDPOINTS.ADMIN_ORDERS}/${orderId}`, {
            method: 'DELETE',
            credentials: 'include'
        });
        return handleResponse(response);
    }
};
