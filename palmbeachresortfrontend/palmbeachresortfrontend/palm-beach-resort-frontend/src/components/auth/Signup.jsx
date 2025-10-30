import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import UserTypeSelector from './UserTypeSelector';
import './Signup.css';

const Signup = () => {
    const { register, error, clearError } = useAuth(); // FIXED: Added error from useAuth
    const [userType, setUserType] = useState('CUSTOMER');
    const [formData, setFormData] = useState({
        email: '',
        password: '',
        fullName: '',
        phone: ''
    });
    const [loading, setLoading] = useState(false);
    const [success, setSuccess] = useState('');

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({
            ...prev,
            [name]: value
        }));
        if (error) clearError();
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        clearError(); // FIXED: Use clearError instead of setError
        setSuccess('');

        try {
            const submitData = userType === 'CUSTOMER'
                ? formData
                : { email: formData.email, password: formData.password, fullName: formData.fullName };

            const result = await register(userType, submitData);

            if (result.success) {
                setSuccess(`Registration successful! ${result.data.message}`);
                setFormData({ email: '', password: '', fullName: '', phone: '' });
            }
            // FIXED: Error is already set in the AuthContext, no need to set it here
        } catch (err) {
            console.error('Registration error:', err);
            // FIXED: Error is handled by AuthContext
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="signup-container">
            <div className="signup-card">
                <h2>Create Account</h2>
                <p className="subtitle">Join Palm Beach Resort</p>

                <UserTypeSelector
                    selectedType={userType}
                    onTypeChange={setUserType}
                    mode="register"
                />

                <form onSubmit={handleSubmit} className="signup-form">
                    <div className="form-group">
                        <label htmlFor="fullName">Full Name </label>
                        <input
                            type="text"
                            id="fullName"
                            name="fullName"
                            value={formData.fullName}
                            onChange={handleChange}
                            required
                            minLength="2"
                            maxLength="100"
                            placeholder="Enter your full name"
                        />
                    </div>

                    <div className="form-group">
                        <label htmlFor="email">Email Address </label>
                        <input
                            type="email"
                            id="email"
                            name="email"
                            value={formData.email}
                            onChange={handleChange}
                            required
                            placeholder="Enter your email"
                        />
                    </div>

                    <div className="form-group">
                        <label htmlFor="password">Password </label>
                        <input
                            type="password"
                            id="password"
                            name="password"
                            value={formData.password}
                            onChange={handleChange}
                            required
                            minLength="8"
                            placeholder="Enter your password (min 8 characters)"
                        />
                    </div>

                    {userType === 'CUSTOMER' && (
                        <div className="form-group">
                            <label htmlFor="phone">Phone Number </label>
                            <input
                                type="tel"
                                id="phone"
                                name="phone"
                                value={formData.phone}
                                onChange={handleChange}
                                required
                                pattern="^[+]?[0-9]{10,15}$"
                                placeholder="+1234567890"
                                title="Please enter a valid phone number (10-15 digits)"
                            />
                        </div>
                    )}

                    {/* FIXED: Use error from useAuth hook */}
                    {error && <div className="error-message">{error}</div>}
                    {success && <div className="success-message">{success}</div>}

                    <button
                        type="submit"
                        className="signup-btn"
                        disabled={loading}
                    >
                        {loading ? 'Creating Account...' : 'Create Account'}
                    </button>
                </form>

                <div className="login-link">
                    Already have an account? <Link to="/login">Sign In</Link>
                </div>
            </div>
        </div>
    );
};

export default Signup;