import React from 'react';
import Card from './Card';
import Avatar from './Avatar';

interface AddFriendCardProps {
    username: string;
    avatarUrl: string;
    bio?: string;
    onAdd?: () => void;
    isPending?: boolean;
}

const AddFriendCard: React.FC<AddFriendCardProps> = ({ username, avatarUrl, bio, onAdd, isPending }) => {
    return (
        <Card className="flex flex-col items-center text-center gap-4 hover:scale-[1.02]" hoverEffect={true}>
            <div className="relative">
                <Avatar
                    src={avatarUrl}
                    alt={username}
                    fallback={username.substring(0, 2).toUpperCase()}
                    className="w-24 h-24"
                />
                <div className="absolute -bottom-1 -right-1 w-6 h-6 bg-grunge-green border-2 border-grunge-dark rounded-full" />
            </div>

            <div className="space-y-1">
                <h3 className="font-display text-xl">{username}</h3>
                {bio && <p className="font-mono text-sm text-grunge-gray">{bio}</p>}
            </div>

            <button
                onClick={isPending ? undefined : onAdd}
                disabled={isPending}
                className={`w-full mt-2 font-mono py-2 px-4 border-2 transition-colors ${
                    isPending 
                        ? 'bg-grunge-gray text-grunge-white border-grunge-gray cursor-not-allowed' 
                        : 'bg-grunge-dark text-grunge-white border-transparent hover:bg-grunge-accent hover:border-grunge-dark'
                }`}
            >
                {isPending ? 'REQUEST SENT ✓' : 'ADD FRIEND +'}
            </button>
        </Card>
    );
};

export default AddFriendCard;
