import React from 'react';
import './UserTypeSelector.css';

const UserTypeSelector = ({ selectedType, onTypeChange, mode = 'login' }) => {
    const userTypes = [
        { value: 'CUSTOMER', label: 'Customer', description: 'Book stays and manage reservations' },
        { value: 'STAFF', label: 'Staff', description: 'Manage resort operations' },
        { value: 'ADMIN', label: 'Admin', description: 'Full system access' }
    ];

    return (
        <div className="user-type-selector">
            <div className="user-type-grid">
                {userTypes.map((type) => (
                    <div
                        key={type.value}
                        className={`user-type-card ${selectedType === type.value ? 'selected' : ''}`}
                        onClick={() => onTypeChange(type.value)}
                    >
                        <div className="user-type-icon">
                            {type.value === 'CUSTOMER' && '👤'}
                            {type.value === 'STAFF' && '👨‍'}
                            {type.value === 'ADMIN' && '🧑‍💼'}
                        </div>
                        <h4>{type.label}</h4>
                    </div>
                ))}
            </div>
        </div>
    );
};

export default UserTypeSelector;