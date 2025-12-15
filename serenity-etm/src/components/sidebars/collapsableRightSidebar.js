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
    calm: {
        idle: '/icons/calm/calm.png',
        active: '/icons/calm/calmON.png',
    },
}

export default function CollapsableRightSidebar() {

    const [expanded, setExpanded] = useState(false);

    const {focusMode, setFocusMode, priorityMode, setPriorityMode, emotionValue, setEmotionValue, sdkActive, setSdkActive, calmMode, setCalmMode, setTheme} = useStore();

    useEffect(() => {
        const darkModeEnabled = document.documentElement.classList.contains('dark');
        setTheme(darkModeEnabled ? 'dark' : 'light');
    }, []);

    return (
        <>
            {/* toggle button */}
            <motion.button
                whileHover={{scale: 1.1}}
                whileTap={{scale: 0.9}}
                animate={{right: expanded ? 202 : 22}}
                transition={{duration: 0.25, ease: 'easeInOut'}}
                onClick={() => setExpanded(!expanded)}
                className={`fixed bottom-2 z-20 bg-[var(--acc-main)] hover:bg-[var(--accHover-main)] shadow-xl p-1.5 pr-6 rounded-full`}
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
                className={`fixed top-0 right-0 z-20 bg-[var(--bg-main)] shadow-lg flex flex-col justify-between h-screen overflow-hidden py-4 pt-0`}
                style={{ overflow: 'clip' }}
            >
                <div className={`flex flex-col items-center w-full p-4 gap-3`}>

                    {/* focus button */}
                    <motion.button
                        whileHover={{scale: 1.05}}
                        whileTap={{scale: 0.95}}
                        onClick={() => setFocusMode(!focusMode)}
                        className={`flex items-center ${expanded ? 'gap-2 w-full h-9 px-3 rounded-lg justify-start' : 'gap-0 p-0.5 justify-center rounded-md'}
                        ${focusMode ? 'bg-[var(--a-main)] hover:bg-[var(--aHover-main)]' : 'bg-[var(--icons-main)] hover:bg-[var(--iconsHover-main)]'}`}
                    >
                        <img
                            src={focusMode ? IMG.focus.active : IMG.focus.idle}
                            alt='focus mode'
                            className='w-6 h-6 opacity-80 shrink-0'
                        />

                        <span className={`text-[var(--text-a)] text-sm whitespace-nowrap transition-all duration-150 ${expanded? 'opacity-100' : 'opacity-0 w-0 overflow-hidden'}`}>
                            Focus Mode
                        </span>

                    </motion.button>

                    {expanded && (
                        <span className={`flex gap-1 text-[0.6rem] transition-all duration-150 text-[var(--text-b)]`}>
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
                        className={`flex items-center ${expanded ? 'gap-2 w-full h-9 px-3 rounded-lg justify-start' : 'gap-0 p-0.5 justify-center rounded-md'}
                        ${priorityMode ? 'bg-[var(--a-main)] hover:bg-[var(--aHover-main)]' : 'bg-[var(--icons-main)] hover:bg-[var(--iconsHover-main)]'}`}
                    >
                        <img
                            src={priorityMode ? IMG.priority.active : IMG.priority.idle}
                            alt='priority mode'
                            className='w-6 h-6 opacity-80 shrink-0'
                        />
                        
                        <span className={`text-[var(--text-a)] text-sm whitespace-nowrap transition-all duration-150 ${expanded? 'opacity-100' : 'opacity-0 w-0 overflow-hidden'}`}>
                            Priority Mode
                        </span>
                    </motion.button>

                    {expanded && (
                        <span className={`flex gap-1 text-[0.6rem] transition-all duration-150 text-[var(--text-b)]`}>
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
                            className={`flex items-center ${expanded ? 'gap-2 w-full h-9 px-3 rounded-lg justify-start' : 'gap-0 p-0.5 justify-center rounded-md'}
                            ${sdkActive ? 'bg-[var(--a-main)] hover:bg-[var(--aHover-main)]' : 'bg-[var(--icons-main)] hover:bg-[var(--iconsHover-main)]'}`}
                        >
                            <img
                                src={sdkActive ? IMG.stress.active : IMG.stress.idle}
                                alt='stress detection'
                                className='w-6 h-6 opacity-80 shrink-0'
                            />
                            
                            <span className={`text-[var(--text-a)] text-sm whitespace-nowrap transition-all duration-150 ${expanded? 'opacity-100' : 'opacity-0 w-0 overflow-hidden'}`}>
                                Stress Detection
                            </span>
                        </motion.button>

                        {expanded && (
                            <span className={`flex gap-1 text-[0.6rem] transition-all duration-150 text-[var(--text-b)]`}>
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
                            <label className={`text-[0.6rem] font-semibold text-[var(--text-b)]`}>Your Stress Level: {emotionValue}</label>
                            <input
                                type='range'
                                min={0}
                                max={100}
                                step={1}
                                value={emotionValue}
                                onChange={(e) => setEmotionValue(Number(e.target.value))}
                                className={`w-full mt-2 accent-[var(--text-b)]`}
                            />
                            <div className='flex flex-row justify-between text-[0.6rem]'>
                                <p>Lowest</p>
                                <p>Highest</p>
                            </div>
                        </motion.div>
                    </div>  
                </div>

                {/* calm button */}
                <div className={`flex ${expanded ? 'flex-col' : ''} justify-center px-4 gap-1`}>
                    <motion.button
                        whileHover={{scale: 1.05}}
                        whileTap={{scale: 0.95}}
                        onClick={() => setCalmMode(!calmMode)}
                        className={`flex items-center ${expanded ? 'gap-2 w-full h-9 px-3 rounded-lg justify-start' : 'gap-0 p-0.5 justify-center rounded-md'}
                        ${calmMode ? 'bg-[var(--a-main)] hover:bg-[var(--aHover-main)]' : 'bg-[var(--icons-main)] hover:bg-[var(--iconsHover-main)]'}`}
                    >
                        <img
                            src={calmMode ? IMG.calm.active : IMG.calm.idle}
                            alt='calm button'
                            className='w-6 h-6 opacity-80 shrink-0'
                        />
                        
                        <span className={`text-[var(--text-a)] text-sm whitespace-nowrap transition-all duration-150 ${expanded? 'opacity-100' : 'opacity-0 w-0 overflow-hidden'}`}>
                            Calm Overlay
                        </span>
                    </motion.button>

                    {expanded && (
                        <span className={`flex gap-1 text-[0.6rem] transition-all duration-150 text-[var(--text-b)]`}>
                            <Info className='w-2 h-2 mt-0.5 shrink-0'/>
                            Opens a short calming break to help you reset.
                        </span>
                    )}
                </div>
            </motion.div>
        </>
    );
}