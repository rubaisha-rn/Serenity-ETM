// done
'use client';

import { useEmailStore } from "@/store/emailStore";
import { motion, AnimatePresence } from "framer-motion";

export default function EmailReader() {
    const {selectedEmail, setSelectedEmail} = useEmailStore();

    if (!selectedEmail) return null;

    return (
        <AnimatePresence>
            <motion.div
                key={selectedEmail.id}
                initial={{opacity: 0, x:50}}
                animate={{opacity: 1, x: 0}}
                exit={{opacity: 0, x: 50}}
                transition={{duration: 0.3}}
                className="fixed right-0 top-0 h-full w-[500px] bg-[var(--blankCard-main)] shadow-2xl p-6 overflow-auto z-50"
            >
                <button
                    className="mb-4 p-2 py-1 bg-[var(--icons-main)] hover:bg-[var(--iconsHover-main)] rounded"
                    onClick={() => setSelectedEmail(null)}
                >
                    <img
                        src="/icons/dismiss.png"
                        className='w-5 h-5 shrink-0 object-contain'
                    />
                </button>

                {/* email */}
                <h2 className="text-xl font-bold text-[var(--text-a)]">{selectedEmail.subject}</h2>
                <p className="text-sm mt-2 text-[var(--text-c)]">From: {selectedEmail.from}</p>
                <p className="text-xs mb-4 text-[var(--text-c)]">{new Date(selectedEmail.timestamp).toLocaleString()}</p>
                <p className="text-base leading-relaxed whitespace-pre-wrap text-[var(--text-a)]">{selectedEmail.body}</p>

            </motion.div>
        </AnimatePresence>
    );
}