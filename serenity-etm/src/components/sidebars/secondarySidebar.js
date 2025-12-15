'use client';

import { motion } from "framer-motion";
import useStore from "@/store/useStore";
import { useEmailStore } from "@/store/emailStore";
import { useEffect, useState } from "react";
import { TaskButtons, EmailButtons } from "../task&emailButtons";

export default function SecondarySidebar() {
    
    const {screen, setTheme, expandedSecondary, expandedMain, setShowTasks,} = useStore();

    const {setShowEmails} = useEmailStore();

    useEffect(() => {
        const darkModeEnabled = document.documentElement.classList.contains('dark');
        setTheme(darkModeEnabled ? 'dark' : 'light');
    }, []);

    const mainLeft = expandedMain ? 220 : 40;

    return (
        <motion.div
            initial={{width: 0, left: 40}}
            animate={{width: expandedSecondary ? 200 : 40, left: mainLeft}}
            transition={{type: 'spring', stiffness: 300, damping: 30}}
            className={`fixed top-0 z-10 border-r overflow-hidden shadow-sm items-center justify-center ${expandedSecondary ? 'p-2 pt-3' : 'p-1.5 pt-4'} bg-[var(--cardB-main)] h-screen`}
        >
            <div className="flex flex-col gap-3">

                {expandedSecondary && (
                    <div className="flex flex-row gap-2 items-center p-2">

                        <img
                            src="/logo/logo.png"
                            className="w-6 h-6 shrink-0 opacity-60"
                        />

                        <h1 className={`font-AbrilFatface text-md text-[var(--text-c)] opacity-70`}>
                            {screen === 'emails' ? 'Email Manager' : 'Task Manager'}
                        </h1>

                    </div>
                )}

                {screen === 'tasks' && (
                    <TaskButtons
                        expandedSecondary={expandedSecondary}
                        setShowTasks={setShowTasks}
                    />
                )}
                {screen === 'emails' && (
                    <EmailButtons
                        expandedSecondary={expandedSecondary}
                        setShowEmails={setShowEmails}
                    />
                )}
            </div>
        </motion.div>
    );
}