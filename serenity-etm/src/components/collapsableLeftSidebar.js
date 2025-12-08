'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { motion } from "framer-motion";
import useStore from '@/store/useStore';

export default function CollapsableLeftSidebar() {

    const router = useRouter();
    const [expanded, setExpanded] = useState(false);
    const emotionValue = useStore((s) => s.emotionValue);
    const stress01 = emotionValue / 100;
    const [stressPalette, setStressPalette] = useState('low');
    const [theme, setTheme] = useState('light'); 

    useEffect(() => {
        const darkModeEnabled = document.documentElement.classList.contains('dark');
        setTheme(darkModeEnabled ? 'dark' : 'light');
    }, []);

    useEffect(() => {
        if (stress01 !== undefined) {
            if (stress01 < 0.33) setStressPalette('low');
            else if (stress01 < 0.66) setStressPalette('mid');
            else setStressPalette('high');}
    }, [stress01]);

    const textAClasses = {
        light: 'text-light-textA',
        dark: {},
    };

    const textBClasses = {
        light: 'text-light-textB',
        dark: {},
    };

    const bgClasses = {
        light: {
            low: 'bg-light-low-card',
            mid: 'bg-light-mid-card',
            high: 'bg-light-high-card',
        },
        dark: {},
    };

    const navItems = [
        { label: 'Email', icon: 'E'},
        { label: 'Tasks', icon: 'T'},
        { label: 'Notifications', icon: 'N'},
    ];

    return (
        <>
        {/* sidebar */}
        <motion.aside
            animate={{width: expanded ? 200 : 40}}
            transition={{type: 'spring', stiffness: 260, damping: 20}}
            className={`fixed top-0 left-0 z-20 ${bgClasses[theme][stressPalette]} bg-opacity-40 text-black flex flex-col items-center py-4 shadow-xl overflow-hidden h-screen rounded-lg`}
        >
            {/* toggle button */}
            <button
                className="mb-6 flex h-10 w-10 items-center justify-center rounded-lg hover:bg-zinc-800 transition"
                onClick={() => setExpanded(!expanded)}
            >
                <span className="text-lg">M</span>
            </button>

            {/* nav buttons */}
            <div className="flex flex-col gap-3 w-full px-2">
                {navItems.map((item, index) => (
                    <button
                        key={index}
                        className="flex items-center gap-3 w-full rounded-lg px-3 py-2 hover:bg-zinc-800 transition"
                    >
                        <span className="text-lg w-6 text-center"> {item.icon} </span>
                        {expanded && <span className="text-sm whitespace-nowrap">{item.label}</span>}
                    </button>
                ))}
            </div>
        </motion.aside>
        </>
    );
}