import React from 'react';

const Card = ({ children, className = '', hover = true, onClick, ...props }) => {
    const classes = `card ${hover ? 'card-hover' : ''} ${className}`.trim();

    const Component = onClick ? 'button' : 'div';

    return (
        <Component
            className={classes}
            onClick={onClick}
            {...props}
        >
            {children}
        </Component>
    );
};

export default Card;