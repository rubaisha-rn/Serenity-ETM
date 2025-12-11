'use client';

import { motion } from "framer-motion";

export default function SidebarButton({label, icon, expanded, theme, stressPalette, onClick}) {

    const buttonClasses = {
        light: {
            low: 'bg-light-low-icons hover:bg-light-low-b',
            mid: 'bg-light-mid-icons hover:bg-light-mid-b',
            high: 'bg-light-high-icons hover:bg-light-high-b',
        },
        dark: {},
    };

    const textClasses = {
        light: 'text-light-textA',
        dark: '',
    };

    return (
        <motion.button
            whileHover={{scale: 1.05}}
            whileTap={{scale: 0.95}}
            className={`flex items-center w-full rounded-lg p-1 gap-3 ${buttonClasses[theme][stressPalette]} bg-opacity-25 hover:bg-opacity-40`}
            onClick={onClick}
        >
            <img src={icon} className="w-5 h-5 opacity-80 flex-none shrink-0 grow-0 basis-5" />
            <span className={`${textClasses[theme]} text-sm whitespace-nowrap transition-all duration-150 ${expanded ? 'opacity-100' : 'opacity-0 w-0 overflow-hidden'}`}>
                {label}
            </span>
        </motion.button>
    );
}