'use client';

import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";

const SCENARIOS = {
    emails: {
        title: 'Time for a break!',
        message: "You've read more than 5 emails! Time to stand up, stretch, or rest your eyes for a few minutes.",
        accent: 'bg-blue-500',
    },
    tasks: {
        title: 'Time for a break!',
        message: "You've completed more than 3 tasks! Time to stand up, stretch, or rest your eyes for a few minutes.",
        accent: 'bg-blue-500',
    },
};

export default function BreakPopup({
    scenario = 'emails',
    message,
    durationMs = 15000000000, //15000
    onAcknowledge
}) {
    const [open, setOpen] = useState(true);
    const data = SCENARIOS[scenario] ?? SCENARIOS.emails;

    useEffect(() => {
        setOpen(true);
    }, []);

    useEffect(() => {
        if(!open) return;

        const hideTimer = setTimeout(() => {
            setOpen(false);
        }, durationMs);

        return () => clearTimeout(hideTimer);
    }, [open, durationMs]);

    const handleClose = () => {
        setOpen(false);
        onAcknowledge?.();
    };

    return (
        <AnimatePresence>
            {open && (
                <motion.div
                    initial={{opacity: 0, y:40}}
                    animate={{opacity: 1, y: 0}}
                    exit={{opacity: 0, y: 40}}
                    transition={{duration: 0.3}}
                    className="fixed bottom-2 right-12 z-50 max-w-sm"
                >
                    <div className="bg-[var(--blankCard-main)] border-[0.0rem] border-[var(--text-a)] rounded-xl shadow-xl overflow-hidden flex flex-row gap-4 p-2 justify-center items-center">

                        {scenario === 'emails' ? 
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
                                {data.title}
                            </h3>

                            <p className="text-xs font-Roboto text-[var(--text-c)]">
                                {message || data.message}
                            </p>
                        
                        </div>
                        
                        <div className="flex flex-col justify-end gap-2">
                            
                            <button
                                onClick={handleClose}
                                className="p-2 rounded-xl bg-[var(--successL)] hover:bg-[var(--successM)] transition"
                            >
                                <img
                                    src="/icons/accept.png"
                                    className='w-5 h-5 shrink-0 object-contain'
                                /> 
                            </button>

                            <button
                                onClick={handleClose}
                                className="p-2 rounded-xl bg-[var(--icons-main)] hover:bg-[var(--iconsHover-main)] transition"
                            >
                                <img
                                    src="/icons/dismiss.png"
                                    className='w-5 h-5 shrink-0 object-contain'
                                /> 
                            </button>
                        
                        </div>
                    </div>
                </motion.div>
            )}
        </AnimatePresence>
    );
}