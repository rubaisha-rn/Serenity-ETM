// complete
'use client';

import { supabase } from "@/lib/supabaseClient";
import { useEmailStore } from "@/store/emailStore";
import { useEffect, useState } from "react";
import { ICONS } from "@/lib/assets";
import useStore from "@/store/useStore";
import { createPortal } from "react-dom";

export default function EmailReader() {

    const {theme} = useStore();
    const {selectedEmail, setSelectedEmail, sendEmail, saveDraft, sendDraft} = useEmailStore();
    const {unarchiveMany, archiveMany, deleteMany} = useEmailStore();

    const [replyMode, setReplyMode] = useState(false)
    const [replyBody, setReplyBody] = useState('')
    const [loading, setLoading] = useState(false)
    const [showConfirm, setShowConfirm] = useState(false)

    const isDraft = selectedEmail?.folder === 'drafts'
    const [editTo, setEditTo] = useState('')
    const [editSubject, setEditSubject] = useState('')
    const [editBody, setEditBody] = useState('')
    const [error, setError] = useState('')

    const easeTransition = {
        type: 'spring',
        stiffness: 180,
        damping: 26,
        mass: 0.9,
    };

    useEffect(() => {

        if (!selectedEmail) return

        if (isDraft) {
            setEditTo(selectedEmail.to_email || '')
            setEditSubject(selectedEmail.subject || '')
            setEditBody(selectedEmail.body || '')
        }
    }, [selectedEmail])

    if (!selectedEmail) return null;

    const sendReply = async () => {

        if (!replyBody.trim()) return

        setLoading(true)

        const receiverId = selectedEmail.isSender
            ? selectedEmail.receiver_id
            : selectedEmail.sender_id

        const quoted = `
            ------------
            On ${new Date(selectedEmail.timestamp).toLocaleString()} ${
                selectedEmail.from_name || selectedEmail.from_email
            } wrote:
            ${ selectedEmail.body }
        `

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

    const handleReplyClose = () => {    
        if (!replyBody.trim()) {
            resetReply()
            return
        }
        setShowConfirm(true)
    }

    const confirmSaveDraft = async () => {
        
        setLoading(true)

        await saveDraft({
            subject: selectedEmail.subject.startsWith('Re:')
            ? selectedEmail.subject
            : `Re: ${selectedEmail.subject}`,
            body: replyBody,
            reply_to: selectedEmail.id
        })

        resetReply()
    }

    const discardReply = () => {
        resetReply()
    }

    const resetReply = () => {
        setReplyMode(false)
        setReplyBody('')
        setShowConfirm(false)
        setLoading(false)
    }

    const sendDraftEmail = async () => {

        if (!editTo.trim()) {
            setError('Recipient not found.')
            return
        }

        if (!editBody.trim()) {
            setError('Message body is empty.')
            return
        }

        const {data:profile, error} = await supabase
            .from('profiles')
            .select('id')
            .eq('email', editTo)
            .single()

        if (error || !profile) {
            setError('Recipient not found.')
            return 
        }
        
        await sendDraft(selectedEmail.id, profile.id, editSubject, editBody)
        setSelectedEmail(null) 
    }

    return (
        <div className="send-email-container h-full flex flex-col min-h-0 w-full border-l-[0.008rem] border-[var(--f-main)] bg-[var(--baseAcc-b)]">

            {/* toolbar */}
            <div className="flex flex-row justify-between h-auto mb-1 toolbar">
                
                <button
                    className="prim-act-btn task-layout-btn bg-[var(--baseAcc-b)] hover:bg-[var(--f-main)] border-[var(--f-main)]"
                    onClick={() => {handleReplyClose(); setSelectedEmail(null);}}
                >
                    <img
                        src={ICONS[theme].close}
                        alt=""
                        aria-hidden='true'
                    />
                </button>
                
                <div className="flex flex-row gap-2 items-center justify-center">
                    
                    {(selectedEmail.folder !== 'drafts' && selectedEmail.folder !== 'archive') && (
                        <>
                            <button
                                onClick={() => {
                                    setReplyMode(true)
                                    setReplyBody('')
                                }}
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
                                }}>
                                <img
                                    src={ICONS[theme].archive}
                                    alt=""
                                    aria-hidden='true'
                                />
                            </button>
                        </>
                    )}   

                    {(selectedEmail.folder === 'archive') && (
                        <button 
                            className="opacity-80 hover:opacity-60 transform transition-transform duration-200 ease-out hover:scale-105"
                            onClick={() => {
                                unarchiveMany([selectedEmail.id])
                                setSelectedEmail(null)
                            }}>
                            <img
                                src={ICONS[theme].unarchive}
                                alt=""
                                aria-hidden='true'
                            />
                        </button>
                    )}  

                    <button 
                        className="opacity-80 hover:opacity-60 transform transition-transform duration-200 ease-out hover:scale-105"
                        onClick={() => {
                            deleteMany([selectedEmail.id])
                            setSelectedEmail(null)
                        }}>
                        <img
                            src={ICONS[theme].delete}
                            alt=""
                            aria-hidden='true'
                        />
                    </button>

                    {(isDraft || replyMode) && (
                        <button 
                            onClick={isDraft ? sendDraftEmail : sendReply}
                            className="prim-act-btn task-layout-btn"
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

            <div className="flex-1 min-h-0 overflow-y-auto flex flex-col">
                {/* email */}
                {isDraft ? (
                    <>
                        {error && (
                            <div className="error-message">
                                <div className="flex flex-row items-center justify-center gap-1">
                                    <img
                                        src={ICONS[theme].warning}
                                        className="bg-[var(--baseAcc-b)] rounded-full p-0.5"
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
                                        src={ICONS[theme].close}
                                        className="opacity-70"
                                        alt=""
                                        aria-hidden='true'
                                    />
                                </button>
                            </div>
                        )}
                        
                        <div 
                            initial={{opacity:0}}
                            animate={{opacity:1}}
                            exit={{opacity:0, scale:0.98, position: 'absolute', inset: 0}}
                            transition={easeTransition}
                            className="min-h-0 h-full overflow-hidden pb-6 flex flex-col"
                        >
                            <input
                                className="send-email-container input border-y"
                                placeholder="To: janedoe@example.com"
                                value={editTo}
                                onChange={e => setEditTo(e.target.value)}
                            />

                            <input
                                className="send-email-container input border-y"
                                placeholder="Subject"
                                value={editSubject}
                                onChange={e => setEditSubject(e.target.value)}
                            />

                            <textarea
                                className="send-email-container input border-y flex-1 min-h-[320px] overflow-y-auto"
                                placeholder="Compose email"
                                value={editBody}
                                onChange={e => setEditBody(e.target.value)}
                            />
                        </div>
                    </>
                    ) : (
                    <div 
                        initial={{opacity:0}}
                        animate={{opacity:1}}
                        exit={{opacity:0, scale:0.98, position: 'absolute', inset: 0}}
                        transition={easeTransition}
                        className="flex flex-col gap-1 pb-6"
                    >
                        <div className="flex flex-row justify-between">
                            <h5>{selectedEmail.subject || '(No subject)'}</h5>
                            <p>{new Date(selectedEmail.timestamp).toLocaleDateString()} at {new Date(selectedEmail.timestamp).toLocaleTimeString('en-US', {
                                hour: 'numeric',
                                minute: '2-digit',
                                hour12: true,
                            })}</p>
                        </div>
                        <p className="text-[var(--text-b)]">From: {selectedEmail.isSender ? 'Me' : selectedEmail.from_name || selectedEmail.from_email}</p>
                        <p className="text-[var(--text-b)]">To: {selectedEmail.isReceiver ? 'Me' : selectedEmail.to_name || selectedEmail.to_email}</p>
                        <p className="text-xs">{selectedEmail.body || '(No body)'}</p>
                    </div>
                )}

                {replyMode && (
                    <div 
                        initial={{opacity:0}}
                        animate={{opacity:1}}
                        exit={{opacity:0, scale:0.98, position: 'absolute', inset: 0}}
                        transition={easeTransition}
                        className="flex flex-col flex-1 min-h-0 mt-4 border-t pt-4"
                    >
                        <p>
                            Replying to {selectedEmail.from_name || selectedEmail.from_email} 
                        </p>

                        <textarea
                            value={replyBody}
                            onChange={(e) => setReplyBody(e.target.value)}
                            className="send-email-container input border-y flex-1 min-h-[320px] overflow-y-auto"
                            placeholder="Type your reply"
                        />
                    </div>
                )}
            </div>

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
                                Close Email Reply Composer
                            </h6>
                            <p>
                                You're going to delete the composed reply. Do you want to save it as a draft?
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
                                    onClick={discardReply}
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