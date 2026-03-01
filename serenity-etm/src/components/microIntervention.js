'use client';

import { useEffect, useState, useRef, useMemo } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ICONS } from "@/lib/assets";
import useStore from "@/store/useStore";
import { useTaskStore } from "@/store/taskStore";
import { useEmailStore } from "@/store/emailStore";

export default function MicroInterventionPopup() {

    const {emotionValue, screen, calmMode, focusMode, priorityMode, theme, setFocusMode, setPriorityMode, setCalmMode, setTheme} = useStore();
    const {readEmailCount} = useEmailStore();
    const {completedTasksCount} = useTaskStore();

    const [open, setOpen] = useState(true); //false
    const lastShown = useRef(0);

    const cooldown = focusMode ? 750000000 : 300000000; //75000 30000
    
    const intervention = useMemo(() => {
        
        const now = Date.now();
        if (lastShown.current !== 0 && now - lastShown.current < cooldown) return null;
        if (calmMode) return null;

        // high stress 
        if (emotionValue > 69 && !focusMode) {
            return {
                title: 'Reduce noise',
                message: 'Switch to focus view?',
                icon: '/icons/focus.png',
                action: () => setFocusMode(true)
            };
        }

        // high stress reset
        if (emotionValue > 80 && focusMode) {
            return {
                title: 'Quick reset',
                message: 'Take a short reset break?',
                icon: '/icons/calm.png',
                action: () => setCalmMode(true)
            };
        }

        // medium stress
        if (
            emotionValue >= 40 &&
            emotionValue <= 69 &&
            !focusMode &&
            !priorityMode &&
            (readEmailCount >= 5 || completedTasksCount >= 3)
        ) {
            return {
                title: 'Structure your list',
                message: 'Sort items by priority?',
                icon: 'icons/priority.png',
                action: () => setPriorityMode(true)
            };
        }

        // stress dropped -> expand view
        if (emotionValue < 40 && focusMode) {
            return {
                title: 'Open full view',
                message: 'Focus mode is no longer needed',
                icon: 'icons/expand.png',
                action: () => setFocusMode(false)
            };
        }

        // progress guidance
        if (!focusMode && !priorityMode && (readEmailCount >= 4 || completedTasksCount >= 2)) {
            return {
                title: 'Keep the momentum',
                message: 'Process top priority items next?',
                icon: 'icons/priority.png',
                action: () => setPriorityMode(true)
            };
        }

        // visual comfort
        if (true) {
        // if (theme !== 'dark' && emotionValue > 60) {
            return {
                title: 'Reduce brightness',
                message: 'Switch to dark mode?',
                icon: 'icons/dark.png',
                action: () => setTheme('dark')
            };
        }
        
        return null;
    }, [
        emotionValue,
        focusMode,
        priorityMode,
        calmMode,
        readEmailCount,
        completedTasksCount,
        theme
    ])

    useEffect(() => {
        if (intervention) {
            setOpen(true);
            lastShown.current = Date.now();
        }
    }, [intervention]);

    useEffect(() => {
        if(!open) return;
        const timer = setTimeout(() => setOpen(false), 1200000000000); //12000
        return () => clearTimeout(timer);
    }, [open]);

    if (!intervention) return null;

    return (
        <AnimatePresence>
            {open && (
                <motion.div
                    initial={{opacity: 0, y:40}}
                    animate={{opacity: 1, y: 0}}
                    exit={{opacity: 0, y: 40}}
                    transition={{duration: 0.3}}
                    className="absolute bottom-2 right-14 z-[9999] max-w-sm"
                >
                    <div className="bg-[var(--baseAcc-b)] border-[0.0rem] border-[var(--text-a)] rounded-xl shadow-xl overflow-hidden flex flex-row gap-4 p-2 justify-center items-center">

                        {screen === 'emails' ? 
                            <img
                                src="/icons/email.png"
                                className='w-12 h-12 shrink-0 object-contain'
                            /> 
                        :   <img
                                src="/icons/tasks.png"
                                className='w-12 h-12 shrink-0 object-contain'
                            />
                        }
                        
                        <div className="flex-1">
                        
                            <h3 className="text-sm font-semibold font-Roboto text-[var(--text-b)]">
                                {intervention.title}
                            </h3>

                            <p className="text-xs font-Roboto text-[var(--text-c)]">
                                {intervention.message}
                            </p>
                        
                        </div>
                        
                        <button
                            onClick={() => {
                                intervention.action();
                                setOpen(false);
                            }}
                        >
                            Apply
                        </button>
                    </div>
                </motion.div>
            )}
        </AnimatePresence>
    );
}