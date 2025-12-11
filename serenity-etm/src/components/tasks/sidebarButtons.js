'use client';

import { motion } from "framer-motion";
import useStore from "@/store/useStore";

export default function SidebarButton({label, shortLabel, icon, expanded, theme, stressPalette, onClick}) {

    const {showTasks} = useStore();

    const textClasses = {
        light: 'text-light-textA',
        dark: '',
    };

    const activeButtonClasses = {
        light: {
            low: 'bg-light-low-b bg-opacity-70 hover:bg-light-low-b hover:bg-opacity-100',
            mid: 'bg-light-mid-b bg-opacity-70 hover:bg-light-mid-b hover:bg-opacity-100',
            high: 'bg-light-high-b bg-opacity-70 hover:bg-light-high-b hover:bg-opacity-100',
        },
        dark: {},
    }

    const inactiveButtonClasses = {
        light: {
            low: 'bg-light-low-icons bg-opacity-20 hover:bg-light-low-icons hover:bg-opacity-50',
            mid: 'bg-light-mid-icons bg-opacity-20 hover:bg-light-mid-icons hover:bg-opacity-50',
            high: 'bg-light-high-icons bg-opacity-20 hover:bg-light-high-icons hover:bg-opacity-50',
        },
        dark: {},
    };

    return (
        <motion.button
            whileHover={{scale: 1.05}}
            whileTap={{scale: 0.95}}
            className={`flex items-center w-full rounded-md ${expanded ? 'gap-3 w-full h-9 px-3 rounded-lg justify-start' : 'gap-0 justify-center rounded-md'} ${showTasks === shortLabel ? `${activeButtonClasses[theme][stressPalette]}` : `${inactiveButtonClasses[theme][stressPalette]}`}`}
            onClick={onClick}
        >
            <img src={icon} className="w-5 h-5 opacity-80 shrink-0 m-1.5" />
            <span className={`${textClasses[theme]} text-sm whitespace-nowrap transition-all duration-150 ${expanded ? 'opacity-100' : 'opacity-0 w-0 overflow-hidden'}`}>
                {label}
            </span>
        </motion.button>
    );
}