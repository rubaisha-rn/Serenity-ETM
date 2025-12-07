'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';

import FloatingBlobs from '@/components/floatingblobs';
import StressControl from '@/components/stressControl';
import useStore from '@/store/useStore';
import Header from '@/components/header';
import Image from 'next/image';

export default function IntroPage() {
    
    const router = useRouter();
    
    const [accepted, setAccepted] = useState(false);
    const emotionValue = useStore((s) => s.emotionValue);
    const stress01 = emotionValue / 100;
    const [stressPalette, setStressPalette] = useState('low');
    const [theme, setTheme] = useState('light'); 

    useEffect(() => {
        const darkModeEnabled = document.documentElement.classList.contains('dark');
        setTheme(darkModeEnabled ? 'dark' : 'light');
    }, []);

    useEffect(() => {
        if (stress01 !== undefined) {
            if (stress01 < 0.33) setStressPalette('low');
            else if (stress01 < 0.66) setStressPalette('mid');
            else setStressPalette('high');}
    }, [stress01]);

    const textAClasses = {
        light: 'text-light-textA',
        dark: {},
    };

    const textBClasses = {
        light: 'text-light-textB',
        dark: {},
    };

    const bgClasses = {
        light: {
            low: 'bg-light-low-bg',
            mid: 'bg-light-mid-bg',
            high: 'bg-light-high-bg',
        },
        dark: {},
    };

    const buttonClasses = {
        light: {
            low: 'bg-light-low-button hover:bg-light-low-buttonHover border-light-low-a border-2',
            mid: 'bg-light-mid-button hover:bg-light-mid-buttonHover border-light-mid-a border-2',
            high: 'bg-light-high-button hover:bg-light-high-buttonHover border-light-high-a border-2',
        },
        dark: {},
    };    

    return (
        <main
            className={`relative min-h-screen ${textAClasses[theme]} ${bgClasses[theme][stressPalette]} overflow-hidden`}
        >
            <FloatingBlobs className='z-0'/>
            <StressControl className='z-20' />

            <Header
                title="Serenity ETM"
                logo={<Image
                    src="/logo/logo.png"
                    alt='Serenity ETM Logo'
                    width={18}
                    height={18}
                    priority
                />}
                navLinks={[
                    {label: 'Home', href: '/'},
                    {label: 'Terms & Conditions', href: '/terms'},
                ]}
                sticky
            />

            {/* 2x2 grid layout */}
            <div 
                className='
                relative z-10 
                grid grid-cols-1 grid-rows-1 
                
                md:grid-cols-2
                md:grid-rows-2
                
                h-screen
                gap-6 p-8
                md:p-10
                md:mt-0'
            >

                {/* top left box */}
                <div className='
                    flex 
                    items-center
                    justify-start
                    h-full
                    order-1
                    
                    md:order-none'
                >
                    <div className='max-w-md p-6 pt-0'>
                        
                        <h1 className='text-8xl leading-none font-AbrilFatface transition-colors duration-500 ease-in-out opacity-85'>Serenity</h1>
                        
                        <h1 className='text-[clamp(1.5rem,2.5vw,3rem)] leading-none font-AbrilFatface opacity-80'>Email & Task Manager</h1>
                        
                        <p className={`pt-6 ${textAClasses[theme]} font-Roboto text-[clamp(0.8rem,1.2vw,1rem)] leading-snug`}>Stay productive, stay calm: your stress-aware inbox.</p>
                    
                    </div>
                </div>

                {/* top right and bottom left intentionally left empty */}
                <div />
                <div />

                {/* bottom right */}
                <div className='
                    flex 
                    items-center
                    justify-start
                    h-full
                    order-2
                    
                    md:order-none
                    md:ml-40
                    md:mr-10'
                >
                    <div className='w-full max-w-md space-y-4'>
                        
                        <p className={`${textBClasses[theme]} font-Roboto text-[clamp(0.6rem,0.9vw,1rem)] leading-snug`}>
                            By using this prototype, you agree that the application will adapt its interface based on your detected stress level. No real biometric data is stored, and this is a prototype for academic purposes.  
                        </p>

                        <div className='flex items-center space-x-2'>
                            
                            <input
                                type='checkbox'
                                id='accept'
                                checked={accepted}
                                onChange={() => setAccepted(!accepted)}
                                className='w-3 h-3 accent-blue-500'
                            />
                            
                            <label htmlFor='accept' className={`${textBClasses[theme]} font-Roboto text-[clamp(0.6rem,0.9vw,1rem)] leading-snug`}>I agree to the&nbsp;
                                
                                <button
                                    className='underline hover:text-blue-400'
                                    onClick={()=> router.push('/terms')}
                                >Terms and Conditions</button>
                            
                            </label>
                        
                        </div>

                        <button
                            disabled={!accepted}
                            className={`font-Roboto text-[clamp(0.8rem,1.05vw,1rem)] leading-snug w-full py-2.5 rounded-lg transition-colors ${accepted
                                ? `${buttonClasses[theme][stressPalette]} text-white cursor-pointer`
                                : `${buttonClasses[theme][stressPalette]} text-white opacity-40 pointer-events-none cursor-not-allowed`
                            }`}
                            onClick={() => router.push('/emails')}
                        >
                            Enter Serenity Workplace
                        </button>
                    </div>
                </div>
            </div>
        </main>
    );
};