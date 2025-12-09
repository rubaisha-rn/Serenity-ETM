'use client';

import { useState, useEffect } from 'react';
import { motion } from "framer-motion";
import useStore from '@/store/useStore';

const IMG = {
    focus: {
        idle: '/icons/focus/focus.png',
        active: '/icons/focus/focusON.png',
    },
    priority: {
        idle: '/icons/priority/priority.png',
        active: '/icons/priority/priorityON.png',
    },
    stress: {
        idle: '/icons/stress/stress.png',
        active: '/icons/stress/stressON.png',
    },
    breathe: {
        idle: '/icons/breathe/breathe.png',
        active: '/icons/breathe/breatheON.png',
    },
}

export default function CollapsableRightSidebar() {

    const [expanded, setExpanded] = useState(false);
    const [stressOpen, setStressOpen] = useState(false);

    const [focusActive, setFocusActive] = useState(false);
    const [priorityActive, setPriorityActive] = useState(false);
    const [stressActive, setStressActive] = useState(false);
    const [breatheActive, setBreatheActive] = useState(false);
    
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

    const cardClasses = {
        light: {
            low: 'bg-light-low-card',
            mid: 'bg-light-mid-card',
            high: 'bg-light-high-card',
        },
        dark: {},
    };

    const accClasses = {
        light: {
            low: 'bg-light-low-acc hover:bg-light-low-accHover',
            mid: 'bg-light-mid-acc hover:bg-light-low-accHover',
            high: 'bg-light-high-acc hover:bg-light-low-accHover',
        },
        dark: {},
    };

    const buttonClasses = {
        light: {
            low: 'bg-light-low-a hover:bg-light-low-b',
            mid: 'bg-light-mid-c hover:bg-light-mid-b',
            high: 'bg-light-high-c hover:bg-light-high-b',
        },
        dark: {},
    };

    return (
        <>
            {/* toggle button */}
            <motion.button
                whileHover={{scale: 1.1}}
                whileTap={{scale: 0.9}}
                animate={{right: expanded ? 202 : 22}}
                transition={{duration: 0.25, ease: 'easeInOut'}}
                onClick={() => setExpanded(!expanded)}
                className={`fixed bottom-2 z-20 ${accClasses[theme][stressPalette]} shadow-xl p-1.5 pr-6 rounded-full`}
            >

                {expanded 
                    ? <img
                        src='/icons/backw.png'
                        alt='close arrow'
                        className='w-5 h-5 opacity-80 rotate-180'
                    /> 
                    : <img
                        src='/icons/backw.png'
                        alt='close arrow'
                        className='w-5 h-5 opacity-80'
                    />}

            </motion.button>

            {/* side bar */}
            <motion.div
                initial={{width: 40}}
                animate={{width: expanded ? 220 : 40}}
                transition={{type: 'spring', stiffness: 260, damping: 20}}
                className={`fixed top-0 right-0 z-30 ${cardClasses[theme][stressPalette]} flex flex-col justify-between h-screen shadow-xl overflow-hidden py-6 pt-6`}
                style={{ overflow: 'clip' }}
            >
                <div className='flex flex-col items-center gap-4 w-full p-4'>

                    {/* focus button */}
                    <motion.button
                        whileHover={{scale: 1.05}}
                        whileTap={{scale: 0.95}}
                        onClick={() => setFocusActive(!focusActive)}
                        className={`flex items-center ${buttonClasses[theme][stressPalette]} bg-opacity-30 hover:bg-opacity-50 ${expanded ? 'gap-3 w-full h-9 px-3 rounded-lg justify-start' : 'gap-0 p-0.5 justify-center rounded-full'}`}
                    >
                        <img
                            src={focusActive ? IMG.focus.active : IMG.focus.idle}
                            alt='focus mode'
                            className='w-6 h-6 opacity-80 shrink-0'
                        />

                        <span className={`${textAClasses[theme]} text-sm whitespace-nowrap transition-all duration-150 ${expanded? 'opacity-100' : 'opacity-0 w-0 overflow-hidden'}`}>
                            Focus Mode
                        </span>

                    </motion.button>

                    <motion.button
                        whileHover={{scale: 1.05}}
                        whileTap={{scale: 0.95}}
                        onClick={() => setPriorityActive(!priorityActive)}
                        className={`flex items-center ${buttonClasses[theme][stressPalette]} bg-opacity-30 hover:bg-opacity-50 ${expanded ? 'gap-3 w-full h-9 px-3 rounded-lg justify-start' : 'gap-0 p-0.5 justify-center rounded-full'}`}
                    >
                        <img
                            src={priorityActive ? IMG.priority.active : IMG.priority.idle}
                            alt='priority mode'
                            className='w-6 h-6 opacity-80 shrink-0'
                        />
                        
                        <span className={`${textAClasses[theme]} text-sm whitespace-nowrap transition-all duration-150 ${expanded? 'opacity-100' : 'opacity-0 w-0 overflow-hidden'}`}>
                            Priority Mode
                        </span>
                    </motion.button>

                    <div className='flex flex-col items-center w-full'>
                        <motion.button
                            whileHover={{scale: 1.05}}
                            whileTap={{scale: 0.95}}
                            onClick={() => {setStressActive(!stressActive)
                            setStressOpen(!stressOpen)
                            }}
                            className={`flex items-center ${buttonClasses[theme][stressPalette]} bg-opacity-30 hover:bg-opacity-50 ${expanded ? 'gap-3 w-full h-9 px-3 rounded-lg justify-start' : 'gap-0 p-0.5 justify-center rounded-full'}`}
                        >
                            <img
                                src={stressActive ? IMG.stress.active : IMG.stress.idle}
                                alt='stress detection'
                                className='w-6 h-6 opacity-80 shrink-0'
                            />
                            
                            <span className={`${textAClasses[theme]} text-sm whitespace-nowrap transition-all duration-150 ${expanded? 'opacity-100' : 'opacity-0 w-0 overflow-hidden'}`}>
                                Stress Detection
                            </span>
                        </motion.button>

                        <motion.div
                            initial={{ opacity: 0, height: 0 }}
                            animate={{ height: !stressOpen && expanded ? 90 : 0, opacity: !stressOpen && expanded ? 1 : 0 }}
                            transition={{duration: 0.25}}
                            className='w-full overflow-hidden px-1'
                        >
                            <label className='text-sm font-medium'>Stress Level</label>
                            <input
                                type='range'
                                min={0}
                                max={100}
                                value={emotionValue}
                                className='w-full mt-2'
                                readOnly
                            />
                            <div className='text-xs mt-1 text-gray-500'>{emotionValue}</div>
                        </motion.div>
                    </div>  
                </div>

                {/* breathe button */}
                <div className='flex justify-center pb-4 px-4'>
                    <motion.button
                        whileHover={{scale: 1.05}}
                        whileTap={{scale: 0.95}}
                        onClick={() => setBreatheActive(!breatheActive)}
                        className={`flex items-center ${buttonClasses[theme][stressPalette]} bg-opacity-30 hover:bg-opacity-50 ${expanded ? 'gap-3 w-full h-9 px-3 rounded-lg justify-start' : 'gap-0 p-0.5 justify-center rounded-full'}`}
                    >
                        <img
                            src={breatheActive ? IMG.breathe.active : IMG.breathe.idle}
                            alt='breathe button'
                            className='w-6 h-6 opacity-80 shrink-0'
                        />
                        
                        <span className={`${textAClasses[theme]} text-sm whitespace-nowrap transition-all duration-150 ${expanded? 'opacity-100' : 'opacity-0 w-0 overflow-hidden'}`}>
                            Breathe
                        </span>
                    </motion.button>
                </div>
            </motion.div>
        </>
    );
}