// completed
'use client';

import { motion, useReducedMotion } from 'framer-motion';
import { useEffect, useState, useId, useRef } from 'react';
import useStore from '@/store/useStore';
import { ICONS } from '@/lib/assets';

const Palettes = [
    ['#3e7170', '#a8d8eb', '#456992'],
    ['#456992', '#3e7170', '#a8d8eb'],
    ['#a8d8eb', '#456992', '#3e7170'],
];

const OVERLAY_DURATION = 10000; // 10 secs
const BLOB_COUNT = 8;
const BLOB_BLUR = 80;

export default function CalmOverlay() {

    const {calmMode, setCalmMode, theme} = useStore();
    
    const prefersReducedMotion = useReducedMotion();
    const overlayRef = useRef(null);
    const closeBtnRef = useRef(null);

    const [blobs, setBlobs] = useState([]);
    const filterId = useId();

    const initialTime = OVERLAY_DURATION / 1000;
    const [timeLeft, setTimeLeft] = useState(initialTime);

    // countdown
    useEffect(() => {
        const interval = setInterval(() => {
            setTimeLeft((prev) => {
                if (prev <= 1) {
                    clearInterval(interval);
                    return 0;
                }
                return prev - 1;
            });
        }, 1000);

        return () => clearInterval(interval);
    }, []);

    // keyboard + focus
    useEffect(() => {
        if (!calmMode) return;

        const previousFocus = document.activeElement;

        closeBtnRef.current?.focus();

        const handleKey = (e) => {
            if (e.key === 'Escape') {
                setCalmMode(false);
            }
        };

        document.addEventListener('keydown', handleKey);

        return () => {
            document.removeEventListener('keydown', handleKey);
            previousFocus?.focus?.();
        };
    }, [calmMode, setCalmMode]);

    // blob generation
    useEffect(() => {

        if(!calmMode) return;

        const arr = Array.from({ length: BLOB_COUNT }).map(() => {
            const colors = Palettes[Math.floor(Math.random() * Palettes.length)];

            return {
                size: 260 + Math.random() * 140,
                x: Math.random() * 90,
                y: Math.random() * 90,
                dx: (Math.random() - 0.5) * 200,
                dy: (Math.random() - 0.5) * 200,
                colors, // store all three colors
                duration: 3 + Math.random() * 2,
            };
        });

        setBlobs(arr);

        const timer = setTimeout(() => {
            setCalmMode(false);
        }, OVERLAY_DURATION);

        return () => clearTimeout(timer);
    }, [calmMode]);

    return(
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
            {/* screen reader live countdown */}
            <div className='sr-only' aria-live='polite'>
                {timeLeft} seconds remaining
            </div>
            
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

            {/* top controls */}
            <div className='absolute top-4 right-4 z-[999] flex flex-row text-black-900 transition-all duration-200 gap-1'>
                <p 
                    className='rounded-md p-1 px-2 bg-black/20 backdrop-blur-md hover:bg-black/30 text-[var(--text-d)] text-sm'
                    aria-hidden='true'
                >
                    {timeLeft} sec
                </p>
                <button
                    ref={closeBtnRef}
                    onClick={() => setCalmMode(false)}
                    aria-label='Close calming overlay'
                    className='rounded-md p-1 bg-black/20 backdrop-blur-md hover:bg-black/30 pointer-events-auto'
                >
                    <img
                        src={ICONS[theme].add}
                        className="w-5 h-5 shrink-0 rotate-45"
                        alt=""
                        aria-hidden='true'
                    />
                </button>
            </div>
            
            {/* blobs */}
            <div
                initial={{opacity: 0, scale:0.8}}
                animate={{opactiy:1, scale:1}}
                transition={{duration:0.12, ease:"easeOut"}}
                className='absolute inset-0 pointer-events-none'
                style={{filter: `url(#${filterId})`}}
                aria-hidden='true'
            >
                {!prefersReducedMotion && 
                    blobs.map((b, i) => (
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

            {/* message */}
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