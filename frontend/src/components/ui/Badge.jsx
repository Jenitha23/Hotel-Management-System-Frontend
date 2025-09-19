import React from 'react';

const Badge = ({ children, variant = 'success', className = '' }) => {
    const classes = `badge badge-${variant} ${className}`.trim();

    return (
        <span className={classes}>
      {children}
    </span>
    );
};

export default Badge;