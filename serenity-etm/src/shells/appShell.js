'use client';

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import useStore from "@/store/useStore";
import CollapsableLeftSidebar from "@/components/sidebars/collapsableLeftSidebar";
import CollapsableRightSidebar from "@/components/sidebars/collapsableRightSidebar";
import SecondarySidebar from "@/components/sidebars/secondarySidebar";

export default function AppShell({children, rightSidebar}){
    
    const {expandedSecondary, setExpandedSecondary, setScreen, screen} = useStore();
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
        <div className="flex min-h-screen w-full">
            <CollapsableLeftSidebar/>
            <SecondarySidebar/>
            
            <main className="flex-1 overflow-auto p-8 py-1">{children}</main>

            <CollapsableRightSidebar />
        </div>
    );
}