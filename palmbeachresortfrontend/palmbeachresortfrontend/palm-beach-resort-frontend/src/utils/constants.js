export const API_BASE_URL = 'https://palm-beach-resortbackend-f4h6dwaka4fddeef.centralindia-01.azurewebsites.net';

export const AUTH_ENDPOINTS = {
    CUSTOMER: {
        REGISTER: '/api/customers/auth/register',
        LOGIN: '/api/customers/auth/login',
        LOGOUT: '/api/customers/auth/logout',
        ME: '/api/customers/auth/me'
    },
    STAFF: {
        REGISTER: '/api/staff/auth/register',
        LOGIN: '/api/staff/auth/login',
        LOGOUT: '/api/staff/auth/logout',
        ME: '/api/staff/auth/me'
    },
    ADMIN: {
        REGISTER: '/api/admin/auth/register',
        LOGIN: '/api/admin/auth/login',
        LOGOUT: '/api/admin/auth/logout',
        ME: '/api/admin/auth/me'
    },
    UNIFIED: {
        LOGIN: '/api/auth/login',
        LOGOUT: '/api/auth/logout',
        ME: '/api/auth/me'
    }
};

export const ROOM_ENDPOINTS = {
    CUSTOMER: {
        GET_ALL: '/api/customer/rooms',
        GET_BY_ID: '/api/customer/rooms',
        GET_BY_TYPE: '/api/customer/rooms/type',
        GET_BY_PRICE_RANGE: '/api/customer/rooms/price-range',
        SEARCH: '/api/customer/rooms/search',
        GET_TYPES: '/api/customer/rooms/types',
        GET_SORTED: '/api/customer/rooms/sorted'
    },
    ADMIN: {
        GET_ALL: '/api/admin/rooms',
        CREATE: '/api/admin/rooms',
        UPDATE: '/api/admin/rooms',
        DELETE: '/api/admin/rooms',
        CHECK_ROOM_NUMBER: '/api/admin/rooms/check'
    }
};

export const USER_ROLES = {
    CUSTOMER: 'CUSTOMER',
    STAFF: 'STAFF',
    ADMIN: 'ADMIN'
};

export const ROOM_TYPES = {
    STANDARD: 'STANDARD',
    DELUXE: 'DELUXE',
    SUITE: 'SUITE',
    PRESIDENTIAL: 'PRESIDENTIAL',
    HONEYMOON: 'HONEYMOON'
};

export const HTTP_STATUS = {
    OK: 200,
    CREATED: 201,
    BAD_REQUEST: 400,
    UNAUTHORIZED: 401,
    FORBIDDEN: 403,
    NOT_FOUND: 404,
    INTERNAL_SERVER_ERROR: 500
};

export const BOOKING_ENDPOINTS = {
    CUSTOMER: {
        CREATE: '/api/customer/bookings',
        GET_ALL: '/api/customer/bookings',
        GET_BY_ID: '/api/customer/bookings',
        CANCEL: '/api/customer/bookings',
        UPDATE: '/api/customer/bookings'
    },
    ADMIN: {
        GET_ALL: '/api/admin/bookings',
        GET_BY_ID: '/api/admin/bookings',
        GET_BY_STATUS: '/api/admin/bookings/status',
        UPDATE_STATUS: '/api/admin/bookings',
        DELETE: '/api/admin/bookings',
        TODAY_CHECKINS: '/api/admin/bookings/today/checkins',
        TODAY_CHECKOUTS: '/api/admin/bookings/today/checkouts',
        CHECKIN: '/api/admin/bookings',
        CHECKOUT: '/api/admin/bookings',
        STATISTICS: '/api/admin/bookings/statistics'
    }
};

export const BOOKING_STATUS = {
    PENDING: 'PENDING',
    CONFIRMED: 'CONFIRMED',
    CHECKED_IN: 'CHECKED_IN',
    CHECKED_OUT: 'CHECKED_OUT',
    CANCELLED: 'CANCELLED'
};

export const BOOKING_STATUS_COLORS = {
    PENDING: 'var(--teal)',
    CONFIRMED: 'var(--teal-600)',
    CHECKED_IN: '#4CD964',
    CHECKED_OUT: 'var(--navy)',
    CANCELLED: 'var(--coral)'
};

