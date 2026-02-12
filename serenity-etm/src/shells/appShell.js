// set widths according to screen sizes
'use client';

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import useStore from "@/store/useStore";
import CollapsableLeftSidebar from "@/components/sidebars/collapsableLeftSidebar";
import CollapsableRightSidebar from "@/components/sidebars/collapsableRightSidebar";
import SecondarySidebar from "@/components/sidebars/secondarySidebar";
import PrototypeTag from "@/components/prototypeTag";
import ThinFooter from "@/components/footers/thinFooter";

export default function AppShell({children}){
    
    const {expandedRight, expandedSecondary, setExpandedSecondary, setScreen, screen} = useStore();
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
        <div className="app-shell"
            style={{
                "--left": expandedSecondary ? '264px' : '100px',
                "--right": expandedRight ? '214px' : '50px',
            }}
        >
            <aside className="side-panel">
                <CollapsableLeftSidebar />
                <SecondarySidebar />
            </aside>
            
            <main className="main-panel">
                <PrototypeTag />
                {children}
            </main>

            <aside className="side-panel">
                <CollapsableRightSidebar />
            </aside>

            <footer className="footer">
                <ThinFooter />
            </footer>
        </div>
    );
}