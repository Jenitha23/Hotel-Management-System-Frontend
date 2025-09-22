import React from 'react';

const MenuFilters = ({
                         filters,
                         categories,
                         onFilterChange,
                         onReset
                     }) => {
    return (
        <div className="filters">
            <div className="grid grid-2">
                <div className="form-group">
                    <label className="form-label">Search</label>
                    <input
                        type="text"
                        className="form-input"
                        placeholder="Search menu items..."
                        value={filters.q || ''}
                        onChange={(e) => onFilterChange('q', e.target.value)}
                    />
                </div>

                <div className="form-group">
                    <label className="form-label">Category</label>
                    <select
                        className="form-select"
                        value={filters.categoryId || ''}
                        onChange={(e) => onFilterChange('categoryId', e.target.value || null)}
                    >
                        <option value="">All Categories</option>
                        {categories.map(category => (
                            <option key={category.id} value={category.id}>
                                {category.name}
                            </option>
                        ))}
                    </select>
                </div>

                <div className="form-group">
                    <label className="form-label">Availability</label>
                    <select
                        className="form-select"
                        value={filters.available || ''}
                        onChange={(e) => onFilterChange('available', e.target.value || null)}
                    >
                        <option value="">All</option>
                        <option value="true">Available</option>
                        <option value="false">Unavailable</option>
                    </select>
                </div>

                <div className="form-group">
                    <label className="form-label">Price Range</label>
                    <div style={{ display: 'flex', gap: '10px' }}>
                        <input
                            type="number"
                            className="form-input"
                            placeholder="Min price"
                            value={filters.minPrice || ''}
                            onChange={(e) => onFilterChange('minPrice', e.target.value || null)}
                            min="0"
                            step="0.01"
                        />
                        <input
                            type="number"
                            className="form-input"
                            placeholder="Max price"
                            value={filters.maxPrice || ''}
                            onChange={(e) => onFilterChange('maxPrice', e.target.value || null)}
                            min="0"
                            step="0.01"
                        />
                    </div>
                </div>
            </div>

            <button
                className="btn btn-secondary"
                onClick={onReset}
                style={{ marginTop: '1rem' }}
            >
                Reset Filters
            </button>
        </div>
    );
};

export default MenuFilters;