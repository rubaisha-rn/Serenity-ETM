'use client';

import AppShell from "@/shells/appShell";
import ThinFooter from "@/components/footers/thinFooter";
import useStore from "@/store/useStore";
import { motion, AnimatePresence } from "framer-motion";
import { useEffect, useState } from "react";
import { useEmailStore } from "@/store/emailStore";
import EmailReader from "@/components/emails/emailReader";
import EmailSend from "@/components/emails/emailSend";
import BreakPopup from "@/components/breakPopup";
import CalmOverlay from "@/components/calmOverlay";
import ModeBanner from "@/components/modeBanner";

import { supabase } from "@/lib/supabaseClient";
import { useRouter } from "next/navigation";

export default function EmailsPage () {

    const router = useRouter()
    const {loadEmails, cyclePriority, classifyMissingEmails, emails, showEmails, toggleStar, setSelectedEmail, markAsRead, moveToFolder, readEmailCount, setReadEmailCount, selectedIds, toggleSelect, clearSelection, selectAllVisible, markManyRead, archiveMany, deleteMany} = useEmailStore();

    const [searchQuery, setSearchQuery] = useState([])
    const [searchResults, setSearchResults] = useState('')

    useEffect(() => {
        const init = async () => {
            const {data} = await supabase.auth.getSession()

            if (!data.session) {
                router.push('/login')
                return
            }

            await loadEmails()
            await classifyMissingEmails()
        }

        init()
    }, [])

    useEffect(() => {

        if (searchQuery.length < 1) {
            setSearchResults([])
            return
        }
        
        const q = searchQuery.toLowerCase()
            
        const matches = emails.filter(e => (
            e.subject?.toLowerCase().includes(q) ||
            e.body?.toLowerCase().includes(q) ||
            e.from_name.toLowerCase().includes(q) ||
            e.from_email.toLowerCase().includes(q) ||
            e.priority.toLowerCase().includes(q)
        ))

        setSearchResults(matches.slice(0, 12))
    }, [searchQuery, emails])

    const {emotionValue, focusMode, setFocusMode, priorityMode, expandedSecondary, expandedMain, sdkActive, calmMode, setCalmMode, setScreen, setTheme} = useStore();

    const mainWidth = expandedMain ? 220 : 40;
    const secondaryWidth = expandedSecondary ? 200 : 40;
    const contentMargin = mainWidth + secondaryWidth;

    useEffect(() => {
        const darkModeEnabled = document.documentElement.classList.contains('dark');
        setTheme(darkModeEnabled ? 'dark' : 'light');
    }, []);

    const [filtered, setFiltered] = useState([]);

    useEffect(() => {
        
        let results = emails;

        if (emotionValue > 70) {
            setFocusMode(true);
            results = results
                .filter(e => e.priority === 'high')
                .slice(0,5);
        } 
        else {

            if(priorityMode) {
                results = [...results].sort((a,b) => sortEmails(a, b, priorityMode));
            }

            if (emotionValue >=50 && emotionValue <=70) {
                results = results.filter((e) => e.priority !== 'normal');
            }

            if (focusMode) {
                results = results
                    .filter((e) => e.priority === 'high')
                    .slice(0,5);
            }

            if(showEmails === 'inbox') {
                results = results.filter(e => e.folder === 'inbox' || (e.isSender && e.isReceiver));
            }
            else if(showEmails === 'drafts') {
                results = results.filter(e => e.folder === 'drafts');
            }
            else if(showEmails === 'archive') {
                results = results.filter(e => e.folder === 'archive');
            }
            else if(showEmails === 'sent') {
                results = results.filter(e => e.folder === 'sent');
            }
            else if(showEmails === 'starred') {
                results = results.filter(e => e.starred);
            }
            else if(showEmails === 'priority') {
                results = results.filter(e => e.priority === 'high' && e.folder != 'archive' && e.folder != 'drafts');
            }
        }

        results = [...results].sort((a, b) => sortEmails(a, b, priorityMode));
        setFiltered(results);
        setScreen('emails');

        if(emotionValue > 85 && sdkActive) setCalmMode(true);

    }, [emails, showEmails, focusMode, priorityMode, emotionValue]);

    const [showComposer, setShowComposer] = useState(false)

    useEffect(() => {
        const close = () => setSearchQuery('')

        if (searchQuery) {
            window.addEventListener('click', close)
        }

        return () => {
            window.removeEventListener('click', close)
        }
    }, [searchQuery])

    return (
        <div className="bg-[var(--cardA-main)] relative h-screen">

            <ModeBanner mode={focusMode ? 'focus' : priorityMode ? 'priority' : null} />

            {readEmailCount >= 5 && emotionValue >= 70 && (
                <BreakPopup
                    scenario= 'emails'
                    onAcknowledge={() => setReadEmailCount(0)}
                />
            )}

            <AnimatePresence>
                {calmMode && (
                    <motion.div
                        key='calm-overlay-wrapper'
                        initial={{opacity: 0}}
                        animate={{opacity: 1}}
                        exit={{opacity: 0}}
                        transition={{ duration: 0.4, ease: 'easeInOut'}}
                        className="fixed inset-0 backdrop-blur-md z-[9999] pointer-events-auto"
                    >
                        <div className="absolute inset-0 pointer-events-none">
                            <CalmOverlay />
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>
            
            <AppShell>
                
                <motion.div className='space y-3 transition-all duration-300 mr-10'
                    initial='hidden'
                    animate='visible'
                    variants={{
                        hidden: {},
                        visible: {
                            transition: {
                                staggerChildren: 0.05,
                            },
                        },
                    }}
                    style={{marginLeft: contentMargin}}
                >
                    <div className="relative">
                        <input
                            value={searchQuery}
                            onChange={(e) => {
                                e.stopPropagation()
                                setSearchQuery(e.target.value)
                            }}
                            placeholder="Search mail, sender, priority..."
                            className="flex-1 border-2 border-[var(--a-main)] bg-[var(--blankCard-main)] text-sm px-4 py-1.5 rounded-lg text-[var(--text-c)] outline-none"
                        />

                        {searchQuery && searchResults.length > 0 && (
                            <div className="absolute top-full mt-2 w-full bg-[var(--blankCard-main)] shadow-xl rounded-lg z-50 max-h-[400px] overflow-auto">
                                {searchResults.map(mail => (
                                    <div
                                        key={mail.id}
                                        onClick={() => {
                                            setSelectedEmail(mail)
                                            setSearchQuery('')
                                        }}
                                        className="p-3 border-b hover:bg-[var(--cardB-main)] cursor-pointer"
                                    >
                                        <p className="text-sm font-semibold">
                                            {mail.subject}
                                        </p>
                                        <p className="text-sm opacity-70">
                                            {mail.from_name || mail.from_email}
                                        </p>
                                        <p className="text-xs">
                                            {mail.preview}
                                        </p>
                                    </div>
                                ))}
                            </div>
                        )}
                    </div>

                    <button 
                        onClick={() => setShowComposer(!showComposer)}
                    >
                        Compose Button
                    </button>

                    {showComposer && (
                        <EmailSend onClose={() => setShowComposer(false)} />
                    )}

                    {selectedIds.length > 0 && (
                        <div className="flex gap-3 mb-2 p-2 bg-[var-(--blankCard-main)] rounded shadow">
                            <button onClick={() => markManyRead(selectedIds, true)}>
                                Mark Read
                            </button>
                            <button onClick={() => markManyRead(selectedIds, false)}>
                                Mark Unread
                            </button>
                            <button onClick={() => archiveMany(selectedIds)}>
                                Archive
                            </button>
                            <button onClick={() => deleteMany(selectedIds)}>
                                Delete
                            </button>
                            <button onClick={() => {
                                if (selectedIds.length === filtered.length) {
                                    clearSelection()
                                }
                                else {
                                    selectAllVisible(filtered.map(e => e.id))
                                }
                            }}>
                                {
                                    selectedIds.length === filtered.length 
                                    ? 'Unselect All'
                                    : 'Select All'
                                }
                            </button>
                        </div>
                    )}

                    <div className="w-full flex-1 p-2 mt-4 bg-[var(--cardB-main)] relative rounded-lg">

                        <div className="grid grid-cols-[0.05fr_0.05fr_0.05fr] gap-4 text-left pl-40">
                            <div>
                                <p className="text-xs">{showEmails == 'sent' ? 'To/Timestamp' : 'From/Timestamp'}</p>
                            </div>
                            <div>
                                <p className="text-xs">Subject/Body</p>
                            </div>
                            <div>
                                <p className="text-xs">Priority</p>
                            </div>
                        </div>

                        <AnimatePresence>
                            {filtered.map((mail) => (
                                <motion.div
                                    key={mail.id}
                                    layout
                                    layoutTransition={{type: 'spring', stiffness: 500, damping: 40}}
                                    initial={{opacity: 0, y:10}}
                                    animate={{opacity: 1, y: 0,}}
                                    transition={{duration: 0.3}}
                                    className={`p-1.5 shadow grid grid-cols-[0.05fr_0.05fr_0.05fr_0.05fr_0.05fr_2.5fr_0.25fr] gap-4 mb-1 items-center text-left rounded-sm ${mail.read ? 'bg-[var(--cardB-main)]' : 'bg-[var(--blankCard-main)]'}`}
                                >
                                    <div>
                                        <input
                                            type="checkbox"
                                            checked={selectedIds.includes(mail.id)}
                                            onChange={(e) => {
                                                e.stopPropagation()
                                                toggleSelect(mail.id)
                                            }}
                                            className="w-4 h-4"
                                        />
                                    </div>
                                    
                                    <div>
                                        <button
                                            className={`px-1 py-0.5 text-2xl rounded-md`}
                                            onClick={(e) => {
                                                e.stopPropagation();
                                                toggleStar(mail.id);
                                            }}
                                        >
                                            {mail.starred ? '★' : '☆'}
                                        </button>
                                    </div>

                                    <div>
                                        <button
                                            className={`px-1 py-0.5 text-md rounded-md`}
                                            onClick={(e) => {
                                                e.stopPropagation();
                                                markAsRead(mail.id, false);
                                            }}
                                        >
                                            R
                                        </button>
                                    </div>

                                    <div>
                                        <button
                                            className={`px-1 py-0.5 text-md rounded-md`}
                                            onClick={(e) => {
                                                e.stopPropagation();
                                                moveToFolder(mail.id, mail.folder != 'archive' ? 'archive' : 'inbox');
                                            }}
                                            disabled={!mail.isReceiver || mail.folder === 'sent' || mail.folder === 'drafts'}
                                        >
                                            A
                                        </button>
                                    </div>

                                    <div>
                                        <button
                                            className={`px-1 py-0.5 text-md rounded-md`}
                                            onClick={(e) => {
                                                e.stopPropagation();
                                                moveToFolder(mail.id, 'delete');
                                            }}
                                            disabled={!mail.isReceiver || mail.folder === 'sent'}
                                        >
                                            D
                                        </button>
                                    </div>

                                    <motion.div
                                        onClick={() => {
                                            setSelectedEmail(mail)
                                            markAsRead(mail.id)
                                            setReadEmailCount(readEmailCount+1)
                                        }}
                                        className='cursor-pointer grid grid-cols-[1fr_2fr] gap-4 mb-1 items-center text-left rounded-sm'
                                    >
                                        <div>
                                            <p className="text-sm font-semibold text-[var(--text-b)]">
                                                {showEmails == 'sent' ? mail.isReceiver ? 'Me' : mail.to_email : mail.isSender? 'Me' : mail.from_email}</p>
                                            <p className="text-xs text-[var(--text-c)]">{new Date(mail.timestamp).toLocaleString()}</p>
                                        </div>

                                        <div>
                                            <p className="text-sm font-semibold text-[var(--text-a)]">{mail.subject}</p>
                                            <p className="text-xs text-[var(--text-c)]">{mail.preview}</p>
                                        </div>
                                    </motion.div>

                                    <button 
                                    onClick={(e) => {
                                        e.stopPropagation()
                                        cyclePriority(mail.id)
                                    }}
                                    disabled={!mail.isReceiver || mail.folder === 'sent'}
                                    className={`rounded-sm text-[var(--text-b)] py-0.5 px-4 text-center
                                        ${mail.priority === 'high' ? 'bg-[var(--dangerL)] px-6' : ''}
                                        ${mail.priority === 'normal' ? 'bg-[var(--warningL)]' : ''}`}>
                                        <p className="text-sm">{mail.priority}</p>
                                        {/* priority src */}
                                        <span className="text-[10px] opacity-70 block">
                                            {mail.priority_src === 'ai' ? 'AI' : 'You'}
                                        </span>
                                    </button>

                                </motion.div>
                            ))}

                            {filtered.length === 0 && (
                                <p className="text-[var(--text-b)] text-sm">No emails found.</p>
                            )}
                        </AnimatePresence>
                    </div>
                </motion.div>
            </AppShell>

            <EmailReader/>

            <ThinFooter />

        </div>
    );
}

export function sortEmails(a, b, priorityMode=false){
    if(priorityMode) {
        if(a.priority === 'high' && b.priority !== 'high') return -1; // sort by priority
        if(b.priority === 'high' && a.priority !== 'high') return 1;

        if(a.starred && !b.starred) return -1; // sort by starred status
        if(b.starred && !a.starred) return 1;
    }

    const timeA = new Date(a.timestamp).getTime(); // sort by timestamps
    const timeB = new Date(b.timestamp).getTime();

    if(timeB !== timeA) return timeB - timeA;

    return a.id.localeCompare(b.id);
}