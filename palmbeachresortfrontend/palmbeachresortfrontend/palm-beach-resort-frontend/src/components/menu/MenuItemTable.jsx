import React, { useState } from 'react';
import './MenuItemTable.css';

const MenuItemTable = ({
                           items,
                           onEdit,
                           onDelete,
                           onToggleAvailability,
                           loading
                       }) => {
    const [imageErrors, setImageErrors] = useState({});

    const handleImageError = (itemId) => {
        setImageErrors(prev => ({ ...prev, [itemId]: true }));
    };

    const handleToggle = async (item) => {
        if (window.confirm(`Are you sure you want to ${item.available ? 'disable' : 'enable'} "${item.name}"?`)) {
            await onToggleAvailability(item.id, !item.available);
        }
    };

    const handleDelete = async (item) => {
        if (window.confirm(`Are you sure you want to delete "${item.name}"? This action cannot be undone.`)) {
            await onDelete(item.id);
        }
    };

    if (loading) {
        return (
            <div className="table-loading">
                <div className="loading-spinner"></div>
                <p>Loading menu items...</p>
            </div>
        );
    }

    if (!items || items.length === 0) {
        return (
            <div className="table-empty">
                <div className="empty-icon">🍽️</div>
                <h3>No Menu Items Found</h3>
                <p>Get started by creating your first menu item!</p>
            </div>
        );
    }

    return (
        <div className="menu-table-container">
            <table className="menu-table">
                <thead>
                <tr>
                    <th>Image</th>
                    <th>Name & Description</th>
                    <th>Category</th>
                    <th>Price</th>
                    <th>Prep Time</th>
                    <th>Status</th>
                    <th>Actions</th>
                </tr>
                </thead>
                <tbody>
                {items.map((item) => (
                    <tr key={item.id} className="table-row">
                        <td className="item-image-cell">
                            <img
                                src={imageErrors[item.id] || !item.imageUrl
                                    ? '/images/menu/default-food.jpg'
                                    : item.imageUrl
                                }
                                alt={item.name}
                                className="item-image"
                                onError={() => handleImageError(item.id)}
                                loading="lazy"
                            />
                        </td>
                        <td>
                            <div className="item-name">{item.name}</div>
                            <div className="item-description">{item.description}</div>
                        </td>
                        <td>
                <span className="item-category">
                  {item.category?.replace('_', ' ') || 'Uncategorized'}
                </span>
                        </td>
                        <td>
                            <div className="item-price">${item.price?.toFixed(2)}</div>
                        </td>
                        <td>
                            <div className="prep-time">{item.preparationTime || 15} min</div>
                        </td>
                        <td>
                <span className={`status-badge ${item.available ? 'available' : 'unavailable'}`}>
                  {item.available ? 'Available' : 'Unavailable'}
                </span>
                        </td>
                        <td>
                            <div className="table-actions">
                                <button
                                    className="action-btn edit-btn"
                                    onClick={() => onEdit(item)}
                                    title="Edit item"
                                >
                                    ✏️
                                </button>
                                <button
                                    className="action-btn toggle-btn"
                                    onClick={() => handleToggle(item)}
                                    title={item.available ? 'Make unavailable' : 'Make available'}
                                >
                                    {item.available ? '👁️' : '👁️‍🗨️'}
                                </button>
                                <button
                                    className="action-btn delete-btn"
                                    onClick={() => handleDelete(item)}
                                    title="Delete item"
                                >
                                    🗑️
                                </button>
                            </div>
                        </td>
                    </tr>
                ))}
                </tbody>
            </table>
        </div>
    );
};

export default MenuItemTable;