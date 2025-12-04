/** @type {import('tailwindcss').Config} */
module.exports = {
    content: [
        "./src/app/**/*.{js,ts,jsx,tsx}",
        "./src/components/**/*.{js,ts,jsx,tsx}",
    ],
    darkMode: 'class',
    theme: {
        extend: {
            colors: {
                light: {
                    background: "#f4f1e8",
                    foreground: "#121212",
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

