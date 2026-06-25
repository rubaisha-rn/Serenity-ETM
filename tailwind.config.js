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
        },
    },
    plugins: [],
}

