'use client';

import { useRouter } from "next/navigation";
import AppShell from "@/shells/appShell";
import useStore from "@/store/useStore";

export default function EmailsPage () {

    const theme = useStore((s) => s.theme);
    const router = useRouter();

    return (
        <AppShell>
            <div className="flex flex-col min-h-0 h-full overflow-hidden min-w-0 z-0">
                <div className="bg-black p-10"/>
                <div className="bg-black p-10"/>
                <div className="bg-black p-10"/>
                <div className="bg-black p-10"/>
                <div className="bg-black p-10"/>
                <div className="bg-black p-10"/>
                <div className="bg-black p-10"/>
            </div>
        </AppShell>    
    );
}