// API Endpoints - Based on your Controllers
export const API_ENDPOINTS = {
    // Customer Menu endpoints
    CUSTOMER_MENU: '/api/customer/menu',
    CUSTOMER_MENU_CATEGORY: '/api/customer/menu/category',
    CUSTOMER_MENU_CATEGORIES: '/api/customer/menu/categories',

    // Admin Menu endpoints
    ADMIN_MENU: '/api/admin/menu',

    // Cart endpoints
    CUSTOMER_CART: '/api/customer/cart',
    CUSTOMER_CART_ITEMS: '/api/customer/cart/items',
    CUSTOMER_CART_DETAILS: '/api/customer/cart/details',

    // Order endpoints
    CUSTOMER_ORDERS: '/api/customer/orders',
    CUSTOMER_ORDERS_TRACK: '/api/customer/orders/track',

    // Admin Order endpoints
    ADMIN_ORDERS: '/api/admin/orders',
    ADMIN_ORDERS_STATUS: '/api/admin/orders/status',
    ADMIN_ORDERS_KITCHEN: '/api/admin/orders/kitchen/active',
    ADMIN_ORDERS_STATS: '/api/admin/orders/statistics'
};

// Order Status - Based on your FoodOrder entity
export const ORDER_STATUS = {
    PENDING: 'PENDING',
    CONFIRMED: 'CONFIRMED',
    PREPARING: 'PREPARING',
    READY_FOR_DELIVERY: 'READY_FOR_DELIVERY',
    OUT_FOR_DELIVERY: 'OUT_FOR_DELIVERY',
    DELIVERED: 'DELIVERED',
    CANCELLED: 'CANCELLED'
};

// Menu Categories - Based on your MenuItem entity
export const MENU_CATEGORIES = {
    APPETIZER: 'APPETIZER',
    MAIN_COURSE: 'MAIN_COURSE',
    DESSERT: 'DESSERT',
    BEVERAGE: 'BEVERAGE',
    SALAD: 'SALAD',
    SOUP: 'SOUP',
    SIDES: 'SIDES'
};

// ============================================================================
// TASK MANAGEMENT CONSTANTS - ADDED FOR TASK MANAGEMENT FEATURE
// ============================================================================

// Task Status Constants (matches your database ENUM)
export const TASK_STATUS = {
    TODO: 'TODO',
    IN_PROGRESS: 'IN_PROGRESS',
    DONE: 'DONE',
    CANCELLED: 'CANCELLED'
};

// Task Priority Constants (matches your database ENUM)
export const TASK_PRIORITY = {
    LOW: 'LOW',
    MEDIUM: 'MEDIUM',
    HIGH: 'HIGH',
    URGENT: 'URGENT'
};

// Task Status Options for Dropdowns
export const TASK_STATUS_OPTIONS = [
    { value: 'TODO', label: 'To Do', color: '#6c757d', badge: 'secondary' },
    { value: 'IN_PROGRESS', label: 'In Progress', color: '#17a2b8', badge: 'info' },
    { value: 'DONE', label: 'Completed', color: '#28a745', badge: 'success' },
    { value: 'CANCELLED', label: 'Cancelled', color: '#dc3545', badge: 'danger' }
];

// Task Priority Options for Dropdowns
export const TASK_PRIORITY_OPTIONS = [
    { value: 'LOW', label: 'Low', color: '#28a745', badge: 'success' },
    { value: 'MEDIUM', label: 'Medium', color: '#ffc107', badge: 'warning' },
    { value: 'HIGH', label: 'High', color: '#fd7e14', badge: 'warning' },
    { value: 'URGENT', label: 'Urgent', color: '#dc3545', badge: 'danger' }
];

