import React, { useState, useEffect } from 'react';

const AdminForm = ({ item, categories, onSubmit, onCancel }) => {
    const [formData, setFormData] = useState({
        name: '',
        description: '',
        price: '',
        imageUrl: '',
        available: true,
        categoryId: ''
    });

    const [errors, setErrors] = useState({});

    useEffect(() => {
        if (item) {
            setFormData({
                name: item.name || '',
                description: item.description || '',
                price: item.price || '',
                imageUrl: item.imageUrl || '',
                available: item.available !== undefined ? item.available : true,
                categoryId: item.categoryId || ''
            });
        }
    }, [item]);

    const validateForm = () => {
        const newErrors = {};

        if (!formData.name.trim()) newErrors.name = 'Name is required';
        if (!formData.price || parseFloat(formData.price) <= 0) newErrors.price = 'Price must be greater than 0';
        if (!formData.categoryId) newErrors.categoryId = 'Category is required';

        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        if (validateForm()) {
            onSubmit({
                ...formData,
                price: parseFloat(formData.price)
            });
        }
    };

    const handleChange = (field, value) => {
        setFormData(prev => ({ ...prev, [field]: value }));
        if (errors[field]) {
            setErrors(prev => ({ ...prev, [field]: '' }));
        }
    };

    return (
        <div className="card">
            <h2 style={{ marginBottom: '1.5rem', color: '#0B2545' }}>
                {item ? 'Edit Menu Item' : 'Add New Menu Item'}
            </h2>

            <form onSubmit={handleSubmit}>
                <div className="grid grid-2">
                    <div className="form-group">
                        <label className="form-label">Name *</label>
                        <input
                            type="text"
                            className="form-input"
                            value={formData.name}
                            onChange={(e) => handleChange('name', e.target.value)}
                        />
                        {errors.name && <span style={{ color: '#FF7F6B', fontSize: '0.9rem' }}>{errors.name}</span>}
                    </div>

                    <div className="form-group">
                        <label className="form-label">Price *</label>
                        <input
                            type="number"
                            step="0.01"
                            min="0"
                            className="form-input"
                            value={formData.price}
                            onChange={(e) => handleChange('price', e.target.value)}
                        />
                        {errors.price && <span style={{ color: '#FF7F6B', fontSize: '0.9rem' }}>{errors.price}</span>}
                    </div>

                    <div className="form-group">
                        <label className="form-label">Category *</label>
                        <select
                            className="form-select"
                            value={formData.categoryId}
                            onChange={(e) => handleChange('categoryId', e.target.value)}
                        >
                            <option value="">Select a category</option>
                            {categories.map(category => (
                                <option key={category.id} value={category.id}>
                                    {category.name}
                                </option>
                            ))}
                        </select>
                        {errors.categoryId && <span style={{ color: '#FF7F6B', fontSize: '0.9rem' }}>{errors.categoryId}</span>}
                    </div>

                    <div className="form-group">
                        <label className="form-label">Availability</label>
                        <select
                            className="form-select"
                            value={formData.available}
                            onChange={(e) => handleChange('available', e.target.value === 'true')}
                        >
                            <option value="true">Available</option>
                            <option value="false">Unavailable</option>
                        </select>
                    </div>
                </div>

                <div className="form-group">
                    <label className="form-label">Image URL</label>
                    <input
                        type="url"
                        className="form-input"
                        value={formData.imageUrl}
                        onChange={(e) => handleChange('imageUrl', e.target.value)}
                        placeholder="https://example.com/image.jpg"
                    />
                </div>

                <div className="form-group">
                    <label className="form-label">Description</label>
                    <textarea
                        className="form-textarea"
                        value={formData.description}
                        onChange={(e) => handleChange('description', e.target.value)}
                        placeholder="Describe this menu item..."
                    />
                </div>

                <div style={{ display: 'flex', gap: '1rem', marginTop: '1.5rem' }}>
                    <button type="submit" className="btn btn-primary">
                        {item ? 'Update' : 'Create'} Menu Item
                    </button>
                    <button type="button" className="btn btn-secondary" onClick={onCancel}>
                        Cancel
                    </button>
                </div>
            </form>
        </div>
    );
};

export default AdminForm;