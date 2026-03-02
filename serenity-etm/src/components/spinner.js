// complete
import Portal from "./portal";

export default function Spinner() {
    const lines = Array.from({length: 12});

    return (
        <Portal>
            <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/30">
                <div className="relative animate-spin
                    sm:w-1 sm:h-1
                    md:w-2 md:h-2
                    ld:w-3 ld:h-3
                    xl:w-3 xl:h-3
                    2xl:w-4 2xl:h-4
                ">
                    {lines.map((_, i) => (
                        <span
                            key={i}
                            className="absolute left-1/2 top-1/2 bg-gray-500 rounded
                                sm:w-[0.5px] sm:h-0.5
                                md:w-[0.5px] md:h-1
                                lg:w-[1px] lg:h-1.5
                                xl:w-[1px] xl:h-1.5
                                2xl:w-[1.5px] 2xl:h-5
                            "
                            style={{
                                transformOrigin: 'center -4px',
                                transform: `rotate(${i*30}deg)`,
                                opacity: 1 - i / 12,
                            }}
                        />
                    ))}
                </div>
            </div>
        </Portal>
    )
}