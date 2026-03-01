// complete
'use client';

import { useEffect, useState } from 'react';
import { motion } from "framer-motion";
import useStore from '@/store/useStore';
import { useRouter } from 'next/navigation';
import { ICONS } from '@/lib/assets';
import ProfileSettingsMenu from '../profileSettings';

export default function CollapsableLeftSidebar() {

    const router = useRouter();
    const {screen, setScreen, theme, setTheme, expandedSecondary, setExpandedSecondary} = useStore();

    const [mounted, setMounted] = useState(false);
    
    useEffect(() => {
        setMounted(true)
    }, [])

    // keyboard activation helper
    const activate = (e, action) => {
        if (!e) return;

        const key = e.key || e.code;

        if (key === 'Enter' || key === ' ') {
            e.preventDefault();
            action?.();
        }
    };

    useEffect(() => {
        const darkModeEnabled = document.documentElement.classList.contains('dark');
        setTheme(darkModeEnabled ? 'dark' : 'light');
    }, []);

    if (!mounted) return null;

    return (
        <nav
            aria-label='Primary Navigation'
            className='fixed top-1 flex flex-col justify-between shadow-xl z-20 side-bar left-1 bg-[var(--baseAcc-a)]'
        >
            {/* navigation buttons */}
            <div role='menu' className='items-center side-bar-btn flex flex-col'>
                
                {/* brand logo */}
                <img
                    src='/logo/logo.png'
                    alt='Serenity ETM'
                    draggable={false}
                /> 

                {/* dashboard button */}
                <div className='flex flex-row items-center'>

                    {/* active bar indicator */}
                    {screen === 'dashboard' && (
                        <div className='absolute bg-[var(--g-main)] rounded-full shadow side-bar-btn-active left-0'/>
                    )}

                    <motion.button
                        whileHover={{scale: 1.05}}
                        whileTap={{scale: 0.95}}
                        type='button'
                        role='menuitem'
                        aria-label='Open dashboard'
                        aria-expanded={screen === 'dashboard'}
                        aria-current={screen === 'dashboard' ? 'page' : undefined}
                        title='Dashboard'
                        onClick={() => {
                            if (screen !== 'dashboard'){
                                setScreen('dashboard')
                                router.push('/dashboard')  
                                setExpandedSecondary(true)
                            }
                            else {
                                setExpandedSecondary(!expandedSecondary)
                            }  
                        }}
                        onKeyDown={(e) => 
                            activate(e, () => {
                                if (screen !== 'dashboard'){
                                    setScreen('dashboard')
                                    router.push('/dashboard')  
                                    setExpandedSecondary(true)
                                }
                                else {
                                    setExpandedSecondary(!expandedSecondary)
                                }
                            })
                        }
                        className={`flex items-center justify-center transition-colors side-bar-btn-style hover:bg-[var(--b-main)] ${screen==='dashboard' ? 'bg-[var(--a-main)]' : ''}`}
                    >
                        <img
                            src={ICONS[theme].dashboard}
                            aria-hidden="true"
                            alt=''
                        />
                    </motion.button>
                </div>

                {/* email manager button */}
                <div className='flex flex-row items-center'>
                    
                    {screen === 'emails' && (
                        <div className='absolute bg-[var(--g-main)] rounded-full shadow side-bar-btn-active left-0'/>
                    )}

                    <motion.button
                        whileHover={{scale: 1.05}}
                        whileTap={{scale: 0.95}}
                        type='button'
                        role='menuitem'
                        aria-label='Open email manager'
                        aria-expanded={screen === 'emails'}
                        aria-current={screen === 'emails' ? 'page' : undefined}
                        title='Email Manager'
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
                        onKeyDown={(e) => 
                            activate(e, () => {
                                if (screen !== 'emails'){
                                    setScreen('emails')
                                    router.push('/emails')  
                                    setExpandedSecondary(true)
                                }
                                else {
                                    setExpandedSecondary(!expandedSecondary)
                                }
                            })
                        }
                        className={`flex items-center justify-center transition-colors side-bar-btn-style hover:bg-[var(--b-main)] ${screen==='emails' ? 'bg-[var(--a-main)]' : ''}`}
                    >
                        <img
                            src={ICONS[theme].emails}
                            alt=''
                            aria-hidden='true'
                        />
                    </motion.button>
                </div>

                {/* task manager button */}
                <div className='flex flex-row items-center'>
                    
                    {screen === 'tasks' && (
                        <div className='absolute bg-[var(--g-main)] rounded-full shadow side-bar-btn-active left-0'/>
                    )}
                    <motion.button
                        whileHover={{scale: 1.05}}
                        whileTap={{scale: 0.95}}
                        type='button'
                        role='menuitem'
                        aria-label='Open task manager'
                        aria-expanded={screen==='tasks'}
                        aria-current={screen==='tasks' ? 'page' : undefined}
                        title='Task Manager'
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
                        onKeyDown={(e) =>
                            activate(e, () => {
                                if (screen !== 'tasks'){
                                    setScreen('tasks')
                                    router.push('/tasks')  
                                    setExpandedSecondary(true)
                                }
                                else {
                                    setExpandedSecondary(!expandedSecondary)
                                }
                            })
                        }
                        className={`flex items-center justify-center transition-colors side-bar-btn-style hover:bg-[var(--b-main)] ${screen==='tasks' ? 'bg-[var(--a-main)]' : ''}`}
                    >
                        <img
                            src={ICONS[theme].tasks}
                            aria-hidden="true"
                            alt=''
                        />
                    </motion.button>
                </div>
            </div>
            
            {/* profile settings section */}
            <ProfileSettingsMenu/>
            
        </nav>
    );
}