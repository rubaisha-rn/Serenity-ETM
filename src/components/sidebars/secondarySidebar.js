/**
 * Secondary side bar
 * 
 * Renders secondary side bar for tasks and emails screens. Shows contextual navigation options relevant to currently active screen.
 */

'use client';

import { motion } from "framer-motion";
import useStore from "@/store/useStore";
import { useEmailStore } from "@/store/emailStore";
import { useTaskStore } from "@/store/taskStore";
import { useEffect, useRef } from "react";
import { TaskButtons, EmailButtons } from "../task&emailButtons";

export default function SecondarySidebar() {
    
    // Global state values
    const {screen, expandedSecondary} = useStore();
    const {setShowEmails} = useEmailStore();
    const {setShowTasks} = useTaskStore();

    // Reference to sidebar container for focus management
    const sidebarRef = useRef(null);

    /**
     * Focus management
     * 
     * When sidebar expands, focus is moved to the first button inside the sidebar. 
     * Improves keyboard accessibility and ensures screen reader users are placed inside the navigation.
     */
    useEffect(() => {
        
        if (expandedSecondary && sidebarRef.current) {
        
            const firstButton = sidebarRef.current.querySelector('button');
            firstButton?.focus();
        
        }
    
    }, [expandedSecondary]);

    // Determine the heading based on the active screen
    const headingText = 
        screen === 'emails'
         ? 'Email Manager'
         : screen === 'tasks'
         ? 'Task Manager'
         : '';

    return (

        // Sidebar container
        <motion.div
            ref={sidebarRef}
            aria-label="Secondary navigation panel"
            aria-expanded={expandedSecondary}
            initial={{width: 0, left: 50}}
            animate={{width: expandedSecondary ? 210 : 46, left: 50}}
            transition={{type: 'spring', stiffness: 260, damping: 36}}
            className={`${expandedSecondary ? 'fixed top-1 overflow-hidden items-center justify-center motion-safe:transition-colors shadow-xl backdrop-blur-xl z-10 secondary-side-bar' : 'fixed top-1 flex flex-col justify-between shadow-xl z-20 side-bar ml-1 pt-0.5'}`}
        >
            {/* Navigation container */}
            <div 
                role="menu" 
                aria-label={`${headingText} options`} 
                className="flex flex-col gap-1"
            >
                {/* Sidebar heading shown only when expanded */}
                {expandedSecondary && (
                    <h5
                        id="secondary-sidebar-heading"
                        className="text-[var(--text-a)]"
                    >
                        {screen === 'emails' ? 'Email Manager' : screen === 'tasks' ? 'Task Manager' : 'Dashboard'}
                    </h5>
                )}

                {/* Task navigation buttons for task screen */}
                {screen === 'tasks' && (
                    <TaskButtons
                        expandedSecondary={expandedSecondary}
                        setShowTasks={setShowTasks}
                    />
                )}

                {/* Email navigation buttons for email screen */}
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