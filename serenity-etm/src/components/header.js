'use client';

import { useRouter } from "next/navigation";
import { useState } from "react";
import Image from "next/image";

export default function Header({
    title = 'Serenity ETM',
    logo = null,
    showBack = false,
    backHref = '/',
    navLinks = [],
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
            z-30 h-8 w-full
            flex items-center 
            px-12
            backdrop-blur-xl
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
                    >
                        <Image
                            src="/icons/back.png"
                            alt='Back'
                            width={18}
                            height={18}
                            priority
                            className="opacity-40"
                        />
                    </button>
                )}

                {/* Menu button */}
                <button
                    onClick={() => setMenuOpen(prev => !prev)}
                    className="relative w-6 h-6 flex-none"
                >
                    {menuOpen 
                        ? <Image
                            src="/icons/menuClose.png"
                            alt='Close menu'
                            width={24}
                            height={24}
                            priority
                            className={`absolute inset-0 transition-opacity duration-300 ease-in-out ${menuOpen ? 'opacity-50' : 'opacity-100'}`}
                            
                        /> : <Image
                            src="/icons/menuOpen.png"
                            alt='Open menu'
                            width={24}
                            height={24}
                            priority
                            className={`absolute inset-0 transition-opacity duration-300 ease-in-out ${menuOpen ? 'opacity-100' : 'opacity-50'}`}
                        /> }
                </button>

                {/* Nav links */}
                {menuOpen && navLinks.length > 0 && (
                    <div className="flex items-center gap-3 ml-4">
                        {navLinks.map((link) => (
                            <button
                                key={link.href}
                                onClick={() => {
                                    router.push(link.href);
                                }}
                                className={`font-Roboto text-xs transition-opacity hover:opacity-70 ${textClass}`}
                            >{link.label}</button>
                        ))}
                    </div>
                )}

            </div>

            {/* Brand logo and name */}

            <div
                className={`
                absolute transition-all duration-500 ease-in-out
                flex items-center gap-1
                ${
                    menuOpen
                        ? 'right-12 opacity-100 scale-100'
                        : 'left-1/2 -translate-x-1/2 opacity-80 scale-95'
                }
                `}
            >
                {logo && <div className="w-4 h-3.5">{logo}</div>}
                <h1 className="font-AbrilFatface font-semibold opacity-50 text-sm">
                    {title}
                </h1>

            </div>

            {/* right slot */}
            <div className="flex-1 flex justify-end items-center">
                {rightElement}
            </div>

        </header>
    );
}