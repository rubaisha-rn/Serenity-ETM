'use client'; 

import Image from 'next/image';
import useStore from '@/store/useStore';
import { useState, useEffect } from 'react';
import { FOOTER_LINKS } from '@/constants/navigation';
import { useRouter } from 'next/navigation';

export default function Footer() {

    const router = useRouter();
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
        <div className={`z-30 w-full
            flex flex-col items-center justify-center
            pt-12 pb-6 px-6 relative space-y-4
            ${blankCardClasses[theme][stressPalette]}`}
        >
            <div>
                <Image
                    src="/logo/logo.png"
                    alt='Serenity ETM Logo'
                    width={40}
                    height={40}
                    priority
                    className='opacity-50'
                />
            </div>

            <div className='items-center space-x-6'>
                {FOOTER_LINKS.map((link) => (
                    <button
                        key={link.href}
                        onClick={() => {
                            router.push(link.href);
                        }}
                        className={`font-Roboto text-xs transition-opacity hover:opacity-50 ${textClasses[theme]}`}
                    >
                        {link.label}
                    </button>
                ))}
            </div>

            <div className='w-full pt-8'>
                <hr className={`${textClasses[theme]}`} />
                <p className={`'font-Roboto text-xs text-center mt-2 ${textClasses[theme]}`}>© 2025, Serenity ETM. All right reserved.</p>
            </div>
        </div>
    );
}