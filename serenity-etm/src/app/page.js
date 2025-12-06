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
        light: {
            low: 'text-light-low-textA',
            mid: 'text-light-mid-textA',
            high: 'text-light-high-textA',
        },
        dark: {},
    };

    const textBClasses = {
        light: {
            low: 'text-light-low-textB',
            mid: 'text-light-mid-textB',
            high: 'text-light-high-textB',
        },
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
            low: 'bg-light-low-button hover:bg-light-low-buttonHover',
            mid: 'bg-light-mid-button hover:bg-light-mid-buttonHover',
            high: 'bg-light-high-button hover:bg-light-high-buttonHover',
        },
        dark: {},
    };    

    return (
        <main
            className={`relative min-h-screen ${textAClasses[theme][stressPalette]} ${bgClasses[theme][stressPalette]} overflow-hidden`}
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
                    className='opacity-50'
                />}
                navLinks={[
                    {label: 'Home', href: '/'},
                    {label: 'Terms & Conditions', href: '/terms'},
                ]}
                sticky
                textClass={textBClasses[theme]}
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
                    
                    md:order-none
                    md:pt-4'
                >
                    <div className='max-w-md p-6'>
                        
                        <h1 className='text-[clamp(4.5rem,7.8vw,8rem)] leading-none font-AbrilFatface transition-colors duration-500 ease-in-out'>Serenity</h1>
                        
                        <h1 className='text-[clamp(1.5rem,2.5vw,3rem)] leading-none font-AbrilFatface'>Email & Task Manager</h1>
                        
                        <p className={`pt-10 ${textAClasses[theme][stressPalette]} font-Roboto text-[clamp(0.8rem,1.2vw,1rem)] leading-snug`}>Stay productive, stay calm: your stress-aware inbox.</p>
                    
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
                        
                        <p className={`${textBClasses[theme][stressPalette]} font-Roboto text-[clamp(0.6rem,0.9vw,1rem)] leading-snug`}>
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
                            
                            <label htmlFor='accept' className={`${textBClasses[theme][stressPalette]} font-Roboto text-[clamp(0.6rem,0.9vw,1rem)] leading-snug`}>I agree to the&nbsp;
                                
                                <button
                                    className='underline hover:text-blue-400'
                                    onClick={()=> router.push('/terms')}
                                >Terms and Conditions</button>
                            
                            </label>
                        
                        </div>

                        <button
                            disabled={!accepted}
                            className={`font-Roboto text-[clamp(0.8rem,1.1vw,1rem)] leading-snug w-full py-3 rounded-full font-medium transition-colors ${accepted
                                ? `${buttonClasses[theme][stressPalette]} text-white cursor-pointer`
                                : 'bg-neutral-600 text-neutral-400 cursor-not-allowed'
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