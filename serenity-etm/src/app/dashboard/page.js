'use client';

import { useRouter } from "next/navigation";
import AppShell from "@/shells/appShell";

export default function EmailsPage () {

    const router = useRouter();

    return (
        <AppShell>
            <div className="flex flex-col min-h-0 h-full overflow-hidden min-w-0 z-0">
                <div className="bg-blue-100 p-10"/>
                <div className="bg-blue-100 p-10"/>
                <div className="bg-blue-100 p-10"/>
                <div className="bg-blue-100 p-10"/>
                <div className="bg-blue-100 p-10"/>
                <div className="bg-blue-100 p-10"/>
                <div className="bg-blue-100 p-10"/>
            </div>
        </AppShell>    
    );
}
