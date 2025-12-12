import { create } from "zustand";

export const useEmailStore = create((set) => ({
    emails: [
        {
            id: '1',
            from: 'university@example.com',
            to: 'me@example.com',
            subject: 'Final Project Submission',
            body: 'Remember to submit your CM3070 final project before the deadline.',
            starred: false,
            priority: 'high',
            folder: 'inbox',
            read: false,
            timestamp: '2025-01-12T18:38:35.124Z',
        },
        {
            id: '2',
            from: 'boss@example.com',
            to: 'me@example.com',
            subject: 'Urgent: Presentation tomorrow',
            body: 'Make sure your slides are ready for the meeting tomorrow morning.',
            starred: true,
            priority: 'high',
            folder: 'inbox',
            read: false,
            timestamp: '2025-01-12T23:38:59.124Z',
        },
        {
            id: '3',
            from: 'boss@example.com',
            to: 'me@example.com',
            subject: 'Urgent: Presentation tomorrow',
            body: 'Make sure your slides are ready for the meeting tomorrow morning.',
            starred: true,
            priority: 'normal',
            folder: 'inbox',
            read: false,
            timestamp: '2025-01-12T23:38:59.124Z',
        },
        {
            id: '4',
            from: 'boss@example.com',
            to: 'me@example.com',
            subject: 'Archive test',
            body: 'Make sure your slides are ready for the meeting tomorrow morning.',
            starred: true,
            priority: 'normal',
            folder: 'archive',
            read: false,
            timestamp: '2025-01-12T23:38:59.124Z',
        },
        {
            id: '5',
            from: 'me@example.com',
            to: 'boss@example.com',
            subject: 'Sent test',
            body: 'Make sure your slides are ready for the meeting tomorrow morning.',
            starred: true,
            priority: 'normal',
            folder: 'sent',
            read: false,
            timestamp: '2025-01-12T23:38:59.124Z',
        },
        {
            id: '6',
            from: 'me@example.com',
            to: 'boss@example.com',
            subject: 'Drafts test',
            body: 'Make sure your slides are ready for the meeting tomorrow morning.',
            starred: true,
            priority: 'normal',
            folder: 'drafts',
            read: false,
            timestamp: '2025-01-12T23:38:59.124Z',
        },
    ],

    selectedEmail: null,
    setSelectedEmail: (email) => set({selectedEmail: email}),

    moveToFolder: (id, folder) => 
        set((state) => ({
            emails: state.emails.map((e) => 
                e.id === id ? {...e, folder} : e    
            ),
        })),

    toggleStar: (id) => 
        set((state) => ({
            emails: state.emails.map((e) =>
                e.id === id ? {...e, starred: !e.starred} : e
            ),
        })),

    markAsRead: (id) =>
        set((state => ({
            emails: state.emails.map((e) => 
                e.id === id ? {...e, read: true} : e
            ),
        }))),

    showEmails: 'inbox',
    setShowEmails: (folder) => set({showEmails: folder}),

    sendEmail: (data) => 
        set((state) => ({
            emails: [
                ...state.emails,
                {
                    id: crypto.randomUUID(),
                    ...data,
                    date: new Date().toISOString().split('T')[0],
                    read: true,
                    folder: 'sent',
                },
            ],
        })),
}))