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
                '--bg-main',
                lerpColor(hexToRgb(from.bg), hexToRgb(to.bg), t)
            );
            root.style.setProperty(
                '--cardA-main',
                lerpColor(hexToRgb(from.cardA), hexToRgb(to.cardA), t)
            );
            root.style.setProperty(
                '--cardB-main',
                lerpColor(hexToRgb(from.cardB), hexToRgb(to.cardB), t)
            );
            root.style.setProperty(
                '--blankCard-main',
                lerpColor(hexToRgb(from.blankCard), hexToRgb(to.blankCard), t)
            );
            root.style.setProperty(
                '--a-main',
                lerpColor(hexToRgb(from.a), hexToRgb(to.a), t)
            );
            root.style.setProperty(
                '--aHover-main',
                lerpColor(hexToRgb(from.aHover), hexToRgb(to.aHover), t)
            );
            root.style.setProperty(
                '--icons-main',
                lerpColor(hexToRgb(from.icons), hexToRgb(to.icons), t)
            );
            root.style.setProperty(
                '--iconsHover-main',
                lerpColor(hexToRgb(from.iconsHover), hexToRgb(to.iconsHover), t)
            );
            root.style.setProperty(
                '--acc-main',
                lerpColor(hexToRgb(from.acc), hexToRgb(to.acc), t)
            );
            root.style.setProperty(
                '--accHover-main',
                lerpColor(hexToRgb(from.accHover), hexToRgb(to.accHover), t)
            );
            
            raf = requestAnimationFrame(animate);
        }

        animate();
        return () => cancelAnimationFrame(raf);
        
    }, [emotionValue, theme]);

    return children;
}