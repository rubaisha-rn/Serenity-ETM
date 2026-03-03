'use client';

import { useRouter } from "next/navigation";
import { useState } from "react";
import Image from "next/image";
import { NAV_LINKS } from "@/constants/navigation";

export default function Header({
    title = 'Serenity ETM',
    logo = null,
    showBack = false,
    showRight = false,
    backHref = '/',
    thisPage = '',
    sticky = false,
    transparent = false,
}) {

    const router = useRouter();
    const [menuOpen, setMenuOpen] = useState(false);

    return (
        <header
            className={`
            z-50 h-8 w-full
            grid grid-cols-3 items-center 
            px-12
            shadow-md
            ${transparent ? 'backdrop-blur-xl' : 'bg-[var(--blankCard-main)]'}
            transition-all duration-500
            ${sticky ? 'sticky top-0' : ''}`}
        >
            {/* left */}

            <div className="flex items-center gap-4 justify-start">
                {showBack && (
                    <button
                        onClick={() => router.push(backHref)}
                        className='transition-opacity hover:opacity-50'
                    >
                        <Image
                            src="/icons/back.png"
                            alt='Back'
                            width={19}
                            height={19}
                            priority
                            className="opacity-50 pb-0.5"
                        />
                    </button>
                )}
            </div>


            {/* Brand logo and name */}

            <div
                className={`flex items-center justify-center gap-1 transition-all duration-500 ease-[cubic-bezier(.4,0,.2,1)]
                    ${
                        menuOpen
                            ? 'opacity-100 scale-100'
                            : 'opacity-90 scale-95'
                    }
                `}
            >
                {logo && <div className="w-4 h-3.5 opacity-50">{logo}</div>}
                <h1 className="font-AbrilFatface text-sm text-[var(--text-a)] opacity-50">
                    {title}
                </h1>
            </div>

            {/* right slot */}
            { showRight && (
                <div className="flex justify-end items-center gap-5">
                    
                    {/* nav links */}
                    <div
                        className={`flex items-center gap-5 transition-all duration-300 ease-out
                            ${
                                menuOpen
                                    ? 'opacity-100 translate-x-0'
                                    : 'opacity-0 translate-x-4 pointer-events-none'
                            }
                        `}
                    >
                        {NAV_LINKS.map((link) => {
                            const isActive = thisPage === link.href;

                            return (
                                <button
                                    key={link.href}
                                    onClick={() => {
                                        router.push(link.href);
                                        setMenuOpen(false);
                                    }}
                                    className="relative flex flex-col items-center font-Roboto text-xs transition-opacity hover:opacity-50 text-[var(--text-b)]"
                                >
                                    <span>{link.label}</span>

                                    {isActive && (
                                        <span
                                            className="absolute -bottom-2 left-1/2 -translate-x-1/2"
                                        >
                                            <Image
                                                src='/icons/pointer.png'
                                                alt="Page pointer"
                                                width={10}
                                                height={10}
                                                priority
                                            />
                                        </span>
                                    )}
                                </button>
                            )
                        })}       
                    </div>

                    {/* menu toggle */}
                    <button
                        onClick={() => setMenuOpen(prev => !prev)}
                        className="relative w-6 h-6 flex-none"
                    >
                        <Image
                            src='/icons/menuOpen.png'
                            alt="Open menu"
                            width={20}
                            height={20}
                            priority
                            className={`absolute inset-0 transition-opacity duration-300 ${menuOpen ? 'opacity-0' : 'opacity-50'}`}
                        />

                        <Image
                            src='/icons/menuClose.png'
                            alt="Close menu"
                            width={20}
                            height={20}
                            priority
                            className={`absolute inset-0 transition-opacity duration-300 ${menuOpen ? 'opacity-50' : 'opacity-0'}`}
                        />

                    </button>

                </div>
            )}

        </header>
    );
}