// Task Filter Options
export const TASK_FILTER_OPTIONS = {
    STATUS: [
        { value: '', label: 'All Status' },
        { value: 'TODO', label: 'To Do' },
        { value: 'IN_PROGRESS', label: 'In Progress' },
        { value: 'DONE', label: 'Completed' },
        { value: 'CANCELLED', label: 'Cancelled' }
    ],
    PRIORITY: [
        { value: '', label: 'All Priorities' },
        { value: 'LOW', label: 'Low' },
        { value: 'MEDIUM', label: 'Medium' },
        { value: 'HIGH', label: 'High' },
        { value: 'URGENT', label: 'Urgent' }
    ],
    ASSIGNMENT: [
        { value: '', label: 'Everyone' },
        { value: 'unassigned', label: 'Unassigned' },
        { value: 'assigned', label: 'Assigned' }
    ],
    DUE_DATE: [
        { value: '', label: 'Any Date' },
        { value: 'today', label: 'Due Today' },
        { value: 'tomorrow', label: 'Due Tomorrow' },
        { value: 'week', label: 'This Week' },
        { value: 'overdue', label: 'Overdue' },
        { value: 'future', label: 'Future' }
    ],
    SORT_BY: [
        { value: 'createdAt', label: 'Newest First' },
        { value: 'dueDate', label: 'Due Date' },
        { value: 'priority', label: 'Priority' },
        { value: 'title', label: 'Title' },
        { value: 'status', label: 'Status' }
    ]
};

// Task Routes
export const TASK_ROUTES = {
    ADMIN: {
        BASE: '/admin/tasks',
        CREATE: '/admin/tasks/create',
        EDIT: '/admin/tasks/edit/:id',
        DETAILS: '/admin/tasks/:id'
    },
    STAFF: {
        BASE: '/staff/tasks',
        DETAILS: '/staff/tasks/:id'
    }
};

// Task API Endpoints (matches your backend controllers)
export const TASK_API_ENDPOINTS = {
    ADMIN: {
        BASE: '/api/admin/tasks',
        BY_ID: '/api/admin/tasks/:id',
        BY_STATUS: '/api/admin/tasks/status/:status',
        BY_PRIORITY: '/api/admin/tasks/priority/:priority',
        ASSIGN: '/api/admin/tasks/:id/assign/:staffId',
        STATUS: '/api/admin/tasks/:id/status',
        COMMENTS: '/api/admin/tasks/:id/comments',
        OVERDUE: '/api/admin/tasks/overdue',
        DUE_TODAY: '/api/admin/tasks/due-today',
        STATISTICS: '/api/admin/tasks/statistics'
    },
    STAFF: {
        BASE: '/api/staff/tasks',
        BY_ID: '/api/staff/tasks/:id',
        STATUS: '/api/staff/tasks/:id/status',
        COMMENTS: '/api/staff/tasks/:id/comments',
        STATISTICS: '/api/staff/tasks/statistics'
    }
};

// Task Colors for UI Components
export const TASK_COLORS = {
    STATUS: {
        TODO: '#6c757d',
        IN_PROGRESS: '#17a2b8',
        DONE: '#28a745',
        CANCELLED: '#dc3545'
    },
    PRIORITY: {
        LOW: '#28a745',
        MEDIUM: '#ffc107',
        HIGH: '#fd7e14',
        URGENT: '#dc3545'
    },
    BADGES: {
        OVERDUE: '#dc3545',
        DUE_TODAY: '#e67e22',
        COMPLETED: '#28a745',
        UNASSIGNED: '#6c757d'
    }
};

// Task Default Values
export const TASK_DEFAULTS = {
    PRIORITY: 'MEDIUM',
    STATUS: 'TODO',
    PAGE_SIZE: 10,
    SORT_BY: 'createdAt',
    SORT_ORDER: 'desc'
};

// WebSocket Configuration (matches your WebSocketConfig.java)
export const WEBSOCKET_CONFIG = {
    ENDPOINT: '/ws',
    TOPICS: {
        TASK_UPDATES: '/topic/task-updates',
        TASK_ASSIGNMENTS: '/topic/task-assignments',
        TASK_COMMENTS: '/topic/task-comments',
        ADMIN_TASK_UPDATES: '/topic/admin/task-updates'
    },
    QUEUES: {
        TASK_ASSIGNMENTS: '/queue/task-assignments',
        TASK_UPDATES: '/queue/task-updates',
        TASK_COMMENTS: '/queue/task-comments'
    },
    DESTINATION_PREFIXES: {
        APP: '/app',
        USER: '/user'
    }
};

