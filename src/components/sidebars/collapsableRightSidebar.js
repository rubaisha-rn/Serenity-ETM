/**
 * Collapsable right sidebar. 
 * 
 * Renders adaptive workspace control panel.
 * Features: focus mode, priority mode, summary mode, calm overlay, stress detection.
 * Can expand and collapse to reduce UI clutter.
 */

'use client';

import { motion } from "framer-motion";
import useStore from '@/store/useStore';
import { useEmailStore } from "@/store/emailStore";
import { Info, TriangleAlert } from 'lucide-react';
import { ICONS } from '@/lib/assets';

export default function CollapsableRightSidebar() {

    // Global state values
    const {focusMode, setFocusMode, priorityMode, setPriorityMode, summaryMode, setSummaryMode, emotionValue, setEmotionValue, sdkActive, setSdkActive, calmMode, setCalmMode, expandedRight, setExpandedRight} = useStore();
    const theme = useStore((s) => s.theme);

    // For summarisation button
    const {aiServiceAvailable} = useEmailStore();

    // Keyboard activation helper
    const activate = (e, action) => {

        if (!e) return;

        const key = e.key || e.code;

        // Allow buttons to be activated using enter or spacebar
        if (key === 'Enter' || key === ' ') {
            e.preventDefault();
            action?.();
        }
    };

    return (
        <>
            {/* Sidebar toggle button */}
            <motion.button
                initial={false}
                whileHover={{scale: 1.05}}
                whileTap={{scale: 0.95}}
                animate={{right: expandedRight ? 203 : 38}}
                transition={{duration: 0.25, ease: 'easeInOut'}}
                type='button'
                aria-label={expandedRight ? 'Collapse adaptive workspace settings panel' : 'Expand adaptive workspace settings panel'}
                aria-expanded={expandedRight}
                title='Expand Adaptive Workspace Panel'
                onClick={() => setExpandedRight(!expandedRight)}
                onKeyDown={(e) => activate(e, () => setExpandedRight(!expandedRight))}
                className="fixed bg-[var(--baseAcc-a)] hover:bg-[var(--a-main)] shadow-xl rounded-full z-30 side-bar-toggle"
            >

                <img
                    src={ICONS[theme].arrow}
                    alt='close arrow'
                    aria-hidden='true'
                    className={expandedRight ? 'rotate-180' : ''}
                /> 

            </motion.button>

            {/* Sidebar panel */}
            <motion.nav
                aria-label='Adaptive workspace settings panel'
                initial={{width: 46}}
                animate={{width: expandedRight ? 210 : 46}}
                transition={{type: 'spring', stiffness: 260, damping: 36}}
                className={`fixed top-1 flex flex-col justify-between shadow-xl z-20 side-bar right-1 bg-[var(--baseAcc-b)]
                ${expandedRight ? 'p-2' : ''}`}
                style={{overflow: 'clip'}}
            >

                {/* Mode controls */}
                <div 
                    role='menu' 
                    aria-label="Adaptive workspace mode controls"
                    className={`flex flex-col items-center justify-center
                    ${expandedRight ? 'gap-3' : 'gap-1.5'}`}
                >

                    {/* Focus mode toggle */}
                    <div className='flex flex-row items-center'>
                    
                        {focusMode && (
                            <div className={`${expandedRight ? '' : 'absolute bg-[var(--g-main)] rounded-full shadow side-bar-btn-active right-0'}`}/>
                        )}

                        <div>    
                            <motion.button
                                whileHover={{scale: 1.05}}
                                whileTap={{scale: 0.95}}
                                role='menuitemcheckbox'
                                aria-label='Toggle focus mode'
                                aria-checked={focusMode}
                                title='Focus Mode'
                                onClick={() => setFocusMode(!focusMode)}
                                onKeyDown={(e) => activate(e, () => setFocusMode(!focusMode))}
                                className={`flex items-center justify-center transition-colors side-bar-btn-style ${expandedRight ? 'expanded' : 'justify-center collapsed'}
                                ${focusMode ? 'bg-[var(--d-main)] hover:bg-[var(--e-main)]' : 'bg-[var(--f-main)] hover:bg-[var(--e-main)]'}`}
                            >
                                <img
                                    src={ICONS[theme].focus}
                                    alt=''
                                    aria-hidden='true'
                                />
                                <span className={`text-[var(--text-a)] whitespace-nowrap transition-all duration-150 side-bar-label ${expandedRight? 'opacity-100' : 'opacity-0 w-0 overflow-hidden'}`}>
                                    Focus Mode
                                </span>
                            </motion.button>

                            {/* Mode description visible when sidebar expanded */}
                            {expandedRight && (
                                <span className={`flex transition-all duration-150 text-[var(--text-b)] leading-tight side-bar-help`}>
                                    <Info className='shrink-0 side-bar-info'/>
                                    Hides non-urgent items when stress is high. You can also activate it manually. 
                                </span>
                            )}
                        </div>
                        
                    </div>

                    {/* Priority mode toggle */}
                    <div className='flex flex-row items-center'>
                    
                        {priorityMode && (
                            <div className={`${expandedRight ? '' : 'absolute bg-[var(--g-main)] rounded-full shadow side-bar-btn-active right-0'}`}/>
                        )}

                        <div>
                            <motion.button
                                whileHover={{scale: 1.05}}
                                whileTap={{scale: 0.95}}
                                role='menuitemcheckbox'
                                aria-label='Toggle prioirty mode'
                                aria-checked={priorityMode}
                                title='Priority Mode'
                                onClick={() => setPriorityMode(!priorityMode)}
                                onKeyDown={(e) => activate(e, () => setPriorityMode(!priorityMode))}
                                className={`flex items-center justify-center transition-colors side-bar-btn-style ${expandedRight ? 'expanded' : 'justify-center collapsed'}
                                ${priorityMode ? 'bg-[var(--d-main)] hover:bg-[var(--e-main)]' : 'bg-[var(--f-main)] hover:bg-[var(--e-main)]'}`}
                            >
                                <img
                                    src={ICONS[theme].priority}
                                    alt=''
                                    aria-hidden="true"
                                />
                                <span className={`text-[var(--text-a)] whitespace-nowrap transition-all duration-150 side-bar-label ${expandedRight? 'opacity-100' : 'opacity-0 w-0 overflow-hidden'}`}>
                                    Priority Mode
                                </span>
                            </motion.button>

                            {/* Mode description visible when sidebar expanded */}
                            {expandedRight && (
                                <span className={`flex transition-all duration-150 text-[var(--text-b)] leading-tight side-bar-help`}>
                                    <Info className='shrink-0 side-bar-info'/>
                                    Shows your most important emails and tasks first. 
                                </span>
                            )}
                        </div>

                    </div>

                    {/* Summary mode toggle */}
                    <div className='flex flex-row items-center'>
                    
                        {summaryMode && (
                            <div className={`${expandedRight ? '' : 'absolute bg-[var(--g-main)] rounded-full shadow side-bar-btn-active right-0'}`}/>
                        )}

                        <div>    
                            <motion.button
                                whileHover={!aiServiceAvailable ? {scale:1} :{scale: 1.05}}
                                whileTap={!aiServiceAvailable ? {scale:1} :{scale: 0.95}}
                                role='menuitemcheckbox'
                                aria-label='Toggle summary mode'
                                aria-checked={summaryMode}
                                title='Summary Mode'
                                onClick={() => setSummaryMode(!summaryMode)}
                                onKeyDown={(e) => activate(e, () => setFocusMode(!summaryMode))}
                                className={`flex items-center justify-center transition-colors side-bar-btn-style ${expandedRight ? 'expanded' : 'justify-center collapsed'}
                                ${summaryMode ? 'bg-[var(--d-main)] hover:bg-[var(--e-main)]' : 'bg-[var(--f-main)] hover:bg-[var(--e-main)]'}`}
                                disabled={!aiServiceAvailable}
                            >
                                <img
                                    src={ICONS[theme].summary}
                                    alt=''
                                    aria-hidden='true'
                                    className="aspect-square"
                                />
                                <span className={`text-[var(--text-a)] whitespace-nowrap transition-all duration-150 side-bar-label ${expandedRight? 'opacity-100' : 'opacity-0 w-0 overflow-hidden'}`}>
                                    Summary Mode
                                </span>
                            </motion.button>

                            {/* Mode description visible when sidebar expanded */}
                            {expandedRight && (
                                <>
                                    <span className={`flex transition-all duration-150 text-[var(--text-b)] leading-tight side-bar-help`}>
                                        <Info className='shrink-0 side-bar-info'/>
                                        Summarises long content. You can also activate it manually. 
                                    </span>
                                    {!aiServiceAvailable && (
                                        <span className={`flex transition-all duration-150 text-[var(--danger)] leading-tight side-bar-help`}>
                                            <TriangleAlert className='shrink-0 side-bar-info'/>
                                            AI summarisation is unavailable — local AI service not running.
                                        </span>
                                    )}
                                </>
                            )}
                        </div>
                        
                    </div>

                    {/* Stress detection toggle */}
                    <div className='flex flex-row items-center'>
                    
                        {sdkActive && (
                            <div className={`${expandedRight ? '' : 'absolute bg-[var(--g-main)] rounded-full shadow side-bar-btn-active right-0'}`}/>
                        )}

                        <div className='flex flex-col items-center w-full'>

                            {/* Toggle button */}
                            <motion.button
                                whileHover={{scale: 1.05}}
                                whileTap={{scale: 0.95}}
                                role='menuitemcheckbox'
                                aria-label='Toggle stress detection'
                                aria-checked={sdkActive}
                                title='Stress Detection'
                                onClick={() => {setSdkActive(!sdkActive)}}
                                onKeyDown={(e) => activate(e, () => setSdkActive(!sdkActive))}
                                className={`flex items-center justify-center transition-colors side-bar-btn-style ${expandedRight ? 'expanded' : 'collpased'}
                                ${sdkActive ? 'bg-[var(--d-main)] hover:bg-[var(--e-main)]' : 'bg-[var(--f-main)] hover:bg-[var(--e-main)]'}`}
                            >
                                
                                <img
                                    src={ICONS[theme].stressdetect}
                                    alt=''
                                    aria-hidden='true'
                                />

                                <span className={`text-[var(--text-a)] whitespace-nowrap transition-all duration-150 side-bar-label ${expandedRight? 'opacity-100' : 'opacity-0 w-0 overflow-hidden'}`}>
                                    Stress Detection
                                </span>

                            </motion.button>

                            {/* Mode description */}
                            {expandedRight && (
                                <span className={`flex transition-all duration-150 text-[var(--text-b)] leading-tight side-bar-help`}>
                                    <Info className='shrink-0 side-bar-info'/>
                                    Automatically estimates stress.
                                    If turned off, use the slider to set your stress level manually.
                                </span>
                            )}
                            
                            {/* Stress slider - only usable when automatic stress detection is off */}
                            <motion.div
                                initial={{ opacity: 0, height: 0 }}
                                animate={{ height: expandedRight ? 90 : 0, opacity: expandedRight ? 1 : 0 }}
                                transition={{duration: 0.25}}
                                className='w-[95%] overflow-hidden'
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
                                    className={`w-full mt-1 accent-[var(--baseAcc-a)] bg-[--baseAcc-b] border-[--e-main]`}
                                    aria-valuemin={0}
                                    aria-valuemax={100}
                                    aria-valuenow={emotionValue}
                                    aria-label='Stress Level slider'
                                    title='Stress Level Slider'
                                    disabled={sdkActive}
                                />
                                
                                <div className='flex flex-row justify-between'>
                                    <p>Lowest</p>
                                    <p>Highest</p>
                                </div>

                            </motion.div>
                        </div>  

                    </div>
                </div>

                {/* Calm overlay button */}
                <div className='flex flex-row items-center justify-center'>
                    
                    <div className={`flex ${expandedRight ? 'flex-col' : ''} justify-center items-center gap-1`}>
                    
                        {calmMode && (
                            <div className={`${expandedRight ? '' : 'absolute bg-[var(--g-main)] rounded-full shadow side-bar-btn-active right-0'}`}/>
                        )}

                        <motion.button
                            whileHover={{scale: 1.05}}
                            whileTap={{scale: 0.95}}
                            role='menuitemcheckbox'
                            aria-label='Toggle calm overlay'
                            aria-checked={calmMode}
                            title='Calm Overlay'
                            onClick={() => setCalmMode(!calmMode)}
                            onKeyDown={(e) => activate(e, () => setCalmMode(!calmMode))}
                            className={`flex items-center justify-center transition-colors side-bar-btn-style ${expandedRight ? 'expanded' : 'justify-center collapsed'}
                            ${calmMode ? 'bg-[var(--d-main)] hover:bg-[var(--e-main)]' : 'bg-[var(--f-main)] hover:bg-[var(--e-main)]'}`}
                        >
                            <img
                                src={ICONS[theme].calm}
                                alt=''
                                aria-hidden='true'
                            />
                            <span className={`text-[var(--text-a)] whitespace-nowrap transition-all duration-150 side-bar-label ${expandedRight? 'opacity-100' : 'opacity-0 w-0 overflow-hidden'}`}>
                                Calm Overlay
                            </span>
                        </motion.button>

                        {/* Mode description */}
                        {expandedRight && (
                            <span className={`flex transition-all duration-150 text-[var(--text-b)] leading-tight side-bar-help`}>
                                <Info className='shrink-0 side-bar-info'/>
                                Opens a short calming break to help you reset.
                            </span>
                        )}
                    </div>
                </div>
            </motion.nav>
        </>
    );
}