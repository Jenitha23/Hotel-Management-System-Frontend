import React, { useState } from 'react';
import Input from '../ui/Input.jsx';
import Select from '../ui/Select.jsx';
import Checkbox from '../ui/Checkbox.jsx';
import Button from '../ui/Button.jsx';

const RoomForm = ({ initialData = {}, onSubmit, loading = false }) => {
    const [formData, setFormData] = useState({
        roomNumber: initialData.roomNumber || '',
        type: initialData.type || 'SINGLE',
        pricePerNight: initialData.pricePerNight || '',
        capacity: initialData.capacity || '',
        available: initialData.available ?? true,
        description: initialData.description || ''
    });

    const [errors, setErrors] = useState({});

    const roomTypeOptions = [
        { value: 'SINGLE', label: 'Single' },
        { value: 'DOUBLE', label: 'Double' },
        { value: 'SUITE', label: 'Suite' }
    ];

    const validate = () => {
        const newErrors = {};

        if (!formData.roomNumber.trim()) {
            newErrors.roomNumber = 'Room number is required';
        }

        if (!formData.type) {
            newErrors.type = 'Room type is required';
        }

        if (!formData.pricePerNight) {
            newErrors.pricePerNight = 'Price per night is required';
        } else if (Number(formData.pricePerNight) <= 0) {
            newErrors.pricePerNight = 'Price must be greater than 0';
        }

        if (!formData.capacity) {
            newErrors.capacity = 'Capacity is required';
        } else if (Number(formData.capacity) < 1) {
            newErrors.capacity = 'Capacity must be at least 1';
        }

        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    const handleSubmit = (e) => {
        e.preventDefault();

        if (!validate()) {
            return;
        }

        const submitData = {
            ...formData,
            pricePerNight: Number(formData.pricePerNight),
            capacity: Number(formData.capacity)
        };

        onSubmit(submitData);
    };

    const handleChange = (field, value) => {
        setFormData(prev => ({
            ...prev,
            [field]: value
        }));

        // Clear error when user starts typing
        if (errors[field]) {
            setErrors(prev => ({
                ...prev,
                [field]: ''
            }));
        }
    };

    return (
        <form onSubmit={handleSubmit}>
            <div style={{
                display: 'grid',
                gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))',
                gap: 'var(--spacing-lg)'
            }}>
                <Input
                    label="Room Number"
                    value={formData.roomNumber}
                    onChange={(e) => handleChange('roomNumber', e.target.value)}
                    error={errors.roomNumber}
                    required
                    placeholder="e.g., 101"
                />

                <Select
                    label="Room Type"
                    value={formData.type}
                    onChange={(e) => handleChange('type', e.target.value)}
                    options={roomTypeOptions}
                    error={errors.type}
                    required
                />

                <Input
                    label="Price per Night"
                    type="number"
                    step="0.01"
                    min="0"
                    value={formData.pricePerNight}
                    onChange={(e) => handleChange('pricePerNight', e.target.value)}
                    error={errors.pricePerNight}
                    required
                    placeholder="0.00"
                />

                <Input
                    label="Capacity"
                    type="number"
                    min="1"
                    value={formData.capacity}
                    onChange={(e) => handleChange('capacity', e.target.value)}
                    error={errors.capacity}
                    required
                    placeholder="Number of guests"
                />
            </div>

            <div style={{ margin: 'var(--spacing-lg) 0' }}>
                <Input
                    label="Description (Optional)"
                    value={formData.description}
                    onChange={(e) => handleChange('description', e.target.value)}
                    placeholder="Room description..."
                    style={{ minHeight: '80px', resize: 'vertical' }}
                />
            </div>

            <div style={{ margin: 'var(--spacing-lg) 0' }}>
                <Checkbox
                    label="Room is available for booking"
                    checked={formData.available}
                    onChange={(e) => handleChange('available', e.target.checked)}
                />
            </div>

            <div style={{ marginTop: 'var(--spacing-2xl)' }}>
                <Button
                    type="submit"
                    loading={loading}
                    style={{ minWidth: '120px' }}
                >
                    {initialData.id ? 'Update Room' : 'Create Room'}
                </Button>
            </div>
        </form>
    );
};

export default RoomForm;