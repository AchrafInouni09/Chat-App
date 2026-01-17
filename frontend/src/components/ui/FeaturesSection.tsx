import React, { useEffect, useRef } from 'react';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import Card from './Card';
import Badge from './Badge';

gsap.registerPlugin(ScrollTrigger);

const FeaturesSection = () => {
    const sectionRef = useRef(null);

    useEffect(() => {
        let ctx = gsap.context(() => {
            gsap.fromTo('.feature-card',
                { y: 50, opacity: 0 },
                {
                    y: 0,
                    opacity: 1,
                    stagger: 0.2,
                    duration: 0.8,
                    scrollTrigger: {
                        trigger: sectionRef.current,
                        start: 'top 80%'
                    }
                }
            );
        }, sectionRef);
        return () => ctx.revert();
    }, []);

    return (
        <section ref={sectionRef} className="p-8 max-w-7xl mx-auto mb-24 features-grid">
            <div className="flex justify-between items-end mb-16 border-b-2 border-grunge-dark pb-4">
                <h2 className="font-display text-5xl uppercase">Core_Modules</h2>
                <span className="font-mono hidden md:inline-block">SYSTEM_STATUS: OPTIMAL</span>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                <Card className="feature-card min-h-[300px] flex flex-col justify-between hoverEffect">
                    <div>
                        <div className="text-4xl mb-4 text-grunge-accent">01.</div>
                        <h3 className="font-bold text-2xl uppercase mb-2">Total Anarchy</h3>
                        <p className="opacity-70">No central servers. The network lives on the devices of its users. Impossible to shut down.</p>
                    </div>
                    <Badge variant="outline" className="self-start mt-4">P2P_ONLY</Badge>
                </Card>
                <Card className="feature-card min-h-[300px] flex flex-col justify-between hoverEffect">
                    <div>
                        <div className="text-4xl mb-4 text-grunge-accent">02.</div>
                        <h3 className="font-bold text-2xl uppercase mb-2">Ghost Mode</h3>
                        <p className="opacity-70">Messages self-destruct after viewing. Metadata is stripped at the source.</p>
                    </div>
                    <Badge variant="outline" className="self-start mt-4">EPHEMERAL</Badge>
                </Card>
                <Card className="feature-card min-h-[300px] flex flex-col justify-between hoverEffect">
                    <div>
                        <div className="text-4xl mb-4 text-grunge-accent">03.</div>
                        <h3 className="font-bold text-2xl uppercase mb-2">Dark Web Ready</h3>
                        <p className="opacity-70">Native .onion routing support. Access Void_Talk from anywhere, even behind firewalls.</p>
                    </div>
                    <Badge variant="outline" className="self-start mt-4">TOR_ENABLED</Badge>
                </Card>
            </div>
        </section>
    );
};

export default FeaturesSection;
