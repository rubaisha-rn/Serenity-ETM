// completed
import { useState } from "react"

export default function PrototypeTag() {
    
    const [hidden, setHidden] = useState(false);

    return (
        <button 
            type="button"
            aria-label="Dismiss prototype build tag"
            onClick={() => setHidden(true)}
            className={`fixed -bottom-2 right-1 bg-[var(--danger)] hover:bg-[var(--dangerH)] text-[var(--text-d)] shadow z-[9999] transition-opacity duration-100 prototype ${hidden ? 'opacity-0 pointer-events-none' : ''}`}
        >
            <p>Prototype Build</p>
        </button>
    )
}