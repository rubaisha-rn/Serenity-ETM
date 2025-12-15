export function hexToRgb(hex) {

    if(typeof hex != 'string') {
        throw new Error('hex must be a string');
    }

    let v = hex.trim().replace('#', '');

    if(v.length === 3) {
        v = v.split('').map(c => c + c).join('') + 'ff';
    } else if (v.length === 6) {
        v += 'ff';
    } else if (v.length === 8) {
    } else {
        throw new Error('Invalid hex color');
    }

    return [
        parseInt(v.slice(0,2), 16),
        parseInt(v.slice(2,4), 16),
        parseInt(v.slice(4,6), 16),
        parseInt(v.slice(6,8), 16), // alpha
    ];
}

function lerp(a, b, t) {
    return a + (b - a) * t;
}

export function lerpColor(c1, c2, t) {
    const rgba = c1.map((v, i) =>
        i < 3 ? Math.round(lerp(v, c2[i], t)) : lerp(v, c2[i], t)
    );

    return `rgba(${rgba[0]},${rgba[1]},${rgba[2]},${rgba[3].toFixed(2)})`;
}