// Database Field Mappings (matches your database schema)
export const DATABASE_FIELDS = {
    TASKS: {
        ID: 'id',
        TITLE: 'title',
        DESCRIPTION: 'description',
        PRIORITY: 'priority',
        STATUS: 'status',
        DUE_DATE: 'due_date',
        ASSIGNED_TO: 'assigned_to',
        CREATED_BY: 'created_by',
        CREATED_AT: 'created_at',
        UPDATED_AT: 'updated_at',
        COMPLETED_AT: 'completed_at'
    },
    TASK_COMMENTS: {
        ID: 'id',
        TASK_ID: 'task_id',
        USER_ID: 'user_id',
        USER_ROLE: 'user_role',
        COMMENT: 'comment',
        CREATED_AT: 'created_at'
    }
};

// Task Validation Rules
export const TASK_VALIDATION = {
    TITLE: {
        MIN_LENGTH: 1,
        MAX_LENGTH: 255,
        REQUIRED: true
    },
    DESCRIPTION: {
        MAX_LENGTH: 1000
    },
    DUE_DATE: {
        MIN_DATE: new Date().toISOString().split('T')[0] // Today
    }
};

// Task Sample Data (matches your database sample data)
export const SAMPLE_TASKS = [
    {
        id: 1,
        title: 'Room Inspection',
        description: 'Inspect all VIP suites for maintenance issues and cleanliness',
        priority: 'HIGH',
        status: 'TODO',
        dueDate: new Date(Date.now() + 2 * 24 * 60 * 60 * 1000).toISOString().split('T')[0], // 2 days from now
        assignedTo: 1,
        assignedToName: 'John Staff',
        createdBy: 1,
        createdByName: 'Admin User',
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString()
    },
    {
        id: 2,
        title: 'Inventory Check',
        description: 'Check food and beverage inventory levels and place orders if needed',
        priority: 'MEDIUM',
        status: 'IN_PROGRESS',
        dueDate: new Date(Date.now() + 5 * 24 * 60 * 60 * 1000).toISOString().split('T')[0], // 5 days from now
        assignedTo: 1,
        assignedToName: 'John Staff',
        createdBy: 1,
        createdByName: 'Admin User',
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString()
    },
    {
        id: 3,
        title: 'Staff Training',
        description: 'Conduct customer service training for new staff members',
        priority: 'HIGH',
        status: 'TODO',
        dueDate: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString().split('T')[0], // 7 days from now
        assignedTo: null,
        assignedToName: null,
        createdBy: 1,
        createdByName: 'Admin User',
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString()
    },
    {
        id: 4,
        title: 'Pool Maintenance',
        description: 'Weekly pool cleaning and chemical balance check',
        priority: 'MEDIUM',
        status: 'DONE',
        dueDate: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000).toISOString().split('T')[0], // 1 day ago
        assignedTo: 1,
        assignedToName: 'John Staff',
        createdBy: 1,
        createdByName: 'Admin User',
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
        completedAt: new Date().toISOString()
    },
    {
        id: 5,
        title: 'Event Preparation',
        description: 'Prepare conference room for corporate event tomorrow',
        priority: 'URGENT',
        status: 'IN_PROGRESS',
        dueDate: new Date(Date.now() + 1 * 24 * 60 * 60 * 1000).toISOString().split('T')[0], // 1 day from now
        assignedTo: 1,
        assignedToName: 'John Staff',
        createdBy: 1,
        createdByName: 'Admin User',
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString()
    }
];

// Export all constants as default
export default {
    API_BASE_URL,
    AUTH_ENDPOINTS,
    ROOM_ENDPOINTS,
    USER_ROLES,
    ROOM_TYPES,
    HTTP_STATUS,
    BOOKING_ENDPOINTS,
    BOOKING_STATUS,
    BOOKING_STATUS_COLORS,
    API_ENDPOINTS,
    ORDER_STATUS,
    MENU_CATEGORIES,
    // Task constants
    TASK_STATUS,
    TASK_PRIORITY,
    TASK_STATUS_OPTIONS,
    TASK_PRIORITY_OPTIONS,
    TASK_FILTER_OPTIONS,
    TASK_ROUTES,
    TASK_API_ENDPOINTS,
    TASK_COLORS,
    TASK_DEFAULTS,
    WEBSOCKET_CONFIG,
    DATABASE_FIELDS,
    TASK_VALIDATION,
    SAMPLE_TASKS
};
