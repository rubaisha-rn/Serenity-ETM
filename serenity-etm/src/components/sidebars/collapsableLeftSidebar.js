'use client';

import { useEffect, useState } from 'react';
import { motion } from "framer-motion";
import useStore from '@/store/useStore';
import { useRouter } from 'next/navigation';
import { supabase } from '@/lib/supabaseClient';

const IMG = {
    email: '/icons/email.png',
    tasks: '/icons/tasks.png',
    menu: '/icons/menuOpen.png',
    logout: '/icons/logout.png',
};

export default function CollapsableLeftSidebar() {

    const router = useRouter();

    const {screen, setScreen, setTheme, expandedMain, setExpandedMain, expandedSecondary, setExpandedSecondary} = useStore();

    useEffect(() => {
        const darkModeEnabled = document.documentElement.classList.contains('dark');
        setTheme(darkModeEnabled ? 'dark' : 'light');
    }, []);

    const handleLogout = async () => {
        await supabase.auth.signOut()
        router.push('/login')
    }

    const [mounted, setMounted] = useState(false)
    useEffect(() => {
        setMounted(true)
    }, [])

    if (!mounted) return null
    return (
        <>
            {/* toggle button */}
            <motion.button
                whileHover={{scale: 1.1}}
                whileTap={{scale: 0.9}}
                animate={{left: expandedMain? 202 : 22, width: expandedMain? '200' : '40'}}
                transition={{duration: 0.25, ease: 'easeInOut'}}
                onClick={() => setExpandedMain(!expandedMain)}
                className={`fixed bottom-2 z-20 bg-[var(--acc-main)] hover:bg-[var(--accHover-main)] shadow-xl p-1.5 pl-6 rounded-full`}
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
                className={`fixed top-0 left-0 z-20 bg-[var(--bg-main)] shadow-lg flex flex-col justify-between h-screen overflow-hidden py-4 pt-0`}
                style={{ overflow: 'clip' }}
            >
                <div className='flex flex-col items-center w-full p-4 gap-3'>

                    {/* menu button */}
                    <motion.div
                        whileHover={{scale: 1.05}}
                        whileTap={{scale: 0.95}}
                        onClick={() => setExpandedSecondary(!expandedSecondary)}
                        className={`flex items-center 
                            ${expandedMain ? 'gap-3 w-full h-9 px-3 rounded-lg justify-start' : 'gap-0 justify-center p-1.5 rounded-md'} 
                            ${expandedSecondary ? 'bg-[var(--a-main)] hover:bg-[var(--aHover-main)]' : 'bg-[var(--icons-main)] hover:bg-[var(--iconsHover-main)]'}`}
                    >
                        <img
                            src={IMG.menu}
                            alt='menu'
                            className='w-5 h-5 opacity-80 shrink-0'
                        />

                        <span className={`text-[var(--text-a)] text-sm whitespace-nowrap transition-all duration-150 ${expandedMain ? 'opacity-100' : 'opacity-0 w-0 overflow-hidden'}`}>
                            Menu
                        </span>

                    </motion.div>

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
                            ${screen==='emails' ? 'bg-[var(--a-main)] hover:bg-[var(--aHover-main)]' : 'bg-[var(--icons-main)] hover:bg-[var(--iconsHover-main)]'}
                            ${screen === 'emails' && !expandedMain ? 'py-8 px-1.5 rounded-md' : 'p-1.5 rounded-md'}`}
                    >
                        <img
                            src={IMG.email}
                            alt='email manager'
                            className='w-5 h-5 opacity-80 shrink-0'
                        />

                        <span className={`text-[var(--text-a)] text-sm whitespace-nowrap transition-all duration-150 ${expandedMain ? 'opacity-100' : 'opacity-0 w-0 overflow-hidden'}`}>
                            Email Manager
                        </span>

                    </motion.button>

                    {/* tasks button */}
                    <motion.button
                        whileHover={{scale: 1.05}}
                        whileTap={{scale: 0.95}}
                        onClick={() => {
                            setScreen('tasks')
                            router.push('/tasks')
                        }}
                        className={`flex items-center 
                            ${expandedMain ? 'gap-3 w-full h-9 px-3 rounded-lg justify-start' : 'gap-0 p-0.5 justify-center rounded-full'} 
                            ${screen==='tasks' ? 'bg-[var(--a-main)] hover:bg-[var(--aHover-main)]' : 'bg-[var(--icons-main)] hover:bg-[var(--iconsHover-main)]'} 
                            ${screen === 'tasks' && !expandedMain ? 'py-8 px-1.5 rounded-md' : 'p-1.5 rounded-md'}`}
                    >
                        <img
                            src={IMG.tasks}
                            alt='task manager'
                            className='w-5 h-5 opacity-80 shrink-0'
                        />

                        <span className={`text-[var(--text-a)] text-sm whitespace-nowrap transition-all duration-150 ${expandedMain ? 'opacity-100' : 'opacity-0 w-0 overflow-hidden'}`}>
                            Task Manager
                        </span>

                    </motion.button>

                </div>

                <div className={`flex ${expandedMain? 'flex-col' : ''} justify-center px-4 gap-1`}>
                    {/* logout button */}
                    <motion.button
                        whileHover={{scale: 1.05}}
                        whileTap={{scale: 0.95}}
                        onClick={handleLogout}
                        className={`flex items-center 
                            ${expandedMain ? 'gap-3 w-full h-9 px-3 rounded-lg justify-start' : 'gap-0 p-0.5 justify-center rounded-full p-1.5 rounded-md'} bg-[var(--icons-main)] hover:bg-[var(--iconsHover-main)]`}
                    >
                        <img
                            src={IMG.logout}
                            alt='logout'
                            className='w-5 h-5 opacity-80 shrink-0'
                        />

                        <span className={`text-[var(--text-a)] text-sm whitespace-nowrap transition-all duration-150 ${expandedMain ? 'opacity-100' : 'opacity-0 w-0 overflow-hidden'}`}>
                            Logout
                        </span>

                    </motion.button>
                </div>

            </motion.div>
        </>
    );
}