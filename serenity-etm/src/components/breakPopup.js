'use client';

import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";

const SCENARIOS = {
    emails: {
        title: 'Time for a break!',
        message: "You've been working for a while. Stand up, stretch, or rest your eyes for a few minutes.",
        accent: 'bg-blue-500',
    },
    tasks: {
        title: 'Time for a break!',
        message: "You've been working for a while. Stand up, stretch, or rest your eyes for a few minutes.",
        accent: 'bg-blue-500',
    },
    custom: {
        title: 'Reminder',
        message: 'You have a new notification',
        accent: 'bg-emerald-500',
    }
};

export default function BreakPopup({
    scenario = 'break',
    message,
    intervalMs, 
    durationMs = 15000,
    onAcknowledge
}) {
    const [open, setOpen] = useState(false);
    const data = SCENARIOS[scenario] ?? SCENARIOS.custom;

    useEffect(() => {
        setOpen(true);
    }, []);

    useEffect(() => {
        if(!intervalMs) return;

        const timer = setInterval(() => {
            setOpen(true);
        }, intervalMs);

        return () => clearInterval(timer);
    }, [intervalMs]);

    useEffect(() => {
        if(!open) return;

        const hideTimer = setTimeout(() => {
            setOpen(false);
        }, durationMs);

        return () => clearTimeout(durationMs);
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
                    className="fixed bottom-6 right-6 z-50 max-w-sm"
                >
                    <div className="bg-white rounded-2xl shadow-xl overflow-hidden">
                        <div className={`h-1.5 ${data.accent}`} />
                        <div className="p-5">
                            <h3 className="text-lg font-semibold text-gray-600">
                                {data.title}
                            </h3>
                            <p className="mt-2 text-sm text-gray-600">
                                {message || data.message}
                            </p>
                            <div className="mt-4 flex justify-end gap-2">
                                <button
                                    onClick={handleClose}
                                    className="px-4 py-2 text-sm rounded-xl bg-gray-100 hover:bg-gray-200 transition"
                                >
                                    Dismiss
                                </button>
                                <button
                                    onClick={handleClose}
                                    className="px-4 py-2 text-sm rounded-xl text-white bg-gray-900 hover:bg-gray-800 transition"
                                >
                                    Got it
                                </button>
                            </div>
                        </div>
                    </div>
                </motion.div>
            )}
        </AnimatePresence>
    );
}