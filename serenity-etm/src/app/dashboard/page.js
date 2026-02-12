'use client';

import { useRouter } from "next/navigation";
import AppShell from "@/shells/appShell";

export default function EmailsPage () {

    const router = useRouter();

    return (
        <AppShell>
            <div className="flex flex-col p-10 bg-blue-500 gap-2">
                <div className="p-10 bg-yellow-200"/>
                <div className="p-10 bg-yellow-200"/>
                <div className="p-10 bg-yellow-200"/>
                <div className="p-10 bg-yellow-200"/>
                <div className="p-10 bg-yellow-200"/>
            </div>
        </AppShell>    
    );
}
