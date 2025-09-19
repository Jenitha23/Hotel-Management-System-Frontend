import React from 'react';
import Select from '../ui/Select.jsx';
import Checkbox from '../ui/Checkbox.jsx';

const RoomFilters = ({ filters, onFiltersChange }) => {
    const roomTypeOptions = [
        { value: 'ALL', label: 'All Types' },
        { value: 'SINGLE', label: 'Single' },
        { value: 'DOUBLE', label: 'Double' },
        { value: 'SUITE', label: 'Suite' }
    ];

    const handleFilterChange = (key, value) => {
        onFiltersChange({
            ...filters,
            [key]: value
        });
    };

    return (
        <div style={{
            background: 'white',
            padding: 'var(--spacing-lg)',
            borderRadius: 'var(--border-radius-lg)',
            boxShadow: 'var(--shadow-card)',
            marginBottom: 'var(--spacing-xl)'
        }}>
            <h3 style={{
                margin: '0 0 var(--spacing-lg) 0',
                color: 'var(--color-navy)',
                fontSize: 'var(--text-lg)'
            }}>
                Filter Rooms
            </h3>

            <div style={{
                display: 'grid',
                gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
                gap: 'var(--spacing-lg)',
                alignItems: 'end'
            }}>
                <Select
                    label="Room Type"
                    value={filters.type || 'ALL'}
                    onChange={(e) => handleFilterChange('type', e.target.value)}
                    options={roomTypeOptions}
                />

                <Checkbox
                    label="Show only available rooms"
                    checked={filters.available || false}
                    onChange={(e) => handleFilterChange('available', e.target.checked)}
                />
            </div>
        </div>
    );
};

export default RoomFilters;