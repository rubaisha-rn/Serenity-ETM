'use client';

import { motion } from "framer-motion";
import useStore from "@/store/useStore";
import { useEffect, useState } from "react";
import { TaskButtons, EmailButtons } from "../task&emailButtons";

export default function SecondarySidebar() {
    
    const {screen, focusMode, emotionValue, expandedSecondary, expandedMain, setShowTasks} = useStore();

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

    if(!theme) return null;

    return (
        <motion.div
            initial={{width: 0, left: 40}}
            animate={{width: expandedSecondary ? 200 : 40, left: mainLeft}}
            transition={{type: 'spring', stiffness: 300, damping: 30}}
            className={`absolute h-screen top-0 z-10 p-2 border-r mt-7 overflow-hidden shadow-xl items-center justify-center ${cardClasses[theme][stressPalette]}`}
        >
            <div className="flex flex-col gap-3">
                {screen === 'tasks' && (
                    <TaskButtons
                        expandedSecondary={expandedSecondary}
                        theme={theme}
                        stressPalette={stressPalette}
                        setShowTasks={setShowTasks}
                    />
                )}
                {screen === 'emails' && (
                    <EmailButtons
                        expandedSecondary={expandedSecondary}
                        theme={theme}
                        stressPalette={stressPalette}
                        setShowTasks={setShowTasks}
                    />
                )}
            </div>
        </motion.div>
    );
}