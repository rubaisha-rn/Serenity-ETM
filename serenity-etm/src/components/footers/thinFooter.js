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

    const blankCardClasses = {
        light: {
            low: 'bg-light-low-blankCard',
            mid: 'bg-light-mid-blankCard',
            high: 'bg-light-high-blankCard',
        },
        dark: {},
    };

    const textClasses = {
        light: 'text-light-textC',
        dark: {},
    };

    return(
        <div className={`z-0 w-full
            flex flex-col items-center justify-center
            p-4 relative
            ${blankCardClasses[theme][stressPalette]}`}
        >
            <p className={`font-Roboto text-[0.6rem] text-center ${textClasses[theme]}`}>© 2025, Serenity ETM. All right reserved.</p>
        </div>
    );
}