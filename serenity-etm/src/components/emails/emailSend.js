'use client';

import { useState } from "react";
import { supabase } from "@/lib/supabaseClient";
import { useEmailStore } from "@/store/emailStore";

export default function EmailSend({onClose}) {

    const {sendEmail, saveDraft} = useEmailStore()

    const [to, setTo] = useState('')
    const [subject, setSubject] = useState('')
    const [body, setBody] = useState('')
    const [error, setError] = useState('')    
    const [loading, setLoading] = useState(false)
    const [showConfirm, setShowConfirm] = useState(false)

    const handleSend = async () => {
        setError('')
        setLoading(true)

        if (!to || !body) {
            setError('Recipient and message are required.')
            setLoading(false)
            return 
        }

        // find receiver by email
        const {data: profile, error} = await supabase
            .from('profiles')
            .select('id')
            .eq('email', to)
            .single()

        if (error || !profile) {
            setError('Recipient not found.')
            setLoading(false)
            return
        }

        // send email using receiver id
        await sendEmail({
            receiver_id: profile.id,
            subject, 
            body
        })

        setTo('')
        setSubject('')
        setBody('')
        setLoading(false)

        if (onClose) onClose() 
    }

    const handleClose = () => {
        if (!subject && !body) {
            if (onClose) onClose()
            return
        }

        setShowConfirm(true)
    }

    const confirmSaveDraft = async () => {
        setLoading(true)

        await saveDraft({
            subject, body
        })

        setLoading(false)

        resetAndClose()
    }

    const discardDraft = () => {
        resetAndClose()
    }

    const resetAndClose = () => {
        setTo('')
        setSubject('')
        setBody('')
        setShowConfirm(false)

        if (onClose) onClose()
    }

    return (
        <div className="bg-[var(--blankCard-main)] p-4 rounded-lg shadow">
            <h2 className="text-lg font-semibold mb-2">New Email</h2>

            <input
                className="w-full p-2 mb-2 border rounded"
                placeholder="To: email@example.com"
                value={to}
                onChange={e => setTo(e.target.value)}
            />

            <input
                className="w-full p-2 mb-2 border rounded"
                placeholder="Subject"
                value={subject}
                onChange={e => setSubject(e.target.value)}
            />

            <textarea
                className="w-full p-2 mb-2 border rounded"
                placeholder="Email body..."
                value={body}
                onChange={e => setBody(e.target.value)}
            />

            {error && (
                <p className="text-red-500 text-sm mb-2">{error}</p>
            )}

            <div className="flex justify-end gap-2">
                <button 
                    onClick={handleClose}
                    disabled={loading}
                    className="px-4 py-2 bg-gray-300 rounded"
                >
                    Close
                </button>

                <button 
                    onClick={handleSend}
                    disabled={loading}
                    className="px-4 py-2 bg-gray-300 rounded"
                >
                    {loading ? 'Sending...' : 'Send'}
                </button>
            </div>

            {showConfirm && (
                <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50">
                    <div className="bg-[var(--blankCard-main)] p-5 rounded-lg w-[320px] shadow-xl">
                        <p className="text-sm mb-4 text-[var(--text-a)]">
                            Save this email as draft?
                        </p>
                        <div className="flex justify-end gap-3">
                            <button
                                onClick={discardDraft}
                                disabled={loading}
                                className="px-3 py-1 rounded bg-gray-300"
                            >
                                Discard
                            </button>
                            <button
                                onClick={confirmSaveDraft}
                                disabled={loading}
                                className="px-3 py-1 rounded bg-gray-300"
                            >
                                Save Draft
                            </button>
                        </div>
                    </div>
                </div>
            )}

        </div>
        
    );
}