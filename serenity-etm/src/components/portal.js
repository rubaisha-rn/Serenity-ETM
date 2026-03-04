/**
 * React DOM utility to render elements outside the normal React component such as being used in profile settings.
 */

'use client';

import { useEffect, useState } from "react";
import { createPortal } from "react-dom";

export default function Portal({children}) {

    // Ensures portal only renders after the component is mounted in the browser
    const [mounted, setMounted] = useState(false);

    // Runs once after the component mounts
    useEffect(() => {
        setMounted(true);
    }, []);

    // If not mounted, return null to avoid nothing being rendered
    if (!mounted) return null;

    // Render children into document.body using a portal
    return createPortal(children, document.body);
}