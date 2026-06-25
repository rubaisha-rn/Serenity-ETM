/**
 * Wellbeing settings
 * 
 * Controls allowing users to adjust how adaptive wellbeing feature behave within the application.
 */

'use client';

import SettingsRow from "./settingsrow";
import useStore from "@/store/useStore";

export default function WellbeingSettings() {

    // Global states
    const {calmModeDuration, setCalmModeDuration, stressDetectionDuration, setStressDetectionDuration, stressSensitivity, setStressSensitivity} = useStore();

    return (

        // Wrapper container
        <div className="space-y-6">

            {/* Section heading */}
            <h5 className="font-bold">Wellbeing</h5>

            {/* Calm overlay duration setting */}
            <SettingsRow
                label='Calm Overlay Duration'
                text='Set how long the calm overlay appears to gently reduce visual intensity and help you stay focused.'
            >
                {/* Dropdown for duration selection */}
                <div className="text-xs">
                    
                    <select 
                        aria-label="Calm overlay duration"
                        value={calmModeDuration}
                        onChange={(e) => setCalmModeDuration(Number(e.target.value))}
                        className="border border-[var(--f-main)] rounded bg-[--baseAcc-b] sm:p-0.5 md:p-0.5 lg:p-1 xl:p-1 2xl:p-2"
                    >
                    
                        <option value={10000}>10 secs (Default)</option>
                        <option value={30000}>30 secs</option>
                        <option value={60000}>1 min</option>
                        <option value={120000}>2 min</option>
                    
                    </select>
                
                </div>
            </SettingsRow>

            {/* Stress detection interval setting */}
            <SettingsRow
                label='Stress Detection Interval'
                text='Controls how often the system checks for changes in your stress level and refreshes its response. Shorter intervals make the experience more responsive, while longer intervals create fewer updates and a steadier workflow.'
            >
                {/* Dropdown for stress interval selection */}
                <div className="text-xs">
                    
                    <select 
                        value={stressDetectionDuration}
                        onChange={(e) => setStressDetectionDuration(Number(e.target.value))}
                        className="border border-[var(--f-main)] rounded bg-[--baseAcc-b] sm:p-0.5 md:p-0.5 lg:p-1 xl:p-1 2xl:p-2"
                        aria-label="Stress detection interval"
                    >
                    
                        <option value={10000}>10 secs (Default)</option>
                        <option value={30000}>30 secs</option>
                        <option value={60000}>1 min</option>
                        <option value={120000}>2 min</option>
                    
                    </select>
                
                </div>
            </SettingsRow>

            {/* Stress detection sensitivity slider */}
            <SettingsRow
                label='Stress Detection Sensitivity'
                text='Adjusts how strongly the system responds to changes in your detected stress signals. Higher sensitivity picks up subtle shifts and adapts more quickly, while lower sensitivity reacts only to more noticable changes for a more stable experience.'
                col={true}
            >
                
                {/* Slider used to adjust algorithm sensitivity */}
                <input 
                    type="range"
                    min={1}
                    max={10}
                    step={0.5}
                    value={1 + (stressSensitivity - 0.5) * 9}
                    onChange={(e) => setStressSensitivity(Number(e.target.value))}
                    className="w-[75%] accent-[var(--baseAcc-a)] bg-[--baseAcc-b] border-[--e-main]"
                    aria-label="Stress detection sensitivity"
                    aria-valuemin={1}
                    aria-valuemax={10}
                    aria-valuenow={1 + (stressSensitivity - 0.5) * 9}
                />

                {/* Display current value */}
                <p>Value: {Math.round((1 + (stressSensitivity - 0.5) * 9) * 100) / 100} {(Math.round((1 + (stressSensitivity - 0.5) * 9) * 100) / 100) === 5.5 ? '(Default)' : ''}</p>
            
            </SettingsRow>
        </div>
    );
}