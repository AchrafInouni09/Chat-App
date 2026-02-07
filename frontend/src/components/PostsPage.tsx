import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Nav from './ui/Nav';
import Avatar from './ui/Avatar';
import CryptoHover from './ui/CryptoHover';
import LoadingPage from './ui/LoadingPage';
import Cookies from 'js-cookie';
import { jwtDecode } from 'jwt-decode';

interface JwtPayload {
    id: number;
    username: string;
}

interface Post {
    id: number;
    user_id: number;
    username: string;
    avatar_url: string | null;
    content: string;
    visibility: string;
    like_count: number;
    comment_count: number;
    created_at: string;
    isLiked?: boolean;
}

interface Comment {
    id: number;
    post_id: number;
    user_id: number;
    username: string;
    avatar_url: string | null;
    content: string;
    created_at: string;
}

const PostsPage = () => {
    const navigate = useNavigate();
    const [posts, setPosts] = useState<Post[]>([]);
    const [loading, setLoading] = useState(true);
    const [newPostContent, setNewPostContent] = useState('');
    const [newPostVisibility, setNewPostVisibility] = useState<'public' | 'private'>('public');
    const [creating, setCreating] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [success, setSuccess] = useState<string | null>(null);

    // Tab state for switching between all posts and my posts
    const [activeTab, setActiveTab] = useState<'all' | 'my'>('all');

    // Comments state
    const [expandedComments, setExpandedComments] = useState<number | null>(null);
    const [comments, setComments] = useState<{ [postId: number]: Comment[] }>({});
    const [newComment, setNewComment] = useState<{ [postId: number]: string }>({});
    const [loadingComments, setLoadingComments] = useState<number | null>(null);

    // Edit state
    const [editingPost, setEditingPost] = useState<number | null>(null);
    const [editContent, setEditContent] = useState('');

    const token = Cookies.get('token');
    const API_URL = '';

    let currentUserId: number | null = null;
    let currentUsername: string | null = null;
    const [currentUserAvatar, setCurrentUserAvatar] = useState<string | null>(null);

    if (token) {
        try {
            const decoded = jwtDecode<JwtPayload>(token);
            currentUserId = decoded.id;
            currentUsername = decoded.username;
        } catch (e) {
            console.error('Error decoding token:', e);
        }
    }

    useEffect(() => {
        if (token) {
            fetch(`${API_URL}/api/profile/me`, {
                headers: { 'Authorization': `Bearer ${token}` }
            })
            .then(res => res.ok ? res.json() : null)
            .then(data => { if (data?.user?.avatar_url) setCurrentUserAvatar(data.user.avatar_url); })
            .catch(() => {});
        }
    }, [token]);

    useEffect(() => {
        if (activeTab === 'all') {
            fetchPosts();
        } else {
            fetchMyPosts();
        }
    }, [activeTab]);

    useEffect(() => {
        if (error || success) {
            const timer = setTimeout(() => {
                setError(null);
                setSuccess(null);
            }, 3000);
            return () => clearTimeout(timer);
        }
    }, [error, success]);

    const fetchPosts = async () => {
        setLoading(true);
        try {
            const res = await fetch(`${API_URL}/api/posts`);
            const data = await res.json();
            setPosts(data.posts || []);
        } catch (err) {
            console.error('Error fetching posts:', err);
            setError('Failed to load posts');
        } finally {
            await new Promise(resolve => setTimeout(resolve, 500));
            setLoading(false);
        }
    };

    const fetchMyPosts = async () => {
        if (!token) {
            navigate('/login');
            return;
        }
        setLoading(true);
        try {
            const res = await fetch(`${API_URL}/api/posts/my`, {
                headers: { 'Authorization': `Bearer ${token}` }
            });
            const data = await res.json();
            setPosts(data.posts || []);
        } catch (err) {
            console.error('Error fetching my posts:', err);
            setError('Failed to load your posts');
        } finally {
            await new Promise(resolve => setTimeout(resolve, 500));
            setLoading(false);
        }
    };

    const handleCreatePost = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!token) {
            navigate('/login');
            return;
        }
        if (!newPostContent.trim()) return;

        setCreating(true);
        setError(null);
        try {
            const res = await fetch(`${API_URL}/api/posts`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`
                },
                body: JSON.stringify({
                    content: newPostContent,
                    visibility: newPostVisibility
                })
            });

            const data = await res.json();

            if (res.ok) {
                setNewPostContent('');
                setSuccess('Post created successfully!');
                if (activeTab === 'all') {
                    fetchPosts();
                } else {
                    fetchMyPosts();
                }
            } else {
                setError(data.message || 'Failed to create post');
            }
        } catch (err) {
            console.error('Error creating post:', err);
            setError('Network error');
        } finally {
            setCreating(false);
        }
    };

    const handleDeletePost = async (postId: number) => {
        if (!token) return;
        if (!window.confirm('Are you sure you want to delete this post?')) return;

        try {
            const res = await fetch(`${API_URL}/api/posts/${postId}`, {
                method: 'DELETE',
                headers: { 'Authorization': `Bearer ${token}` }
            });

            if (res.ok) {
                setSuccess('Post deleted');
                setPosts(prev => prev.filter(p => p.id !== postId));
            } else {
                const data = await res.json();
                setError(data.message || 'Failed to delete post');
            }
        } catch (err) {
            console.error('Error deleting post:', err);
            setError('Network error');
        }
    };

    const handleUpdatePost = async (postId: number) => {
        if (!token || !editContent.trim()) return;

        try {
            const res = await fetch(`${API_URL}/api/posts/${postId}`, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`
                },
                body: JSON.stringify({ content: editContent })
            });

            if (res.ok) {
                setSuccess('Post updated');
                setEditingPost(null);
                setEditContent('');
                if (activeTab === 'all') {
                    fetchPosts();
                } else {
                    fetchMyPosts();
                }
            } else {
                const data = await res.json();
                setError(data.message || 'Failed to update post');
            }
        } catch (err) {
            console.error('Error updating post:', err);
            setError('Network error');
        }
    };

    const handleLike = async (postId: number) => {
        if (!token) {
            navigate('/login');
            return;
        }

        try {
            const res = await fetch(`${API_URL}/api/posts/${postId}/like`, {
                method: 'POST',
                headers: { 'Authorization': `Bearer ${token}` }
            });

            if (res.ok) {
                setPosts(prev => prev.map(p =>
                    p.id === postId
                        ? { ...p, like_count: p.like_count + 1, isLiked: true }
                        : p
                ));
            }
        } catch (err) {
            console.error('Error liking post:', err);
        }
    };

    const handleUnlike = async (postId: number) => {
        if (!token) return;

        try {
            const res = await fetch(`${API_URL}/api/posts/${postId}/like`, {
                method: 'DELETE',
                headers: { 'Authorization': `Bearer ${token}` }
            });

            if (res.ok) {
                setPosts(prev => prev.map(p =>
                    p.id === postId
                        ? { ...p, like_count: Math.max(0, p.like_count - 1), isLiked: false }
                        : p
                ));
            }
        } catch (err) {
            console.error('Error unliking post:', err);
        }
    };

    const toggleComments = async (postId: number) => {
        if (expandedComments === postId) {
            setExpandedComments(null);
            return;
        }

        setExpandedComments(postId);
        if (!comments[postId]) {
            await fetchComments(postId);
        }
    };

    const fetchComments = async (postId: number) => {
        setLoadingComments(postId);
        try {
            const res = await fetch(`${API_URL}/api/posts/${postId}/comments`);
            const data = await res.json();
            setComments(prev => ({ ...prev, [postId]: data.comments || [] }));
        } catch (err) {
            console.error('Error fetching comments:', err);
        } finally {
            setLoadingComments(null);
        }
    };

    const handleAddComment = async (postId: number) => {
        if (!token) {
            navigate('/login');
            return;
        }

        const content = newComment[postId]?.trim();
        if (!content) return;

        try {
            const res = await fetch(`${API_URL}/api/posts/${postId}/comments`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`
                },
                body: JSON.stringify({ content })
            });

            if (res.ok) {
                setNewComment(prev => ({ ...prev, [postId]: '' }));
                fetchComments(postId);
                setPosts(prev => prev.map(p =>
                    p.id === postId
                        ? { ...p, comment_count: p.comment_count + 1 }
                        : p
                ));
            }
        } catch (err) {
            console.error('Error adding comment:', err);
        }
    };

    const handleDeleteComment = async (commentId: number, postId: number) => {
        if (!token) return;

        try {
            const res = await fetch(`${API_URL}/api/posts/comments/${commentId}`, {
                method: 'DELETE',
                headers: { 'Authorization': `Bearer ${token}` }
            });

            if (res.ok) {
                setComments(prev => ({
                    ...prev,
                    [postId]: prev[postId].filter(c => c.id !== commentId)
                }));
                setPosts(prev => prev.map(p =>
                    p.id === postId
                        ? { ...p, comment_count: Math.max(0, p.comment_count - 1) }
                        : p
                ));
            }
        } catch (err) {
            console.error('Error deleting comment:', err);
        }
    };

    const formatDate = (dateString: string) => {
        const date = new Date(dateString);
        return date.toLocaleString('en-US', {
            month: 'short',
            day: 'numeric',
            hour: '2-digit',
            minute: '2-digit'
        });
    };

    const getAvatarUrl = (url: string | null) => {
        if (!url) return null;
        if (url.startsWith('http')) return url;
        if (url.startsWith('/images/')) return url;
        return `/images/${url}`;
    };

    return (
        <div className="min-h-screen bg-grunge-white">
            <Nav />

            <div className="max-w-3xl mx-auto p-4 md:p-8">
                {/* Header */}
                <header className="border-b-4 border-grunge-dark pb-6 mb-8">
                    <h1 className="font-display text-4xl md:text-5xl uppercase tracking-tighter">
                        <CryptoHover text="Posts Feed" className="text-grunge-dark" />
                    </h1>
                    <p className="font-mono text-grunge-gray mt-2">Share your thoughts with the void_</p>
                </header>

                {/* Tabs */}
                <div className="flex gap-4 mb-6">
                    <button
                        onClick={() => setActiveTab('all')}
                        className={`font-mono text-sm uppercase px-4 py-2 border-2 border-grunge-dark transition-colors ${activeTab === 'all'
                            ? 'bg-grunge-dark text-grunge-white'
                            : 'bg-grunge-white text-grunge-dark hover:bg-grunge-dark/10'
                            }`}
                    >
                        All Posts
                    </button>
                    {token && (
                        <button
                            onClick={() => setActiveTab('my')}
                            className={`font-mono text-sm uppercase px-4 py-2 border-2 border-grunge-dark transition-colors ${activeTab === 'my'
                                ? 'bg-grunge-dark text-grunge-white'
                                : 'bg-grunge-white text-grunge-dark hover:bg-grunge-dark/10'
                                }`}
                        >
                            My Posts
                        </button>
                    )}
                </div>

                {/* Alerts */}
                {error && (
                    <div className="mb-4 p-4 border-2 border-grunge-accent bg-grunge-accent/10 font-mono text-grunge-accent">
                        ⚠ {error}
                    </div>
                )}
                {success && (
                    <div className="mb-4 p-4 border-2 border-green-600 bg-green-600/10 font-mono text-green-600">
                        ✓ {success}
                    </div>
                )}

                {/* Create Post Form */}
                {token && (
                    <div className="border-4 border-grunge-dark bg-grunge-white p-4 mb-8 shadow-[4px_4px_0_#0f0f10]">
                        <div className="flex items-center gap-3 mb-4">
                            <Avatar
                                src={getAvatarUrl(currentUserAvatar) || undefined}
                                alt={currentUsername || 'You'}
                                fallback={currentUsername?.[0]?.toUpperCase() || 'U'}
                                size="sm"
                            />
                            <span className="font-mono font-bold uppercase">{currentUsername}</span>
                        </div>
                        <form onSubmit={handleCreatePost}>
                            <textarea
                                value={newPostContent}
                                onChange={(e) => setNewPostContent(e.target.value)}
                                placeholder="What's on your mind?_"
                                className="w-full min-h-[100px] p-3 border-2 border-grunge-dark font-mono text-sm resize-none focus:outline-none focus:border-grunge-accent"
                                disabled={creating}
                            />
                            <div className="flex justify-between items-center mt-3">
                                <select
                                    value={newPostVisibility}
                                    onChange={(e) => setNewPostVisibility(e.target.value as 'public' | 'private')}
                                    className="font-mono text-xs border-2 border-grunge-dark px-2 py-1 bg-grunge-white focus:outline-none"
                                >
                                    <option value="public">PUBLIC</option>
                                    <option value="private">PRIVATE</option>
                                </select>
                                <button
                                    type="submit"
                                    disabled={creating || !newPostContent.trim()}
                                    className="font-mono text-sm uppercase bg-grunge-dark text-grunge-white px-6 py-2 hover:bg-grunge-accent transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                                >
                                    {creating ? 'POSTING...' : 'POST →'}
                                </button>
                            </div>
                        </form>
                    </div>
                )}

                {/* Loading */}
                {loading && <LoadingPage />}

                {/* Posts List */}
                {!loading && posts.length === 0 && (
                    <div className="text-center py-12 border-2 border-dashed border-grunge-gray">
                        <p className="font-mono text-grunge-gray">NO_POSTS_FOUND</p>
                        <p className="font-mono text-grunge-gray text-sm mt-2">Be the first to break the silence_</p>
                    </div>
                )}

                <div className="space-y-6">
                    {posts.map((post) => (
                        <div
                            key={post.id}
                            className="border-4 border-grunge-dark bg-grunge-white shadow-[4px_4px_0_#0f0f10] overflow-hidden"
                        >
                            {/* Post Header */}
                            <div className="flex items-center justify-between p-4 border-b-2 border-grunge-dark bg-grunge-dark/5">
                                <div className="flex items-center gap-3">
                                    <Avatar
                                        src={getAvatarUrl(post.avatar_url) || undefined}
                                        alt={post.username}
                                        fallback={post.username[0]?.toUpperCase()}
                                        size="sm"
                                    />
                                    <div>
                                        <p className="font-mono font-bold">{post.username}</p>
                                        <p className="font-mono text-xs text-grunge-gray">{formatDate(post.created_at)}</p>
                                    </div>
                                </div>
                                {post.user_id === currentUserId && (
                                    <div className="flex gap-2">
                                        <button
                                            onClick={() => {
                                                setEditingPost(post.id);
                                                setEditContent(post.content);
                                            }}
                                            className="font-mono text-xs text-grunge-gray hover:text-grunge-dark"
                                        >
                                            EDIT
                                        </button>
                                        <button
                                            onClick={() => handleDeletePost(post.id)}
                                            className="font-mono text-xs text-grunge-accent hover:text-grunge-dark"
                                        >
                                            DELETE
                                        </button>
                                    </div>
                                )}
                            </div>

                            {/* Post Content */}
                            <div className="p-4">
                                {editingPost === post.id ? (
                                    <div>
                                        <textarea
                                            value={editContent}
                                            onChange={(e) => setEditContent(e.target.value)}
                                            className="w-full min-h-[80px] p-2 border-2 border-grunge-dark font-mono text-sm resize-none focus:outline-none"
                                        />
                                        <div className="flex gap-2 mt-2">
                                            <button
                                                onClick={() => handleUpdatePost(post.id)}
                                                className="font-mono text-xs bg-grunge-dark text-grunge-white px-3 py-1"
                                            >
                                                SAVE
                                            </button>
                                            <button
                                                onClick={() => {
                                                    setEditingPost(null);
                                                    setEditContent('');
                                                }}
                                                className="font-mono text-xs border border-grunge-dark px-3 py-1"
                                            >
                                                CANCEL
                                            </button>
                                        </div>
                                    </div>
                                ) : (
                                    <p className="font-mono text-sm whitespace-pre-wrap">{post.content}</p>
                                )}
                            </div>

                            {/* Post Actions */}
                            <div className="flex items-center gap-4 px-4 py-3 border-t-2 border-grunge-dark bg-grunge-dark/5">
                                <button
                                    onClick={() => post.isLiked ? handleUnlike(post.id) : handleLike(post.id)}
                                    className={`flex items-center gap-2 font-mono text-sm transition-colors ${post.isLiked
                                        ? 'text-grunge-accent'
                                        : 'text-grunge-gray hover:text-grunge-accent'
                                        }`}
                                >
                                    <span>{post.isLiked ? '❤️' : '🤍'}</span>
                                    <span>{post.like_count}</span>
                                </button>
                                <button
                                    onClick={() => toggleComments(post.id)}
                                    className="flex items-center gap-2 font-mono text-sm text-grunge-gray hover:text-grunge-dark transition-colors"
                                >
                                    <span>💬</span>
                                    <span>{post.comment_count}</span>
                                </button>
                            </div>

                            {/* Comments Section */}
                            {expandedComments === post.id && (
                                <div className="border-t-2 border-grunge-dark">
                                    {/* Comment Input */}
                                    {token && (
                                        <div className="p-3 border-b border-grunge-dark/20 flex gap-2">
                                            <input
                                                type="text"
                                                value={newComment[post.id] || ''}
                                                onChange={(e) => setNewComment(prev => ({ ...prev, [post.id]: e.target.value }))}
                                                placeholder="Add a comment..."
                                                className="flex-1 px-3 py-2 border-2 border-grunge-dark font-mono text-sm focus:outline-none focus:border-grunge-accent"
                                                onKeyPress={(e) => e.key === 'Enter' && handleAddComment(post.id)}
                                            />
                                            <button
                                                onClick={() => handleAddComment(post.id)}
                                                className="font-mono text-xs bg-grunge-dark text-grunge-white px-4 py-2 hover:bg-grunge-accent transition-colors"
                                            >
                                                SEND
                                            </button>
                                        </div>
                                    )}

                                    {/* Comments List */}
                                    <div className="max-h-[300px] overflow-y-auto">
                                        {loadingComments === post.id ? (
                                            <p className="p-4 font-mono text-xs text-grunge-gray animate-pulse">LOADING_COMMENTS...</p>
                                        ) : comments[post.id]?.length === 0 ? (
                                            <p className="p-4 font-mono text-xs text-grunge-gray">No comments yet_</p>
                                        ) : (
                                            comments[post.id]?.map((comment) => (
                                                <div key={comment.id} className="p-3 border-b border-grunge-dark/10 last:border-0">
                                                    <div className="flex items-start justify-between gap-2">
                                                        <div className="flex items-center gap-2">
                                                            <Avatar
                                                                src={getAvatarUrl(comment.avatar_url) || undefined}
                                                                alt={comment.username}
                                                                fallback={comment.username[0]?.toUpperCase()}
                                                                size="sm"
                                                            />
                                                            <span className="font-mono text-xs font-bold">{comment.username}</span>
                                                            <span className="font-mono text-xs text-grunge-gray">
                                                                {formatDate(comment.created_at)}
                                                            </span>
                                                        </div>
                                                        {comment.user_id === currentUserId && (
                                                            <button
                                                                onClick={() => handleDeleteComment(comment.id, post.id)}
                                                                className="font-mono text-xs text-grunge-accent hover:underline"
                                                            >
                                                                ×
                                                            </button>
                                                        )}
                                                    </div>
                                                    <p className="font-mono text-sm mt-1 ml-10">{comment.content}</p>
                                                </div>
                                            ))
                                        )}
                                    </div>
                                </div>
                            )}
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
};

export default PostsPage;
