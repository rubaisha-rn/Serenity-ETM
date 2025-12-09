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
                        bg: '#f5f6f8',
                        card: '#ffffff',
                        blankCard: '#fafafa',
                        a: '#deb6ab',
                        b: '#f2e1a6',
                        c: '#c4d9eb',
                        icons: '#6b7280',
                        acc: '#342626',
                        accHover: '#4b3d3d',
                    },
                    mid: {
                        bg: '#e5e4e1',
                        card: '#eff2f5',
                        blankCard: '#f5f9ff',
                        a: '#b6d8e8',
                        b: '#bfe7d6',
                        c: '#c9c4eb',
                        icons: '#9faebd',
                        acc: '#131d2a',
                        accHover: '#293b53',
                    },
                    high: {
                        bg: '#f1f1f1',
                        card: '#f4f5f8',
                        blankCard: '#f9f7ff',
                        a: '#b8beeb',
                        b: '#cfe6df',
                        c: '#d3d7e0',
                        icons: '#abbac8',
                        acc: '#241538',
                        accHover: '#463858',
                    },
                    textA: '#1c1c1c',
                    textB: '#373737',
                    textC: '#7c7c7c',
                },
                dark: {
                    low: {
                        bg: '#f5f6f8',
                        card: '#ffffff',
                        blankCard: '#fafafa',
                        a: '#deb6ab',
                        b: '#f2e1a6',
                        c: '#c4d9eb',
                        icons: '#6b7280',
                        button: '#342626',
                        buttonHover: '#4b3d3d',
                    },
                    mid: {
                        a: '#b6d8e8',
                        b: '#bfe7d6',
                        c: '#c9c4eb',
                        bg: '#e5e4e1',
                        card: '#cfe3f6',
                        icon: '#dce9f5',
                        button: '#131d2a',
                        buttonHover: '#293b53',
                        blankCard: '#f5f9ff',
                    },
                    high: {
                        a: '#b8beeb',
                        b: '#cfe6df',
                        c: '#d3d7e0',
                        bg: '#f1f1f1',
                        card: '#dbceee',
                        icon: '#dce9f5',
                        button: '#241538',
                        buttonHover: '#463858',
                        blankCard: '#f9f7ff',
                    },
                    textA: '#1c1c1c',
                    textB: '#373737',
                    textC: '#7c7c7c',
                },
            },
        },
    },
    plugins: [],
}

