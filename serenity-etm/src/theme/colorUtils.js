export function hexToRgb(hex) {
    const v = hex.replace('#', '');

    return [
        parseInt(v.slice(0,2), 16),
        parseInt(v.slice(2,4), 16),
        parseInt(v.slice(4,6), 16),
    ];
}

function lerp(a, b, t) {
    return a + (b - a) * t;
}

export function lerpColor(c1, c2, t) {
    return `rgb(${c1.map((v, i) =>
        Math.round(lerp(v, c2[i], t))
    ).join(',')})`;
}