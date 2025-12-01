import React, { useState, useEffect } from 'react';
import { useAuth } from '../../context/AuthContext';
import { useNavigate } from 'react-router-dom';
import { staffService } from '../../services/staffService';
import './StaffManagement.css';

const StaffManagement = () => {
    const { user } = useAuth();
    const navigate = useNavigate();
    const [staffMembers, setStaffMembers] = useState([]);
    const [loading, setLoading] = useState(false);
    const [selectedStaff, setSelectedStaff] = useState(null);
    const [viewMode, setViewMode] = useState('grid');
    const [searchTerm, setSearchTerm] = useState('');

    // Debug user info
    useEffect(() => {
        console.log('🔍 DEBUG - Current User:', user);
        console.log('🔍 DEBUG - User Role:', user?.role);
        console.log('🔍 DEBUG - Is Admin?', user?.role === 'ADMIN');
    }, [user]);

    // Load all staff members using staff service
    const loadStaffMembers = async () => {
        try {
            setLoading(true);
            console.log('🔄 Loading staff members using staff service...');

            const response = await staffService.getAllStaff();
            console.log('✅ Staff data loaded successfully:', response.data);

            // Map backend response to include status field for frontend
            const staffWithStatus = response.data.map(staff => ({
                ...staff,
                status: 'Active' // Add default status since backend doesn't provide it
            }));

            setStaffMembers(staffWithStatus);

        } catch (error) {
            console.error('❌ Error loading staff:', error);

            // Check error type
            if (error.response?.status === 403) {
                alert('Access denied. Please ensure you have admin privileges.');
            } else if (error.response?.status === 401) {
                alert('Session expired. Please login again.');
            } else if (error.response?.status === 404) {
                alert('Staff endpoint not found. Check backend configuration.');
            } else {
                alert('Error loading staff members. Please try again.');
            }
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        if (user && user.role === 'ADMIN') {
            loadStaffMembers();
        }
    }, [user]);

    // Delete staff account using staff service
    const deleteStaffAccount = async (staffId, staffName) => {
        if (!window.confirm(`Are you sure you want to delete ${staffName}? This action cannot be undone.`)) {
            return;
        }

        try {
            console.log('🔄 Deleting staff account:', staffId);

            await staffService.deleteStaff(staffId);
            alert('✅ Staff account deleted successfully!');
            loadStaffMembers(); // Refresh the list

            // Close details modal if open
            if (selectedStaff && selectedStaff.id === staffId) {
                setSelectedStaff(null);
            }
        } catch (error) {
            console.error('Delete staff error:', error);
            if (error.response?.status === 404) {
                alert('❌ Staff account not found. It may have been already deleted.');
            } else if (error.response?.data) {
                alert(`❌ Failed to delete staff account: ${error.response.data}`);
            } else {
                alert('❌ Error deleting staff account. Please try again.');
            }
        }
    };

    // View staff details using staff service
    const viewStaffDetails = async (staffId) => {
        try {
            console.log('🔄 Loading staff details:', staffId);

            const response = await staffService.getStaffById(staffId);
            console.log('✅ Staff details loaded:', response.data);

            // Add status field for frontend display
            const staffWithStatus = {
                ...response.data,
                status: 'Active'
            };

            setSelectedStaff(staffWithStatus);
        } catch (error) {
            console.error('Error loading staff details:', error);
            if (error.response?.status === 404) {
                alert('Staff member not found. It may have been deleted.');
            } else {
                alert('Error loading staff details. Please try again.');
            }
        }
    };

    const closeStaffDetails = () => {
        setSelectedStaff(null);
    };

    // Filter staff based on search
    const filteredStaff = staffMembers.filter(staff =>
        staff.fullName?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        staff.email?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        staff.role?.toLowerCase().includes(searchTerm.toLowerCase())
    );

    // Format date
    const formatDate = (dateString) => {
        if (!dateString) return 'Unknown';
        try {
            return new Date(dateString).toLocaleDateString('en-US', {
                year: 'numeric',
                month: 'long',
                day: 'numeric',
                hour: '2-digit',
                minute: '2-digit'
            });
        } catch (error) {
            return 'Invalid Date';
        }
    };

    // Redirect if not admin
    if (user && user.role !== 'ADMIN') {
        return (
            <div className="staff-management">
                <div className="access-denied">
                    <div className="denied-icon">🚫</div>
                    <h2>Access Denied</h2>
                    <p>You need administrator privileges to access this page.</p>
                    <button
                        className="btn btn-teal"
                        onClick={() => navigate('/admin/dashboard')}
                    >
                        Back to Dashboard
                    </button>
                </div>
            </div>
        );
    }

    if (loading && staffMembers.length === 0) {
        return (
            <div className="staff-management">
                <div className="loading-wave">
                    <div className="wave"></div>
                    <p>Loading staff members...</p>
                </div>
            </div>
        );
    }

    return (
        <div className="staff-management">
            {/* Staff Details Modal */}
            {selectedStaff && (
                <div className="staff-details-modal-overlay">
                    <div className="staff-details-modal">
                        <div className="modal-header">
                            <h3>👤 Staff Details</h3>
                            <button className="close-btn" onClick={closeStaffDetails}>×</button>
                        </div>
                        <div className="modal-content">
                            <div className="staff-profile">
                                <div className="profile-avatar">
                                    {selectedStaff.fullName?.charAt(0)?.toUpperCase() || 'S'}
                                </div>
                                <div className="profile-info">
                                    <h2>{selectedStaff.fullName || 'Unknown Staff'}</h2>
                                    <p className="profile-email">{selectedStaff.email || 'No email'}</p>
                                    <div className="profile-badges">
                                        <span className="badge badge-role">{selectedStaff.role || 'STAFF'}</span>
                                        <span className="badge badge-status">{selectedStaff.status || 'Active'}</span>
                                    </div>
                                </div>
                            </div>

                            <div className="details-grid">
                                <div className="detail-card">
                                    <div className="detail-icon">🆔</div>
                                    <div className="detail-content">
                                        <label>Staff ID</label>
                                        <span>{selectedStaff.id || 'N/A'}</span>
                                    </div>
                                </div>
                                <div className="detail-card">
                                    <div className="detail-icon">📧</div>
                                    <div className="detail-content">
                                        <label>Email</label>
                                        <span>{selectedStaff.email || 'N/A'}</span>
                                    </div>
                                </div>
                                <div className="detail-card">
                                    <div className="detail-icon">🏷️</div>
                                    <div className="detail-content">
                                        <label>Role</label>
                                        <span>{selectedStaff.role || 'N/A'}</span>
                                    </div>
                                </div>
                                <div className="detail-card">
                                    <div className="detail-icon">📅</div>
                                    <div className="detail-content">
                                        <label>Joined Date</label>
                                        <span>{formatDate(selectedStaff.createdAt)}</span>
                                    </div>
                                </div>
                            </div>

                            <div className="account-actions">
                                <h4>Account Actions</h4>
                                <div className="action-buttons">
                                    <button
                                        className="btn btn-coral"
                                        onClick={() => deleteStaffAccount(selectedStaff.id, selectedStaff.fullName)}
                                        disabled={selectedStaff.email === user?.email}
                                    >
                                        🗑️ Delete Account
                                    </button>
                                </div>
                                {selectedStaff.email === user?.email && (
                                    <p className="warning-text">You cannot delete your own account</p>
                                )}
                                <div className="feature-note">
                                    <p>💡 <strong>Note:</strong> Staff account creation is managed through the authentication system.</p>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            )}

            {/* Header */}
            <div className="staff-header">
                <button className="back-button" onClick={() => navigate('/admin/dashboard')}>
                    ← Back to Dashboard
                </button>
                <div className="header-content">
                    <h1>Staff Management</h1>
                    <p>View and manage staff accounts</p>
                </div>
                <div className="header-actions">
                    <button
                        className="btn btn-teal"
                        onClick={loadStaffMembers}
                        disabled={loading}
                    >
                        {loading ? '🔄 Refreshing...' : '🔄 Refresh'}
                    </button>
                </div>
            </div>

            {/* Dashboard Stats */}
            <div className="staff-stats">
                <div className="stat-card">
                    <div className="stat-icon">👥</div>
                    <div className="stat-content">
                        <div className="stat-number">{staffMembers.length}</div>
                        <div className="stat-label">Total Staff</div>
                    </div>
                </div>
                <div className="stat-card">
                    <div className="stat-icon">🔄</div>
                    <div className="stat-content">
                        <div className="stat-number">
                            {staffMembers.filter(s => s.status === 'Active').length}
                        </div>
                        <div className="stat-label">Active Staff</div>
                    </div>
                </div>
                <div className="stat-card">
                    <div className="stat-icon">🏷️</div>
                    <div className="stat-content">
                        <div className="stat-number">
                            {new Set(staffMembers.map(s => s.role)).size}
                        </div>
                        <div className="stat-label">Different Roles</div>
                    </div>
                </div>
            </div>

            {/* Search and Controls */}
            <div className="controls-bar">
                <div className="search-box">
                    <input
                        type="text"
                        placeholder="🔍 Search staff by name, email, or role..."
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        className="search-input"
                    />
                </div>
                <div className="view-controls">
                    <button
                        className={`view-btn ${viewMode === 'grid' ? 'active' : ''}`}
                        onClick={() => setViewMode('grid')}
                    >
                        ⏹️ Grid
                    </button>
                    <button
                        className={`view-btn ${viewMode === 'list' ? 'active' : ''}`}
                        onClick={() => setViewMode('list')}
                    >
                        📋 List
                    </button>
                </div>
            </div>

            {/* Staff List */}
            <div className="staff-list-section">
                <div className="section-header">
                    <h3>👥 Staff Accounts ({filteredStaff.length})</h3>
                    <p>Manage your resort team members</p>
                </div>

                {filteredStaff.length === 0 ? (
                    <div className="no-staff">
                        <div className="no-staff-icon">🌊</div>
                        <h4>No Staff Accounts Found</h4>
                        <p>{searchTerm ? 'Try adjusting your search terms' : 'No staff accounts available'}</p>
                        <button
                            className="btn btn-teal"
                            onClick={loadStaffMembers}
                        >
                            🔄 Refresh Data
                        </button>
                    </div>
                ) : viewMode === 'grid' ? (
                    <div className="staff-grid">
                        {filteredStaff.map(staff => (
                            <div key={staff.id} className="staff-card">
                                <div className="staff-info">
                                    <div
                                        className="staff-avatar"
                                        style={{ backgroundColor: '#1CA1A6' }}
                                    >
                                        {staff.fullName?.charAt(0)?.toUpperCase() || 'S'}
                                    </div>
                                    <div className="staff-details">
                                        <h4>{staff.fullName || 'Unknown Staff'}</h4>
                                        <p className="staff-email">{staff.email || 'No email'}</p>
                                        <div className="staff-meta">
                                            <span className="staff-role">🏷️ {staff.role || 'STAFF'}</span>
                                            <span className="staff-joined">
                                                📅 {formatDate(staff.createdAt)}
                                            </span>
                                        </div>
                                    </div>
                                </div>
                                <div className="staff-actions">
                                    <button
                                        className="btn btn-teal btn-sm"
                                        onClick={() => viewStaffDetails(staff.id)}
                                    >
                                        👁️ View
                                    </button>
                                    <button
                                        className="btn btn-coral btn-sm"
                                        onClick={() => deleteStaffAccount(staff.id, staff.fullName)}
                                        disabled={staff.email === user?.email}
                                    >
                                        🗑️ Delete
                                    </button>
                                    {staff.email === user?.email && (
                                        <small className="own-account-label">Your account</small>
                                    )}
                                </div>
                            </div>
                        ))}
                    </div>
                ) : (
                    <div className="staff-table">
                        <table>
                            <thead>
                            <tr>
                                <th>Staff Member</th>
                                <th>Email</th>
                                <th>Role</th>
                                <th>Joined Date</th>
                                <th>Status</th>
                                <th>Actions</th>
                            </tr>
                            </thead>
                            <tbody>
                            {filteredStaff.map(staff => (
                                <tr key={staff.id}>
                                    <td>
                                        <div className="table-staff-info">
                                            <div className="table-avatar">
                                                {staff.fullName?.charAt(0)?.toUpperCase() || 'S'}
                                            </div>
                                            <span>{staff.fullName || 'Unknown Staff'}</span>
                                        </div>
                                    </td>
                                    <td>{staff.email || 'No email'}</td>
                                    <td>
                                        <span className="role-badge">{staff.role || 'STAFF'}</span>
                                    </td>
                                    <td>{formatDate(staff.createdAt)}</td>
                                    <td>
                                        <span className="status-badge active">Active</span>
                                    </td>
                                    <td>
                                        <div className="table-actions">
                                            <button
                                                className="btn btn-teal btn-sm"
                                                onClick={() => viewStaffDetails(staff.id)}
                                            >
                                                View
                                            </button>
                                            <button
                                                className="btn btn-coral btn-sm"
                                                onClick={() => deleteStaffAccount(staff.id, staff.fullName)}
                                                disabled={staff.email === user?.email}
                                            >
                                                Delete
                                            </button>
                                        </div>
                                        {staff.email === user?.email && (
                                            <small className="own-account-label-table">Your account</small>
                                        )}
                                    </td>
                                </tr>
                            ))}
                            </tbody>
                        </table>
                    </div>
                )}
            </div>

            {/* Instructions */}
            <div className="staff-instructions">
                <h4>🌴 Staff Management Guide</h4>
                <div className="instructions-grid">
                    <div className="instruction-item">
                        <div className="instruction-icon">👁️</div>
                        <div className="instruction-text">
                            <strong>View Details</strong>
                            <p>Click "View" to see complete staff information</p>
                        </div>
                    </div>
                    <div className="instruction-item">
                        <div className="instruction-icon">🔍</div>
                        <div className="instruction-text">
                            <strong>Search Staff</strong>
                            <p>Use search to find staff by name, email, or role</p>
                        </div>
                    </div>
                    <div className="instruction-item">
                        <div className="instruction-icon">📊</div>
                        <div className="instruction-text">
                            <strong>View Modes</strong>
                            <p>Switch between grid and list view</p>
                        </div>
                    </div>
                    <div className="instruction-item">
                        <div className="instruction-icon">🗑️</div>
                        <div className="instruction-text">
                            <strong>Delete Accounts</strong>
                            <p>Remove staff accounts (cannot delete your own)</p>
                        </div>
                    </div>
                </div>
            </div>

            {/* System Information */}
            <div className="system-info">
                <div className="info-header">
                    <h4>ℹ️ System Information</h4>
                </div>
                <div className="info-content">
                    <p>
                        <strong>Backend Status:</strong> Connected ✅
                    </p>
                    <p>
                        <strong>Available Actions:</strong> View Staff Details, Delete Staff Accounts
                    </p>
                    <p>
                        <strong>Note:</strong> Staff account creation is handled through the authentication system.
                    </p>
                </div>
            </div>
        </div>
    );
};

export default StaffManagement;