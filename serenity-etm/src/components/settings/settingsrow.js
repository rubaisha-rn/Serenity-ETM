'use client';

export default function SettingsRow({label, text, children}) {
    return (
        <div className="flex justify-between grid grid-cols-[1fr_0.2fr]">
            <div className="flex flex-col gap-1">
                <h6 className="font-semibold">{label}</h6>
                <p className="leading-tight">{text}</p>
            </div>
            <div className="text-right">
                {children}
            </div>
        </div>
    )
}