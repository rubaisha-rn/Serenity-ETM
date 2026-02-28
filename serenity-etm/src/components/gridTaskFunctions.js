// add image sizes according to window
'use client'

import {motion, AnimatePresence} from 'framer-motion'
import { useState, useRef, useEffect } from 'react'
import { ICONS } from '@/lib/assets'
import useStore from '@/store/useStore'

export default function TaskFunctionsMenu({onComplete, onDelete, completed}) {

    const {theme} = useStore();
    const [open, setOpen] = useState(false);
    const menuRef = useRef(null);
    const buttonRef = useRef(null);

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
            
            <motion.button 
                ref={buttonRef}
                type='button'
                aria-haspopup="menu"
                aria-expanded={open}
                whileHover={{scale: 1.05}}
                whileTap={{scale: 0.95}}
                onClick={() => setOpen((v) => !v)}
                onKeyDown={(e) => {
                    if (e.key === 'Enter' || e.key === ' ') {
                        e.preventDefault();
                        setOpen((v) => !v);
                    }
                }}
                className={`hover:bg-[var(--f-main)] p-0.5 ml-0.5 bg-none items-center justify-center`}>
                <img
                    src={open ? ICONS[theme].menuopen : ICONS[theme].menuclose}
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
                        className='side-bar-menu bg-[var(--f-main)] -bottom-[60] -left-[155]'
                    >
                        <button
                            role='menuitem'
                            className='side-bar-menuitem bg-[var(--baseAcc-b)] hover:bg-[var(--f-main)] border-b-[0.02rem] border-b-black/15 text-[var(--text-a)]'
                            onClick={() => {
                                onComplete();
                                setOpen(false);
                            }}
                        >
                            <img
                                src={completed ? ICONS[theme].markincomplete : ICONS[theme].markcomplete}
                                aria-hidden="true"
                                alt=''
                            />
                            <h6>
                                Mark as {completed ? 'incomplete' : 'complete'}
                            </h6>
                        </button>

                        <button
                            role='menuitem'
                            className='side-bar-menuitem bg-[var(--baseAcc-b)] hover:bg-[var(--f-main)] text-[var(--text-a)]'
                            onClick={() => {
                                onDelete();
                                setOpen(false);
                            }}
                        >
                            <img
                                src={ICONS[theme].delete}
                                aria-hidden="true"
                                alt=''
                            />
                            <h6>
                                Delete
                            </h6>
                        </button>
                    </motion.div>
                )}
            </AnimatePresence>
        </div>
    )
}