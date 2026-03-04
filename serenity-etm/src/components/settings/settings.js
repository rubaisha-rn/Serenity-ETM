/**
 * Settings modal
 * 
 * Displays categories in a sidebar
 * Shows selected settings panel
 */

'use client';

import { useRef, useState } from "react";
import Portal from "../portal";
import { ICONS } from "@/lib/assets";
import useStore from "@/store/useStore";
import AppearanceSettings from "./appearance";
import WellbeingSettings from "./wellbeing";
import AccountSettings from "./account";

// List of available settings sections
const sections = [
    { id: 'appearance', label: 'Appearance' },
    { id: 'wellbeing', label: 'Wellbeing' },
    { id: 'account', label: 'Account' },
]

export default function SettingsModal({open, onClose}) {
    
    // Reference to modal panel
    const panelRef = useRef(null);

    // Tracks which setting panel is active
    const [active, setActive] = useState('appearance');

    // Global state
    const theme = useStore((s) => s.theme);

    // Not rendered if not open
    if (!open) return null;

    return (

        // Ensures modal is rendered at the root of the DOM
        <Portal>

            {/* Modal overlay */}
            <div
                role="dialog"
                aria-label="Settings"
                aria-modal="true"
                className="fixed inset-0 z-50 flex items-center justify-center bg-black/30 w-full"
                onClick={onClose}
                onMouseDown={(e) => {
                    if(!panelRef.current?.contains(e.target)) {
                        onClose();
                    }
                }}
            >
                {/* Modal panel */}
                <div
                    className="max-w-[60%] w-full max-h-[70%] h-full bg-[var(--bg)] flex overflow-hidden settings"
                    ref={panelRef}
                    onClick={(e) => e.stopPropagation()}
                >
                    {/* Sidebar navigation */}
                    <div 
                        className="w-1/4 p-1.5 m-0.5 rounded-md backdrop-blur-xl shadow-lg"
                    >
                        {sections.map(section => (
                            <button
                                key={section.id}
                                role="tab"
                                aria-selected={active === section.id}
                                aria-label={`Open ${section.label} settings`}
                                onClick={() => setActive(section.id)}
                                className={`settings-side-bar secondary-side-bar-btn expanded hover:bg-[var(--e-main)] mb-1 hover:scale-105
                                ${active === section.id ? 'bg-[var(--baseAcc-b)] shadow-md' : ''}`}
                            >
                                {/* Section icon and label */}
                                <img
                                    src={section.id === 'appearance' ? ICONS[theme].appearance : section.id === 'wellbeing' ? ICONS[theme].wellbeing : ICONS[theme].account}
                                    className="opacity-80 m-1.5"
                                />
                                <p className="secondary-side-bar-label show">{section.label}</p>
                            </button>
                        ))}
                    </div>

                    {/* Settings content panel */}
                    <div 
                        role="tabpanel"
                        aria-label={`${active} settings`}
                        className="flex-1 overflow-y-auto settings-content"
                    >
                        {active === 'appearance' && <AppearanceSettings />}
                        {active === 'wellbeing' && <WellbeingSettings />}
                        {active === 'account' && <AccountSettings />}
                    </div>
                </div>
            </div>
        </Portal>
    )
}