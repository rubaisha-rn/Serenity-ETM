'use client'; 

import useStore from '@/store/useStore';
import { useEffect } from 'react';

export default function ThinFooter() {

    const setTheme = useStore((s) => s.setTheme);
    
    useEffect(() => {
        const darkModeEnabled = document.documentElement.classList.contains('dark');
        setTheme(darkModeEnabled ? 'dark' : 'light');
    }, []);

    return(
        <div className={`z-0 w-full flex flex-col items-center justify-center p-4 relative bg-[var(--bg-main)]`}
        >
            <p className={`font-Roboto text-[0.6rem] text-center text-[var(--text-c)]`}>© 2025, Serenity ETM. All right reserved.</p>
        </div>
    );
}