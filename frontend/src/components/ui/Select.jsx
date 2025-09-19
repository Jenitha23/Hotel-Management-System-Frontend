import React from 'react';

const Select = ({
                    label,
                    options = [],
                    error,
                    className = '',
                    required = false,
                    ...props
                }) => {
    const selectClasses = `form-input ${error ? 'form-input-error' : ''} ${className}`.trim();

    return (
        <div className="form-group">
            {label && (
                <label className="form-label">
                    {label}
                    {required && <span style={{ color: 'var(--color-coral)' }}> *</span>}
                </label>
            )}
            <select
                className={selectClasses}
                {...props}
            >
                {options.map((option) => (
                    <option key={option.value} value={option.value}>
                        {option.label}
                    </option>
                ))}
            </select>
            {error && <div className="form-error">{error}</div>}
        </div>
    );
};

export default Select;