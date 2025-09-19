import React from 'react';
import { HeartIcon, PlusIcon } from 'lucide-react';
interface FoodCardProps {
    name: string;
    price: number;
    image: string;
    discount?: number;
    isFavorite?: boolean;
}
const FoodCard = ({
                      name,
                      price,
                      image,
                      discount = 15,
                      isFavorite = false
                  }: FoodCardProps) => {
    return <div className="bg-white rounded-lg p-4 relative">
        {discount > 0 && <div className="absolute top-6 left-4 bg-red-500 text-white text-xs px-2 py-1 rounded">
            {discount}% Off
        </div>}
        <button className="absolute top-6 right-4 text-gray-400 hover:text-red-500">
            <HeartIcon size={24} fill={isFavorite ? 'red' : 'none'} />
        </button>
        <div className="flex justify-center mb-2">
            <img src={image} alt={name} className="h-40 object-contain" />
        </div>
        <div className="flex items-center mb-1">
            {[1, 2, 3, 4, 5].map(star => <span key={star} className="text-yellow-400">
            ★
          </span>)}
        </div>
        <h3 className="font-medium text-gray-800">{name}</h3>
        <div className="flex items-center justify-between mt-2">
            <div className="flex items-center">
                <span className="text-yellow-500 font-bold">$</span>
                <span className="text-gray-800 font-bold text-lg">
            {price.toFixed(2)}
          </span>
            </div>
            <button className="bg-yellow-400 p-2 rounded-md">
                <PlusIcon size={18} className="text-white" />
            </button>
        </div>
    </div>;
};
export default FoodCard;