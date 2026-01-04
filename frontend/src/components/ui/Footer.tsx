// src/components/Footer.jsx
import React, { useState, useEffect } from 'react';
import Button from './Button';

const Footer = () => {
    const [streamData, setStreamData] = useState([]);

    useEffect(() => {
        const interval = setInterval(() => {
            const hex = Math.random().toString(16).substr(2, 8).toUpperCase();
            const time = new Date().toLocaleTimeString('en-US', { hour12: false });
            setStreamData(prev => [`[${time}] :: PKT_${hex} // SYNC_OK`, ...prev.slice(0, 5)]);
        }, 800);
        return () => clearInterval(interval);
    }, []);

    return (
        <footer className="bg-grunge-dark text-grunge-white p-12 border-t-4 border-grunge-accent relative overflow-hidden">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-12 relative z-10">
                <div>
                    <h2 className="font-display text-4xl uppercase mb-4">Join_The_Resistance</h2>
                    <p className="mb-8 opacity-70 max-w-md">The era of surveillance capitalism is over. It's time to take back our privacy.</p>
                    <div className="flex gap-4">
                        <Button to="/login" variant="primary" className="bg-grunge-white text-grunge-dark border-grunge-white hover:bg-grunge-accent hover:text-grunge-white hover:border-grunge-accent">
                            START_ENCODING
                        </Button>
                    </div>
                </div>
                <div className="font-mono text-sm opacity-50 space-y-2 text-right hidden md:block">
                    {streamData.map((line, i) => (
                        <div key={i}>{line}</div>
                    ))}
                </div>
            </div>
            {/* Background Noise override for footer if desired, but parent has it too. Keeping simple. */}
        </footer>
    );
};

export default Footer;
