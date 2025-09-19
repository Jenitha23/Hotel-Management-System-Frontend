import React, { useEffect, useState } from 'react';

let toastId = 0;
let showToastFunction = null;

export const showToast = (message, type = 'success') => {
    if (showToastFunction) {
        showToastFunction(message, type);
    }
};

const Toast = () => {
    const [toasts, setToasts] = useState([]);

    useEffect(() => {
        showToastFunction = (message, type) => {
            const id = ++toastId;
            const toast = { id, message, type };

            setToasts(prev => [...prev, toast]);

            setTimeout(() => {
                setToasts(prev => prev.filter(t => t.id !== id));
            }, 5000);
        };

        return () => {
            showToastFunction = null;
        };
    }, []);

    if (toasts.length === 0) return null;

    return (
        <>
            {toasts.map((toast) => (
                <div key={toast.id} className={`toast toast-${toast.type}`}>
                    <div style={{ fontWeight: '600', marginBottom: '4px' }}>
                        {toast.type === 'success' ? 'Success' : 'Error'}
                    </div>
                    <div>{toast.message}</div>
                    <button
                        onClick={() => setToasts(prev => prev.filter(t => t.id !== toast.id))}
                        style={{
                            position: 'absolute',
                            top: '8px',
                            right: '8px',
                            background: 'none',
                            border: 'none',
                            fontSize: '18px',
                            cursor: 'pointer',
                            color: 'var(--color-navy)'
                        }}
                    >
                        ×
                    </button>
                </div>
            ))}
        </>
    );
};

export default Toast;