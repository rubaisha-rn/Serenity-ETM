import "./globals.css";
import RootLayoutClient from "./rootLayoutClient";

export const metadata = {
    title: 'Serenity ETM',
    description: 'Emotion-aware email & task manager',
};

export default function RootLayout({ children }) {
    return (
        <html lang="en">
            <body>
                <RootLayoutClient>
                    {children}
                </RootLayoutClient>
            </body>
        </html>
    );
}
