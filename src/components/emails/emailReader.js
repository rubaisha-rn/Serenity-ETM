/**
 * Email reader component
 * 
 * Displays:
    * Reading emails
    * Replying to emails
    * Editing drafts
    * Sending drafts
    * Archiving / unarchiving / deleting emails
 */

'use client';

import { supabase } from "@/lib/supabaseClient";
import { useEmailStore } from "@/store/emailStore";
import { useEffect, useState } from "react";
import { ICONS } from "@/lib/assets";
import useStore from "@/store/useStore";
import { createPortal } from "react-dom";
import Spinner from "../spinner";
import { AnimatePresence, motion } from "framer-motion";

export default function EmailReader() {

    // Global state values
    const theme = useStore((s) => s.theme);
    const summaryMode = useStore((s) => s.summaryMode);
    const {selectedEmail, setSelectedEmail, sendEmail, saveDraft, sendDraft, unarchiveMany, archiveMany, deleteMany} = useEmailStore();

    // Reply state
    const [replyMode, setReplyMode] = useState(false)
    const [replyBody, setReplyBody] = useState('')
    
    // UI state
    const [loading, setLoading] = useState(false)
    const [showConfirm, setShowConfirm] = useState(false)

    // Draft editing state
    const isDraft = selectedEmail?.folder === 'drafts'
    const [editTo, setEditTo] = useState('')
    const [editSubject, setEditSubject] = useState('')
    const [editBody, setEditBody] = useState('')

    // Error state
    const [error, setError] = useState('')

    // Animation transition settings
    const easeTransition = {
        type: 'spring',
        stiffness: 180,
        damping: 26,
        mass: 0.9,
    };

    // Populate draft editor when draft email is selected
    useEffect(() => {

        if (!selectedEmail) return

        if (isDraft) {
            setEditTo(selectedEmail.to_email || '')
            setEditSubject(selectedEmail.subject || '')
            setEditBody(selectedEmail.body || '')
        }

    }, [selectedEmail])

    // Send reply email
    const sendReply = async () => {

        if (!replyBody.trim()) return

        setLoading(true)

        const receiverId = selectedEmail.isSender
            ? selectedEmail.receiver_id
            : selectedEmail.sender_id

        // Add extra characters indicating its a reply to which email
        const quoted = `
            ------------
            On ${new Date(selectedEmail.timestamp).toLocaleString()} ${
                selectedEmail.from_name || selectedEmail.from_email
            } wrote:
            ${ summaryMode ? selectedE.summaryMode || selectedEmail.body : selectedEmail.body }
        `

        // Insert in db
        await sendEmail({
            receiver_id: receiverId,
            subject: selectedEmail.subject.startsWith('Re:')
            ? selectedEmail.subject
            : `Re: ${selectedEmail.subject}`,
            body: quoted + replyBody,
            reply_to: selectedEmail.id,
        })

        resetReply();
    }

    // Close reply composer
    const handleReplyClose = () => { 

        if (!replyBody.trim()) {
            resetReply()
            return
        }

        // Prompt if content exists in reply
        setShowConfirm(true)
    }

    // Save reply as draft
    const confirmSaveDraft = async () => {
        
        setLoading(true)

        // Insert to db
        await saveDraft({
            subject: selectedEmail.subject.startsWith('Re:')
            ? selectedEmail.subject
            : `Re: ${selectedEmail.subject}`,
            body: replyBody,
            reply_to: selectedEmail.id
        })

        resetReply()
    }

    // Discard reply
    const discardReply = () => {
        resetReply()
    }

    // Reset reply state
    const resetReply = () => {
        
        setReplyMode(false)
        setReplyBody('')
        setShowConfirm(false)
        setLoading(false)
    }

    // Send draft email
    const sendDraftEmail = async () => {

        // Content validation
        if (!editTo.trim()) {
            setError('Recipient not found.')
            return
        }

        if (!editBody.trim()) {
            setError('Message body is empty.')
            return
        }

        // Update draft email
        const {data:profile, error} = await supabase
            .from('profiles')
            .select('id')
            .eq('email', editTo)
            .single()

        if (error || !profile) {
            setError('Recipient not found.')
            return 
        }
        
        // Send draft email
        await sendDraft(selectedEmail.id, profile.id, editSubject, editBody)
        setSelectedEmail(null) 
    }

    // If no email selected render nothing
    if (!selectedEmail) return null;

    return (

        // Email reader container
        <div 
            aria-label="Email reader"
            className="send-email-container h-full flex flex-col min-h-0 w-full border-l-[0.008rem] border-[var(--f-main)] bg-[var(--bg)]"
        >
            {/* Loading overlay */}
            {loading && <Spinner/>}

            {/* Toolbar */}
            <div 
                role="toolbar"
                aria-label="Email actions"
                className="flex flex-row justify-between h-auto mb-1 toolbar"
            >
                
                {/* Close reader */}
                <button
                    className="prim-act-btn task-layout-btn bg-[var(--baseAcc-b)] hover:bg-[var(--f-main)] border-[var(--f-main)]"
                    onClick={() => {handleReplyClose(); setSelectedEmail(null);}}
                    aria-label="Close email"
                >
                    <img
                        src={ICONS[theme].close}
                        alt=""
                        aria-hidden='true'
                    />
                </button>
                
                {/* Action buttons */}
                <div className="flex flex-row gap-2 items-center justify-center">
                    
                    {/* Reply & archive actions */}
                    {(selectedEmail.folder !== 'drafts' && selectedEmail.folder !== 'archive') && (
                        <>
                            <button
                                onClick={() => {
                                    setReplyMode(true)
                                    setReplyBody('')
                                }}
                                aria-label="Reply to email"
                                className="opacity-80 hover:opacity-60 transform transition-transform duration-200 ease-out hover:scale-105"
                            >
                                <img
                                    src={ICONS[theme].reply}
                                    alt=""
                                    aria-hidden='true'
                                />
                            </button>
                        
                            <button 
                                className="opacity-80 hover:opacity-60 transform transition-transform duration-200 ease-out hover:scale-105"
                                onClick={() => {
                                    archiveMany([selectedEmail.id])
                                    setSelectedEmail(null)
                                }}
                                aria-label="Archive email"
                            >
                                <img
                                    src={ICONS[theme].archive}
                                    alt=""
                                    aria-hidden='true'
                                />
                            </button>
                        </>
                    )}   

                    {/* Unarchive */}
                    {(selectedEmail.folder === 'archive') && (
                        <button 
                            className="opacity-80 hover:opacity-60 transform transition-transform duration-200 ease-out hover:scale-105"
                            onClick={() => {
                                unarchiveMany([selectedEmail.id])
                                setSelectedEmail(null)
                            }}
                            aria-label="Unarchive email"
                        >
                            <img
                                src={ICONS[theme].unarchive}
                                alt=""
                                aria-hidden='true'
                            />
                        </button>
                    )}  

                    {/* Delete */}
                    <button 
                        className="opacity-80 hover:opacity-60 transform transition-transform duration-200 ease-out hover:scale-105"
                        onClick={() => {
                            deleteMany([selectedEmail.id])
                            setSelectedEmail(null)
                        }}
                        aria-label="Delete email"
                    >
                        <img
                            src={ICONS[theme].delete}
                            alt=""
                            aria-hidden='true'
                        />
                    </button>

                    {/* Send button for drafts or replies */}
                    {(isDraft || replyMode) && (
                        <button 
                            onClick={isDraft ? sendDraftEmail : sendReply}
                            className="prim-act-btn task-layout-btn"
                            aria-label="Send email"
                        >
                            <img
                                src={ICONS[theme].sendo}
                                alt=""
                                aria-hidden='true'
                            />
                        </button>
                    )}

                </div>
            </div>

            {/* Email content area */}
            <div className="flex-1 min-h-0 overflow-y-auto flex flex-col bg-[var(--bg)]">
                
                {/* Draft editor */}
                {isDraft ? (
                    <>
                        {error && (
                            
                            <div 
                                role="alert"
                                aria-live="assertive"
                                className="error-message"
                            >
                                <div className="flex flex-row items-center justify-center gap-1">
                                    <img
                                        src={ICONS[theme].warning}
                                        className="bg-white rounded-full p-0.5"
                                        alt=""
                                        aria-hidden='true'
                                    />
                                    <p className="font-bold">Error!</p>
                                    <p className="text-[var(--text-a)]">{error}</p>
                                </div>

                                <button
                                    onClick={() => setError('')}
                                    aria-label="Dismiss error message"
                                >
                                    <img
                                        src={ICONS[theme].close}
                                        className="opacity-70"
                                        alt=""
                                        aria-hidden='true'
                                    />
                                </button>
                            </div>
                        )}
                        
                        {/* Draft editing inputs */}
                        <div 
                            className="min-h-0 h-full overflow-hidden pb-6 flex flex-col"
                        >
                            <label className="sr-only" id="draft-to">Recipient email</label>
                            <input
                                id="draft-to"
                                className="send-email-container input border-y bg-[--baseAcc-b] border-[--e-main]"
                                placeholder="To: janedoe@example.com"
                                value={editTo}
                                onChange={e => setEditTo(e.target.value)}
                            />

                            <label className="sr-only" id="draft-subject">Email subject</label>
                            <input
                                id="draft-subject"
                                className="send-email-container input border-y bg-[--baseAcc-b] border-[--e-main]"
                                placeholder="Subject"
                                value={editSubject}
                                onChange={e => setEditSubject(e.target.value)}
                            />

                            <label className="sr-only" id="draft-body">Email message</label>
                            <textarea
                                id="draft-body"
                                className="send-email-container input border-y flex-1 min-h-[320px] overflow-y-auto bg-[--baseAcc-b] border-[--e-main]"
                                placeholder="Compose email"
                                value={editBody}
                                onChange={e => setEditBody(e.target.value)}
                            />
                        </div>
                    </>
                ) : (
                    // Standard email display
                    <div className="flex flex-col gap-1 pb-6">
                        <div className="flex flex-row justify-between">
                            <h5>{selectedEmail.subject || '(No subject)'}</h5>
                            <p>
                                {new Date(selectedEmail.timestamp).toLocaleDateString()} at {new Date(selectedEmail.timestamp).toLocaleTimeString('en-US', {
                                    hour: 'numeric',
                                    minute: '2-digit',
                                    hour12: true,
                                })}
                            </p>
                        </div>

                        <p className="text-[var(--text-b)]">From: {selectedEmail.isSender ? 'Me' : selectedEmail.from_name || selectedEmail.from_email}</p>
                        <p className="text-[var(--text-b)]">To: {selectedEmail.isReceiver ? 'Me' : selectedEmail.to_name || selectedEmail.to_email}</p>
                        <AnimatePresence initial={false}>
                            {summaryMode && (
                                <motion.div
                                    className="overflow-hidden"
                                    initial={{
                                        opacity: 0,
                                        height: 0,
                                        marginTop: 0,
                                        marginBottom: 0,
                                    }}
                                    animate={{
                                        opacity: 1,
                                        height: "auto",
                                        marginTop: 8,
                                        marginBottom: 4,
                                    }}
                                    exit={{
                                        opacity: 0,
                                        height: 0,
                                        marginTop: 0,
                                        marginBottom: 0,
                                    }}
                                    transition={{
                                        duration: 0.2,
                                    }}
                                >
                                    <div className="summary-tag">
                                        <img
                                            src={ICONS[theme].summary}
                                            alt=""
                                            aria-hidden="true"
                                        />
                                        <p>This email's content has been summarised.</p>
                                    </div>
                                </motion.div>
                            )}
                        </AnimatePresence>
                        <div className="relative overflow-hidden">
                            <AnimatePresence mode="wait" initial={false}>
                                <motion.p
                                    key={summaryMode ? "summary" : "body"}
                                    className="text-xs"
                                    initial={{ opacity: 0, y: 2 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    exit={{ opacity: 0, y: -2 }}
                                    transition={{ duration: 0.2 }}
                                >
                                    {summaryMode
                                        ? selectedEmail.summary || selectedEmail.body
                                        : selectedEmail.body || "(No body)"}
                                </motion.p>
                            </AnimatePresence>
                        </div>
                    </div>
                )}

                {/* Reply composer  */}
                {replyMode && (
                    <div className="flex flex-col flex-1 min-h-0 mt-4 border-t border-[--e-main] pt-4">
                        <p>
                            Replying to {selectedEmail.from_name || selectedEmail.from_email} 
                        </p>

                        <label className="sr-only" htmlFor="reply-body">Reply message</label>
                        <textarea
                            id="reply-body"
                            value={replyBody}
                            onChange={(e) => setReplyBody(e.target.value)}
                            className="send-email-container input border-y flex-1 min-h-[320px] overflow-y-auto bg-[--baseAcc-b] border-[--e-main]"
                            placeholder="Type your reply"
                        />
                    </div>
                )}
            </div>

            {/* Confirmation modal */}
            {showConfirm && createPortal(
                <div 
                    role="dialog"
                    aria-modal="true"
                    aria-labelledby="reply-close-title"
                    aria-describedby="reply-close-desc"
                    className="fixed inset-0 bg-black/60 flex items-center justify-center z-[999]"
                >
                    <div className="error-popup">
                        
                        <img
                            src={ICONS[theme].warning}
                            className="lg:w-[2.2rem] aspect-square"
                            alt=""
                            aria-hidden='true'
                        />

                        <h6 
                            id="reply-close-title"
                            className="font-bold text-[var(--text-a)]"
                        >
                            Close Email Reply Composer
                        </h6>
                        
                        <p id="reply-close-desc">
                            You're going to delete the composed reply. Do you want to save it as a draft?
                        </p>
                        
                        <div className="flex gap-2">

                            <button
                                onClick={confirmSaveDraft}
                                disabled={loading}
                                className="error-popup-btn a"
                                aria-label="Save reply as draft"
                            >
                                <h6 className="font-semibold">Keep draft</h6>
                            </button>
                            
                            <button
                                onClick={discardReply}
                                disabled={loading}
                                className="error-popup-btn b"
                                aria-label="Delete reply"
                            >
                                <h6 className="font-semibold">Delete</h6>
                            </button>
                        </div>
                    </div>
                </div>,
                document.body
            )}
        </div>
    );
}