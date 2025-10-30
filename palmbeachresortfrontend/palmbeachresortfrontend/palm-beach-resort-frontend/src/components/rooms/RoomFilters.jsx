import React, { useState, useEffect } from 'react';
import { roomService } from '../../services/roomService';
import './RoomFilters.css';

const RoomFilters = ({ onFiltersChange, loading = false }) => {
    const [filters, setFilters] = useState({
        roomType: '',
        minPrice: '',
        maxPrice: '',
        capacity: ''
    });
    const [roomTypes, setRoomTypes] = useState([]);

    // Load available room types from backend
    useEffect(() => {
        loadRoomTypes();
    }, []);

    const loadRoomTypes = async () => {
        try {
            const response = await roomService.getRoomTypes();
            setRoomTypes(response.data);
        } catch (error) {
            console.error('Error loading room types:', error);
        }
    };

    const handleFilterChange = (key, value) => {
        const newFilters = { ...filters, [key]: value };
        setFilters(newFilters);

        // Debounce the API call
        setTimeout(() => {
            onFiltersChange(newFilters);
        }, 300);
    };

    const clearFilters = () => {
        const clearedFilters = {
            roomType: '',
            minPrice: '',
            maxPrice: '',
            capacity: ''
        };
        setFilters(clearedFilters);
        onFiltersChange(clearedFilters);
    };

    const hasActiveFilters = filters.roomType || filters.minPrice || filters.maxPrice || filters.capacity;

    return (
        <div className="room-filters">
            <div className="filters-header">
                <h3>Filter Rooms</h3>
                {hasActiveFilters && (
                    <button
                        className="clear-filters-btn"
                        onClick={clearFilters}
                        disabled={loading}
                    >
                        Clear All
                    </button>
                )}
            </div>

            <div className="filters-grid">
                {/* Room Type Filter */}
                <div className="filter-group">
                    <label htmlFor="roomType">Room Type</label>
                    <select
                        id="roomType"
                        value={filters.roomType}
                        onChange={(e) => handleFilterChange('roomType', e.target.value)}
                        disabled={loading}
                    >
                        <option value="">All Types</option>
                        {roomTypes.map(type => (
                            <option key={type} value={type}>
                                {type}
                            </option>
                        ))}
                    </select>
                </div>

                {/* Price Range Filter */}
                <div className="filter-group">
                    <label>Price Range ($)</label>
                    <div className="price-inputs">
                        <input
                            type="number"
                            placeholder="Min"
                            value={filters.minPrice}
                            onChange={(e) => handleFilterChange('minPrice', e.target.value)}
                            min="0"
                            disabled={loading}
                        />
                        <span className="price-separator">to</span>
                        <input
                            type="number"
                            placeholder="Max"
                            value={filters.maxPrice}
                            onChange={(e) => handleFilterChange('maxPrice', e.target.value)}
                            min="0"
                            disabled={loading}
                        />
                    </div>
                </div>

                {/* Capacity Filter */}
                <div className="filter-group">
                    <label htmlFor="capacity">Guests</label>
                    <select
                        id="capacity"
                        value={filters.capacity}
                        onChange={(e) => handleFilterChange('capacity', e.target.value)}
                        disabled={loading}
                    >
                        <option value="">Any</option>
                        <option value="1">1 Guest</option>
                        <option value="2">2 Guests</option>
                        <option value="3">3 Guests</option>
                        <option value="4">4+ Guests</option>
                    </select>
                </div>
            </div>

            {/* Active Filters Display */}
            {hasActiveFilters && (
                <div className="active-filters">
                    <span className="active-filters-label">Active Filters:</span>
                    {filters.roomType && (
                        <span className="filter-tag">
                            Type: {filters.roomType}
                            <button
                                onClick={() => handleFilterChange('roomType', '')}
                                disabled={loading}
                            >
                                ×
                            </button>
                        </span>
                    )}
                    {(filters.minPrice || filters.maxPrice) && (
                        <span className="filter-tag">
                            Price: ${filters.minPrice || '0'} - ${filters.maxPrice || 'Any'}
                            <button
                                onClick={() => {
                                    handleFilterChange('minPrice', '');
                                    handleFilterChange('maxPrice', '');
                                }}
                                disabled={loading}
                            >
                                ×
                            </button>
                        </span>
                    )}
                    {filters.capacity && (
                        <span className="filter-tag">
                            Guests: {filters.capacity === '4' ? '4+' : filters.capacity}
                            <button
                                onClick={() => handleFilterChange('capacity', '')}
                                disabled={loading}
                            >
                                ×
                            </button>
                        </span>
                    )}
                </div>
            )}
        </div>
    );
};

export default RoomFilters;