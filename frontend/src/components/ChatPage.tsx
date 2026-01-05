import React from 'react';
import Nav from './ui/Nav';
import Avatar from './ui/Avatar';
import Button from './ui/Button';
import Input from './ui/Input';
import SideFriendReq from './ui/SideFriendReq';
import ChatMessage from './ui/ChatMessage';

const ChatPage = () => {

    return (
        <div className="min-h-screen bg-grunge-white font-mono flex flex-col">
            <Nav />

            <div className="flex-1 flex max-w-7xl mx-auto w-full p-4 md:p-8 gap-6 h-[calc(100vh-100px)]">
                {/* friends li f jnab*/}
                <div className="w-80 bg-grunge-white border-4 border-grunge-dark shadow-[8px_8px_0_#0f0f10] hidden md:flex flex-col overflow-hidden">
                    <div className="p-4 border-b-2 border-grunge-dark bg-grunge-dark text-grunge-white flex justify-between items-center">
                        <span className="font-bold uppercase tracking-widest">Encrypted_Channels</span>
                        <div className="w-2 h-2 rounded-full bg-grunge-accent animate-pulse"></div>
                    </div>

                    <div className="flex-1 overflow-y-auto p-2 space-y-2">
                        <SideFriendReq
                            name="Ghost_01"
                            message="Did you receive the payload?"
                            avatarFallback="GH"
                            statusColor="bg-grunge-green"
                            isActive={true}
                        />

                        <SideFriendReq
                            name="Viper_X"
                            message="[ENCRYPTED FILE ATTACHED]"
                            avatarFallback="VX"
                            statusColor="bg-gray-400"
                        />

                        <SideFriendReq
                            name="System_Admin"
                            message="Server maintenance detailed..."
                            avatarFallback="SA"
                            statusColor="bg-grunge-green"
                        />

                        <SideFriendReq
                            name="Neon_Rat"
                            message="Can you decrypt this?"
                            avatarFallback="NR"
                            statusColor="bg-grunge-accent"
                        />
                    </div>

                    <div className="p-4 border-t-2 border-grunge-dark bg-grunge-white text-xs text-center text-grunge-gray uppercase">
                        System_Link_Est: 93%
                    </div>
                </div>
                <div className="flex-1 bg-grunge-white border-4 border-grunge-dark shadow-[8px_8px_0_#0f0f10] flex flex-col overflow-hidden relative">
                    <div className="p-4 border-b-2 border-grunge-dark flex justify-between items-center bg-grunge-white z-10">
                        <div className="flex items-center gap-3">
                            <Avatar
                                src={undefined}
                                alt="Ghost_01"
                                fallback="GH"
                                size="sm"
                                className="bg-grunge-dark text-grunge-white"
                            />
                            <div>
                                <h2 className="font-bold text-lg uppercase leading-none">Ghost_01</h2>
                                <span className="text-xs text-grunge-accent font-bold tracking-wider">[SECURE_CONNECTION]</span>
                            </div>
                        </div>
                    </div>

                    {/* Messages */}
                    <div className="flex-1 overflow-y-auto p-4 space-y-6 bg-noise bg-opacity-5">
                        <ChatMessage
                            sender="Ghost_01"
                            time="10:23"
                            message="Did you receive the payload? The key is rotting."
                            avatarFallback="GH"
                        />

                        <ChatMessage
                            sender="You"
                            time="10:24"
                            message="Affirmative. Decryption in progress..."
                            avatarFallback="YO"
                            isOwn={true}
                        />

                        <div className="w-full text-center my-2">
                            <span className="font-mono text-xs text-grunge-gray border border-grunge-gray px-2 py-1 bg-grunge-white">
                                &gt; RUNNING_ALGORITHM_AES256...
                            </span>
                        </div>

                        {/* <ChatMessage
                            sender="Ghost_01"
                            time="10:25"
                            message="WARNING: SIGNAL_INTERCEPTED"
                            avatarFallback="GH"
                            bubbleClassName="animate-pulse text-grunge-accent border-grunge-accent"// ta n9adha
                        /> */}
                    </div>

                    {/* hadi input area */}
                    <div className="p-4 border-t-2 border-grunge-dark bg-grunge-white">
                        <div className="flex gap-2">
                            <Input
                                label={undefined}
                                error={undefined}
                                placeholder="Type encrypted message..."
                                className="flex-1"
                            />
                            <Button className="px-6 flex items-center justify-center">
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
