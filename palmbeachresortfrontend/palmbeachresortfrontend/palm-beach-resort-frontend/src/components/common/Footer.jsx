import React from 'react';
import './Footer.css';

const Footer = () => {
    return (
        <footer className="footer">
            <div className="footer-container">
                <div className="footer-content">
                    <div className="footer-section">
                        <h3>🌴 Palm Beach Resort</h3>
                        <p>Luxury beachfront accommodations with world-class amenities and breathtaking ocean views.</p>
                    </div>

                    <div className="footer-section">
                        <h4>Contact Info</h4>
                        <p>📍 123 Beach Boulevard, Palm Beach</p>
                        <p>📞 +1 (555) 123-4567</p>
                        <p>✉️ info@palmbeachresort.com</p>
                    </div>
                </div>

                <div className="footer-bottom">
                    <p>&copy; 2024 Palm Beach Resort. All rights reserved.</p>
                </div>
            </div>
        </footer>
    );
};

export default Footer;