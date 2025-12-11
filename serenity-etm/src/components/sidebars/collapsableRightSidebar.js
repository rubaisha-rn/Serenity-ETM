'use client';

import { useState, useEffect } from 'react';
import { motion } from "framer-motion";
import useStore from '@/store/useStore';
import { Info } from 'lucide-react';

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

    const {focusMode, setFocusMode, priorityMode, setPriorityMode, emotionValue, setEmotionValue, sdkActive, setSdkActive, breatheMode, setBreatheMode} = useStore();
    
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

    const buttonClasses = {
        light: {
            low: 'bg-light-low-icons hover:bg-light-low-b',
            mid: 'bg-light-mid-icons hover:bg-light-mid-b',
            high: 'bg-light-high-icons hover:bg-light-high-b',
        },
        dark: {},
    };

    const blankCardClasses = {
        light: {
            low: 'bg-light-low-blankCard',
            mid: 'bg-light-mid-blankCard',
            high: 'bg-light-high-blankCard',
        },
        dark: {},
    };

    const accClasses = {
        light: {
            low: 'bg-light-low-acc hover:bg-light-low-accHover',
            mid: 'bg-light-mid-acc hover:bg-light-mid-accHover',
            high: 'bg-light-high-acc hover:bg-light-high-accHover',
        },
        dark: {},
    };

    const activeButtonClasses = {
        light: {
            low: 'bg-light-low-a bg-opacity-70 hover:bg-light-low-a hover:bg-opacity-100',
            mid: 'bg-light-mid-a bg-opacity-70 hover:bg-light-mid-a hover:bg-opacity-100',
            high: 'bg-light-high-a bg-opacity-70 hover:bg-light-high-a hover:bg-opacity-100',
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
        <>
            {/* toggle button */}
            <motion.button
                whileHover={{scale: 1.1}}
                whileTap={{scale: 0.9}}
                animate={{right: expanded ? 202 : 22}}
                transition={{duration: 0.25, ease: 'easeInOut'}}
                onClick={() => setExpanded(!expanded)}
                className={`fixed bottom-2 z-10 ${accClasses[theme][stressPalette]} shadow-xl p-1.5 pr-6 rounded-full`}
            >
                <img
                    src='/icons/backw.png'
                    alt='close arrow'
                    className={`w-5 h-5 opacity-80 ${expanded ? 'rotate-180' : ''}`}
                /> 

            </motion.button>

            {/* side bar */}
            <motion.div
                initial={{width: 40}}
                animate={{width: expanded ? 220 : 40}}
                transition={{type: 'spring', stiffness: 260, damping: 20}}
                className={`fixed top-0 right-0 z-30 ${blankCardClasses[theme][stressPalette]} flex flex-col justify-between h-screen shadow-xl overflow-hidden py-6 pt-6`}
                style={{ overflow: 'clip' }}
            >
                <div className={`flex flex-col items-center w-full p-4 gap-3`}>

                    {/* focus button */}
                    <motion.button
                        whileHover={{scale: 1.05}}
                        whileTap={{scale: 0.95}}
                        onClick={() => setFocusMode(!focusMode)}
                        className={`flex items-center $${expanded ? 'gap-3 w-full h-9 px-3 rounded-lg justify-start' : 'gap-0 p-0.5 justify-center rounded-md'}
                        ${focusMode ? `${activeButtonClasses[theme][stressPalette]}` : `${inactiveButtonClasses[theme][stressPalette]}`}`}
                    >
                        <img
                            src={focusMode ? IMG.focus.active : IMG.focus.idle}
                            alt='focus mode'
                            className='w-6 h-6 opacity-80 shrink-0'
                        />

                        <span className={`${textAClasses[theme]} text-sm whitespace-nowrap transition-all duration-150 ${expanded? 'opacity-100' : 'opacity-0 w-0 overflow-hidden'}`}>
                            Focus Mode
                        </span>

                    </motion.button>

                    {expanded && (
                        <span className={`flex gap-1 text-[0.6rem] transition-all duration-150 ${textBClasses[theme]}`}>
                            <Info className='w-2 h-2 mt-0.5 shrink-0'/>
                            Hides non-urgent items when stress is high. You can also activate it manually. 
                            <br/><br/>
                        </span>
                    )}

                    {/* priority button */}
                    <motion.button
                        whileHover={{scale: 1.05}}
                        whileTap={{scale: 0.95}}
                        onClick={() => setPriorityMode(!priorityMode)}
                        className={`flex items-center $${expanded ? 'gap-3 w-full h-9 px-3 rounded-lg justify-start' : 'gap-0 p-0.5 justify-center rounded-md'}
                        ${priorityMode ? `${activeButtonClasses[theme][stressPalette]}` : `${inactiveButtonClasses[theme][stressPalette]}`}`}
                    >
                        <img
                            src={priorityMode ? IMG.priority.active : IMG.priority.idle}
                            alt='priority mode'
                            className='w-6 h-6 opacity-80 shrink-0'
                        />
                        
                        <span className={`${textAClasses[theme]} text-sm whitespace-nowrap transition-all duration-150 ${expanded? 'opacity-100' : 'opacity-0 w-0 overflow-hidden'}`}>
                            Priority Mode
                        </span>
                    </motion.button>

                    {expanded && (
                        <span className={`flex gap-1 text-[0.6rem] transition-all duration-150 ${textBClasses[theme]}`}>
                            <Info className='w-2 h-2 mt-0.5 shrink-0'/>
                            Shows your most important emails and tasks first. 
                            <br/><br/>
                        </span>
                    )}

                    {/* stress detection */}
                    <div className='flex flex-col items-center w-full'>
                        <motion.button
                            whileHover={{scale: 1.05}}
                            whileTap={{scale: 0.95}}
                            onClick={() => {                            setSdkActive(!sdkActive)
                            }}
                            className={`flex items-center $${expanded ? 'gap-3 w-full h-9 px-3 rounded-lg justify-start' : 'gap-0 p-0.5 justify-center rounded-md'}
                            ${sdkActive ? `${activeButtonClasses[theme][stressPalette]}` : `${inactiveButtonClasses[theme][stressPalette]}`}`}
                        >
                            <img
                                src={sdkActive ? IMG.stress.active : IMG.stress.idle}
                                alt='stress detection'
                                className='w-6 h-6 opacity-80 shrink-0'
                            />
                            
                            <span className={`${textAClasses[theme]} text-sm whitespace-nowrap transition-all duration-150 ${expanded? 'opacity-100' : 'opacity-0 w-0 overflow-hidden'}`}>
                                Stress Detection
                            </span>
                        </motion.button>

                        {expanded && (
                            <span className={`flex gap-1 text-[0.6rem] transition-all duration-150 ${textBClasses[theme]}`}>
                            <Info className='w-2 h-2 mt-0.5 shrink-0'/>
                                Automatically estimates stress. <br/>
                                If turned off, use the slider to set your stress level manually.
                                <br/>
                            </span>
                        )}

                        <motion.div
                            initial={{ opacity: 0, height: 0 }}
                            animate={{ height: expanded ? 90 : 0, opacity: expanded ? 1 : 0 }}
                            transition={{duration: 0.25}}
                            className='w-full overflow-hidden'
                            style={{pointerEvents: expanded ? 'auto' : 'none'}}
                        >
                            <label className={`text-[0.6rem] font-semibold ${textBClasses[theme]}`}>Stress Level: {emotionValue}</label>
                            <input
                                type='range'
                                min={0}
                                max={100}
                                step={1}
                                value={emotionValue}
                                onChange={(e) => setEmotionValue(Number(e.target.value))}
                                className={`w-full mt-2 accent-[#373737]`}
                            />
                        </motion.div>
                    </div>  
                </div>

                {/* breathe button */}
                <div className={`flex ${expanded ? 'flex-col' : ''} justify-center px-4 gap-1`}>
                    <motion.button
                        whileHover={{scale: 1.05}}
                        whileTap={{scale: 0.95}}
                        onClick={() => setBreatheMode(!breatheMode)}
                        className={`flex items-center $${expanded ? 'gap-3 w-full h-9 px-3 rounded-lg justify-start' : 'gap-0 p-0.5 justify-center rounded-md'}
                        ${breatheMode ? `${activeButtonClasses[theme][stressPalette]}` : `${inactiveButtonClasses[theme][stressPalette]}`}`}
                    >
                        <img
                            src={breatheMode ? IMG.breathe.active : IMG.breathe.idle}
                            alt='breathe button'
                            className='w-6 h-6 opacity-80 shrink-0'
                        />
                        
                        <span className={`${textAClasses[theme]} text-sm whitespace-nowrap transition-all duration-150 ${expanded? 'opacity-100' : 'opacity-0 w-0 overflow-hidden'}`}>
                            Breathe
                        </span>
                    </motion.button>

                    {expanded && (
                        <span className={`flex gap-1 text-[0.6rem] transition-all duration-150 ${textBClasses[theme]}`}>
                            <Info className='w-2 h-2 mt-0.5 shrink-0'/>
                            Opens a short calming break to help you reset.
                        </span>
                    )}
                </div>
            </motion.div>
        </>
    );
}