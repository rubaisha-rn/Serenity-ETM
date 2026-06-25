/**
 * A reusable sidebar button inside the Emails secondary navigation.
 */

'use client';

import { motion } from "framer-motion";
import { useEmailStore } from "@/store/emailStore";

export default function EmailsSidebarButton({label, shortLabel, icon, expanded, onClick, shortcut}) {

    // Retrieve current active email view
    const {showEmails} = useEmailStore();

    // Determine if this button represents currently active email filter
    const isActive = showEmails === shortLabel; 

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
            ${showEmails === shortLabel ? 'bg-[var(--baseAcc-b)] shadow-md' : ''}`}
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