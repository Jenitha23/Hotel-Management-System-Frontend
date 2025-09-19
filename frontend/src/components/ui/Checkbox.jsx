import React from 'react';

const Checkbox = ({
                      label,
                      checked,
                      onChange,
                      className = '',
                      ...props
                  }) => {
    return (
        <div className={`form-group ${className}`.trim()}>
            <label style={{ display: 'flex', alignItems: 'center', cursor: 'pointer' }}>
                <input
                    type="checkbox"
                    checked={checked}
                    onChange={onChange}
                    style={{ marginRight: '8px' }}
                    {...props}
                />
                {label}
            </label>
        </div>
    );
};

export default Checkbox;