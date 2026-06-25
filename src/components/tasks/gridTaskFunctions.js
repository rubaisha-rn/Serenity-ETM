/**
 * Component renders menu button in each task in grid view and displays a dropdown menu to manage said task.
 */

'use client'

import {motion, AnimatePresence} from 'framer-motion'
import { useState, useRef, useEffect } from 'react'
import { ICONS } from '@/lib/assets'
import useStore from '@/store/useStore'
import { useTaskStore } from '@/store/taskStore'

export default function TaskFunctionsMenu({onComplete, onDelete, completed}) {

    // Global store values
    const {setCompletedTasksCount, completedTasksCount} = useTaskStore();
    const theme = useStore((s) => s.theme);

    // Controls opening dropdown menu
    const [open, setOpen] = useState(false);

    // Used to detect clicks outside menu to automatically close it
    const menuRef = useRef(null);
    const buttonRef = useRef(null);

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
            
            {/* Menu button */}
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
                className={`hover:bg-[var(--f-main)] p-0.5 ml-0.5 bg-none items-center justify-center`}
            >
                {/* Menu icon depending on menu's open state */}
                <img
                    src={open ? ICONS[theme].menuopen : ICONS[theme].menuclose}
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
                        className='absolute bg-[var(--f-main)] -bottom-[60] -left-[155] shadow-xl text-[var(--text-d)] shadow-xl z-20 side-bar-menu'
                    >
                        {/* Mark task as complete button */}
                        <button
                            role='menuitem'
                            className='w-full flex items-center justify-start bg-[var(--baseAcc-b)] hover:bg-[var(--f-main)] rounded motion-safe:transition-colors z-20 side-bar-menuitem border-b-[0.02rem] border-b-black/15 text-[var(--text-a)]'
                            onClick={() => {
                                onComplete();
                                {completed ? '' : setCompletedTasksCount(completedTasksCount+1)}
                                setOpen(false);
                            }}
                        >
                            
                            {/* Icons and label */}
                            <img
                                src={completed ? ICONS[theme].markincomplete : ICONS[theme].markcomplete}
                                aria-hidden="true"
                                alt=''
                            />
                            <h6>
                                Mark as {completed ? 'incomplete' : 'complete'}
                            </h6>

                        </button>

                        {/* Delete task button */}
                        <button
                            role='menuitem'
                            className='w-full flex items-center justify-start bg-[var(--baseAcc-b)] hover:bg-[var(--f-main)] rounded motion-safe:transition-colors z-20 side-bar-menuitem border-b-[0.02rem] border-b-black/15 text-[var(--text-a)]'
                            onClick={() => {
                                onDelete();
                                setOpen(false);
                            }}
                        >
                            
                            {/* Icon and label */}
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