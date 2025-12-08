import {create} from 'zustand';

const useStore = create((set) => ({
    
    theme: 'light',
    setTheme: (theme) => set({theme}),

    emotionValue: 0, // 0-100
    setEmotionValue: (value) => 
        set({
            emotionValue: Math.min(100, Math.max(0, value)), // stress value will always be between 0-100
        }),

    focusMode: false,
    setFocusMode: (value) => set({ focusMode: value }),

    sdkActive: true,
    setSdkActive: (value) => set({ sdkActive: value }),

    // for global states 
}));

export default useStore;