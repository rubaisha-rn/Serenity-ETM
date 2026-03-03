'use client';

import Header from "@/components/header/header";
import Footer from "@/components/footer/footer";
import { ICONS } from "@/lib/assets";
import PrototypeTag from "@/components/prototypeTag";

export default function TermsPage () {
    
    return (
        <main 
            className="relative min-h-screen text-[var(--text-a)]"
            style={{
                backgroundImage: `url(${ICONS.bg.bg})`,
                backgroundSize: "cover",
                backgroundPosition: "center",
                backgroundRepeat: "repeat-y",
            }}
        >
            
            <Header
                title="Serenity ETM"
                logo={<img
                    src={ICONS['dark'].logo}
                    alt='Serenity ETM Logo'
                    className="header-logo"
                />}
                showBack
            />

            <div className="flex flex-col items-center">
                <div className="flex flex-col terms bg-white">

                    {/* heading */}
                    <div>
                        <h3 className="font-bold">Terms & Conditions</h3>
                        <h6 className="font-semibold">Serenity ETM - Emotion-Aware Email & Task Manager</h6>
                        <h6 className="font-semibold">Last Updated: March, 2026</h6>
                    </div>

                    {/* section */}
                    <section>
                        <div>
                            <h6 className="font-semibold">1. Introduction</h6>
                            <p>Serenity ETM ("the Application") is a final year university project developed for academic and demonstration purpose.<br/>By accessing or using the Application, you agree to these Terms & Conditions. If you do not agree, you should discontinue use.</p>
                            <hr className="sm:my-1 md:my-2 lg:my-4 xl:my-4 2xl:my-6"></hr>
                        </div>

                        <div>
                            <h6 className="font-semibold">2. Academic Prototype Disclaimer</h6>
                            <p>Serenity ETM is:</p>
                            <ul className="list-disc text-xs leading-tight sm:pl-2 md:pl-4 lg:pl-6 xl:pl-6 2xl:pl-8">
                                <li><p>An academic coursework project</p></li>
                                <li><p>A functional prototype demonstrating emotion-aware interface adaptation</p></li>
                                <li><p>Not a commercial project</p></li>
                                <li><p>Not intended for production or enterprise deployment</p></li>
                            </ul>
                            <p>The Application may contain experimental features, incomplete functionality, or technical limitations.</p>
                            <hr className="sm:my-1 md:my-2 lg:my-4 xl:my-4 2xl:my-6"></hr>
                        </div>

                        <div>
                            <h6 className="font-semibold">3. Emotion Detection & Webcam Use</h6>
                            <p>The Application uses real-time facial emotion inference technology provided by <b>MorphCast</b> to estimate user stress levels for adaptive interface behaviour.<br/>
                            Important:</p>
                            <ul className="list-disc text-xs leading-tight sm:pl-2 md:pl-4 lg:pl-6 xl:pl-6 2xl:pl-8">
                                <li><p>Emotion detection is probabilistic and may be inaccurate</p></li>
                                <li><p>It does not diagnose emotional or mental health conditions</p></li>
                                <li><p>It is not a medical, psychological, or therapeutic tool</p></li>
                                <li><p>Emotional estimates are used only to adjust interface elements</p></li>
                            </ul>
                            <p>Emotion processing occurs locally in your browser. No facial images or emotional data are stored, recorded, or transmitted to external servers.<br/><br/>By granting webcam access, you consent to temporary real-time processing for adaptive interface functionality. You may disable webcam access at any time via your browser settings.</p>
                            <hr className="sm:my-1 md:my-2 lg:my-4 xl:my-4 2xl:my-6"></hr>
                        </div>

                        <div>
                            <h6 className="font-semibold">4. Data & Storage</h6>

                            <p className="font-semibold">4.1. Emotional Data</p>
                            <ul className="list-disc text-xs leading-tight sm:pl-2 md:pl-4 lg:pl-6 xl:pl-6 2xl:pl-8">
                                <li><p>Emotional states are processed client-side</p></li>
                                <li><p>No emotional data is saved or profiled</p></li>
                                <li><p>No biometric identifiers are stored</p></li>
                            </ul>

                            <p className="font-semibold">4.2. Account & Data</p>
                            <p>User authentication and data storage are managed using <b>Supabase</b>.<br/>Stored information may include:</p>
                            <ul className="list-disc text-xs leading-tight sm:pl-2 md:pl-4 lg:pl-6 xl:pl-6 2xl:pl-8">
                                <li><p>Account login credentials</p></li>
                                <li><p>User created tasks</p></li>
                                <li><p>User created emails</p></li>
                                <li><p>User account settings, which include:</p></li>
                                <ul className="list-disc text-xs leading-tight sm:pl-2 md:pl-4 lg:pl-6 xl:pl-6 2xl:pl-8">
                                    <li><p>Theme selection</p></li>
                                    <li><p>Theme mode</p></li>
                                    <li><p>Calm overlay duration</p></li>
                                    <li><p>Stress detection interval</p></li>
                                    <li><p>Stress detection sensitivity</p></li>
                                </ul>
                                <li><p>Session-related metadata</p></li>
                            </ul>
                            <p>Users are advised not to store sensitive or confidential information, as this is a prototype system and not a production-grade platform.</p>
                            <hr className="sm:my-1 md:my-2 lg:my-4 xl:my-4 2xl:my-6"></hr>
                        </div>

                        <div>
                            <h6 className="font-semibold">5. Fictional Content</h6>
                            <p>Any preloaded emails, tasks, or workplace scenarios displayed within the Application are fictional and created solely for demonstration purposes.<br/>
                            They do not represent real individuals or organisations.</p>
                            <hr className="sm:my-1 md:my-2 lg:my-4 xl:my-4 2xl:my-6"></hr>
                        </div>
                        
                        <div>
                            <h6 className="font-semibold">6. Adaptive Behaviour</h6>
                            <p>Serenity ETM adapts its visual presentation based on inferred stress levels. Adaptive behaviour may include:</p>
                            <ul className="list-disc text-xs leading-tight sm:pl-2 md:pl-4 lg:pl-6 xl:pl-6 2xl:pl-8">
                                <li><p>Interface simplification</p></li>
                                <li><p>Colour changes</p></li>
                                <li><p>Temporary calm overlays</p></li>
                                <li><p>Micro-break prompts</p></li>
                            </ul>
                            <p>These features are designed to support usability and reduce cognitive load. However, the Application does not guarantee stress reduction, improved wellbeing, or productivity gains.</p>
                            <hr className="sm:my-1 md:my-2 lg:my-4 xl:my-4 2xl:my-6"></hr>
                        </div>

                        <div>
                            <h6 className="font-semibold">7. User Responsibilities</h6>
                            <p>You agree to:</p>
                            <ul className="list-disc text-xs leading-tight sm:pl-2 md:pl-4 lg:pl-6 xl:pl-6 2xl:pl-8">
                                <li><p>Use the Application for lawful purposes</p></li>
                                <li><p>Not attempt to exploit, disrupt, or reverse engineer the system</p></li>
                                <li><p>Understand the prototype nature of the Application</p></li>
                            </ul>
                            <p>Use of the system is at your own discretion.</p>
                            <hr className="sm:my-1 md:my-2 lg:my-4 xl:my-4 2xl:my-6"></hr>
                        </div>

                        <div>
                            <h6 className="font-semibold">
                                8. Limitation of Liability
                            </h6>
                            <p>The Application is provided "as is" for academic demonstration purposes.<br/>The developer assumes no liability for:
                            </p>
                            <ul className="list-disc text-xs leading-tight sm:pl-2 md:pl-4 lg:pl-6 xl:pl-6 2xl:pl-8">
                                <li><p>Emotional misinterpretation</p></li>
                                <li><p>Loss of data</p></li>
                                <li><p>Technical malfunctions</p></li>
                                <li><p>Any direct or indirect damages resulting from use</p></li>
                            </ul>
                            <hr className="sm:my-1 md:my-2 lg:my-4 xl:my-4 2xl:my-6"></hr>
                        </div>

                        <div>
                            <h6 className="font-semibold">9. Modifications</h6>
                            <p>As this is an academic project under development, features and functionality may change without notice.<br/>These Terms may also be updated as the prototype evolves.</p>
                            <hr className="sm:my-1 md:my-2 lg:my-4 xl:my-4 2xl:my-6"></hr>
                        </div>

                        <div>
                            <h6 className="font-semibold">10. Termination</h6>
                            <p>Access to the Application may be suspended or discontinued at anytime, particularly in cases of misuse.</p>
                        </div>
                    </section>
                </div>
            </div>
                    
            <PrototypeTag />
            <Footer />

        </main>
    );  
}