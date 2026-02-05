'use client';

import { motion, useReducedMotion } from "framer-motion";
import { useEmailStore } from "@/store/emailStore";

export default function EmailsSidebarButton({label, shortLabel, icon, expanded, onClick, shortcut}) {

    const {showEmails} = useEmailStore();
    const prefersReducedMotion = useReducedMotion();

    const motionConfig = prefersReducedMotion
        ? {}
        : {
            whileHover: {scale: 1.02},
            whileTap: {scale: 0.95}
        };

    const isActive = showEmails === shortLabel;

    const activate = (e) => {
        const key = e.key || e.code;

        if (key === 'Enter' || key === ' ') {
            e.preventDefault();
            onClick?.();
        }

        if (shortcut && key.toLowerCase() === shortcut.toLowerCase()) {
            e.preventDefault();
            onClick?.();
        }
    };

    return (
        <motion.button
            {...motionConfig}
            type="button"
            role="menuitem"
            aria-label={label}
            aria-current={isActive ? label : undefined}
            title={!expanded ? label : undefined}
            onClick={onClick}
            onKeyDown={activate}
            className={`flex items-center w-full rounded hover:bg-[var(--baseAcc-e)] opacity-none
            ${expanded ? 'h-7 px-1 gap-3 justify-start' : 'gap-0 justify-center rounded-md'} 
            ${showEmails === shortLabel ? 'bg-[var(--baseAcc-g)] shadow-2xl shadow-black' : ''}
            focus:outline-none
            focus-visible:ring-2
            focus-visible:ring-offset-2
            focus-visible:ring-blue-500`}
        >
            <img 
                src={icon} 
                className="w-5 h-5 opacity-70 shrink-0 m-1.5" 
                alt=""
                aria-hidden='true'
            />
            <span className={`text-[var(--text-a)] text-sm whitespace-nowrap transition-all duration-150 ${expanded ? 'opacity-100' : 'opacity-0 w-0 overflow-hidden'}`}>
                {label}
            </span>
        </motion.button>
    );
}