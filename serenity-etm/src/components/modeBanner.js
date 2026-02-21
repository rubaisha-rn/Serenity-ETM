'use client';

import { motion, AnimatePresence } from "framer-motion";
import { useEffect, useRef, useState } from "react";
import useStore from "@/store/useStore";
import { ICONS } from "@/lib/assets";

export default function ModeBanner({mode}) {

    const {screen, theme, setFocusMode, setPriorityMode} = useStore();
    const [show, setShow] = useState(false);
    const prevMode = useRef(mode);
    const isFirstRender = useRef(true);

    useEffect(() => {
        
        // skip first render
        if (isFirstRender.current) {
            isFirstRender.current = false;
            prevMode.current = false;
            return;
        }

        // only run when mode changes
        if(prevMode.current != mode) {
            setShow(true);
            const timer = setTimeout(() => setShow(false), 4000); // 4 secs
            return () => clearTimeout(timer);
        }

        prevMode.current = mode;
    }, [mode]);

    return (
        <AnimatePresence>
            {show && (
                <motion.div
                    initial={{y: -50, opacity: 0, x: '-50%'}}
                    animate={{y: 0, opacity: 1, x: '-50%'}}
                    exit={{y: -50, opacity: 0, x: '-50%'}}
                    transition={{ duration: 0.35, ease:[0.16, 1, 0.3, 1] }}
                    className={`fixed top-1 left-1/2 transform -translate-x-1/2 text-[var(--text-d)] px-3 py-1 rounded-lg shadow-black/20 shadow-xl z-50 justify-center text-sm ${mode === 'focus' ? 'bg-[var(--focusMode)]' : mode === 'priority' ? 'bg-[var(--priorityMode)]' : 'bg-[var(--disabledMode)]'}`}
                >
                    <div className="flex flex-row w-[45vw] justify-between items-center">

                        {/* left */}
                        <div className="flex flex-row gap-2 items-center">
                            <img
                                src={
                                    mode === 'focus'
                                    ? ICONS[theme].focusW
                                    : mode === 'priority'
                                    ? ICONS[theme].priorityW
                                    : ICONS[theme].info
                                }
                                className="lg:w-5 aspect-square"
                            />
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

                        {/* right side */}
                        <div className="flex flex-row gap-2">
                            {mode !== 'default' && (
                                <button
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
                            <button
                                onClick={() => setShow(false)}
                            >
                                <img
                                    src={ICONS[theme].add}
                                    className="lg:w-4 aspect-square rotate-45 hover:opacity-70"
                                />
                            </button>
                        </div>
                    </div>   
                </motion.div>
            )}
        </AnimatePresence>
    );
}