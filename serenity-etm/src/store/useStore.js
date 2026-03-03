import {create} from 'zustand';
import { supabase } from '@/lib/supabaseClient';

const applyThemeModeClass = (mode) => {
    const root = document.documentElement;

    root.classList.remove('high-contrast', 'colour-vision-friendly');

    if (mode === 'high-contrast') {
        root.classList.add('high-contrast');
    }
    if (mode === 'colour-vision-friendly') {
        root.classList.add('colour-vision-friendly');
    }
}

const useStore = create((set, get) => ({

    // hydration
    profileLoaded: false,
    theme: 'dark', // light
    themeMode: 'normal',
    emotionValue: 0,
    calmModeDuration: 10000,
    sdkActive: false, // true
    stressDetectionDuration: 20000,
    stressSensitivity: 1.0,

    // load profile: hydration safe
    loadProfile: async () => {
        const {data: {session}} = await supabase.auth.getSession();
        
        if(!session) {
            const theme = 'light';
            const themeMode = 'normal';

            set({
                theme,
                themeMode,
                profileLoaded: true,
            })

            document.documentElement.classList.toggle('dark', theme === 'dark');
            applyThemeModeClass(themeMode);

            return;
        };

        const {data, error} = await supabase
            .from('profiles')
            .select('*')
            .eq('id', session.user.id)
            .single()
        
        if (error) {
            console.log('Profile fetch error:', error);
            return;
        }

        const theme = data.theme ?? 'light';
        const themeMode = data.theme_mode ?? 'normal';

        set({
            theme,
            themeMode,
            emotionValue: data.emotion_value ?? 0,
            calmModeDuration: data.calm_mode_duration ?? 10000,
            sdkActive: data.sdk_active ?? false,
            stressDetectionDuration: data.stress_detection_duration ?? 20000,
            stressSensitivity: data.stress_sensitivity ?? 1.0,
            profileLoaded: true
        })

        document.documentElement.classList.toggle('dark', theme === 'dark');
        applyThemeModeClass(themeMode);
    },

    // internal db update helper
    updateProfile: async (patch, rollback = null) => {
        const {data: {session}} = await supabase.auth.getSession()
        if(!session) return

        const {error} = await supabase
            .from('profiles')
            .update(patch)
            .eq('id', session.user.id)

        if (error) {
            console.log('Profile update failed:', error)
            if (rollback) rollback();
        }
    }, 
    
    setTheme: (theme) => {
        if (get().theme === theme) return;
        
        const prev = get().theme;
        set({theme});

        document.documentElement.classList.toggle('dark', theme === 'dark');

        get().updateProfile(
            {theme},
            () => set({theme: prev})
        )
    },

    setThemeMode: (themeMode) => {
        if (get().themeMode === themeMode) return;

        const prev = get().themeMode;

        set({themeMode});

        applyThemeModeClass(themeMode);

        get().updateProfile(
            {theme_mode: themeMode},
            () => {
                set({theme_mode: prev})
                applyThemeModeClass(prev);
            }
        )
    },

    setEmotionValue: (value) => {
        const bounded = Math.min(100, Math.max(0, value))
        set({emotionValue: bounded})

        get().updateProfile({emotion_value: bounded})
    },

    setCalmModeDuration: (value) => {
        set({calmModeDuration: value})
        get().updateProfile({calm_mode_duration: value})
    }, 

    setSdkActive: (value) => {
        set({sdkActive: value})
        get().updateProfile({sdk_active: value})
    }, 

    setStressDetectionDuration: (value) => {
        set({stressDetectionDuration: value})
        get().updateProfile({stress_detection_duration: value})
    },

    setStressSensitivity: (value) => {
        const mapped = 0.5 + (Math.min(10, Math.max(1, value)) - 1) * (1.0 / 9)
        set({stressSensitivity: mapped})
        get().updateProfile({stress_sensitivity: mapped})
    },

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
}));

export default useStore;