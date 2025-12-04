'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';

import FloatingBlobs from '../components/floatingblobs';

export default function IntroPage() {
    
    const router = useRouter();
    const [accepted, setAccepted] = useState(false);

    return (
        <main
            className='flex flex-col min-h-screen items-center justify-center text-white p-4 bg-light-background dark:bg-dark-background'
        >
            <FloatingBlobs className='absolute inset-0 -z-10'/>

            <div
                className='w-full max-w-lg bg-neutral-900 rounded-xl p-6 space-y-6 z-10'
            >
                <h1 className='text-3xl font-bold'>Serenity ETM</h1>
                <p className='text-neutral-300'>
                    A calm, emotion-aware email and task manager to reduce workplace stress.
                </p>
            </div>

            <div 
                className='border border-neutral-700 p-4 rounded-md max-h-48 overflow-y-auto z-10'
            >
                <p className='text-neutral-400 text-sm'>
                    By using this prototype, you agree that the application will adapt its interface based on your detected stress level. No real biometric data is stored, and this is a prototype for academic purposes.
                </p>
            </div>

            <div 
                className='flex items-center space-x-2 z-10'
            >
                <input
                    type='checkbox'
                    id='accept'
                    checked={accepted}
                    onChange={() => {setAccepted(!accepted)}}
                    className='w-4 h-4 accent-blue-500 z-10'
                />
                <label htmlFor='accept' className='text-sm text-neutral-300 z-10'>
                    I agree to the Terms & Conditions
                </label>
            </div>

            <button
                disabled={!accepted}
                className={`w-full p-2 rounded-lg font-medium transition-colors z-10
                ${accepted
                    ? "bg-blue-500 hover:bg-blue-600 text-white cursor-pointer"
                    : "bg-neutral-700 text-neutral-400 cursor-not-allowed"
                }`}
                onClick={()=>router.push("/emails")}
            >
                Enter Serentiy Workplace
            </button>

            <p className='text-center text-sm text-neutral-400 z-10'>
                <button
                    className='underline hover:text-blue-400 z-10'
                    onClick={() => router.push('/terms')}
                >
                    Read full Terms & Conditions
                </button>
            </p>
        </main>
    );
};