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
                    initial={{y: -50, opacity: 0}}
                    animate={{y: 0, opacity: 1}}
                    exit={{y: -50, opacity: 0}}
                    transition={{ type: 'spring', stiffness: 300, damping: 20}}
                    className="fixed top-0 left-1/2 tranform -translate-x-1/2 bg-blue-600 text-white px-6 py-2 rounded-lg shadow-lg z-50 font-semibold"
                >
                    {mode === 'focus' ? 'Focus Mode Activated.' : 'Priority Mode Activated.'}
                </motion.div>
            )}
        </AnimatePresence>
    );
}