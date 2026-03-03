'use client';

import Header from "@/components/header/header";
import Image from "next/image";
import ThinFooter from "@/components/footer/thinFooter";

export default function TermsPage () {
    
    return (
        <main 
            className={`relative min-h-screen text-[var(--text-a)]`}
            style={{
                backgroundImage: "url('/background/bg.png')",
                backgroundSize: "cover",
                backgroundPosition: "center",
                backgroundRepeat: "repeat-y",
            }}
        >
            
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
        
            <div className={`flex items-center justify-center min-h-[calc(100vh-4rem)] px-6 md:px-12 py-12 relative z-10 bg-[var(--cardA-main)] mx-6 md:mx-36`}>

                <div className={`w-full max-w-3xl text-[var(--text-b)] p-6`}>

                    {/* header */}
                    <div className="mb-12">
                        
                        <h1 className='font-sans font-bold text-[calmp(2.8rem, vw, 8rem)] text-2xl'>
                            Terms & Conditions 
                        </h1>
                        
                        <p className='font-Roboto text-sm'>Last Updated: December, 2025</p>
                    
                    </div>

                    <section className={`text-[var(--text-b)] font-sans space-y-8 leading-relaxed text-[clamp(0.85rem,1vw,1rem)]`}>

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
            <ThinFooter />
        </main>
    );  
}