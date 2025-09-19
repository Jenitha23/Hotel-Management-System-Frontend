import React from 'react';

const Button = ({
                    children,
                    variant = 'primary',
                    size = 'md',
                    disabled = false,
                    loading = false,
                    onClick,
                    type = 'button',
                    className = '',
                    ...props
                }) => {
    const baseClass = 'btn';
    const variantClass = `btn-${variant}`;
    const sizeClass = size === 'sm' ? 'btn-sm' : size === 'lg' ? 'btn-lg' : '';

    const classes = [baseClass, variantClass, sizeClass, className].filter(Boolean).join(' ');

    return (
        <button
            type={type}
            className={classes}
            disabled={disabled || loading}
            onClick={onClick}
            {...props}
        >
            {loading && <span className="loading-spinner" style={{ marginRight: '8px' }}></span>}
            {children}
        </button>
    );
};

export default Button;