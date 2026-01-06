import React from 'react';
import AddFriendCard from './ui/AddFriendCard';
import { useNavigate } from 'react-router-dom';

const MOCK_SUGGESTIONS = [
    { id: 1, username: "Emily Johnson", avatarUrl: "https://dummyjson.com/icon/emilys/128", bio: "loves coding & coffee" },
    { id: 2, username: "Michael Williams", avatarUrl: "https://dummyjson.com/icon/michaelw/128", bio: "fullstack dev" },
    { id: 3, username: "Sophia Brown", avatarUrl: "https://dummyjson.com/icon/sophiab/128", bio: "design enthusiast" },
    { id: 4, username: "James Davis", avatarUrl: "https://dummyjson.com/icon/jamesd/128", bio: "gaming 24/7" },
    { id: 5, username: "Emma Miller", avatarUrl: "https://dummyjson.com/icon/emmaj/128", bio: "react wizard" },
    { id: 6, username: "Olivia Wilson", avatarUrl: "https://dummyjson.com/icon/oliviaw/128", bio: "frontend master" },
];

const AddFriendPage = () => {
    const navigate = useNavigate();

    const handleAddFriend = (id: number) => {
        console.log(`Added friend ${id}`);
        // Here you would typically make an API call
    };

    return (
        <div className="min-h-screen p-8 max-w-7xl mx-auto flex flex-col gap-8">
            <header className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6 border-b-4 border-grunge-dark pb-6">
                <div>
                    <h1 className="font-display text-4xl md:text-5xl uppercase tracking-tighter">
                        Find Friends
                    </h1>
                    <p className="font-mono text-grunge-gray mt-2">Expand your network_</p>
                </div>

                <div className="w-full md:w-auto flex gap-2">
                    <button
                        onClick={() => navigate('/chat')}
                        className="font-mono bg-grunge-white border-2 border-grunge-dark px-4 py-2 hover:bg-grunge-dark hover:text-grunge-white transition-colors"
                    >
                        BACK
                    </button>
                </div>
            </header>

            <div className="relative">
                <input
                    type="text"
                    placeholder="SEARCH_USERNAME..."
                    className="w-full bg-grunge-white border-2 border-grunge-dark p-4 font-mono text-lg focus:outline-none focus:shadow-[4px_4px_0_#0f0f10] transition-shadow placeholder:text-grunge-gray/50 cursor-default"
                />
                <div className="absolute right-4 top-1/2 -translate-y-1/2 pointer-events-none text-2xl">
                    🔍
                </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                {MOCK_SUGGESTIONS.map((friend) => (
                    <AddFriendCard
                        key={friend.id}
                        username={friend.username}
                        avatarUrl={friend.avatarUrl}
                        bio={friend.bio}
                        onAdd={() => handleAddFriend(friend.id)}
                    />
                ))}
            </div>
        </div>
    );
};
export default AddFriendPage;
