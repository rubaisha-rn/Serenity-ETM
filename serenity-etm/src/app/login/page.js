'use client';

import { useState } from "react";
import {supabase} from '@/lib/supabaseClient'
import { useRouter } from "next/navigation";
import Spinner from "@/components/spinner";
import { ICONS } from "@/lib/assets";
import PrototypeTag from "@/components/prototypeTag";
import useStore from "@/store/useStore";

export default function LoginPage() {
    
    const {setScreen} = useStore();
    const router = useRouter();
    const [email, setEmail] = useState('')
    const [password, setPassword] = useState('')
    const [loading, setLoading] = useState(false)
    const [error, setError] = useState(null)
    const [success, setSuccess] = useState(null)

    const handleLogin = async (e) => {
        
        e.preventDefault()
        setLoading(true)
        setError(null)

        if (!email || !password) {
            setError('Please fill all required fields.')
            setLoading(false);
            return;
        }

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
                    <h1 className='font-AbrilFatface text-[var(--text-a)]'>Sign In</h1>
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

                <form onSubmit={handleLogin} className='w-[50%] items-center justify-center'>
                    
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
                        onChange={(e) => setPassword(e.target.value)}
                        required
                        className="bg-[--baseAcc-b] border-[--f-main] w-full px-3 py-1.5 text-sm rounded-md border-[0.008rem] my-1"
                    />

                    <button type="submit" disabled={loading} className='prim-act-btn signup-btn my-1'>
                        {loading ? "Signing in..." : "Sign in"}
                    </button>

                </form>

                <div className="flex items-center space-x-2 my-1">
                    
                    <label htmlFor='accept' className="text-[var(--text-b)] font-Roboto text-[clamp(0.6rem,0.9vw,1rem)] leading-snug`}">Don't have an account?&nbsp;
                        
                        <button
                            className='underline hover:text-blue-400'
                            onClick={()=> router.push('/')}
                        >Sign up</button>
                    
                    </label>
                
                </div>

                <PrototypeTag />
                {loading && <Spinner/>}
                
            </div>
        </div>
    )
}