'use client';

import {motion} from 'framer-motion';
import { useEffect, useState, useId } from 'react';

export default function FloatingBlobs ({count = 12, className = ''}) {
    const [blobs, setBlobs] = useState([]);
    const filterId = useId(); // prevents svg ID collisions in nextjs

    useEffect(() => {
        const arr = Array.from({length: count}).map(() => ({
            size: 220 + Math.random() * 260,
            x: Math.random() * 80,
            y: Math.random() * 80,
            dx: (Math.random() - 0.5) * 35,
            dy: (Math.random() - 0.5) * 35,
        }));
        setBlobs(arr);
    }, [count]);

    return (
        <>
            {/* Gooey filter inspired by lava lamps */}
            <svg
                className='absolute w-0 h-0'
                aria-hidden='true'
                focusable='false'
            >
                <filter id={filterId}>
                    <feGaussianBlur in='SourceGraphic' stdDeviation='35' result='blur' />
                    <feColorMatrix
                        in='blur'
                        mode='matrix'
                        values='
                            1 0 0 0 0
                            0 1 0 0 0
                            0 0 1 0 0
                            0 0 0 20 -9
                        '
                        result='gooey'
                    />
                    <feBlend in='SourceGraphic' in2='gooey' />
                </filter>
            </svg>

            {/* Blob layer */}
            <div
                className={`absolute inset-0 z-10 pointer-events-none ${className}`}
                style={{
                    filter: `url(#${filterId})`,
                }}
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

                            background: 'radial-gradient(circle at 30% 30%, rgba(158, 208, 241, 0.8), transparent 70%), radial-gradient(circle at 70% 70%, rgba(244, 244, 240, 0.8), transparent 70%), radial-gradient(circle at 50% 50%, rgba(209, 187, 227, 0.8), transparent 70%)',

                            filter: 'blur(70px)',
                        }}
                        animate={{
                            x: [0, `{b.dx}vw`, `${-b.dx*0.6}vw`, 0],
                            y: [0, `{b.dy}vh`, `${-b.dy*0.6}vh`, 0],
                            scale: [1, 1.15, 0.95, 1],
                        }}
                        transition={{
                            duration: 40 + Math.random() * 25,
                            repeat: Infinity,
                            ease: 'easeInOut',
                        }}
                    />
                ))}
            </div>
        </>
    );
}