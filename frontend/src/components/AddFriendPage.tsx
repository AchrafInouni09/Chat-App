import React from 'react';
import AddFriendCard from './ui/AddFriendCard';
import { useNavigate } from 'react-router-dom';
import { useState } from 'react';
import { useEffect } from 'react';
import CryptoHover from './ui/CryptoHover';

interface User {
    id: number;
    username: string;
    avatarUrl: string;
    bio: string;
}

const AddFriendPage = () => {
    const navigate = useNavigate();
    // ghir test drt whd json file smito users.json bach nfechihom 
    const [users, setUsers] = useState<User[]>([]);
    useEffect(() => {
        const loadUsers = async () => {

            const response = await fetch("../public/test/users.json");
            const data = await response.json();
            setUsers(data);

        }
        loadUsers();
    }, []);
    // hna kisali test

    const handleAddFriend = (id: number) => {
        console.log(`Added friend ${id}`);
        // Here you would typically make an API call
    };

    return (
        <div className="min-h-screen p-8 max-w-7xl mx-auto flex flex-col gap-8">
            <header className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6 border-b-4 border-grunge-dark pb-6">
                <div>
                    <h1 className="font-display text-4xl md:text-5xl uppercase tracking-tighter">
                        <CryptoHover text="Find Friends" className="text-grunge-accent" activeClassName="text-grunge-dark animate-glitch" />
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
                {users.map((friend) => (
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
