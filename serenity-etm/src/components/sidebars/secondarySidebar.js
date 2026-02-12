'use client';

import { motion, useReducedMotion } from "framer-motion";
import useStore from "@/store/useStore";
import { useEmailStore } from "@/store/emailStore";
import { useEffect, useMemo, useRef } from "react";
import { TaskButtons, EmailButtons } from "../task&emailButtons";

export default function SecondarySidebar() {
    
    const {screen, setTheme, expandedSecondary, setShowTasks, fontScale} = useStore();

    const {setShowEmails} = useEmailStore();

    const prefersRecuedMotion = useReducedMotion()
    const sidebarRef = useRef(null);

    // resolve motion safety
    const motionTransition = useMemo(
        () => 
            prefersRecuedMotion
                ? {duration: 0}
                : {type: 'spring', stiffness: 260, damping: 38},
        [prefersRecuedMotion]
    );

    // theme sync
    useEffect(() => {
        const darkModeEnabled = document.documentElement.classList.contains('dark');
        setTheme(darkModeEnabled ? 'dark' : 'light');
    }, []);

    // focus management when expanding
    useEffect(() => {
        if (expandedSecondary && sidebarRef.current) {
            const firstButton = sidebarRef.current.querySelector('button');
            firstButton?.focus();
        }
    }, [expandedSecondary]);

    const headingText = 
        screen === 'emails'
         ? 'Email Manager'
         : screen === 'tasks'
         ? 'Task Manager'
         : 'Dashboard';

    return (

        <motion.div
            ref={sidebarRef}
            aria-label="Secondary navigation panel"
            aria-expanded={expandedSecondary}
            initial={{width: 0, left: 50}}
            animate={{width: expandedSecondary ? 210 : 46, left: 50}}
            transition={motionTransition}
            className={`bg-none fixed top-1 z-10 ml-1 overflow-hidden items-center justify-center h-[calc(100vh-0.5rem)] rounded-lg
            motion-safe:transition-colors shadow-xl backdrop-blur-xl bg-blue-500 z-10
            ${expandedSecondary ? 'p-2 pt-3' : 'p-1 py-2'}`}
        >
            <div role="menu" aria-label={`${headingText} options`} className="flex flex-col gap-3">

                {expandedSecondary && (
                    <h1
                        id="secondary-sidebar-heading"
                        className={`font-Roboto text-[0.95rem] font-semibold text-[var(--text-a)]`}>
                        {screen === 'emails' ? 'Email Manager' : screen === 'tasks' ? 'Task Manager' : 'Dashboard'}
                    </h1>
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