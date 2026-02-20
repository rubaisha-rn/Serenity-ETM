// add image sizes, widths, and other things according to window
'use client';

import { motion } from "framer-motion";
import useStore from "@/store/useStore";

export default function TasksSidebarButton({label, shortLabel, icon, expanded, onClick, shortcut}) {

    const {showTasks} = useStore();

    const isActive = showTasks === shortLabel;

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
            <img 
                src={icon} 
                className="lg:w-5 aspect-square opacity-80 m-1.5" 
                alt=""
                aria-hidden='true'
            />
            <span className={`secondary-side-bar-label ${expanded ? 'show' : 'hide'}`}>
                {label}
            </span>
        </motion.button>
    );
}