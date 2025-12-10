'use client';

import CollapsableLeftSidebar from "@/components/sidebars/collapsableLeftSidebar";
import CollapsableRightSidebar from "@/components/sidebars/collapsableRightSidebar";
import SecondarySidebar from "@/components/sidebars/secondarySidebar";

export default function AppShell({children, rightSidebar}){

    return (
        <div className="flex min-h-screen w-full">
            <CollapsableLeftSidebar/>
            <SecondarySidebar/>
            
            <main className="flex-1 p-8 overflow-auto">{children}</main>

            <CollapsableRightSidebar />
        </div>
    );
}