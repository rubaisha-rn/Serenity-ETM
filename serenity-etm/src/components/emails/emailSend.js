// add image sizes, widths, and other things according to window
'use client';

import { useState } from "react";
import { supabase } from "@/lib/supabaseClient";
import { useEmailStore } from "@/store/emailStore";
import { ICONS } from "@/lib/assets";
import useStore from "@/store/useStore";
import { createPortal } from "react-dom";

export default function EmailSend({onClose}) {

    const {theme} = useStore();
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
            setError('Recipient and/or message are missing.')
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
        setLoading(true);

        // find receiver by email
        if (to) {
            const {data: profile, error} = await supabase
            .from('profiles')
            .select('id')
            .eq('email', to)
            .single()

            await saveDraft({
                subject, body, receiver_id: profile.id
            })
        }
        else {
            await saveDraft({
                subject, body, receiver_id: null
            })
        }

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
        <div className="flex-1 flex-col flex-1 min-h-0 send-email-container">

            <div className="flex flex-row justify-between lg:h-[1.9rem]">
                <button 
                        onClick={handleClose}
                        disabled={loading}
                        className="p-1 bg-[var(--f-main)] rounded"
                    >
                        <img
                            src={ICONS[theme].dismiss}
                            className="lg:w-[1.5rem] aspect-square"
                            alt=""
                            aria-hidden='true'
                        />
                    </button>
                <button 
                    onClick={handleSend}
                    disabled={loading}
                    className="p-2 bg-[var(--a-main)] rounded"
                >
                    <img
                        src={ICONS[theme].send}
                        className="lg:w-[1rem] aspect-square"
                        alt=""
                        aria-hidden='true'
                    />
                </button>
            </div>

            {error && (
                <div className="error-message">
                    <div className="flex flex-row items-center justify-center gap-1">
                        <img
                            src={ICONS[theme].warning}
                            className="lg:h-[1rem] aspect-square bg-[var(--baseAcc-b)] rounded-full lg:p-0.5"
                            alt=""
                            aria-hidden='true'
                        />
                        <p className="font-bold">Error!</p>
                        <p className="text-[var(--text-a)]">{error}</p>
                    </div>
                    <button
                        onClick={() => setError('')}
                    >
                        <img
                            src={ICONS[theme].dismiss}
                            className="lg:w-[1rem] aspect-square opacity-70"
                            alt=""
                            aria-hidden='true'
                        />
                    </button>
                </div>
            )}

            <input
                className="send-email-container input flex-none"
                placeholder="To: janedoe@example.com"
                value={to}
                onChange={e => setTo(e.target.value)}
            />

            <input
                className="send-email-container input flex-none"
                placeholder="Subject"
                value={subject}
                onChange={e => setSubject(e.target.value)}
            />

            <textarea
                className="send-email-container input flex-1 min-h-[200px] resize-none"
                placeholder="Compose email"
                value={body}
                onChange={e => setBody(e.target.value)}
            />

            {showConfirm && (
                createPortal(
                    <div className="fixed inset-0 bg-black/60 flex items-center justify-center z-[999]">
                        <div className="error-popup">
                            <img
                                src={ICONS[theme].warning}
                                className="lg:w-[2.2rem] aspect-square"
                                alt=""
                                aria-hidden='true'
                            />
                            <h6 className="font-bold text-[var(--text-a)]">
                                Close Email Composer
                            </h6>
                            <p>
                                You're going to delete the composed email. Do you want to save it as a draft?
                            </p>
                            <div className="flex gap-2">
                                <button
                                    onClick={confirmSaveDraft}
                                    disabled={loading}
                                    className="error-popup-btn a"
                                >
                                    <h6 className="font-semibold">Keep draft</h6>
                                </button>
                                <button
                                    onClick={discardDraft}
                                    disabled={loading}
                                    className="error-popup-btn b"
                                >
                                    <h6 className="font-semibold">Delete</h6>
                                </button>
                            </div>
                        </div>
                    </div>,
                    document.body
                )
            )}
        </div>  
    );
}