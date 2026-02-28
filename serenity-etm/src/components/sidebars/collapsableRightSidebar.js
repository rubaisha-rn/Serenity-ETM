// complete
'use client';

import { useEffect } from 'react';
import { motion } from "framer-motion";
import useStore from '@/store/useStore';
import { Info } from 'lucide-react';
import { ICONS } from '@/lib/assets';

export default function CollapsableRightSidebar() {

    const {focusMode, setFocusMode, priorityMode, setPriorityMode, emotionValue, setEmotionValue, sdkActive, setSdkActive, calmMode, setCalmMode, theme, setTheme, expandedRight, setExpandedRight} = useStore();

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
                initial={false}
                whileHover={{scale: 1.05}}
                whileTap={{scale: 0.95}}
                animate={{right: expandedRight ? 213 : 38}}
                transition={{duration: 0.25, ease: 'easeInOut'}}
                type='button'
                aria-label={expandedRight ? 'Collapse adaptive workspace settings panel' : 'Expand adaptive workspace settings panel'}
                aria-expanded={expandedRight}
                title='Expand Adaptive Workspace Panel'
                onClick={() => setExpandedRight(!expandedRight)}
                onKeyDown={(e) => activate(e, () => setExpandedRight(!expandedRight))}
                className="side-bar-toggle"
            >
                <img
                    src='/icons/backw.png'
                    alt='close arrow'
                    aria-hidden='true'
                    className={expandedRight ? 'rotate-180 ml-0.5' : 'mr-0.5'}
                /> 

            </motion.button>

            {/* side bar */}
            <motion.nav
                aria-label='Adaptive workspace settings panel'
                initial={{width: 46}}
                animate={{width: expandedRight ? 220 : 46}}
                transition={{type: 'spring', stiffness: 260, damping: 36}}
                className={`side-bar right-1 bg-[var(--baseAcc-b)]
                ${expandedRight ? 'px-2' : ''}`}
                style={{overflow: 'clip'}}
            >
                {/* nav buttons */}
                <div role='menu' className={`flex flex-col items-center
                ${expandedRight ? 'gap-3' : 'gap-1.5'}`}>

                    {/* focus button */}
                    <div className='flex flex-row items-center'>
                    
                        {focusMode && (
                            <div className={`${expandedRight ? '' : 'side-bar-btn-active right-0'}`}/>
                        )}

                        <div>    
                            <motion.button
                                whileHover={{scale: 1.05}}
                                whileTap={{scale: 0.95}}
                                role='menuitemcheckbox'
                                aria-label='Toggle focus mode'
                                title='Focus Mode'
                                onClick={() => setFocusMode(!focusMode)}
                                onKeyDown={(e) => activate(e, () => setFocusMode(!focusMode))}
                                className={`side-bar-btn-style bg-[var(--f-main)] hover:bg-[var(--d-main)] ${expandedRight ? 'expanded' : 'collapsed'}
                                ${focusMode ? 'bg-[var(--e-main)]' : ''}`}
                            >
                                <img
                                    src={ICONS[theme].focus}
                                    alt=''
                                    aria-hidden='true'
                                />
                                <span className={`side-bar-label ${expandedRight? 'show' : 'hide'}`}>
                                    Focus Mode
                                </span>
                            </motion.button>

                            {expandedRight && (
                                <span className={`side-bar-help`}>
                                    <Info className='side-bar-info'/>
                                    Hides non-urgent items when stress is high. You can also activate it manually. 
                                </span>
                            )}
                        </div>
                    </div>

                    {/* priority button */}
                    <div className='flex flex-row items-center'>
                    
                        {priorityMode && (
                            <div className={`${expandedRight ? '' : 'side-bar-btn-active right-0'}`}/>
                        )}

                        <div>
                            <motion.button
                                whileHover={{scale: 1.05}}
                                whileTap={{scale: 0.95}}
                                role='menuitemcheckbox'
                                aria-label='Toggle prioirty mode'
                                title='Priority Mode'
                                onClick={() => setPriorityMode(!priorityMode)}
                                onKeyDown={(e) => activate(e, () => setPriorityMode(!priorityMode))}
                                className={`side-bar-btn-style bg-[var(--f-main)] hover:bg-[var(--d-main)] ${expandedRight ? 'expanded' : 'collapsed'}
                                ${priorityMode ? 'bg-[var(--e-main)]' : ''}`}
                            >
                                <img
                                    src={ICONS[theme].priority}
                                    alt=''
                                    aria-hidden="true"
                                />
                                <span className={`side-bar-label ${expandedRight? 'show' : 'hide'}`}>
                                    Priority Mode
                                </span>
                            </motion.button>

                            {expandedRight && (
                                <span className={`side-bar-help`}>
                                    <Info className='side-bar-info'/>
                                    Shows your most important emails and tasks first. 
                                </span>
                            )}
                        </div>
                    </div>

                    {/* stress detection */}
                    <div className='flex flex-row items-center'>
                    
                        {sdkActive && (
                            <div className={`${expandedRight ? '' : 'side-bar-btn-active right-0'}`}/>
                        )}

                        <div>
                            <div className='flex flex-col items-center w-full'>
                                <motion.button
                                    whileHover={{scale: 1.05}}
                                    whileTap={{scale: 0.95}}
                                    role='menuitemcheckbox'
                                    aria-label='Toggle stress detection'
                                    title='Stress Detection'
                                    onClick={() => {setSdkActive(!sdkActive)}}
                                    onKeyDown={(e) => activate(e, () => setSdkActive(!sdkActive))}
                                    className={`side-bar-btn-style bg-[var(--f-main)] hover:bg-[var(--d-main)] ${expandedRight ? 'expanded' : 'collpased'}
                                    ${sdkActive ? 'bg-[var(--e-main)]' : ''}`}
                                >
                                    <img
                                        src={ICONS[theme].stressdetect}
                                        alt=''
                                        aria-hidden='true'
                                    />
                                    <span className={`side-bar-label ${expandedRight? 'show' : 'hide'}`}>
                                        Stress Detection
                                    </span>
                                </motion.button>

                                {expandedRight && (
                                    <span className={`side-bar-help`}>
                                    <Info className='side-bar-info'/>
                                        Automatically estimates stress.
                                        If turned off, use the slider to set your stress level manually.
                                    </span>
                                )}

                                <motion.div
                                    initial={{ opacity: 0, height: 0 }}
                                    animate={{ height: expandedRight ? 90 : 0, opacity: expandedRight ? 1 : 0 }}
                                    transition={{duration: 0.25}}
                                    className='w-full overflow-hidden'
                                    style={{pointerEvents: expandedRight ? 'auto' : 'none'}}
                                >
                                    <p>Stress Level: {emotionValue}</p>

                                    <input
                                        id='stress-slider'
                                        type='range'
                                        min={0}
                                        max={100}
                                        step={1}
                                        value={emotionValue}
                                        onChange={(e) => setEmotionValue(Number(e.target.value))}
                                        className={`w-full mt-1 accent-[var(--baseAcc-a)]`}
                                        aria-valuemin={0}
                                        aria-valuemax={100}
                                        aria-valuenow={emotionValue}
                                        aria-label='Stress Level slider'
                                        title='Stress Level Slider'
                                    />
                                    <div className='flex flex-row justify-between'>
                                        <p>Lowest</p>
                                        <p>Highest</p>
                                    </div>
                                </motion.div>
                            </div>  
                        </div>
                    </div>
                </div>

                {/* calm button */}
                <div className='flex flex-row items-center justify-center'>
                    <div className={`flex ${expandedRight ? 'flex-col' : ''} justify-center items-center gap-1`}>
                    
                        {calmMode && (
                            <div className={`${expandedRight ? '' : 'side-bar-btn-active right-0'}`}/>
                        )}

                        <motion.button
                            whileHover={{scale: 1.05}}
                            whileTap={{scale: 0.95}}
                            role='menuitemcheckbox'
                            aria-label='Toggle calm overlay'
                            title='Calm Overlay'
                            onClick={() => setCalmMode(!calmMode)}
                            onKeyDown={(e) => activate(e, () => setCalmMode(!calmMode))}
                            className={`side-bar-btn-style bg-[var(--f-main)] hover:bg-[var(--d-main)] ${expandedRight ? 'expanded' : 'collapsed'}
                            ${calmMode ? 'bg-[var(--e-main)]' : ''}`}
                        >
                            <img
                                src={ICONS[theme].calm}
                                alt=''
                                aria-hidden='true'
                            />
                            <span className={`side-bar-label ${expandedRight? 'show' : 'hide'}`}>
                                Calm Overlay
                            </span>
                        </motion.button>

                        {expandedRight && (
                            <span className={`side-bar-help`}>
                                <Info className='side-bar-info'/>
                                Opens a short calming break to help you reset.
                            </span>
                        )}
                    </div>
                </div>
            </motion.nav>
        </>
    );
}