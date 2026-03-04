/**
 * Profile hydrator
 * 
 * Responsible for loading user's profile from supabase into global store, applying saved theme, preventing application rendering until the profile is loaded.
 */

'use client';

import { useEffect } from "react";
import useStore from "@/store/useStore";

export default function ProfileHydrator({children}) {

    // Global states
    const loadProfile = useStore((s) => s.loadProfile)
    const profileLoaded = useStore((s) => s.profileLoaded)
    const theme = useStore((s) => s.theme);

    // Load user profile when application first mounts
    useEffect(() => {
        loadProfile();
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