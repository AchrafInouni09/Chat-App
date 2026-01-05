import React from 'react';
import Avatar from './Avatar';

interface SideFriendReqProps {
    name: string;
    message: string;
    avatarFallback: string;
    statusColor?: string;
    isActive?: boolean;
}

const SideFriendReq: React.FC<SideFriendReqProps> = ({
    name,
    message,
    avatarFallback,
    statusColor = "bg-grunge-green",
    isActive = false,
}) => {
    const containerClasses = isActive
        ? "bg-grunge-dark text-grunge-white border-grunge-dark translate-x-[2px] translate-y-[2px] shadow-none"
        : "bg-transparent border-grunge-dark text-grunge-dark hover:bg-grunge-dark/5 hover:translate-x-[-2px] hover:translate-y-[-2px] hover:shadow-[4px_4px_0_#0f0f10]";

    const avatarClasses = isActive
        ? "bg-grunge-white text-grunge-dark"
        : "bg-grunge-dark text-grunge-white";

    const messageClasses = isActive
        ? "text-grunge-white/60"
        : "text-grunge-gray";

    return (
        <div className={`p-3 border-2 cursor-pointer transition-all flex items-center gap-3 ${containerClasses}`}>
            <div className="relative">
                <Avatar
                    src={undefined}
                    alt={name}
                    fallback={avatarFallback}
                    size="sm"
                    className={avatarClasses}
                />
                <div className={`absolute -bottom-1 -right-1 w-3 h-3 border-2 border-grunge-white rounded-full ${statusColor}`}></div>
            </div>
            <div className="flex-1 min-w-0">
                <div className="font-bold text-sm truncate">{name}</div>
                <div className={`text-xs truncate ${messageClasses}`}>
                    {message}
                </div>
            </div>
        </div>
    );
};

export default SideFriendReq;
