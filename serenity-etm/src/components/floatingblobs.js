'use client';

import {motion} from 'framer-motion';
import { useEffect, useState, useId } from 'react';
import useStore from '@/store/useStore';
import { useStressColors } from '@/hooks/useStressColors';

export default function FloatingBlobs ({count = 10, className = ''}) {

    const emotionValue = useStore((s) => s.emotionValue);
    const stress01 = emotionValue / 100;

    const colors = useStressColors(stress01);
    const [blobs, setBlobs] = useState([]);
    const filterId = useId(); // prevents svg ID collisions in nextjs

    const speed = 30 + stress01 * 60; // slow on high stress 
    const blur = 90 + stress01 * 50; // soft on high stress
    const scaleRange = 1 + stress01 * 0.2; // gentler breathing 

    useEffect(() => {
        const arr = Array.from({length: count}).map((_, i) => ({
            size: 240 + Math.random() * 300,
            x: Math.random() * 80,
            y: Math.random() * 80,
            dx: (Math.random() - 0.5) * 40,
            dy: (Math.random() - 0.5) * 40,
            color: colors[i % colors.length],
        }));

        setBlobs(arr);
    }, [count, colors]);

    return (
        <>
            {/* Gooey filter inspired by lava lamps */}
            <svg
                className='absolute w-0 h-0' aria-hidden='true'
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
                            0 0 0 5 -2
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
                            background: b.color,
                            filter: `blur(${blur}px)`,
                            opacity: 0.85,
                            boxShadow: `0 0 80px ${b.color}`,
                        }}
                        animate={{
                            x: [0, `${b.dx}vw`, `${-b.dx*0.6}vw`, 0],
                            y: [0, `${b.dy}vh`, `${-b.dy*0.6}vh`, 0],
                            scale: [1, scaleRange, 0.95, 1],
                        }}
                        transition={{
                            duration: speed,
                            repeat: Infinity,
                            ease: 'easeInOut',
                        }}
                    />
                ))}
            </div>
        </>
    );
}