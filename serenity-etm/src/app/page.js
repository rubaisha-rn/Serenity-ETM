'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import PrototypeTag from '@/components/prototypeTag';
import { ICONS } from '@/lib/assets';
import { supabase } from '@/lib/supabaseClient';
import Spinner from '@/components/spinner';

export default function IntroPage() {
    
    const router = useRouter();
    const [email, setEmail] = useState('')
    const [password, setPassword] = useState('')
    const [confirmPassword, setConfirmPassword] = useState('')
    const [loading, setLoading] = useState(false)
    const [error, setError] = useState(null)
    const [success, setSuccess] = useState(null)
    const [accepted, setAccepted] = useState(false);

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

        if (!email || !password || !confirmPassword) {
            setError('Please fill all required fields.')
            setLoading(false);
            return;
        }

        const passwordError = validatePassword(password);
        if (passwordError) {
            setError(passwordError);
            setLoading(false);
            return;
        }

        if (password !== confirmPassword) {
            setError('Password do not match.')
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
            setSuccess('Account created. Please verify your email and login.')
            router.push('/login');
        }

        setLoading(false)
    }

    return (
        <div className="h-[100vh] w-[100vw] grid sm:lg:grid-cols-1 md:lg:grid-cols-2 lg:grid-cols-2 xl:lg:grid-cols-2 2xl:lg:grid-cols-2">

            <div
                className='signing-bg'
                style={{
                    backgroundImage: `url(${ICONS.bg.bg})`,
                    backgroundSize: "cover",
                    backgroundPosition: "center",
                    backgroundRepeat: "repeat-y",
                }}
            >
                <div className="flex items-end justify-start h-full signing-title-box">
                    <div className="signing-title-box">
                        
                        <h1 className="signing-title font-AbrilFatface transition-colors duration-500 ease-in-out opacity-85">Serenity</h1>
                        
                        <h1 className="signing-subtitle font-AbrilFatface opacity-80">Email & Task Manager</h1>
                        
                        <p className="signing-subsubtitle text-[var(--text-b)] font-Roboto">Stay productive, stay calm: your stress-aware inbox.</p>
                    
                    </div>
                </div>
            </div>

            <div className='flex flex-col items-center justify-center'>

                <div className='flex flex-row 
                    sm:gap-1 sm:my-1
                    md:gap-1 md:my-2
                    lg:gap-2 lg:my-4
                    xl:gap-2 xl:my-4
                    2xl:gap-3 2xl:my-6
                '>
                    <img
                        src={ICONS['light'].logo}
                        className='sm:w-6 md:w-8 lg:w-10 xl:w-10 2xl:w-12  aspect-square'
                    />
                    <div className='py-1 bg-black/20 px-[0.03rem]'/>
                    <h1 className='font-AbrilFatface text-[var(--text-a)]'>Sign Up</h1>
                </div>

                {/* error and success messages */}
                {(error || success) && (
                    <div className={`error-message w-[50%] ${success ? 'bg-[var(--successL)]' : ''}`}>
                        <div className="flex flex-row items-center justify-center gap-1">
                            <img
                                src={error ? ICONS['light'].warning : ICONS['light'].success}
                                className="bg-white rounded-full p-0.5"
                                alt=""
                                aria-hidden='true'
                            />
                            <p className="font-bold">{error ? 'Error!' : 'Success!'}</p>
                            <p className="text-[var(--text-a)] leading-tight">{error ? error : success}</p>
                        </div>
                        <button
                            onClick={() => {
                                error ? setError('') : setSuccess('')
                            }}
                        >
                            <img
                                src={ICONS['light'].close}
                                className="lg:w-[1rem] aspect-square opacity-70"
                                alt=""
                                aria-hidden='true'
                            />
                        </button>
                    </div>
                )}

                <form onSubmit={handleSignup} className='w-[50%] items-center justify-center'>
                    
                    <input
                        type="email"
                        placeholder="Email"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        required
                        className="bg-[--baseAcc-b] border-[--f-main] w-full px-3 py-1.5 text-sm rounded-md border-[0.008rem] my-1"
                    />

                    <input
                        type="password"
                        placeholder="Password"
                        value={password}
                        onChange={(e) => {
                            const value = e.target.value;
                            setPassword(e.target.value);
                            const validationError = validatePassword(value);
                            setError(validationError || '');
                        }}
                        required
                        className="bg-[--baseAcc-b] border-[--f-main] w-full px-3 py-1.5 text-sm rounded-md border-[0.008rem] my-1"
                    />

                    <input
                        type="password"
                        placeholder="Confirm password"
                        value={confirmPassword}
                        onChange={(e) => setConfirmPassword(e.target.value)}
                        required
                        className="bg-[--baseAcc-b] border-[--f-main] w-full px-3 py-1.5 text-sm rounded-md border-[0.008rem] my-1"
                    />

                    <div className="flex items-center space-x-2 my-2">
                    
                        <input
                            type='checkbox'
                            id='accept'
                            checked={accepted}
                            onChange={() => setAccepted(!accepted)}
                            className='w-3 h-3 accent-blue-500'
                        />
                        
                        <label htmlFor='accept' className="text-[var(--text-b)] font-Roboto leading-snug flex flex-row gap-1"><p>I agree to the</p>
                            
                            <button
                                className='underline hover:text-blue-400'
                                onClick={()=> router.push('/terms')}
                            ><p>Terms and Conditions</p></button>
                        
                        </label>
                    
                    </div>

                    <button type="submit" disabled={loading || !accepted} className='prim-act-btn signup-btn my-1'>
                        {loading ? "Signing up..." : "Sign up"}
                    </button>

                </form>

                <div className="flex items-center space-x-2 my-1">
                    
                    <label htmlFor='accept' className="text-[var(--text-b)] font-Roboto leading-snug flex flex-row gap-1"><p>Already have an account?</p>
                        
                        <button
                            className='underline hover:text-blue-400'
                            onClick={()=> router.push('/login')}
                        ><p>Sign in</p></button>
                    
                    </label>
                </div>

                <PrototypeTag />
                {loading && <Spinner/>}
                
            </div>
        </div>
    );
};