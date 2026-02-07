
import AddFriendCard from './ui/AddFriendCard';
import { useNavigate } from 'react-router-dom';
import { useState } from 'react';
import { useEffect } from 'react';
import CryptoHover from './ui/CryptoHover';
import LoadingPage from './ui/LoadingPage';
import Cookies from 'js-cookie';

interface User {
    id: number;
    username: string;
    first_name: string;
    last_name: string;
    avatar_url: string;
    bio: string;
}

interface PendingRequest {
    id: number;
    username: string;
    first_name: string;
    last_name: string;
    avatar_url: string;
    bio: string;
}

const AddFriendPage = () => {
    const navigate = useNavigate();
    const [users, setUsers] = useState<User[]>([]);
    const [pendingRequests, setPendingRequests] = useState<PendingRequest[]>([]);
    const [sentRequests, setSentRequests] = useState<PendingRequest[]>([]);
    const [searchTerm, setSearchTerm] = useState('');
    const [loading, setLoading] = useState(false);
    const [message, setMessage] = useState<{ text: string, type: 'success' | 'error' } | null>(null);

    const token = Cookies.get('token');
    const API_URL = '';

    useEffect(() => {
        fetchPendingRequests();
        fetchSentRequests();
    }, []);

    useEffect(() => {
        const timeoutId = setTimeout(() => {
            if (searchTerm.trim()) {
                searchUsers(searchTerm);
            } else {
                setUsers([]);
            }
        }, 300);

        return () => clearTimeout(timeoutId);
    }, [searchTerm]);

    const fetchPendingRequests = async () => {
        try {
            const res = await fetch(`/api/friends/pending`, {
                headers: { 'Authorization': `Bearer ${token}` }
            });
            const data = await res.json();
            setPendingRequests(data.pendingrequest || []);
        } catch (err) {
            console.error('Error fetching pending requests:', err);
        }
    };

    const fetchSentRequests = async () => {
        try {
            const res = await fetch(`/api/friends/sent`, {
                headers: { 'Authorization': `Bearer ${token}` }
            });
            const data = await res.json();
            setSentRequests(data.sentRequests || []);
        } catch (err) {
            console.error('Error fetching sent requests:', err);
        }
    };

    const searchUsers = async (term: string) => {
        try {
            const res = await fetch(`/api/friends/search?q=${encodeURIComponent(term)}`, {
                headers: { 'Authorization': `Bearer ${token}` }
            });
            const data = await res.json();
            console.log('Search results:', data);
            setUsers(data.users || []);
        } catch (err) {
            console.error('Error searching users:', err);
        }
    };

    const handleAddFriend = async (username: string) => {
        try {
            const res = await fetch(`/api/friends/request`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`
                },
                body: JSON.stringify({ username })
            });
            const data = await res.json();

            if (res.ok) {
                setMessage({ text: 'Friend request sent!', type: 'success' });
                fetchSentRequests();
                setUsers(prev => prev.filter(u => u.username !== username));
            } else {
                setMessage({ text: data.error || data.message || 'Failed to send request', type: 'error' });
            }
        } catch (err) {
            setMessage({ text: 'Network error', type: 'error' });
        }

        setTimeout(() => setMessage(null), 3000);
    };

    const handleAcceptRequest = async (username: string) => {
        try {
            const res = await fetch(`/api/friends/accept`, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`
                },
                body: JSON.stringify({ username })
            });

            if (res.ok) {
                setMessage({ text: 'Friend request accepted!', type: 'success' });
                fetchPendingRequests();
            } else {
                const data = await res.json();
                setMessage({ text: data.message || 'Failed to accept', type: 'error' });
            }
        } catch (err) {
            setMessage({ text: 'Network error', type: 'error' });
        }

        setTimeout(() => setMessage(null), 3000);
    };

    const handleRejectRequest = async (username: string) => {
        try {
            const res = await fetch(`/api/friends/reject`, {
                method: 'DELETE',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`
                },
                body: JSON.stringify({ username })
            });

            if (res.ok) {
                setMessage({ text: 'Friend request rejected', type: 'success' });
                fetchPendingRequests();
            } else {
                const data = await res.json();
                setMessage({ text: data.message || 'Failed to reject', type: 'error' });
            }
        } catch (err) {
            setMessage({ text: 'Network error', type: 'error' });
        }

        setTimeout(() => setMessage(null), 3000);
    };

    const hasSentRequest = (username: string) => {
        return sentRequests.some(r => r.username === username);
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

            {message && (
                <div className={`p-4 border-2 border-grunge-dark font-mono ${message.type === 'success' ? 'bg-grunge-green/20' : 'bg-grunge-accent/20'}`}>
                    {message.text}
                </div>
            )}

            {pendingRequests.length > 0 && (
                <div className="border-2 border-grunge-dark p-4">
                    <h2 className="font-mono text-lg font-bold uppercase mb-4 border-b-2 border-grunge-dark pb-2">
                        Pending Requests ({pendingRequests.length})
                    </h2>
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
                        {pendingRequests.map((req) => (
                            <div key={req.id} className="border-2 border-grunge-dark p-4 bg-grunge-white">
                                <div className="flex items-center gap-3 mb-3">
                                    <div className="w-12 h-12 bg-grunge-dark text-grunge-white flex items-center justify-center font-bold text-lg">
                                        {req.username[0]?.toUpperCase()}
                                    </div>
                                    <div>
                                        <p className="font-mono font-bold">{req.username}</p>
                                        <p className="font-mono text-xs text-grunge-gray">{req.first_name} {req.last_name}</p>
                                    </div>
                                </div>
                                <div className="flex gap-2">
                                    <button
                                        onClick={() => handleAcceptRequest(req.username)}
                                        className="flex-1 bg-grunge-green text-white font-mono text-xs py-2 uppercase hover:shadow-[2px_2px_0_black]"
                                    >
                                        Accept
                                    </button>
                                    <button
                                        onClick={() => handleRejectRequest(req.username)}
                                        className="flex-1 bg-grunge-accent text-white font-mono text-xs py-2 uppercase hover:shadow-[2px_2px_0_black]"
                                    >
                                        Reject
                                    </button>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            )}

            <div className="relative">
                <input
                    type="text"
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    placeholder="SEARCH_USERNAME..."
                    className="w-full bg-grunge-white border-2 border-grunge-dark p-4 font-mono text-lg focus:outline-none focus:shadow-[4px_4px_0_#0f0f10] transition-shadow placeholder:text-grunge-gray/50"
                />
                <div className="absolute right-4 top-1/2 -translate-y-1/2 pointer-events-none text-2xl">
                    <span className="text-2xl">🔍</span>
                </div>
            </div>

            {loading && <LoadingPage />}

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                {users.map((user) => (
                    <AddFriendCard
                        key={user.id}
                        username={user.username}
                        avatarUrl={user.avatar_url ? `/images/${user.avatar_url}` : ''}
                        bio={user.bio || `${user.first_name} ${user.last_name}`}
                        onAdd={() => handleAddFriend(user.username)}
                        isPending={hasSentRequest(user.username)}
                    />
                ))}
            </div>

            {searchTerm && !loading && users.length === 0 && (
                <div className="text-center py-12 border-2 border-dashed border-grunge-gray">
                    <p className="font-mono text-grunge-gray">NO_USERS_FOUND_</p>
                </div>
            )}
        </div>
    );
};
export default AddFriendPage;
