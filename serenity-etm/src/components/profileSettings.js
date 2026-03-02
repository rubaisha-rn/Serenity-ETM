// add image sizes according to window
'use client'

import {motion, AnimatePresence} from 'framer-motion'
import { useState, useRef, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { supabase } from '@/lib/supabaseClient'
import { ICONS } from '@/lib/assets'
import useStore from '@/store/useStore'
import SettingsModal from './settings/settings'
import { createPortal } from 'react-dom'

export default function ProfileSettingsMenu() {

    const router = useRouter()
    const {theme, setTheme} = useStore();

    const [open, setOpen] = useState(false);
    const [openSettings, setOpenSettings] = useState(false);
    const menuRef = useRef(null);
    const buttonRef = useRef(null);

    const handleSignOut = async () => {
        await supabase.auth.signOut()
        router.push('/login')
    }

    useEffect(() => {
        const handler = (e) => {
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

    // close on escape
    useEffect(() => {
        const handler = (e) => {
            if (e.key === 'Escape') {
                setOpen(false);
                buttonRef.current?.focus();
            }
        };

        document.addEventListener('keydown', handler);
        return () => document.removeEventListener('keydown', handler);
    }, []);

    return (
        <div className='relative'>
            
            {/* profile button */}
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
                className={`side-bar-btn-style hover:bg-[var(--b-main)] p-0.5 ml-0.5 ${open ? 'bg-[var(--a-main)]' : ''}`}>
                <img
                    src={ICONS[theme].profile}
                    className='aspect-square'
                    alt=''
                    aria-hidden="true"
                />
            </motion.button>

            {/* menu */}
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
                        {/* settings */}
                        <button
                            role='menuitem'
                            className='w-full flex items-center justify-start hover:bg-[var(--b-main)] rounded motion-safe:transition-colors z-20 side-bar-menuitem border-b-[0.02rem] border-b-white/15'
                            onClick={() => {
                                setOpenSettings(true)
                                setOpen(false);
                            }}
                        >
                            <img
                                src={ICONS[theme].settings}
                                aria-hidden="true"
                                alt=''
                            />
                            <h6>
                                Settings
                            </h6>
                        </button>

                        {/* sign out */}
                        <button
                            role='menuitem'
                            className='w-full flex items-center justify-start hover:bg-[var(--b-main)] rounded motion-safe:transition-colors z-20 side-bar-menuitem'
                            onClick={handleSignOut}
                        >
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

            <SettingsModal open={openSettings} onClose={() => setOpenSettings(false)} />

        </div>
    )
}