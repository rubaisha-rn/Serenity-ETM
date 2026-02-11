// complete
'use client';

import { useEffect, useState, useMemo } from 'react';
import { motion, useReducedMotion } from "framer-motion";
import useStore from '@/store/useStore';
import { useRouter } from 'next/navigation';
import { ICONS } from '@/lib/assets';
import ProfileSettingsMenu from '../profileSettings';

export default function CollapsableLeftSidebar() {

    const router = useRouter();

    const {screen, setScreen, theme, setTheme, expandedSecondary, setExpandedSecondary, fontScale} = useStore();

    const [mounted, setMounted] = useState(false);

    const prefersReducedMotion = useReducedMotion()

    const motionConfig = prefersReducedMotion
        ? {}
        : {
            whileHover: {scale: 1.05},
            whileTap: {scale: 0.95},
    };
    
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
            className='fixed top-1 left-1 z-20 bg-[var(--baseAcc-a)] shadow-xl flex flex-col justify-between rounded-lg px-1 py-2 w-10 sm:w-12 h-[calc(100vh-0.5rem)]'
            style={{fontSize: `${fontScale}rem`}}
        >
            {/* navigation buttons */}
            <div role='menu' className='flex flex-col items-center gap-1.5'>
                
                {/* brand logo */}
                <img
                    src='/logo/logo.png'
                    alt='Serenity ETM'
                    className="w-7 h-7"
                    draggable={false}
                /> 

                {/* dashboard button */}
                <div className='flex flex-row items-center'>
                    
                    {screen === 'dashboard' && (
                        <div className='absolute left-0 h-6 w-1 bg-[var(--g-main)] rounded-full shadow'/>
                    )}

                    <motion.button
                        {...motionConfig}
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
                        className={`leftmain-sidebar-btn 
                            ${screen==='dashboard' ? 'bg-[var(--a-main)]' : ''}`}
                    >
                        <img
                            src={ICONS[theme].dashboard}
                            className='w-6 h-6'
                            aria-hidden="true"
                            alt=''
                        />
                    </motion.button>
                </div>

                {/* email manager button */}
                <div className='flex flex-row items-center'>
                    
                    {screen === 'emails' && (
                        <div className='absolute left-0 h-6 w-1 bg-[var(--g-main)] rounded-full shadow'/>
                    )}

                    <motion.button
                        {...motionConfig}
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
                        className={`leftmain-sidebar-btn 
                            ${screen==='emails' ? 'bg-[var(--a-main)]' : ''}`}
                    >
                        <img
                            src={ICONS[theme].email}
                            alt=''
                            aria-hidden='true'
                            className='w-6 h-6'
                        />
                    </motion.button>
                </div>

                {/* task manager button */}
                <div className='flex flex-row items-center'>
                    
                    {screen === 'tasks' && (
                        <div className='absolute left-0 h-6 w-1 bg-[var(--g-main)] rounded-full shadow'/>
                    )}
                    <motion.button
                        {...motionConfig}
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
                        className={`leftmain-sidebar-btn 
                            ${screen==='tasks' ? 'bg-[var(--a-main)]' : ''}`}
                    >
                        <img
                            src={ICONS[theme].task}
                            className='w-6 h-6'
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