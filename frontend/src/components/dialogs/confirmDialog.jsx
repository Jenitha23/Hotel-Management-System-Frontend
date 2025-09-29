import React from 'react';
import Button from '../ui/Button.jsx';

const ConfirmDialog = ({
                           isOpen,
                           onClose,
                           onConfirm,
                           title = 'Confirm Action 1',
                           message = 'Are you sure you want to proceed?',
                           confirmText = 'Confirm',
                           cancelText = 'Cancel',
                           loading = false
                       }) => {
    if (!isOpen) return null;

    return (
        <div style={{
            position: 'fixed',
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            backgroundColor: 'rgba(0,0,0,0.5)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            zIndex: 1000,
            padding: '20px'
        }}>
            <div style={{
                background: 'white',
                borderRadius: 'var(--border-radius-lg)',
                padding: 'var(--spacing-xl)',
                maxWidth: '400px',
                width: '100%',
                boxShadow: 'var(--shadow-soft)'
            }}>
                <h3 style={{ margin: '0 0 16px 0', color: 'var(--color-navy)' }}>
                    {title}
                </h3>
                <p style={{ margin: '0 0 24px 0', color: 'var(--color-navy)' }}>
                    {message}
                </p>
                <div style={{ display: 'flex', gap: '12px', justifyContent: 'flex-end' }}>
                    <Button
                        variant="secondary"
                        onClick={onClose}
                        disabled={loading}
                    >
                        {cancelText}
                    </Button>
                    <Button
                        variant="danger"
                        onClick={onConfirm}
                        loading={loading}
                    >
                        {confirmText}
                    </Button>
                </div>
            </div>
        </div>
    );
};

export default ConfirmDialog;