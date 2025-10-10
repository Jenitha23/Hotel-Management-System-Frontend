import React, { useState, useEffect } from 'react';
import { useLocation, Link } from 'react-router-dom';
import { CheckCircle, Download, Home } from 'lucide-react';
import { orderAPI } from '../services/api';

const OrderConfirmation = () => {
    const location = useLocation();
    const [order, setOrder] = useState(null);
    const [loading, setLoading] = useState(true);
    const orderNumber = location.state?.orderNumber;

    useEffect(() => {
        if (orderNumber) {
            fetchOrder();
        }
    }, [orderNumber]);

    const fetchOrder = async () => {
        try {
            const response = await orderAPI.getByNumber(orderNumber);
            setOrder(response.data);
        } catch (error) {
            console.error('Error fetching order:', error);
        } finally {
            setLoading(false);
        }
    };

    const downloadBill = async () => {
        try {
            const response = await orderAPI.getBill(orderNumber);
            const blob = new Blob([response.data], { type: 'application/pdf' });
            const url = window.URL.createObjectURL(blob);
            const link = document.createElement('a');
            link.href = url;
            link.download = `bill-${orderNumber}.pdf`;
            link.click();
            window.URL.revokeObjectURL(url);
        } catch (error) {
            console.error('Error downloading bill:', error);
        }
    };

    if (loading) {
        return <div className="container text-center p-4">Loading order details...</div>;
    }

    if (!order) {
        return (
            <div className="container text-center p-4">
                <h2>Order not found</h2>
                <Link to="/" className="btn btn-primary mt-4">
                    Return to Menu
                </Link>
            </div>
        );
    }

    return (
        <div className="container p-4">
            <div style={{ maxWidth: '600px', margin: '0 auto', textAlign: 'center' }}>
                <CheckCircle
                    size={80}
                    color="var(--teal)"
                    style={{ marginBottom: '1rem' }}
                />

                <h1 style={{
                    color: 'var(--teal)',
                    marginBottom: '1rem'
                }}>
                    Order Confirmed!
                </h1>

                <p style={{
                    fontSize: '1.2rem',
                    marginBottom: '2rem',
                    color: 'var(--deep-navy)'
                }}>
                    Thank you for your order at Palm Beach Resort
                </p>

                <div className="card" style={{ marginBottom: '2rem' }}>
                    <h3 style={{
                        color: 'var(--teal)',
                        marginBottom: '1rem'
                    }}>
                        Order Details
                    </h3>

                    <div style={{ textAlign: 'left', marginBottom: '1rem' }}>
                        <p><strong>Order Number:</strong> {order.orderNumber}</p>
                        <p><strong>Customer:</strong> {order.customerName}</p>
                        <p><strong>Email:</strong> {order.customerEmail}</p>
                        <p><strong>Phone:</strong> {order.customerPhone}</p>
                        <p><strong>Status:</strong> {order.status}</p>
                        <p><strong>Total Amount:</strong> ${order.totalAmount}</p>
                    </div>

                    <button
                        onClick={downloadBill}
                        className="btn btn-secondary"
                        style={{ marginBottom: '1rem' }}
                    >
                        <Download size={16} />
                        Download Bill
                    </button>
                </div>

                <div style={{ display: 'flex', gap: '1rem', justifyContent: 'center' }}>
                    <Link to="/" className="btn btn-primary">
                        <Home size={16} />
                        Back to Menu
                    </Link>
                </div>
            </div>
        </div>
    );
};

export default OrderConfirmation;