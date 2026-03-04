/**
 * Mode banner component displays a temporary banner notification when the UI mode changes. 
 * Automatically hides after a few seconds or can be dismissed manually.
 */

'use client';

import { motion, AnimatePresence } from "framer-motion";
import { useEffect, useRef, useState } from "react";
import useStore from "@/store/useStore";
import { ICONS } from "@/lib/assets";

export default function ModeBanner({mode}) {

    // Store actions and states
    const {setFocusMode, setPriorityMode} = useStore();
    const theme = useStore((s) => s.theme);

    // Controls visibility of the banner
    const [show, setShow] = useState(false);

    // Stores previous mode value so we only trigger the banner when the mode actually changes
    const prevMode = useRef(mode);

    // Runs whenever mode changes. 
    useEffect(() => {

        if(prevMode.current !== mode) {

            setShow(true);
            
            // Hides after 4 seconds
            const timer = setTimeout(() => setShow(false), 4000);

            // Previous mode updated
            prevMode.current = mode;

            // Cleanup timer for next mode change
            return () => clearTimeout(timer);
        }

    }, [mode]);

    return (

        // Animate presence for animating banner's smooth entry and exit
        <AnimatePresence>

            {show && (
                
                // Banner container
                <motion.div
                    role="status"
                    aria-live="polite"
                    initial={{y: -50, opacity: 0, x: '-50%'}}
                    animate={{y: 0, opacity: 1, x: '-50%'}}
                    exit={{y: -50, opacity: 0, x: '-50%'}}
                    transition={{ duration: 0.35, ease:[0.16, 1, 0.3, 1] }}
                    className={`fixed top-1 left-1/2 transform -translate-x-1/2 text-[var(--text-d)] z-50 justify-center mode-banner ${mode === 'focus' ? 'bg-[var(--focusMode)]' : mode === 'priority' ? 'bg-[var(--priorityMode)]' : 'bg-[var(--disabledMode)]'}`}
                >   

                    {/* Banner content container */}
                    <div className="flex flex-row w-[45vw] justify-between items-center">

                        {/* Left side: icon, label, text */}
                        <div className="flex flex-row items-center
                            sm:gap-1
                            md:gap-1
                            lg:gap-2
                            xl:gap-2
                            2xl:gap-3
                        ">

                            {/* Icon */}
                            <img
                                src={
                                    mode === 'focus'
                                    ? ICONS[theme].focuso
                                    : mode === 'priority'
                                    ? ICONS[theme].priorityo
                                    : ICONS[theme].info
                                }
                            />

                            {/* Label and text */}
                            <div>
                                <h6 className="font-semibold">
                                    {mode === 'focus' ? 'Focus mode enabled.' : mode === 'priority' ? 'Priority mode enabled.' : 'Mode disabled'}
                                </h6>
                            
                                <p className="leading-tight">
                                    {mode === 'focus' ? 'Focus mode is active to limit visible items and reduce on-screen complexity.' : 
                                    mode === 'priority' ? 'Priority mode is active to surface time-sensitive and high-importance conversations.' 
                                    : 'Standard view is active. All emails are displayed without adaptive filtering.'}
                                </p>
                            </div>
                        </div>

                        {/* Right side */}
                        <div className="flex flex-row 
                            sm:gap-1
                            md:gap-1
                            lg:gap-2
                            xl:gap-2
                            2xl:gap-3"
                        >

                            {/* Buttons */}
                            {mode !== 'default' && (

                                // Turn off mode button
                                <button
                                    aria-label={`Turn off ${mode} mode`}
                                    onClick={() => {
                                        mode === 'focus' 
                                            ? setFocusMode(false)
                                            : setPriorityMode(false)  
                                    }}
                                    className={`border-[0.05rem] border-[var(--baseAcc-b)] px-3 py-0.5 rounded
                                    ${mode === 'focus' ? 'hover:bg-[var(--focusModeHover)]' : 'hover:bg-[var(--priorityModeHover)]'}`}
                                >
                                    <p>Turn off</p>
                                </button>
                            )}

                            {/* Close banner button */}
                            <button
                                aria-label="Dismiss mode notification"
                                onClick={() => setShow(false)}
                            >
                                <img
                                    src={ICONS[theme].add}
                                    className="rotate-45 hover:opacity-70"
                                />
                            </button>
                        </div>
                    </div>   
                </motion.div>
            )}
        </AnimatePresence>
    );
}