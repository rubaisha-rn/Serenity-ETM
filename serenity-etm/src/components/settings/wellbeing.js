'use client';

import SettingsRow from "./settingsrow";
import useStore from "@/store/useStore";

export default function WellbeingSettings() {

    const {calmModeDuration, setCalmModeDuration, stressDetectionDuration, setStressDetectionDuration, stressSensitivity, setStressSensitivity} = useStore();

    return (
        <div className="space-y-6">
            <h5 className="font-bold">Wellbeing</h5>

            {/* calm overlay */}
            <SettingsRow
                label='Calm Overlay Duration'
                text='Set how long the calm overlay appears to gently reduce visual intensity and help you stay focused.'
            >
                <div className="text-xs">
                    <select 
                        value={calmModeDuration}
                        onChange={(e) => setCalmModeDuration(Number(e.target.value))}
                        className="border border-[var(--f-main)] rounded bg-[--baseAcc-b] sm:p-0.5 md:p-0.5 lg:p-1 xl:p-1 2xl:p-2">
                        <option value={10000}>10 secs (Default)</option>
                        <option value={30000}>30 secs</option>
                        <option value={60000}>1 min</option>
                        <option value={120000}>2 min</option>
                    </select>
                </div>
            </SettingsRow>

            {/* stress detection interval */}
            <SettingsRow
                label='Stress Detection Interval'
                text='Controls how often the system checks for changes in your stress level and refreshes its response. Shorter intervals make the experience more responsive, while longer intervals create fewer updates and a steadier workflow.'
            >
                <div className="text-xs">
                    <select 
                        value={stressDetectionDuration}
                        onChange={(e) => setStressDetectionDuration(Number(e.target.value))}
                        className="border border-[var(--f-main)] rounded bg-[--baseAcc-b] sm:p-0.5 md:p-0.5 lg:p-1 xl:p-1 2xl:p-2">
                        <option value={10000}>10 secs (Default)</option>
                        <option value={30000}>30 secs</option>
                        <option value={60000}>1 min</option>
                        <option value={120000}>2 min</option>
                    </select>
                </div>
            </SettingsRow>

            {/* stress sensitivity slider */}
            <SettingsRow
                label='Stress Detection Sensitivity'
                text='Adjusts how strongly the system responds to changes in your detected stress signals. Higher sensitivity picks up subtle shifts and adapts more quickly, while lower sensitivity reacts only to more noticable changes for a more stable experience.'
                col={true}
            >
                <input 
                    type="range"
                    min={1}
                    max={10}
                    step={0.5}
                    value={1 + (stressSensitivity - 0.5) * 9}
                    onChange={(e) => setStressSensitivity(Number(e.target.value))}
                    className="w-[75%] accent-[var(--baseAcc-a)]"
                />
                <p>Value: {Math.round((1 + (stressSensitivity - 0.5) * 9) * 100) / 100} {(Math.round((1 + (stressSensitivity - 0.5) * 9) * 100) / 100) === 5.5 ? '(Default)' : ''}</p>
            </SettingsRow>
        </div>
    );
}