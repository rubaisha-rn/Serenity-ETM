'use client';

import { motion } from "framer-motion";
import useStore from "@/store/useStore";
import { useEffect, useState } from "react";

export default function SecondarySidebar() {
    
    const {screen, emotionValue, expandedSecondary, expandedMain} = useStore();

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

    const cardClasses = {
        light: {
            low: 'bg-light-low-card',
            mid: 'bg-light-mid-card',
            high: 'bg-light-high-card',
        },
        dark: {},
    };

    const themeAClasses = {
        light: {
            low: 'bg-light-low-a',
            mid: 'bg-light-mid-a',
            high: 'bg-light-high-a',
        },
        dark: {},
    }

    const accClasses = {
        light: {
            low: 'bg-light-low-acc hover:bg-light-low-accHover',
            mid: 'bg-light-mid-acc hover:bg-light-mid-accHover',
            high: 'bg-light-high-acc hover:bg-light-high-accHover',
        },
        dark: {},
    };

    const mainLeft = expandedMain ? 220 : 40;

    const TaskButtons = () => (
        <>
            <SidebarButton label='All Tasks' icon='/icons/menuOpen.png' expanded={expandedSecondary} theme={theme} stressPalette={stressPalette} />
            <SidebarButton label='Today' icon='/icons/menuOpen.png' expanded={expandedSecondary} theme={theme} stressPalette={stressPalette} />
            <SidebarButton label='Upcoming' icon='/icons/menuOpen.png' expanded={expandedSecondary} theme={theme} stressPalette={stressPalette} />
            <SidebarButton label='High Priority' icon='/icons/menuOpen.png' expanded={expandedSecondary} theme={theme} stressPalette={stressPalette} />
            <SidebarButton label='Completed' icon='/icons/menuOpen.png' expanded={expandedSecondary} theme={theme} stressPalette={stressPalette} />
        </>
    );

    const EmailButtons = () => (
        <>
            <SidebarButton label='Inbox' icon='/icons/menuOpen.png' expanded={expandedSecondary} theme={theme} stressPalette={stressPalette} />
            <SidebarButton label='Starred' icon='/icons/menuOpen.png' expanded={expandedSecondary} theme={theme} stressPalette={stressPalette} />
            <SidebarButton label='Priority' icon='/icons/menuOpen.png' expanded={expandedSecondary} theme={theme} stressPalette={stressPalette} />
            <SidebarButton label='Drafts' icon='/icons/menuOpen.png' expanded={expandedSecondary} theme={theme} stressPalette={stressPalette} />
            <SidebarButton label='Archive' icon='/icons/menuOpen.png' expanded={expandedSecondary} theme={theme} stressPalette={stressPalette} />
        </>
    );

    return (
        <motion.div
            initial={{width: 0, left: 40}}
            animate={{width: expandedSecondary ? 200 : 40, left: mainLeft}}
            transition={{type: 'spring', stiffness: 300, damping: 30}}
            className={`absolute h-screen top-0 z-10 p-2 border-r mt-7 overflow-hidden shadow-xl items-center justify-center ${cardClasses[theme][stressPalette]}`}
        >
            <div className="flex flex-col gap-3">
                {screen === 'tasks' && <TaskButtons/>}
                {screen === 'emails' && <EmailButtons/>}
            </div>
        </motion.div>
    );
}

function SidebarButton({label, icon, expanded, theme, stressPalette}) {

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
        >
            <img src={icon} className="w-5 h-5 opacity-80 flex-none shrink-0 grow-0 basis-5" />
            <span className={`${textClasses[theme]} text-sm whitespace-nowrap transition-all duration-150 ${expanded ? 'opacity-100' : 'opacity-0 w-0 overflow-hidden'}`}>
                {label}
            </span>
        </motion.button>
    );
}