'use client';

import { useEffect } from "react";
import useStore from "@/store/useStore";

export default function ProfileHydrator({children}) {
    const loadProfile = useStore((s) => s.loadProfile)
    const profileLoaded = useStore((s) => s.profileLoaded)

    useEffect(() => {
        loadProfile();
    }, [loadProfile]);

    if (!profileLoaded) return null;

    return children;
}