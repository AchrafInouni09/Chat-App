// src/components/ChatMockup.jsx
import React from 'react';
import Avatar from './Avatar';
import Badge from './Badge';

const ChatMockup = () => {
    return (
        <div className="w-full max-w-md bg-grunge-white border-4 border-grunge-dark shadow-[20px_20px_0_#0f0f10] relative overflow-hidden font-mono text-sm">
            {/* Window Header */}
            <div className="bg-grunge-dark text-grunge-white p-3 flex justify-between items-center border-b-2 border-grunge-dark">
                <div className="flex items-center gap-2">
                    <div className="w-3 h-3 bg-grunge-accent rounded-full animate-pulse"></div>
                    <span className="uppercase font-bold tracking-widest text-xs">Secure_Channel_v.2</span>
                </div>
                <div className="flex gap-1">
                    <span className="w-3 h-3 border border-grunge-white/50"></span>
                    <span className="w-3 h-3 border border-grunge-white/50 bg-grunge-white/20"></span>
                </div>
            </div>

            {/* Chat Area */}
            <div className="p-4 space-y-4 h-[320px] overflow-y-auto bg-grunge-white relative">
                {/* Date Separator */}
                <div className="text-center my-2">
                    <span className="bg-grunge-dark/10 px-2 py-1 text-[10px] text-grunge-dark font-bold uppercase">Today, 20:44</span>
                </div>

                {/* Message 1 (Incoming) */}
                <div className="flex gap-3">
                    <Avatar fallback="G" size="sm" className="bg-grunge-dark text-grunge-white" />
                    <div className="flex-1 space-y-1">
                        <div className="flex items-baseline justify-between">
                            <span className="font-bold text-grunge-dark text-xs">Ghost_01</span>
                            <span className="text-[10px] opacity-50">10:23</span>
                        </div>
                        <div className="bg-grunge-white border-2 border-grunge-dark p-3 shadow-[4px_4px_0_rgba(15,15,16,0.1)]">
                            <p className="text-grunge-gray">Did you receive the payload? The key is rotting.</p>
                        </div>
                    </div>
                </div>

                {/* Message 2 (Outgoing) */}
                <div className="flex gap-3 flex-row-reverse">
                    <Avatar fallback="ME" size="sm" className="bg-grunge-accent text-grunge-white" />
                    <div className="flex-1 space-y-1">
                        <div className="flex items-baseline justify-between flex-row-reverse">
                            <span className="font-bold text-grunge-dark text-xs">You</span>
                            <span className="text-[10px] opacity-50">10:24</span>
                        </div>
                        <div className="bg-grunge-dark text-grunge-white p-3 border-2 border-grunge-dark shadow-[4px_4px_0_rgba(255,42,42,0.2)]">
                            <p className="font-bold">Affirmative. Decryption in progress...</p>
                            <div className="mt-2 text-[10px] font-mono opacity-70 border-t border-grunge-white/30 pt-1">
                                &gt; RUNNING_ALGORITHM_AES256 <br />
                                &gt; ........................
                            </div>
                        </div>
                    </div>
                </div>

                {/* Message 3 (Incoming - Glitch) */}
                <div className="flex gap-3">
                    <Avatar fallback="G" size="sm" className="bg-grunge-dark text-grunge-white" />
                    <div className="flex-1 space-y-1">
                        <div className="flex items-baseline justify-between">
                            <span className="font-bold text-grunge-dark text-xs">Ghost_01</span>
                            <span className="text-[10px] opacity-50">10:25</span>
                        </div>
                        <div className="bg-grunge-white border-2 border-grunge-dark p-3 shadow-[4px_4px_0_rgba(15,15,16,0.1)] relative overflow-hidden">
                            <p className="text-grunge-accent font-bold animate-pulse">WARNING: SIGNAL_INTERCEPTED</p>
                            <div className="absolute inset-0 bg-grunge-accent/10 pointer-events-none"></div>
                        </div>
                    </div>
                </div>
            </div>

            {/* Input Area */}
            <div className="p-3 border-t-2 border-grunge-dark bg-grunge-white flex gap-2">
                <div className="flex-1 border-2 border-grunge-dark p-2 text-xs flex items-center text-grunge-gray">
                    <span className="animate-pulse mr-1 text-grunge-accent">|</span> Type encrypted message...
                </div>
                <button className="bg-grunge-dark text-grunge-white p-2 border-2 border-grunge-dark hover:bg-grunge-accent transition-colors">
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="square" strokeLinejoin="miter"><line x1="22" y1="2" x2="11" y2="13"></line><polygon points="22 2 15 22 11 13 2 9 22 2"></polygon></svg>
                </button>
            </div>

            {/* Scanline Overlay */}
            <div className="absolute inset-0 pointer-events-none bg-[linear-gradient(rgba(18,16,16,0)_50%,rgba(0,0,0,0.1)_50%),linear-gradient(90deg,rgba(255,0,0,0.06),rgba(0,255,0,0.02),rgba(0,0,255,0.06))] bg-[length:100%_4px,3px_100%]"></div>
        </div>
    );
};

export default ChatMockup;
