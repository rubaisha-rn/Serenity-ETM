'use client';

import { motion } from "framer-motion";
import useStore from "@/store/useStore";
import { useEffect, useState } from "react";
import { TaskButtons, EmailButtons } from "../task&emailButtons";

export default function SecondarySidebar() {
    
    const {screen, emotionValue, expandedSecondary, expandedMain, setShowTasks} = useStore();

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

    const textClasses = {
        light: 'text-light-textA',
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

    const mainLeft = expandedMain ? 220 : 40;

    return (
        <motion.div
            initial={{width: 0, left: 40}}
            animate={{width: expandedSecondary ? 200 : 40, left: mainLeft}}
            transition={{type: 'spring', stiffness: 300, damping: 30}}
            className={`fixed top-0 z-10 border-r overflow-hidden shadow-xl items-center justify-center ${expandedSecondary ? 'p-2 pt-11' : 'p-1.5 pt-10'} ${cardClasses[theme][stressPalette]} h-screen`}
        >
            <div className="flex flex-col gap-3">

                {expandedSecondary && (
                    <div className="flex items-center p-2">

                        <h1 className={`text-md ${textClasses[theme]} opacity-70`}>
                            Task Manager
                        </h1>

                    </div>
                )}

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