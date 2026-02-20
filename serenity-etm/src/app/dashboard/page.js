'use client';

import { useRouter } from "next/navigation";
import AppShell from "@/shells/appShell";

export default function EmailsPage () {

    const router = useRouter();

    return (
        <AppShell>
            <div className="main-content">
                <div className="bg-blue-900 p-10"/>
                <div className="bg-blue-900 p-10"/>
                <div className="bg-blue-900 p-10"/>
                <div className="bg-blue-900 p-10"/>
                <div className="bg-blue-900 p-10"/>
                <div className="bg-blue-900 p-10"/>
                <div className="bg-blue-900 p-10"/>
            </div>
        </AppShell>    
    );
}
