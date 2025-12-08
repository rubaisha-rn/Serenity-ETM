'use client';

import { useState } from "react";
import useStore from "@/store/useStore";

export default function StressControl() {
    const {emotionValue, setEmotionValue, sdkActive, setSdkActive} = useStore();
    const [showPopup, setShowPopup] = useState(false);

    return (
        <div className="fixed bottom-6 right-6 z-50">
            <button 
                className="px-4 py-2 bg-blue-500 text-white rounded-lg"
                onClick={() => setSdkActive(!sdkActive)}
                onMouseEnter={() => setShowPopup(true)}
                onMouseLeave={() => setShowPopup(false)}
            >
                Detect Stress
            </button>

            {/* popup */}
            {showPopup && (
                <div className='absolute bottom-12 right-0 z-50 bg-neutral-900/90 backdrop-blur-mg rounded-xl p-4 w-64 border border-neutral-700 space-y-3'>
                <div className='flex justify-between items-center' >
                    <span className='text-sm text-neutral-300' >
                        Stress Level
                    </span>
                    <span className='text-xs text-neutral-400' >
                        {emotionValue}
                    </span>
                </div>

                {/* Slider */}
                <input
                    type="range"
                    min={0}
                    max={100}
                    step={1}
                    value={emotionValue}
                    onChange={(e) => setEmotionValue(Number(e.target.value))}
                    className="w-full accent-blue-500"
                />
            </div>
            )}
        </div>
    );
}