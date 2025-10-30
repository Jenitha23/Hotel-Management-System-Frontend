import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import UserTypeSelector from './UserTypeSelector';
import './Login.css';

const Login = () => {
    const { login, error, clearError, loading } = useAuth();
    const navigate = useNavigate();

    const [userType, setUserType] = useState('CUSTOMER');
    const [isUnified, setIsUnified] = useState(false);
    const [formData, setFormData] = useState({
        email: '',
        password: ''
    });

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({
            ...prev,
            [name]: value
        }));
        if (error) clearError();
    };

    const handleUserTypeChange = (type) => {
        setUserType(type);
        setIsUnified(type === 'UNIFIED');
        clearError();
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        clearError();

        try {
            const result = await login(userType, formData, isUnified);

            if (result.success) {
                const userRole = result.data.role;
                switch (userRole) {
                    case 'CUSTOMER':
                        navigate('/customer-dashboard');
                        break;
                    case 'STAFF':
                        navigate('/staff-dashboard');
                        break;
                    case 'ADMIN':
                        navigate('/admin-dashboard');
                        break;
                    default:
                        navigate('/');
                }
            }
        } catch (err) {
            console.error('Login error:', err);
        }
    };

    return (
        <div className="login-container">
            <div className="login-card">
                <div className="login-header">
                    <h2>Login to Palm Beach Resort</h2>
                </div>

                <form onSubmit={handleSubmit} className="login-form">
                    <div className="form-group">
                        <label>User Type:</label>
                        <UserTypeSelector
                            selectedType={userType}
                            onTypeChange={handleUserTypeChange}
                            mode="login"
                        />
                    </div>

                    <div className="form-group">
                        <label htmlFor="email">Email:</label>
                        <input
                            type="email"
                            id="email"
                            name="email"
                            value={formData.email}
                            onChange={handleChange}
                            required
                            placeholder="Enter your email"
                            className="form-input"
                        />
                    </div>

                    <div className="form-group">
                        <label htmlFor="password">Password:</label>
                        <input
                            type="password"
                            id="password"
                            name="password"
                            value={formData.password}
                            onChange={handleChange}
                            required
                            placeholder="Enter your password"
                            className="form-input"
                        />
                    </div>

                    {error && (
                        <div className="error-message">
                            <span className="error-icon">⚠️</span>
                            {typeof error === 'string' ? error : 'An error occurred'}
                        </div>
                    )}

                    <button
                        type="submit"
                        className="login-btn"
                        disabled={loading}
                    >
                        {loading ? (
                            <>
                                <div className="loading-spinner"></div>
                                Signing In...
                            </>
                        ) : (
                            'Login'
                        )}
                    </button>
                </form>

                <div className="login-footer">
                    <p>
                        Don't have an account?{' '}
                        <Link to="/signup" className="signup-link">
                            Register here
                        </Link>
                    </p>
                </div>
            </div>
        </div>
    );
};

export default Login;