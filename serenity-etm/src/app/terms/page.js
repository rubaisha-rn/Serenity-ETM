'use client';

import { useEffect, useState } from "react";
import Header from "@/components/header";

export default function TermsPage () {
    
    const [theme, setTheme] = useState('light'); 

    useEffect(() => {
        const darkModeEnabled = document.documentElement.classList.contains('dark');
        setTheme(darkModeEnabled ? 'dark' : 'light');
    }, []);

    const textAClasses = {
        light: 'text-light-low-textA',
        dark: '',
    };

    const textBClasses = {
        light: 'text-light-low-textB',
        dark: '',
    };

    const bgClasses = {
        light: 'bg-light-low-bg',
        dark: '',
    };

    const cardClasses = {
        light: 'bg-light-low-blankCard',
        dark: '',
    };  

    return (
        <main className={`relative min-h-screen ${textAClasses[theme]} ${bgClasses[theme]}`}>
            
            <Header
                title="Serenity ETM"
                showBack
                backHref="/"
                sticky
                textClass={textBClasses[theme]}
            />
        
            <div className={`flex items-center justify-center min-h-[calc(100vh-4rem)] px-6 md:px-12 py-12 relative z-10 ${cardClasses[theme]} mx-6 md:mx-36`}>

                <div className={`w-full max-w-3xl ${textBClasses[theme]} p-8`}>

                    {/* header */}
                    <div className="mb-12">
                        
                        <h1 className='font-sans font-bold text-[calmp(2.8rem, 6vw, 4rem)] text-xl'>
                            Terms & Conditions 
                        </h1>
                        
                        <p className='font-Roboto text-sm'>Last Updated: December, 2025</p>
                    
                    </div>

                    <section className={`${textBClasses[theme]} font-sans space-y-8 leading-relaxed text-[clamp(0.85rem,1vw,1rem)]`}>

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