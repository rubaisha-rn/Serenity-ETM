'use client';

import { motion, AnimatePresence } from "framer-motion";
import { useEffect, useState } from "react";

export default function ModeBanner({mode}) {
    const [show, setShow] = useState(false);

    useEffect(() => {
        if(mode) {
            setShow(true);
            const timer = setTimeout(() => setShow(false), 2000); // 2 secs
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
                    className={`fixed top-1 left-1/2 transform -translate-x-1/2 text-[var(--text-d)] px-6 py-1 rounded-lg shadow-2xl z-50 justify-center text-sm ${mode === 'focus' ? 'bg-[var(--danger)]' : mode === 'priority' ? 'bg-[var(--warning)]' : 'bg-[var(--acc-main)]'}`}
                >
                    <div className="flex flex-row gap-2 justify-center items-center">
                        <div>
                            {mode === 'focus' 
                                ? <img
                                    src="/icons/focus/focusW.png"
                                    className='w-5 h-5 shrink-0'
                                 /> 
                            : mode === 'priority' 
                                ? <img
                                    src="/icons/priority/priorityW.png"
                                    className='w-5 h-5 shrink-0'
                                 /> 
                            : ''}
                        </div>

                        <div>
                            {mode === 'focus' ? 'Focus Mode Activated.' : mode === 'priority' ? 'Priority Mode Activated.' : 'Mode Deactivated.'}
                        </div>
                    </div>
                    
                </motion.div>
            )}
        </AnimatePresence>
    );
}