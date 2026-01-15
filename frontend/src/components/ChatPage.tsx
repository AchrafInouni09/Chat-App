import React, { useEffect, useState, useRef } from 'react';
import Nav from './ui/Nav';
import Avatar from './ui/Avatar';
import Button from './ui/Button';
import Input from './ui/Input';
import SideFriendReq from './ui/SideFriendReq';
import ChatMessage from './ui/ChatMessage';
import Cookies from 'js-cookie';
import { io } from "socket.io-client";

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
    const [conversations, setConversations] = useState<Conversation[]>([]);
    const [publicRooms, setPublicRooms] = useState<Conversation[]>([]);
    const [activeConvId, setActiveConvId] = useState<number | null>(null);
    const [messages, setMessages] = useState<Message[]>([]);
    const [inputText, setInputText] = useState("");
    const [activeTab, setActiveTab] = useState<'my_chats' | 'rooms'>('my_chats');
    const [newRoomName, setNewRoomName] = useState("");
    const socketRef = useRef<any>(null);
    const messagesEndRef = useRef<HTMLDivElement>(null);

    const token = Cookies.get('token');
    const currentUsername = Cookies.get('username');

    // 1. Initial Data Fetch
    useEffect(() => {
        fetchConversations();
        fetchPublicRooms();

        // Socket Setup
        socketRef.current = io("http://localhost:3000", {
            auth: { token },
            transports: ["websocket"]
        });

        socketRef.current.on("connect", () => console.log("Socket connected"));
        
        socketRef.current.on("message:new", (msg: any) => {
            if (activeConvId && msg.conversation_id === activeConvId) {
                setMessages(prev => [...prev, msg]);
                scrollToBottom();
            }
        });

        return () => {
            socketRef.current?.disconnect();
        };
    }, []);

    // 2. Fetch Messages when active conversation changes
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
    }, [activeConvId]);

    const scrollToBottom = () => messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });

    const fetchConversations = async () => {
        const res = await fetch('http://localhost:3000/api/chat/conversations', {
            headers: { 'Authorization': `Bearer ${token}` }
        });
        const data = await res.json();
        setConversations(data.conversations || []);
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
        <div className="min-h-screen bg-grunge-white font-mono flex flex-col">
            <Nav />

            <div className="flex-1 flex max-w-7xl mx-auto w-full p-4 md:p-8 gap-6 h-[calc(100vh-100px)]">
                {/* Sidebar */}
                <div className="w-80 bg-grunge-white border-4 border-grunge-dark shadow-[8px_8px_0_#0f0f10] hidden md:flex flex-col overflow-hidden">
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
                            conversations.map(conv => (
                                <div key={conv.id} onClick={() => setActiveConvId(conv.id)}>
                                    <SideFriendReq
                                        name={conv.name || "Unknown"}
                                        message={conv.type === 'group' ? 'Public Room' : 'Direct Message'}
                                        avatarFallback={conv.name?.[0]?.toUpperCase() || "?"}
                                        statusColor={activeConvId === conv.id ? "bg-grunge-accent" : "bg-grunge-green"}
                                        isActive={activeConvId === conv.id}
                                    />
                                </div>
                            ))
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
                    <div className="flex-1 overflow-y-auto p-4 space-y-6 bg-noise bg-opacity-5">
                        {messages.map((msg, idx) => (
                             <ChatMessage
                                key={idx}
                                sender={msg.sender_username}
                                time={new Date(msg.created_at).toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'})}
                                message={msg.content}
                                avatarFallback={msg.sender_username[0]?.toUpperCase()}
                                avatarSrc={msg.avatar_url || undefined}
                                isOwn={msg.isOwn} 
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
