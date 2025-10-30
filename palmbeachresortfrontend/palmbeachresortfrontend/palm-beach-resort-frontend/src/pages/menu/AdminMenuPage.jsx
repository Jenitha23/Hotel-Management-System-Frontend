import React, { useState, useEffect } from 'react';
import { useAuth } from '../../context/AuthContext';
import { useNavigate } from 'react-router-dom'; // Add this import
import MenuItemTable from '../../components/menu/MenuItemTable';
import MenuItemForm from '../../components/menu/MenuItemForm';
import { adminMenuService } from '../../services/menuService';
import './AdminMenuPage.css';

const AdminMenuPage = () => {
    const { user } = useAuth();
    const navigate = useNavigate(); // Add this hook
    const [menuItems, setMenuItems] = useState([]);
    const [filteredItems, setFilteredItems] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    const [searchTerm, setSearchTerm] = useState('');
    const [categoryFilter, setCategoryFilter] = useState('ALL');
    const [availabilityFilter, setAvailabilityFilter] = useState('ALL');

    const [showModal, setShowModal] = useState(false);
    const [editingItem, setEditingItem] = useState(null);
    const [isEditing, setIsEditing] = useState(false);

    const [stats, setStats] = useState({
        total: 0,
        available: 0,
        unavailable: 0,
        categories: 0
    });

    const fetchMenuItems = async () => {
        try {
            setLoading(true);
            setError(null);
            const items = await adminMenuService.getAllMenuItems();
            setMenuItems(items);
            setFilteredItems(items);
            updateStatistics(items);
        } catch (err) {
            setError('Failed to load menu items');
            console.error('Error:', err);
        } finally {
            setLoading(false);
        }
    };

    const updateStatistics = (items) => {
        const available = items.filter(item => item.available).length;
        const unavailable = items.filter(item => !item.available).length;
        const categories = [...new Set(items.map(item => item.category))].length;

        setStats({
            total: items.length,
            available,
            unavailable,
            categories
        });
    };

    useEffect(() => {
        let filtered = menuItems;
        if (searchTerm) {
            filtered = filtered.filter(item =>
                item.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                item.description.toLowerCase().includes(searchTerm.toLowerCase())
            );
        }
        if (categoryFilter !== 'ALL') {
            filtered = filtered.filter(item => item.category === categoryFilter);
        }
        if (availabilityFilter !== 'ALL') {
            const available = availabilityFilter === 'AVAILABLE';
            filtered = filtered.filter(item => item.available === available);
        }
        setFilteredItems(filtered);
    }, [menuItems, searchTerm, categoryFilter, availabilityFilter]);

    useEffect(() => {
        fetchMenuItems();
    }, []);

    // Add this function for back navigation
    const handleBackToDashboard = () => {
        navigate('/admin/dashboard'); // Adjust the path if your dashboard route is different
    };

    const handleCreateNew = () => {
        setEditingItem(null);
        setIsEditing(false);
        setShowModal(true);
    };

    const handleEdit = (item) => {
        setEditingItem(item);
        setIsEditing(true);
        setShowModal(true);
    };

    const handleSave = async (formData, itemId) => {
        try {
            if (isEditing && itemId) {
                await adminMenuService.updateMenuItem(itemId, formData);
            } else {
                await adminMenuService.createMenuItem(formData);
            }
            setShowModal(false);
            await fetchMenuItems();
        } catch (err) {
            throw err;
        }
    };

    const handleDelete = async (itemId) => {
        try {
            await adminMenuService.deleteMenuItem(itemId);
            await fetchMenuItems();
        } catch (err) {
            alert('Failed to delete menu item');
            console.error('Error:', err);
        }
    };

    const handleToggleAvailability = async (itemId, available) => {
        try {
            await adminMenuService.updateMenuItemPartial(itemId, { available });
            await fetchMenuItems();
        } catch (err) {
            alert('Failed to update availability');
            console.error('Error:', err);
        }
    };

    const categories = ['ALL', ...new Set(menuItems.map(item => item.category))].filter(Boolean);

    return (
        <div className="admin-menu-page">
            <div className="admin-page-header">
                <div className="header-content">
                    <div>

                        <h1 className="page-title">Menu Management</h1>
                        <p className="page-subtitle">Manage your restaurant menu items and availability</p>
                    </div>
                    <div className="header-actions">
                        <button className="btn btn-primary" onClick={handleCreateNew}>
                            ➕ Add New Item
                        </button>
                    </div>
                </div>
            </div>

            <div className="stats-grid">
                <div className="stat-card">
                    <div className="stat-number">{stats.total}</div>
                    <div className="stat-label">Total Items</div>
                </div>
                <div className="stat-card">
                    <div className="stat-number">{stats.available}</div>
                    <div className="stat-label">Available</div>
                </div>
                <div className="stat-card">
                    <div className="stat-number">{stats.unavailable}</div>
                    <div className="stat-label">Unavailable</div>
                </div>
                <div className="stat-card">
                    <div className="stat-number">{stats.categories}</div>
                    <div className="stat-label">Categories</div>
                </div>
            </div>

            <div className="admin-controls">
                <div className="search-control">
                    <input
                        type="text"
                        placeholder="Search menu items..."
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        className="search-input"
                    />
                </div>

                <div className="filter-controls">
                    <select
                        value={categoryFilter}
                        onChange={(e) => setCategoryFilter(e.target.value)}
                        className="filter-select"
                    >
                        <option value="ALL">All Categories</option>
                        {categories.filter(cat => cat !== 'ALL').map(category => (
                            <option key={category} value={category}>
                                {category.replace('_', ' ')}
                            </option>
                        ))}
                    </select>

                    <select
                        value={availabilityFilter}
                        onChange={(e) => setAvailabilityFilter(e.target.value)}
                        className="filter-select"
                    >
                        <option value="ALL">All Status</option>
                        <option value="AVAILABLE">Available</option>
                        <option value="UNAVAILABLE">Unavailable</option>
                    </select>

                    <button
                        className="btn btn-secondary"
                        onClick={fetchMenuItems}
                        disabled={loading}
                    >
                        🔄 Refresh
                    </button>
                </div>
            </div>

            {error && (
                <div className="error-alert">
                    <span>{error}</span>
                    <button onClick={fetchMenuItems} className="btn btn-sm">Try Again</button>
                </div>
            )}

            <MenuItemTable
                items={filteredItems}
                onEdit={handleEdit}
                onDelete={handleDelete}
                onToggleAvailability={handleToggleAvailability}
                loading={loading}
            />

            {showModal && (
                <div className="modal-overlay" onClick={() => setShowModal(false)}>
                    <div className="modal-content" onClick={(e) => e.stopPropagation()}>
                        <div className="modal-header">
                            <h2 className="modal-title">
                                {isEditing ? 'Edit Menu Item' : 'Create New Menu Item'}
                            </h2>
                            <button className="modal-close" onClick={() => setShowModal(false)}>×</button>
                        </div>
                        <div className="modal-body">
                            <MenuItemForm
                                item={editingItem}
                                onSave={handleSave}
                                onCancel={() => setShowModal(false)}
                                isEditing={isEditing}
                            />
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default AdminMenuPage;