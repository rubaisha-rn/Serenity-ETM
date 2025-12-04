'use client';

import { useEffect, useState } from 'react';

export default function useViewport() {
    
    const [viewport, setViewport] = useState({width: 0, height: 0});

    useEffect(() => {
        function handleResize() {
            setViewport({ width: window.innerWidth, height: window.innerHeight});
        }

        handleResize();
        window.addEventListener('resize', handleResize);
        return () => window.removeEventListener('resize', handleResize);
    }, []);

    return viewport;
}