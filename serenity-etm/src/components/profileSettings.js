/**
 * Component renders profile button in right sidebar and displays a dropdown menu to manage settings and sign out.
 */

'use client'

import {motion, AnimatePresence} from 'framer-motion'
import { useState, useRef, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { supabase } from '@/lib/supabaseClient'
import { ICONS } from '@/lib/assets'
import useStore from '@/store/useStore'
import SettingsModal from './settings/settings'

export default function ProfileSettingsMenu() {

    // For redirecting
    const router = useRouter()

    // Store values
    const {setTheme, setThemeMode} = useStore();
    const theme = useStore((s) => s.theme);

    // Controls opening dropdown menu and settings modal
    const [open, setOpen] = useState(false);
    const [openSettings, setOpenSettings] = useState(false);

    // Used to detect clicks outside menu to automatically close it
    const menuRef = useRef(null);
    const buttonRef = useRef(null);

    /**
     * Handles sign out
     * 
     * Sign out
     * Redirects user to signin page
     * Changes theme mode and theme to default states
     */
    const handleSignOut = async () => {
        await supabase.auth.signOut();
        router.push('/signin');
        setTheme('light');
        setThemeMode('normal');
    }

    /**
     * Closes menu when outside clicked to improve usability.
     */
    useEffect(() => {

        const handler = (e) => {
            
            // If no click inside target space, close menu
            if (
                menuRef.current &&
                !menuRef.current.contains(e.target) &&
                !buttonRef.current.contains(e.target)
            ) {
                setOpen(false);
            }
        };

        document.addEventListener('mousedown', handler);
        return () => document.removeEventListener('mousedown', handler);

    }, []);

    /**
     * Close menu on escape press
     */
    useEffect(() => {

        const handler = (e) => {
        
            if (e.key === 'Escape') {
                setOpen(false);

                // Return focus to profile button so users don't lose focus context
                buttonRef.current?.focus();
            }
        };

        document.addEventListener('keydown', handler);
        return () => document.removeEventListener('keydown', handler);

    }, []);

    return (

        // Wrapper container for positioning dropdown
        <div className='relative'>
            
            {/* Profile button */}
            <motion.button 
                ref={buttonRef}
                type='button'
                aria-haspopup="menu"
                aria-expanded={open}
                aria-label='Open Profile menu'
                title='Profile'
                whileHover={{scale: 1.05}}
                whileTap={{scale: 0.95}}
                onClick={() => setOpen((v) => !v)}
                onKeyDown={(e) => {
                    if (e.key === 'Enter' || e.key === ' ') {
                        e.preventDefault();
                        setOpen((v) => !v);
                    }
                }}
                className={`side-bar-btn-style hover:bg-[var(--b-main)] p-0.5 ml-0.5 ${open ? 'bg-[var(--a-main)]' : ''}`}
            >
                {/* Profile icon */}
                <img
                    src={ICONS[theme].profile}
                    className='aspect-square'
                    alt=''
                    aria-hidden="true"
                />
            </motion.button>

            {/* Dropdown menu */}
            <AnimatePresence>

                {open && (
                
                    <motion.div
                        initial={{opacity: 0}}
                        animate={{opacity: 1}}
                        exit={{opacity: 0}}
                        transition={{duration: 0.12}}
                        ref={menuRef}
                        role='menu'
                        aria-label='Profile Menu'
                        className='absolute bottom-0 left-full bg-[var(--baseAcc-a)] shadow-xl text-[var(--text-d)] shadow-xl z-20 side-bar-menu'
                    >
                        {/* Settings button */}
                        <button
                            role='menuitem'
                            aria-label='Open settings'
                            className='w-full flex items-center justify-start hover:bg-[var(--b-main)] rounded motion-safe:transition-colors z-20 side-bar-menuitem border-b-[0.02rem] border-b-white/15'
                            onClick={() => {
                                setOpenSettings(true)
                                setOpen(false);
                            }}
                        >
                            {/* Icon and label */}
                            <img
                                src={ICONS[theme].settings}
                                aria-hidden="true"
                                alt=''
                            />
                            <h6>
                                Settings
                            </h6>
                        </button>

                        {/* Sign out */}
                        <button
                            role='menuitem'
                            aria-label='Sign out of your account'
                            className='w-full flex items-center justify-start hover:bg-[var(--b-main)] rounded motion-safe:transition-colors z-20 side-bar-menuitem'
                            onClick={handleSignOut}
                        >
                            {/* Icon and label */}
                            <img
                                src={ICONS[theme].signout}
                                aria-hidden="true"
                                alt=''
                            />
                            <h6>
                                Sign out
                            </h6>
                        </button>

                    </motion.div>
                )}
            </AnimatePresence>  

            {/* Settings modal displayed when openSettings set true. */}
            <SettingsModal 
                open={openSettings} 
                onClose={() => setOpenSettings(false)} 
            />
        </div>
    )
}