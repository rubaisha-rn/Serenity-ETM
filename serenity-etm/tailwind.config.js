/** @type {import('tailwindcss').Config} */
module.exports = {
    content: [
        "./src/app/**/*.{js,ts,jsx,tsx}",
        "./src/components/**/*.{js,ts,jsx,tsx}",
    ],
    darkMode: 'class',
    theme: {
        extend: {
            fontFamily: {
                AbrilFatface: ['Abril-Fatface', 'sans-serif'], //fall-back
                Roboto: ['Roboto', 'sans-serif'], //fall-back
            },
            colors: {
                light: {
                    low: {
                        bg: '#f4f1e8',
                        card: '#f4f1e8',
                        icon: '#dce9f5',
                        textA: '#25030393',
                        textB: '#353535',
                        textC: '#121212',
                        button: '#25030393',
                        buttonHover: '#632525a7',
                    },
                    mid: {
                        bg: '#e5e4e1ff',
                        card: '#cfe3f6ff',
                        icon: '#dce9f5',
                        textA: '#0311257d',
                        textB: '#353535',
                        textC: '#121212',
                        button: '#0311257d',
                        buttonHover: 'rgba(28, 57, 99, 0.7)',
                    },
                    high: {
                        bg: '#f1f1f1',
                        card: '#dbceee',
                        icon: '#dce9f5',
                        textA: '#13052487',
                        textB: '#353535',
                        textC: '#121212',
                        button: '#13052487',
                        buttonHover: '#381c58a3',
                    },
                    background: "#f4f1e8",
                    foreground: "#e5b3a4",
                },
                dark: {
                    background: "#121212",
                    foreground: "#f4f1e8",
                },
            },
        },
    },
    plugins: [],
}

