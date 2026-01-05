import React from 'react';
import Avatar from './Avatar';

interface ChatMessageProps {
    sender: string;
    time: string;
    message: string;
    avatarFallback: string;
    isOwn?: boolean;
    bubbleClassName?: string;
}

const ChatMessage: React.FC<ChatMessageProps> = ({
    sender,
    time,
    message,
    avatarFallback,
    isOwn = false,
    bubbleClassName = "",
}) => {
    return (
        <div className={`flex gap-3 ${isOwn ? 'flex-row-reverse' : ''}`}>
            <Avatar
                src={undefined}
                alt={sender}
                fallback={avatarFallback}
                size="sm"
                className={isOwn ? "bg-grunge-accent text-grunge-white" : "bg-grunge-dark text-grunge-white"}
            />
            <div className={`flex flex-col max-w-[70%] ${isOwn ? 'items-end' : 'items-start'}`}>
                <div className={`flex items-baseline gap-2 mb-1 ${isOwn ? 'flex-row-reverse' : ''}`}>
                    <span className="font-bold text-xs uppercase">{sender}</span>
                    <span className="text-[10px] text-grunge-gray">{time}</span>
                </div>
                <div
                    className={`
                        relative p-3 border-2 border-grunge-dark text-sm 
                        ${isOwn
                            ? 'bg-grunge-dark text-grunge-white shadow-[4px_4px_0_rgba(255,42,42,0.6)]'
                            : 'bg-grunge-white text-grunge-dark shadow-[4px_4px_0_rgba(15,15,16,0.3)]'
                        }
                        ${bubbleClassName}
                    `}
                >
                    {message}
                </div>
            </div>
        </div>
    );
};

export default ChatMessage;
