/**
 * Email send component used to send emails or save drafts.
 */

'use client';

import { useState } from "react";
import { supabase } from "@/lib/supabaseClient";
import { useEmailStore } from "@/store/emailStore";
import { ICONS } from "@/lib/assets";
import useStore from "@/store/useStore";
import { createPortal } from "react-dom";
import Spinner from "../spinner";

export default function EmailSend({onClose}) {

    // Global store values
    const theme = useStore((s) => s.theme);
    const {sendEmail, saveDraft} = useEmailStore()

    // Form states
    const [to, setTo] = useState('')
    const [subject, setSubject] = useState('')
    const [body, setBody] = useState('')
    const [error, setError] = useState('')    
    const [loading, setLoading] = useState(false)
    const [showConfirm, setShowConfirm] = useState(false)

    // Handle sending email
    const handleSend = async () => {
        
        setError('')
        setLoading(true)

        // Basic validation
        if (!to || !body) {
            setError('Recipient and/or message are missing.')
            setLoading(false)
            return 
        }

        // Find receiver by email
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

        // Send email using receiver id
        await sendEmail({
            receiver_id: profile.id,
            subject, 
            body
        })

        // Reset form
        setTo('')
        setSubject('')
        setBody('')
        setLoading(false)

        if (onClose) onClose() 
    }

    // Handle compose close action
    const handleClose = () => {
        if (!subject && !body) {
            if (onClose) onClose()
            return
        }

        // Show confirm if email content is present
        setShowConfirm(true)
    }

    // Save email content as a draft
    const confirmSaveDraft = async () => {

        setLoading(true);

        // Find receiver by email
        if (to) {
            const {data: profile, error} = await supabase
            .from('profiles')
            .select('id')
            .eq('email', to)
            .single()

            // Save draft to db with receiver id
            await saveDraft({
                subject, body, receiver_id: profile.id
            })
        }
        else {

            // Save draft without receiver id
            await saveDraft({
                subject, body, receiver_id: null
            })
        }

        setLoading(false)
        resetAndClose()
    }

    // Discard draft and close composer
    const discardDraft = () => {
        resetAndClose()
    }

    // Reset form and close panel
    const resetAndClose = () => {
        setTo('')
        setSubject('')
        setBody('')
        setShowConfirm(false)

        if (onClose) onClose()
    }

    return (

        // Email compose container
        <div 
            className="flex-1 flex-col flex-1 min-h-0 bg-[var(--bg)] z-0 send-email-container"
            aria-label="Email composer"
        >

            {/* Loading overlay */}
            {loading && <Spinner/>}

            {/* Top control bar */}
            <div className="flex flex-row justify-between h-auto mb-1">
                
                {/* Close composer button */}
                <button 
                    onClick={handleClose}
                    disabled={loading}
                    className="prim-act-btn task-layout-btn bg-[var(--baseAcc-b)] hover:bg-[var(--f-main)] border-[var(--f-main)]"
                    aria-label="Close email composer"
                    title="Close email composer"
                >
                    <img
                        src={ICONS[theme].close}
                        alt=""
                        aria-hidden='true'
                    />
                </button>

                {/* Send email button */}
                <button 
                    onClick={handleSend}
                    disabled={loading}
                    className="prim-act-btn task-layout-btn"
                    aria-label="Send email"
                    title="Send email"
                >
                    <img
                        src={ICONS[theme].sendo}
                        alt=""
                        aria-hidden='true'
                    />
                </button>
            </div>

            {/* Error message */}
            {error && (
                <div 
                    role="alert"
                    aria-live="assertive"
                    className="error-message"
                >
                    <div 
                        className="flex flex-row items-center justify-center gap-1"
                    >
                        <img
                            src={ICONS[theme].warning}
                            className="bg-white rounded-full lg:p-0.5"
                            alt=""
                            aria-hidden='true'
                        />

                        <p className="font-bold">Error!</p>
                        <p className="text-[var(--text-a)]">{error}</p>
                    </div>

                    {/* Dismiss error button */}
                    <button
                        onClick={() => setError('')}
                        aria-label="Dismiss error message"
                    >
                        <img
                            src={ICONS[theme].close}
                            className="lg:w-[1rem] aspect-square opacity-70"
                            alt=""
                            aria-hidden='true'
                        />
                    </button>
                </div>
            )}

            {/* Recipient email */}
            <label className="sr-only" htmlFor="email-recipient">
                Recipient email address 
            </label>

            <input
                id="email-recipient"
                type="email"
                className="send-email-container w-full border-y border-[--e-main] input flex-none bg-[--baseAcc-b]"
                placeholder="To: janedoe@example.com"
                value={to}
                onChange={e => setTo(e.target.value)}
                autoComplete="email"
            />

            {/* Subject input */}
            <label className="sr-only" htmlFor="email-subject">
                Email subject
            </label>

            <input
                id="email-subject"
                className="send-email-container w-full border-y border-[--e-main] input flex-none bg-[--baseAcc-b]"
                placeholder="Subject"
                value={subject}
                onChange={e => setSubject(e.target.value)}
            />

            {/* Email body */}
            <label className="sr-only" htmlFor="email-body">
                Email message
            </label>

            <textarea
                id="email-body"
                className="send-email-container w-full border-y border-[--e-main] input flex-1 min-h-[200px] resize-none bg-[--baseAcc-b]"
                placeholder="Compose email"
                value={body}
                onChange={e => setBody(e.target.value)}
            />

            {/* Confirmation modal rendered in portal */}
            {showConfirm && (

                createPortal(
                
                    <div 
                        role="dialog"
                        aria-modal="true"
                        aria-labelledby="close-composer-title"
                        aria-describedby="close-composer-desc"
                        className="fixed inset-0 bg-black/60 flex items-center justify-center z-[999]"
                    >
                        <div className="error-popup">
                            
                            <img
                                src={ICONS[theme].warning}
                                className="lg:w-[2.2rem] aspect-square"
                                alt=""
                                aria-hidden='true'
                            />

                            {/* Modal title */}
                            <h6 
                                id="close-composer-title"
                                className="font-bold text-[var(--text-a)]"
                            >
                                Close Email Composer
                            </h6>

                            {/* Modal description */}
                            <p
                                id="close-composer-desc"
                            >
                                You're going to delete the composed email. Do you want to save it as a draft?
                            </p>

                            {/* Modal actions */}
                            <div className="flex gap-2">

                                {/* Save draft */}
                                <button
                                    onClick={confirmSaveDraft}
                                    disabled={loading}
                                    className="error-popup-btn a"
                                    aria-label="Save email as draft"
                                >
                                    <h6 className="font-semibold">Keep draft</h6>
                                </button>

                                {/* Discard draft */}
                                <button
                                    onClick={discardDraft}
                                    disabled={loading}
                                    className="error-popup-btn b"
                                    aria-label="Delete draft and close composer"
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