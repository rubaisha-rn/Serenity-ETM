/**
 * App shell layout component
 * 
 * Manages:
    * Global UI layout (sidebars + main panel + footer)
    * Keyboard navigation
    * Focus mode behaviour
    * Calm mode overlay
    * Dynamic sidebar widths based on state
 */

'use client';

import { useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useRouter } from "next/navigation";
import useStore from "@/store/useStore";
import CollapsableLeftSidebar from "@/components/sidebars/collapsableLeftSidebar";
import CollapsableRightSidebar from "@/components/sidebars/collapsableRightSidebar";
import SecondarySidebar from "@/components/sidebars/secondarySidebar";
import CalmOverlay from "@/components/calmOverlay";
import ModeBanner from "@/components/modeBanner";
import MicroInterventionPopup from "@/components/microIntervention";
import PrototypeTag from "@/components/prototypeTag";
import Footer from "@/components/footer/footer";

export default function AppShell({children}){
    
    // Global UI states store
    const {emotionValue, expandedRight, setExpandedRight, expandedSecondary, setExpandedSecondary, setScreen, screen, calmMode, focusMode, setFocusMode, priorityMode} = useStore();

    const router = useRouter();
    
    // Secondary sidebar should not appear on dashboard
    const showSecondary = screen !== 'dashboard';

    /**
     * Focus mode hysteresis:
     * Automatically enables/disables focus mode based on stress levels/emotionValue
     * Uses hysteresis to svoid rapid toggling:
        * > 69 -> Enable focus mode
        * < 40 -> Disable focus mode
     */
    useEffect(() => {

        if (emotionValue > 69 && !focusMode) {
            setFocusMode(true);
        }
        else if (emotionValue < 40 && focusMode) {
            setFocusMode(false);
        }

    }, [emotionValue]);

    /**
     * Focus mode UI simplification:
     * 
     * When focus mode activates:
        * Collapse right sidebar
        * Collapse left secondary sidebar
     * 
     * When focus mode ends:
        * Restore secondary sidebar
     */
    useEffect(() => {
        if (focusMode) {
            setExpandedRight(false);
            setExpandedSecondary(false);
        }
        else if (!focusMode) {
            setExpandedSecondary(true);
        }
    }, [focusMode]);

    /**
     * Global keyboard shortcuts
     * 
     * Navigation:
        * d -> dashboard
        * e -> emails
        * t -> tasks
     * 
     * Sidebar toggle:
        * e -> toggle email sidebar
        * t -> toggle tasks sidebar
     * 
     * Disabled when typing inside inputs.
     */
    useEffect(() => {
        
        const handleKeyDown = (e) => {
        
            // Prevent shortcuts when typing
            const tag = e.target.tagName;
            if (tag === 'INPUT' || tag === 'TEXTAREA') return;

            // Toggle secondary sidebar inside specific screens
            if (screen === 'emails' && e.key.toLowerCase() === 'e') {
                setExpandedSecondary(!expandedSecondary)
            }

            else if (screen === 'tasks' && e.key.toLowerCase() === 't') {
                setExpandedSecondary(!expandedSecondary)
            }

            // Global screen navigation
            else {
                switch (e.key.toLowerCase()) {
                    case 'd':
                        setScreen('dashboard');
                        router.push('/dashboard');
                        break;

                    case 'e':
                        setScreen('emails');
                        router.push('/emails');
                        break;
                    
                    case 't':
                        setScreen('tasks');
                        router.push('/tasks');
                        break;
                    
                    default:
                        break;
                }
            }
        };

        // Register keyboard navigation
        window.addEventListener('keydown', handleKeyDown);

        // Cleanup on unmount
        return () => window.removeEventListener('keydown', handleKeyDown);

    }, []);

    return (
        <div className="min-h-screen max-w-[1400px] mx-auto relative">
            
            {/* Calm mode overlay with animation */}
            <AnimatePresence>

                {calmMode && (
                    <motion.div
                        key='calm-overlay-wrapper'
                        initial={{opacity: 0}}
                        animate={{opacity: 1}}
                        exit={{opacity: 0}}
                        transition={{ duration: 0.4, ease: 'easeInOut'}}
                        className="fixed inset-0 z-[9999] pointer-events-auto"
                    >
                        <div className="absolute inset-0">
                            <CalmOverlay />
                        </div>
                    </motion.div>
                )}
            
            </AnimatePresence>

            {/* 
                * Main grid layout container. 
                * Dynamic CSS variables to control sidebar widths. 
            */}
            <div className="app-shell"
                style={{
                    
                    /**
                     * Left sidebar width
                     * 
                     * Dashboard -> minimal width
                     * Other screens -> secondary sidebar visible
                     */
                    "--left": 
                        showSecondary 
                        ?   (expandedSecondary ? '264px' : '100px')
                        : '50px',

                    /**
                     * Right sidebar width
                     */
                    "--right": expandedRight ? '214px' : '50px',
                }}
            >
                {/* Left sidebar region */}
                <aside className="flex flex-col overflow-hidden">
                    <CollapsableLeftSidebar />
                    {showSecondary && <SecondarySidebar />}
                </aside>
                
                {/* Main content panel */}
                <main className="main-panel">

                    {/* Mode indicator banner */}
                    <ModeBanner 
                        mode={
                            focusMode ? 'focus' 
                            : priorityMode ? 'priority' 
                            : 'default'
                        } 
                    />

                    {/* Prototype label */}
                    <PrototypeTag />

                    {/* Behavioural intervention popup */}
                    <MicroInterventionPopup />

                    {/* Page content */}
                    {children}
                </main>

                {/* Right sidebar region */}
                <aside className="flex flex-col overflow-hidden">
                    <CollapsableRightSidebar />
                </aside>

                {/* Footer */}
                <footer className="z-0 footer">
                    <Footer />
                </footer>

            </div>
        </div>
    );
}