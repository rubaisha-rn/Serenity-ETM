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

    const expandedMain = useStore((s) => s.expandedMain);
    const setExpandedMain = useStore((s) => s.setExpandedMain);

    const {screen, setScreen, emotionValue} = useStore();

    const expandedSecondary = useStore((s) => s.expandedSecondary);
    const setExpandedSecondary = useStore((s) => s.setExpandedSecondary);
    
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

    const textClasses = {
        light: 'text-light-textA',
        dark: {},
    };

    const blankCardClasses = {
        light: {
            low: 'bg-light-low-blankCard',
            mid: 'bg-light-mid-blankCard',
            high: 'bg-light-high-blankCard',
        },
        dark: {},
    };

    const accClasses = {
        light: {
            low: 'bg-light-low-acc hover:bg-light-low-accHover',
            mid: 'bg-light-mid-acc hover:bg-light-mid-accHover',
            high: 'bg-light-high-acc hover:bg-light-high-accHover',
        },
        dark: {},
    };

    const activeButtonClasses = {
        light: {
            low: 'bg-light-low-a bg-opacity-70 hover:bg-light-low-a hover:bg-opacity-100',
            mid: 'bg-light-mid-a bg-opacity-70 hover:bg-light-mid-a hover:bg-opacity-100',
            high: 'bg-light-high-a bg-opacity-70 hover:bg-light-high-a hover:bg-opacity-100',
        },
        dark: {},
    }

    const inactiveButtonClasses = {
        light: {
            low: 'bg-light-low-icons bg-opacity-20 hover:bg-light-low-icons hover:bg-opacity-50',
            mid: 'bg-light-mid-icons bg-opacity-20 hover:bg-light-mid-icons hover:bg-opacity-50',
            high: 'bg-light-high-icons bg-opacity-20 hover:bg-light-high-icons hover:bg-opacity-50',
        },
        dark: {},
    };

    return (
        <>
            {/* toggle button */}
            <motion.button
                whileHover={{scale: 1.1}}
                whileTap={{scale: 0.9}}
                animate={{left: expandedMain? 202 : 22, width: expandedMain? '200' : '40'}}
                transition={{duration: 0.25, ease: 'easeInOut'}}
                onClick={() => setExpandedMain(!expandedMain)}
                className={`fixed bottom-2 z-20 ${accClasses[theme][stressPalette]} shadow-xl p-1.5 pl-6 rounded-full`}
            >
                <img
                    src='/icons/backw.png'
                    alt='close arrow'
                    className={`w-5 h-5 opacity-80 ${expandedMain? '' : 'rotate-180'}`}
                /> 

            </motion.button>

            {/* side bar */}
            <motion.div
                initial={{width: 40}}
                animate={{width: expandedMain? 220 : 40}}
                transition={{type: 'spring', stiffness: 260, damping: 20}}
                className={`fixed top-0 left-0 z-30 ${blankCardClasses[theme][stressPalette]} flex flex-col justify-between h-screen shadow-xl overflow-hidden py-6 pt-6`}
                style={{ overflow: 'clip' }}
            >
                <div className='flex flex-col items-center w-full p-4 gap-3'>

                    {/* menu button */}
                    <motion.button
                        whileHover={{scale: 1.05}}
                        whileTap={{scale: 0.95}}
                        onClick={() => setExpandedSecondary(!expandedSecondary)}
                        className={`flex items-center 
                            ${expandedMain ? 'gap-3 w-full h-9 px-3 rounded-lg justify-start' : 'gap-0 justify-center p-1.5 rounded-md'} 
                            ${expandedSecondary ? `${activeButtonClasses[theme][stressPalette]}` : `${inactiveButtonClasses[theme][stressPalette]}`}`}
                    >
                        <img
                            src={IMG.menu}
                            alt='menu'
                            className='w-5 h-5 opacity-80 shrink-0'
                        />

                        <span className={`${textClasses[theme]} text-sm whitespace-nowrap transition-all duration-150 ${expandedMain ? 'opacity-100' : 'opacity-0 w-0 overflow-hidden'}`}>
                            Menu
                        </span>

                    </motion.button>

                    {/* emails button */}
                    <motion.button
                        whileHover={{scale: 1.05}}
                        whileTap={{scale: 0.95}}
                        onClick={() => {
                            setScreen('emails')
                            router.push('/emails')    
                        }}
                        className={`flex items-center 
                            ${expandedMain ? 'gap-3 w-full h-9 px-3 rounded-lg justify-start' : 'gap-0 p-0.5 justify-center rounded-full'} 
                            ${screen==='emails' ? `${activeButtonClasses[theme][stressPalette]}` : `${inactiveButtonClasses[theme][stressPalette]}`} 
                            ${screen === 'emails' && !expandedMain ? 'py-8 px-1.5 rounded-md' : 'p-1.5 rounded-md'}`}
                    >
                        <img
                            src={IMG.email}
                            alt='email manager'
                            className='w-5 h-5 opacity-80 shrink-0'
                        />

                        <span className={`${textClasses[theme]} text-sm whitespace-nowrap transition-all duration-150 ${expandedMain ? 'opacity-100' : 'opacity-0 w-0 overflow-hidden'}`}>
                            Email Manager
                        </span>

                    </motion.button>

                    {/* tasks button */}
                    <motion.button
                        whileHover={{scale: 1.05}}
                        whileTap={{scale: 0.95}}
                        onClick={() => setScreen('tasks')}
                        className={`flex items-center 
                            ${expandedMain ? 'gap-3 w-full h-9 px-3 rounded-lg justify-start' : 'gap-0 p-0.5 justify-center rounded-full'} 
                            ${screen==='tasks' ? `${activeButtonClasses[theme][stressPalette]}` : `${inactiveButtonClasses[theme][stressPalette]}`} 
                            ${screen === 'tasks' && !expandedMain ? 'py-8 px-1.5 rounded-md' : 'p-1.5 rounded-md'}`}
                    >
                        <img
                            src={IMG.tasks}
                            alt='task manager'
                            className='w-5 h-5 opacity-80 shrink-0'
                        />

                        <span className={`${textClasses[theme]} text-sm whitespace-nowrap transition-all duration-150 ${expandedMain ? 'opacity-100' : 'opacity-0 w-0 overflow-hidden'}`}>
                            Task Manager
                        </span>

                    </motion.button>

                </div>

                <div className={`flex ${expandedMain? 'flex-col' : ''} justify-center px-4 gap-1`}>
                    {/* logout button */}
                    <motion.button
                        whileHover={{scale: 1.05}}
                        whileTap={{scale: 0.95}}
                        onClick={() => router.push('/')}
                        className={`flex items-center 
                            ${expandedMain ? 'gap-3 w-full h-9 px-3 rounded-lg justify-start' : 'gap-0 p-0.5 justify-center rounded-full p-1.5 rounded-md'} ${inactiveButtonClasses[theme][stressPalette]}`}
                    >
                        <img
                            src={IMG.logout}
                            alt='logout'
                            className='w-5 h-5 opacity-80 shrink-0'
                        />

                        <span className={`${textClasses[theme]} text-sm whitespace-nowrap transition-all duration-150 ${expandedMain ? 'opacity-100' : 'opacity-0 w-0 overflow-hidden'}`}>
                            Logout
                        </span>

                    </motion.button>
                </div>

            </motion.div>
        </>
    );
}