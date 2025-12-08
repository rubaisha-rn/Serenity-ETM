'use client';

import { Geist, Geist_Mono } from "next/font/google";
import { useEffect } from "react";
import useStore from "@/store/useStore";
import useStressDetector from "@/hooks/useStressDetector";
import Script from "next/script";

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
    const { theme } = useStore();

    useEffect(() => {
        if(theme === 'dark') {
            document.documentElement.classList.add('dark');
        }
        else{
            document.documentElement.classList.remove('dark');
        }
    }, [theme]);

  return (
    <html lang="en">
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        {/* Morphcast scripts run globally */}
        <Script src="https://sdk.morphcast.com/mphtools/v1.1/mphtools.js" data-config="cameraPrivacyPopup" strategy="afterInteractive" />
        <Script src="https://ai-sdk.morphcast.com/v1.16/ai-sdk.js" strategy="afterInteractive" />
        {children}
      </body>
    </html>
  );
}
