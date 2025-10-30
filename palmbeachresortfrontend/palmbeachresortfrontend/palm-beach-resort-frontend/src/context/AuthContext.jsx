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
    const [user, setUser] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');

    useEffect(() => {
        checkAuthStatus();
    }, []);

    const checkAuthStatus = async () => {
        try {
            const response = await authService.checkAuth();
            if (response.success) {
                setUser(response);
            }
        } catch (error) {
            console.log('Not authenticated');
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
        }
    };

    const clearError = () => setError('');

    // Task-related helper functions
    const canManageTasks = () => {
        return user?.role === 'ADMIN' || user?.role === 'STAFF';
    };

    const canCreateTasks = () => {
        return user?.role === 'ADMIN';
    };

    const canAssignTasks = () => {
        return user?.role === 'ADMIN';
    };

    const canDeleteTasks = () => {
        return user?.role === 'ADMIN';
    };

    const getTaskNavigationPath = (path) => {
        if (user?.role === 'ADMIN') {
            return `/admin${path}`;
        } else if (user?.role === 'STAFF') {
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