/**
 * Prototype tag component
 * 
 * Displays a label on the screen indicating that the application is a prototype. 
 * Can be dismissed by the user by clicking on it.
 */

import { useState } from "react"

export default function PrototypeTag() {

    // Hidden state to control tag visibility 
    const [hidden, setHidden] = useState(false);

    return (

        // Button to improve accessibility
        <button 
            type="button"
            aria-label="Dismiss prototype build tag"
            onClick={() => setHidden(true)}
            className={`fixed -bottom-2 right-1 bg-red-700 hover:bg-red-900 text-white shadow z-[9999] transition-opacity duration-100 prototype ${hidden ? 'opacity-0 pointer-events-none' : ''}`}
        >
            <p>Prototype Build</p>
        </button>
    )
}