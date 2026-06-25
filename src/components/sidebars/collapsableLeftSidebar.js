/**
 * Component renders the primary navigation sidebar as well as selecting which screen to display. 
 * 
 * Manages:
    * Navigation between dashboard, emails, tasks
    * Toggles secondary sidebar
    * Displays profile dropdown menu
    * Displays active navigation state
    * Provides accessible keyboard navigation
 */

'use client';

import { useEffect, useState } from 'react';
import { motion } from "framer-motion";
import useStore from '@/store/useStore';
import { useRouter } from 'next/navigation';
import { ICONS } from '@/lib/assets';
import ProfileSettingsMenu from '../profileSettings';

export default function CollapsableLeftSidebar() {

    // Navigation
    const router = useRouter();

    // Global state values
    const {screen, setScreen, expandedSecondary, setExpandedSecondary} = useStore();
    const theme = useStore((s) => s.theme);

    // Used to avoid hydration mismatch issues
    const [mounted, setMounted] = useState(false);
    
    // Mark component mounted after first render
    useEffect(() => {
        setMounted(true)
    }, [])

    // Keyboard activation helper
    const activate = (e, action) => {

        if (!e) return;

        const key = e.key || e.code;

        // Improve accessibility via keyboard access
        if (key === 'Enter' || key === ' ') {
            e.preventDefault();
            action?.();
        }

    };

    // Prevent rendering until mounted
    if (!mounted) return null;

    return (

        // Primary navigation sidebar
        <nav
            aria-label='Primary Navigation'
            className='fixed top-1 flex flex-col justify-between shadow-xl z-20 side-bar left-1 bg-[var(--baseAcc-a)]'
        >
            
            {/* Navigation buttons */}
            <div 
                role='menu' 
                className='items-center side-bar-btn flex flex-col'
            >
                
                {/* Brand logo */}
                <img
                    src={ICONS[theme].logo}
                    alt='Serenity ETM'
                    draggable={false}
                /> 

                {/* Dashboard button */}
                <div className='flex flex-row items-center'>

                    {/* Active indicator */}
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

                {/* Email manager button */}
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

                {/* Task manager button */}
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
            
            {/* Profile settings section */}
            <ProfileSettingsMenu/>
            
        </nav>
    );
}