import React, { useState, useEffect } from 'react';
import { roomService } from '../../services/roomService';
import './AdminRoomForm.css';

const AdminRoomForm = ({ room, onSubmit, onCancel }) => {
    const [formData, setFormData] = useState({
        roomNumber: '',
        roomType: 'STANDARD',
        price: '',
        capacity: 2,
        description: '',
        available: true,
        imageUrl: ''
    });
    const [errors, setErrors] = useState({});
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [roomNumberError, setRoomNumberError] = useState('');

    useEffect(() => {
        if (room) {
            setFormData({
                roomNumber: room.roomNumber,
                roomType: room.roomType,
                price: room.price.toString(),
                capacity: room.capacity,
                description: room.description,
                available: room.available,
                imageUrl: room.imageUrl || ''
            });
        }
    }, [room]);

    const handleChange = (e) => {
        const { name, value, type, checked } = e.target;
        setFormData(prev => ({
            ...prev,
            [name]: type === 'checkbox' ? checked : value
        }));

        // Clear errors when user starts typing
        if (errors[name]) {
            setErrors(prev => ({ ...prev, [name]: '' }));
        }
        if (name === 'roomNumber') {
            setRoomNumberError('');
        }
    };

    // Real-time room number validation with backend
    const checkRoomNumber = async (roomNumber) => {
        if (!roomNumber.trim()) return;

        try {
            const response = await roomService.checkRoomNumber(roomNumber);
            if (response.data && !room) {
                setRoomNumberError('Room number already exists');
            }
        } catch (error) {
            console.error('Error checking room number:', error);
        }
    };

    const validateForm = () => {
        const newErrors = {};

        if (!formData.roomNumber.trim()) {
            newErrors.roomNumber = 'Room number is required';
        }

        if (!formData.price || parseFloat(formData.price) <= 0) {
            newErrors.price = 'Valid price is required';
        }

        if (!formData.capacity || formData.capacity < 1) {
            newErrors.capacity = 'Valid capacity is required';
        }

        if (!formData.description.trim()) {
            newErrors.description = 'Description is required';
        }

        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        if (!validateForm()) {
            return;
        }

        if (roomNumberError) {
            return;
        }

        setIsSubmitting(true);

        try {
            const submitData = {
                roomNumber: formData.roomNumber.trim(),
                roomType: formData.roomType,
                price: parseFloat(formData.price),
                capacity: parseInt(formData.capacity),
                description: formData.description.trim(),
                available: formData.available,
                imageUrl: formData.imageUrl.trim() || null
            };

            console.log('✅ Form data prepared:', submitData); // Debug log

            await onSubmit(room?.id, submitData);

        } catch (error) {
            console.error('Form submission error:', error);

            // More specific error handling
            if (error.response?.status === 400) {
                if (error.response.data?.errors) {
                    // Handle validation errors from backend
                    const backendErrors = error.response.data.errors;
                    setErrors({
                        submit: 'Please fix the following errors: ' +
                            Object.values(backendErrors).join(', ')
                    });
                } else {
                    setErrors({ submit: 'Invalid room data. Please check all fields.' });
                }
            } else if (error.response?.status === 401) {
                setErrors({ submit: 'Authentication failed. Please log in again.' });
            } else if (error.response?.status === 403) {
                setErrors({ submit: 'You do not have permission to perform this action.' });
            } else {
                setErrors({
                    submit: error.response?.data?.message ||
                        'Failed to save room. Please try again.'
                });
            }
        } finally {
            setIsSubmitting(false);
        }
    };

    const roomTypes = [
        'STANDARD', 'DELUXE', 'SUITE', 'PRESIDENTIAL', 'HONEYMOON'
    ];

    return (
        <div className="admin-room-form-overlay">
            <div className="admin-room-form">
                <div className="form-header">
                    <h2>{room ? 'Edit Room' : 'Add New Room'}</h2>
                    <button
                        type="button"
                        className="close-btn"
                        onClick={onCancel}
                        disabled={isSubmitting}
                    >
                        ×
                    </button>
                </div>

                <form onSubmit={handleSubmit}>
                    {errors.submit && (
                        <div className="error-message submit-error">
                            {errors.submit}
                        </div>
                    )}

                    <div className="form-row">
                        <div className="form-group">
                            <label htmlFor="roomNumber">Room Number *</label>
                            <input
                                type="text"
                                id="roomNumber"
                                name="roomNumber"
                                value={formData.roomNumber}
                                onChange={handleChange}
                                onBlur={(e) => checkRoomNumber(e.target.value)}
                                className={errors.roomNumber || roomNumberError ? 'error' : ''}
                                placeholder="e.g., 101, 202A"
                                disabled={isSubmitting}
                            />
                            {errors.roomNumber && (
                                <span className="error-text">{errors.roomNumber}</span>
                            )}
                            {roomNumberError && (
                                <span className="error-text">{roomNumberError}</span>
                            )}
                        </div>

                        <div className="form-group">
                            <label htmlFor="roomType">Room Type *</label>
                            <select
                                id="roomType"
                                name="roomType"
                                value={formData.roomType}
                                onChange={handleChange}
                                disabled={isSubmitting}
                            >
                                {roomTypes.map(type => (
                                    <option key={type} value={type}>
                                        {type}
                                    </option>
                                ))}
                            </select>
                        </div>
                    </div>

                    <div className="form-row">
                        <div className="form-group">
                            <label htmlFor="price">Price per Night ($) *</label>
                            <input
                                type="number"
                                id="price"
                                step="0.01"
                                min="0"
                                name="price"
                                value={formData.price}
                                onChange={handleChange}
                                className={errors.price ? 'error' : ''}
                                placeholder="0.00"
                                disabled={isSubmitting}
                            />
                            {errors.price && (
                                <span className="error-text">{errors.price}</span>
                            )}
                        </div>

                        <div className="form-group">
                            <label htmlFor="capacity">Capacity (Guests) *</label>
                            <input
                                type="number"
                                id="capacity"
                                name="capacity"
                                value={formData.capacity}
                                onChange={handleChange}
                                min="1"
                                max="10"
                                className={errors.capacity ? 'error' : ''}
                                disabled={isSubmitting}
                            />
                            {errors.capacity && (
                                <span className="error-text">{errors.capacity}</span>
                            )}
                        </div>
                    </div>

                    <div className="form-group">
                        <label htmlFor="description">Description *</label>
                        <textarea
                            id="description"
                            name="description"
                            value={formData.description}
                            onChange={handleChange}
                            rows="4"
                            className={errors.description ? 'error' : ''}
                            placeholder="Describe the room features, amenities, and special characteristics..."
                            disabled={isSubmitting}
                        />
                        {errors.description && (
                            <span className="error-text">{errors.description}</span>
                        )}
                    </div>

                    <div className="form-group">
                        <label htmlFor="imageUrl">Image URL</label>
                        <input
                            type="url"
                            id="imageUrl"
                            name="imageUrl"
                            value={formData.imageUrl}
                            onChange={handleChange}
                            placeholder="https://example.com/room-image.jpg"
                            disabled={isSubmitting}
                        />
                    </div>

                    <div className="form-group checkbox-group">
                        <label>
                            <input
                                type="checkbox"
                                name="available"
                                checked={formData.available}
                                onChange={handleChange}
                                disabled={isSubmitting}
                            />
                            Available for booking
                        </label>
                    </div>

                    <div className="form-actions">
                        <button
                            type="button"
                            className="btn btn-secondary"
                            onClick={onCancel}
                            disabled={isSubmitting}
                        >
                            Cancel
                        </button>
                        <button
                            type="submit"
                            className="btn btn-primary"
                            disabled={isSubmitting || roomNumberError}
                        >
                            {isSubmitting ? (
                                <>
                                    <div className="spinner"></div>
                                    {room ? 'Updating...' : 'Creating...'}
                                </>
                            ) : (
                                room ? 'Update Room' : 'Create Room'
                            )}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default AdminRoomForm;