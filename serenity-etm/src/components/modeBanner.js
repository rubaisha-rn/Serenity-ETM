'use client';

import { motion, AnimatePresence } from "framer-motion";
import { useEffect, useState } from "react";
import useStore from "@/store/useStore";
import { ICONS } from "@/lib/assets";

export default function ModeBanner({mode}) {

    const {screen, theme, setFocusMode, setPriorityMode} = useStore();
    const [show, setShow] = useState(false);

    useEffect(() => {
        if(mode) {
            setShow(true);
            const timer = setTimeout(() => setShow(false), 300000000); // 3 secs
            return () => clearTimeout(timer);
        }
    }, [mode]);

    return (
        <AnimatePresence>
            {show && (
                <motion.div
                    initial={{y: -50, opacity: 0, x: '-50%'}}
                    animate={{y: 0, opacity: 1, x: '-50%'}}
                    exit={{y: -50, opacity: 0, x: '-50%'}}
                    transition={{ type: 'spring', stiffness: 300, damping: 20}}
                    className={`fixed top-1 left-1/2 transform -translate-x-1/2 text-[var(--text-d)] px-3 py-1 rounded-lg shadow-black/20 shadow-xl z-50 justify-center text-sm ${mode === 'focus' ? 'bg-[var(--focusMode)]' : mode === 'priority' ? 'bg-[var(--priorityMode)]' : 'bg-[var(--disabledMode)]'}`}
                >
                    <div className="flex flex-row w-[45vw] justify-between items-center">
                        <div className="flex flex-row gap-2 items-center">
                            <div>
                                {mode === 'focus' 
                                    ? 
                                        <img
                                            src={ICONS[theme].focusW}
                                            className="lg:w-5 aspect-square"
                                        /> 
                                    : mode === 'priority' ? 
                                        <img
                                            src={ICONS[theme].priorityW}
                                            className="lg:w-5 aspect-square"
                                        /> 
                                    :   <img
                                            src={ICONS[theme].info}
                                            className="lg:w-5 aspect-square"
                                        />
                                    }
                            </div>
                            <div>
                                <div>
                                    <h6 className="font-semibold">
                                        {mode === 'focus' ? 'Focus mode enabled.' : mode === 'priority' ? 'Priority mode enabled.' : 'Mode disabled'}
                                    </h6>
                                </div>
                                <div>
                                    <p className="leading-tight">
                                        {mode === 'focus' ? 'Focus mode is active to limit visible items and reduce on-screen complexity.' : 
                                        mode === 'priority' ? 'Priority mode is active to surface time-sensitive and high-importance conversations.' 
                                        : 'Standard view is active. All emails are displayed without adaptive filtering.'}
                                    </p>
                                </div>
                            </div>
                        </div>
                        <div className="flex flex-row gap-2">
                            {mode !== 'default' && (
                                <button
                                    onClick={() => {
                                        mode === 'focus' 
                                            ? setFocusMode(false)
                                            : setPriorityMode(false)  
                                    }}
                                    className={`bg-[var(--baseAcc-b)] px-2 py-0.5 rounded ${mode === 'focus' ? 'text-[var(--focusMode)]' : 'text-[var(--priorityMode)]'}`}
                                >
                                    <p className="font-bold">turn off</p>
                                </button>
                            )}
                            <button
                                onClick={() => setShow(false)}
                            >
                                <img
                                    src={ICONS[theme].add}
                                    className="lg:w-4 aspect-square rotate-45"
                                />
                            </button>
                        </div>
                    </div>   
                </motion.div>
            )}
        </AnimatePresence>
    );
}