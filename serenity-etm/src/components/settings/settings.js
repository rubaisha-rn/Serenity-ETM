'use client';

import { useRef, useState } from "react";
import Portal from "../portal";
import { ICONS } from "@/lib/assets";
import useStore from "@/store/useStore";
import AppearanceSettings from "./appearance";
import WellbeingSettings from "./wellbeing";
import AccountSettings from "./account";

const sections = [
    { id: 'appearance', label: 'Appearance' },
    { id: 'wellbeing', label: 'Wellbeing' },
    { id: 'account', label: 'Account' },
]

export default function SettingsModal({open, onClose}) {
    
    const panelRef = useRef(null);
    const [active, setActive] = useState('appearance');
    const {theme} = useStore();

    if (!open) return null;

    return (
        <Portal>
            <div
                className="fixed inset-0 z-50 flex items-center justify-center bg-black/30 w-full"
                onClick={onClose}
                onMouseDown={(e) => {
                    if(!panelRef.current?.contains(e.target)) {
                        onClose();
                    }
                }}
            >
                <div
                    className="max-w-[60%] w-full max-h-[70%] h-full rounded-lg bg-[var(--bg)] shadow-md flex overflow-hidden p-1"
                    ref={panelRef}
                    onClick={(e) => e.stopPropagation()}
                >
                    {/* sidebar */}
                    <div className="w-1/4 p-1.5 m-0.5 rounded-md backdrop-blur-xl shadow-lg">
                        {sections.map(section => (
                            <button
                                key={section.id}
                                onClick={() => setActive(section.id)}
                                className={`settings-side-bar secondary-side-bar-btn expanded hover:bg-[var(--e-main)] mb-1 hover:scale-105
                                ${active === section.id ? 'bg-[var(--baseAcc-b)] shadow-md' : ''}`}
                            >
                                <img
                                    src={section.id === 'appearance' ? ICONS[theme].appearance : section.id === 'wellbeing' ? ICONS[theme].wellbeing : ICONS[theme].account}
                                    className="opacity-80 m-1.5"
                                />
                                <p className="secondary-side-bar-label show">{section.label}</p>
                            </button>
                        ))}
                    </div>

                    {/* content */}
                    <div className="flex-1 p-2 my-1 overflow-y-auto">
                        {active === 'appearance' && <AppearanceSettings />}
                        {active === 'wellbeing' && <WellbeingSettings />}
                        {active === 'account' && <AccountSettings />}
                    </div>
                </div>
            </div>
        </Portal>
    )
}