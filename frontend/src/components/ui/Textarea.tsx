// src/components/Textarea.jsx
import React from 'react';

const Textarea = ({ label, placeholder, error, className = "", ...props }) => {
    return (
        <div className={`flex flex-col gap-1 ${className}`}>
            {label && (
                <label className="uppercase font-bold text-grunge-gray text-xs block mb-1">
                    {label}
                </label>
            )}
            <textarea
                className={`w-full bg-transparent border-2 border-grunge-dark p-3 font-mono text-base text-grunge-dark outline-none 
          focus:bg-grunge-dark focus:text-grunge-white focus:border-grunge-accent 
          placeholder:text-grunge-gray/50 transition-colors min-h-[120px] resize-y
          ${error ? 'border-grunge-accent' : ''}
        `}
                placeholder={placeholder}
                {...props}
            />
            {error && <span className="text-grunge-accent text-xs font-mono">{error}</span>}
        </div>
    );
};

export default Textarea;
