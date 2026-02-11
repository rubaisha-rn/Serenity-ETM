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

import { ICONS } from "@/lib/assets";
import { supabase } from "@/lib/supabaseClient";
import { useRouter } from "next/navigation";

export default function EmailsPage () {

    const router = useRouter();

    const {loadEmails, cyclePriority, classifyMissingEmails, emails, showEmails, setShowEmails, toggleStar, setSelectedEmail, markAsRead, moveToFolder, readEmailCount, setReadEmailCount, selectedIds, toggleSelect, clearSelection, selectAllVisible, markManyRead, archiveMany, deleteMany} = useEmailStore();

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

    const {emotionValue, focusMode, setFocusMode, priorityMode, expandedSecondary, expandedRight, sdkActive, calmMode, setCalmMode, setScreen, theme, setTheme} = useStore();

    const secondaryWidth = expandedSecondary ? 210 : 54;
    const contentMarginLeft = 38 + secondaryWidth;

    const contentMarginRight = expandedRight ? 205 : 38;

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
    }, [searchQuery]);

    useEffect(() => {
        const handleKeyDown = (e) => {
            const tag = e.target.tagName;
                if (tag === 'INPUT' || tag === 'TEXTAREA') return;
                
                switch (e.key.toLowerCase()) {
                    case '1':
                        setShowEmails('inbox')
                        break;
                    
                    case '2':
                        setShowEmails('starred')
                        break;
                    
                    case '3':
                        setShowEmails('priority')
                        break;

                    case '4':
                        setShowEmails('sent')
                        break;
                    
                    case '5':
                        setShowEmails('drafts')
                        break;
                    
                    case '6':
                        setShowEmails('archive')
                        break;
                    
                    default:
                        break;
                }
            };

        window.addEventListener('keydown', handleKeyDown);
        return () => window.removeEventListener('keydown', handleKeyDown);
    }, []);

    return (
        <div className="relative h-screen">

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
                
            <div className="bg-[var(--bg)]">
                
                <AppShell>
                    <motion.div 
                        className='transition-all duration-300 mr-10 p-2 flex flex-col'
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
                        style={{marginLeft: contentMarginLeft, marginRight: contentMarginRight}}
                    >
                        <div className="flex flex-row justify-between">
                            
                            {/* search bar */}
                            <div className="relative">
                                <input
                                    value={searchQuery}
                                    onChange={(e) => {
                                        e.stopPropagation()
                                        setSearchQuery(e.target.value)
                                    }}
                                    placeholder="Search mail"
                                    className="flex-1 border-[0.1rem] border-[var(--baseAcc-e)] bg-[var(--baseAcc-g)] text-sm px-4 py-1 rounded-md text-[var(--text-a)] outline-none w-[50vw] shadow
                                    focus:outline-none
                                    focus-visible:ring-2
                                    focus-visible:ring-offset-2
                                    focus-visible:ring-blue-500"
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

                            {/* compose email button */}
                            <button 
                                onClick={() => setShowComposer(!showComposer)}
                                className="bg-[var(--b-main)] border-[0.1rem] border-[var(--c-main)] flex flex-row gap-2 items-center justify-center rounded-md hover:bg-[var(--c-main)] text-[var(--text-d)] text-sm h-8 px-3 pl-2 shadow-lg font-Roboto
                                focus:outline-none
                                focus-visible:ring-2
                                focus-visible:ring-offset-2
                                focus-visible:ring-blue-500"
                            >
                                <img
                                    src={ICONS[theme].add}
                                    className="w-3 h-3 shrink-0"
                                    alt=""
                                    aria-hidden='true'
                                />
                                Compose
                            </button>
                        </div>

                        {/* compose email component */}
                        {showComposer && (
                            <EmailSend onClose={() => setShowComposer(false)} />
                        )}

                        <div className="my-2 rounded-md shadow min-h-screen bg-[var(--baseAcc-b)] py-2">
                            
                            {/* batch email functions */}
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

                            {/* emails */}
                            <div className="w-full flex-1 bg-none">

                                <div className="justify-start px-6 grid grid-cols-[0.05fr_0.05fr_3.2fr_0.35fr] gap-4 text-left">
                                    <div />
                                    <div />
                                    <div className="grid grid-cols-[1fr_2fr] gap-4">
                                        <div>
                                            <p className="group-label">{showEmails == 'sent' ? 'To/Timestamp' : 'From/Timestamp'}</p>
                                        </div>
                                        <div>
                                            <p className="group-label">Subject/Body</p>
                                        </div>
                                    </div>
                                    {(showEmails !== 'sent' && showEmails !== 'drafts') && (    
                                        <div>
                                            <p className="group-label">Priority</p>
                                        </div>
                                    )}
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
                                            className={`py-0.5 px-2 grid grid-cols-[0.05fr_0.05fr_3.2fr_0.35fr] border-t-[0.05rem] border-b-[0.05rem] border-[var(--baseAcc-f)] gap-4 items-center justify-start ${mail.read ? 'bg-[var(--bg)]' : ''}`}
                                        >
                                            <div>
                                                <input
                                                    type="checkbox"
                                                    checked={selectedIds.includes(mail.id)}
                                                    onChange={(e) => {
                                                        e.stopPropagation()
                                                        toggleSelect(mail.id)
                                                    }}
                                                    className="w-3.5 h-3.5"
                                                />
                                            </div>
                                            
                                            <div>
                                                <button
                                                    className={`px-1 pb-0.5 text-2xl text-[var(--text-c)] rounded-md`}
                                                    onClick={(e) => {
                                                        e.stopPropagation();
                                                        toggleStar(mail.id);
                                                    }}
                                                >
                                                    {mail.starred ? '★' : '☆'}
                                                </button>
                                            </div>

                                            <motion.div
                                                onClick={() => {
                                                    setSelectedEmail(mail)
                                                    markAsRead(mail.id)
                                                    setReadEmailCount(readEmailCount+1)
                                                }}
                                                className='cursor-pointer grid grid-cols-[1fr_2fr] gap-4  items-center text-left rounded-sm'
                                            >
                                                <div>
                                                    <p className="font-Sans text-sm font-semibold text-[var(--text-b)]">
                                                        {showEmails == 'sent' ? mail.isReceiver ? 'Me' : mail.to_email : mail.isSender? 'Me' : mail.from_email}</p>
                                                    <p className="group-label">{new Date(mail.timestamp).toLocaleString()}</p>
                                                </div>

                                                <div>
                                                    <p className="font-Sans text-sm font-semibold text-[var(--text-a)]">{mail.subject}</p>
                                                    <p className="text-xs text-[var(--text-c)]">{mail.preview}</p>
                                                </div>
                                            </motion.div>

                                            {(showEmails !== 'sent' && showEmails !== 'drafts') && (
                                                <button 
                                                    onClick={(e) => {
                                                        e.stopPropagation()
                                                        cyclePriority(mail.id)
                                                    }}
                                                    className={`rounded-sm p-0.5 w-full flex flex-row justify-center items-center gap-1 border-[0.05rem] border-[var(--baseAcc-f)]
                                                    ${mail.priority === 'high' ? 'bg-[var(--dangerL)] text-[var(--danger)]' : 'bg-[var(--warningL)] text-[var(--warning)]'}`}
                                                >
                                                        <img
                                                            src={mail.priority === 'high' ? ICONS[theme].redflag : ICONS[theme].yellowflag}
                                                            className="w-3 h-3 shrink-0"
                                                        />
                                                        <p className="text-xs text-left">{mail.priority === 'high' ? 'High' : 'Normal'}</p>
                                                </button>
                                            )}

                                        </motion.div>
                                    ))}

                                    {filtered.length === 0 && (
                                        <p className="text-[var(--text-b)] text-sm">No emails found.</p>
                                    )}

                                </AnimatePresence>
                            </div>
                        </div>
                    </motion.div>
                </AppShell>
            </div>

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