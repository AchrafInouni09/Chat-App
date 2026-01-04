// src/components/Separator.jsx
import React from 'react';

const Separator = ({ orientation = "horizontal", className = "" }) => {
    return (
        <div
            className={`bg-grunge-dark opacity-20 ${orientation === "horizontal" ? "h-[2px] w-full" : "h-full w-[2px]"
                } ${className}`}
        />
    );
};

export default Separator;
