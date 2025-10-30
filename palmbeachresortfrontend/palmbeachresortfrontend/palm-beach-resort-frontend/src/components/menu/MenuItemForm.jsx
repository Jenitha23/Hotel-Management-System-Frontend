import React, { useState, useEffect } from 'react';
import './MenuItemForm.css';

const MenuItemForm = ({ item, onSave, onCancel, isEditing }) => {
    const [formData, setFormData] = useState({
        name: '',
        description: '',
        price: '',
        category: '',
        imageUrl: '',
        available: true,
        preparationTime: 15
    });
    const [loading, setLoading] = useState(false);
    const [errors, setErrors] = useState({});

    useEffect(() => {
        if (item && isEditing) {
            setFormData({
                name: item.name || '',
                description: item.description || '',
                price: item.price || '',
                category: item.category || '',
                imageUrl: item.imageUrl || '',
                available: item.available !== undefined ? item.available : true,
                preparationTime: item.preparationTime || 15
            });
        }
    }, [item, isEditing]);

    const handleChange = (e) => {
        const { name, value, type, checked } = e.target;
        setFormData(prev => ({
            ...prev,
            [name]: type === 'checkbox' ? checked : value
        }));
        if (errors[name]) {
            setErrors(prev => ({ ...prev, [name]: '' }));
        }
    };

    const validateForm = () => {
        const newErrors = {};
        if (!formData.name.trim()) newErrors.name = 'Name is required';
        if (!formData.description.trim()) newErrors.description = 'Description is required';
        if (!formData.price || parseFloat(formData.price) <= 0) newErrors.price = 'Valid price is required';
        if (!formData.category.trim()) newErrors.category = 'Category is required';
        if (!formData.preparationTime || parseInt(formData.preparationTime) <= 0) {
            newErrors.preparationTime = 'Valid preparation time is required';
        }
        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!validateForm()) return;

        setLoading(true);
        try {
            const submitData = {
                ...formData,
                price: parseFloat(formData.price),
                preparationTime: parseInt(formData.preparationTime)
            };
            await onSave(submitData, isEditing ? item.id : null);
        } catch (error) {
            setErrors({ submit: error.response?.data?.message || 'Failed to save menu item' });
        } finally {
            setLoading(false);
        }
    };

    const categories = ['APPETIZER', 'MAIN_COURSE', 'DESSERT', 'BEVERAGE', 'SALAD', 'SOUP', 'SIDES'];

    return (
        <form onSubmit={handleSubmit} className="menu-item-form">
            <div className="form-row">
                <div className="form-group">
                    <label className="form-label">Item Name *</label>
                    <input
                        type="text"
                        name="name"
                        value={formData.name}
                        onChange={handleChange}
                        className={`form-input ${errors.name ? 'error' : ''}`}
                        placeholder="Enter menu item name"
                    />
                    {errors.name && <span className="error-text">{errors.name}</span>}
                </div>

                <div className="form-group">
                    <label className="form-label">Category *</label>
                    <select
                        name="category"
                        value={formData.category}
                        onChange={handleChange}
                        className={`form-select ${errors.category ? 'error' : ''}`}
                    >
                        <option value="">Select Category</option>
                        {categories.map(cat => (
                            <option key={cat} value={cat}>{cat.replace('_', ' ')}</option>
                        ))}
                    </select>
                    {errors.category && <span className="error-text">{errors.category}</span>}
                </div>
            </div>

            <div className="form-group">
                <label className="form-label">Description *</label>
                <textarea
                    name="description"
                    value={formData.description}
                    onChange={handleChange}
                    className={`form-textarea ${errors.description ? 'error' : ''}`}
                    placeholder="Describe the menu item..."
                    rows="3"
                />
                {errors.description && <span className="error-text">{errors.description}</span>}
            </div>

            <div className="form-row">
                <div className="form-group">
                    <label className="form-label">Price ($) *</label>
                    <input
                        type="number"
                        name="price"
                        value={formData.price}
                        onChange={handleChange}
                        className={`form-input ${errors.price ? 'error' : ''}`}
                        placeholder="0.00"
                        step="0.01"
                        min="0"
                    />
                    {errors.price && <span className="error-text">{errors.price}</span>}
                </div>

                <div className="form-group">
                    <label className="form-label">Prep Time (min) *</label>
                    <input
                        type="number"
                        name="preparationTime"
                        value={formData.preparationTime}
                        onChange={handleChange}
                        className={`form-input ${errors.preparationTime ? 'error' : ''}`}
                        placeholder="15"
                        min="1"
                    />
                    {errors.preparationTime && <span className="error-text">{errors.preparationTime}</span>}
                </div>
            </div>

            <div className="form-group">
                <label className="form-label">Image URL</label>
                <input
                    type="url"
                    name="imageUrl"
                    value={formData.imageUrl}
                    onChange={handleChange}
                    className="form-input"
                    placeholder="https://example.com/image.jpg"
                />
            </div>

            <div className="form-group">
                <label className="checkbox-label">
                    <input
                        type="checkbox"
                        name="available"
                        checked={formData.available}
                        onChange={handleChange}
                    />
                    Available for customers
                </label>
            </div>

            {errors.submit && <div className="error-message">{errors.submit}</div>}

            <div className="form-actions">
                <button type="button" onClick={onCancel} className="btn btn-secondary" disabled={loading}>
                    Cancel
                </button>
                <button type="submit" className="btn btn-primary" disabled={loading}>
                    {loading ? 'Saving...' : (isEditing ? 'Update Item' : 'Create Item')}
                </button>
            </div>
        </form>
    );
};

export default MenuItemForm;