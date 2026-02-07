import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Nav from './ui/Nav';
import CryptoHover from './ui/CryptoHover';
import LoadingPage from './ui/LoadingPage';
import Cookies from 'js-cookie';
import { Copy, Trash2, Key, Plus, Book, Code, Terminal } from 'lucide-react';

interface ApiKey {
    id: number;
    key_prefix: string;
    name: string;
    rate_limit: number;
    created_at: string;
}

interface NewKeyResponse {
    id: number;
    key: string;
    prefix: string;
    name: string;
    rateLimit: number;
}

const ApiKeysPage = () => {
    const navigate = useNavigate();
    const [apiKeys, setApiKeys] = useState<ApiKey[]>([]);
    const [loading, setLoading] = useState(true);
    const [creating, setCreating] = useState(false);
    const [newKeyName, setNewKeyName] = useState('');
    const [newKeyRateLimit, setNewKeyRateLimit] = useState(100);
    const [newlyCreatedKey, setNewlyCreatedKey] = useState<NewKeyResponse | null>(null);
    const [copied, setCopied] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [success, setSuccess] = useState<string | null>(null);
    const [activeTab, setActiveTab] = useState<'keys' | 'docs'>('keys');

    const token = Cookies.get('token');

    useEffect(() => {
        if (!token) {
            navigate('/login');
            return;
        }
        fetchApiKeys();
    }, []);

    useEffect(() => {
        if (error || success) {
            const timer = setTimeout(() => {
                setError(null);
                setSuccess(null);
            }, 5000);
            return () => clearTimeout(timer);
        }
    }, [error, success]);

    const fetchApiKeys = async () => {
        try {
            const res = await fetch(`/api/keys`, {
                headers: { 'Authorization': `Bearer ${token}` }
            });
            const data = await res.json();
            setApiKeys(data.apiKeys || []);
        } catch (err) {
            console.error('Error fetching API keys:', err);
            setError('Failed to load API keys');
        } finally {
            await new Promise(resolve => setTimeout(resolve, 500));
            setLoading(false);
        }
    };

    const handleCreateKey = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!newKeyName.trim()) return;

        setCreating(true);
        setError(null);
        try {
            const res = await fetch(`/api/keys`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`
                },
                body: JSON.stringify({
                    name: newKeyName,
                    rate_limit: newKeyRateLimit
                })
            });

            const data = await res.json();

            if (res.ok) {
                setNewlyCreatedKey(data.apiKey);
                setNewKeyName('');
                setNewKeyRateLimit(100);
                fetchApiKeys();
            } else {
                setError(data.message || 'Failed to create API key');
            }
        } catch (err) {
            console.error('Error creating API key:', err);
            setError('Network error');
        } finally {
            setCreating(false);
        }
    };

    const handleDeleteKey = async (keyId: number) => {
        if (!window.confirm('Are you sure you want to delete this API key? This action cannot be undone.')) return;

        try {
            const res = await fetch(`/api/keys/${keyId}`, {
                method: 'DELETE',
                headers: { 'Authorization': `Bearer ${token}` }
            });

            if (res.ok) {
                setSuccess('API key deleted');
                setApiKeys(prev => prev.filter(k => k.id !== keyId));
            } else {
                const data = await res.json();
                setError(data.message || 'Failed to delete API key');
            }
        } catch (err) {
            console.error('Error deleting API key:', err);
            setError('Network error');
        }
    };

    const copyToClipboard = (text: string) => {
        navigator.clipboard.writeText(text);
        setCopied(true);
        setTimeout(() => setCopied(false), 2000);
    };

    const formatDate = (dateString: string) => {
        return new Date(dateString).toLocaleDateString('en-US', {
            year: 'numeric',
            month: 'short',
            day: 'numeric'
        });
    };

    return (
        <div className="min-h-screen bg-grunge-white">
            <Nav />

            <div className="max-w-5xl mx-auto p-4 md:p-8">
                {/* Header */}
                <header className="border-b-4 border-grunge-dark pb-6 mb-8">
                    <h1 className="font-display text-4xl md:text-5xl uppercase tracking-tighter">
                        <CryptoHover text="API Keys" className="text-grunge-dark" />
                    </h1>
                    <p className="font-mono text-grunge-gray mt-2">Manage your API access tokens_</p>
                </header>

                {/* Tabs */}
                <div className="flex gap-4 mb-8 border-b-2 border-grunge-dark">
                    <button
                        onClick={() => setActiveTab('keys')}
                        className={`font-mono text-sm uppercase px-4 py-3 border-b-4 -mb-[2px] transition-colors ${activeTab === 'keys'
                            ? 'border-grunge-accent text-grunge-dark font-bold'
                            : 'border-transparent text-grunge-gray hover:text-grunge-dark'
                            }`}
                    >
                        <Key className="inline-block w-4 h-4 mr-2" />
                        My Keys
                    </button>
                    <button
                        onClick={() => setActiveTab('docs')}
                        className={`font-mono text-sm uppercase px-4 py-3 border-b-4 -mb-[2px] transition-colors ${activeTab === 'docs'
                            ? 'border-grunge-accent text-grunge-dark font-bold'
                            : 'border-transparent text-grunge-gray hover:text-grunge-dark'
                            }`}
                    >
                        <Book className="inline-block w-4 h-4 mr-2" />
                        Documentation
                    </button>
                </div>

                {/* Alerts */}
                {error && (
                    <div className="mb-6 p-4 border-2 border-grunge-accent bg-grunge-accent/10 font-mono text-sm">
                        ⚠️ {error}
                    </div>
                )}
                {success && (
                    <div className="mb-6 p-4 border-2 border-green-600 bg-green-600/10 font-mono text-sm">
                        ✓ {success}
                    </div>
                )}

                {/* Newly Created Key Modal */}
                {newlyCreatedKey && (
                    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
                        <div className="bg-grunge-white border-4 border-grunge-dark shadow-[8px_8px_0_#0f0f10] max-w-lg w-full p-6">
                            <h3 className="font-display text-2xl uppercase mb-4">🔑 API Key Created!</h3>
                            <p className="font-mono text-sm text-grunge-gray mb-4">
                                Save this key now. It will not be shown again!
                            </p>

                            <div className="bg-grunge-dark text-grunge-white p-4 font-mono text-sm break-all relative">
                                {newlyCreatedKey.key}
                                <button
                                    onClick={() => copyToClipboard(newlyCreatedKey.key)}
                                    className="absolute top-2 right-2 p-2 hover:bg-grunge-gray/20 rounded"
                                >
                                    <Copy className="w-4 h-4" />
                                </button>
                            </div>

                            {copied && (
                                <p className="font-mono text-xs text-green-600 mt-2">✓ Copied to clipboard!</p>
                            )}

                            <div className="mt-4 grid grid-cols-2 gap-4 font-mono text-sm">
                                <div>
                                    <span className="text-grunge-gray">Name:</span>
                                    <span className="ml-2">{newlyCreatedKey.name}</span>
                                </div>
                                <div>
                                    <span className="text-grunge-gray">Rate Limit:</span>
                                    <span className="ml-2">{newlyCreatedKey.rateLimit}/hr</span>
                                </div>
                            </div>

                            <button
                                onClick={() => setNewlyCreatedKey(null)}
                                className="mt-6 w-full bg-grunge-dark text-grunge-white border-2 border-grunge-dark py-3 font-mono uppercase hover:bg-grunge-accent transition-colors"
                            >
                                I've Saved My Key
                            </button>
                        </div>
                    </div>
                )}

                {activeTab === 'keys' ? (
                    <div className="space-y-8">
                        {/* Create New Key Form */}
                        <div className="border-2 border-grunge-dark p-6">
                            <h2 className="font-mono text-lg font-bold uppercase mb-4 flex items-center gap-2">
                                <Plus className="w-5 h-5" />
                                Create New API Key
                            </h2>
                            <form onSubmit={handleCreateKey} className="space-y-4">
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                    <div>
                                        <label className="font-mono text-xs uppercase text-grunge-gray block mb-1">
                                            Key Name
                                        </label>
                                        <input
                                            type="text"
                                            value={newKeyName}
                                            onChange={(e) => setNewKeyName(e.target.value)}
                                            placeholder="e.g., My Mobile App"
                                            className="w-full bg-transparent border-2 border-grunge-dark p-3 font-mono text-sm outline-none focus:border-grunge-accent"
                                            required
                                        />
                                    </div>
                                    <div>
                                        <label className="font-mono text-xs uppercase text-grunge-gray block mb-1">
                                            Rate Limit (per hour)
                                        </label>
                                        <input
                                            type="number"
                                            value={newKeyRateLimit}
                                            onChange={(e) => setNewKeyRateLimit(parseInt(e.target.value) || 100)}
                                            min="1"
                                            max="10000"
                                            className="w-full bg-transparent border-2 border-grunge-dark p-3 font-mono text-sm outline-none focus:border-grunge-accent"
                                        />
                                    </div>
                                </div>
                                <button
                                    type="submit"
                                    disabled={creating || !newKeyName.trim()}
                                    className="bg-grunge-accent text-white border-2 border-grunge-dark px-6 py-3 font-mono uppercase hover:shadow-[4px_4px_0_#0f0f10] transition-shadow disabled:opacity-50"
                                >
                                    {creating ? 'Creating...' : 'Generate Key'}
                                </button>
                            </form>
                        </div>

                        {/* Existing Keys */}
                        <div className="border-2 border-grunge-dark">
                            <div className="bg-grunge-dark text-grunge-white p-4">
                                <h2 className="font-mono text-lg font-bold uppercase flex items-center gap-2">
                                    <Key className="w-5 h-5" />
                                    Your API Keys ({apiKeys.length})
                                </h2>
                            </div>

                            {loading ? (
                                <LoadingPage />
                            ) : apiKeys.length === 0 ? (
                                <div className="p-8 text-center">
                                    <p className="font-mono text-grunge-gray">No API keys yet. Create one above!</p>
                                </div>
                            ) : (
                                <div className="divide-y-2 divide-grunge-dark">
                                    {apiKeys.map((key) => (
                                        <div key={key.id} className="p-4 flex items-center justify-between gap-4">
                                            <div className="flex-1">
                                                <p className="font-mono font-bold">{key.name}</p>
                                                <p className="font-mono text-sm text-grunge-gray">
                                                    Key: {key.key_prefix}••••••••
                                                </p>
                                                <p className="font-mono text-xs text-grunge-gray mt-1">
                                                    Created: {formatDate(key.created_at)} • Rate Limit: {key.rate_limit}/hr
                                                </p>
                                            </div>
                                            <button
                                                onClick={() => handleDeleteKey(key.id)}
                                                className="p-2 text-grunge-accent hover:bg-grunge-accent/10 transition-colors"
                                                title="Delete API Key"
                                            >
                                                <Trash2 className="w-5 h-5" />
                                            </button>
                                        </div>
                                    ))}
                                </div>
                            )}
                        </div>
                    </div>
                ) : (
                    /* Documentation Tab */
                    <div className="space-y-8">
                        {/* Overview */}
                        <div className="border-2 border-grunge-dark p-6">
                            <h2 className="font-display text-2xl uppercase mb-4">📡 Posts API Overview</h2>
                            <p className="font-mono text-sm text-grunge-gray leading-relaxed">
                                The Posts API allows you to programmatically create, read, update, and delete posts.
                                You can authenticate using either a JWT token or an API key.
                            </p>

                            <div className="mt-6 grid grid-cols-1 md:grid-cols-2 gap-4">
                                <div className="bg-grunge-dark text-grunge-white p-4">
                                    <h4 className="font-mono font-bold mb-2">Base URL</h4>
                                    <code className="text-grunge-accent">https://localhost:3000/api/posts</code>
                                </div>
                                <div className="bg-grunge-dark text-grunge-white p-4">
                                    <h4 className="font-mono font-bold mb-2">Authentication Header</h4>
                                    <code className="text-grunge-accent">X-API-Key: your_api_key</code>
                                </div>
                            </div>
                        </div>

                        {/* Rate Limiting */}
                        <div className="border-2 border-grunge-dark p-6">
                            <h2 className="font-display text-2xl uppercase mb-4">⏱️ Rate Limiting</h2>
                            <p className="font-mono text-sm text-grunge-gray mb-4">
                                API requests are rate-limited per key. Check the response headers for your current status:
                            </p>
                            <div className="bg-grunge-dark text-grunge-white p-4 font-mono text-sm">
                                <p><span className="text-grunge-accent">X-RateLimit-Limit:</span> Maximum requests per hour</p>
                                <p><span className="text-grunge-accent">X-RateLimit-Remaining:</span> Requests remaining</p>
                                <p><span className="text-grunge-accent">X-RateLimit-Reset:</span> Unix timestamp for reset</p>
                            </div>
                        </div>

                        {/* Endpoints */}
                        <div className="border-2 border-grunge-dark">
                            <div className="bg-grunge-dark text-grunge-white p-4">
                                <h2 className="font-display text-xl uppercase flex items-center gap-2">
                                    <Code className="w-5 h-5" />
                                    API Endpoints
                                </h2>
                            </div>

                            <div className="divide-y-2 divide-grunge-dark">
                                {/* GET /posts */}
                                <div className="p-6">
                                    <div className="flex items-center gap-2 mb-2">
                                        <span className="bg-green-600 text-white px-2 py-1 font-mono text-xs">GET</span>
                                        <code className="font-mono font-bold">/api/posts</code>
                                    </div>
                                    <p className="font-mono text-sm text-grunge-gray mb-4">List all public posts (no auth required)</p>
                                    <div className="bg-gray-100 p-4 font-mono text-sm overflow-x-auto">
                                        <p className="text-grunge-gray"># Example</p>
                                        <p>curl https://localhost:3000/api/posts</p>
                                    </div>
                                </div>

                                {/* GET /posts/my */}
                                <div className="p-6">
                                    <div className="flex items-center gap-2 mb-2">
                                        <span className="bg-green-600 text-white px-2 py-1 font-mono text-xs">GET</span>
                                        <code className="font-mono font-bold">/api/posts/my</code>
                                    </div>
                                    <p className="font-mono text-sm text-grunge-gray mb-4">List your posts (auth required)</p>
                                    <div className="bg-gray-100 p-4 font-mono text-sm overflow-x-auto">
                                        <p className="text-grunge-gray"># Example with API Key</p>
                                        <p>curl -H "X-API-Key: your_key" \</p>
                                        <p className="ml-4">https://localhost:3000/api/posts/my</p>
                                    </div>
                                </div>

                                {/* POST /posts */}
                                <div className="p-6">
                                    <div className="flex items-center gap-2 mb-2">
                                        <span className="bg-blue-600 text-white px-2 py-1 font-mono text-xs">POST</span>
                                        <code className="font-mono font-bold">/api/posts</code>
                                    </div>
                                    <p className="font-mono text-sm text-grunge-gray mb-4">Create a new post (auth required)</p>
                                    <div className="bg-gray-100 p-4 font-mono text-sm overflow-x-auto">
                                        <p className="text-grunge-gray"># Example</p>
                                        <p>curl -X POST \</p>
                                        <p className="ml-4">-H "X-API-Key: your_key" \</p>
                                        <p className="ml-4">-H "Content-Type: application/json" \</p>
                                        <p className="ml-4">-d '{`{"content": "Hello from API!", "visibility": "public"}`}' \</p>
                                        <p className="ml-4">https://localhost:3000/api/posts</p>
                                    </div>
                                </div>

                                {/* PUT /posts/:id */}
                                <div className="p-6">
                                    <div className="flex items-center gap-2 mb-2">
                                        <span className="bg-yellow-600 text-white px-2 py-1 font-mono text-xs">PUT</span>
                                        <code className="font-mono font-bold">/api/posts/:id</code>
                                    </div>
                                    <p className="font-mono text-sm text-grunge-gray mb-4">Update a post (auth required, owner only)</p>
                                    <div className="bg-gray-100 p-4 font-mono text-sm overflow-x-auto">
                                        <p className="text-grunge-gray"># Example</p>
                                        <p>curl -X PUT \</p>
                                        <p className="ml-4">-H "X-API-Key: your_key" \</p>
                                        <p className="ml-4">-H "Content-Type: application/json" \</p>
                                        <p className="ml-4">-d '{`{"content": "Updated content"}`}' \</p>
                                        <p className="ml-4">https://localhost:3000/api/posts/1</p>
                                    </div>
                                </div>

                                {/* DELETE /posts/:id */}
                                <div className="p-6">
                                    <div className="flex items-center gap-2 mb-2">
                                        <span className="bg-red-600 text-white px-2 py-1 font-mono text-xs">DELETE</span>
                                        <code className="font-mono font-bold">/api/posts/:id</code>
                                    </div>
                                    <p className="font-mono text-sm text-grunge-gray mb-4">Delete a post (auth required, owner only)</p>
                                    <div className="bg-gray-100 p-4 font-mono text-sm overflow-x-auto">
                                        <p className="text-grunge-gray"># Example</p>
                                        <p>curl -X DELETE \</p>
                                        <p className="ml-4">-H "X-API-Key: your_key" \</p>
                                        <p className="ml-4">https://localhost:3000/api/posts/1</p>
                                    </div>
                                </div>

                                {/* POST /posts/:id/like */}
                                <div className="p-6">
                                    <div className="flex items-center gap-2 mb-2">
                                        <span className="bg-blue-600 text-white px-2 py-1 font-mono text-xs">POST</span>
                                        <code className="font-mono font-bold">/api/posts/:id/like</code>
                                    </div>
                                    <p className="font-mono text-sm text-grunge-gray mb-4">Like a post (auth required)</p>
                                    <div className="bg-gray-100 p-4 font-mono text-sm overflow-x-auto">
                                        <p className="text-grunge-gray"># Example</p>
                                        <p>curl -X POST \</p>
                                        <p className="ml-4">-H "X-API-Key: your_key" \</p>
                                        <p className="ml-4">https://localhost:3000/api/posts/1/like</p>
                                    </div>
                                </div>

                                {/* POST /posts/:id/comments */}
                                <div className="p-6">
                                    <div className="flex items-center gap-2 mb-2">
                                        <span className="bg-blue-600 text-white px-2 py-1 font-mono text-xs">POST</span>
                                        <code className="font-mono font-bold">/api/posts/:id/comments</code>
                                    </div>
                                    <p className="font-mono text-sm text-grunge-gray mb-4">Add a comment (auth required)</p>
                                    <div className="bg-gray-100 p-4 font-mono text-sm overflow-x-auto">
                                        <p className="text-grunge-gray"># Example</p>
                                        <p>curl -X POST \</p>
                                        <p className="ml-4">-H "X-API-Key: your_key" \</p>
                                        <p className="ml-4">-H "Content-Type: application/json" \</p>
                                        <p className="ml-4">-d '{`{"content": "Nice post!"}`}' \</p>
                                        <p className="ml-4">https://localhost:3000/api/posts/1/comments</p>
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* Quick Start */}
                        <div className="border-2 border-grunge-dark p-6">
                            <h2 className="font-display text-2xl uppercase mb-4 flex items-center gap-2">
                                <Terminal className="w-6 h-6" />
                                Quick Start
                            </h2>
                            <div className="space-y-4">
                                <div>
                                    <p className="font-mono text-sm font-bold mb-2">1. Create an API Key</p>
                                    <p className="font-mono text-xs text-grunge-gray">Use the "My Keys" tab to generate a new API key.</p>
                                </div>
                                <div>
                                    <p className="font-mono text-sm font-bold mb-2">2. Test Your Key</p>
                                    <div className="bg-grunge-dark text-grunge-white p-4 font-mono text-sm overflow-x-auto">
                                        <p>curl -H "X-API-Key: YOUR_API_KEY" \</p>
                                        <p className="ml-4">https://localhost:3000/api/posts/my</p>
                                    </div>
                                </div>
                                <div>
                                    <p className="font-mono text-sm font-bold mb-2">3. Create a Post</p>
                                    <div className="bg-grunge-dark text-grunge-white p-4 font-mono text-sm overflow-x-auto">
                                        <p>curl -X POST \</p>
                                        <p className="ml-4">-H "X-API-Key: YOUR_API_KEY" \</p>
                                        <p className="ml-4">-H "Content-Type: application/json" \</p>
                                        <p className="ml-4">-d '{`{"content": "My first API post!", "visibility": "public"}`}' \</p>
                                        <p className="ml-4">https://localhost:3000/api/posts</p>
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* Response Examples */}
                        <div className="border-2 border-grunge-dark p-6">
                            <h2 className="font-display text-2xl uppercase mb-4">📦 Response Examples</h2>

                            <div className="space-y-4">
                                <div>
                                    <p className="font-mono text-sm font-bold mb-2">Success Response (Create Post)</p>
                                    <div className="bg-grunge-dark text-grunge-white p-4 font-mono text-xs overflow-x-auto">
                                        <pre>{JSON.stringify({
                                            message: "Post created",
                                            post: {
                                                id: 1,
                                                user_id: 1,
                                                content: "Hello from API!",
                                                visibility: "public",
                                                created_at: "2024-01-15T10:30:00.000Z"
                                            }
                                        }, null, 2)}</pre>
                                    </div>
                                </div>

                                <div>
                                    <p className="font-mono text-sm font-bold mb-2">Error Response (Rate Limited)</p>
                                    <div className="bg-grunge-accent/20 border border-grunge-accent p-4 font-mono text-xs overflow-x-auto">
                                        <pre>{JSON.stringify({
                                            message: "Rate limit exceeded",
                                            limit: 100,
                                            resetAt: "2024-01-15T11:00:00.000Z"
                                        }, null, 2)}</pre>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
};

export default ApiKeysPage;
