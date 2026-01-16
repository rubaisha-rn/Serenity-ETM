'use client';

import { supabase } from "@/lib/supabaseClient";
import { useEmailStore } from "@/store/emailStore";
import { motion, AnimatePresence } from "framer-motion";
import { useEffect, useState } from "react";

export default function EmailReader() {

    const {selectedEmail, setSelectedEmail, sendEmail, saveDraft, sendDraft} = useEmailStore();

    const [replyMode, setReplyMode] = useState(false)
    const [replyBody, setReplyBody] = useState('')
    const [loading, setLoading] = useState(false)
    const [showConfirm, setShowConfirm] = useState(false)

    const isDraft = selectedEmail?.folder === 'drafts'
    const [editTo, setEditTo] = useState('')
    const [editSubject, setEditSubject] = useState('')
    const [editBody, setEditBody] = useState('')

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
            alert('Recipient is required')
            return
        }

        if (!editBody.trim()) {
            alert('Message body is empty')
            return
        }

        const {data:profile, error} = await supabase
            .from('profiles')
            .select('id')
            .eq('email', editTo)
            .single()

        if (error || !profile) {
            alert('Recipient not found.')
            return 
        }
        
        await sendDraft(selectedEmail.id, profile.id, editSubject, editBody)
        setSelectedEmail(null) 
    }

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

                <button
                    onClick={() => {
                        setReplyMode(true)
                        setReplyBody('')
                    }}
                    className="mb-4 ml-2 p-2 py-1 bg-[var(--icons-main)] hover:bg-[var(--iconsHover-main)] rounded"
                >
                    Reply
                </button>

                {/* email */}

                {isDraft ? (
                    <>
                        <input
                            value={editTo}
                            onChange={e => setEditTo(e.target.value)}
                            placeholder="To"
                            className="w-full p-2 mb-2 border rounded"
                        />

                        <input
                            value={editSubject}
                            onChange={e => setEditSubject(e.target.value)}
                            placeholder="Subject"
                            className="w-full p-2 mb-2 border rounded"
                        />

                        <textarea
                            value={editBody}
                            onChange={e => setEditBody(e.target.value)}
                            placeholder="Write your email..."
                            className="w-full h-48 p-2 mb-2 border rounded resize-none"
                        />

                        <div className="flex justify-end gap-2">
                            <button 
                                onClick={() => setSelectedEmail(null)}
                                className="px-3 py-1 rounded bg-gray-300"
                            >
                                Close
                            </button>

                            <button 
                                onClick={sendDraftEmail}
                                className="px-3 py-1 rounded bg-gray-300"
                            >
                                Send
                            </button>
                        </div>
                    </>
                   ) : (
                   <>
                        <h2 className="text-xl font-bold text-[var(--text-a)]">{selectedEmail.subject}</h2>
                        <p className="text-sm mt-2 text-[var(--text-c)]">From: {selectedEmail.isSender ? 'Me' : selectedEmail.from_name || selectedEmail.from_email}</p>
                        <p className="text-sm mt-2 text-[var(--text-c)]">To: {selectedEmail.isReceiver ? 'Me' : selectedEmail.to_name || selectedEmail.to_email}</p>
                        <p className="text-xs mb-4 text-[var(--text-c)]">{new Date(selectedEmail.timestamp).toLocaleString()}</p>
                        <p className="text-base leading-relaxed whitespace-pre-wrap text-[var(--text-a)]">{selectedEmail.body}</p>
                    </>
                )}

                {replyMode && (
                    <div className="mt-6 border-t pt-4">
                        <p className="text-sm mb-2 text-[var(--text-c)]">
                            Replying to {selectedEmail.from_name || selectedEmail.from_email} 
                        </p>

                        <textarea
                            value={replyBody}
                            onChange={(e) => setReplyBody(e.target.value)}
                            placeholder="Type your reply..."
                            className="w-full h-32 p-2 rounded bg-[var(--cardB-main)] text-sm resize-none outline-none"
                        />

                        <div className="flex justify-end gap-2 mt-2">
                            <button
                                onClick={handleReplyClose}
                                className="px-3 py-1 rounded bg-[var(--icons-main)]"
                            >
                                Close
                            </button>
                            <button
                                onClick={sendReply}
                                className="px-3 py-1 rounded bg-[var(--acc-main)] text-white"
                            >
                                Send
                            </button>
                            
                        </div>
                    </div>
                )}

                {showConfirm && (
                    <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50">
                        <div className="bg-[var(--blankCard-main)] p-5 rounded-lg w-[320px] shadow-xl">
                            <p className="text-sm mb-4 text-[var(--text-a)]">
                                Save this reply as draft?
                            </p>
                            <div className="flex justify-end gap-3">
                                <button
                                    onClick={discardReply}
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

            </motion.div>
        </AnimatePresence>
    );
}