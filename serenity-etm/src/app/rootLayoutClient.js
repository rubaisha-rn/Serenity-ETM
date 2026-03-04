/**
 * Client-side root layout wrapper for the application.
 * 
 * Initialises stress detector, 
 * Loads external scripts, 
 * Hydrates user profile, 
 * Applies dynamic stress-based colour provider.
 */

'use client';

import useStressDetector from "@/hooks/useStressDetector";
import Script from "next/script";
import UseStressColorProvider from "@/hooks/useStressColorProvider";
import ProfileHydrator from "./providers/profileHydrator";

export default function RootLayoutClient({ children }) {

    // Initialise stress detection 
    useStressDetector();

    return (
        <>
            {/* Morphcast scripts run globally */}
            <Script src="https://sdk.morphcast.com/mphtools/v1.1/mphtools.js" data-config="cameraPrivacyPopup" strategy="afterInteractive" />
            <Script src="https://ai-sdk.morphcast.com/v1.16/ai-sdk.js" strategy="afterInteractive" />
            
            {/* Profile hydrator loads profile data from supabase into global store on initial app load */}
            <ProfileHydrator>

                {/* Stress colour provider for dynamic UI colour changes */}
                <UseStressColorProvider>

                    {/* Application content */}
                    {children}

                </UseStressColorProvider>
            </ProfileHydrator>
        </>
    );
}
