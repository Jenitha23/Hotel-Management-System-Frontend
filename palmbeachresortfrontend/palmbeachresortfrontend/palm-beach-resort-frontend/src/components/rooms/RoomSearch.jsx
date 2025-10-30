import React, { useState } from 'react';


const RoomSearch = ({ onSearch, roomTypes }) => {
    const [filters, setFilters] = useState({
        roomType: '',
        minPrice: '',
        maxPrice: '',
        capacity: ''
    });

    const handleFilterChange = (key, value) => {
        const newFilters = { ...filters, [key]: value };
        setFilters(newFilters);
        onSearch(newFilters);
    };

    const clearFilters = () => {
        const clearedFilters = {
            roomType: '',
            minPrice: '',
            maxPrice: '',
            capacity: ''
        };
        setFilters(clearedFilters);
        onSearch(clearedFilters);
    };

    const hasActiveFilters = filters.roomType || filters.minPrice || filters.maxPrice || filters.capacity;

    return (
        <div className="room-search">
            <h3>Find Your Perfect Room</h3>

            <div className="search-filters">
                <div className="filter-group">
                    <label>Room Type</label>
                    <select
                        value={filters.roomType}
                        onChange={(e) => handleFilterChange('roomType', e.target.value)}
                    >
                        <option value="">All Types</option>
                        {roomTypes.map(type => (
                            <option key={type} value={type}>{type}</option>
                        ))}
                    </select>
                </div>

                <div className="filter-group">
                    <label>Price Range ($)</label>
                    <div className="price-inputs">
                        <input
                            type="number"
                            placeholder="Min"
                            value={filters.minPrice}
                            onChange={(e) => handleFilterChange('minPrice', e.target.value)}
                            min="0"
                        />
                        <span>to</span>
                        <input
                            type="number"
                            placeholder="Max"
                            value={filters.maxPrice}
                            onChange={(e) => handleFilterChange('maxPrice', e.target.value)}
                            min="0"
                        />
                    </div>
                </div>

                <div className="filter-group">
                    <label>Guests</label>
                    <select
                        value={filters.capacity}
                        onChange={(e) => handleFilterChange('capacity', e.target.value)}
                    >
                        <option value="">Any</option>
                        <option value="1">1 Guest</option>
                        <option value="2">2 Guests</option>
                        <option value="3">3 Guests</option>
                        <option value="4">4+ Guests</option>
                    </select>
                </div>

                {hasActiveFilters && (
                    <button className="clear-filters" onClick={clearFilters}>
                        Clear Filters
                    </button>
                )}
            </div>
        </div>
    );
};

export default RoomSearch;