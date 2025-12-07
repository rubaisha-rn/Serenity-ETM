'use client';

import { motion } from 'framer-motion';
import { useEffect, useState, useId } from 'react';
import useStore from '@/store/useStore';

const Palettes = [
    ['#deb6ab', '#b6d8e8', '#afc2f0'],
    ['#f2e1a6', '#bfe7d6', '#c8afc8'],
    ['#c4d9eb', '#c9c4eb', '#bfd9d1'],
];

function lerp(a, b, t) {
    return a + (b - a) * t;
}

function mixHex(c1, c2, t) {
    const a = parseInt(c1.slice(1), 16);
    const b = parseInt(c2.slice(1), 16);

    const r = lerp((a >> 16) & 255, (b >> 16) & 255, t);
    const g = lerp((a >> 8) & 255, (b >> 8) & 255, t);
    const b2 = lerp(a & 255, b & 255, t);

    return `rgb(${r|0}, ${g|0}, ${b2|0})`;
}

export default function FloatingBlobs({ count = 10, className = '' }) {
    const emotionValue = useStore((s) => s.emotionValue);
    const stress01 = emotionValue / 100;

    const [blobs, setBlobs] = useState([]);
    const filterId = useId();

    useEffect(() => {
        const arr = Array.from({ length: count }).map(() => {
            const colors = Palettes[Math.floor(Math.random() * Palettes.length)];
            return {
                size: 240 + Math.random() * 300,
                x: Math.random() * 80,
                y: Math.random() * 80,
                dx: (Math.random() - 0.5) * 40,
                dy: (Math.random() - 0.5) * 40,
                colors, // store all three colors
            };
        });
        setBlobs(arr);
    }, [count]);

    const speed = 30 + stress01 * 60;
    const blur = 90 + stress01 * 50;
    const scaleRange = 1 + stress01 * 0.2;

    // helper to pick main color based on stress01
    const getBlobColors = (colors, stress) => {
        if (stress < 0.5) {
            const t = stress / 0.5;
            return [
                mixHex(colors[0], colors[1], t),
                colors[1],
                colors[2],
            ];
        } else {
            const t = (stress - 0.5) / 0.5;
            return [
                mixHex(colors[1], colors[2], t),
                colors[1],
                colors[2],
            ];
        }
    };

    return (
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
                className={`absolute inset-0 z-10 pointer-events-none ${className}`}
                style={{ filter: `url(#${filterId})` }}
            >
                {blobs.map((b, i) => {
                    const [c0, c1, c2] = getBlobColors(b.colors, stress01);

                    return (
                        <motion.div
                            key={i}
                            style={{
                                position: 'absolute',
                                width: b.size,
                                height: b.size,
                                left: `${b.x}vw`,
                                top: `${b.y}vh`,
                                borderRadius: '50%',
                                background: `radial-gradient(circle at 35% 35%, ${c0} 0%, transparent 78%), 
                                             radial-gradient(circle at 65% 35%, ${c1} 0%, transparent 78%), 
                                             radial-gradient(circle at 50% 65%, ${c2} 0%, transparent 78%)`,
                                filter: `blur(${blur}px)`,
                            }}
                            animate={{
                                x: [0, `${b.dx}vw`, `${-b.dx * 0.6}vw`, 0],
                                y: [0, `${b.dy}vh`, `${-b.dy * 0.6}vh`, 0],
                                scale: [1, scaleRange, 0.95, 1],
                            }}
                            transition={{
                                duration: speed,
                                repeat: Infinity,
                                ease: 'easeInOut',
                            }}
                        />
                    );
                })}
            </div>
        </>
    );
}