'use client';

import AppShell from "@/shells/appShell";
import useStore from "@/store/useStore";
import { motion, AnimatePresence } from "framer-motion";
import { useEffect, useState } from "react";
import { useEmailStore } from "@/store/emailStore";
import EmailReader from "@/components/emails/emailReader";
import EmailSend from "@/components/emails/emailSend";
import BreakPopup from "@/components/breakPopup";

import { ICONS } from "@/lib/assets";
import { supabase } from "@/lib/supabaseClient";
import { useRouter } from "next/navigation";

// priority helper
const getPriority = (p) => p ?? 'normal';

export default function EmailsPage () {

    const router = useRouter();

    const {loadEmails, cyclePriority, classifyMissingEmails, emails, showEmails, setShowEmails, toggleStar, setSelectedEmail, selectedEmail, markAsRead, readEmailCount, setReadEmailCount, selectedIds, toggleSelect, clearSelection, selectAllVisible, markManyRead, archiveMany, unarchiveMany, deleteMany} = useEmailStore();

    const {emotionValue, focusMode, setFocusMode, priorityMode, sdkActive, setCalmMode, setScreen, theme, setTheme, setExpandedRight, setExpandedSecondary} = useStore();

    const [searchQuery, setSearchQuery] = useState([]);
    const [searchResults, setSearchResults] = useState('');
    const [filtered, setFiltered] = useState([]);
    const [showComposer, setShowComposer] = useState(false);

    const easeTransition = {
        type: 'spring',
        stiffness: 180,
        damping: 26,
        mass: 0.9,
    };

    // session init
    useEffect(() => {
        const init = async () => {
            
            const {data} = await supabase.auth.getSession();

            if (!data.session) {
                router.push('/login');
                return;
            }

            await loadEmails();
            await classifyMissingEmails();
        }
        init();
    }, []);

    // search
    useEffect(() => {

        if (searchQuery.length < 1) {
            setSearchResults([]);
            return;
        }
        
        const q = searchQuery.toLowerCase();
            
        const matches = emails.filter(e => (
            e.subject?.toLowerCase().includes(q) ||
            e.body?.toLowerCase().includes(q) ||
            e.from_name.toLowerCase().includes(q) ||
            e.from_email.toLowerCase().includes(q) ||
            e.priority.toLowerCase().includes(q)
        ));

        setSearchResults(matches.slice(0, 12));
    }, [searchQuery, emails])

    // theme init
    useEffect(() => {
        const darkModeEnabled = document.documentElement.classList.contains('dark');
        setTheme(darkModeEnabled ? 'dark' : 'light');
    }, []);

    // focus mode hysteresis
    useEffect(() => {
        if (emotionValue > 69 && !focusMode) {
            setFocusMode(true);
            setExpandedRight(false);
            setExpandedSecondary(false);
        }
        else if (emotionValue < 40 && focusMode) {
            setFocusMode(false);
            setExpandedSecondary(true);
        }
    }, [emotionValue]);

    // main filter + sorting pipeline
    useEffect(() => {
        
        // calm mode logic
        if (emotionValue > 85 && sdkActive) setCalmMode(true);

        let results = [...emails];

        // category filtering
        if(showEmails === 'inbox') {
            results = results.filter(e => e.folder === 'inbox' && e.isReceiver);
        }
        else if(showEmails === 'drafts') {
            results = results.filter(e => e.folder === 'drafts' && e.isSender);
        }
        else if(showEmails === 'archive') {
            results = results.filter(e => e.folder === 'archive' && e.isReceiver);
        }
        else if(showEmails === 'sent') {
            results = results.filter(e => (e.folder !== 'drafts' && e.isSender));
        }
        else if(showEmails === 'starred') {
            results = results.filter(e => e.starred && e.isReceiver);
        }
        else if(showEmails === 'priority') {
            results = results.filter(
                e => 
                    e.priority === 'high' && 
                    e.folder != 'archive' && 
                    e.folder != 'drafts' && 
                    e.isReceiver
            );
        }

        // remove deleted
        if (showEmails !== 'sent') results = results.filter(e => !e.is_delete);
        
        // medium stress: remove low priority only
        if (!focusMode && emotionValue >= 40 && emotionValue <= 70) {
            results = results.filter(e =>
                getPriority(e.priority) !== 'low'
            );
        }

        // sorting
        results = results.sort((a, b) => sortEmails(a, b, focusMode || priorityMode));

        // focus mode limit
        if (focusMode) results = results.slice(0, 5);

        setFiltered(results);
        setScreen('emails');

    }, [emails, showEmails, focusMode, priorityMode, emotionValue]);

    // sort function
    function sortEmails(a, b, prioritySort=false){

        const rank = {
            high: 3, 
            normal: 2, 
            low: 1
        };

        if(prioritySort) {
        
            const pa = rank[getPriority(a.priority)];
            const pb = rank[getPriority(b.priority)];

            if (pa !== pb) return pb - pa;

            if(a.starred && !b.starred) return -1;
            if(b.starred && !a.starred) return 1;
        }

        const timeA = new Date(a.timestamp).getTime();
        const timeB = new Date(b.timestamp).getTime();

        if(timeB !== timeA) return timeB - timeA;

        return a.id.localeCompare(b.id);
    }

    // close search query block on outside click
    useEffect(() => {
        const close = () => setSearchQuery('')
        if (searchQuery) {
            window.addEventListener('click', close)
        }
        return () => {
            window.removeEventListener('click', close)
        }
    }, [searchQuery]);

    // keyboard shortcuts
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

    // date format
    function formatMailDate(timestamp) {
        const date = new Date(timestamp);
        const now = new Date();

        const isThisYear = date.getFullYear() === now.getFullYear();

        const options = {
            day: 'numeric',
            month: 'short',
        }; 

        if (!isThisYear) {
            options.year = 'numeric';
        }

        return date.toLocaleDateString(undefined, options);
    }

    // render
    return (
        <AppShell>
            {/* top row: search bar + compose email button */}
            <div className="flex flex-row justify-between">

                {/* search bar */}
                <div className="relative">

                    {/* search bar input */}
                    <input
                        value={searchQuery}
                        onChange={(e) => {
                            e.stopPropagation()
                            setSearchQuery(e.target.value)
                        }}
                        placeholder="Search mail"
                        className="search-bar"
                    />
                    
                    {/* search bar results */}
                    {searchQuery && searchResults.length > 0 && (
                        <div className="search-bar-results">
                            {searchResults.map(mail => (
                                <motion.div
                                    key={mail.id}
                                    onClick={() => {
                                        setSelectedEmail(mail)
                                        setSearchQuery('')
                                    }}
                                    className="search-bar-results-show"
                                >
                                    <div className="flex flex-row justify-between">
                                        <h6 className="font-semibold">{mail.from_name || mail.from_email}</h6>
                                        <p>{formatMailDate(mail.timestamp)}</p>
                                    </div>
                                    <p className="font-semibold">{mail.subject}</p>
                                    <div className="w-full">
                                        <p className="truncate">{mail.body}</p>
                                    </div>
                                </motion.div>
                            ))}
                        </div>
                    )}
                </div>

                {/* compose email button */}
                <button
                    disabled={showComposer}
                    onClick={() => {
                        setShowComposer(true)
                        setSelectedEmail(null)
                    }}
                    className="new-button"
                >
                    <img
                        src={ICONS[theme].add}
                        className="lg:w-3 aspect-square"
                        alt=""
                        aria-hidden='true'
                    />
                    <h6 className="font-semibold">Compose</h6>
                </button>
            </div>

            {/* batch functions section */}
            {(selectedIds.length > 0 && (!showComposer || !selectedEmail)) && (
                <div className="batch-func">
                    <button 
                        className="batch-func-btn-hover "
                        onClick={() => {
                        if (selectedIds.length === filtered.length) {
                            clearSelection()
                        }
                        else {
                            selectAllVisible(filtered.map(e => e.id))
                        }
                    }}>
                        <input
                            type="checkbox"
                            readOnly
                            checked={selectedIds.length === filtered.length && filtered.length > 0}
                            className="lg:w-[0.85rem] aspect-square accent-blue-500"
                        />
                    </button>

                    {(showEmails !== 'drafts') && ( 
                        <>                       
                            <button 
                                className="batch-func-btn-hover"
                                onClick={() => markManyRead(selectedIds, true)}>
                                <img
                                    src={ICONS[theme].draft}
                                    className="lg:w-[1.1rem] aspect-square"
                                    alt=""
                                    aria-hidden='true'
                                />
                            </button>
                            <button 
                                className="batch-func-btn-hover"
                                onClick={() => markManyRead(selectedIds, false)}>
                                <img
                                    src={ICONS[theme].unread}
                                    className="lg:w-[1.3rem] aspect-square"
                                    alt=""
                                    aria-hidden='true'
                                />
                            </button>
                            
                            {(showEmails !== 'sent' && showEmails !== 'archive') && (
                                <button 
                                    className="batch-func-btn-hover"
                                    onClick={() => archiveMany(selectedIds)}>
                                    <img
                                        src={ICONS[theme].archiveo}
                                        className="lg:w-[1.1rem] aspect-square"
                                        alt=""
                                        aria-hidden='true'
                                    />
                                </button>
                            )}

                            {(showEmails === 'archive') && (
                                <button 
                                    className="batch-func-btn-hover"
                                    onClick={() => unarchiveMany(selectedIds)}>
                                    <img
                                        src={ICONS[theme].unarchive}
                                        className="lg:w-[1.1rem] aspect-square"
                                        alt=""
                                        aria-hidden='true'
                                    />
                                </button>
                            )}
                        </>
                    )}     

                    <button 
                        className="batch-func-btn-hover"
                        onClick={() => deleteMany(selectedIds)}>
                        <img
                            src={ICONS[theme].delete}
                            className="lg:w-[1.05rem] aspect-square"
                            alt=""
                            aria-hidden='true'
                        />
                    </button>
                </div>
            )}

            {/* main section with emails listed */}
            <motion.div 
                layout
                transition={easeTransition}
                className={`main-content grid gap-2`}
                style={{
                    gridTemplateColumns:
                        selectedEmail || showComposer
                            ? "1fr 2.5fr"
                            : "1fr"  
                }}
            >

                {/* left pane: emails */}
                <div>
                    {(!selectedEmail && !showComposer) ? (
                        <motion.div
                            layout={false}
                            className="min-w-0"
                        >
                            {(filtered.length > 0 && selectedIds.length <= 0) && (
                                <div className={`${(showEmails !== 'sent' && showEmails !== 'drafts') ? 'grid grid-cols-[0.1fr_0.1fr_0.8fr_2fr_0.4fr_0.4fr]' : 'grid grid-cols-[0.1fr_0.1fr_0.8fr_2.4fr_0.4fr]'} email-grid`}>
                                        <div /><div />
                                        <p>{showEmails == 'sent' ? 'To' : 'From'}</p>
                                        <p>Subject / Preview</p>
                                        <p className="text-center">Timestamp</p>
                                        {(showEmails !== 'sent' && showEmails !== 'drafts') && (    
                                            <p className="text-center">Priority</p>
                                        )}
                                </div>
                            )}

                            <AnimatePresence mode="popLayout">
                                {filtered.map((mail) => (
                                    <motion.div
                                        layout
                                        key={mail.id}
                                        className={`${(showEmails !== 'sent' && showEmails !== 'drafts') ? 'grid grid-cols-[0.1fr_0.1fr_0.8fr_2fr_0.4fr_0.4fr]' : 'grid grid-cols-[0.1fr_0.1fr_0.8fr_2.4fr_0.4fr]'} border-y-[0.01rem] border-[var(--e-main)] email-grid ${mail.read ? 'bg-[var(--bg)]' : 'bg-[var(--baseAcc-b)]'}
                                        `}
                                    >
                                        <div className="flex items-center justify-center">
                                            <input
                                                type="checkbox"
                                                checked={selectedIds.includes(mail.id)}
                                                onChange={(e) => {
                                                    e.stopPropagation()
                                                    toggleSelect(mail.id)
                                                }}
                                                className="lg:w-[0.85rem] aspect-square accent-blue-500"
                                            />
                                        </div>
                                        
                                        <button
                                            className='flex items-center justify-center lg:text-2xl text-[var(--text-b)]'
                                            onClick={(e) => {
                                                e.stopPropagation();
                                                toggleStar(mail.id);
                                            }}
                                        >
                                            {mail.starred ? '★' : '☆'}
                                        </button>

                                        <h6 className={`${mail.read ? 'font-thin' : 'font-semibold'}`}>
                                        {showEmails == 'sent' ? mail.isReceiver ? 'Me' : mail.to_email : mail.isSender? 'Me' : mail.from_email}</h6>

                                        <div
                                            onClick={() => {
                                                setShowComposer(false)
                                                setSelectedEmail(mail)
                                                markAsRead(mail.id)
                                                setReadEmailCount(readEmailCount+1)
                                            }}
                                            className='cursor-pointer items-center text-left min-w-0'
                                        >
                                            <h6 className={`${mail.read ? 'font-thin' : 'font-semibold'}`}>{mail.subject}</h6>
                                            <p className={`${mail.read ? 'font-thin' : 'font-normal'} truncate`}>{mail.body}</p>
                                        </div>

                                        <p className="text-center">{formatMailDate(mail.timestamp)}</p>

                                        {(showEmails !== 'sent' && showEmails !== 'drafts') && (
                                            <div className="flex items-center justify-center">
                                                <button 
                                                    onClick={(e) => {
                                                        e.stopPropagation()
                                                        cyclePriority(mail.id)
                                                    }}
                                                    className={`priority-tag
                                                    ${mail.priority === 'high' ? 'bg-[var(--priorityHighc)] hover:bg-[var(--priorityHighb)] border-[var(--priorityHigha)] text-[var(--priorityHight)]' :
                                                    mail.priority === 'low' ? 'bg-[var(--priorityLowc)] hover:bg-[var(--priorityLowb)] border-[var(--priorityLowa)] text-[var(--priorityLowt)]'
                                                    : 'bg-[var(--priorityNormalc)] hover:bg-[var(--priorityNormalb)] border-[var(--priorityNormala)] text-[var(--priorityNormalt)]'}
                                                    transform transition-transform duration-300 ease-out hover:scale-105`}
                                                >
                                                        <img
                                                            src={mail.priority === 'high' ? ICONS[theme].redflag :
                                                            mail.priority === 'low' ? ICONS[theme].greyflag : ICONS[theme].yellowflag}
                                                            className="lg:w-3 aspect-square"
                                                        />
                                                        <p className="text-xs text-left">{mail.priority === 'high' ? 'High' : mail.priority === 'low' ? 'Low' : 'Normal'}</p>
                                                </button>
                                            </div>
                                        )}
                                    </motion.div>
                                ))}
                            </AnimatePresence>
                        </motion.div>
                    ) : (
                        <AnimatePresence className="overflow-hidden">
                            {filtered.map((mail) => (
                                <div
                                    key={mail.id}
                                    onClick={() => {
                                        setSelectedEmail(mail)
                                        markAsRead(mail.id)
                                        setReadEmailCount(readEmailCount+1)
                                    }}
                                    className={`border-y-[0.01rem] border-[var(--e-main)] email-grid px-1 ${mail.read ? 'bg-[var(--bg)]' : 'bg-[var(--baseAcc-b)]'}`}
                                >
                                    <div className="flex flex-row justify-between items-center">
                                        <div className="flex flex-row items-center gap-1">
                                            <div className={`${mail.priority === 'high' ? 'bg-[var(--priorityHigha)]' : mail.priority === 'low' ? 'bg-[var(--priorityLowa)]' : 'bg-[var(--priorityNormala)]'} rounded-full w-[0.5rem] h-[0.5rem]`} />
                                            <p className={`${mail.read ? '' : 'font-semibold'}`}>
                                            {showEmails == 'sent' ? mail.isReceiver ? 'Me' : mail.to_email : mail.isSender? 'Me' : mail.from_email}</p>
                                        </div>
                                        <p className="text-center">{formatMailDate(mail.timestamp)}</p>
                                    </div>

                                    <div className="grid grid-cols-[0.1fr_2fr]">
                                        <div />
                                        <div className="truncate">
                                            <p className={`${mail.read ? '' : 'font-semibold'} truncate`}>{mail.subject}</p>
                                            <p className={`${mail.read ? 'font-thin' : 'font-normal'} truncate`}>{mail.body}</p>
                                        </div>
                                    </div>
                                
                                </div>
                            ))}
                        </AnimatePresence>
                    )}
                    
                    <AnimatePresence>
                        {filtered.length === 0 && (
                            <motion.div 
                                key="empty"
                                initial={{opacity:0}}
                                animate={{opacity:1}}
                                exit={{opacity:0}}
                                className="overflow-hidden">
                                <p className="text-center m-4">No emails found.</p>
                            </motion.div>
                        )}
                    </AnimatePresence>
                </div>

                {/* right pane: opened composer/reader */}
                <AnimatePresence mode="popLayout">
                    {(selectedEmail || showComposer) && (
                        <motion.div
                            layout
                            key={showComposer ? 'composer' : 'reader'}
                            initial={{opacity:0}}
                            animate={{opacity:1}}
                            exit={{opacity:0, scale:0.98, position: 'absolute', inset: 0}}
                            transition={easeTransition}
                            className="min-w-0 min-h-0 h-full flex flex-col overflow-hidden"
                        >
                            {showComposer ? <EmailSend onClose={() => setShowComposer(false)}/> : <EmailReader />}
                        </motion.div>
                    )}
                </AnimatePresence>
            </motion.div>
        </AppShell>
    );
}