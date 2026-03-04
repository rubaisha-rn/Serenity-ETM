/**
 * A reusable sidebar button inside the Tasks secondary navigation.
 */

'use client';

import { motion } from "framer-motion";
import { useTaskStore } from "@/store/taskStore";

export default function TasksSidebarButton({label, shortLabel, icon, expanded, onClick, shortcut}) {

    // Retrieve current active task view
    const {showTasks} = useTaskStore();

    // Determine if this button represents currently active task filter
    const isActive = showTasks === shortLabel;

    // Keyboard activation handler
    const activate = (e) => {

        const key = e.key || e.code;

        // Activate using enter or spacebar
        if (key === 'Enter' || key === ' ') {
            e.preventDefault();
            onClick?.();
        }

        // Activate using assigned keyboard shortcut
        if (shortcut && key.toLowerCase() === shortcut.toLowerCase()) {
            e.preventDefault();
            onClick?.();
        }
    };

    return (

        // Motion-enabled button for smooth UI transitions
        <motion.button
            whileHover={{scale: 1.05}}
            whileTap={{scale: 0.95}}
            type="button"
            role="menuitem"
            aria-label={label}
            aria-current={isActive ? label : undefined}
            title={!expanded ? label : undefined}
            onClick={onClick}
            onKeyDown={activate}
            className={`secondary-side-bar-btn hover:bg-[var(--e-main)]
            ${expanded ? 'expanded' : 'collapsed'} 
            ${showTasks === shortLabel ? 'bg-[var(--baseAcc-b)] shadow-md' : ''}`}
        >
            {/* Icon */}
            <img 
                src={icon} 
                className="opacity-80 m-1.5" 
                alt=""
                aria-hidden='true'
            />
            
            {/* Text lable hidden if sidebar is collapsed */}
            <span className={`secondary-side-bar-label ${expanded ? 'show' : 'hide'}`}>
                {label}
            </span>
        </motion.button>
    );
}