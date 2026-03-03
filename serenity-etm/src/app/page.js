'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import useStore from '@/store/useStore';
import PrototypeTag from '@/components/prototypeTag';
import { ICONS } from '@/lib/assets';
import { supabase } from '@/lib/supabaseClient';

export default function IntroPage() {
    
    const router = useRouter();
    const {setScreen} = useStore();
    const [email, setEmail] = useState('')
    const [password, setPassword] = useState('')
    const [loading, setLoading] = useState(false)
    const [error, setError] = useState(null)

    const validatePassword = (password) => {
        const minLength = 8;
        const hasUpper = /[A-Z]/.test(password);
        const hasLower = /[a-z]/.test(password);
        const hasNumber = /[0-9]/.test(password);
        const hasSpecial = /[^A-Za-z0-9]/.test(password);

        if (password.length < minLength) {
            return 'Password must be at least 8 characters long.';
        }
        if (!hasUpper) {
            return 'Password must include at least one uppercase letter.';
        }
        if (!hasLower) {
            return 'Password must include at least one lowercase letter.';
        }
        if (!hasNumber) {
            return 'Password must include at least one number.';
        }
        if (!hasSpecial) {
            return 'Password must include at least one special character.';
        }

        return null;
    }

    const handleSignup = async (e) => {
        e.preventDefault()
        setLoading(true)
        setError(null)

        const passwordError = validatePassword(password);
        if (passwordError) {
            setError(passwordError);
            setLoading(false);
            return;
        }

        const {error} = await supabase.auth.signUp({
            email,
            password
        });

        if (error) {
            setError(error.message)
        }
        else {
            router.push('/login');
        }

        setLoading(false)
    }

    return (
        <div className="h-[100vh] w-[100vw] grid grid-cols-2">

            <div
                className='h-auto m-2 w-auto rounded-2xl'
                style={{
                    backgroundImage: `url(${ICONS.bg.bg})`,
                    backgroundSize: "cover",
                    backgroundPosition: "center",
                    backgroundRepeat: "repeat-y",
                }}
            >
                <div className="flex items-end justify-start h-full max-w-md p-6 pt-0">
                    <div className="max-w-md p-6 pt-0">
                        
                        <h1 className="text-8xl leading-none font-AbrilFatface transition-colors duration-500 ease-in-out opacity-85">Serenity</h1>
                        
                        <h1 className="text-[clamp(1.5rem,2.5vw,3rem)] leading-none font-AbrilFatface opacity-80">Email & Task Manager</h1>
                        
                        <p className="pt-6 text-[var(--text-b)] font-Roboto text-[clamp(0.8rem,1.2vw,1rem)] leading-snug">Stay productive, stay calm: your stress-aware inbox.</p>
                    
                    </div>
                </div>
            </div>

            <div className='flex flex-col items-center justify-center'>

                <div className='flex flex-row gap-2 my-4'>
                    <img
                        src={ICONS['light'].logo}
                        className='w-10 aspect-square'
                    />
                    <div className='py-1 bg-black/20 px-[0.03rem]'/>
                    <h1 className='font-AbrilFatface text-[var(--text-b)]'>Sign up</h1>
                </div>

                <form onSubmit={handleSignup} className='w-[100%] items-center justify-center'>
                    <input
                        type="email"
                        placeholder="Email"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        required
                        className="bg-[--baseAcc-b] border-[--e-main] w-full"
                    />
                    <br/>
                    <input
                        type="password"
                        placeholder="Password"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        required
                        className="bg-[--baseAcc-b] border-[--e-main] w-full"
                    />
                    <br/>
                    <button type="submit" disabled={loading} className='prim-act-btn w-full'>
                        {loading ? "Signing up..." : "Sign up"}
                    </button>
                </form>

                {error && <p style={{color: 'red'}}>{error}</p>}
            </div>
        </div>
    );
};