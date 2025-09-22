import React from 'react';

const MenuCard = ({ item, onEdit, onDelete, isAdmin = false }) => {
    // Get proper image URL with fallbacks
    const getImageUrl = () => {
        if (item.imageUrl) {
            return item.imageUrl;
        }

        // Category-based placeholder images
        const placeholders = {
            'Appetizers': 'https://images.unsplash.com/photo-1565958011703-44f9829ba187?w=400&h=300&fit=crop',
            'Main Courses': 'https://images.unsplash.com/photo-1565299624946-b28f40a0ca4b?w=400&h=300&fit=crop',
            'Desserts': 'https://images.unsplash.com/photo-1563729784474-d77dbb933a9e?w=400&h=300&fit=crop',
            'Beverages': 'https://images.unsplash.com/photo-1560518883-ce09059eeffa?w=400&h=300&fit=crop',
            'Salads': 'https://images.unsplash.com/photo-1540420773420-3366772f4999?w=400&h=300&fit=crop',
            'Seafood Specialties': 'https://images.unsplash.com/photo-1563379091339-03246963d8df?w=400&h=300&fit=crop'
        };

        return placeholders[item.categoryName] || 'https://images.unsplash.com/photo-1546069901-ba9599a7e63c?w=400&h=300&fit=crop';
    };

    const handleImageError = (e) => {
        e.target.src = 'https://images.unsplash.com/photo-1546069901-ba9599a7e63c?w=400&h=300&fit=crop';
    };

    return (
        <div className="menu-card">
            <img
                src={getImageUrl()}
                alt={item.name}
                className="menu-card-image"
                onError={handleImageError}
                loading="lazy"
            />
            <div className="menu-card-content">
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '0.5rem' }}>
                    <h3 className="menu-card-title">{item.name}</h3>
                    <span className={`availability-badge ${item.available ? 'available' : 'unavailable'}`}>
            {item.available ? 'Available' : 'Unavailable'}
          </span>
                </div>

                <div className="menu-card-category">{item.categoryName}</div>
                <div className="menu-card-price">${item.price}</div>
                <p className="menu-card-description">{item.description}</p>

                {isAdmin && (
                    <div style={{ display: 'flex', gap: '0.5rem', marginTop: '1rem' }}>
                        <button
                            className="btn btn-primary"
                            onClick={() => onEdit(item)}
                            style={{ flex: 1 }}
                        >
                            Edit
                        </button>
                        <button
                            className="btn btn-danger"
                            onClick={() => onDelete(item.id)}
                            style={{ flex: 1 }}
                        >
                            Delete
                        </button>
                    </div>
                )}
            </div>
        </div>
    );
};

export default MenuCard;