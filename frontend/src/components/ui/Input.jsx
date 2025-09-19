import React from 'react';

const Input = ({
                   label,
                   error,
                   className = '',
                   required = false,
                   type = 'text',
                   ...props
               }) => {
    const inputClasses = `form-input ${error ? 'form-input-error' : ''} ${className}`.trim();

    return (
        <div className="form-group">
            {label && (
                <label className="form-label">
                    {label}
                    {required && <span style={{ color: 'var(--color-coral)' }}> *</span>}
                </label>
            )}
            <input
                type={type}
                className={inputClasses}
                {...props}
            />
            {error && <div className="form-error">{error}</div>}
        </div>
    );
};

export default Input;