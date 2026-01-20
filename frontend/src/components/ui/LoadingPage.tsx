import React from 'react';

const LoadingPage: React.FC = () => {
    return (
        <div className="fixed inset-0 z-[9999] flex flex-col items-center justify-center bg-grunge-white overflow-hidden font-display">
            <div className="absolute inset-0 z-10 pointer-events-none">
                <div className="absolute inset-0 bg-[linear-gradient(rgba(15,15,16,0)_50%,rgba(15,15,16,0.1)_50%),linear-gradient(90deg,rgba(255,0,0,0.03),rgba(0,255,0,0.01),rgba(0,0,255,0.03))] bg-[length:100%_4px,3px_100%] animate-scanline opacity-20"></div>
                <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,transparent_0%,rgba(15,15,16,0.1)_100%)]"></div>
            </div>
            <div className="relative z-20 flex flex-col items-center">
                <div className="relative mb-12">
                    <h1 className="absolute top-0 left-0 text-8xl text-grunge-accent opacity-40 blur-[2px] transform skew-x-12 translate-y-4 animate-pulse">
                        LOADING
                    </h1>
                    <h1 className="absolute top-0 left-0 text-8xl text-grunge-gray opacity-30 blur-[4px] transform -skew-x-12 translate-y-8 animate-pulse" style={{ animationDelay: '75ms' }}>
                        LOADING
                    </h1>
                    <h1 className="relative text-8xl text-grunge-dark drop-shadow-[0_0_10px_rgba(15,15,16,0.3)] animate-glitch tracking-widest">
                        LOADING
                    </h1>
                </div>
                <div className="w-96 space-y-2 mt-8">
                    <div className="h-1 w-full bg-grunge-dark/20 rounded-full overflow-hidden shadow-[0_0_10px_rgba(15,15,16,0.2)]">
                        <div className="h-full bg-grunge-dark w-full animate-loading-slide shadow-[0_0_15px_rgba(15,15,16,0.4)]"></div>
                    </div>
                    <div className="h-1 w-3/4 bg-grunge-accent/20 rounded-full overflow-hidden shadow-[0_0_10px_rgba(255,42,42,0.2)] ml-auto mr-auto">
                        <div className="h-full bg-grunge-accent w-full animate-loading-slide shadow-[0_0_15px_rgba(255,42,42,0.4)]" style={{ animationDelay: '0.2s' }}></div>
                    </div>
                    <div className="h-1 w-1/2 bg-grunge-gray/20 rounded-full overflow-hidden shadow-[0_0_10px_rgba(85,85,85,0.2)] ml-auto mr-auto">
                        <div className="h-full bg-grunge-gray w-full animate-loading-slide shadow-[0_0_15px_rgba(85,85,85,0.4)]" style={{ animationDelay: '0.4s' }}></div>
                    </div>
                </div>
                <p className="mt-8 font-mono text-grunge-gray text-sm tracking-[0.5em] animate-pulse">
                    SYSTEM_INITIALIZATION
                </p>
            </div>
        </div>
    );
};

export default LoadingPage;
