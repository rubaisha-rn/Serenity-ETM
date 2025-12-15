'use client';

import { motion } from 'framer-motion';
import { useEffect, useState, useId } from 'react';
import useStore from '@/store/useStore';

const Palettes = [
    ['#7097a9', '#b6d8e8', '#afc2f0'],
    ['#c8afc8', '#bfe7d6', '#c8afc8'],
    ['#729e91', '#c9c4eb', '#bfd9d1'],
];

const OVERLAY_DURATION = 8000; // 8secs
const BLOB_COUNT = 10;
const BLOB_BLUR = 100;
const BLOB_SCALE = 1.08;

export default function CalmOverlay() {

    const {calmMode, setCalmMode} = useStore();
    const [blobs, setBlobs] = useState([]);
    const filterId = useId();

    useEffect(() => {

        if(!calmMode) return;

        const arr = Array.from({ length: BLOB_COUNT }).map(() => {
            const colors = Palettes[Math.floor(Math.random() * Palettes.length)];

            return {
                size: 260 + Math.random() * 240,
                x: Math.random() * 80,
                y: Math.random() * 80,
                dx: (Math.random() - 0.5) * 35,
                dy: (Math.random() - 0.5) * 35,
                colors, // store all three colors
            };
        });

        setBlobs(arr);

        const timer = setTimeout(() => {
            setCalmMode(false);
        }, OVERLAY_DURATION);

        return () => clearTimeout(timer);
    }, [calmMode]);

    return(
        <>
            <svg className='absolute w-0 h-0' aria-hidden='true'>
                <filter id={filterId}>
                    <feGaussianBlur in='SourceGraphic' stdDeviation='35' result='blur' />
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

            <div
                className='absolute inset-0'
                style={{filter: `url(#${filterId})`}}
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
                        }}
                        animate={{
                            x: [`0vw`, `${b.dx}vw`],
                            y: [`0vh`, `${b.dy}vh`],
                            scale: [1, BLOB_SCALE],
                        }}
                        transition={{
                            duration: 8 + Math.random() * 4,
                            repeat: Infinity,
                            repeatType: 'mirror',
                            ease: 'easeInOut',
                        }}
                    />
                ))}
            </div>

            <div className='absolute inset-0 flex items-center justify-center'>
                <motion.div
                    initial={{opacity: 0, y: 6}}
                    animate={{opacity: 1, y: 0}}
                    transition={{delay: 0.8}}
                    className='rounded-xl px-6 py-3 text-2xl text-[var(--text-d)] font-AbrilFatface'
                >
                    Let's slow things down for a moment.
                </motion.div>
            </div>
        </> 
    );
}