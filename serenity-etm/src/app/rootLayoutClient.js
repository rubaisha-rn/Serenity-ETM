'use client';

import { Geist, Geist_Mono } from "next/font/google";
import { useEffect } from "react";
import useStore from "../store/useStore";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export default function RootLayoutClient({ children }) {

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
        {children}
      </body>
    </html>
  );
}
