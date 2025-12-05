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
                        bg: '#f7efd6ff',
                        card: '#ffd6c9',
                        icon: '#dce9f5',
                        textA: '#25030393',
                        textB: '#353535',
                        textC: '#121212',
                        button: '#25030393',
                        buttonHover: '#632525a7',
                    },
                    mid: {
                        bg: '#f7efd6ff',
                        card: '#ffd6c9',
                        text: '#121212',
                        icon: '#dce9f5',
                        button: '#ffd6c9',
                        buttonHover: '#ffb3a0',
                    },
                    high: {
                        bg: '#f7efd6ff',
                        card: '#ffd6c9',
                        text: '#121212',
                        icon: '#dce9f5',
                        button: '#ffd6c9',
                        buttonHover: '#ffb3a0',
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

