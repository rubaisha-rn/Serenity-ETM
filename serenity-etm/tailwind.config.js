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
                    background: "#f4f1e8",
                    foreground: "#e5b3a4",
                    mainText: '#25030393',
                    subText: '#353535',
                    button: '#25030393',
                    buttonHover: '#632525a7',
                },
                dark: {
                    background: "#121212",
                    foreground: "#F4F1E8",
                },
            },
        },
    },
    plugins: [],
}

