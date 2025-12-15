'use client'; 

import Image from 'next/image';
import useStore from '@/store/useStore';
import { useEffect } from 'react';
import { FOOTER_LINKS } from '@/constants/navigation';
import { useRouter } from 'next/navigation';

export default function Footer() {

    const router = useRouter();
    const setTheme = useStore((s) => s.setTheme);

    useEffect(() => {
        const darkModeEnabled = document.documentElement.classList.contains('dark');
        setTheme(darkModeEnabled ? 'dark' : 'light');
    }, []);

    return(
        <div className={`z-30 w-full
            flex flex-col items-center justify-center
            pt-12 pb-6 px-6 relative space-y-4
            bg-[var(--bg-main)]`}
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
                        className={`font-Roboto text-xs transition-opacity hover:opacity-50 text-[var(--text-b)]`}
                    >
                        {link.label}
                    </button>
                ))}
            </div>

            <div className='w-full pt-8'>
                <hr className={`text-[var(--text-a)]`} />
                <p className={`'font-Roboto text-xs text-center mt-2 text-[var(--text-c)]`}>© 2025, Serenity ETM. All right reserved.</p>
            </div>
        </div>
    );
}