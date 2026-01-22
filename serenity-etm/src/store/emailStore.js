import { create } from "zustand";
import { supabase } from "@/lib/supabaseClient";
import { time } from "framer-motion";

export const useEmailStore = create((set, get) => ({

    selectedIds: [],

    toggleSelect: (id) =>
        set(state => ({
            selectedIds: state.selectedIds.includes(id)
                ? state.selectedIds.filter(x => x !== id)
                : [...state.selectedIds, id]
        })),

    clearSelection: () => set({selectedIds: []}),

    selectAllVisible: (ids) => set({selectedIds: ids}),

    markManyRead: async (ids, read=true) => {
        if (!ids.length) return

        await supabase
            .from('emails')
            .update({is_read: read})
            .in('id', ids)

        get().clearSelection()
        get().loadEmails()
    },

    archiveMany: async (ids) => {
        
        if (!ids.length) return

        await supabase
            .from('emails')
            .update({folder: 'archive'})
            .in('id', ids)

        get().clearSelection()
        get().loadEmails()
    },

    deleteMany: async (ids) => {
   
        if (!ids.length) return

        await supabase
            .from('emails')
            .update({folder: 'delete'})
            .in('id', ids)

        get().clearSelection()
        get().loadEmails()
    },

    classifyMissingEmails: async () => {

        const {data: sessionData} = await supabase.auth.getSession()
        if (!sessionData.session) return

        const emails = get().emails

        const unclassified = emails.filter(
            e => e.priority_src === 'ai'
        )

        for (const email of unclassified) {
            const res = await fetch('/api/classify', {
                method: "POST",
                headers: {'Content-Type': 'application/json'},
                body: JSON.stringify({
                    text: `${email.subject} ${email.body}`
                })
            })

            const result = await res.json()

            await supabase
                .from('emails')
                .update({
                    priority: result.priority
                })
                .eq('id', email.id)
        }

        get().loadEmails()
    },

    loadEmails : async () => {

        const {data: sessionData} = await supabase.auth.getSession()
        if (!sessionData.session) return

        const userId = sessionData.session.user.id

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

        if (!error) {
            const normalised = rows.map(e => {

                const isSender = e.sender_id === userId
                const isReceiver = e.receiver_id === userId

                const senderName = e.sender
                    ? `${e.sender.first_name || ''} ${e.sender.last_name || ''}`.trim()
                    : ''

                const receiverName = e.receiver
                    ? `${e.receiver.first_name || ''} ${e.receiver.last_name || ''}`.trim()
                    : ''

                let folder = e.folder || 'inbox'
                if (e.sender_id === userId && folder != 'drafts') {
                    folder = 'sent'
                }

                return {
                    ...e,

                    from_email: e.sender?.email || '',
                    from_name: senderName,

                    to_email: e.receiver?.email || '',
                    to_name: receiverName,

                    isSender,
                    isReceiver,

                    read: e.read ?? e.is_read,
                    timestamp: e.timestamp || e.created_at,

                    folder,
                    
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

    emails: [],
    selectedEmail: null,
    showEmails: 'inbox',
    readEmailCount: 0,

    setSelectedEmail: (email) => set({selectedEmail: email}),
    setShowEmails: (folder) => set({showEmails: folder}),
    setReadEmailCount: (count) => set({readEmailCount: count}),

    toggleStar: async (id) => {

        const email = get().emails.find(e => e.id === id)

        if (!email) return

        await supabase
            .from('emails')
            .update({starred: !email.starred})
            .eq('id', id)

        get().loadEmails()
    },

    markAsRead: async (id, read=true) => {

        await supabase
            .from('emails')
            .update({is_read: read})
            .eq('id', id)

        get().loadEmails()
    },

    moveToFolder: async (id, newfolder='inbox') => {

        await supabase
            .from('emails')
            .update({ folder: newfolder })
            .eq('id', id)

        get().loadEmails()
    },
    
    sendEmail: async (data) => {

        const {data: sessionData} = await supabase.auth.getSession()
        if (!sessionData.session) return

        const {data: rows, error} = await supabase
            .from('emails')
            .insert([{
                
                ...data,

                sender_id: sessionData.session.user.id,
                receiver_id: data.receiver_id,

                preview: data.body.length > 70 
                    ? data.body.slice(0, 70) + '...'
                    : data.body,

                folder: 'inbox',
                is_read: false,

                priority: 'normal',
                priority_src: 'ai',
            }])

        if (error) {
            console.error('Send email failed:', error)
            return 
        }

        get().loadEmails()
    },

    cyclePriority: async (id) => {
        
        const email = get().emails.find(e => e.id === id)
        if (!email) return

        const order = ['normal', 'high']
        const currentIndex = order.indexOf(email.priority || 'normal')
        const nextPriority = order[(currentIndex+1) % order.length]

        await supabase
            .from('emails')
            .update({
                priority: nextPriority,
                priority_src: 'user'
            })
            .eq('id', id)

        get().loadEmails()
    },

    saveDraft: async (data) => {
        
        const {data: sessionData} = await supabase.auth.getSession()
        if (!sessionData.session) return

        if (!data.subject && !data.body) return

        const {data: rows, error} = await supabase
            .from('emails')
            .insert([{
                
                sender_id: sessionData.session.user.id,
                receiver_id: null,
                reply_to: data.reply_to || null,

                subject: data.subject || '(No Subject)',
                body: data.body || '',

                preview: data.body.length > 70 
                    ? data.body.slice(0, 70) + '...'
                    : data.body,

                folder: 'drafts',
                is_read: true,

                priority: 'normal',
                priority_src: 'ai',
        }])

        if (error) {
            console.error('Send email failed:', error)
            return 
        }

        get().loadEmails()
    },

    sendDraft: async (draftId, receiverId, subject, body) => {
        
        const {data: sessionData} = await supabase.auth.getSession()
        if (!sessionData.session) return

        const preview = body.length > 70
            ? body.slice(0, 70) + '...'
            : body

        const {error} = await supabase
            .from('emails')
            .update({
                receiver_id: receiverId,
                subject,
                preview,
                body,

                folder: 'inbox',
                is_read: false,
                
                priority: 'normal',
                priority_src: 'ai',

                created_at: new Date().toISOString(),
            })
            .eq('id', draftId)

        if (error) {
            console.error('Send email failed:', error)
            return 
        }

        get().loadEmails()
    },

    updateDraft: async (id, subject, body) => {
        await supabase
            .from('emails')
            .update({
                subject,
                body,
                preview: body.slice(0, 70)
            })
            .eq('id', id)

        get().loadEmails()
    }
}))