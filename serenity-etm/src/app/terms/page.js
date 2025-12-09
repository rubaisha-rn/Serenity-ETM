'use client';

import { useEffect, useState } from "react";
import Header from "@/components/header";
import FloatingBlobs from '@/components/floatingblobs';
import Image from "next/image";
import PrototypeTag from "@/components/prototypeTag";
import Footer from "@/components/footer";

export default function TermsPage () {
    
    const [theme, setTheme] = useState('light'); 

    useEffect(() => {
        const darkModeEnabled = document.documentElement.classList.contains('dark');
        setTheme(darkModeEnabled ? 'dark' : 'light');
    }, []);

    const textAClasses = {
        light: 'text-light-textA',
        dark: '',
    };

    const textBClasses = {
        light: 'text-light-textB',
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
            
            <FloatingBlobs className='z-0'/>
            <PrototypeTag />

            <Header
                title="Serenity ETM"
                logo={<Image
                    src="/logo/logo.png"
                    alt='Serenity ETM Logo'
                    width={18}
                    height={18}
                    priority
                />}
                thisPage="/terms"
                showBack
                showRight
                sticky
                transparent
            />
        
            <div className={`flex items-center justify-center min-h-[calc(100vh-4rem)] px-6 md:px-12 py-12 relative z-10 ${cardClasses[theme]} mx-6 md:mx-36`}>

                <div className={`w-full max-w-3xl ${textBClasses[theme]} p-6`}>

                    {/* header */}
                    <div className="mb-12">
                        
                        <h1 className='font-sans font-bold text-[calmp(2.8rem, vw, 8rem)] text-2xl'>
                            Terms & Conditions 
                        </h1>
                        
                        <p className='font-Roboto text-sm'>Last Updated: December, 2025</p>
                    
                    </div>

                    <section className={`${textBClasses[theme]} font-sans space-y-8 leading-relaxed text-[clamp(0.85rem,1vw,1rem)]`}>

                        <div>
                            <h3 className="font-semibold text-base mb-2">1. Prototype Disclaimer</h3>

                            <p className="text-sm">Serenity ETM is a university prototype created strictly for academic and demonstrational purposes. This system is not intended for commercial ot real-world deployment.</p>

                        </div>

                        <div>

                            <h3 className="font-semibold text-base mb-2">
                                2. Stress-Based UI Adaption
                            </h3>

                            <p className="text-sm">
                                The application adapts its visual interface based on calculated stress estimates derived from user interaction or simulated inputs. These values are not medical indicators and carry no diagnostic or clinical meaning.
                            </p>

                        </div>

                        <div>

                            <h3 className="font-semibold text-base mb-2">
                                3. Data & Privacy
                            </h3>

                            <p className="text-sm">
                                No real biometric, health, or medical data is stored. Stress values calculated locally within the prototype environment for demonstration purposes only and are not used for medical assessment.
                            </p>

                        </div>

                        <div>

                            <h3 className="font-semibold text-base mb-2">
                                4. Email & Task Content
                            </h3>

                            <p className="text-sm">
                                All displayed emails, tasks, and workplace data are entirely fictional and generated soley for demonstration and interaction testing within the prototupe.
                            </p>

                        </div>

                        <div>

                            <h3 className="font-semibold text-base mb-2">
                                5. Liability
                            </h3>

                            <p className="text-sm">
                                The creators of Serenity ETM assume no responsibility for improper usage, misinterpretation, or psychological reliance on the prototype's feedback, insights, or adaptive behaviours.
                            </p>

                        </div>

                        <div>

                            <h3 className="font-semibold text-base mb-2">
                                6. Modifications
                            </h3>

                            <p className="text-sm">
                                These terms are subject to change at any time without prior notice as the prototype evolves during academic development. 
                            </p>

                        </div>

                    </section>

                </div>

            </div>
            <Footer />
        </main>
    );  
}