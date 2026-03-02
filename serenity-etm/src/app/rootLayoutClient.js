'use client';

import { Geist, Geist_Mono } from "next/font/google";
import useStressDetector from "@/hooks/useStressDetector";
import Script from "next/script";
import UseStressColorProvider from "@/hooks/useStressColorProvider";
import ProfileHydrator from "./providers/profileHydrator";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export default function RootLayoutClient({ children }) {
    
    useStressDetector();

    return (
        <>
            {/* Morphcast scripts run globally */}
            <Script src="https://sdk.morphcast.com/mphtools/v1.1/mphtools.js" data-config="cameraPrivacyPopup" strategy="afterInteractive" />
            <Script src="https://ai-sdk.morphcast.com/v1.16/ai-sdk.js" strategy="afterInteractive" />
            
            <ProfileHydrator>
                <div className={`${geistSans.variable} ${geistMono.variable} antialiased`}>
                    <UseStressColorProvider>
                        {children}
                    </UseStressColorProvider>
                </div>
            </ProfileHydrator>
        </>
    );
}
