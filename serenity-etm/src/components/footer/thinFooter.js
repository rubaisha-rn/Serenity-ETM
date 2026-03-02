// complete
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
        <div className='w-full flex flex-col items-center justify-center p-2 relative bg-[var(--bg)]'
        >
            <p className="
                font-Sans text-center text-[var(--text-c)]
                sm:text-[0.4rem]
                md:text-[0.5rem]
                lg:text-[0.6rem]
                xl:text-[0.6rem]
                2xl:text-[0.7rem]
            ">© 2026, Serenity ETM. All right reserved.</p>
        </div>
    );
}