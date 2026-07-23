/** 
 * Global Zustand store file for managing application states.
 * 
 * Manages:
    * UI state - (theme, layout, screens)
    * User profile settings (stored in supabase)
    * Feature flags (focus mode, priority mode, calm overlay)
    * Behavioural tracking (focus triggers)
 * 
 * Store also syncs certain state changes to database.
 */

import {create} from 'zustand';
import { supabase } from '@/lib/supabaseClient';

/** 
 * Applies theme accessibility classes to the root HTML element. 
 */
const applyThemeModeClass = (mode) => {
    const root = document.documentElement;

    // Remove all special theme classes first
    root.classList.remove('high-contrast', 'colour-vision-friendly');

    // Add selected theme class
    if (mode === 'high-contrast') {
        root.classList.add('high-contrast');
    }
    if (mode === 'colour-vision-friendly') {
        root.classList.add('colour-vision-friendly');
    }
}

/** 
 * Main Zustand store definition.
 * Contains accessors and mutators.
 */
const useStore = create((set, get) => ({

    /**
     * Initial default states
     */
    profileLoaded: false, // Indicates if profile hydration from db finished
    theme: 'light', // Or 'dark'
    themeMode: 'normal', // Accessibility variant
    emotionValue: 0, // Emotion tracking (0-100)
    calmModeDuration: 10000, // Calm overlay duration (ms)
    sdkActive: false, // Whether automatic stress detection is on (using SDK)
    stressDetectionDuration: 20000, // Stress detection interval duration (ms)
    stressSensitivity: 1.0, // Stress level/emotionValue sensitivity factor

    /**
     * Load profile
     */
    loadProfile: async () => {

        const {data: {session}} = await supabase.auth.getSession();

        // If there is no logged-in user, fallback on defaults
        if(!session) {
            
            const theme = 'light';
            const themeMode = 'normal';

            set({
                theme,
                themeMode,
                profileLoaded: true, // For applying default theme
            })

            // Apply theme classes to document
            document.documentElement.classList.toggle('dark', theme === 'dark');
            applyThemeModeClass(themeMode);

            return;
        };

        // Fetch profile from database
        const {data, error} = await supabase
            .from('profiles')
            .select('*')
            .eq('id', session.user.id)
            .single()
        
        // Log error if any
        if (error) {
            console.log('Profile fetch error:', error);
            return;
        }

        // Fallback defaults if fields are missing
        const theme = data.theme ?? 'light';
        const themeMode = data.theme_mode ?? 'normal';

        // Hydrate store with database values
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

        // Apply UI classes
        document.documentElement.classList.toggle('dark', theme === 'dark');
        applyThemeModeClass(themeMode);
    },

    /**
     * Internal DB update helper
     */
    updateProfile: async (patch, rollback = null) => {

        const {data: {session}} = await supabase.auth.getSession()
        if(!session) return

        // Update data 
        const {error} = await supabase
            .from('profiles')
            .update(patch)
            .eq('id', session.user.id)

        // Log error and revert to previous state if update fails
        if (error) {
            console.log('Profile update failed:', error)
            if (rollback) rollback();
        }
    }, 
    
    /**
     * Profile settings mutators
     */

    // Update light or dark theme
    setTheme: (theme) => {
        
        if (get().theme === theme) return;
        
        const prev = get().theme;
        set({theme});

        // Apply dark class to document root
        document.documentElement.classList.toggle('dark', theme === 'dark');

        // Persist to db
        get().updateProfile(
            {theme},
            () => set({theme: prev})
        )
    },

    // Update theme accessibility
    setThemeMode: (themeMode) => {

        if (get().themeMode === themeMode) return;

        const prev = get().themeMode;

        set({themeMode});
        applyThemeModeClass(themeMode);

        // Persist to db and apply to document root
        get().updateProfile(
            {theme_mode: themeMode},
            () => {
                set({theme_mode: prev})
                applyThemeModeClass(prev);
            }
        )
    },

    // Set emotion value between 0-100
    setEmotionValue: (value) => {
        
        // Bound value
        const bounded = Math.min(100, Math.max(0, value))
        
        set({emotionValue: bounded})

        // Only persist when when user updates it/SDK is inactive
        if (!get().sdkActive) {
            get().updateProfile({emotion_value: bounded})
        }
    },

    // Update calm mode duration
    setCalmModeDuration: (value) => {

        set({calmModeDuration: value})
        get().updateProfile({calm_mode_duration: value})
    }, 

    // Update automatic stress detection enablement 
    setSdkActive: (value) => {

        set({sdkActive: value})
        get().updateProfile({sdk_active: value})
    }, 

    // Set stress detection duration
    setStressDetectionDuration: (value) => {

        set({stressDetectionDuration: value})
        get().updateProfile({stress_detection_duration: value})
    },

    // Map sensitivity (0-10) to internal range of 0.5 - 1.5
    setStressSensitivity: (value) => {

        // Map value
        const mapped = 0.5 + (Math.min(10, Math.max(1, value)) - 1) * (1.0 / 9)

        set({stressSensitivity: mapped})
        get().updateProfile({stress_sensitivity: mapped})
    },

    /**
     * Focus trigger analytics
     */

    // Array of timestamps when focus mode is activated
    focusTriggers: [],

    // Load focus triggers from the past 7 days
    loadFocusTriggers: async () => {

        const {data: {session}} = await supabase.auth.getSession();
        if (!session) return;

        // Converting date 7 days ago to ISO standard
        const weekAgoISO = new Date(
            Date.now() - 7 * 24 * 60 * 60 * 1000
        ).toISOString();

        // Loading triggers data from maximum 7 days ago, only for current user
        const {data, error} = await supabase
            .from('focus_triggers')
            .select('created_at')
            .gte('created_at', weekAgoISO)
            .eq('user_id', session.user.id)
            .order('created_at', {ascending: false})

        // Log any error
        if (error) {
            console.log('Focus triggers loading error:', error);
            return;
        }

        set({
            focusTriggers: data.map(row => row.created_at)
        })
    },

    // Record new focus trigger
    addFocusTrigger: async () => {

        const {data: {session}} = await supabase.auth.getSession();
        if(!session) return;

        // Current timestamp
        const timestamp = new Date().toISOString();

        // Insert new record
        const {error} = await supabase
            .from('focus_triggers')
            .insert({
                user_id: session.user.id
            });

        // Log error
        if (error) {
            console.log('Focus insert error:', error);
            return;
        }

        // Update state
        set((state) => ({
            focusTriggers: [...state.focusTriggers, timestamp]
        }));        
    },

    /**
     * Feature modes
     */

    // Toggle focus mode, if activates, a trigger event is recorded
    focusMode: false,
    setFocusMode: async (value) => {

        const prev = get().focusMode;
        set({focusMode: value})

        // Trigger event record
        if (value === true && prev === false) {
            await get().addFocusTrigger();
        }
    },

    // Toggle priority mode
    priorityMode: false,
    setPriorityMode: (value) => set({ priorityMode: value }),

    // Toggle summary mode
    summaryMode: false,
    setSummaryMode: (value) => set({ summaryMode: value }),

    // Toggle calm mode
    calmMode: false,
    setCalmMode: (value) => set({ calmMode: value }),

    /**
     * UI states
     */

    // Change active screen
    screen: 'dashboard',
    setScreen: (screen) => set({screen}),

    // Toggle right side panel
    expandedRight: false, 
    setExpandedRight: (expandedRight) => set({expandedRight}),

    // Toggle left side secondary panel
    expandedSecondary: true, 
    setExpandedSecondary: (expandedSecondary) => set({expandedSecondary}),

    /**
     * Reset Store
     * 
     * Used to default back to original settings when a user session expires or user signs out.
     */
    resetStore: () => {
        
        set({
            theme: 'light',
            themeMode: 'normal',
            emotionValue: 0,
            calmModeDuration: 10000,
            sdkActive: false,
            stressDetectionDuration: 20000,
            stressSensitivity: 1.0,
            focusTriggers: [],
            focusMode: false,
            priorityMode: false,
            summaryMode: false,
            calmMode: false,
            screen: 'dashboard',
            expandedRight: false,
            expandedSecondary: false,
            profileLoaded: true
        })

        // Remove any theme settings that may persist
        const root = document.documentElement;
        root.classList.remove('dark', 'high-contrast', 'colour-vision-friendly');
    }
}));

export default useStore;