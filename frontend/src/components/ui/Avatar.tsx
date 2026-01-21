import React, { useState } from "react";
import BouncingContent from "./BouncingContent";

interface AvatarProps {
  src?: string | null;
  alt?: string;
  fallback?: string;
  size?: "sm" | "md" | "lg";
  className?: string;
}

const Avatar: React.FC<AvatarProps> = ({ src, alt, fallback, size = "md", className = "" }) => {
  const sizes = {
    sm: "w-8 h-8 text-xs",
    md: "w-12 h-12 text-sm",
    lg: "w-16 h-16 text-base",
  };

  const [imageError, setImageError] = useState(false);

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
          <BouncingContent>
            <span className="flex items-center justify-center w-full h-full text-xl font-bold text-grunge-dark">
              {fallback || "?"}
            </span>
          </BouncingContent>
        )}
      </div>
    </div>
  );
};

export default Avatar;
