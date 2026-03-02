'use client';

import SettingsRow from "./settingsrow";
import useStore from "@/store/useStore";

export default function AppearanceSettings() {

    const {theme, setTheme} = useStore();

    return (
        <div className="space-y-6">
            <h5 className="font-bold">Appearance</h5>

            {/* theme */}
            <SettingsRow label='Theme' text='Switch between light and dark themes to match your lighting preference and reduce eye strain. Dark mode is ideal for low-light environments, while light mode works best in bright settings.'>
                <button
                    onClick={() => {
                        if (theme === 'light') {
                            setTheme('dark');
                            document.documentElement.classList.add('dark');
                        }
                        else {
                            setTheme('light');
                            document.documentElement.classList.remove('dark');
                        }
                    }}
                    className={`relative inline-flex h-6 w-10 items-center rounded-full transition-colors duration-300
                    ${theme !== 'light' ? 'bg-[var(--disabledMode)]' : 'bg-[var(--priorityLowt)]'}`}
                >
                    <span className={`inline-block w-4 aspect-square transform rounded-full bg-white shadow-lg ring-0 transition duration-300
                    ${theme !== 'light' ? 'translate-x-5' : 'translate-x-1'}`} />
                </button>
            </SettingsRow>

            {/* contrast */}
            <SettingsRow
                label='Contrast'
                text='Choose Normal for the standard balanced appearance, High contrast for separation between elements to improve readability, or Colour-vision-friendly modes that adjusts the palette to make content clearer for people with different types of colour vision.'
            >
                <div className="text-xs">
                    <select className="border border-[var(--f-main)] rounded p-1 bg-[--baseAcc-b]">
                        <option>Normal</option>
                        <option>High contrast</option>
                        <option>Colour-vision-friendly</option>
                    </select>
                </div>
            </SettingsRow>
        </div>
    );
}