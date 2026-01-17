// src/components/Checkbox.jsx
import React from 'react';

const Checkbox = ({ label, checked, onChange, disabled, className = "" }) => {
    return (
        <label className={`flex items-start gap-3 cursor-pointer group ${disabled ? 'opacity-50 pointer-events-none' : ''} ${className}`}>
            <div className="relative">
                <input
                    type="checkbox"
                    className="peer sr-only"
                    checked={checked}
                    onChange={onChange}
                    disabled={disabled}
                />
                <div className="w-6 h-6 border-2 border-grunge-dark bg-transparent peer-checked:bg-grunge-dark transition-all relative z-10">
                    {/* Checkmark */}
                    <svg className="w-full h-full text-grunge-white opacity-0 peer-checked:opacity-100 transition-opacity p-0.5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="4">
                        <polyline points="20 6 9 17 4 12"></polyline>
                    </svg>
                </div>
                {/* Shadow offset */}
                <div className="absolute top-1 left-1 w-6 h-6 bg-grunge-gray -z-0"></div>
            </div>
            {label && <span className="font-mono text-sm pt-0.5 group-hover:text-grunge-accent transition-colors select-none">{label}</span>}
        </label>
    );
};

export default Checkbox;
