'use client';

import CollapsableLeftSidebar from "@/components/collapsableLeftSidebar";
import CollapsableRightSidebar from "@/components/collapsableRightSidebar";

export default function AppShell({children, rightSidebar}){
    return (
        <div className="flex min-h-screen w-full">
            <CollapsableLeftSidebar/>

            <main className="flex-1 p-8 overflow-auto">{children}</main>

            <CollapsableRightSidebar />
        </div>
    );
}