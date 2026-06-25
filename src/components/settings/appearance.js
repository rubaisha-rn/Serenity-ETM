/**
 * Appearance settings
 * 
 * Theme toggle 
 * Contrast mode selection
 */

'use client';

import SettingsRow from "./settingsrow";
import useStore from "@/store/useStore";

export default function AppearanceSettings() {

    // Global state
    const {setTheme, themeMode, setThemeMode} = useStore();
    const theme = useStore((s) => s.theme);

    return (

        // Container
        <div className="space-y-6">

            {/* Section heading */}
            <h5 className="font-bold">Appearance</h5>

            {/* Theme toggle */}
            <SettingsRow 
                label='Theme' 
                text='Switch between light and dark themes to match your lighting preference and reduce eye strain. Dark mode is ideal for low-light environments, while light mode works best in bright settings.'
            >
                
                {/* Toggle button for switching theme */}
                <button
                    onClick={() => {
                        if (theme === 'light') {
                            setTheme('dark');
                        }
                        else {
                            setTheme('light');
                        }
                    }}
                    role="switch"
                    aria-checked={theme === 'dark'}
                    aria-label="Toggle dark mode"
                    className={`appearance-toggle-outer relative inline-flex items-center rounded-full transition-colors duration-300 bg-[var(--priorityLowt)]`}
                >
                
                    {/* Toggle knob */}
                    <span className={`appearance-toggle-inner inline-block aspect-square transform rounded-full bg-white ring-0 transition duration-300 ${theme !== 'light' ? 'translate-x-5' : 'translate-x-1'}`} />
                
                </button>

            </SettingsRow>

            {/* Contrast mode selection */}
            <SettingsRow
                label='Contrast'
                text='Choose Normal for the standard balanced appearance, High contrast for separation between elements to improve readability, or Colour-vision-friendly modes that adjusts the palette to make content clearer for people with different types of colour vision.'
            >
                
                {/* Dropdown menu for selecting contrast mode */}
                <div className="text-xs">
                    
                    <select 
                        value={themeMode}
                        onChange={(e) => setThemeMode(e.target.value)}
                        className="border border-[var(--f-main)] rounded bg-[--baseAcc-b] sm:p-0.5 md:p-0.5 lg:p-1 xl:p-1 2xl:p-2"
                        aria-label="Contrast mode"
                    >
                    
                        <option value='normal'>Normal (Default)</option>
                        <option value='high-contrast'>High contrast</option>
                        <option value='colour-vision-friendly'>Colour-vision-friendly</option>
                    
                    </select>
                
                </div>
            
            </SettingsRow>
        </div>
    );
}