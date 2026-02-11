import {create} from 'zustand';

const useStore = create((set) => ({
    
    theme: 'light',
    setTheme: (theme) => set({theme}), // add a button to change theme

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

    screen: 'dashboard',
    setScreen: (screen) => set({screen}),

    expandedRight: false, 
    setExpandedRight: (expandedRight) => set({expandedRight}),

    expandedSecondary: true, 
    setExpandedSecondary: (expandedSecondary) => set({expandedSecondary}), 

    showTasks: 'all',
    setShowTasks: (showTasks) => set({showTasks}),

    sdkActive: false, // true
    setSdkActive: (value) => set({ sdkActive: value }),

    fontScale: 12,
    setFontScale: (value) => set({ fontScale: value }),

    highContrast: false,
    setHighContrast: (value) => set({ highContrast: value }),

    colorBlindMode: 'none', // deuteranopia / protanopia / none
    setColorBlindMode: (value) => set({ colorBlindMode: value }),
}));

export default useStore;