import React, { useState } from 'react';
import { useForm } from 'react-hook-form'
import { useNavigate } from 'react-router-dom';


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
    const { register, handleSubmit } = useForm<RegistrationData>()
    const navigate = useNavigate();

    const onSubmit = async (data: RegistrationData) => {
        console.log(data);

        let response;

        if (!isLogin) {
            response = await fetch("http://localhost:3000/api/auth/register", {
                method: "POST",
                body: JSON.stringify({
                    firstname: data.firstname,
                    lastname: data.lastname,
                    username: data.username,
                    email: data.email,
                    password: data.password,
                    role: "user"
                }),
                headers: {
                    "Content-Type": "application/json",
                },
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
            return;
        }
        const res = await response.json();
        console.log(res.accessToken);
        localStorage.setItem("accessToken", res.accessToken);
        navigate("/");// hta n9adha fin bagha tmchi 
    }

    return (
        <div className="bg-grunge-white border-2 border-grunge-dark p-8 flex flex-col gap-6 shadow-[8px_8px_0_#0f0f10] relative z-10 w-full">
            <div className="flex gap-4 border-b-2 border-grunge-dark pb-2 mb-2">
                <button
                    className={`bg-transparent border-none font-mono font-bold text-base cursor-pointer transition-all ${isLogin ? 'opacity-100 underline text-grunge-accent' : 'opacity-50 hover:opacity-100 text-grunge-dark'}`}
                    onClick={() => setIsLogin(true)}
                >
                    LOGIN
                </button>
                <span className="text-grunge-gray">/</span>
                <button
                    className={`bg-transparent border-none font-mono font-bold text-base cursor-pointer transition-all ${!isLogin ? 'opacity-100 underline text-grunge-accent' : 'opacity-50 hover:opacity-100 text-grunge-dark'}`}
                    onClick={() => setIsLogin(false)}
                >
                    REGISTER
                </button>
            </div>

            <div className="flex flex-col gap-4">
                <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-4">
                    {!isLogin && (
                    <>
                        <div>
                            <label className="uppercase font-bold text-grunge-gray text-xs block mb-1">
                                Identity_String
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
                                Identity_String
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

                    <button className="w-full p-4 mt-2 bg-grunge-accent text-grunge-white border-2 border-grunge-dark font-mono font-bold uppercase cursor-pointer hover:shadow-[4px_4px_0_#0f0f10] active:translate-x-[2px] active:translate-y-[2px] transition-all">
                        {isLogin ? 'INITIALIZE_SESSION' : 'GENERATE_IDENTITY'}
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
