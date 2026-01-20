import { useEffect, useState, useRef } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import Nav from './ui/Nav';
import Avatar from './ui/Avatar';
import Button from './ui/Button';
import Input from './ui/Input';
import SideFriendReq from './ui/SideFriendReq';
import ChatMessage from './ui/ChatMessage';
import LoadingPage from './ui/LoadingPage';
import Cookies from 'js-cookie';
import { io } from "socket.io-client";
import { jwtDecode } from 'jwt-decode';

interface JwtPayload {
    id: number;
    username: string;
    role: string;
}

interface Conversation {
    id: number;
    name: string;
    type: 'direct' | 'group';
}

interface Message {
    id: number;
    sender_username: string;
    content: string;
    created_at: string;
    avatar_url?: string;
    isOwn?: boolean;
}

const ChatPage = () => {
    const location = useLocation();
    const navigate = useNavigate();
    const [conversations, setConversations] = useState<Conversation[]>([]);
    const [publicRooms, setPublicRooms] = useState<Conversation[]>([]);
    const [activeConvId, setActiveConvId] = useState<number | null>(
        (location.state as any)?.activeConvId || null
    );
    const [messages, setMessages] = useState<Message[]>([]);
    const [inputText, setInputText] = useState("");
    const [activeTab, setActiveTab] = useState<'my_chats' | 'rooms'>('my_chats');
    const [newRoomName, setNewRoomName] = useState("");
    const [newDmUsername, setNewDmUsername] = useState("");
    const [dmError, setDmError] = useState("");
    const [loading, setLoading] = useState(true);
    const socketRef = useRef<any>(null);
    const messagesEndRef = useRef<HTMLDivElement>(null);

    const token = Cookies.get('token');

    // Get username from JWT token for reliable comparison
    const getCurrentUsername = (): string => {
        if (!token) return '';
        try {
            const decoded = jwtDecode<JwtPayload>(token);
            return decoded.username || '';
        } catch {
            return Cookies.get('username') || '';
        }
    };

    const currentUsername = getCurrentUsername();

    // 1. Initial Data Fetch & Socket Setup
    useEffect(() => {
        const initChat = async () => {
            setLoading(true);
            const [convs] = await Promise.all([fetchConversations(), fetchPublicRooms()]);

            // Auto-select first conversation if none selected via navigation state
            if (!activeConvId && convs && convs.length > 0) {
                setActiveConvId(convs[0].id);
            }

            await new Promise(resolve => setTimeout(resolve, 500));
            setLoading(false);
        };
        initChat();

        // Socket Setup
        socketRef.current = io("http://localhost:3000", {
            auth: { token },
            transports: ["websocket"]
        });

        socketRef.current.on("connect", () => console.log("Socket connected"));
        socketRef.current.on("connect_error", (err: Error) => console.error("Socket error:", err.message));

        return () => {
            socketRef.current?.disconnect();
        };
    }, []);

    // 2. Handle message:new event separately to avoid stale closure
    useEffect(() => {
        if (!socketRef.current) return;

        const handleNewMessage = (msg: any) => {
            if (activeConvId && msg.conversation_id === activeConvId) {
                const formattedMsg = {
                    ...msg,
                    avatar_url: msg.avatar_url ? `http://localhost:3000/${msg.avatar_url}` : null,
                    isOwn: msg.sender_username === currentUsername
                };
                setMessages(prev => [...prev, formattedMsg]);
                scrollToBottom();
            }
        };

        socketRef.current.on("message:new", handleNewMessage);

        return () => {
            socketRef.current?.off("message:new", handleNewMessage);
        };
    }, [activeConvId, currentUsername]);

    // 3. Fetch Messages when active conversation changes
    useEffect(() => {
        if (!activeConvId) return;

        // Join socket room
        socketRef.current?.emit("conversation:join", { conversationId: activeConvId });

        fetch(`http://localhost:3000/api/chat/conversations/${activeConvId}/messages`, {
            headers: { 'Authorization': `Bearer ${token}` }
        })
            .then(res => res.json())
            .then(data => {
                const messagesWithAvatar = (data.messages || []).map((msg: any) => ({
                    ...msg,
                    avatar_url: msg.avatar_url ? `http://localhost:3000/${msg.avatar_url}` : null,
                    isOwn: msg.sender_username === currentUsername
                }));
                setMessages(messagesWithAvatar);
                scrollToBottom();
            });
    }, [activeConvId, currentUsername]);

    // 4. Auto-scroll to bottom whenever messages change
    useEffect(() => {
        scrollToBottom();
    }, [messages]);

    const scrollToBottom = () => messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });

    const fetchConversations = async () => {
        const res = await fetch('http://localhost:3000/api/chat/conversations', {
            headers: { 'Authorization': `Bearer ${token}` }
        });
        const data = await res.json();
        const convs = data.conversations || [];
        setConversations(convs);
        return convs;
    };

    const fetchPublicRooms = async () => {
        const res = await fetch('http://localhost:3000/api/chat/groups', {
            headers: { 'Authorization': `Bearer ${token}` }
        });
        const data = await res.json();
        setPublicRooms(data.groups || []);
    };

    const createRoom = async () => {
        if (!newRoomName) return;
        try {
            const res = await fetch('http://localhost:3000/api/chat/groups', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${token}` },
                body: JSON.stringify({ name: newRoomName })
            });
            const data = await res.json();
            if (res.ok) {
                setNewRoomName("");
                fetchPublicRooms();
                fetchConversations();
                setActiveConvId(data.group.id);
                setActiveTab('my_chats');
            }
        } catch (err) {
            console.error(err);
        }
    };

    const joinRoom = async (roomId: number) => {
        try {
            await fetch(`http://localhost:3000/api/chat/groups/${roomId}/join`, {
                method: 'POST',
                headers: { 'Authorization': `Bearer ${token}` }
            });
            fetchConversations();
            setActiveConvId(roomId);
            setActiveTab('my_chats');
        } catch (err) {
            console.error(err);
        }
    };

    const startDirectMessage = async () => {
        if (!newDmUsername.trim()) return;
        setDmError("");
        try {
            const res = await fetch('http://localhost:3000/api/chat/conversation/direct', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`
                },
                body: JSON.stringify({ username: newDmUsername.trim() })
            });
            const data = await res.json();
            if (res.ok) {
                setNewDmUsername("");
                fetchConversations();
                setActiveConvId(data.conversation.id);
            } else {
                setDmError(data.message || "Failed to start conversation");
            }
        } catch (err) {
            setDmError("Network error");
            console.error(err);
        }
    };

    const sendMessage = () => {
        if (!inputText || !activeConvId) return;

        socketRef.current?.emit("message:send", {
            conversationId: activeConvId,
            content: inputText
        });
        setInputText("");
    };

    const activeConversation = conversations.find(c => c.id === activeConvId);

    return (
        <div className="h-screen bg-grunge-white font-mono flex flex-col overflow-hidden">
            {loading && <LoadingPage />}
            <Nav />

            <div className="flex-1 flex max-w-7xl mx-auto w-full p-4 md:p-8 gap-6 min-h-0">
                {/* Sidebar */}
                <div className="w-80 bg-grunge-white border-4 border-grunge-dark shadow-[8px_8px_0_#0f0f10] hidden md:flex flex-col overflow-hidden">
                    {/* Friends Link */}
                    <button
                        onClick={() => navigate('/friends')}
                        className="w-full p-3 text-xs font-bold uppercase bg-grunge-accent text-white hover:bg-grunge-dark transition-colors border-b-2 border-grunge-dark"
                    >
                        👥 My Friends
                    </button>

                    {/* Sidebar Tabs */}
                    <div className="flex border-b-2 border-grunge-dark">
                        <button
                            onClick={() => setActiveTab('my_chats')}
                            className={`flex-1 p-3 text-xs font-bold uppercase hover:bg-grunge-dark hover:text-white transition-colors ${activeTab === 'my_chats' ? 'bg-grunge-dark text-white' : ''}`}
                        >
                            My Chats
                        </button>
                        <button
                            onClick={() => setActiveTab('rooms')}
                            className={`flex-1 p-3 text-xs font-bold uppercase hover:bg-grunge-dark hover:text-white transition-colors ${activeTab === 'rooms' ? 'bg-grunge-dark text-white' : ''}`}
                        >
                            Discover
                        </button>
                    </div>

                    <div className="flex-1 overflow-y-auto p-2 space-y-2">
                        {activeTab === 'my_chats' ? (
                            <>
                                {/* Start New DM */}
                                <div className="p-2 border-b-2 border-grunge-dark bg-grunge-gray/10 mb-2">
                                    <h4 className="text-xs font-bold mb-2 uppercase">New Direct Message</h4>
                                    <div className="flex gap-2">
                                        <input
                                            value={newDmUsername}
                                            onChange={e => { setNewDmUsername(e.target.value); setDmError(""); }}
                                            onKeyDown={e => e.key === 'Enter' && startDirectMessage()}
                                            placeholder="USERNAME"
                                            className="w-full text-xs p-1 border border-grunge-dark bg-transparent"
                                        />
                                        <button onClick={startDirectMessage} className="text-xs bg-grunge-dark text-white px-2 uppercase">→</button>
                                    </div>
                                    {dmError && <p className="text-[10px] text-grunge-accent mt-1">{dmError}</p>}
                                </div>
                                {/* Conversations List */}
                                {conversations.map(conv => (
                                    <div key={conv.id} onClick={() => setActiveConvId(conv.id)}>
                                        <SideFriendReq
                                            name={conv.name || "Unknown"}
                                            message={conv.type === 'group' ? '🌐 Public Room' : '👤 Direct Message'}
                                            avatarFallback={conv.name?.[0]?.toUpperCase() || "?"}//ila 9dty trj3 avatar
                                            statusColor={activeConvId === conv.id ? "bg-grunge-accent" : "bg-grunge-green"}
                                            isActive={activeConvId === conv.id}
                                        />
                                    </div>
                                ))}
                                {conversations.length === 0 && (
                                    <p className="text-xs text-grunge-gray text-center py-4">No conversations yet</p>
                                )}
                            </>
                        ) : (
                            <div className="space-y-4">
                                <div className="p-2 border-b-2 border-grunge-dark bg-grunge-gray/10">
                                    <h4 className="text-xs font-bold mb-2 uppercase">Create New Room</h4>
                                    <div className="flex gap-2">
                                        <input
                                            value={newRoomName}
                                            onChange={e => setNewRoomName(e.target.value)}
                                            placeholder="ROOM_NAME"
                                            className="w-full text-xs p-1 border border-grunge-dark bg-transparent"
                                        />
                                        <button onClick={createRoom} className="text-xs bg-grunge-dark text-white px-2 uppercase">+</button>
                                    </div>
                                </div>
                                {publicRooms.map(room => (
                                    <div key={room.id} className="flex items-center justify-between p-2 border border-grunge-dark hover:bg-grunge-gray/5">
                                        <span className="font-bold text-sm">#{room.name}</span>
                                        <button
                                            onClick={() => joinRoom(room.id)}
                                            className="text-[10px] bg-grunge-accent text-white px-2 py-1 uppercase font-bold border border-grunge-dark hover:shadow-[2px_2px_0_black]"
                                        >
                                            Connect
                                        </button>
                                    </div>
                                ))}
                            </div>
                        )}
                    </div>
                </div>

                {/* Chat Area */}
                <div className="flex-1 bg-grunge-white border-4 border-grunge-dark shadow-[8px_8px_0_#0f0f10] flex flex-col overflow-hidden relative">
                    <div className="p-4 border-b-2 border-grunge-dark flex justify-between items-center bg-grunge-white z-10">
                        <div className="flex items-center gap-3">
                            <Avatar
                                src={undefined}
                                alt={activeConversation?.name || "Select Chat"}
                                fallback={activeConversation?.name?.[0] || "#"}
                                size="sm"
                                className="bg-grunge-dark text-grunge-white"
                            />
                            <div>
                                <h2 className="font-bold text-lg uppercase leading-none">{activeConversation?.name || "NO_SIGNAL"}</h2>
                                <span className="text-xs text-grunge-accent font-bold tracking-wider">
                                    {activeConversation ? "[SECURE_CONNECTION]" : "[WAITING_FOR_INPUT]"}
                                </span>
                            </div>
                        </div>
                    </div>

                    {/* Messages */}
                    <div className="flex-1 overflow-y-auto p-4 space-y-6 bg-noise bg-opacity-5 min-h-0">
                        {messages.map((msg, idx) => (
                            <ChatMessage
                                key={idx}
                                sender={msg.sender_username}
                                time={new Date(msg.created_at).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                                message={msg.content}
                                avatarFallback={msg.sender_username[0]?.toUpperCase()}
                                avatarSrc={msg.avatar_url || undefined}
                                isOwn={msg.isOwn}
                                isLast={idx === messages.length - 1}
                            />
                        ))}
                        <div ref={messagesEndRef} />
                    </div>

                    {/* Input Area */}
                    <div className="p-4 border-t-2 border-grunge-dark bg-grunge-white">
                        <div className="flex gap-2">
                            <Input
                                value={inputText}
                                onChange={(e: any) => setInputText(e.target.value)}
                                label={undefined}
                                error={undefined}
                                placeholder="Type encrypted message..."
                                className="flex-1"
                                onKeyDown={(e: any) => e.key === 'Enter' && sendMessage()}
                            />
                            <Button onClick={sendMessage} className="px-6 flex items-center justify-center">
                                SEND
                            </Button>
                        </div>
                    </div>

                    {/* Overlay Scanlines */}
                    <div className="absolute inset-0 pointer-events-none bg-[linear-gradient(rgba(18,16,16,0)_50%,rgba(0,0,0,0.02)_50%),linear-gradient(90deg,rgba(255,0,0,0.03),rgba(0,255,0,0.01),rgba(0,0,255,0.03))] bg-[length:100%_4px,3px_100%] z-0"></div>
                </div>
            </div>
        </div>
    );
};

export default ChatPage;
