import React from 'react';
import { Link } from 'react-router-dom';
import Button from '../components/ui/Button.jsx';
import Card from '../components/ui/Card.jsx';

const Home = () => {
    const features = [
        {
            title: 'Luxury Accommodation now',
            description: 'Experience premium comfort in our beautifully designed rooms with ocean views.',
            icon: '🏨'
        },
        {
            title: 'Beachfront Location',
            description: 'Just steps away from pristine sandy beaches and crystal-clear waters.',
            icon: '🏖️'
        },
        {
            title: 'World-Class Service',
            description: 'Our dedicated staff ensures your stay exceeds all expectations.',
            icon: '⭐'
        }
    ];

    return (
        <div style={{ minHeight: '100vh' }}>

            <header style={{
                background: 'linear-gradient(135deg, var(--color-teal), var(--color-coral))',
                color: 'white',
                padding: 'var(--spacing-xl) 0'
            }}>
                <div className="container" style={{
                    display: 'flex',
                    justifyContent: 'space-between',
                    alignItems: 'center',
                    flexWrap: 'wrap',
                    gap: 'var(--spacing-lg)'
                }}>
                    <Link
                        to="/"
                        style={{
                            fontSize: 'var(--text-3xl)',
                            fontWeight: '700',
                            color: 'white',
                            textDecoration: 'none'
                        }}
                    >
                        🏨 Palm Beach Resort
                    </Link>

                    <div style={{ display: 'flex', gap: 'var(--spacing-md)' }}>
                        <Link to="/rooms">
                            <Button variant="secondary">View Rooms</Button>
                        </Link>
                        <Link to="/admin">
                            <Button
                                style={{
                                    backgroundColor: 'rgba(255,255,255,0.2)',
                                    color: 'white',
                                    border: '2px solid white'
                                }}
                            >
                                Admin
                            </Button>
                        </Link>
                    </div>
                </div>
            </header>

            {/* Hero Section */}
            <section style={{
                padding: 'var(--spacing-2xl) 0',
                textAlign: 'center'
            }}>
                <div className="container">
                    <h1 style={{
                        fontSize: 'var(--text-4xl)',
                        fontWeight: '700',
                        color: 'var(--color-navy)',
                        marginBottom: 'var(--spacing-lg)',
                        lineHeight: '1.2'
                    }}>
                        Welcome to Paradise
                    </h1>

                    <p style={{
                        fontSize: 'var(--text-xl)',
                        color: '#666',
                        marginBottom: 'var(--spacing-2xl)',
                        maxWidth: '600px',
                        margin: '0 auto var(--spacing-2xl) auto',
                        lineHeight: '1.6'
                    }}>
                        Discover luxury and comfort at Palm Beach Resort, where pristine beaches meet exceptional hospitality. Your perfect getaway awaits.
                    </p>

                    <Link to="/rooms">
                        <Button
                            size="lg"
                            style={{
                                padding: 'var(--spacing-md) var(--spacing-2xl)',
                                fontSize: 'var(--text-lg)'
                            }}
                        >
                            Explore Our Rooms
                        </Button>
                    </Link>
                </div>
            </section>

            {/* Features Section */}
            <section style={{
                padding: 'var(--spacing-2xl) 0',
                backgroundColor: 'white'
            }}>
                <div className="container">
                    <h2 style={{
                        fontSize: 'var(--text-3xl)',
                        fontWeight: '700',
                        color: 'var(--color-navy)',
                        textAlign: 'center',
                        marginBottom: 'var(--spacing-2xl)'
                    }}>
                        Why Choose Palm Beach Resort?
                    </h2>

                    <div style={{
                        display: 'grid',
                        gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))',
                        gap: 'var(--spacing-xl)'
                    }}>
                        {features.map((feature, index) => (
                            <Card key={index} hover={false}>
                                <div style={{
                                    padding: 'var(--spacing-xl)',
                                    textAlign: 'center'
                                }}>
                                    <div style={{
                                        fontSize: '48px',
                                        marginBottom: 'var(--spacing-lg)'
                                    }}>
                                        {feature.icon}
                                    </div>
                                    <h3 style={{
                                        fontSize: 'var(--text-xl)',
                                        fontWeight: '700',
                                        color: 'var(--color-navy)',
                                        marginBottom: 'var(--spacing-md)'
                                    }}>
                                        {feature.title}
                                    </h3>
                                    <p style={{
                                        color: '#666',
                                        lineHeight: '1.6'
                                    }}>
                                        {feature.description}
                                    </p>
                                </div>
                            </Card>
                        ))}
                    </div>
                </div>
            </section>

            {/* CTA Section */}
            <section style={{
                padding: 'var(--spacing-2xl) 0',
                backgroundColor: 'var(--color-teal)',
                color: 'white',
                textAlign: 'center'
            }}>
                <div className="container">
                    <h2 style={{
                        fontSize: 'var(--text-3xl)',
                        fontWeight: '700',
                        marginBottom: 'var(--spacing-lg)'
                    }}>
                        Ready for Your Beach Getaway?
                    </h2>
                    <p style={{
                        fontSize: 'var(--text-lg)',
                        marginBottom: 'var(--spacing-xl)',
                        opacity: '0.9'
                    }}>
                        Book your stay today and create memories that will last a lifetime.
                    </p>
                    <Link to="/rooms">
                        <Button
                            style={{
                                backgroundColor: 'white',
                                color: 'var(--color-teal)',
                                padding: 'var(--spacing-md) var(--spacing-2xl)',
                                fontSize: 'var(--text-lg)'
                            }}
                        >
                            Book Now
                        </Button>
                    </Link>
                </div>
            </section>
        </div>
    );
};

export default Home;