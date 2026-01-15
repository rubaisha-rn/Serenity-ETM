'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import useStore from '@/store/useStore';
import Header from '@/components/header';
import Image from 'next/image';
import PrototypeTag from '@/components/prototypeTag';
import Footer from '@/components/footers/footer';

export default function IntroPage() {
    
    const router = useRouter();
    
    const [accepted, setAccepted] = useState(false);
    const setTheme = useStore((s) => s.setTheme);

    useEffect(() => {
        const darkModeEnabled = document.documentElement.classList.contains('dark');
        setTheme(darkModeEnabled ? 'dark' : 'light');
    }, []);

    return (
        <div className="text-[var(--text-a)]">

            <Header
                title="Serenity ETM"
                logo={<Image
                    src="/logo/logo.png"
                    alt="Serenity ETM Logo"
                    width={18}
                    height={18}
                    priority
                />}
                thisPage = '/'
                showRight
                sticky
                transparent
            />

            <main className="relative min-h-screen overflow-hidden bg-[var(--bg-main)]"
                style={{
                    backgroundImage: "url('/background/bg.png')",
                    backgroundSize: "cover",
                    backgroundPosition: "center",
                    backgroundRepeat: "repeat-y",
                }}
            >
                
                <PrototypeTag />

                {/* 2x2 grid layout */}
                <div className="relative z-10 grid grid-cols-2 grid-rows-2 h-screen gap-6 p-8">

                    {/* top left box */}
                    <div className="flex items-center justify-start h-full order-1 md:order-none">
                        <div className="max-w-md p-6 pt-0">
                            
                            <h1 className="text-8xl leading-none font-AbrilFatface transition-colors duration-500 ease-in-out opacity-85">Serenity</h1>
                            
                            <h1 className="text-[clamp(1.5rem,2.5vw,3rem)] leading-none font-AbrilFatface opacity-80">Email & Task Manager</h1>
                            
                            <p className="pt-6 text-[var(--text-b)] font-Roboto text-[clamp(0.8rem,1.2vw,1rem)] leading-snug">Stay productive, stay calm: your stress-aware inbox.</p>
                        
                        </div>
                    </div>

                    {/* top right and bottom left intentionally left empty */}
                    <div />
                    <div />

                    {/* bottom right */}
                    <div className="flex items-center justify-start h-full order-2 ml-6 mr-6 md:order-none md:ml-40 md:mr-10" >
                        <div className='w-full max-w-md space-y-4'>
                            
                            <p className="text-[var(--text-b)] font-Roboto text-[clamp(0.6rem,0.9vw,1rem)] leading-snug">
                                By using this prototype, you agree that the application will adapt its interface based on your detected stress level. No real biometric data is stored, and this is a prototype for academic purposes.  
                            </p>

                            <div className="flex items-center space-x-2">
                                
                                <input
                                    type='checkbox'
                                    id='accept'
                                    checked={accepted}
                                    onChange={() => setAccepted(!accepted)}
                                    className='w-3 h-3 accent-blue-500'
                                />
                                
                                <label htmlFor='accept' className="text-[var(--text-b)] font-Roboto text-[clamp(0.6rem,0.9vw,1rem)] leading-snug`}">I agree to the&nbsp;
                                    
                                    <button
                                        className='underline hover:text-blue-400'
                                        onClick={()=> router.push('/terms')}
                                    >Terms and Conditions</button>
                                
                                </label>
                            
                            </div>

                            <button
                                disabled={!accepted}
                                className={`font-Roboto text-[clamp(0.8rem,1.05vw,1rem)] leading-snug w-full py-2.5 rounded-lg transition-colors 
                                ${accepted
                                    ? "bg-[var(--acc-main)] hover:bg-[var(--accHover-main)] border-[var(--a-main)] border-2 text-[var(--text-d)] cursor-pointer"
                                    : "bg-[var(--acc-main)] border-[var(--a-main)] border-2 text-[var(--text-d)] opacity-40 pointer-events-none cursor-not-allowed"
                                }`}
                                onClick={() => router.push('/login')}
                            >
                                Enter Serenity Workplace
                            </button>
                        </div>
                    </div>
                </div>

                <Footer />

            </main>
        </div>
    );
};