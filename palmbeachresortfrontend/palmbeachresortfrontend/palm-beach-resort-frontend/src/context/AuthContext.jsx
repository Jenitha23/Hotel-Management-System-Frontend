import React, { createContext, useState, useContext, useEffect } from 'react';
import { authService } from '../services/auth';

const AuthContext = createContext();

export const useAuth = () => {
    const context = useContext(AuthContext);
    if (!context) {
        throw new Error('useAuth must be used within an AuthProvider');
    }
    return context;
};

export const AuthProvider = ({ children }) => {
    // Initialize with localStorage data if available
    const getStoredUser = () => {
        const role = localStorage.getItem('userRole');
        const userId = localStorage.getItem('userId');
        const email = localStorage.getItem('userEmail');
        const fullName = localStorage.getItem('userFullName');

        if (role && userId) {
            return {
                success: true,
                role,
                userId,
                email,
                fullName,
                message: 'Using stored session'
            };
        }
        return null;
    };

    const [user, setUser] = useState(getStoredUser());
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');

    useEffect(() => {
        checkAuthStatus();
    }, []);

    const checkAuthStatus = async () => {
        try {
            console.log('🔐 Starting auth check...');

            // Wait a moment for any session to be established
            await new Promise(resolve => setTimeout(resolve, 500));

            const response = await authService.checkAuth();

            if (response && response.success) {
                console.log('✅ Auth check successful:', response);
                setUser(response);
            } else {
                console.log('⚠️ Auth check returned unsuccessful');

                // Check if we have stored credentials from login
                const storedRole = localStorage.getItem('userRole');
                const storedUserId = localStorage.getItem('userId');

                if (storedRole && storedUserId) {
                    console.log('⚠️ Using stored credentials due to backend filter issue');
                    const mockUser = {
                        success: true,
                        role: storedRole,
                        userId: storedUserId,
                        email: localStorage.getItem('userEmail'),
                        fullName: localStorage.getItem('userFullName'),
                        message: 'Using stored session (backend filter blocking /me endpoints)'
                    };
                    setUser(mockUser);
                } else {
                    console.log('❌ No stored credentials, user not authenticated');
                    setUser(null);
                }
            }
        } catch (error) {
            console.log('❌ Auth check error:', error.message);

            // Fallback to localStorage
            const storedRole = localStorage.getItem('userRole');
            if (storedRole) {
                console.log('⚠️ Falling back to localStorage due to error');
                const mockUser = {
                    success: true,
                    role: storedRole,
                    userId: localStorage.getItem('userId'),
                    email: localStorage.getItem('userEmail'),
                    fullName: localStorage.getItem('userFullName'),
                    message: 'Using fallback credentials'
                };
                setUser(mockUser);
            } else {
                setUser(null);
            }
        } finally {
            setLoading(false);
        }
    };

    const login = async (userType, credentials, isUnified = false) => {
        try {
            setError('');
            setLoading(true);
            let response;

            if (isUnified) {
                response = await authService.unifiedLogin(credentials);
            } else {
                switch (userType) {
                    case 'CUSTOMER':
                        response = await authService.loginCustomer(credentials);
                        break;
                    case 'STAFF':
                        response = await authService.loginStaff(credentials);
                        break;
                    case 'ADMIN':
                        response = await authService.loginAdmin(credentials);
                        break;
                    default:
                        throw new Error('Invalid user type');
                }
            }

            if (response.data.success) {
                // CRITICAL: Store all user data in localStorage
                localStorage.setItem('userRole', response.data.role);
                localStorage.setItem('userId', response.data.userId);
                localStorage.setItem('userEmail', response.data.email);
                localStorage.setItem('userFullName', response.data.fullName);

                console.log('✅ Login successful, stored role:', response.data.role);

                setUser(response.data);
                return { success: true, data: response.data };
            } else {
                setError(response.data.message);
                return { success: false, error: response.data.message };
            }
        } catch (error) {
            const errorMessage = error.response?.data?.message ||
            error.response?.data?.errors ?
                JSON.stringify(error.response.data.errors) :
                'Login failed';
            setError(errorMessage);
            return { success: false, error: errorMessage };
        } finally {
            setLoading(false);
        }
    };

    const register = async (userType, userData) => {
        try {
            setError('');
            setLoading(true);
            let response;

            switch (userType) {
                case 'CUSTOMER':
                    response = await authService.registerCustomer(userData);
                    break;
                case 'STAFF':
                    response = await authService.registerStaff(userData);
                    break;
                case 'ADMIN':
                    response = await authService.registerAdmin(userData);
                    break;
                default:
                    throw new Error('Invalid user type');
            }

            if (response.data.success) {
                return { success: true, data: response.data };
            } else {
                setError(response.data.message);
                return { success: false, error: response.data.message };
            }
        } catch (error) {
            const errorMessage = error.response?.data?.message ||
            error.response?.data?.errors ?
                JSON.stringify(error.response.data.errors) :
                'Registration failed';
            setError(errorMessage);
            return { success: false, error: errorMessage };
        } finally {
            setLoading(false);
        }
    };

    const logout = async () => {
        try {
            setLoading(true);

            // Clear localStorage FIRST
            localStorage.removeItem('userRole');
            localStorage.removeItem('userId');
            localStorage.removeItem('userEmail');
            localStorage.removeItem('userFullName');

            // Try to call logout API
            if (user) {
                await authService.logout(user.role);
            } else {
                await authService.logout();
            }
        } catch (error) {
            console.error('Logout error:', error);
        } finally {
            setUser(null);
            setError('');
            setLoading(false);

            // Redirect to home
            window.location.href = '/';
        }
    };

    const clearError = () => setError('');

    // Task-related helper functions
    const canManageTasks = () => {
        const role = user?.role || localStorage.getItem('userRole');
        return role === 'ADMIN' || role === 'STAFF';
    };

    const canCreateTasks = () => {
        const role = user?.role || localStorage.getItem('userRole');
        return role === 'ADMIN';
    };

    const canAssignTasks = () => {
        const role = user?.role || localStorage.getItem('userRole');
        return role === 'ADMIN';
    };

    const canDeleteTasks = () => {
        const role = user?.role || localStorage.getItem('userRole');
        return role === 'ADMIN';
    };

    const getTaskNavigationPath = (path) => {
        const role = user?.role || localStorage.getItem('userRole');
        if (role === 'ADMIN') {
            return `/admin${path}`;
        } else if (role === 'STAFF') {
            return `/staff${path}`;
        }
        return '/';
    };

    const value = {
        user,
        loading,
        error,
        login,
        register,
        logout,
        clearError,
        checkAuthStatus,
        // Task-related functions
        canManageTasks,
        canCreateTasks,
        canAssignTasks,
        canDeleteTasks,
        getTaskNavigationPath
    };

    return (
        <AuthContext.Provider value={value}>
            {children}
        </AuthContext.Provider>
    );
};