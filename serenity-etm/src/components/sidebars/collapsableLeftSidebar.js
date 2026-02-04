'use client';

import { useEffect, useState } from 'react';
import { motion } from "framer-motion";
import useStore from '@/store/useStore';
import { useRouter } from 'next/navigation';
import { supabase } from '@/lib/supabaseClient';
import { ICONS } from '@/lib/assets';

const IMG = {
    email: '/icons/email.png',
    tasks: '/icons/tasks.png',
    menu: '/icons/menuOpen.png',
    logout: '/icons/logout.png',
};

export default function CollapsableLeftSidebar() {

    const router = useRouter();

    const {screen, setScreen, theme, setTheme, expandedMain, setExpandedMain, expandedSecondary, setExpandedSecondary} = useStore();

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
        <div
            className={`fixed top-1 left-1 z-20 bg-[var(--baseAcc-main)] shadow-xl flex flex-col justify-between rounded-lg overflow-hidden p-2`}
            style={{height: 'calc(100vh - 0.5rem)',
                maxHeight: 'calc(100vh - 0.5rem)',
                width: 48
            }}
        >
            <div className='flex flex-col items-center w-full gap-2'>
                
                {/* brand logo */}
                <img
                    src='/logo/logo.png'
                    alt='Serenity ETM Logo'
                    className="w-7 h-7 shrink-0"
                /> 

                {/* dashboard button */}
                <motion.button
                    whileHover={{scale: 1.05}}
                    whileTap={{scale: 0.95}}
                    onClick={() => {}}
                    className={`flex items-center 
                        ${screen==='' ? 'bg-[var(--baseAcc2-main)]' : 'bg-none'} hover:bg-[var(--baseAcc3-main)] rounded-md p-1`}
                >
                    <img
                        src={ICONS[theme].dashboard}
                        className='w-6 h-6 shrink-0'
                    />
                </motion.button>

                {/* emails button */}
                <motion.button
                    whileHover={{scale: 1.05}}
                    whileTap={{scale: 0.95}}
                    onClick={() => {
                        if (screen !== 'emails'){
                            setScreen('emails')
                            router.push('/emails')  
                            setExpandedSecondary(true)
                        }
                        else {
                            setExpandedSecondary(!expandedSecondary)
                        }  
                    }}
                    className={`flex items-center 
                        ${screen==='emails' ? 'bg-[var(--baseAcc2-main)]' : 'bg-none'} hover:bg-[var(--baseAcc3-main)] rounded-md p-1`}
                >
                    <img
                        src={ICONS[theme].email}
                        alt='Email Manager'
                        aria-label='Open Email Manager'
                        className='w-6 h-6 shrink-0'
                    />
                </motion.button>

                {/* tasks button */}
                <motion.button
                    whileHover={{scale: 1.05}}
                    whileTap={{scale: 0.95}}
                    onClick={() => {
                        if (screen !== 'tasks'){
                            setScreen('tasks')
                            router.push('/tasks')  
                            setExpandedSecondary(true)
                        }
                        else {
                            setExpandedSecondary(!expandedSecondary)
                        }
                    }}
                    className={`flex items-center 
                        ${screen==='tasks' ? 'bg-[var(--baseAcc2-main)]' : 'bg-none'} hover:bg-[var(--baseAcc3-main)] rounded-md p-1`}
                >
                    <img
                        src={ICONS[theme].task}
                        alt='task manager'
                        className='w-6 h-6 shrink-0'
                    />
                </motion.button>

            </div>

            <div className={`flex ${expandedMain? 'flex-col' : ''} justify-center px-4 gap-1`}>

                {/* logout button */}
                <motion.button
                    whileHover={{scale: 1.05}}
                    whileTap={{scale: 0.95}}
                    onClick={handleLogout}
                    className={`flex items-center 
                        bg-none hover:bg-[var(--baseAcc3-main)] rounded-md p-1`}
                >
                    <img
                        src={ICONS[theme].profileSettings}
                        className='w-6 h-6 shrink-0'
                    />
                </motion.button>
            
            </div>
        </div>
    );
}