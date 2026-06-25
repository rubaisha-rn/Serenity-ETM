/**
 * Functions that convert a hex colour string into rgba array 
 * For smooth transition between colour themes depending on user stress levels.
 */

/** 
 * Function normalises the input into an 8 character rgba representation. 
 */
export function hexToRgb(hex) {

    // Ensure string is a hex value
    if(typeof hex != 'string') {
        throw new Error('HEX must be a string');
    }

    // Remove whitespaces and leading '#'
    let v = hex.trim().replace('#', '');

    // If hex value is three-character/digit expand it to 6 and add alpha channel
    if(v.length === 3) {
        v = v.split('').map(c => c + c).join('') + 'ff';
    } 

    // If 6-char/digit, add alpha channel
    else if (v.length === 6) {
        v += 'ff';
    } 
    
    // No change to 8-char/digit
    else if (v.length === 8) {} 
    
    // Any other length is invalid. Throw error
    else {
        throw new Error('Invalid hex color');
    }

    // Convert each pair of hex characters into integers
    return [
        parseInt(v.slice(0, 2), 16), // Red
        parseInt(v.slice(2, 4), 16), // Green
        parseInt(v.slice(4, 6), 16), // Blue
        parseInt(v.slice(6, 8), 16), // Alpha
    ];
}

/** 
 * Linear interpolation function to smooth transition between two values. 
 * Used for smooth transition between colours. 
 */
function lerp(a, b, t) {

    // a -> start value, b -> end value, t -> interpolation factor 
    return a + (b - a) * t;
}

/** 
 * Interpolate between two rgba colours. 
 * Function blends two colours using interpolation factor and returns rbga string. 
 */ 
export function lerpColor(c1, c2, t) {

    // Interpolate each channel
    const rgba = c1.map((v, i) =>
         
        i < 3 
            // RGBA channels should be integers
            ? Math.round(lerp(v, c2[i], t)) 

            // Alpha channel remains a float
            : lerp(v, c2[i], t)
    );

    // Return a CSS compatible rgba string
    return `rgba(${rgba[0]},${rgba[1]},${rgba[2]},${rgba[3].toFixed(2)})`;
}