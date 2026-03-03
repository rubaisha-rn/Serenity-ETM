// complete
'use client';

import { motion } from "framer-motion";
import useStore from "@/store/useStore";
import { useEmailStore } from "@/store/emailStore";
import { useTaskStore } from "@/store/taskStore";
import { useEffect, useRef } from "react";
import { TaskButtons, EmailButtons } from "../task&emailButtons";

export default function SecondarySidebar() {
    
    const {screen, expandedSecondary} = useStore();
    const {setShowEmails} = useEmailStore();
    const {setShowTasks} = useTaskStore();

    const sidebarRef = useRef(null);

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
            transition={{type: 'spring', stiffness: 260, damping: 36}}
            className={`${expandedSecondary ? 'fixed top-1 overflow-hidden items-center justify-center motion-safe:transition-colors shadow-xl backdrop-blur-xl z-10 secondary-side-bar' : 'fixed top-1 flex flex-col justify-between shadow-xl z-20 side-bar ml-1 pt-0.5'}`}
        >
            <div role="menu" aria-label={`${headingText} options`} className="flex flex-col gap-1">

                {expandedSecondary && (
                    <h5
                        id="secondary-sidebar-heading"
                        className="text-[var(--text-a)]"
                    >
                        {screen === 'emails' ? 'Email Manager' : screen === 'tasks' ? 'Task Manager' : 'Dashboard'}
                    </h5>
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