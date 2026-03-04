/**
 * Reusable page header
 */

'use client';

import { useRouter } from "next/navigation";

export default function Header({
    // Props
    title = 'Serenity ETM',
    logo = null,
    showBack = false,
    backHref = '/',
}) {

    // To navigate
    const router = useRouter();

    return (

        // Header container
        <header
            role="banner"
            className={`header z-50 items-center backdrop-blur-md transition-all duration-500 sticky top-0`}
        >

            {/* Left section */}
            <div className="flex items-center gap-4 justify-start">
                
                {showBack && (

                    // Navigate back to provided route
                    <button
                        onClick={() => router.push(backHref)}
                        className='transition-opacity hover:opacity-50'
                        aria-label="Go back"
                        title="Back"
                    >
                        <p className="underline hover:text-blue-400">Back</p>
                    </button>
                )}
            </div>

            {/* Brand logo and title */}
            <div
                className={`flex items-center justify-center gap-1 transition-all duration-500 ease-[cubic-bezier(.4,0,.2,1)]`}
                aria-label="Application title"
            >
                {logo && 
                    <div 
                        className="header-logo"
                        aria-hidden="true"
                    >
                        {logo}
                    </div>
                }
                <h6 
                    className="font-AbrilFatface font-semibold text-[var(--text-b)]"
                >
                    {title}
                </h6>
            </div>
        </header>
    );
}