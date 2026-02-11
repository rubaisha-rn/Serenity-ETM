'use client'

import {motion, AnimatePresence, useReducedMotion} from 'framer-motion'
import { useState, useRef, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { supabase } from '@/lib/supabaseClient'
import { ICONS } from '@/lib/assets'
import useStore from '@/store/useStore'

export default function ProfileSettingsMenu() {

    const router = useRouter()
    const {theme, fontScale, reducedMotion} = useStore();
    const prefersRecuedMotion = useReducedMotion();

    const [open, setOpen] = useState(false);
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

    const motionConfig = prefersRecuedMotion
        ? {}
        : {
            initial: {opacity: 0},
            animate: {opacity: 1},
            exit: {opacity: 0},
            transition: {duration: 0.12}
        }

    return (
        <div className='relative z-30'>
            
            {/* profile button */}
            <motion.button 
                ref={buttonRef}
                type='button'
                aria-haspopup="menu"
                aria-expanded={open}
                aria-label='Open Profile settings menu'
                title='Profile Settings'
                whileHover={prefersRecuedMotion ? {} : {scale: 1.05}}
                whileTap={prefersRecuedMotion ? {} : {scale: 0.95}}
                onClick={() => setOpen((v) => !v)}
                onKeyDown={(e) => {
                    if (e.key === 'Enter' || e.key === ' ') {
                        e.preventDefault();
                        setOpen((v) => !v);
                    }
                }}
                className={`leftmain-sidebar-btn ml-[0.07rem] p-0.5 sm:p-1 sm:px-1.5 sm:ml-0.5
                    ${open ? 'bg-[var(--a-main)]' : ''}`}>
                <img
                    src={ICONS[theme].profileSettings}
                    className='w-6 h-6 shrink-0'
                    alt=''
                    aria-hidden="true"
                />
            </motion.button>

            {/* menu */}
            <AnimatePresence className='z-30'>
                {open && (
                    <motion.div
                        {...motionConfig}
                        ref={menuRef}
                        role='menu'
                        aria-label='Profile Settings Menu'
                        className='absolute bottom-0 left-full ml-3 w-48 rounded-md bg-[var(--baseAcc-a)] shadow-xl p-0.5 z-50 text-[var(--text-d)] text-[0.85rem] font-thin shadow-xl z-30'
                    >
                        {/* settings */}
                        <button
                            role='menuitem'
                            className='leftmain-menuitem border-b-[0.02rem] border-b-white/20'
                            onClick={() => {}}
                        >
                            <img
                                src={ICONS[theme].settings}
                                className='w-5 h-5'
                                aria-hidden="true"
                                alt=''
                            />
                            Profile Settings
                        </button>

                        {/* sign out */}
                        <button
                            role='menuitem'
                            className='leftmain-menuitem'
                            onClick={handleSignOut}
                        >
                            <img
                                src={ICONS[theme].signout}
                                className='w-5 h-5'
                                aria-hidden="true"
                                alt=''
                            />
                            Sign Out
                        </button>
                    </motion.div>
                )}
            </AnimatePresence>
        </div>
    )
}