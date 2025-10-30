import React from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import './Home.css';

const Home = () => {
    const { user } = useAuth();

    const features = [
        {
            icon: '🌊',
            title: 'Beachfront Location',
            description: 'Direct access to pristine white sand beaches and crystal-clear waters.'
        },
        {
            icon: '🛏️',
            title: 'Luxury Accommodations',
            description: 'Elegantly appointed rooms and suites with modern amenities and ocean views.'
        },
        {
            icon: '🍽️',
            title: 'Fine Dining',
            description: 'World-class restaurants featuring fresh seafood and international cuisine.'
        }
    ];

    const services = [
        {
            icon: '🛏️',
            title: 'Accommodations',
            description: 'Explore our luxury rooms and suites',
            link: '/rooms',
            color: 'teal'
        },
        {
            icon: '📅',
            title: 'Reservations',
            description: 'Book your perfect getaway',
            link: user ? '/rooms' : '/login',
            color: 'coral'
        },
        {
            icon: '🍴',
            title: 'Dining',
            description: 'Discover our culinary offerings',
            link: '/menu',
            color: 'orange'
        },
        {
            icon: '👤',
            title: 'Profile',
            description: 'Manage your account',
            link: '/profile',
            color: 'purple',
            show: user
        },
        {
            icon: '✨',
            title: 'Spa & Wellness',
            description: 'Relax and rejuvenate',
            link: '/spa',
            color: 'emerald'
        },
        {
            icon: '🔐',
            title: 'Member Login',
            description: 'Access your account',
            link: '/login',
            color: 'blue',
            show: !user
        }
    ];

    return (
        <div className="home-page">
            <section className="hero-section">
                <div className="hero-background"></div>
                <div className="hero-content">
                    <h1 className="hero-title">
                        Palm Beach Resort
                    </h1>
                    <p className="hero-subtitle">
                        Where luxury meets paradise. Experience the ultimate beachfront escape with world-class amenities and breathtaking ocean views.
                    </p>
                    <div className="hero-buttons">
                        <Link
                            to="/rooms"
                            className="btn btn-primary"
                        >
                            View Rooms
                        </Link>
                        <Link
                            to={user ? "/rooms" : "/login"}
                            className="btn btn-secondary"
                        >
                            Book Now
                        </Link>
                    </div>
                </div>
            </section>

            <section className="features-section">
                <div className="container">
                    <div className="section-header">
                        <h2 className="section-title">Why Choose Palm Beach Resort?</h2>
                        <p className="section-subtitle">
                            Discover what makes our resort the perfect destination for your next getaway
                        </p>
                    </div>

                    <div className="features-grid">
                        {features.map((feature, index) => (
                            <div key={index} className="feature-card">
                                <div className="feature-icon">
                                    {feature.icon}
                                </div>
                                <h3 className="feature-title">{feature.title}</h3>
                                <p className="feature-description">{feature.description}</p>
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            <section className="services-section">
                <div className="container">
                    <div className="section-header">
                        <h2 className="section-title">Our Services</h2>
                        <p className="section-subtitle">Everything you need for the perfect vacation</p>
                    </div>

                    <div className="services-grid">
                        {services.map((service, index) => (
                            (service.show === undefined || service.show) && (
                                <Link
                                    key={index}
                                    to={service.link}
                                    className={`service-card service-${service.color}`}
                                >
                                    <div className="service-icon">{service.icon}</div>
                                    <h3 className="service-title">{service.title}</h3>
                                    <p className="service-description">{service.description}</p>
                                </Link>
                            )
                        ))}
                    </div>
                </div>
            </section>
        </div>
    );
};

export default Home;
