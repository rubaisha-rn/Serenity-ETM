import {create} from 'zustand';

const useStore = create((set) => ({
    
    theme: 'light',
    setTheme: (theme) => set({theme}),

    themeMode: 'normal',
    setThemeMode: (themeMode) => set({themeMode}),

    emotionValue: 0, // 0-100
    setEmotionValue: (value) => 
        set({
            emotionValue: Math.min(100, Math.max(0, value)), // stress value will always be between 0-100
        }),

    focusMode: false,
    setFocusMode: (value) => set({ focusMode: value }),

    priorityMode: false,
    setPriorityMode: (value) => set({ priorityMode: value }),

    calmMode: false,
    setCalmMode: (value) => set({ calmMode: value }),

    calmModeDuration: 10000,
    setCalmModeDuration: (value) => set({ calmModeDuration: value }),

    screen: 'dashboard',
    setScreen: (screen) => set({screen}),

    expandedRight: false, 
    setExpandedRight: (expandedRight) => set({expandedRight}),

    expandedSecondary: true, 
    setExpandedSecondary: (expandedSecondary) => set({expandedSecondary}), 

    sdkActive: false, // true
    setSdkActive: (value) => set({ sdkActive: value }),

    stressDetectionDuration: 20000,
    setStressDetectionDuration: (value) => set({ stressDetectionDuration: value }),

    stressSensitivity: 1.0, // 0.5 -> 1.5
    setStressSensitivity: (value) => 
        set({
            stressSensitivity: 0.5 + (Math.min(10, Math.max(1, value)) - 1) * (1.0 / 9),
        }),
}));

export default useStore;