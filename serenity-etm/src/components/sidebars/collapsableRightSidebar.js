'use client';

import { useState, useEffect, useMemo } from 'react';
import { motion, useReducedMotion } from "framer-motion";
import useStore from '@/store/useStore';
import { Info } from 'lucide-react';
import { ICONS } from '@/lib/assets';

export default function CollapsableRightSidebar() {

    const [expanded, setExpanded] = useState(false);

    const {focusMode, setFocusMode, priorityMode, setPriorityMode, emotionValue, setEmotionValue, sdkActive, setSdkActive, calmMode, setCalmMode, theme, setTheme, fontScale, reducedMotion} = useStore();

    const systemPrefersRecuedMotion = useReducedMotion()

    const finalReducedMotion = useMemo(() => {
        if (reducedMotion === 'system') return systemPrefersRecuedMotion;
        return reducedMotion === 'on';
    }, [reducedMotion, systemPrefersRecuedMotion])

    const motionConfig = finalReducedMotion
        ? {}
        : {
            whileHover: {scale: 1.05},
            whileTap: {scale: 0.95},
    };

    // keyboard activation helper
    const activate = (e, action) => {
        if (!e) return;

        const key = e.key || e.code;

        if (key === 'Enter' || key === ' ') {
            e.preventDefault();
            action?.();
        }
    };

    useEffect(() => {
        const darkModeEnabled = document.documentElement.classList.contains('dark');
        setTheme(darkModeEnabled ? 'dark' : 'light');
    }, []);

    return (
        <>
            {/* toggle button */}
            <motion.button
                {...motionConfig}
                animate={{right: expanded ? 210 : 34}}
                transition={{duration: 0.25, ease: 'easeInOut'}}
                type='button'
                aria-label={expanded ? 'Collapse adaptive workspace settings panel' : 'Expand adaptive workspace settings panel'}
                aria-expanded={expanded}
                title='Expand Adaptive Workspace Panel'
                onClick={() => setExpanded(!expanded)}
                onKeyDown={(e) => activate(e, () => setExpanded(!expanded))}
                className={`fixed bottom-[5rem] z-30 bg-[var(--baseAcc-b)] hover:bg-[var(--baseAcc-c)] shadow-xl rounded-full p-2 py-1.5
                ${expanded ? 'pr-1.5' : 'pl-1.5'}`}
            >
                <img
                    src='/icons/backw.png'
                    alt='close arrow'
                    aria-hidden='true'
                    className={`w-4 h-4 opacity-90 ${expanded ? 'rotate-180' : ''}`}
                /> 

            </motion.button>

            {/* side bar */}
            <motion.nav
                aria-label='Adaptive workspace settings panel'
                initial={{width: 46}}
                animate={{width: expanded ? 220 : 46}}
                transition={{type: 'spring', stiffness: 260, damping: 36}}
                className={`fixed top-1 right-1 z-20 bg-[var(--baseAcc-g)] shadow-xl flex flex-col justify-between rounded-lg h-[calc(100vh-0.5rem)] overflow-hidden py-2 px-1 w-10 sm:w-12
                ${expanded ? 'px-2' : ''}`}
                style={{overflow: 'clip'}}
            >
                {/* nav buttons */}
                <div role='menu' className={`flex flex-col items-center
                ${expanded ? 'gap-3' : 'gap-1.5'}`}>

                    {/* focus button */}
                    <div>    
                        <motion.button
                            {...motionConfig}
                            role='menuitemcheckbox'
                            aria-label='Toggle focus mode'
                            title='Focus Mode'
                            onClick={() => setFocusMode(!focusMode)}
                            onKeyDown={(e) => activate(e, () => setFocusMode(!focusMode))}
                            className={`right-sidebar-btn ${expanded ? 'expanded' : 'collapsed'}
                            ${focusMode ? 'bg-[var(--baseAcc-e)]' : ''}`}
                        >
                            <img
                                src={ICONS[theme].focus}
                                alt=''
                                aria-hidden='true'
                                className='w-6 h-6 opacity-90'
                            />

                            <span className={`right-sidebar-label ${expanded? 'show' : 'hide'}`}>
                                Focus Mode
                            </span>

                        </motion.button>

                        {expanded && (
                            <span className={`right-sidebar-help`}>
                                <Info className='w-2 h-2 mt-0.5 shrink-0'/>
                                Hides non-urgent items when stress is high. You can also activate it manually. 
                            </span>
                        )}
                    </div>

                    {/* priority button */}
                    <div>
                        <motion.button
                            {...motionConfig}
                            role='menuitemcheckbox'
                            aria-label='Toggle prioirty mode'
                            title='Priority Mode'
                            onClick={() => setPriorityMode(!priorityMode)}
                            onKeyDown={(e) => activate(e, () => setPriorityMode(!priorityMode))}
                            className={`right-sidebar-btn ${expanded ? 'expanded' : 'collapsed'}
                            ${priorityMode ? 'bg-[var(--baseAcc-e)]' : ''}`}
                        >
                            <img
                                src={ICONS[theme].priority}
                                alt=''
                                aria-hidden="true"
                                className='w-6 h-6 opacity-90'
                            />
                            
                            <span className={`right-sidebar-label ${expanded? 'show' : 'hide'}`}>
                                Priority Mode
                            </span>
                        </motion.button>

                        {expanded && (
                            <span className={`right-sidebar-help`}>
                                <Info className='w-2 h-2 mt-0.5 shrink-0'/>
                                Shows your most important emails and tasks first. 
                            </span>
                        )}
                    </div>

                    {/* stress detection */}
                    <div>
                        <div className='flex flex-col items-center w-full'>
                            <motion.button
                                {...motionConfig}
                                role='menuitemcheckbox'
                                aria-label='Toggle stress detection'
                                title='Stress Detection'
                                onClick={() => {                            setSdkActive(!sdkActive)
                                }}
                                onKeyDown={(e) => activate(e, () => setSdkActive(!sdkActive))}
                                className={`right-sidebar-btn ${expanded ? 'expanded' : 'collpased'}
                                ${sdkActive ? 'bg-[var(--baseAcc-e)]' : ''}`}
                            >
                                <img
                                    src={ICONS[theme].stress}
                                    alt=''
                                    aria-hidden='true'
                                    className='w-6 h-6 opacity-90'
                                />
                                
                                <span className={`right-sidebar-label ${expanded? 'show' : 'hide'}`}>
                                    Stress Detection
                                </span>
                            </motion.button>

                            {expanded && (
                                <span className={`right-sidebar-help`}>
                                <Info className='w-2 h-2 mt-0.5 shrink-0'/>
                                    Automatically estimates stress.
                                    If turned off, use the slider to set your stress level manually.
                                </span>
                            )}

                            <motion.div
                                initial={{ opacity: 0, height: 0 }}
                                animate={{ height: expanded ? 90 : 0, opacity: expanded ? 1 : 0 }}
                                transition={{duration: 0.25}}
                                className='w-full overflow-hidden'
                                style={{pointerEvents: expanded ? 'auto' : 'none'}}
                            >
                                <label htmlFor='stress-slider' className={`text-[0.6rem] font-semibold text-[var(--text-b)]`}>Stress Level: {emotionValue}</label>

                                <input
                                    id='stress-slider'
                                    type='range'
                                    min={0}
                                    max={100}
                                    step={1}
                                    value={emotionValue}
                                    onChange={(e) => setEmotionValue(Number(e.target.value))}
                                    className={`w-full mt-2 accent-[var(--text-b)]`}
                                    aria-valuemin={0}
                                    aria-valuemax={100}
                                    aria-valuenow={emotionValue}
                                    aria-label='Stress Level slider'
                                    title='Stress Level Slider'
                                />
                                <div className='flex flex-row justify-between text-[0.6rem]'>
                                    <p>Lowest</p>
                                    <p>Highest</p>
                                </div>
                            </motion.div>
                        </div>  
                    </div>
                </div>

                {/* calm button */}
                <div className={`flex ${expanded ? 'flex-col' : ''} justify-center gap-1`}>
                    <motion.button
                        {...motionConfig}
                        role='menuitemcheckbox'
                        aria-label='Toggle calm overlay'
                        title='Calm Overlay'
                        onClick={() => setCalmMode(!calmMode)}
                        onKeyDown={(e) => activate(e, () => setCalmMode(!calmMode))}
                        className={`right-sidebar-btn ${expanded ? 'expanded' : 'collapsed'}
                        ${calmMode ? 'bg-[var(--baseAcc-e)]' : ''}`}
                    >
                        <img
                            src={ICONS[theme].calm}
                            alt=''
                            aria-hidden='true'
                            className='w-6 h-6 opacity-90 shrink-0'
                        />
                        
                        <span className={`right-sidebar-label ${expanded? 'show' : 'hide'}`}>
                            Calm Overlay
                        </span>
                    </motion.button>

                    {expanded && (
                        <span className={`right-sidebar-help`}>
                            <Info className='w-2 h-2 mt-0.5 shrink-0'/>
                            Opens a short calming break to help you reset.
                        </span>
                    )}
                </div>
            </motion.nav>
        </>
    );
}