import React, { useEffect, useRef } from 'react';

const BouncingContent = ({ children }) => {
    const containerRef = useRef(null);
    const itemRef = useRef(null);

    useEffect(() => {
        const container = containerRef.current;
        const item = itemRef.current;
        if (!container || !item) return;

        // Initial random position
        const maxX = container.clientWidth - item.offsetWidth;
        const maxY = container.clientHeight - item.offsetHeight;

        let x = Math.random() * maxX;
        let y = Math.random() * maxY;

        // Clamp initial position
        x = Math.max(0, Math.min(x, maxX));
        y = Math.max(0, Math.min(y, maxY));

        // Initial random direction
        let dx = (Math.random() > 0.5 ? 1 : -1) * 0.5;
        let dy = (Math.random() > 0.5 ? 1 : -1) * 0.5;

        let animationFrameId;

        const animate = () => {
            if (!container || !item) return;

            const currentMaxX = container.clientWidth - item.offsetWidth;
            const currentMaxY = container.clientHeight - item.offsetHeight;

            x += dx;
            y += dy;

            // Bounce X
            if (x <= 0) {
                x = 0;
                dx = -dx;
            } else if (x >= currentMaxX) {
                x = currentMaxX;
                dx = -dx;
            }

            // Bounce Y
            if (y <= 0) {
                y = 0;
                dy = -dy;
            } else if (y >= currentMaxY) {
                y = currentMaxY;
                dy = -dy;
            }

            item.style.transform = `translate(${x}px, ${y}px)`;
            animationFrameId = requestAnimationFrame(animate);
        };

        animate();

        return () => cancelAnimationFrame(animationFrameId);
    }, [children]);

    return (
        <div ref={containerRef} className="absolute inset-0 w-full h-full">
            <span ref={itemRef} className="absolute top-0 left-0 font-mono font-bold text-grunge-dark whitespace-nowrap will-change-transform">
                {children}
            </span>
        </div>
    );
};

const Avatar = ({ src, alt, fallback, size = "md", className = "" }) => {
    const sizes = {
        sm: "w-8 h-8 text-xs",
        md: "w-12 h-12 text-sm",
        lg: "w-16 h-16 text-base"
    };

    const [imageError, setImageError] = React.useState(false);

    return (
        <div className={`relative inline-block ${sizes[size]} ${className}`}>
            <div className="absolute inset-0 bg-grunge-dark translate-x-[2px] translate-y-[2px]"></div>
            <div className="relative w-full h-full border-2 border-grunge-dark bg-grunge-white overflow-hidden flex items-center justify-center">
                {src && !imageError ? (
                    <img 
                        src={src} 
                        alt={alt || "avatar"} 
                        className="w-full h-full object-cover"
                        onError={() => setImageError(true)}
                    />
                ) : (
                    <BouncingContent>{fallback || "?"}</BouncingContent>
                )}
            </div>
        </div>
    );
};

export default Avatar;
