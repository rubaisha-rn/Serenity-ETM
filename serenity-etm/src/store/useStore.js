import create from 'zustand';

const useStore = create((set) => ({
    theme: 'light',
    setTheme: (theme) => set({theme}),

    emotionValue: 0,
    setEmotionValue: (value) => set({emotionValue: value}),

    // for global states 
}))