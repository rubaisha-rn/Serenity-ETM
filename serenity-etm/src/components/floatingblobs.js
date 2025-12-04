'use client';

import { motion } from 'framer-motion';
import { useEffect, useState } from 'react';
import useViewport from '../hooks/useViewport';

export default function FloatingBlobs({ count = 5 }) {

    const viewport = useViewport();
    const [blobs, setBlobs] = useState([]);
    
    useEffect(() => {
        if(!viewport.width || !viewport.height) return;

        const newBlobs = Array.from({length: count}).map(() => {
            const size = 150 + Math.random() * 250;
            const pos = getRandomPosition(viewport, size);
            const ani = getRandomAnimation(viewport, size);

            return {size, pos, ani};
        });

        setBlobs(newBlobs);
    }, [viewport, count]);

    return (
        <div className='absolute inset-0 overflow-hidden -z-0'>
            {blobs.map((blob, i) => (
                <motion.div
                    key = {i}
                    className='absolute rounded-full'
                    style={{
                        width: blob.size,
                        height: blob.size,
                        top: blob.pos.y,
                        left: blob.pos.x,
                        background: 'radial-gradient(circle, rgba(203, 123, 135, 0.5) 0%, rgba(255, 182, 193, 0) 70%)',
                        filter: 'blur(40px)',
                    }}
                    animate={{
                        x: blob.ani.x,
                        y: blob.ani.y,
                    }}
                    transition={{
                        duration: 15 + Math.random() * 20,
                        repeat: Infinity,
                        repeatType: 'loop',
                        ease: 'easeInOut',
                    }}
                />
            ))}
        </div>
    );
}

function getRandomPosition(viewport, size) {
    return {
        x: Math.random() * (viewport.width - size),
        y: Math.random() * (viewport.height - size),
    };
}

function getRandomAnimation(viewport, size) {
    const rangeX = Math.random() * (viewport.width -size);
    const rangeY = Math.random() * (viewport.height -size);

    return {
        x: [0, rangeX, -rangeX/2, 0],
        y: [0, rangeY, -rangeY/2, 0],
    };
}