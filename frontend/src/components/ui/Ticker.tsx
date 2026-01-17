import React from 'react';
import CryptoHover from './CryptoHover';

const Ticker = () => {
    return (
        <div className="bg-grunge-dark text-grunge-white py-4 overflow-hidden whitespace-nowrap border-y-2 border-grunge-dark mb-16">
            <div className="animate-ticker inline-flex min-w-full">
                <span className="mr-8 font-bold text-xl uppercase tracking-widest flex-shrink-0">
                    <CryptoHover text="/// THE LAST PROJECT /// THE LAST PROJECT /// THE LAST PROJECT /// THE LAST PROJECT" />
                </span>
                <span className="mr-8 font-bold text-xl uppercase tracking-widest flex-shrink-0">
                    <CryptoHover text="/// THE LAST PROJECT /// THE LAST PROJECT /// THE LAST PROJECT /// THE LAST PROJECT" />
                </span>
                <span className="mr-8 font-bold text-xl uppercase tracking-widest flex-shrink-0">
                    <CryptoHover text="/// THE LAST PROJECT /// THE LAST PROJECT /// THE LAST PROJECT /// THE LAST PROJECT" />
                </span>
                <span className="mr-8 font-bold text-xl uppercase tracking-widest flex-shrink-0">
                    <CryptoHover text="/// THE LAST PROJECT /// THE LAST PROJECT /// THE LAST PROJECT /// THE LAST PROJECT" />
                </span>
            </div>
        </div>
    );
};

export default Ticker;
