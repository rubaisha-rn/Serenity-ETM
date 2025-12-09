'use client';

import Header from "@/components/header";
import Image from "next/image";
import AppShell from "@/shells/appShell";
import Footer from "@/components/footer";
import PrototypeTag from '@/components/prototypeTag';

export default function TasksPage() {
    return (
        <div className="bg-light-mid-bg">
            {/* <PrototypeTag/> */}
            <Header
                title="Serenity ETM"
                logo={<Image
                    src="/logo/logo.png"
                    alt='Serenity ETM Logo'
                    width={18}
                    height={18}
                    priority
                />}
                sticky
            />

            <AppShell>
                <h1>Content.</h1>
            </AppShell>

            <Footer/>

        </div>
    );
}