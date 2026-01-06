import React from 'react';
import Card from './Card';

interface AddFriendCardProps {
    username: string;
    avatarUrl: string;
    bio?: string;
    onAdd?: () => void;
}

const AddFriendCard: React.FC<AddFriendCardProps> = ({ username, avatarUrl, bio, onAdd }) => {
    return (
        <Card className="flex flex-col items-center text-center gap-4 hover:scale-[1.02]" hoverEffect={true}>
            <div className="relative">
                <div className="w-24 h-24 rounded-full overflow-hidden border-2 border-grunge-dark bg-grunge-gray/20">
                    <img src={avatarUrl} alt={username} className="w-full h-full object-cover" />
                </div>
                <div className="absolute -bottom-1 -right-1 w-6 h-6 bg-grunge-green border-2 border-grunge-dark rounded-full" />
            </div>

            <div className="space-y-1">
                <h3 className="font-display text-xl">{username}</h3>
                {bio && <p className="font-mono text-sm text-grunge-gray">{bio}</p>}
            </div>

            <button
                onClick={onAdd}
                className="w-full mt-2 bg-grunge-dark text-grunge-white font-mono py-2 px-4 border-2 border-transparent hover:bg-grunge-accent hover:border-grunge-dark transition-colors"
            >
                ADD FRIEND +
            </button>
        </Card>
    );
};

export default AddFriendCard;
