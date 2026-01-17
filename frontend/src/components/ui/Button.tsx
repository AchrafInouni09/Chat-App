// src/components/Button.jsx
import React, { type ReactNode, type MouseEventHandler } from 'react';
import { Link } from 'react-router-dom';

interface ButtonProps {
    children: ReactNode;
    variant?: 'primary' | 'outline' | 'ghost';
    className?: string;
    to?: string;
    onClick?: MouseEventHandler<HTMLButtonElement>;
    [key: string]: unknown;
}

const Button = ({ children, variant = 'primary', className = '', to, onClick, ...props }: ButtonProps) => {
    const baseStyles = "inline-block font-mono font-bold uppercase transition-all active:translate-x-[2px] active:translate-y-[2px] cursor-pointer border-2 border-grunge-dark";

    const variants = {
        primary: "bg-grunge-accent text-grunge-white hover:shadow-[4px_4px_0_#0f0f10]",
        outline: "bg-transparent text-grunge-dark hover:bg-grunge-dark hover:text-grunge-accent",
        ghost: "border-none text-grunge-dark hover:text-grunge-accent hover:underline decoration-2 underline-offset-4"
    };

    const combinedClasses = `${baseStyles} ${variants[variant]} ${className}`;

    if (to) {
        return (
            <Link to={to} className={combinedClasses} {...props}>
                {children}
            </Link>
        );
    }

    return (
        <button className={combinedClasses} onClick={onClick} {...props}>
            {children}
        </button>
    );
};

export default Button;
