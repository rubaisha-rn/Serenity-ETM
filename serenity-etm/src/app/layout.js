/**
 * Server-side layout for application.
 */

import "./globals.css";
import RootLayoutClient from "./rootLayoutClient";

// Application metadata
export const metadata = {
    title: 'Serenity ETM',
    description: 'Emotion-aware email & task manager',
};

export default function RootLayout({ children }) {
    return (
        <html lang="en">
            <body>

                {/* Client-side providers and global behaviour */}
                <RootLayoutClient>
                    {children}
                </RootLayoutClient>
                
            </body>
        </html>
    );
}
