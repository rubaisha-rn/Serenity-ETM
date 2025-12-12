'use client';

import { useEmailStore } from "@/store/emailStore";
import { motion, AnimatePresence } from "framer-motion";

export default function EmailReader() {
    const {selectedEmail, setSelectedEmail} = useEmailStore();

    if (!selectedEmail) return null;

    return (
        <AnimatePresence>
            <motion.div
                initial={{opacity: 0, x:50}}
                animate={{opacity: 1, x: 0}}
                exit={{opacity: 0, x: 50}}
                className="fixed right-0 top-0 h-full w-[400px] bg-white shadow-2xl p-6 overflow-auto z-50"
            >
                <button
                    className="mb-4 px-3 py-1 bg-gray-200 rounded"
                    onClick={() => setSelectedEmail(null)}
                >
                    Close
                </button>

                {/* email */}
                <h2 className="text-xl font-bold">{selectedEmail.subject}</h2>
                <p className="text-sm text-gray-500 mt-1">From: {selectedEmail.from}</p>
                <p className="text-sm text-gray-400 mb-4">{new Date(selectedEmail.timestamp).toLocaleString()}</p>
                <p className="text-base leading-relaxed whitespace-pre-wrap">{selectedEmail.body}</p>
            </motion.div>
        </AnimatePresence>
    );
}