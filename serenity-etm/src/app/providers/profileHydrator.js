'use client';

import { useEffect } from "react";
import useStore from "@/store/useStore";

export default function ProfileHydrator({children}) {
    const loadProfile = useStore((s) => s.loadProfile)
    const profileLoaded = useStore((s) => s.profileLoaded)
    const theme = useStore((s) => s.theme);

    useEffect(() => {
        loadProfile();
    }, []);

    useEffect(() => {
        document.documentElement.classList.toggle('dark', theme === 'dark');
    }, [theme]);

    if (!profileLoaded) return null;

    return children;
}