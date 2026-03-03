'use client';

import { useRouter } from "next/navigation";

export default function Header({
    title = 'Serenity ETM',
    logo = null,
    showBack = false,
    backHref = '/',
}) {

    const router = useRouter();

    return (
        <header
            className={`header z-50 items-center backdrop-blur-md transition-all duration-500 sticky top-0`}
        >

            {/* left */}
            <div className="flex items-center gap-4 justify-start">
                {showBack && (
                    <button
                        onClick={() => router.push(backHref)}
                        className='transition-opacity hover:opacity-50'
                    >
                        <p className="underline hover:text-blue-400">Back</p>
                    </button>
                )}
            </div>

            {/* Brand logo and name */}
            <div
                className={`flex items-center justify-center gap-1 transition-all duration-500 ease-[cubic-bezier(.4,0,.2,1)]`}
            >
                {logo && <div className="header-logo">{logo}</div>}
                <h6 className="font-AbrilFatface font-semibold text-[var(--text-b)]">{title}</h6>
            </div>
        </header>
    );
}