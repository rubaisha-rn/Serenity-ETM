'use client';

import { useState, useEffect } from 'react';
import { motion } from "framer-motion";
import useStore from '@/store/useStore';
import { useRouter } from 'next/navigation';

const IMG = {
    email: '/icons/email.png',
    tasks: '/icons/tasks.png',
    menu: '/icons/menuOpen.png',
    logout: '/icons/logout.png',
};

export default function CollapsableLeftSidebar() {

    const router = useRouter();

    const [expanded, setExpanded] = useState(false);

    const {screen, setScreen, emotionValue} = useStore();
    const secondBarExpanded = useStore((s) => s.secondBarExpanded);
    const setSecondBarExpanded = useStore((s) => s.setSecondBarExpanded);
    
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

    const cardClasses = {
        light: {
            low: 'bg-light-low-card',
            mid: 'bg-light-mid-card',
            high: 'bg-light-high-card',
        },
        dark: {},
    };

    const themeAClasses = {
        light: {
            low: 'bg-light-low-a',
            mid: 'bg-light-mid-a',
            high: 'bg-light-high-a',
        },
        dark: {},
    }

    const accClasses = {
        light: {
            low: 'bg-light-low-acc hover:bg-light-low-accHover',
            mid: 'bg-light-mid-acc hover:bg-light-mid-accHover',
            high: 'bg-light-high-acc hover:bg-light-high-accHover',
        },
        dark: {},
    };

    const buttonClasses = {
        light: {
            low: 'bg-light-low-icons hover:bg-light-low-b',
            mid: 'bg-light-mid-icons hover:bg-light-mid-b',
            high: 'bg-light-high-icons hover:bg-light-high-b',
        },
        dark: {},
    };

    return (
        <>
            {/* toggle button */}
            <motion.button
                whileHover={{scale: 1.1}}
                whileTap={{scale: 0.9}}
                animate={{left: expanded ? 202 : 22, width: expanded ? '200' : '40'}}
                transition={{duration: 0.25, ease: 'easeInOut'}}
                onClick={() => setExpanded(!expanded)}
                className={`fixed bottom-2 z-20 ${accClasses[theme][stressPalette]} shadow-xl p-1.5 pl-6 rounded-full`}
            >
                <img
                    src='/icons/backw.png'
                    alt='close arrow'
                    className={`w-5 h-5 opacity-80 ${expanded ? '' : 'rotate-180'}`}
                /> 

            </motion.button>

            {/* side bar */}
            <motion.div
                initial={{width: 40}}
                animate={{width: expanded ? 220 : 40}}
                transition={{type: 'spring', stiffness: 260, damping: 20}}
                className={`fixed top-0 left-0 z-30 ${cardClasses[theme][stressPalette]} flex flex-col justify-between h-screen shadow-xl overflow-hidden py-6 pt-6`}
                style={{ overflow: 'clip' }}
            >
                <div className='flex flex-col items-center w-full p-4 gap-4'>

                    {/* menu button */}
                    <motion.button
                        whileHover={{scale: 1.05}}
                        whileTap={{scale: 0.95}}
                        onClick={() => setSecondBarExpanded(!secondBarExpanded)}
                        className={`flex items-center ${buttonClasses[theme][stressPalette]} bg-opacity-25 hover:bg-opacity-40 ${expanded ? 'gap-3 w-full h-9 px-3 rounded-lg justify-start' : 'gap-0 p-0.5 justify-center rounded-full'}`}
                    >
                        <img
                            src={IMG.menu}
                            alt='menu'
                            className='w-5 h-5 opacity-80 shrink-0'
                        />

                        <span className={`${textAClasses[theme]} text-sm whitespace-nowrap transition-all duration-150 ${expanded? 'opacity-100' : 'opacity-0 w-0 overflow-hidden'}`}>
                            Menu
                        </span>

                    </motion.button>

                    {/* emails button */}
                    <motion.button
                        whileHover={{scale: 1.05}}
                        whileTap={{scale: 0.95}}
                        onClick={() => setScreen('emails')}
                        className={`flex items-center ${buttonClasses[theme][stressPalette]} bg-opacity-25 hover:bg-opacity-40 ${expanded ? 'gap-3 w-full h-9 px-3 rounded-lg justify-start' : 'gap-0 p-0.5 justify-center rounded-full'} ${screen==='emails' ? `${themeAClasses[theme][stressPalette]} bg-opacity-100` : ''} ${screen === 'emails' && !expanded ? 'py-8 px-2 rounded-md' : ''}`}
                    >
                        <img
                            src={IMG.email}
                            alt='email manager'
                            className='w-5 h-5 opacity-80 shrink-0'
                        />

                        <span className={`${textAClasses[theme]} text-sm whitespace-nowrap transition-all duration-150 ${expanded? 'opacity-100' : 'opacity-0 w-0 overflow-hidden'}`}>
                            Email Manager
                        </span>

                    </motion.button>

                    {/* tasks button */}
                    <motion.button
                        whileHover={{scale: 1.05}}
                        whileTap={{scale: 0.95}}
                        onClick={() => setScreen('tasks')}
                        className={`flex items-center ${buttonClasses[theme][stressPalette]} bg-opacity-25 hover:bg-opacity-40 ${expanded ? 'gap-3 w-full h-9 px-3 rounded-lg justify-start' : 'gap-0 p-0.5 justify-center rounded-full'} ${screen==='tasks' ? `${themeAClasses[theme][stressPalette]} bg-opacity-100` : ''} ${screen === 'tasks' && !expanded ? 'py-8 px-2 rounded-md' : ''}`}
                    >
                        <img
                            src={IMG.tasks}
                            alt='task manager'
                            className='w-5 h-5 opacity-80 shrink-0'
                        />

                        <span className={`${textAClasses[theme]} text-sm whitespace-nowrap transition-all duration-150 ${expanded? 'opacity-100' : 'opacity-0 w-0 overflow-hidden'}`}>
                            Task Manager
                        </span>

                    </motion.button>

                </div>

                <div className={`flex ${expanded ? 'flex-col' : ''} justify-center px-4 gap-1`}>
                    {/* logout button */}
                    <motion.button
                        whileHover={{scale: 1.05}}
                        whileTap={{scale: 0.95}}
                        onClick={() => router.push('/')}
                        className={`flex items-center ${buttonClasses[theme][stressPalette]} bg-opacity-25 hover:bg-opacity-40 ${expanded ? 'gap-3 w-full h-9 px-3 rounded-lg justify-start' : 'gap-0 p-0.5 justify-center rounded-full'}`}
                    >
                        <img
                            src={IMG.logout}
                            alt='logout'
                            className='w-5 h-5 opacity-80 shrink-0'
                        />

                        <span className={`${textAClasses[theme]} text-sm whitespace-nowrap transition-all duration-150 ${expanded? 'opacity-100' : 'opacity-0 w-0 overflow-hidden'}`}>
                            Logout
                        </span>

                    </motion.button>
                </div>

            </motion.div>
        </>
    );
}