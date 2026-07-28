/**
 * Email management Zustand store.
 * 
 * Manages:
    * Email CURD operations (supabase)
    * Bulk actions (read, archive, delete)
    * Folder management (inbox, archive, drafts)
    * Email selection for multi-actions
    * Priority classification via API
    * Draft handling
    * Summarising emails + RAG pipeline
 */

import { create } from "zustand";
import { supabase } from "@/lib/supabaseClient";

const AI_API = process.env.NEXT_PUBLIC_AI_API;

// AI service check helper function
const checkAIServiceHealth = async () => {
    try {
        const controller = new AbortController();
        const timeout = setTimeout(() => controller.abort(), 1500);

        const res = await fetch(`${AI_API}/health`, {signal: controller.signal});
        
        clearTimeout(timeout);
        return res.ok;
    }
    catch {
        return false;
    }
}

export const useEmailStore = create((set, get) => ({

    /**
     * Selection state
     */

    // Selected IDs for bulk actions
    selectedIds: [],

    // Toggle select. If email is already selected, remove it, otherwise add it.
    toggleSelect: (id) =>
        set(state => ({
            selectedIds: state.selectedIds.includes(id)
                ? state.selectedIds.filter(x => x !== id)
                : [...state.selectedIds, id]
        })),

    // Clear all selected emails
    clearSelection: () => set({selectedIds: []}),

    // Select all emails visible in the UI
    selectAllVisible: (ids) => set({selectedIds: ids}),

    /**
     * Bulk actions
     */

    // Mark many emails as read/unread
    markManyRead: async (ids, read=true) => {
        if (!ids.length) return

        // Update db depending on marking it as read or unread
        await supabase
            .from('emails')
            .update({is_read: read})
            .in('id', ids)

        // Clear selection and reload emails
        get().clearSelection()
        get().loadEmails()
    },

    // Archive many
    archiveMany: async (ids) => {
        
        if (!ids.length) return

        // DB update
        await supabase
            .from('emails')
            .update({folder: 'archive'})
            .in('id', ids)

        // Clear selection and reload
        get().clearSelection()
        get().loadEmails()
    },

    // Unarchive and send to inbox
    unarchiveMany: async (ids) => {
        
        if (!ids.length) return

        await supabase
            .from('emails')
            .update({folder: 'inbox'})
            .in('id', ids)

        // Clear selection and refresh list
        get().clearSelection()
        get().loadEmails()
    },
    
    // Soft delete many emails
    deleteMany: async (ids) => {
   
        if (!ids.length) return
        
        // Mark as deleted
        await supabase
            .from('emails')
            .update({is_delete: true})
            .in('id', ids)

        // Clear selection and reload emails
        get().clearSelection()
        get().loadEmails()
    },

    /**
     * Email classification
     * Uses API to determine email priroity when it has not been classified by the user
     */
    classifyMissingEmails: async () => {

        const {data: sessionData} = await supabase.auth.getSession();
        if (!sessionData.session) return;

        const emails = get().emails;

        // Classify emails missing priority or that can be classified by rules/AI
        const unclassified = emails.filter(
            e => (e.priority_src === 'rules' || e.priority === null)
        )

        if (unclassified.length === 0) return;

        try {

            const results = await Promise.all(
                unclassified.map(async (email) => {
            
                    try {
            
                        // Send email subject and body to classification API
                        const res = await fetch('/api/classify', {
                            method: 'POST',
                            headers: {'Content-Type': 'application/json'},
                            body: JSON.stringify({
                                text: `${email.subject ?? ""} ${email.body ?? ""}`
                            })
                        });

                        const data = await res.json();

                        // Get classification per email
                        return {
                            id: email.id,
                            priority: data.priority,
                            priority_src: 'rules'
                        };
                    }
                    catch {
                        return null;
                    }
                })
            );

            // Remove classifications that are boolean or null which indicates a failed classification
            const validUpdates = results.filter(Boolean);

            // Return if not valid classifications
            if (validUpdates.length === 0) return;

            // Safe db update by not overwriting user defined priorities 
            for (const update of validUpdates) {
                await supabase
                    .from('emails')
                    .update({
                        priority: update.priority,
                        priority_src: update.priority_src
                    })
                    .eq('id', update.id)
                    .neq('priority_src', 'user');
            }

            // Update local state
            const updatedEmails = emails.map(email => {
                const match = validUpdates.find(u => u.id === email.id);
                return match ? {...email, ...match} : email;
            });

            set({emails: updatedEmails});
        }
        catch (err) {
            console.log("Classification failed.", err);
        }
    },

    /**
     * Email embedding
     * Embeds emails that don't already have a stored embedding, so they become searchable as RAG context for future summaries.
     */
    embedMissingEmails: async () => {
        
        const { data:sessionData } = await supabase.auth.getSession();
        if ( !sessionData.session ) return;

        const isHealthy = await checkAIServiceHealth();
        if (!isHealthy) {
            set({aiServiceAvailable: false});
            console.log('AI Service is not running.');
            return;
        }

        set({aiServiceAvailable: true});

        const emails = get().emails;
        const unembedded = emails.filter(e => !e.embedding);

        if (unembedded.length === 0) return;

        try {
            const batchSize = 5;
            const batches = [];

            for (let i=0; i<unembedded.length; i+=batchSize) {
                batches.push(unembedded.slice(i, i+batchSize));
            }

            let allUpdates = [];

            for (const batch of batches) {
                const res = await fetch(`${AI_API}/embed-batch`, {
                    method: 'POST',
                    headers: {'Content-Type': 'application/json'},
                    body: JSON.stringify({
                        emails: batch.map(email => ({
                            id: email.id,
                            content: `${email.subject ?? ""} ${email.body ?? ""}`
                        }))
                    })
                });

                const data = await res.json();

                if (!data.results) continue;

                const updates = data.results.filter(r => Array.isArray(r.embedding));

                allUpdates.push(...updates);
            }

            if (allUpdates.length === 0) return;

            // save embeddings to supabase
            await Promise.all(
                allUpdates.map(update =>
                    supabase
                        .from('emails')
                        .update({embedding: update.embedding})
                        .eq('id', update.id)
                )
            );

            const updatedEmails = emails.map(email => {
                const match = allUpdates.find(u => u.id === email.id);
                return match ? {...email, embedding: match.embedding} : email;
            });

            set({emails: updatedEmails});
        }
        catch (err) {
            console.log("Embedding failed.", err);
        }
    },

    /**
     * Email summarisation
     * Uses API to summarise emails that don't already have a summary
     */
    summariseMissingEmails: async () => {

        const { data:sessionData } = await supabase.auth.getSession();
        if ( !sessionData.session ) return;

        // Check if local AI service is running
        const isHealthy = await checkAIServiceHealth();
        if (!isHealthy) {
            set({aiServiceAvailable: false});
            console.log('AI Service is not running.');
            return;
        }

        set({aiServiceAvailable: true});

        // make sure emails are embedded first
        await get().embedMissingEmails();

        const emails = get().emails;

        // only emails without summaries
        const unsummarised = emails.filter(
            e => !e.summary || e.summary.trim() === ""
        );

        if ( unsummarised.length === 0 ) return;

        try {
            // Retrieve context for each email individually
            // DB calls not LLM calls, so unbatched
            const withContext = await Promise.all(
                unsummarised.map(async (email) => {
                
                    if (!email.embedding) {
                        // no embedding yet, summarise without context
                        return {...email, ragContext: []};
                    }

                    const { data: matches, error } = await supabase.rpc('match_emails', {
                        query_embedding: email.embedding,
                        match_count: 3,
                        exclude_id: email.id
                    });

                    if (error) {
                        console.log('Retrieval failed for', email.id, error);
                        return {...email, ragContext:[]};
                    }

                    const ragContext = (matches ?? []).map(
                        m => `${m.subject ?? ""}: ${m.body ?? ""}`
                    );

                    return {...email, ragContext};                
                })
            );

            // batch size
            const batchSize = 3;
            const batches = [];

            for (let i=0; i<unsummarised.length; i+=batchSize) {
                batches.push(unsummarised.slice(i, i+batchSize));
            }

            let allUpdates = [];
            
            for (const batch of batches) {
                const res = await fetch(`${AI_API}/summarise-batch`, {
                    method: 'POST',
                    headers: {'Content-Type': 'application/json'},
                    body: JSON.stringify({
                        emails: batch.map(email => ({
                            id: email.id,
                            content: `${email.subject ?? ""} ${email.body ?? ""}`,
                            context: email.ragContext
                        }))
                    })
                });

                const data = await res.json();

                if (!data.results) continue;

                const updates = data.results
                    .filter(r => typeof r.summary === 'string' && r.summary.trim().length > 0)
                    .map(r => ({
                        id: r.id,
                        summary: r.summary
                            .replace(/^\d+[\).\-\s]*/, '')
                            .trim()
                    }));
                
                allUpdates.push(...updates);
            }

            if (allUpdates.length === 0) return;

            // save to supabase
            await Promise.all(
                allUpdates.map(update => 
                    supabase
                        .from('emails')
                        .update({ summary: update.summary })
                        .eq('id', update.id)
                )
            );

            const updatedEmails = emails.map(email => {
                const match = allUpdates.find(u => u.id === email.id);
                return match ? {...email, ...match} : email;
            });

            set({emails: updatedEmails});
        }
        catch (err) {
            console.log("Summarisation failed.", err);
        }
    },

    /**
     * Load emails
     */
    loadEmails: async () => {

        // If in session
        const {data: sessionData} = await supabase.auth.getSession()
        if (!sessionData.session) return

        const userId = sessionData.session.user.id

        // Load all emails where user is either sender or receiver
        const {data: rows, error} = await supabase
            .from('emails')
            .select(`
                *,
                sender:sender_id(
                email,
                first_name,
                last_name
                ),
                receiver:receiver_id(
                email,
                first_name,
                last_name
                )
            `)
            .or(`sender_id.eq.${userId},receiver_id.eq.${userId}`)
            .order('created_at', {ascending: false})

        // If no error, normalise data for easier UI use
        if (!error) {

            const normalised = rows.map(e => {
                
                // Define if user is sender, receiver, or both
                const isSender = e.sender_id === userId
                const isReceiver = e.receiver_id === userId

                // Define names
                const senderName = e.sender
                    ? `${e.sender.first_name || ''} ${e.sender.last_name || ''}`.trim()
                    : ''

                const receiverName = e.receiver
                    ? `${e.receiver.first_name || ''} ${e.receiver.last_name || ''}`.trim()
                    : ''

                // Folder 
                let folder = e.folder || 'inbox'
                
                return {
                    ...e,

                    // Sender info
                    from_email: e.sender?.email || '',
                    from_name: senderName,

                    // Receiver info
                    to_email: e.receiver?.email || '',
                    to_name: receiverName,

                    // Relationship flags
                    isSender,
                    isReceiver,

                    // Read status and timestamps with fallback
                    read: e.read ?? e.is_read,
                    timestamp: e.timestamp || e.created_at,

                    // Folder
                    folder,
                    
                    // Additional flags and priority classification
                    starred: e.starred ?? false,
                    priority: e.priority,
                    priority_src: e.priority_src,
                }
            })

            set({emails: normalised})
        }
        else {
            console.error('Email fetch error:', error)
        }
    },

    /**
     * Email State. Accessors and mutators
     */
    
    emails: [],

    // AI service state
    aiServiceAvailable: true,
    
    // Currently opened email
    selectedEmail: null,
    setSelectedEmail: (email) => set({selectedEmail: email}),

    // Currently visible folder
    showEmails: 'inbox',
    setShowEmails: (folder) => set({showEmails: folder}),

    // Total emails read in current session
    readEmailCount: 0,
    setReadEmailCount: (count) => set({readEmailCount: count}),

    /**
     * Email Actions
     */

    // Toggle star status
    toggleStar: async (id) => {

        const email = get().emails.find(e => e.id === id)

        if (!email) return

        //Update in db
        await supabase
            .from('emails')
            .update({starred: !email.starred})
            .eq('id', id)

        get().loadEmails()
    },

    // Toggle read status by marking as read/unread
    markAsRead: async (id, read=true) => {

        await supabase
            .from('emails')
            .update({is_read: read})
            .eq('id', id)

        get().loadEmails()
    },

    // Move email to different folder
    moveToFolder: async (id, newfolder='inbox') => {

        await supabase
            .from('emails')
            .update({ folder: newfolder })
            .eq('id', id)

        get().loadEmails()
    },
    
    /**
     * Send email
     */
    sendEmail: async (data) => {

        const {data: sessionData} = await supabase.auth.getSession()
        if (!sessionData.session) return

        // Insert data if in session
        const {data: rows, error} = await supabase
            .from('emails')
            .insert([{
                ...data,
                sender_id: sessionData.session.user.id,
                receiver_id: data.receiver_id,
                folder: 'inbox',
                is_read: false,
                priority: 'normal',

                // Priority is defined by API as default
                priority_src: 'rules',
            }])

        if (error) {
            console.error('Send email failed:', error)
            return 
        }

        get().loadEmails()
    },

    /**
     * Priority management cycle: low -> normal -> high
     */
    cyclePriority: async (id) => {
        
        // Get current email    
        const emails = get().emails;
        const email = emails.find(e => e.id === id);
        if (!email) return;

        // Define its priority index 
        const order = ['low', 'normal', 'high'];
        const current = email.priority ?? 'normal';
        const currentIndex = order.indexOf(current);

        // Define next priority index
        const nextPriority = order[(currentIndex + 1) % order.length];

        // Set next priority and change source to user
        set({
            emails: emails.map(e =>
                e.id === id
                ? {...e, priority: nextPriority, priority_src: 'user'}
                : e
            )
        });

        // Update in db
        const {error} = await supabase
            .from('emails')
            .update({
                priority: nextPriority,
                priority_src: 'user'
            })
            .eq('id', id)

        // Rollback on failure
        if (error) {
            console.log('Priority update failed.', error);
            set({emails});
        }
    },

    /**
     * Draft management
     */
    saveDraft: async (data) => {
        
        const {data: sessionData} = await supabase.auth.getSession()
        if (!sessionData.session) return

        // Empty drafts prevented 
        if (!data.subject && !data.body && !data.receiver_id) return

        // Insert email to drafts folder
        const {data: rows, error} = await supabase
            .from('emails')
            .insert([{        
                sender_id: sessionData.session.user.id,
                receiver_id: data.receiver_id,
                reply_to: data.reply_to || null,

                subject: data.subject || '(No Subject)',
                body: data.body || '',

                folder: 'drafts',
                is_read: true,

                // Default priority depends on API classification
                priority: 'normal',
                priority_src: 'rules',
        }])

        if (error) {
            console.error('Send email failed:', error)
            return 
        }

        get().loadEmails()
    },

    /**
     * Send an existing draft
     */
    sendDraft: async (draftId, receiverId, subject, body) => {
        
        const {data: sessionData} = await supabase.auth.getSession()
        if (!sessionData.session) return

        // Move draft mail to inbox
        const {error} = await supabase
            .from('emails')
            .update({
                receiver_id: receiverId,
                subject,
                body,
                folder: 'inbox',
                is_read: false,
                priority: 'normal',
                priority_src: 'rules',
                created_at: new Date().toISOString(),
            })
            .eq('id', draftId)

        if (error) {
            console.error('Send email failed:', error)
            return 
        }

        get().loadEmails()
    },

    /**
     * UI state
     */
    // UI state
    showComposer: false,
    setShowComposer: (value) => set({showComposer: value}),
}))