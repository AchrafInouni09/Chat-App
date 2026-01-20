import React, { useState, useRef } from 'react';
import { useForm } from 'react-hook-form'
import { useNavigate } from 'react-router-dom';
import Cookies from 'js-cookie';


interface RegistrationData {
    firstname: string;
    lastname: string;
    username: string;
    email: string;
    password: string;
    confirmPassword: string;
}


const AuthForm = () => {

    const [isLogin, setIsLogin] = useState(true);
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [avatarFile, setAvatarFile] = useState<File | null>(null);
    const [avatarPreview, setAvatarPreview] = useState<string | null>(null);
    const fileInputRef = useRef<HTMLInputElement>(null);

    const { register, handleSubmit } = useForm<RegistrationData>()
    const [error, setError] = useState<string | null>(null);
    const navigate = useNavigate();

    const handleAvatarChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (file) {
            setAvatarFile(file);
            const reader = new FileReader();
            reader.onloadend = () => {
                setAvatarPreview(reader.result as string);
            };
            reader.readAsDataURL(file);
        }
    };

    const onSubmit = async (data: RegistrationData) => {
        if (isSubmitting) return;
        setIsSubmitting(true);
        setError(null);

        try {
            let response;

            if (!isLogin) {
                const formData = new FormData();
                formData.append('firstname', data.firstname || '');
                formData.append('lastname', data.lastname || '');
                formData.append('username', data.username);
                formData.append('email', data.email || '');
                formData.append('password', data.password);
                formData.append('role', 'user');

                if (avatarFile) {
                    formData.append('avatar', avatarFile);
                }

                response = await fetch("http://localhost:3000/api/auth/register", {
                    method: "POST",
                    body: formData,
                });
            }
            else {
                response = await fetch("http://localhost:3000/api/auth/login", {
                    method: "POST",
                    body: JSON.stringify({
                        username: data.username,
                        password: data.password,
                    }),
                    headers: {
                        "Content-Type": "application/json",
                    },
                });
            }

            if (!response || !response.ok) {
                console.log("error");
                const errData = await response?.json().catch(() => ({}));
                setError(errData?.message || "User not found");
                return;
            }
            const res = await response.json();
            Cookies.set("token", res.token);
            Cookies.set("username", data.username);
            navigate("/profile");
        } finally {
            setIsSubmitting(false);
        }
    }

    return (
        <div className="bg-grunge-white border-2 border-grunge-dark p-8 flex flex-col gap-6 shadow-[8px_8px_0_#0f0f10] relative z-10 w-full">
            <div className="flex gap-4 border-b-2 border-grunge-dark pb-2 mb-2">
                <button
                    className={`bg-transparent border-none font-mono font-bold text-base cursor-pointer transition-all ${isLogin ? 'opacity-100 underline text-grunge-accent' : 'opacity-50 hover:opacity-100 text-grunge-dark'}`}
                    onClick={() => {
                        setIsLogin(true);
                        setError(null);
                    }}
                >
                    LOGIN
                </button>
                <span className="text-grunge-gray">/</span>
                <button
                    className={`bg-transparent border-none font-mono font-bold text-base cursor-pointer transition-all ${!isLogin ? 'opacity-100 underline text-grunge-accent' : 'opacity-50 hover:opacity-100 text-grunge-dark'}`}
                    onClick={() => {
                        setIsLogin(false);
                        setError(null);
                    }}
                >
                    REGISTER
                </button>
            </div>

            <div className="flex flex-col gap-4">
                {error && (
                    <div className="text-red-600 font-mono text-xs border-2 border-red-600 bg-red-50 p-3">
                        ⚠ {error}
                    </div>
                )}
                <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-4">
                    {!isLogin && (
                        <>
                            {/* Avatar Upload */}
                            <div className="flex flex-col items-center gap-2">
                                <label className="uppercase font-bold text-grunge-gray text-xs block mb-1">
                                    Avatar_Image
                                </label>
                                <div
                                    onClick={() => fileInputRef.current?.click()}
                                    className="w-24 h-24 border-2 border-dashed border-grunge-dark flex items-center justify-center cursor-pointer hover:border-grunge-accent hover:bg-grunge-dark/5 transition-all overflow-hidden"
                                >
                                    {avatarPreview ? (
                                        <img src={avatarPreview} alt="Preview" className="w-full h-full object-cover" />
                                    ) : (
                                        <span className="text-grunge-gray text-xs text-center px-2">Click to upload</span>
                                    )}
                                </div>
                                <input
                                    type="file"
                                    ref={fileInputRef}
                                    onChange={handleAvatarChange}
                                    accept="image/*"
                                    className="hidden"
                                />
                            </div>

                            <div>
                                <label className="uppercase font-bold text-grunge-gray text-xs block mb-1">
                                    First Name
                                </label>
                                <input
                                    type="text"
                                    {...register('firstname')}
                                    className="w-full bg-transparent border-2 border-grunge-dark p-3 font-mono text-base text-grunge-dark outline-none focus:bg-grunge-dark focus:text-grunge-white focus:border-grunge-accent placeholder:text-grunge-gray/50 transition-colors"
                                    placeholder="firstname"
                                />
                            </div>

                            <div>
                                <label className="uppercase font-bold text-grunge-gray text-xs block mb-1">
                                    Last Name
                                </label>
                                <input
                                    type="text"
                                    {...register('lastname')}
                                    className="w-full bg-transparent border-2 border-grunge-dark p-3 font-mono text-base text-grunge-dark outline-none focus:bg-grunge-dark focus:text-grunge-white focus:border-grunge-accent placeholder:text-grunge-gray/50 transition-colors"
                                    placeholder="lastname"
                                />
                            </div>
                        </>
                    )}

                    <div>
                        <label className="uppercase font-bold text-grunge-gray text-xs block mb-1">
                            Identity_String
                        </label>
                        <input
                            type="text"
                            {...register('username')}
                            className="w-full bg-transparent border-2 border-grunge-dark p-3 font-mono text-base text-grunge-dark outline-none focus:bg-grunge-dark focus:text-grunge-white focus:border-grunge-accent placeholder:text-grunge-gray/50 transition-colors"
                            placeholder="Username"
                        />
                    </div>

                    {!isLogin && (
                        <div className="animate-pulse-once">
                            <label className="uppercase font-bold text-grunge-gray text-xs block mb-1">
                                Encrypted_Mail_Relay
                            </label>
                            <input
                                type="email"
                                {...register('email')}
                                className="w-full bg-transparent border-2 border-grunge-dark p-3 font-mono text-base text-grunge-dark outline-none focus:bg-grunge-dark focus:text-grunge-white focus:border-grunge-accent placeholder:text-grunge-gray/50 transition-colors"
                                placeholder="user@proton.me"
                            />
                        </div>
                    )}

                    <div>
                        <label className="uppercase font-bold text-grunge-gray text-xs block mb-1">
                            Access_Key
                        </label>
                        <input
                            type="password"
                            {...register('password')}
                            className="w-full bg-transparent border-2 border-grunge-dark p-3 font-mono text-base text-grunge-dark outline-none focus:bg-grunge-dark focus:text-grunge-white focus:border-grunge-accent placeholder:text-grunge-gray/50 transition-colors"
                            placeholder="••••••••"
                        />
                    </div>

                    {!isLogin && (
                        <div className="animate-pulse-once">
                            <label className="uppercase font-bold text-grunge-gray text-xs block mb-1">
                                Confirm_Key
                            </label>
                            <input
                                type="password"
                                {...register('confirmPassword')}
                                className="w-full bg-transparent border-2 border-grunge-dark p-3 font-mono text-base text-grunge-dark outline-none focus:bg-grunge-dark focus:text-grunge-white focus:border-grunge-accent placeholder:text-grunge-gray/50 transition-colors"
                                placeholder="••••••••"
                            />
                        </div>
                    )}

                    <button
                        disabled={isSubmitting}
                        className="w-full p-4 mt-2 bg-grunge-accent text-grunge-white border-2 border-grunge-dark font-mono font-bold uppercase cursor-pointer hover:shadow-[4px_4px_0_#0f0f10] active:translate-x-[2px] active:translate-y-[2px] transition-all disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                        {isSubmitting ? 'PROCESSING...' : (isLogin ? 'INITIALIZE_SESSION' : 'GENERATE_IDENTITY')}
                    </button>
                </form>
            </div>

            <div className="text-grunge-gray text-xs mt-2 leading-tight">
                By connecting, you agree to the <span className="text-grunge-accent underline cursor-pointer">Protocol_Manifesto</span>.
                Connection is encrypted end-to-end.
            </div>
        </div>
    );
};

export default AuthForm;
