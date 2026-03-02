'use client';

export default function SettingsRow({label, text, col=false, children}) {
    return (
        <div className={`flex justify-between
            ${!col ? 'grid grid-cols-[1fr_0.2fr]' : 'flex-col w-full'}
        `}>
            <div className="flex flex-col sm:gap-0 md:gap-0 lg:gap-1 xl:gap-1 2xl:gap-2">
                <h6 className="font-semibold">{label}</h6>
                <p className="leading-tight">{text}</p>
            </div>
            <div className={col ? "text-center flex flex-row my-1 sm:gap-1 md:gap-1 lg:gap-2 xl:gap-2 2xl:gap-3" : "text-right sm:ml-2 md:ml-2 lg:ml-4 xl:ml-4 2xl:ml-6"}>
                {children}
            </div>
        </div>
    )
}