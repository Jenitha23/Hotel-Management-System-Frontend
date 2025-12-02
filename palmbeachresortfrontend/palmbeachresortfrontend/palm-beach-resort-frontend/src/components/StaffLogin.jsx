// components/StaffLogin.jsx
import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { authService } from '../services/auth';
import './StaffLogin.css';

const StaffLogin = () => {
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
            const response = await authService.loginStaff(formData);

            if (response.data.success) {
                navigate('/staff/dashboard');
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
            <div className="staff-loading-overlay">
                <div className="staff-loading-wave">
                    <div className="staff-wave"></div>
                    <p>Staff Login in progress...</p>
                </div>
            </div>
        );
    }

    return (
        <div className="staff-login-container">


            <div className="staff-login-card">
                <div className="staff-login-header">
                    <div className="staff-login-icon">👔</div>
                    <h1>Staff Login</h1>
                    <p className="staff-login-subtitle">Palm Beach Resort Team Access</p>
                </div>

                {error && (
                    <div className="staff-error-message">
                        {error}
                    </div>
                )}

                <form className="staff-auth-form" onSubmit={handleSubmit}>
                    <div className="staff-form-group">
                        <label htmlFor="staff-email">Email</label>
                        <input
                            type="email"
                            id="staff-email"
                            className="staff-auth-input"
                            placeholder="staff@resort.com"
                            value={formData.email}
                            onChange={(e) => setFormData({...formData, email: e.target.value})}
                            required
                        />
                    </div>

                    <div className="staff-form-group">
                        <label htmlFor="staff-password">Password</label>
                        <div className="staff-password-wrapper">
                            <input
                                type={showPassword ? "text" : "password"}
                                id="staff-password"
                                className="staff-auth-input"
                                placeholder="Enter staff password"
                                value={formData.password}
                                onChange={(e) => setFormData({...formData, password: e.target.value})}
                                required
                            />
                            <button
                                type="button"
                                className="staff-password-toggle"
                                onClick={() => setShowPassword(!showPassword)}
                            >
                                {showPassword ? "🙈" : "👁️"}
                            </button>
                        </div>
                    </div>

                    <button type="submit" className="staff-auth-submit">
                        🏝️ Staff Login
                    </button>
                </form>

                <div className="staff-auth-footer">
                    <p>For Palm Beach Resort team members only</p>
                    <p>Need access? <Link to="/contact">Contact Administrator</Link></p>
                </div>
            </div>
        </div>
    );
};

export default StaffLogin;