// src/components/Switch.jsx
import React from 'react';

const Switch = ({ checked, onChange, label, disabled, className = "" }) => {
    return (
        <label className={`flex items-center gap-3 cursor-pointer ${disabled ? 'opacity-50 pointer-events-none' : ''} ${className}`}>
            <div className="relative">
                <input
                    type="checkbox"
                    className="sr-only peer"
                    checked={checked}
                    onChange={onChange}
                    disabled={disabled}
                />
                <div className="w-12 h-6 border-2 border-grunge-dark bg-grunge-white peer-checked:bg-grunge-dark transition-colors relative">
                    <div className={`absolute top-0.5 left-0.5 w-4 h-4 bg-grunge-dark peer-checked:bg-grunge-white peer-checked:translate-x-6 transition-transform border border-transparent peer-checked:border-grunge-dark`}></div>
                </div>
            </div>
            {label && <span className="font-mono text-sm font-bold uppercase">{label}</span>}
        </label>
    );
};

export default Switch;
