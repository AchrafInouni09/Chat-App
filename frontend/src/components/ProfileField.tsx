// src/components/ui/ProfileField.tsx
import React, { useState, useRef, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import Avatar from './ui/Avatar';
import Input from './ui/Input';
import Textarea from './ui/Textarea';
import Button from './ui/Button';
import CryptoHover from './ui/CryptoHover';
import Nav from './ui/Nav';
import { get_ProfileData, update_ProfileData, delete_Profile } from '../lib/utils';
import Cookies from 'js-cookie';


interface ProfileFieldProps {
    defaultAvatar?: string;
    defaultFirstName?: string;
    defaultLastName?: string;
    defaultUsername?: string;
    defaultBio?: string;
    onSave?: (data: { avatar: string | null; firstName: string; lastName: string; username: string; bio: string }) => void;
    className?: string;
}

const ProfileField = ({
    defaultAvatar = '',
    defaultFirstName = '',
    defaultLastName = '',
    defaultUsername = '',
    defaultBio = '',
    onSave,
    className = ''
}: ProfileFieldProps) => {
    const navigate = useNavigate();
    const [avatar, setAvatar] = useState<string | null>(defaultAvatar);
    const [firstName, setFirstName] = useState(defaultFirstName);
    const [lastName, setLastName] = useState(defaultLastName);
    const [username, setUsername] = useState(defaultUsername);
    const [bio, setBio] = useState(defaultBio);
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [successMessage, setSuccessMessage] = useState<string | null>(null);
    //test data li khasani 
    useEffect(() => {
        const fetchData = async () => {
            const userData = await get_ProfileData();
            if (userData) {
                // console.log(userData);
                setFirstName(userData.user.first_name || '');
                setLastName(userData.user.last_name || '');
                setUsername(userData.user.username || '');
                setBio(userData.user.bio || '');
                setAvatar(userData.user.avatar_url || null);
            }
        };
        fetchData();
    }, []);


    const fileInputRef = useRef<HTMLInputElement>(null);

    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (file) {
            const reader = new FileReader();
            reader.onloadend = () => {
                setAvatar(reader.result as string);
            };
            reader.readAsDataURL(file);
        }
    };
    const handleAvatarClick = () => {
        fileInputRef.current?.click();
    };

    const handleSave = async () => {
        setIsLoading(true);
        setError(null);
        setSuccessMessage(null);

        const result = await update_ProfileData({
            avatar,
            firstName,
            lastName,
            username,
            bio
        });

        setIsLoading(false);

        if (result.success) {
            setSuccessMessage('Profile updated successfully!');
            if (onSave) {
                onSave({ avatar, firstName, lastName, username, bio });
            }
            setTimeout(() => setSuccessMessage(null), 3000);
        } else {
            setError(result.error || 'Failed to update profile');
        }
    };

    const handleDelete = async () => {
        if (window.confirm('Are you sure you want to delete your profile? This action cannot be undone.')) {
            const result = await delete_Profile();
            if (result.success) {
                Cookies.remove("token");
                navigate("/login");
            }
        }
    };


    return (
        <div className="min-h-screen flex flex-col">
            <Nav />
            <div className={`flex-grow flex items-center justify-center p-4 md:p-8 ${className}`}>
                <div className="w-full max-w-4xl group/card">
                    <div className="relative isolate">
                        <div className="absolute inset-0 bg-grunge-dark translate-x-3 translate-y-3 -z-20 transition-transform duration-300 group-hover/card:translate-x-2 group-hover/card:translate-y-2"></div>

                        <div className="relative bg-grunge-white border-2 border-grunge-dark overflow-hidden">

                            <div className="absolute inset-0 z-0 opacity-5 pointer-events-none"
                                style={{ backgroundImage: 'radial-gradient(#0f0f10 1px, transparent 1px)', backgroundSize: '24px 24px' }}>
                            </div>

                            <div className="h-2 bg-grunge-dark w-full relative z-10">
                                <div className="absolute top-0 right-0 h-full w-1/3 bg-grunge-accent"></div>
                            </div>
                            <div className="p-6 md:p-12 relative z-10">
                                <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-12 border-b-2 border-grunge-dark pb-6">
                                    <div>
                                        <h2 className="font-display text-5xl md:text-6xl text-grunge-dark uppercase leading-none tracking-tighter">
                                            <CryptoHover text="Edit" />
                                            <br />
                                            <CryptoHover text="Profile" className="text-transparent stroke-text decoration-grunge-accent underline decoration-4 underline-offset-4" />
                                        </h2>
                                    </div>
                                    <div className="font-mono text-xs md:text-right hidden md:block">
                                        <p className="text-grunge-gray">SYS.CONFIG.USER_01</p>
                                        <p className="text-grunge-accent font-bold">MODE: EDITABLE</p>
                                    </div>
                                </div>
                                <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12">
                                    <div className="lg:col-span-4 flex flex-col gap-6">
                                        <div className="relative group cursor-pointer" onClick={handleAvatarClick}>
                                            <div className="relative aspect-square w-full max-w-[240px] mx-auto lg:mx-0 border-2 border-dashed border-grunge-dark/40 group-hover:border-grunge-accent transition-colors p-2 bg-white/50">
                                                <div className="relative w-full h-full border border-grunge-dark overflow-hidden bg-grunge-white">
                                                    <Avatar
                                                        src={avatar || undefined}
                                                        alt="Profile"
                                                        fallback={username.charAt(0).toUpperCase() || "?"}
                                                        size="lg" // Ensure this maps to a large enough size or consider inline style if component limits it 
                                                        className="w-full h-full !text-4xl"
                                                    />
                                                    <div className="absolute inset-0 bg-grunge-dark/90 opacity-0 group-hover:opacity-100 transition-opacity duration-200 flex flex-col items-center justify-center gap-2">
                                                        <svg className="w-8 h-8 text-grunge-accent animate-bounce" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-8l-4-4m0 0L8 8m4-4v12" />
                                                        </svg>
                                                        <span className="font-mono text-grunge-white text-xs uppercase tracking-widest">Upload Img</span>
                                                    </div>
                                                </div>
                                                <div className="absolute -top-1 -left-1 w-3 h-3 bg-grunge-dark"></div>
                                                <div className="absolute -bottom-1 -right-1 w-3 h-3 bg-grunge-dark"></div>
                                            </div>
                                        </div>
                                        <div className="text-center lg:text-left">
                                            <div className="inline-block border border-grunge-dark px-2 py-1 bg-grunge-white">
                                                <p className="font-mono text-[10px] uppercase text-grunge-gray leading-none">
                                                    ID_REF: <span className="text-grunge-dark font-bold">{Math.random().toString(36).substr(2, 6).toUpperCase()}</span>
                                                </p>
                                            </div>
                                            <input
                                                ref={fileInputRef}
                                                type="file"
                                                accept="image/*"
                                                onChange={handleFileChange}
                                                className="hidden"
                                            />
                                        </div>
                                    </div>
                                    <div className="lg:col-span-8 flex flex-col gap-6">
                                        <div className="space-y-6">
                                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                                                <div className="relative">
                                                    <div className="absolute -left-3 top-0 bottom-0 w-1 bg-grunge-dark/10 hidden lg:block"></div>
                                                    <Input
                                                        label="First Name"
                                                        value={firstName}
                                                        onChange={(e: React.ChangeEvent<HTMLInputElement>) => setFirstName(e.target.value)}
                                                        placeholder="e.g. Thomas"
                                                        error={null}
                                                    />
                                                </div>
                                                <div className="relative">
                                                    <Input
                                                        label="Last Name"
                                                        value={lastName}
                                                        onChange={(e: React.ChangeEvent<HTMLInputElement>) => setLastName(e.target.value)}
                                                        placeholder="e.g. Anderson"
                                                        error={null}
                                                    />
                                                </div>
                                            </div>
                                            <div className="relative">
                                                <div className="absolute -left-3 top-0 bottom-0 w-1 bg-grunge-dark/10 hidden lg:block"></div>
                                                <Input
                                                    label="Display Name"
                                                    value={username}
                                                    onChange={(e: React.ChangeEvent<HTMLInputElement>) => setUsername(e.target.value)}
                                                    placeholder="e.g. Neo Anderson"
                                                    error={null}
                                                />
                                            </div>
                                            <div className="relative">
                                                <div className="absolute -left-3 top-0 bottom-0 w-1 bg-grunge-dark/10 hidden lg:block"></div>
                                                <Textarea
                                                    label="User Bio"
                                                    value={bio}
                                                    onChange={(e: React.ChangeEvent<HTMLTextAreaElement>) => setBio(e.target.value)}
                                                    placeholder="Transmission content..."
                                                    className="min-h-[160px]"
                                                    error={null}
                                                />
                                            </div>
                                        </div>
                                        {error && (
                                            <div className="text-red-600 font-mono text-xs border-2 border-red-600 bg-red-50 p-3">
                                                ⚠ {error}
                                            </div>
                                        )}
                                        {successMessage && (
                                            <div className="text-green-600 font-mono text-xs border-2 border-green-600 bg-green-50 p-3">
                                                ✓ {successMessage}
                                            </div>
                                        )}
                                        <div className="mt-8 pt-8 border-t-2 border-grunge-dark/20 flex flex-col sm:flex-row gap-4 items-center justify-between">
                                            <p className="hidden sm:block font-mono text-xs text-grunge-gray">
                                                * CHANGES WILL REWRITE LOCAL STORAGE
                                            </p>
                                            <div className="flex w-full sm:w-auto gap-4">
                                                <Button
                                                    onClick={handleDelete}
                                                    className="flex-1 sm:flex-none px-8 bg-red-600 hover:bg-red-700 text-white border-red-800 hover:border-red-900 hover:text-white hover:shadow-[4px_4px_0_#991b1b]"
                                                >
                                                    Delete Profile
                                                </Button>
                                                <Button
                                                    variant="primary"
                                                    onClick={handleSave}
                                                    className="flex-1 sm:flex-none px-8 bg-emerald-600 hover:bg-emerald-700 text-white border-emerald-800 hover:border-emerald-900 hover:shadow-[4px_4px_0_#064e3b]"
                                                    disabled={isLoading}
                                                >
                                                    {isLoading ? 'Saving...' : 'Save Data'}
                                                </Button>
                                            </div>
                                        </div>
                                    </div>

                                </div>
                            </div>
                            <div className="bg-grunge-dark text-grunge-white p-2 flex justify-between items-center font-mono text-[10px] uppercase">
                                <span>V.2.0.4</span>
                                <span>SECURE_CONNECTION</span>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default ProfileField;
