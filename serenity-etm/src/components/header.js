'use client';

import { useRouter } from "next/navigation";

export default function Header({
    title = 'Serenity ETM',
    showBack = false,
    backHref = '/',
    navLinks = [],
    rightElement = null,
    sticky = false,
    className = '',
    textClass = '',
}) {
    const router = useRouter();

    return (
        <header
            className={`
            relative z-30 h-10 w-full
            flex items-center justify-between px-12 py-4
            ${sticky ? 'sticky top-0' : ''}
            backdrop-blur-xl
            ${className}`}
        >
            {/* left */}
            <h1 className="font-AbrilFatface text-xl">
                {title}
            </h1>

            {/* right */}
            <div className="flex items-center gap-6">
                {navLinks.map((link) => (
                    <button
                        key={link.href}
                        onClick={() => router.push(link.href)}
                        className={`font-Roboto text-xs 
                        transition-opacity hover:opacity-70 ${textClass}`}
                    >
                        {link.label}
                    </button>
                ))}
                {rightElement}
                {showBack && (
                    <button 
                        onClick={() => router.push(backHref)}
                        className={`font-Roboto text-xs 
                        transition-opacity hover:opacity-70 ${textClass}`}
                    >
                        Back to Home
                    </button>
                )}
            </div>
        </header>
    );
}