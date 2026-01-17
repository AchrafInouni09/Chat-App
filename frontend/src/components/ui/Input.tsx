// src/components/Input.jsx
import React from 'react';

const Input = ({ label, type = "text", placeholder, className = '', error, ...props }) => {
    return (
        <div className={`flex flex-col gap-1 ${className}`}>
            {label && (
                <label className="uppercase font-bold text-grunge-gray text-xs block mb-1">
                    {label}
                </label>
            )}
            <input
                type={type}
                className={`w-full bg-transparent border-2 border-grunge-dark p-3 font-mono text-base text-grunge-dark outline-none 
          focus:bg-grunge-dark focus:text-grunge-white focus:border-grunge-accent 
          placeholder:text-grunge-gray/50 transition-colors
          ${error ? 'border-grunge-accent' : ''}
        `}
                placeholder={placeholder}
                {...props}
            />
            {error && <span className="text-grunge-accent text-xs font-mono">{error}</span>}
        </div>
    );
};

export default Input;
