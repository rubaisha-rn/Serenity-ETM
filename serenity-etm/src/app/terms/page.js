'use client';

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";

import FloatingBlobs from "@/components/floatingblobs";
import StressControl from "@/components/stressControl";
import useStore from "@/store/useStore";
import Header from "@/components/header";

export default function TermsPage () {
    const router = useRouter();
    
    const emotionValue = useStore((s) => s.emotionValue) ?? 0;
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

    const textAClasses = {
        light: {
            low: 'text-light-low-textA',
            mid: 'text-light-mid-textA',
            high: 'text-light-high-textA',
        },
        dark: {},
    };

    const textBClasses = {
        light: {
            low: 'text-light-low-textB',
            mid: 'text-light-mid-textB',
            high: 'text-light-high-textB',
        },
        dark: {},
    };

    const bgClasses = {
        light: {
            low: 'bg-light-low-bg',
            mid: 'bg-light-mid-bg',
            high: 'bg-light-high-bg',
        },
        dark: {},
    };

    const cardClasses = {
        light: {
            low: 'bg-light-low-card',
            mid: 'bg-light-mid-card',
            high: 'bg-light-high-card',
        },
        dark: {},
    };  

    return (
        <main className={`relative min-h-screen ${textAClasses[theme][stressPalette]} ${bgClasses[theme][stressPalette]}`}>

            <FloatingBlobs className='z-0'/>
            <StressControl className='z-20' />
            
            <Header
                title="Serenity ETM"
                showBack
                backHref="/"
                sticky
                textClass={textBClasses[theme][stressPalette]}
            />
        
            <div className={`flex items-center justify-center min-h-[calc(100vh-4rem)] px-6 md:px-12 py-12 relative z-10 ${cardClasses[theme][stressPalette]}`}>

                <div className={`w-full max-w-3xl ${textBClasses[theme][stressPalette]} p-8 md:p-12`}>

                    {/* header */}
                    <div className="mb-12">
                        
                        <h1 className='font-sans font-bold text-[calmp(2.8rem, 6vw, 4rem)] text-xl'>
                            Terms & Conditions 
                        </h1>
                        
                        <p className='font-Roboto text-sm'>Last Updated: December, 2025</p>
                    
                    </div>

                    <section className={`${textBClasses[theme][stressPalette]} font-sans space-y-8 leading-relaxed text-[clamp(0.85rem,1vw,1rem)]`}>

                        <div>
                            <h3 className="font-semibold text-base mb-2">1. Prototype Disclaimer</h3>

                            <p className="text-sm">Serenity is a university prototype created strictly for academic and demonstrational purposes. This system is not intended for commercial use.</p>

                        </div>

                        <div>

                            <h3 className="font-semibold text-base mb-2">
                                2. Stress-Based UI Adaption
                            </h3>

                            <p className="text-sm">
                                The application adapts its visual interface based on estimated stress values. These values are not medical indicators and carry no diagnostic meaning.
                            </p>

                        </div>

                        <div>

                            <h3 className="font-semibold text-base mb-2">
                                3. Data & Privacy
                            </h3>

                            <p className="text-sm">
                                No real biometric or medical data is stored. Any stress values are either simulated or processed locally for demonstration purposes.
                            </p>

                        </div>

                        <div>

                            <h3 className="font-semibold text-base mb-2">
                                4. Email & Task Content
                            </h3>

                            <p className="text-sm">
                                All displayed emails, tasks, and workplace data are fictional and generated for user demonstration only.
                            </p>

                        </div>

                        <div>

                            <h3 className="font-semibold text-base mb-2">
                                5. Liability
                            </h3>

                            <p className="text-sm">
                                The creators of Serenity assume no responsibility for improper usage, misinterpretation, or dependency on the prototype.
                            </p>

                        </div>

                        <div>

                            <h3 className="font-semibold text-base mb-2">
                                6. Modifications
                            </h3>

                            <p className="text-sm">
                                These terms are subject to change at any time without prior notice as the prototype evolves. 
                            </p>

                        </div>

                    </section>

                </div>

            </div>

        </main>
    );  
}