// src/components/Card.jsx
import React, { type ReactNode } from 'react';

interface CardProps extends React.HTMLAttributes<HTMLDivElement> {
    children?: ReactNode;
    className?: string;
    hoverEffect?: boolean;
}

const Card = ({ children, className = '', hoverEffect = false, ...props }: CardProps) => {
    return (
        <div
            className={`
        bg-grunge-white border-2 border-grunge-dark p-6 shadow-[8px_8px_0_#0f0f10] relative z-10 
        ${hoverEffect ? 'transition-transform hover:-translate-y-1 hover:shadow-[12px_12px_0_#ff2a2a]' : ''}
        ${className}
      `}
            {...props}
        >
            {children}
        </div>
    );
};

export default Card;
