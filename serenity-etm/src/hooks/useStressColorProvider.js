/**
 * Dynamically updates CSS variables based on user's stress level and selected theme mode.
 * Modifies global theme.
 */
'use client';

import { useEffect, useRef } from "react";
import useStore from "@/store/useStore";
import { STRESS_PALETTE } from "@/theme/stressPalette";
import { hexToRgb, lerpColor } from "@/theme/colorUtils";

export default function UseStressColorProvider({children}) {
    
    // State variables
    const {emotionValue} = useStore();
    const theme = useStore((s) => s.theme);
    const themeMode = useStore((s) => s.themeMode);

    // Interpolated stress value for smoothing transitions between colours when stress changes to quickly.
    const visualStress = useRef(0);

    useEffect(() => {

        // If stress is null, no change to theme variables
        if(emotionValue === null) return;

        /**
         * Accessibility mode colour handling
         * 
         * When accessibility theme modes are enabled, dynamic colour changes are bypassed. 
         * Fixed colour palettes are applied.
         */
        if (themeMode !== 'normal') {

            // Select colour palette
            const palette = themeMode === 'high-contrast' ? STRESS_PALETTE.highContrast[theme] : STRESS_PALETTE.colourVisionFriendly[theme];

            const root = document.documentElement;

            // Apply palette colours to CSS variables
            root.style.setProperty('--bg', palette.bg);
            root.style.setProperty('--a-main', palette.a);
            root.style.setProperty('--b-main', palette.b);
            root.style.setProperty('--c-main', palette.c);
            root.style.setProperty('--d-main', palette.d);
            root.style.setProperty('--e-main', palette.e);
            root.style.setProperty('--f-main', palette.f);
            root.style.setProperty('--g-main', palette.g);

            return;
        }

        /**
         * Stress colour interpolation
         * 
         * In normal theme mode, colours transitions smoothly based on stress value.
         */

        let raf;

        // Speed of colour transition 
        const speed = 0.8;

        /**
         * Animation loop resposible for interpolating colours
         * 
         * Ensures updates are in sync with browser's render settings.
         */
        function animate() {

            // Smooth move of visual stress toward actual stress value
            visualStress.current += (emotionValue - visualStress.current) * speed;

            // Current interpolated stress value and palette
            const s = visualStress.current;
            const palette = STRESS_PALETTE[theme];
            
            let from, to, t;
            
            // Determine which palette range to interpolate
            if(s < 50) {

                // 0-50 stress value, palette low -> mid
                from = palette.low;
                to = palette.mid;

                // Normalised interpolation
                t = s / 50;
            }
            else {

                // 50-100 stress value, palette mid -> high
                from = palette.mid;
                to = palette.high;

                // Normalise upper half of the stress range
                t = (s - 50) / 50;
            }

            // Root element where CSS variables are applied
            const root = document.documentElement;

            // Interpolate background colours, and 7 other primary UI colours
            root.style.setProperty(
                '--bg',
                lerpColor(hexToRgb(from.bg), hexToRgb(to.bg), t)
            );
            root.style.setProperty(
                '--a-main',
                lerpColor(hexToRgb(from.a), hexToRgb(to.a), t)
            );
            root.style.setProperty(
                '--b-main',
                lerpColor(hexToRgb(from.b), hexToRgb(to.b), t)
            );
            root.style.setProperty(
                '--c-main',
                lerpColor(hexToRgb(from.c), hexToRgb(to.c), t)
            );
            root.style.setProperty(
                '--d-main',
                lerpColor(hexToRgb(from.d), hexToRgb(to.d), t)
            );
            root.style.setProperty(
                '--e-main',
                lerpColor(hexToRgb(from.e), hexToRgb(to.e), t)
            );
            root.style.setProperty(
                '--f-main',
                lerpColor(hexToRgb(from.f), hexToRgb(to.f), t)
            );
            root.style.setProperty(
                '--g-main',
                lerpColor(hexToRgb(from.g), hexToRgb(to.g), t)
            );
            
            // Schedule next animation frame
            raf = requestAnimationFrame(animate);
        }

        // Start animation
        animate();

        // Cleanup
        return () => cancelAnimationFrame(raf);
        
    }, [emotionValue, theme]);

    return children;
}