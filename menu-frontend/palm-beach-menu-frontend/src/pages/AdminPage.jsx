import React, { useState, useEffect } from 'react';
import MenuFilters from '../components/MenuFilters';
import MenuCard from '../components/MenuCard';
import AdminForm from '../components/AdminForm';
import { menuItemService, categoryService } from '../services/api';

const AdminPage = () => {
    const [menuItems, setMenuItems] = useState([]);
    const [categories, setCategories] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');
    const [success, setSuccess] = useState('');
    const [filters, setFilters] = useState({
        page: 0,
        size: 12
    });
    const [pagination, setPagination] = useState({});
    const [editingItem, setEditingItem] = useState(null);
    const [showForm, setShowForm] = useState(false);

    useEffect(() => {
        loadCategories();
    }, []);

    useEffect(() => {
        loadMenuItems();
    }, [filters]);

    const loadCategories = async () => {
        try {
            const response = await categoryService.getAll();
            setCategories(response.data);
        } catch (err) {
            setError('Failed to load categories');
        }
    };

    const loadMenuItems = async () => {
        try {
            setLoading(true);
            const response = await menuItemService.getAll(filters);
            setMenuItems(response.data.content);
            setPagination({
                totalPages: response.data.totalPages,
                currentPage: response.data.number,
                totalElements: response.data.totalElements
            });
        } catch (err) {
            setError('Failed to load menu items');
        } finally {
            setLoading(false);
        }
    };

    const handleFilterChange = (key, value) => {
        setFilters(prev => ({
            ...prev,
            [key]: value,
            page: 0
        }));
    };

    const handleResetFilters = () => {
        setFilters({
            page: 0,
            size: 12
        });
    };

    const handlePageChange = (page) => {
        setFilters(prev => ({ ...prev, page }));
    };

    const handleCreate = () => {
        setEditingItem(null);
        setShowForm(true);
    };

    const handleEdit = (item) => {
        setEditingItem(item);
        setShowForm(true);
    };

    const handleDelete = async (id) => {
        if (window.confirm('Are you sure you want to delete this menu item?')) {
            try {
                await menuItemService.delete(id);
                setSuccess('Menu item deleted successfully');
                loadMenuItems();
                setTimeout(() => setSuccess(''), 3000);
            } catch (err) {
                setError('Failed to delete menu item');
                setTimeout(() => setError(''), 3000);
            }
        }
    };

    const handleSubmit = async (formData) => {
        try {
            if (editingItem) {
                await menuItemService.update(editingItem.id, formData);
                setSuccess('Menu item updated successfully');
            } else {
                await menuItemService.create(formData);
                setSuccess('Menu item created successfully');
            }

            setShowForm(false);
            setEditingItem(null);
            loadMenuItems();
            setTimeout(() => setSuccess(''), 3000);
        } catch (err) {
            setError(`Failed to ${editingItem ? 'update' : 'create'} menu item`);
            setTimeout(() => setError(''), 3000);
        }
    };

    const handleCancel = () => {
        setShowForm(false);
        setEditingItem(null);
    };

    return (
        <div>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '2rem' }}>
                <div>
                    <h1 style={{ color: '#0B2545', marginBottom: '0.5rem' }}>Menu Management</h1>
                    <p style={{ color: '#666' }}>Manage your restaurant's menu items</p>
                </div>
                <button className="btn btn-primary" onClick={handleCreate}>
                    Add New Item
                </button>
            </div>

            {error && (
                <div className="alert alert-error">
                    {error}
                </div>
            )}

            {success && (
                <div className="alert alert-success">
                    {success}
                </div>
            )}

            {showForm ? (
                <AdminForm
                    item={editingItem}
                    categories={categories}
                    onSubmit={handleSubmit}
                    onCancel={handleCancel}
                />
            ) : (
                <>
                    <MenuFilters
                        filters={filters}
                        categories={categories}
                        onFilterChange={handleFilterChange}
                        onReset={handleResetFilters}
                    />

                    <div className="grid grid-3">
                        {menuItems.map(item => (
                            <MenuCard
                                key={item.id}
                                item={item}
                                isAdmin={true}
                                onEdit={handleEdit}
                                onDelete={handleDelete}
                            />
                        ))}
                    </div>

                    {menuItems.length === 0 && !loading && (
                        <div style={{ textAlign: 'center', padding: '2rem', color: '#666' }}>
                            No menu items found. Create your first menu item!
                        </div>
                    )}

                    {pagination.totalPages > 1 && (
                        <div className="pagination">
                            {Array.from({ length: pagination.totalPages }, (_, i) => (
                                <button
                                    key={i}
                                    className={`page-btn ${filters.page === i ? 'active' : ''}`}
                                    onClick={() => handlePageChange(i)}
                                >
                                    {i + 1}
                                </button>
                            ))}
                        </div>
                    )}
                </>
            )}
        </div>
    );
};

export default AdminPage;