'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';

import FloatingBlobs from '@/components/floatingblobs';
import StressControl from '@/components/stressControl';
import useStore from '@/store/useStore';
import Header from '@/components/header';
import Image from 'next/image';
import PrototypeTag from '@/components/prototypeTag';
import Footer from '@/components/footer';

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

    const headingClasses = {
        light: {
            low: 'text-light-low-acc',
            mid: 'text-light-mid-acc',
            high: 'text-light-high-acc',
        },
        dark: {},
    };

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
            low: 'bg-light-low-acc hover:bg-light-low-accHover border-light-low-a border-2',
            mid: 'bg-light-mid-acc hover:bg-light-mid-accHover border-light-mid-a border-2',
            high: 'bg-light-high-acc hover:bg-light-high-accHover border-light-high-a border-2',
        },
        dark: {},
    };    

    return (
        <div className={`${headingClasses[theme][stressPalette]}`}>

            <Header
                title="Serenity ETM"
                logo={<Image
                    src="/logo/logo.png"
                    alt='Serenity ETM Logo'
                    width={18}
                    height={18}
                    priority
                />}
                thisPage = '/'
                sticky
            />

            <main className={`relative min-h-screen overflow-hidden ${bgClasses[theme][stressPalette]}`}>
                
                <PrototypeTag />
                <FloatingBlobs className='z-0'/>
                {/* <StressControl className='z-10' /> */}

                <div
                    className='
                        relative z-10 
                        md:grid md:grid-cols-1 md:grid-rows-1 
                        h-screen
                        gap-6 p-8
                        md:p-10
                        md:mt-0'
                >
                    <div
                        className='flex 
                        items-end
                        justify-start
                        h-full
                        order-1
                        
                        md:order-none'
                    >
                        <div className='max-w-md p-6 pt-0'>
                            
                            <h1 className='text-8xl leading-none font-AbrilFatface transition-colors duration-500 ease-in-out opacity-85'>Serenity</h1>
                            
                            <h1 className='text-[clamp(1.5rem,2.5vw,3rem)] leading-none font-AbrilFatface opacity-80'>Email & Task Manager</h1>
                            
                            <p className={`pt-6 ${textAClasses[theme]} font-Roboto text-[clamp(0.8rem,1.2vw,1rem)] leading-snug`}>Stay productive, stay calm: your stress-aware inbox.</p>

                            <div className='flex items-center space-x-2 pt-6 pb-1'>
                                
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

                            <div className='flex flex-row gap-1'>
                                <button
                                    disabled={!accepted}
                                    className={`flex-[3] font-Roboto text-[clamp(0.8rem,1.05vw,1rem)] leading-snug py-2.5 px-8 rounded-full transition-colors ${accepted
                                        ? `${buttonClasses[theme][stressPalette]} text-white cursor-pointer`
                                        : `${buttonClasses[theme][stressPalette]} text-white opacity-40 pointer-events-none cursor-not-allowed`
                                    }`}
                                    onClick={() => router.push('/emails')}
                                >
                                    Enter Serenity Workplace
                                </button>

                                <button
                                    className={`flex-[1] font-Roboto text-[clamp(0.8rem,1.05vw,1rem)] leading-snug py-2.5 px-8 rounded-full transition-colors ${buttonClasses[theme][stressPalette]} ${textBClasses[theme]} bg-white cursor-pointer bg-transparent`}
                                    onClick={() => router.push('/emails')}
                                >
                                    Demo
                                </button>

                            </div>
                        </div>
                    </div>
                    <div/>
                </div>

                <Footer />

            </main>
        </div>
    );
};