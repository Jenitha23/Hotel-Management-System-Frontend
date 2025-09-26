import React, { useState, useEffect } from 'react';
import MenuFilters from '../components/MenuFilters';
import MenuCard from '../components/MenuCard';
import { menuItemService, categoryService } from '../services/api';

const BrowsePage = () => {
    const [menuItems, setMenuItems] = useState([]);
    const [categories, setCategories] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');
    const [filters, setFilters] = useState({
        page: 0,
        size: 12
    });
    const [pagination, setPagination] = useState({});

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
            page: 0 // Reset to first page when filters change
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

    if (loading && menuItems.length === 0) {
        return <div className="loading">Loading menu items...</div>;
    }

    return (
        <div>
            <div style={{ marginBottom: '2rem' }}>
                <h1 style={{ color: '#0B2545', marginBottom: '1rem' }}>Palm Beach Resort Menu</h1>
                <p style={{ color: '#666', fontSize: '1.1rem' }}>
                    Discover our exquisite selection of beachside delicacies and tropical favorites
                </p>
            </div>

            {error && (
                <div className="alert alert-error">
                    {error}
                </div>
            )}

            <MenuFilters
                filters={filters}
                categories={categories}
                onFilterChange={handleFilterChange}
                onReset={handleResetFilters}
            />

            <div className="grid grid-3">
                {menuItems.map(item => (
                    <MenuCard key={item.id} item={item} />
                ))}
            </div>

            {menuItems.length === 0 && !loading && (
                <div style={{ textAlign: 'center', padding: '2rem', color: '#666' }}>
                    No menu items found matching your criteria.
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
        </div>
    );
};

export default BrowsePage;