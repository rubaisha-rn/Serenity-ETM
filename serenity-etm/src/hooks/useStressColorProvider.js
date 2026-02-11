'use client';

import { useEffect, useRef } from "react";
import useStore from "@/store/useStore";
import { STRESS_PALETTE } from "@/theme/stressPalette";
import { hexToRgb, lerpColor } from "@/theme/colorUtils";

export default function UseStressColorProvider({children}) {
    
    const emotionValue = useStore((s) => s.emotionValue);
    const theme = useStore((s) => s.theme);
    const visualStress = useRef(0);

    useEffect(() => {
        if(emotionValue === null) return;

        let raf;
        const speed = 0.8;

        function animate() {
            visualStress.current += (emotionValue - visualStress.current) * speed;

            const s = visualStress.current;
            const palette = STRESS_PALETTE[theme];

            let from, to, t;

            if(s < 50) {
                from = palette.low;
                to = palette.mid;
                t = s / 50;
            }
            else {
                from = palette.mid;
                to = palette.high;
                t = (s - 50) / 50;
            }

            const root = document.documentElement;

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
            
            raf = requestAnimationFrame(animate);
        }

        animate();
        return () => cancelAnimationFrame(raf);
        
    }, [emotionValue, theme]);

    return children;
}