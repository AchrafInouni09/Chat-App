// src/components/Badge.jsx
import React from 'react';

const Badge = ({ children, variant = "default", className = '', animate = false }) => {
    const styles = "inline-block text-xs font-mono px-3 py-1 border border-grunge-dark uppercase font-bold";
    const variants = {
        default: "bg-grunge-dark text-grunge-green",
        accent: "bg-grunge-accent text-grunge-white",
        outline: "bg-transparent text-grunge-dark"
    };

    return (
        <span className={`${styles} ${variants[variant]} ${animate ? 'animate-pulse' : ''} ${className}`}>
            {children}
        </span>
    );
};

export default Badge;
