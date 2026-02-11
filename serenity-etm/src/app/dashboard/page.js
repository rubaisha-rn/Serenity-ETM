'use client';

import { useRouter } from "next/navigation";
import AppShell from "@/shells/appShell";

export default function EmailsPage () {

    const router = useRouter();

    return (
        <div className="relative h-screen">
            <AppShell>
            </AppShell>
        </div>
    );
}
