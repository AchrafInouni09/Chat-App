// src/components/Skeleton.jsx
import React from 'react';

const Skeleton = ({ className = "w-full h-4" }) => {
    return (
        <div className={`bg-grunge-gray/20 animate-pulse border border-grunge-gray/10 ${className}`}></div>
    );
};

export default Skeleton;
