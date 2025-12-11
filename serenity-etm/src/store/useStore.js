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

    priorityMode: false,
    setPriorityMode: (value) => set({ priorityMode: value }),

    breatheMode: false,
    setBreatheMode: (value) => set({ breatheMode: value }),

    screen: 'tasks',
    setScreen: (screen) => set({screen}),

    expandedMain: false,
    setExpandedMain: (expandedMain) => set({expandedMain}), 

    expandedSecondary: false, // true
    setExpandedSecondary: (expandedSecondary) => set({expandedSecondary}), 

    showTasks: 'all',
    setShowTasks: (showTasks) => set({showTasks}),

    sdkActive: false, // true
    setSdkActive: (value) => set({ sdkActive: value }),
}));

export default useStore;