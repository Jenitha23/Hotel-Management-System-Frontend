import React from 'react';
import { Link } from 'react-router-dom';
import { ShoppingCart, Utensils } from 'lucide-react';
import { useCart } from '../context/CartContext';

const Header = () => {
    const { cart } = useCart();
    const itemCount = cart?.items?.reduce((total, item) => total + item.quantity, 0) || 0;

    return (
        <header style={{
            backgroundColor: 'var(--deep-navy)',
            color: 'var(--white)',
            padding: '1rem 0',
            boxShadow: '0 2px 10px rgba(0,0,0,0.1)'
        }}>
            <div className="container">
                <div style={{
                    display: 'flex',
                    justifyContent: 'space-between',
                    alignItems: 'center'
                }}>
                    <Link to="/" style={{
                        display: 'flex',
                        alignItems: 'center',
                        gap: '10px',
                        color: 'var(--white)',
                        textDecoration: 'none',
                        fontSize: '1.5rem',
                        fontWeight: 'bold'
                    }}>
                        <Utensils size={28} />
                        Palm Beach Resort
                    </Link>

                    <nav>
                        <Link to="/cart" style={{
                            display: 'flex',
                            alignItems: 'center',
                            gap: '8px',
                            color: 'var(--white)',
                            textDecoration: 'none',
                            padding: '8px 16px',
                            borderRadius: '6px',
                            backgroundColor: 'var(--teal)',
                            transition: 'background-color 0.3s'
                        }}>
                            <ShoppingCart size={20} />
                            Cart ({itemCount})
                        </Link>
                    </nav>
                </div>
            </div>
        </header>
    );
};

export default Header;