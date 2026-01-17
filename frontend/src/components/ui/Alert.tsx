// src/components/Alert.jsx
import React from 'react';

const Alert = ({ title, children, variant = "default", className = "" }) => {
    const variants = {
        default: "border-grunge-dark bg-grunge-white text-grunge-dark",
        destructive: "border-grunge-accent bg-grunge-accent/10 text-grunge-accent",
        success: "border-grunge-green bg-grunge-green/10 text-grunge-dark"
    };

    return (
        <div className={`border-2 p-4 font-mono relative shadow-[4px_4px_0_rgba(0,0,0,1)] ${variants[variant]} ${className}`}>
            {title && <h5 className="font-bold uppercase mb-1 flex items-center gap-2">
                <span className="text-xl leading-none">!</span> {title}
            </h5>}
            <div className="text-sm opacity-90">{children}</div>
        </div>
    );
};

export default Alert;
