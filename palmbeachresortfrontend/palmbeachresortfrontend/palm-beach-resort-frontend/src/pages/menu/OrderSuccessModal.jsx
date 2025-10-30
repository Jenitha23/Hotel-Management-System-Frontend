import React from 'react';
import './OrderSuccessModal.css';

const OrderSuccessModal = ({ order, onViewHistory, onTrackOrder, onClose }) => {
    return (
        <div className="modal-overlay">
            <div className="order-success-modal">
                <div className="success-header">
                    <div className="success-icon">🎉</div>
                    <h2>Order Placed Successfully!</h2>
                </div>

                <div className="order-details">
                    <div className="order-number">
                        Order #: <strong>{order.orderNumber}</strong>
                    </div>
                    <div className="order-total">
                        Total: <strong>${order.totalAmount?.toFixed(2)}</strong>
                    </div>
                    <div className="estimated-time">
                        ⏱️ Estimated preparation time: {order.estimatedPreparationTime} minutes
                    </div>
                </div>

                <div className="success-actions">
                    <button
                        className="btn btn-primary"
                        onClick={onTrackOrder}
                    >
                        📍 Track This Order
                    </button>
                    <button
                        className="btn btn-secondary"
                        onClick={onViewHistory}
                    >
                        📋 View Order History
                    </button>
                    <button
                        className="btn btn-outline"
                        onClick={onClose}
                    >
                        Continue Shopping
                    </button>
                </div>

                <div className="success-tips">
                    <h4>What's Next?</h4>
                    <ul>
                        <li>• Track your order status in real-time</li>
                        <li>• You'll receive updates on preparation progress</li>
                        <li>• Food will be delivered to your room</li>
                        <li>• You can cancel within 10 minutes if needed</li>
                    </ul>
                </div>
            </div>
        </div>
    );
};

export default OrderSuccessModal;
