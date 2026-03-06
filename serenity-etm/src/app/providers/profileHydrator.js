/**
 * Profile hydrator
 * 
 * Responsible for loading user's profile from supabase into global store, applying saved settings, preventing application rendering until the profile is loaded.
 */

'use client';

import { useEffect } from "react";
import { supabase } from "@/lib/supabaseClient";
import useStore from "@/store/useStore";

export default function ProfileHydrator({children}) {

    // Global states
    const loadProfile = useStore((s) => s.loadProfile);
    const resetStore = useStore((s) => s.resetStore);
    const profileLoaded = useStore((s) => s.profileLoaded);
    const theme = useStore((s) => s.theme);

    // Load user profile when ever there are authentication changes
    useEffect(() => {

        // Load initial session
        supabase.auth.getSession().then(({data: {session}}) => {
            loadProfile();
        });

        // Listen for auth changes. If in session, load user settings, else load default settings
        const {data: {subscription}} = 
            supabase.auth.onAuthStateChange((event, session) => {

                if (session) {
                    loadProfile();
                }
                else {
                    resetStore();
                }
            });

        return () => subscription.unsubscribe();
        
    }, []);

    // Apply theme to the document root
    useEffect(() => {
        document.documentElement.classList.toggle('dark', theme === 'dark');
    }, [theme]);

    // Prevent rendering application until profile has been loaded from db
    if (!profileLoaded) return null;

    // Render application once profile has been loaded
    return children;
}