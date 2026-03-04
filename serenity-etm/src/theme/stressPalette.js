/** 
 * Colour palettes for three theme modes: normal, high-contrast, and colour-vision friendly. 
 * Normal theme mode's light and dark themes have colour changing palettes depending on user stress level.
 * High-contrast and colour-vision friendly mode's light and dark themes do not have the colour changing feature as it defeats the purpose of the mode.
 */

export const STRESS_PALETTE = {

    // Normal mode - Light theme 
    light: {

        // Low stress
        low: {  
            a: '#2a2c29',
            b: '#444741',
            c: '#5f635c',
            d: '#b7bab4',
            e: '#d3d5cf',
            f: '#e5e8e3',
            g: '#8e918b',
            bg: '#f5f5f5',
        },

        // Medium stress
        mid: {
            a: '#2f4443',
            b: '#446261',
            c: '#5b807e',
            d: '#a9d4d2',
            e: '#c7e6e4',
            f: '#eaf5f4',
            g: '#7fb8b6',
            bg: '#ebedec',
        },

        // High stress
        high: {
            a: '#1c2b3a',
            b: '#25394d',
            c: '#35506a',
            d: '#6f8fa8',
            e: '#9fb7c8',
            f: '#e7eff5',
            g: '#2e4a66',
            bg: '#eef0f2',
        },
    },

    // Normal mode - Dark theme
    dark: {

        // Low stress
        low: {  
            a: '#c5c6c3',
            b: '#b4b6ae',
            c: '#82867e',
            d: '#494b46',
            e: '#373934',
            f: '#252624',
            g: '#4c5041',
            bg: '#212121',
        },

        // Medium stress
        mid: {
            a: '#c3c6c4',
            b: '#aeb6b3',
            c: '#7e8681',
            d: '#464b49',
            e: '#343937',
            f: '#242625',
            g: '#415049',
            bg: '#1e201e',
        },

        // High stress
        high: {
            a: '#c3c4c6',
            b: '#aeb0b6',
            c: '#7e8186',
            d: '#46484b',
            e: '#343639',
            f: '#242526',
            g: '#414650',
            bg: '#1e1e20',
        },
    },

    // High contrast mode
    highContrast: {

        // Light theme
        light: {
            a: '#000000',
            b: '#000000',
            c: '#222222',
            d: '#ffffff',
            e: '#f5f5f5',
            f: '#ffffff',
            g: '#000000',
            bg: '#ffffff',
        }, 

        // Dark theme
        dark: {
            a: '#ffffff',
            b: '#ffffff',
            c: '#dddddd',
            d: '#000000',
            e: '#111111',
            f: '#000000',
            g: '#ffffff',
            bg: '#000000',
        },
    },

    // Colour-vision friendly mode
    colourVisionFriendly: {

        // Light theme
        light: {
            a: '#172937',
            b: '#374151',
            c: '#4b5563',
            d: '#d1d5db',
            e: '#e5e7eb',
            f: '#f3f4f6',
            g: '#6b7280',
            bg: '#f7f7f7',
        }, 

        // Dark theme
        dark: {
            a: '#f3f4f6',
            b: '#e5e7eb',
            c: '#d1d5db',
            d: '#374151',
            e: '#1f2937',
            f: '#111827',
            g: '#9ca3af',
            bg: '#111827',
        },
    }
};