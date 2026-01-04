// src/components/Avatar.jsx
import React from 'react';

const Avatar = ({ src, alt, fallback, size = "md", className = "" }) => {
    const sizes = {
        sm: "w-8 h-8 text-xs",
        md: "w-12 h-12 text-sm",
        lg: "w-16 h-16 text-base"
    };

    return (
        <div className={`relative inline-block ${sizes[size]} ${className}`}>
            <div className="absolute inset-0 bg-grunge-dark translate-x-[2px] translate-y-[2px]"></div>
            <div className="relative w-full h-full border-2 border-grunge-dark bg-grunge-white overflow-hidden flex items-center justify-center">
                {src ? (
                    <img src={src} alt={alt} className="w-full h-full object-cover" />
                ) : (
                    <span className="font-mono font-bold text-grunge-dark">{fallback || "?"}</span>
                )}
            </div>
        </div>
    );
};

export default Avatar;
