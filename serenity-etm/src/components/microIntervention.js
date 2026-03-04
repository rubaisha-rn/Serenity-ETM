/**
 * Displays contextual suggestions based on:
    * Stress level
    * Focus/Priority mode
    * UI
 * 
 * Designed to help users regulate workload and cognitive stress.
 */

'use client';

import { useEffect, useState, useRef, useMemo } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ICONS } from "@/lib/assets";
import useStore from "@/store/useStore";
import { useTaskStore } from "@/store/taskStore";
import { useEmailStore } from "@/store/emailStore";

export default function MicroInterventionPopup() {

    // Global store values
    const {emotionValue, calmMode, focusMode, priorityMode, setFocusMode, setPriorityMode, setCalmMode, setTheme, expandedRight} = useStore();
    const theme = useStore((s) => s.theme);
    const {readEmailCount} = useEmailStore();
    const {completedTasksCount} = useTaskStore();

    // Controls microintervention popup visibility
    const [open, setOpen] = useState(false); 

    // Stores timestamp of last intervention to prevent them from appearing too frequently
    const lastShown = useRef(0);

    // Cooldown period between interventions. Longer in focusmode to not distract the user
    const cooldown = focusMode ? 75000 : 30000; 
    
    // Determines which intervention should appear
    const intervention = useMemo(() => {
        
        const now = Date.now();

        // Prevents interventions during cooldown period
        if (lastShown.current !== 0 && now - lastShown.current < cooldown) return null;

        // No interventions during calm overlay visibility
        if (calmMode) return null;

        // High stress -> enable focus mode
        if (emotionValue > 69 && !focusMode) {
            return {
                title: 'Reduce noise',
                message: 'Switch to Focus View to reduce on-screen noise and lower cognitive stress.',
                icon: ICONS[theme].focuso,
                action: () => setFocusMode(true),
                outer_color: 'bg-[var(--focusModeInt)]',
                inner_color: 'bg-[var(--focusMode)]',
            };
        }

        // High stress -> suggests break
        if (emotionValue > 80 && focusMode) {
            return {
                title: 'Quick reset',
                message: 'Take a short reset break? Recharge your mind, and return with clearer focus and reduced mental fatigue.',
                icon: ICONS[theme].calmo,
                action: () => setCalmMode(true),
                outer_color: theme === 'light' ? 'bg-blue-100 bg-opacity-60' : 'bg-blue-900 bg-opacity-60',
                inner_color: theme === 'light' ? 'bg-blue-500' : 'bg-blue-900',
            };
        }

        // Medium stress -> suggest enabling priority mode
        if (
            emotionValue >= 40 &&
            emotionValue <= 69 &&
            !focusMode &&
            !priorityMode &&
            (readEmailCount >= 5 || completedTasksCount >= 3)
        ) {
            return {
                title: 'Structure your list',
                message: 'Sort items by priority to tackle what matters most first and stay in control of your workflow.',
                icon: ICONS[theme].row,
                action: () => setPriorityMode(true),
                outer_color: 'bg-[var(--priorityModeInt)]',
                inner_color: 'bg-[var(--priorityMode)]',
            };
        }

        // Stress dropped -> suggest exiting focus mode
        if (emotionValue < 40 && focusMode) {
            return {
                title: 'Open full view',
                message: 'Focus mode is no longer needed. Switch back to the full view to see everything at a glance.',
                icon: ICONS[theme].focuso,
                action: () => setFocusMode(false),
                outer_color: 'bg-[var(--progressAlmostc)]',
                inner_color: 'bg-[var(--progressAlmostt)]',
            };
        }

        // Progress guidance -> encourage continuing pace and momentum
        if (!focusMode && !priorityMode && (readEmailCount >= 4 || completedTasksCount >= 2)) {
            return {
                title: 'Keep the momentum',
                message: 'Process top priority items next? Maintain your momentum and keep your progress flowing.',
                icon: ICONS[theme].priorityo,
                action: () => setPriorityMode(true),
                outer_color: 'bg-[var(--priorityNormalc)]',
                inner_color: 'bg-[var(--priorityNormalt)]',
            };
        }

        // Visual comfort -> suggest dark mode
        if (theme !== 'dark' && emotionValue > 60) {
            return {
                title: 'Reduce brightness',
                message: 'Switch to dark mode to reduce eye strain and enjoy a more comfortable viewing experience.',
                icon: ICONS[theme].appearance,
                action: () => setTheme('dark'),
                outer_color: 'bg-[var(--progressInb)]',
                inner_color: 'bg-[var(--progressInt)]',
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

    // Show popup whenever a new intervention is triggered
    useEffect(() => {
        
        if (intervention) {
            setOpen(true);
            lastShown.current = Date.now();
        }
    
    }, [intervention]);

    // Automatically close popup after 12 secs
    useEffect(() => {
        
        if(!open) return;
        const timer = setTimeout(() => setOpen(false), 12000); 
        return () => clearTimeout(timer);
    
    }, [open]);

    // No render if there is no popup
    if (!intervention) return null;

    return (

        // Smooth exit animation
        <AnimatePresence>

            {open && (
            
                // Popup container
                <motion.div
                    role="status"
                    aria-live="polite"
                    initial={{opacity: 0, x:'100%'}}
                    animate={{opacity: 1, x:'0%'}}
                    exit={{opacity: 0, x:'100%'}}
                    transition={{duration: 0.3}}
                    className={`fixed z-[9999] bg-[var(--baseAcc-b)] overflow-hidden microintervention outer ${
                        !expandedRight ? 'right-14' : 'right-2'
                    }`}
                >   
                    {/* Popup layout container */}
                    <div className={`${intervention.outer_color} justify-between items-center justify-center grid grid-cols-[0.2fr_1.2fr_0.1fr] 
                    sm:p-1 sm:py-2 sm:rounded-md sm:gap-2
                    md:p-1 md:py-2 md:rounded-md md:gap-3
                    lg:p-2 lg:py-3 lg:rounded-lg lg:gap-4
                    xl:p-2 xl:py-3 xl:rounded-lg xl:gap-4
                    2xl:p-2 2xl:py-3 2xl:rounded-lg 2xl:gap-4`}>

                        {/* Icon section */}
                        <div className="flex bg-[var(--baseAcc-b)] rounded-full aspect-square items-center justify-center
                            sm:p-0
                            md:p-0.5
                            lg:p-0.5
                            xl:p-0.5
                            2xl:p-2
                        ">
                            {/* Icon background */}
                            <div className={`${intervention.inner_color} flex rounded-full aspect-square items-center justify-center
                                sm:p-0.5
                                md:p-0.5
                                lg:p-1
                                xl:p-1
                                2xl:p-2
                            `}> 
                                {/* Icon */}
                                <img
                                    src={intervention.icon}
                                    alt=""
                                    aria-hidden={true}
                                />
                            </div>
                        </div>

                        {/* Text section */}
                        <div className="flex flex-col sm:gap-0 md:gap-1 lg:gap-1 xl:gap-1 2xl:gap-2">

                            <h6 className="font-bold text-[var(--text-a)]">
                                {intervention.title}
                            </h6>

                            <p className="text-[var(--text-b)] leading-tight">
                                {intervention.message}
                            </p>
                        </div>
                        
                        {/* Action buttons */}
                        <div className="flex flex-col sm:gap-1 md:gap-1 lg:gap-2 xl:gap-2 2xl:gap-3">

                            {/* Close button */}
                            <button
                                aria-label="Dismiss suggestion"
                                onClick={() => {
                                    setOpen(false);
                                }}
                            >
                                <img
                                    src={ICONS[theme].close}
                                    className="hover:opacity-60 hover:scale-95"
                                    alt=""
                                    aria-hidden={true}
                                />
                            </button>

                            {/* Accept intervention */}
                            <button
                                aria-label={`Apply intervention: ${intervention.title}`}
                                onClick={() => {
                                    intervention.action();
                                    setOpen(false);
                                }}
                            >
                                <img
                                    src={ICONS[theme].tick}
                                    className="hover:opacity-60 hover:scale-95"
                                    alt=""
                                    aria-hidden={true}
                                />
                            </button>
                        </div>
                    </div>
                </motion.div>
            )}
        </AnimatePresence>
    );
}