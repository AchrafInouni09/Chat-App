// src/components/Select.jsx
import React from 'react';

interface SelectOption {
    value: string | number;
    label: string;
}

interface SelectProps extends React.SelectHTMLAttributes<HTMLSelectElement> {
    label?: string;
    options?: SelectOption[];
    error?: string;
    className?: string; // Explicitly add specific props if needed, or let SelectHTMLAttributes handle standard ones
}

const Select: React.FC<SelectProps> = ({ label, options = [], error, className = "", ...props }) => {

    return (
        <div className={`flex flex-col gap-1 ${className}`}>
            {label && (
                <label className="uppercase font-bold text-grunge-gray text-xs block mb-1">
                    {label}
                </label>
            )}
            <div className="relative">
                <select
                    className={`w-full appearance-none bg-transparent border-2 border-grunge-dark p-3 pr-10 font-mono text-base text-grunge-dark outline-none 
            focus:bg-grunge-dark focus:text-grunge-white focus:border-grunge-accent 
            transition-colors
            ${error ? 'border-grunge-accent' : ''}
          `}
                    {...props}
                >
                    {options.map((opt, i) => (
                        <option key={i} value={opt.value}>{opt.label}</option>
                    ))}
                </select>
                {/* Custom arrow */}
                <div className="absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none text-grunge-dark text-xs">
                    ▼
                </div>
            </div>
            {error && <span className="text-grunge-accent text-xs font-mono">{error}</span>}
        </div>
    );
};

export default Select;
