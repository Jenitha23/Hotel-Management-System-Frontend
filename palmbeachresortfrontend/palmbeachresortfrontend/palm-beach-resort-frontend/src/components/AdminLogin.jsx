// components/AdminLogin.jsx
import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { authService } from '../services/auth';
import './AdminLogin.css';

const AdminLogin = () => {
    const [formData, setFormData] = useState({
        email: '',
        password: ''
    });
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);
    const [showPassword, setShowPassword] = useState(false);
    const navigate = useNavigate();

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');
        setLoading(true);

        try {
            const response = await authService.loginAdmin(formData);

            if (response.data.success) {
                // CRITICAL: Store role in localStorage
                localStorage.setItem('userRole', 'ADMIN');
                localStorage.setItem('userId', response.data.userId);
                localStorage.setItem('userEmail', response.data.email);
                localStorage.setItem('userFullName', response.data.fullName);

                console.log('✅ Admin login successful, role stored:', 'ADMIN');
                navigate('/admin/dashboard');
            } else {
                setError(response.data.message || 'Login failed');
            }
        } catch (error) {
            setError(error.response?.data?.message || 'Login failed. Please check credentials.');
        } finally {
            setLoading(false);
        }
    };

    if (loading) {
        return (
            <div className="admin-loading-overlay">
                <div className="admin-loading-wave">
                    <div className="admin-wave"></div>
                    <p>Admin Login in progress...</p>
                </div>
            </div>
        );
    }

    return (
        <div className="admin-login-container">
            <div className="admin-login-card">
                <div className="admin-login-header">
                    <div className="admin-login-icon">👑</div>
                    <h1>Admin Login</h1>
                    <p className="admin-login-subtitle">System Administrator Access</p>
                </div>

                {error && (
                    <div className="admin-error-message">
                        {error}
                    </div>
                )}

                <form className="admin-auth-form" onSubmit={handleSubmit}>
                    <div className="admin-form-group">
                        <label htmlFor="admin-email">Email</label>
                        <input
                            type="email"
                            id="admin-email"
                            className="admin-auth-input"
                            placeholder="admin@resort.com"
                            value={formData.email}
                            onChange={(e) => setFormData({...formData, email: e.target.value})}
                            required
                        />
                    </div>

                    <div className="admin-form-group">
                        <label htmlFor="admin-password">Password</label>
                        <div className="admin-password-wrapper">
                            <input
                                type={showPassword ? "text" : "password"}
                                id="admin-password"
                                className="admin-auth-input"
                                placeholder="Enter admin password"
                                value={formData.password}
                                onChange={(e) => setFormData({...formData, password: e.target.value})}
                                required
                            />
                            <button
                                type="button"
                                className="admin-password-toggle"
                                onClick={() => setShowPassword(!showPassword)}
                            >
                                {showPassword ? "🙈" : "👁️"}
                            </button>
                        </div>
                    </div>

                    <button type="submit" className="admin-auth-submit">
                        🔐 Admin Login
                    </button>
                </form>

                <div className="admin-auth-footer">
                    <p>Restricted access • Authorized personnel only</p>
                    <p>Having trouble? <Link to="/contact">Contact Support</Link></p>
                </div>
            </div>
        </div>
    );
};

export default AdminLogin;