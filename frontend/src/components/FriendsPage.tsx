import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Nav from './ui/Nav';
import Avatar from './ui/Avatar';
import CryptoHover from './ui/CryptoHover';
import LoadingPage from './ui/LoadingPage';
import Cookies from 'js-cookie';

interface Friend {
    id: number;
    username: string;
    first_name: string;
    last_name: string;
    avatar_url: string;
    bio: string;
}

const FriendsPage = () => {
    const navigate = useNavigate();
    const [friends, setFriends] = useState<Friend[]>([]);
    const [loading, setLoading] = useState(true);
    const [startingChat, setStartingChat] = useState<number | null>(null);

    const token = Cookies.get('token');
    const API_URL = '';

    useEffect(() => {
        fetchFriends();
    }, []);

    const fetchFriends = async () => {
        try {
            setLoading(true);
            const res = await fetch(`${API_URL}/api/friends/list`, {
                headers: { 'Authorization': `Bearer ${token}` }
            });
            const data = await res.json();
            setFriends(data.friends || []);
        } catch (err) {
            console.error('Error fetching friends:', err);
        } finally {
            await new Promise(resolve => setTimeout(resolve, 500));
            setLoading(false);
        }
    };

    const startConversation = async (username: string, friendId: number) => {
        setStartingChat(friendId);
        try {
            const res = await fetch(`${API_URL}/api/chat/conversation/direct`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`
                },
                body: JSON.stringify({ username })
            });

            if (res.ok) {
                const data = await res.json();
                // Navigate to chat with this conversation active
                navigate('/chat', { state: { activeConvId: data.conversation.id } });
            }
        } catch (err) {
            console.error('Error starting conversation:', err);
        } finally {
            setStartingChat(null);
        }
    };

    const removeFriend = async (username: string) => {
        if (!window.confirm(`Remove ${username} from friends?`)) return;

        try {
            const res = await fetch(`${API_URL}/api/friends/remove`, {
                method: 'DELETE',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`
                },
                body: JSON.stringify({ username })
            });

            if (res.ok) {
                setFriends(prev => prev.filter(f => f.username !== username));
            }
        } catch (err) {
            console.error('Error removing friend:', err);
        }
    };

    return (
        <div className="min-h-screen bg-grunge-white">
            <Nav />

            <div className="max-w-6xl mx-auto p-8">
                {/* Header */}
                <header className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6 border-b-4 border-grunge-dark pb-6 mb-8">
                    <div>
                        <h1 className="font-display text-4xl md:text-5xl uppercase tracking-tighter">
                            <CryptoHover text="My Friends" className="text-grunge-dark" />
                        </h1>
                        <p className="font-mono text-grunge-gray mt-2">
                            {friends.length} connection{friends.length !== 1 ? 's' : ''}_
                        </p>
                    </div>

                    <div className="flex gap-3">
                        <button
                            onClick={() => navigate('/add-friends')}
                            className="font-mono bg-grunge-accent text-white border-2 border-grunge-dark px-4 py-2 hover:shadow-[4px_4px_0_#0f0f10] transition-shadow uppercase"
                        >
                            + Add Friends
                        </button>
                        <button
                            onClick={() => navigate('/chat')}
                            className="font-mono bg-grunge-white border-2 border-grunge-dark px-4 py-2 hover:bg-grunge-dark hover:text-grunge-white transition-colors uppercase"
                        >
                            Back to Chat
                        </button>
                    </div>
                </header>

                {/* Loading State */}
                {loading && <LoadingPage />}


                {/* Empty State */}
                {!loading && friends.length === 0 && (
                    <div className="text-center py-16 border-2 border-dashed border-grunge-gray">
                        <p className="font-mono text-2xl text-grunge-gray mb-4">NO_FRIENDS_YET</p>
                        <p className="font-mono text-grunge-gray mb-6">Start building your network</p>
                        <button
                            onClick={() => navigate('/add-friends')}
                            className="font-mono bg-grunge-dark text-white px-6 py-3 hover:bg-grunge-accent transition-colors uppercase"
                        >
                            Find Friends
                        </button>
                    </div>
                )}

                {/* Friends Grid */}
                {!loading && friends.length > 0 && (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                        {friends.map((friend) => (
                            <div
                                key={friend.id}
                                className="border-4 border-grunge-dark bg-grunge-white p-6 shadow-[6px_6px_0_#0f0f10] hover:shadow-[8px_8px_0_#0f0f10] hover:-translate-y-1 transition-all"
                            >
                                {/* Friend Info */}
                                <div className="flex items-center gap-4 mb-4">
                                    <Avatar
                                        src={friend.avatar_url ? `${API_URL}/${friend.avatar_url}` : undefined}
                                        alt={friend.username}
                                        fallback={friend.username.substring(0, 2).toUpperCase()}
                                        size="lg"
                                        className="border-2 border-grunge-dark"
                                    />
                                    <div className="flex-1 min-w-0">
                                        <h3 className="font-display text-xl truncate">{friend.username}</h3>
                                        <p className="font-mono text-sm text-grunge-gray truncate">
                                            {friend.first_name} {friend.last_name}
                                        </p>
                                    </div>
                                    <div className="w-3 h-3 bg-grunge-green rounded-full border border-grunge-dark" title="Online" />
                                </div>

                                {/* Bio */}
                                {friend.bio && (
                                    <p className="font-mono text-sm text-grunge-gray mb-4 line-clamp-2 border-l-2 border-grunge-accent pl-3">
                                        {friend.bio}
                                    </p>
                                )}

                                {/* Actions */}
                                <div className="flex gap-2 pt-4 border-t-2 border-grunge-dark/20">
                                    <button
                                        onClick={() => startConversation(friend.username, friend.id)}
                                        disabled={startingChat === friend.id}
                                        className="flex-1 font-mono text-xs py-2 bg-grunge-dark text-white uppercase hover:bg-grunge-accent transition-colors disabled:opacity-50 disabled:cursor-wait"
                                    >
                                        {startingChat === friend.id ? 'Opening...' : '💬 Message'}
                                    </button>
                                    <button
                                        onClick={() => removeFriend(friend.username)}
                                        className="font-mono text-xs py-2 px-3 border-2 border-grunge-dark text-grunge-dark uppercase hover:bg-grunge-accent hover:text-white hover:border-grunge-accent transition-colors"
                                        title="Remove Friend"
                                    >
                                        ✕
                                    </button>
                                </div>
                            </div>
                        ))}
                    </div>
                )}
            </div>
        </div>
    );
};

export default FriendsPage;
