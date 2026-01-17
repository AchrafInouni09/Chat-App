import React, { useState, useRef } from 'react';

const CryptoHover = ({ text, className = "", activeClassName = "text-grunge-accent animate-glitch" }) => {
    const [displayText, setDisplayText] = useState(text);
    const [isHovered, setIsHovered] = useState(false);
    const intervalRef = useRef(null);
    const chars = "ABCDEFGHIJKLMNOPQRSTUVWXYZ1234567890!@#$%^&*()_+-=[]{}|;:,.<>?";

    const startScramble = () => {
        setIsHovered(true);
        clearInterval(intervalRef.current);
        intervalRef.current = setInterval(() => {
            setDisplayText(prev =>
                text.split('').map(() => chars[Math.floor(Math.random() * chars.length)]).join('')
            );
        }, 50);
    };

    const stopScramble = () => {
        setIsHovered(false);
        clearInterval(intervalRef.current);
        setDisplayText(text);
    };

    return (
        <span
            onMouseEnter={startScramble}
            onMouseLeave={stopScramble}
            className={`inline-block transition-colors cursor-pointer ${className} ${isHovered ? activeClassName : ''}`}
        >
            {displayText}
        </span>
    );
};

export default CryptoHover;
