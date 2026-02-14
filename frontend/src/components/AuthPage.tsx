// AuthPage.jsx
import React, { useEffect, useRef } from 'react';
import { Link } from 'react-router-dom';
import { gsap } from 'gsap';
import AuthForm from './AuthForm.tsx';

const AuthPage = () => {
    const containerRef = useRef(null);

    useEffect(() => {
        const ctx = gsap.context(() => {
            gsap.fromTo('.auth-wrapper',
                { opacity: 0, y: 50, scale: 0.9 },
                { opacity: 1, y: 0, scale: 1, duration: 1, ease: "power3.out" }
            );

            gsap.fromTo('.back-link',
                { opacity: 0, x: -20 },
                { opacity: 1, x: 0, duration: 0.8, delay: 0.5 }
            );
        }, containerRef);

        return () => ctx.revert();
    }, []);

    return (
        <div className="min-h-screen p-8 flex flex-col justify-center items-center relative overflow-hidden" ref={containerRef}>
            <Link to="/" className="back-link absolute top-8 left-8 text-xl font-mono font-bold text-grunge-accent uppercase no-underline hover:text-grunge-dark transition-colors">
                &larr; Abort_Sequence
            </Link>

            <div className="auth-wrapper w-full max-w-[500px] relative z-10">
                <h1 className="uppercase font-bold font-display text-5xl text-center mb-8 text-grunge-dark">
                    Identity <span className="text-grunge-accent stroke-text">Check</span>
                </h1>
                <AuthForm />
                
                <div className="mt-6 text-center text-sm text-muted-foreground">
                    <Link to="/privacy-policy" className="hover:text-grunge-accent transition-colors">Privacy Policy</Link>
                    <span className="mx-2">|</span>
                    <Link to="/terms-of-service" className="hover:text-grunge-accent transition-colors">Terms of Service</Link>
                </div>
            </div>

            {/* Background Decoration */}
            <div className="absolute inset-0 pointer-events-none opacity-20 z-0">
                <div className="absolute top-1/4 left-1/4 w-64 h-64 bg-grunge-accent rounded-full blur-[100px]"></div>
                <div className="absolute bottom-1/4 right-1/4 w-64 h-64 bg-grunge-dark rounded-full blur-[100px]"></div>
            </div>
        </div>
    );
};

export default AuthPage;
