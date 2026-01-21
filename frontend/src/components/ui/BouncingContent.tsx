import React, { useRef, useEffect } from "react";

interface BouncingContentProps {
  children: React.ReactNode;
}

const BouncingContent: React.FC<BouncingContentProps> = ({ children }) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const itemRef = useRef<HTMLSpanElement>(null);

  useEffect(() => {
    const container = containerRef.current;
    const item = itemRef.current;
    if (!container || !item) return;

    const maxX = container.clientWidth - item.offsetWidth;
    const maxY = container.clientHeight - item.offsetHeight;

    let x = Math.random() * maxX;
    let y = Math.random() * maxY;
    let dx = (Math.random() > 0.5 ? 1 : -1) * 0.5;
    let dy = (Math.random() > 0.5 ? 1 : -1) * 0.5;

    let animationFrameId: number;

    const animate = () => {
      if (!container || !item) return;

      x += dx;
      y += dy;

      if (x <= 0 || x >= container.clientWidth - item.offsetWidth) dx = -dx;
      if (y <= 0 || y >= container.clientHeight - item.offsetHeight) dy = -dy;

      item.style.transform = `translate(${x}px, ${y}px)`;
      animationFrameId = requestAnimationFrame(animate);
    };

    animate();

    return () => cancelAnimationFrame(animationFrameId);
  }, [children]);

  return (
    <div ref={containerRef} className="absolute inset-0 w-full h-full">
      <span ref={itemRef} className="absolute top-0 left-0 font-mono font-bold text-grunge-dark whitespace-nowrap">
        {children}
      </span>
    </div>
  );
};

export default BouncingContent;
