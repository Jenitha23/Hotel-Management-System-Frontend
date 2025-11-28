// src/components/admin/StaffManagement.jsx
import React, { useState, useEffect } from 'react';
import { useAuth } from '../../context/AuthContext';
import { useNavigate } from 'react-router-dom';
import './StaffManagement.css';

const StaffManagement = () => {
    const { user } = useAuth();
    const navigate = useNavigate();
    const [staffMembers, setStaffMembers] = useState([]);
    const [loading, setLoading] = useState(false);
    const [showCreateForm, setShowCreateForm] = useState(false);
    const [formData, setFormData] = useState({
        email: '',
        password: '',
        fullName: ''
    });

    // Load all staff members
    const loadStaffMembers = async () => {
        try {
            setLoading(true);
            const response = await fetch('/api/staff', {
                credentials: 'include'
            });

            if (response.ok) {
                const data = await response.json();
                setStaffMembers(data);
            } else {
                console.error('Failed to load staff members');
            }
        } catch (error) {
            console.error('Error loading staff:', error);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        loadStaffMembers();
    }, []);

    // Create new staff account
    const createStaffAccount = async (e) => {
        e.preventDefault();
        try {
            const response = await fetch('/api/staff/auth/register', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(formData),
                credentials: 'include'
            });

            const data = await response.json();

            if (data.success) {
                alert('Staff account created successfully!');
                setFormData({ email: '', password: '', fullName: '' });
                setShowCreateForm(false);
                loadStaffMembers(); // Refresh the list
            } else {
                alert('Failed to create staff account: ' + data.message);
            }
        } catch (error) {
            alert('Error creating staff account');
            console.error('Create staff error:', error);
        }
    };

    // Delete staff account
    const deleteStaffAccount = async (staffId) => {
        if (!window.confirm('Are you sure you want to delete this staff account?')) {
            return;
        }

        try {
            const response = await fetch(`/api/staff/${staffId}`, {
                method: 'DELETE',
                credentials: 'include'
            });

            if (response.ok) {
                alert('Staff account deleted successfully!');
                loadStaffMembers(); // Refresh the list
            } else {
                alert('Failed to delete staff account');
            }
        } catch (error) {
            alert('Error deleting staff account');
            console.error('Delete staff error:', error);
        }
    };

    const handleInputChange = (e) => {
        setFormData({
            ...formData,
            [e.target.name]: e.target.value
        });
    };

    if (loading && staffMembers.length === 0) {
        return (
            <div className="staff-management">
                <div className="loading">Loading staff members...</div>
            </div>
        );
    }

    return (
        <div className="staff-management">
            {/* Header */}
            <div className="staff-header">
                <button className="back-button" onClick={() => navigate('/admin/dashboard')}>
                    ← Back to Dashboard
                </button>
                <div className="header-content">
                    <h1>Staff Management</h1>
                    <p>Manage staff accounts and permissions</p>
                </div>
                <button
                    className="btn btn-primary"
                    onClick={() => setShowCreateForm(!showCreateForm)}
                >
                    {showCreateForm ? 'Cancel' : '+ Add Staff'}
                </button>
            </div>

            {/* Create Staff Form */}
            {showCreateForm && (
                <div className="create-staff-form">
                    <h3>Create New Staff Account</h3>
                    <form onSubmit={createStaffAccount}>
                        <div className="form-group">
                            <label>Full Name</label>
                            <input
                                type="text"
                                name="fullName"
                                value={formData.fullName}
                                onChange={handleInputChange}
                                placeholder="Enter full name"
                                required
                            />
                        </div>
                        <div className="form-group">
                            <label>Email</label>
                            <input
                                type="email"
                                name="email"
                                value={formData.email}
                                onChange={handleInputChange}
                                placeholder="Enter email address"
                                required
                            />
                        </div>
                        <div className="form-group">
                            <label>Password</label>
                            <input
                                type="password"
                                name="password"
                                value={formData.password}
                                onChange={handleInputChange}
                                placeholder="Enter temporary password"
                                required
                                minLength="8"
                            />
                            <small>Staff will be asked to change this password on first login</small>
                        </div>
                        <div className="form-actions">
                            <button type="submit" className="btn btn-primary">
                                Create Staff Account
                            </button>
                        </div>
                    </form>
                </div>
            )}

            {/* Staff List */}
            <div className="staff-list">
                <h3>Staff Accounts ({staffMembers.length})</h3>

                {staffMembers.length === 0 ? (
                    <div className="no-staff">
                        <p>No staff accounts found</p>
                        <p>Create the first staff account using the "Add Staff" button above</p>
                    </div>
                ) : (
                    <div className="staff-grid">
                        {staffMembers.map(staff => (
                            <div key={staff.id} className="staff-card">
                                <div className="staff-info">
                                    <div className="staff-avatar">
                                        {staff.fullName.charAt(0).toUpperCase()}
                                    </div>
                                    <div className="staff-details">
                                        <h4>{staff.fullName}</h4>
                                        <p className="staff-email">{staff.email}</p>
                                        <p className="staff-role">Role: {staff.role}</p>
                                        <p className="staff-joined">
                                            Joined: {new Date(staff.createdAt).toLocaleDateString()}
                                        </p>
                                    </div>
                                </div>
                                <div className="staff-actions">
                                    <button
                                        className="btn btn-danger btn-sm"
                                        onClick={() => deleteStaffAccount(staff.id)}
                                        disabled={staff.email === user?.email} // Can't delete own account
                                    >
                                        Delete
                                    </button>
                                    {staff.email === user?.email && (
                                        <small>Cannot delete your own account</small>
                                    )}
                                </div>
                            </div>
                        ))}
                    </div>
                )}
            </div>

            {/* Instructions */}
            <div className="staff-instructions">
                <h4>How Staff Login Works:</h4>
                <ul>
                    <li>Staff members login at: <code>/staff-login</code></li>
                    <li>This URL is hidden from the main website navigation</li>
                    <li>Share the direct login URL with your staff members</li>
                    <li>Staff cannot register themselves - only admins can create staff accounts</li>
                </ul>
            </div>
        </div>
    );
};

export default StaffManagement;