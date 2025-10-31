import React, { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { invoiceService } from '../services/invoiceService';
import { bookingService } from '../services/bookingService';
import './Invoice.css';

const Invoice = () => {
    const { bookingReference } = useParams();
    const { user } = useAuth();
    const navigate = useNavigate();
    const [invoice, setInvoice] = useState(null);
    const [customerBookings, setCustomerBookings] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');

    useEffect(() => {
        loadInvoiceData();
    }, [bookingReference]);

    const loadInvoiceData = async () => {
        try {
            setLoading(true);
            setError('');
            setInvoice(null);

            console.log('🔄 Loading invoice data, bookingReference:', bookingReference);

            // First, try to load customer bookings to see what's available
            const bookings = await bookingService.getCustomerBookings();
            setCustomerBookings(bookings || []);
            console.log('📋 Customer bookings:', bookings);

            let invoiceData;

            if (bookingReference) {
                // Try to load specific booking invoice
                try {
                    invoiceData = await invoiceService.getInvoiceByBooking(bookingReference);
                } catch (bookingError) {
                    console.log('❌ Could not load specific booking invoice:', bookingError);
                    // If specific booking fails, try current invoice
                    try {
                        invoiceData = await invoiceService.getCurrentInvoice();
                    } catch (currentError) {
                        throw new Error('No invoice available for this booking');
                    }
                }
            } else {
                // Try to load current invoice
                try {
                    invoiceData = await invoiceService.getCurrentInvoice();
                } catch (currentError) {
                    console.log('❌ No current invoice, checking available bookings...');

                    // If no current invoice, show the most recent booking
                    if (bookings && bookings.length > 0) {
                        const mostRecentBooking = bookings[0];
                        console.log('🔄 Trying most recent booking:', mostRecentBooking.bookingReference);

                        try {
                            invoiceData = await invoiceService.getInvoiceByBooking(mostRecentBooking.bookingReference);
                        } catch (recentError) {
                            throw new Error('No invoices available for your bookings');
                        }
                    } else {
                        throw new Error('You don\'t have any bill yet. Please book a room first.');
                    }
                }
            }

            console.log('✅ Invoice data received:', invoiceData);
            setInvoice(invoiceData);

        } catch (error) {
            console.error('❌ Error loading invoice:', error);
            setError(error.message || 'Failed to load invoice');
        } finally {
            setLoading(false);
        }
    };

    const handleDownloadPDF = async () => {
        if (!invoice?.roomBooking?.bookingReference) return;

        try {
            const result = await invoiceService.downloadInvoicePDF(invoice.roomBooking.bookingReference);
            alert('PDF download feature will be available soon!');
        } catch (error) {
            console.error('Error downloading PDF:', error);
            alert('PDF download is currently unavailable. Please check back later.');
        }
    };

    const handleBookingSelect = (bookingReference) => {
        navigate(`/customer/invoice/${bookingReference}`);
    };

    const formatCurrency = (amount) => {
        if (!amount) return '$0.00';
        return new Intl.NumberFormat('en-US', {
            style: 'currency',
            currency: invoice?.currency || 'USD'
        }).format(amount);
    };

    const formatDate = (dateString) => {
        if (!dateString) return 'N/A';
        return new Date(dateString).toLocaleDateString('en-US', {
            year: 'numeric',
            month: 'long',
            day: 'numeric'
        });
    };

    const formatDateTime = (dateTimeString) => {
        if (!dateTimeString) return 'N/A';
        return new Date(dateTimeString).toLocaleString('en-US', {
            year: 'numeric',
            month: 'short',
            day: 'numeric',
            hour: '2-digit',
            minute: '2-digit'
        });
    };

    if (loading) {
        return (
            <div className="invoice-page">
                <div className="invoice-header">
                    <div className="header-background">
                        <div className="header-content">
                            <button
                                className="back-button"
                                onClick={() => navigate('/customer/dashboard')}
                            >
                                ← Back to Dashboard
                            </button>
                            <h1>Invoice</h1>
                            <p>Palm Beach Resort - Luxury Stay Experience</p>
                        </div>
                    </div>
                </div>

                <div className="invoice-content">
                    <div className="loading">
                        <div className="loading-spinner"></div>
                        <p>Loading your invoice...</p>
                    </div>
                </div>
            </div>
        );
    }

    // No bookings at all
    if (error && customerBookings.length === 0) {
        return (
            <div className="invoice-page">
                <div className="invoice-header">
                    <div className="header-background">
                        <div className="header-content">
                            <button
                                className="back-button"
                                onClick={() => navigate('/customer/dashboard')}
                            >
                                ← Back to Dashboard
                            </button>
                            <h1>Invoice</h1>
                            <p>Palm Beach Resort - Luxury Stay Experience</p>
                        </div>
                    </div>
                </div>

                <div className="invoice-content">
                    <div className="no-invoice-message">
                        <div className="no-invoice-icon">🧾</div>
                        <h3>No Bills Available</h3>
                        <p>You don't have any bill yet. Please book a room first to view invoices.</p>
                        <div className="no-invoice-actions">
                            <Link to="/rooms" className="btn btn-primary">
                                Book a Room
                            </Link>
                            <Link to="/customer/dashboard" className="btn btn-outline">
                                Back to Dashboard
                            </Link>
                        </div>
                    </div>
                </div>
            </div>
        );
    }

    // Has bookings but no invoice data
    if (error && customerBookings.length > 0) {
        return (
            <div className="invoice-page">
                <div className="invoice-header">
                    <div className="header-background">
                        <div className="header-content">
                            <button
                                className="back-button"
                                onClick={() => navigate('/customer/dashboard')}
                            >
                                ← Back to Dashboard
                            </button>
                            <h1>Invoice</h1>
                            <p>Palm Beach Resort - Luxury Stay Experience</p>
                        </div>
                    </div>
                </div>

                <div className="invoice-content">
                    <div className="no-invoice-message">
                        <div className="no-invoice-icon">🧾</div>
                        <h3>No Invoice Available</h3>
                        <p>You don't have any bill yet for your bookings.</p>

                        <div className="booking-selection">
                            <h4>Select a booking to check for invoice:</h4>
                            <div className="booking-options">
                                {customerBookings.map(booking => (
                                    <button
                                        key={booking.id}
                                        className="btn btn-outline"
                                        onClick={() => handleBookingSelect(booking.bookingReference)}
                                    >
                                        Booking {booking.bookingReference} - {formatDate(booking.checkInDate)} to {formatDate(booking.checkOutDate)}
                                    </button>
                                ))}
                            </div>
                        </div>

                        <div className="no-invoice-actions">
                            <button onClick={loadInvoiceData} className="btn btn-primary">
                                Try Again
                            </button>
                            <Link to="/customer/dashboard" className="btn btn-outline">
                                Back to Dashboard
                            </Link>
                        </div>
                    </div>
                </div>
            </div>
        );
    }

    // No invoice data found (fallback case)
    if (!invoice) {
        return (
            <div className="invoice-page">
                <div className="invoice-header">
                    <div className="header-background">
                        <div className="header-content">
                            <button
                                className="back-button"
                                onClick={() => navigate('/customer/dashboard')}
                            >
                                ← Back to Dashboard
                            </button>
                            <h1>Invoice</h1>
                            <p>Palm Beach Resort - Luxury Stay Experience</p>
                        </div>
                    </div>
                </div>

                <div className="invoice-content">
                    <div className="no-invoice-message">
                        <div className="no-invoice-icon">🧾</div>
                        <h3>No Invoice Data Found</h3>
                        <p>You don't have any bill yet. Please book a room first or contact support if you believe this is an error.</p>
                        <div className="no-invoice-actions">
                            <Link to="/rooms" className="btn btn-primary">
                                Book a Room
                            </Link>
                            <Link to="/customer/dashboard" className="btn btn-outline">
                                Back to Dashboard
                            </Link>
                        </div>
                    </div>
                </div>
            </div>
        );
    }

    console.log('🎨 Rendering invoice with data:', invoice);

    return (
        <div className="invoice-page">
            {/* Header */}
            <div className="invoice-header">
                <div className="header-background">
                    <div className="header-content">
                        <button
                            className="back-button"
                            onClick={() => navigate('/customer/dashboard')}
                        >
                            ← Back to Dashboard
                        </button>
                        <h1>Invoice</h1>
                        <p>Palm Beach Resort - Luxury Stay Experience</p>
                    </div>
                </div>
            </div>

            <div className="invoice-content">
                {/* Booking Selection */}
                {customerBookings.length > 1 && (
                    <div className="booking-selection-panel">
                        <h4>View invoice for:</h4>
                        <div className="booking-options">
                            {customerBookings.map(booking => (
                                <button
                                    key={booking.id}
                                    className={`btn ${invoice.roomBooking?.bookingReference === booking.bookingReference ? 'btn-primary' : 'btn-outline'}`}
                                    onClick={() => handleBookingSelect(booking.bookingReference)}
                                >
                                    {booking.bookingReference} - {formatDate(booking.checkInDate)}
                                </button>
                            ))}
                        </div>
                    </div>
                )}

                {/* Invoice Actions */}
                <div className="invoice-actions">
                    <button
                        className="btn btn-primary"
                        onClick={handleDownloadPDF}
                        disabled={!invoice?.roomBooking?.bookingReference}
                    >
                        📄 Download PDF
                    </button>
                    <Link to="/customer/dashboard" className="btn btn-outline">
                        🏠 Back to Dashboard
                    </Link>
                </div>

                {/* Debug Info */}
                <div className="debug-info">
                    <h4>Invoice Information</h4>
                    <div className="debug-info-content">
                        <div>
                            <strong>Booking Reference:</strong> {invoice.roomBooking?.bookingReference || 'N/A'}
                        </div>
                        <div>
                            <strong>Room Booking:</strong> {invoice.roomBooking ? 'Yes' : 'No'}
                        </div>
                        <div>
                            <strong>Food Orders:</strong> {invoice.foodOrders ? invoice.foodOrders.length : 0}
                        </div>
                        <div>
                            <strong>Grand Total:</strong> {formatCurrency(invoice.grandTotal)}
                        </div>
                    </div>
                </div>

                {/* Invoice Card */}
                <div className="invoice-card">
                    {/* Invoice Header */}
                    <div className="invoice-card-header">
                        <div className="invoice-info">
                            <h2>INVOICE</h2>
                            <p className="invoice-number">
                                Ref: {invoice.roomBooking?.bookingReference || 'N/A'}
                            </p>
                            <p className="invoice-date">
                                Generated: {formatDateTime(invoice.generatedAt)}
                            </p>
                        </div>
                        <div className="resort-info">
                            <h3>Palm Beach Resort</h3>
                            <p>123 Ocean Drive, Palm Beach</p>
                            <p>Florida, 33480</p>
                            <p>reservations@palmbeachresort.com</p>
                        </div>
                    </div>

                    {/* Customer Information */}
                    <div className="customer-section">
                        <h3>Bill To:</h3>
                        <div className="customer-info">
                            <p><strong>{invoice.customerName || 'N/A'}</strong></p>
                            <p>{invoice.customerEmail || 'N/A'}</p>
                            <p>Customer ID: {invoice.customerId || 'N/A'}</p>
                        </div>
                    </div>

                    {/* Room Booking Details */}
                    <div className="section room-section">
                        <h3>Room Booking Details</h3>
                        {invoice.roomBooking ? (
                            <div className="room-details">
                                <div className="detail-row">
                                    <span>Room Number:</span>
                                    <span>{invoice.roomBooking.roomNumber || 'N/A'}</span>
                                </div>
                                <div className="detail-row">
                                    <span>Room Type:</span>
                                    <span>{invoice.roomBooking.roomType || 'N/A'}</span>
                                </div>
                                <div className="detail-row">
                                    <span>Check-in:</span>
                                    <span>{formatDate(invoice.roomBooking.checkInDate)}</span>
                                </div>
                                <div className="detail-row">
                                    <span>Check-out:</span>
                                    <span>{formatDate(invoice.roomBooking.checkOutDate)}</span>
                                </div>
                                <div className="detail-row">
                                    <span>Number of Nights:</span>
                                    <span>{invoice.roomBooking.numberOfNights || 0}</span>
                                </div>
                                <div className="detail-row">
                                    <span>Nightly Rate:</span>
                                    <span>{formatCurrency(invoice.roomBooking.nightlyRate)}</span>
                                </div>
                                <div className="detail-row">
                                    <span>Status:</span>
                                    <span>{invoice.roomBooking.status || 'N/A'}</span>
                                </div>
                                <div className="detail-row total-row">
                                    <span>Room Total:</span>
                                    <span>{formatCurrency(invoice.roomTotal)}</span>
                                </div>
                            </div>
                        ) : (
                            <div className="no-data-message">
                                <p>No room booking information available</p>
                            </div>
                        )}
                    </div>

                    {/* Food Orders */}
                    <div className="section food-section">
                        <h3>Food & Beverage Orders</h3>
                        {invoice.foodOrders && invoice.foodOrders.length > 0 ? (
                            <>
                                {invoice.foodOrders.map((order, index) => (
                                    <div key={order.orderId || index} className="food-order">
                                        <div className="order-header">
                                            <span className="order-number">Order #{order.orderNumber || `ORDER-${index + 1}`}</span>
                                            <span className="order-date">{formatDateTime(order.orderDate)}</span>
                                            <span className="order-status">{order.status?.replace(/_/g, ' ') || 'N/A'}</span>
                                        </div>
                                        {order.items && order.items.length > 0 ? (
                                            <div className="order-items">
                                                {order.items.map((item, itemIndex) => (
                                                    <div key={itemIndex} className="order-item">
                                                        <span className="item-name">{item.name || 'Unknown Item'}</span>
                                                        <span className="item-quantity">× {item.quantity || 0}</span>
                                                        <span className="item-price">{formatCurrency(item.subtotal)}</span>
                                                    </div>
                                                ))}
                                            </div>
                                        ) : (
                                            <div className="no-items-message">
                                                <p>No items in this order</p>
                                            </div>
                                        )}
                                        <div className="order-total">
                                            <span>Order Total:</span>
                                            <span>{formatCurrency(order.totalAmount)}</span>
                                        </div>
                                    </div>
                                ))}
                                <div className="food-total total-row">
                                    <span>Food & Beverage Total:</span>
                                    <span>{formatCurrency(invoice.foodTotal)}</span>
                                </div>
                            </>
                        ) : (
                            <div className="no-orders-message">
                                <p>No food orders for this stay</p>
                            </div>
                        )}
                    </div>

                    {/* Financial Summary */}
                    <div className="section summary-section">
                        <h3>Financial Summary</h3>
                        <div className="summary-details">
                            <div className="detail-row">
                                <span>Room Charges:</span>
                                <span>{formatCurrency(invoice.roomTotal || 0)}</span>
                            </div>
                            <div className="detail-row">
                                <span>Food & Beverage:</span>
                                <span>{formatCurrency(invoice.foodTotal || 0)}</span>
                            </div>
                            <div className="detail-row grand-total">
                                <span>Grand Total:</span>
                                <span>{formatCurrency(invoice.grandTotal || 0)}</span>
                            </div>
                        </div>
                    </div>

                    {/* Footer */}
                    <div className="invoice-footer">
                        <p>Thank you for choosing Palm Beach Resort!</p>
                        <p>For any questions regarding this invoice, please contact our billing department.</p>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Invoice;