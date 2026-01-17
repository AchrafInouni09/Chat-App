import React, { useEffect, useRef } from 'react';
import { gsap } from 'gsap';
import Button from './Button';
import Badge from './Badge';
import ChatMockup from './ChatMockup';
import CryptoHover from './CryptoHover';

const HeroSection = () => {
    const containerRef = useRef(null);
    const heroTextRef = useRef(null);
    const imgRef = useRef(null);

    useEffect(() => {
        let ctx = gsap.context(() => {
            // Hero Text Animation
            gsap.fromTo('.hero-anim',
                { y: 100, opacity: 0, rotateX: -45 },
                { y: 0, opacity: 1, rotateX: 0, stagger: 0.1, duration: 1.2, ease: "power4.out" }
            );

            // Parallax Effect
            const handleMouseMove = (e) => {
                const { clientX, clientY } = e;
                const xPos = (clientX / window.innerWidth - 0.5) * 20;
                const yPos = (clientY / window.innerHeight - 0.5) * 20;
                if (imgRef.current) {
                    gsap.to(imgRef.current, { x: xPos, y: yPos, rotationY: xPos, rotationX: -yPos, duration: 1, ease: "power2.out" });
                }
            };
            window.addEventListener('mousemove', handleMouseMove);
            return () => window.removeEventListener('mousemove', handleMouseMove);

        }, containerRef);
        return () => ctx.revert();
    }, []);

    return (
        <header ref={containerRef} className="grid grid-cols-1 lg:grid-cols-12 gap-12 p-8 pt-16 min-h-[90vh] items-center relative">
            <div className="lg:col-span-7 z-10">
                <div className="mb-4">
                    <Badge variant="accent" animate>v.2.0 IS LIVE</Badge>
                </div>
                <h1 className="font-display text-[clamp(4rem,10vw,9rem)] leading-[0.8] uppercase text-grunge-dark mb-8 mix-blend-darken" ref={heroTextRef}>
                    <div className="overflow-hidden">
                        <span className="hero-anim inline-block">
                            <CryptoHover text="the last" />
                        </span>
                    </div>
                    <div className="overflow-hidden">
                        <span className="hero-anim inline-block text-grunge-accent italic">
                            <CryptoHover text="project" className="text-grunge-accent" activeClassName="text-grunge-dark animate-glitch" />
                        </span>
                    </div>
                </h1>
                <p className="text-xl md:text-2xl font-bold mb-8 max-w-xl hero-anim">
                    Zero logs. Zero masters.
                    Reclaim your digital sovereignty with the only chat protocol that respects your silence.
                </p>
                <div className="flex gap-4 hero-anim">
                    <Button to="/chat" variant="primary" className="px-8 py-4 text-lg">INITIATE_PROTOCOL</Button>
                    <Button to="/components" variant="outline" className="px-8 py-4 text-lg">VIEW_MANIFESTO</Button>
                </div>
            </div>

            <div className="lg:col-span-5 relative perspective-1000 group lg:h-[600px] flex items-center justify-center p-8" ref={imgRef}>
                <div className="relative z-10 transform transition-transform duration-500 hover:scale-105">
                    <ChatMockup />
                    <div className="absolute -top-10 -right-10 animate-bounce delay-700 pointer-events-none">
                        <Badge variant="default" className="text-lg py-2 px-4 shadow-[4px_4px_0_#0f0f10]">E2E_ENCRYPTED</Badge>
                    </div>
                    <div className="absolute -bottom-5 -left-10 animate-pulse delay-1000 pointer-events-none">
                        <Badge variant="accent" className="text-lg py-2 px-4 shadow-[4px_4px_0_#0f0f10]">NO_TRACKING</Badge>
                    </div>
                </div>
                <div className="absolute inset-0 bg-grunge-accent/20 blur-[100px] rounded-full -z-10 transform scale-75 animate-pulse"></div>
            </div>
        </header>
    );
};

export default HeroSection;
