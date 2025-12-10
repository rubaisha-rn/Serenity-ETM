'use client'; 

import useStore from '@/store/useStore';
import { useState, useEffect } from 'react';

export default function ThinFooter() {

    const emotionValue = useStore((s) => s.emotionValue);
    const stress01 = emotionValue / 100;
    const [stressPalette, setStressPalette] = useState('low');
    const [theme, setTheme] = useState('light'); 

    useEffect(() => {
        const darkModeEnabled = document.documentElement.classList.contains('dark');
        setTheme(darkModeEnabled ? 'dark' : 'light');
    }, []);

    useEffect(() => {
        if (stress01 !== undefined) {
            if (stress01 < 0.33) setStressPalette('low');
            else if (stress01 < 0.66) setStressPalette('mid');
            else setStressPalette('high');}
    }, [stress01]);

    const bgClasses = {
        light: {
            low: 'bg-light-low-card',
            mid: 'bg-light-mid-card',
            high: 'bg-light-high-card',
        },
        dark: {},
    };

    return(
        <div className={`z-30 w-full
            flex flex-col items-center justify-center
            p-4 relative
            ${bgClasses[theme][stressPalette]}`}
        >
            <p className='font-Roboto text-[0.6rem] text-light-textC text-center'>© 2025, Serenity ETM. All right reserved.</p>
        </div>
    );
}