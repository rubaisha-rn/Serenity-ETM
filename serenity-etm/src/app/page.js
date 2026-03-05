/**
 * Sign up page
 * 
 * Handles user account registration using supabase authentication.
 */

'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import PrototypeTag from '@/components/prototypeTag';
import { ICONS } from '@/lib/assets';
import { supabase } from '@/lib/supabaseClient';
import Spinner from '@/components/spinner';
import validatePassword from '@/components/validatePassword';

export default function SignUpPage() {
    
    // For navigation
    const router = useRouter();
    
    // Form states
    const [email, setEmail] = useState('')
    const [password, setPassword] = useState('')
    const [confirmPassword, setConfirmPassword] = useState('')
    const [accepted, setAccepted] = useState(false);
    const [firstName, setFirstName] = useState('');
    const [lastName, setLastName] = useState('');

    // UI states
    const [loading, setLoading] = useState(false)

    // Error and success states
    const [error, setError] = useState(null)
    const [success, setSuccess] = useState(null)

    // Handles form submission and account creation
    const handleSignup = async (e) => {

        e.preventDefault()
        
        setLoading(true)
        setError(null)

        // Basic validation 
        if (!email || !password || !confirmPassword) {
            setError('Please fill all required fields.')
            setLoading(false);
            return;
        }

        // Password validation
        const passwordError = validatePassword(password);
        if (passwordError) {
            setError(passwordError);
            setLoading(false);
            return;
        }

        // Match passwords
        if (password !== confirmPassword) {
            setError('Password do not match.')
            setLoading(false);
            return;
        }

        if (!accepted) {
            setError('Accept the Terms & Conditions to proceed.')
            setLoading(false);
            return;
        }

        const {error} = await supabase.auth.signUp({
            email,
            password,
            options: {
                data: {
                    first_name: firstName,
                    last_name: lastName
                }
            }
        });

        if (error) {
            setError(error.message)
        }
        else {

            // Redirect to sign in page for logging in
            setSuccess('Account created. Please verify your email and sign in.')
            router.push('/signin');
        }

        setLoading(false)
    }

    return (

        // Page layout container
        <div 
            aria-busy={loading}
            className="h-[100vh] w-[100vw] grid sm:lg:grid-cols-1 md:lg:grid-cols-2 lg:grid-cols-2 xl:lg:grid-cols-2 2xl:lg:grid-cols-2"
        >
            {/* Branding panel */}
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

            {/* Sign up form panel */}
            <div className='flex flex-col items-center justify-center'>

                {/* Page title */}
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
                        alt='Serenity ETM logo'
                    />
                    <div className='py-1 bg-black/20 px-[0.03rem]'/>
                    <h1 className='font-AbrilFatface text-[var(--text-a)]'>Sign Up</h1>
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

                {/* Sign up form */}
                <form 
                    aria-describedby={error ? 'signup-error' : undefined}
                    onSubmit={handleSignup} 
                    className='w-[50%] items-center justify-center'
                >
                    {/* First name input */}
                    <label className="sr-only" htmlFor="f-name">
                        First name 
                    </label>
                    
                    <input
                        id='f-name'
                        type="text"
                        placeholder="First name"
                        value={firstName}
                        onChange={(e) => setFirstName(e.target.value)}
                        className="bg-[--baseAcc-b] border-[--f-main] w-full px-3 py-1.5 text-sm rounded-md border-[0.008rem] my-1"
                    />

                    {/* Last name input */}
                    <label className="sr-only" htmlFor="l-name">
                        Last name 
                    </label>
                    
                    <input
                        id='l-name'
                        type="text"
                        placeholder="Last name"
                        value={lastName}
                        onChange={(e) => setLastName(e.target.value)}
                        className="bg-[--baseAcc-b] border-[--f-main] w-full px-3 py-1.5 text-sm rounded-md border-[0.008rem] my-1"
                    />

                    {/* Email input */}
                    <label className="sr-only" htmlFor="email">
                        Email address 
                    </label>
                    
                    <input
                        id='email'
                        type="email"
                        placeholder="Email"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        required
                        className="bg-[--baseAcc-b] border-[--f-main] w-full px-3 py-1.5 text-sm rounded-md border-[0.008rem] my-1"
                    />

                    {/* Password input */}
                    <label 
                        className="sr-only" 
                        htmlFor="password"
                    >
                        Password
                    </label>

                    <input
                        id='password'
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

                    {/* Confirm password */}
                    <label 
                        className="sr-only" 
                        htmlFor="confirm-password"
                    >
                        Confirm password
                    </label>

                    <input
                        id='confirm-password'
                        type="password"
                        placeholder="Confirm password"
                        value={confirmPassword}
                        onChange={(e) => setConfirmPassword(e.target.value)}
                        required
                        className="bg-[--baseAcc-b] border-[--f-main] w-full px-3 py-1.5 text-sm rounded-md border-[0.008rem] my-1"
                    />

                    {/* Terms acceptance */}
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

                    {/* Submit button */}
                    <button 
                        type="submit" 
                        disabled={loading} className='prim-act-btn signup-btn my-1'
                    >
                        {loading ? "Signing up..." : "Sign up"}
                    </button>

                </form>

                {/* Sign in redirect */}
                <div className="flex items-center space-x-2 my-1">
                    
                    <label htmlFor='accept' className="text-[var(--text-b)] font-Roboto leading-snug flex flex-row gap-1"><p>Already have an account?</p>
                        
                        <button
                            className='underline hover:text-blue-400'
                            onClick={()=> router.push('/signin')}
                        >
                            <p>Sign in</p>
                        </button>
                    
                    </label>
                    
                </div>

                {/* Prototype tag and loading spinner */}
                <PrototypeTag />
                {loading && <Spinner/>}
                
            </div>
        </div>
    );
};