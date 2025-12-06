'use client';

import { useRouter } from "next/navigation";
import { useState } from "react";
import Image from "next/image";

export default function Header({
    title = 'Serenity ETM',
    logo = null,
    showBack = false,
    backHref = '/',
    rightElement = null,
    sticky = false,
    className = '',
    textClass = '',
}) {
    const router = useRouter();
    const [menuOpen, setMenuOpen] = useState(false);

    return (
        <header
            className={`
            z-30 h-14 w-full
            flex items-center 
            px-12
            backdrop-blur-xl
            bg-neutral-500
            transition-all duration-500
            relative
            ${sticky ? 'sticky top-0' : ''}
            ${className}
            `}
        >
            {/* left */}

            <div className="flex-1 flex items-center gap-4">
                
                {/* Back button */}
                {showBack && (
                    <button
                        onClick={() => router.push(backHref)}
                        className={'font-roboto text-xs transition-opacity hover:opacity-70 ${textClass}'}
                    >Back</button>
                )}

                {/* Menu button */}
                <button
                    onClick={() => setMenuOpen(prev => !prev)}
                    className="font-Roboto text-xs px-3 py-1 hover:opacity-70 transition"
                >
                    {menuOpen 
                        ? <Image
                            src="/icons/menuClose.png"
                            alt='Serenity ETM Logo'
                            width={24}
                            height={24}
                            priority
                        /> : <Image
                            src="/icons/menuOpen.png"
                            alt='Serenity ETM Logo'
                            width={24}
                            height={24}
                            priority
                        /> }
                </button>

            </div>

            {/* Brand logo and name */}

            <div
                className={`
                absolute transition-all duration-500 ease-in-out
                flex items-center gap-2
                ${
                    menuOpen
                        ? 'right-12 opacity-100 scale-100'
                        : 'left-1/2 -translate-x-1/2 opacity-80 scale-95'
                }
                `}
            >
                {logo && <div className="w-6 h-6">{logo}</div>}
                <h1 className="font-AbrilFatface text-xl tracking-wide">{title}</h1>
            </div>

            {/* right slot */}
            <div className="flex-1 flex justify-end items-center">
                {rightElement}
            </div>

        </header>
    );
}