/**
 * Full screen overlay used during a calming break.
 * 
 * Shows:
    * Animated gradient blobs 
    * Displays short calming message
    * Provides a countdown timer
    * Automatically closes after a set duration
 */

'use client';

import { motion } from 'framer-motion';
import { useEffect, useState, useId, useRef } from 'react';
import useStore from '@/store/useStore';
import { ICONS } from '@/lib/assets';

// Colour palettes used for animated blobs according to theme
const Palettes = {
    
    light: [
        ['#3e7170', '#a8d8eb', '#456992'],
        ['#456992', '#3e7170', '#a8d8eb'],
        ['#a8d8eb', '#456992', '#3e7170'],
    ],

    dark: [
        ['#1a3737', '#19556c', '#134b8b'],
        ['#163b66', '#273d3d', '#2e4a55'],
        ['#258db6', '#0e3a6d', '#0c4443'],
    ]
};

// Number of blobs rendered and their blur amount for 'gooey liquid' effect
const BLOB_COUNT = 8;
const BLOB_BLUR = 80;

export default function CalmOverlay() {

    // Global store values
    const {calmMode, calmModeDuration, setCalmMode} = useStore();
    const theme = useStore((s) => s.theme);
    const OVERLAY_DURATION = calmModeDuration;
    
    // References to DOM elements for focus management
    const overlayRef = useRef(null);
    const closeBtnRef = useRef(null);

    // Stores generated blobs configurations
    const [blobs, setBlobs] = useState([]);
    const filterId = useId();

    // Convert overlay duration to seconds for display counter
    const initialTime = OVERLAY_DURATION / 1000;

    // Countdown time display
    const [timeLeft, setTimeLeft] = useState(initialTime);

    // Countdown timer
    useEffect(() => {

        const interval = setInterval(() => {
        
            setTimeLeft((prev) => {
                
                // No decrease required when countdown reaches 0
                if (prev <= 1) {
                    clearInterval(interval);
                    return 0;
                }

                // Decrease countdown every second
                return prev - 1;
        
            });

        }, 1000);

        return () => clearInterval(interval);
    
    }, []);

    // Keyboard and focus management
    useEffect(() => {

        if (!calmMode) return;

        // Store element that was focused before overlay opened
        const previousFocus = document.activeElement;

        // Move focus to close button for accessibility
        closeBtnRef.current?.focus();

        // Allow escape key to close overlay
        const handleKey = (e) => {
            if (e.key === 'Escape') {
                setCalmMode(false);
            }
        };

        document.addEventListener('keydown', handleKey);

        return () => {

            document.removeEventListener('keydown', handleKey);

            // Restore previous focus when overlay closes
            previousFocus?.focus?.();
        };

    }, [calmMode, setCalmMode]);

    // Randomised blob generation
    useEffect(() => {

        if(!calmMode) return;

        // Generate blob configurations with palette according to theme
        const arr = Array.from({ length: BLOB_COUNT }).map(() => {
            const colors = Palettes[theme][Math.floor(Math.random() * Palettes[theme].length)];

            return {
                size: 260 + Math.random() * 140,
                x: Math.random() * 90,
                y: Math.random() * 90,
                dx: (Math.random() - 0.5) * 200,
                dy: (Math.random() - 0.5) * 200,
                colors,
                duration: 3 + Math.random() * 2,
            };
        });

        setBlobs(arr);

        // Automatically close overlay when time expires
        const timer = setTimeout(() => {
            setCalmMode(false);
        }, OVERLAY_DURATION);

        return () => clearTimeout(timer);
    
    }, [calmMode]);

    return(

        // Root overlay container
        <motion.div 
            ref={overlayRef}
            role='dialog'
            aria-modal='true'
            aria-label='Calming break overlay'
            className='fixed inset-0 z-[999]'
            initial={{opacity:0, backdropFilter: "blur(0px)"}}
            animate={{opacity:1, backdropFilter: "blur(20px)"}}
            exit={{opacity:0, backdropFilter: "blur(0px)"}}
            transition={{duration: 0.6, ease: 'easeOut'}}    
        >
            {/* Screen reader live countdown */}
            <div className='sr-only' aria-live='polite'>
                {timeLeft} seconds remaining
            </div>
            
            {/* SVG filter used for gooey blob effect */}
            <svg className='absolute w-0 h-0' aria-hidden='true'>

                <filter id={filterId}>
                
                    <feGaussianBlur 
                        in='SourceGraphic' 
                        stdDeviation='80' 
                        result='blur' 
                    />
                
                    <feColorMatrix
                        in='blur'
                        mode='matrix'
                        values='
                            1 0 0 0 0
                            0 1 0 0 0
                            0 0 1 0 0
                            0 0 0 5 -2
                        '
                        result='gooey'
                    />
                
                    <feBlend in='SourceGraphic' in2='gooey' />
                
                </filter>
            </svg>

            {/* Top control bar */}
            <div className='absolute top-4 right-4 z-[999] flex flex-row text-black-900 transition-all duration-200 gap-1'>

                {/* Countdown display */}
                <p 
                    className='rounded-md p-1 px-2 bg-black/20 backdrop-blur-md hover:bg-black/30 text-[var(--text-d)] text-sm'
                    aria-hidden='true'
                >
                    {timeLeft} sec
                </p>

                {/* Close button */}
                <button
                    ref={closeBtnRef}
                    onClick={() => setCalmMode(false)}
                    aria-label='Close calming overlay'
                    className='rounded-md p-1 bg-black/20 backdrop-blur-md hover:bg-black/30 pointer-events-auto
                    focus:outline-none 
                    focus-visible:ring-2 
                    focus-visible:ring-blue-500/60 
                    focus-visible:ring-offset-0 
                    focus-visible:shadow-[0_0_0_3px_rgba(59,130,246,0.25)]
                    transition-all duration-150'
                >
                    <img
                        src={ICONS[theme].add}
                        className="w-5 h-5 shrink-0 rotate-45"
                        alt=""
                        aria-hidden='true'
                    />
                </button>
            </div>
            
            {/* Animated blob background */}
            <div
                className='absolute inset-0 pointer-events-none'
                style={{filter: `url(#${filterId})`}}
                aria-hidden='true'
            >
                {blobs.map((b, i) => (
                    <motion.div
                        key={i}
                        style={{
                            position: 'absolute',
                            width: b.size,
                            height: b.size,
                            left: `${b.x}vw`,
                            top: `${b.y}vh`,
                            borderRadius: '50%',
                            background: `radial-gradient(circle at 35% 35%, ${b.colors[0]} 0%, transparent 78%), 
                                        radial-gradient(circle at 65% 35%, ${b.colors[1]} 0%, transparent 78%), 
                                        radial-gradient(circle at 50% 65%, ${b.colors[2]} 0%, transparent 78%)`,
                            filter: `blur(${BLOB_BLUR}px)`,
                            willChange: 'transform',
                        }}
                        animate={{
                            x: [0, b.dx],
                            y: [0, b.dy],
                        }}
                        transition={{
                            duration: b.duration,
                            repeat: Infinity,
                            repeatType: 'mirror',
                            ease: 'easeInOut',
                        }}
                    />
                ))}
            </div>

            {/* Center message */}
            <div className='absolute inset-0 flex items-center justify-center'>
                
                <motion.div
                    initial={{opacity: 0, y: 12, scale: 0.96}}
                    animate={{opacity: 1, y: 0, scale: 1}}
                    exit={{opacity:0, y:8, scale:0.98}}
                    transition={{duration: 0.2, ease: [0.22, 1, 0.36, 1]}}
                    className='rounded-md p-0.5 px-2 bg-black/10 backdrop-blur-md text-lg text-[var(--text-d)] font-Sans font-semibold'
                >
                    Let's slow things down for a moment.
                </motion.div>
            </div>
        </motion.div> 
    );
}