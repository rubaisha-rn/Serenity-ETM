import { useMemo } from "react";

const Palettes = {
    low: ['#ffd6c9', '#fff1c1', '#dce9f5'],
    mid: ['#cfe7f2', '#dff3ea', '#e6e2f5'],
    high: ['#daddf7', '#e8f3ef', '#eef0f4'],
};

function lerp(a, b, t) {
    return a+(b-a)*t;
}

function mixHex(c1, c2, t){
    const a = parseInt(c1.slice(1), 16);
    const b = parseInt(c2.slice(1), 16);

    const r = lerp(( a >> 16) & 255, (b >> 16) & 255, t);
    const g = lerp(( a >> 8) & 255, (b >> 8) & 255, t);
    const b2 = lerp( a & 255, b & 255, t);

    return `rgb(${r|0}, ${g|0}, ${b2|0})`;
}

export function useStressColors(stress01 = 0) {
    return useMemo(() => {
        const s = Math.min(1, Math.max(0, stress01));

        let t, from, to;

        if (s < 0.33) {
            t = s/0.33;
            from = Palettes.low;
            to = Palettes.mid;
        } 
        else if (s < 0.66) {
            t = (s-0.33) / 0.33;
            from = Palettes.mid;
            to = Palettes.high;
        }
        else {
            t = (s-0.66) / 0.34;
            from = Palettes.high;
            to = Palettes.high;
        }

        return from.map((c, i) => mixHex(c, to[i], t));
    }, [stress01]);
}