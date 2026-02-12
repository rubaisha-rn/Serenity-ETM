// complete
import { useState } from "react"

export default function PrototypeTag() {
    
    const [hidden, setHidden] = useState(false);

    return (
        <button 
            type="button"
            aria-label="Dismiss prototype build tag"
            onClick={() => setHidden(true)}
            className={`prototype ${hidden ? 'opacity-0 pointer-events-none' : ''}`}
        >
            <p>Prototype Build</p>
        </button>
    )
}