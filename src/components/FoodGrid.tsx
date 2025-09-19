import React from 'react';
import FoodCard from './FoodCard';
const FoodGrid = () => {
    const foodItems = [{
        id: 1,
        name: 'Fish Burger',
        price: 5.59,
        image: 'https://images.unsplash.com/photo-1568901346375-23c9450c58cd?ixlib=rb-1.2.1&auto=format&fit=crop&w=500&q=80',
        isFavorite: true
    }, {
        id: 2,
        name: 'Beef Burger',
        price: 5.59,
        image: 'https://images.unsplash.com/photo-1571091718767-18b5b1457add?ixlib=rb-1.2.1&auto=format&fit=crop&w=500&q=80',
        isFavorite: false
    }, {
        id: 3,
        name: 'Cheese Burger',
        price: 5.59,
        image: 'https://images.unsplash.com/photo-1550317138-10000687a72b?ixlib=rb-1.2.1&auto=format&fit=crop&w=500&q=80',
        isFavorite: false
    }, {
        id: 4,
        name: 'Fish Burger',
        price: 5.59,
        image: 'https://images.unsplash.com/photo-1568901346375-23c9450c58cd?ixlib=rb-1.2.1&auto=format&fit=crop&w=500&q=80',
        isFavorite: true
    }, {
        id: 5,
        name: 'Beef Burger',
        price: 5.59,
        image: 'https://images.unsplash.com/photo-1571091718767-18b5b1457add?ixlib=rb-1.2.1&auto=format&fit=crop&w=500&q=80',
        isFavorite: false
    }, {
        id: 6,
        name: 'Cheese Burger',
        price: 5.59,
        image: 'https://images.unsplash.com/photo-1550317138-10000687a72b?ixlib=rb-1.2.1&auto=format&fit=crop&w=500&q=80',
        isFavorite: false
    }];
    return <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {foodItems.map(item => <FoodCard key={item.id} name={item.name} price={item.price} image={item.image} isFavorite={item.isFavorite} />)}
    </div>;
};
export default FoodGrid;