// done
'use client';

import { motion } from "framer-motion";
import useStore from "@/store/useStore";

export default function TasksSidebarButton({label, shortLabel, icon, expanded, onClick}) {

    const {showTasks} = useStore();

    return (
        <motion.button
            whileHover={{scale: 1.05}}
            whileTap={{scale: 0.95}}
            className={`flex items-center w-full rounded-md ${expanded ? 'gap-3 w-full h-8 px-3 rounded-lg justify-start' : 'gap-0 justify-center rounded-md'} ${showTasks === shortLabel ? 'bg-[var(--a-main)] hover:bg-[var(--aHover-main)]' : 'bg-[var(--icons-main)] hover:bg-[var(--iconsHover-main)]'}`}
            onClick={onClick}
        >
            <img src={icon} className="w-5 h-5 opacity-80 shrink-0 m-1.5" />
            <span className={`text-[var(--text-a)] text-sm whitespace-nowrap transition-all duration-150 ${expanded ? 'opacity-100' : 'opacity-0 w-0 overflow-hidden'}`}>
                {label}
            </span>
        </motion.button>
    );
}