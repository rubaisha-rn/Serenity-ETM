/**
 * Sign in page
 * 
 * Handles user authentication using supabase
 */

'use client';

import { useState } from "react";
import {supabase} from '@/lib/supabaseClient'
import { useRouter } from "next/navigation";
import Spinner from "@/components/spinner";
import { ICONS } from "@/lib/assets";
import PrototypeTag from "@/components/prototypeTag";
import useStore from "@/store/useStore";

export default function SignInPage() {
    
    // Global state
    const {setScreen} = useStore();

    // Navigation
    const router = useRouter();

    // Form state
    const [email, setEmail] = useState('')
    const [password, setPassword] = useState('')

    // UI states
    const [loading, setLoading] = useState(false)
    const [error, setError] = useState(null)
    const [success, setSuccess] = useState(null)

    // Handle form submission and user authentication
    const handleSignIn = async (e) => {
        
        e.preventDefault()
        setLoading(true)
        setError(null)

        // Basic form validation
        if (!email || !password) {
            setError('Please fill all required fields.')
            setLoading(false);
            return;
        }

        // Attempt supabase authentication
        const {error} = await supabase.auth.signInWithPassword({
            email,
            password
        })

        if (error) {
            setError(error.message)
        }
        else {
            setSuccess('Signed in.')
            setScreen('dashboard')
            router.push('/dashboard')
        }

        setLoading(false)
    }

    return (

        // Main page container
        <div 
            aria-labelledby="login-heading"
            className="h-[100vh] w-[100vw] grid sm:lg:grid-cols-1 md:lg:grid-cols-2 lg:grid-cols-2 xl:lg:grid-cols-2 2xl:lg:grid-cols-2"
        >
            {/* Branding / Marketing panel */}
            <div
                className='signing-bg'
                style={{
                    backgroundImage: `url(${ICONS.bg.bg})`,
                    backgroundSize: "cover",
                    backgroundPosition: "center",
                    backgroundRepeat: "repeat-y",
                }}
                aria-hidden="true"
            >
                <div className="flex items-end justify-start h-full signing-title-box">
                    <div className="signing-title-box">
                        
                        <h1 className="signing-title font-AbrilFatface transition-colors duration-500 ease-in-out opacity-85">Serenity</h1>
                        
                        <h1 className="signing-subtitle font-AbrilFatface opacity-80">Email & Task Manager</h1>
                        
                        <p className="signing-subsubtitle text-[var(--text-b)] font-Roboto">Stay productive, stay calm: your stress-aware inbox.</p>
                    
                    </div>
                </div>
            </div>

            {/* Authentication panel */}
            <div className='flex flex-col items-center justify-center'>
                
                {/* Page heading */}
                <div className='flex flex-row
                    sm:gap-1 sm:my-1
                    md:gap-1 md:my-2
                    lg:gap-2 lg:my-4
                    xl:gap-2 xl:my-4
                    2xl:gap-3 2xl:my-6
                '>

                    <img
                        src={ICONS['light'].logo}
                        alt=""
                        aria-hidden="true"
                        className='sm:w-6 md:w-8 lg:w-10 xl:w-10 2xl:w-12  aspect-square'
                    />
                    <div className='py-1 bg-black/20 px-[0.03rem]'/>
                    <h1 
                        id="login-heading"
                        className='font-AbrilFatface text-[var(--text-a)]'
                    >
                        Sign In
                    </h1>

                </div>

                {/* Error and success messages */}
                {(error || success) && (
                    <div 
                        role='alert'
                        aria-live='assertive'
                        className={`error-message w-[50%] ${success ? 'bg-[var(--successL)]' : ''}`}
                    >
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

                        {/* Dismiss feedback */}
                        <button
                            onClick={() => {
                                error ? setError('') : setSuccess('')
                            }}
                            aria-label='Dismiss message'
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

                {/* Sign in form */}
                <form 
                    aria-describedby={error ? 'form-error' : undefined}
                    onSubmit={handleSignIn} 
                    className='w-[50%] items-center justify-center'
                >
                    {/* Email input */}
                    <label className="sr-only" htmlFor="email">Email Address</label>

                    <input
                        id="email"
                        type="email"
                        placeholder="Email"
                        autoComplete="email"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        required
                        className="bg-[--baseAcc-b] border-[--f-main] w-full px-3 py-1.5 text-sm rounded-md border-[0.008rem] my-1"
                    />

                    {/* Password input */}
                    <label htmlFor="password" className="sr-only">Password</label>

                    <input
                        id="password"
                        type="password"
                        placeholder="Password"
                        autoComplete="current-password"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        required
                        className="bg-[--baseAcc-b] border-[--f-main] w-full px-3 py-1.5 text-sm rounded-md border-[0.008rem] my-1"
                    />

                    {/* Submit button */}
                    <button 
                        type="submit" 
                        disabled={loading} 
                        aria-busy={loading}
                        className='prim-act-btn signup-btn my-1'
                    >
                        {loading ? "Signing in..." : "Sign in"}
                    </button>

                </form>

                {/* Sign up redirect */}
                <div className="flex items-center space-x-2 my-1">
                    
                    <label htmlFor='accept' className="text-[var(--text-b)] font-Roboto leading-snug flex flex-row gap-1"><p>Don't have an account?</p>
                        
                        <button
                            type="button"
                            className='underline hover:text-blue-400'
                            onClick={()=> router.push('/')}
                        >
                            <p>Sign up</p>
                        </button>
                        
                    </label>
                </div>

                {/* Prototype indicator and spinner */}
                <PrototypeTag />
                {loading && <Spinner/>}
                
            </div>
        </div>
    )
}