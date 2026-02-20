// set widths according to screen sizes
'use client';

import { useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import CalmOverlay from "@/components/calmOverlay";
import { useRouter } from "next/navigation";
import useStore from "@/store/useStore";
import CollapsableLeftSidebar from "@/components/sidebars/collapsableLeftSidebar";
import CollapsableRightSidebar from "@/components/sidebars/collapsableRightSidebar";
import SecondarySidebar from "@/components/sidebars/secondarySidebar";
import PrototypeTag from "@/components/prototypeTag";
import ThinFooter from "@/components/footers/thinFooter";
import ModeBanner from "@/components/modeBanner";

export default function AppShell({children}){
    
    const {expandedRight, expandedSecondary, setExpandedSecondary, setScreen, screen, calmMode, focusMode, priorityMode} = useStore();
    const router = useRouter();

    useEffect(() => {
        const handleKeyDown = (e) => {
            const tag = e.target.tagName;
                if (tag === 'INPUT' || tag === 'TEXTAREA') return;
                if (screen === 'emails' && e.key.toLowerCase() === 'e') {
                    setExpandedSecondary(!expandedSecondary)
                }
                else if (screen === 'tasks' && e.key.toLowerCase() === 't') {
                    setExpandedSecondary(!expandedSecondary)
                }
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

        window.addEventListener('keydown', handleKeyDown);
        return () => window.removeEventListener('keydown', handleKeyDown);
    }, []);

    return (
        <>
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

            <div className="app-shell"
                style={{
                    "--left": expandedSecondary ? '264px' : '100px',
                    "--right": expandedRight ? '225px' : '50px',
                }}
            >
                <aside className="side-panel">
                    <CollapsableLeftSidebar />
                    <SecondarySidebar />
                </aside>
                
                <main className="main-panel">
                    <ModeBanner mode={focusMode ? 'focus' : priorityMode ? 'priority' : null} />
                    {/* <PrototypeTag /> */}
                    {children}
                </main>

                <aside className="side-panel">
                    <CollapsableRightSidebar />
                </aside>

                <footer className="footer">
                    <ThinFooter />
                </footer>
            </div>
        </>
    );
}