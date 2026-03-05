/**
 * Email page.
 * 
 * Loads and classifies user emails, filters emails by categories, provides search functionality, handles batch operations, adapt email visibility based on emotional stress levels, provides creating and sending emails.
 */

'use client';

import AppShell from "@/shells/appShell";
import useStore from "@/store/useStore";
import { motion, AnimatePresence } from "framer-motion";
import { useEffect, useState } from "react";
import { useEmailStore } from "@/store/emailStore";
import EmailReader from "@/components/emails/emailReader";
import EmailSend from "@/components/emails/emailSend";
import formatDate from "@/components/formatDate";
import { ICONS } from "@/lib/assets";
import { supabase } from "@/lib/supabaseClient";
import { useRouter } from "next/navigation";

// Ensures emails without priorities default to 'normal'
const getPriority = (p) => p ?? 'normal';

export default function EmailsPage () {

    // Router for navigation
    const router = useRouter();

    // Global state values
    const {loadEmails, cyclePriority, classifyMissingEmails, emails, showEmails, setShowEmails, toggleStar, setSelectedEmail, selectedEmail, markAsRead, readEmailCount, setReadEmailCount, selectedIds, toggleSelect, clearSelection, selectAllVisible, markManyRead, archiveMany, unarchiveMany, deleteMany, showComposer, setShowComposer} = useEmailStore();

    const {emotionValue, focusMode, priorityMode, setScreen, setTheme} = useStore();
    const theme = useStore((s) => s.theme);

    // Search state
    const [searchQuery, setSearchQuery] = useState([]);
    const [searchResults, setSearchResults] = useState('');

    // Filtered emails currently being displayed
    const [filtered, setFiltered] = useState([]);

    // Transition
    const easeTransition = {
        duration: 0.65,
        ease: [0.16, 1, 0.3, 1]
    };

    // Session init
    useEffect(() => {
        
        const init = async () => {
        
            const {data} = await supabase.auth.getSession()

            // If no user session, route back to sign-in
            if (!data.session) {
                router.push('/signin')
                return
            }

            await loadEmails();
            await classifyMissingEmails();
        }

        init();
    
    }, []);

    // Search functionality
    useEffect(() => {

        if (searchQuery.length < 1) {
            setSearchResults([]);
            return;
        }
        
        const q = searchQuery.toLowerCase();
        
        // Check against all email details
        const matches = emails.filter(e => (
            e.subject?.toLowerCase().includes(q) ||
            e.body?.toLowerCase().includes(q) ||
            e.from_name.toLowerCase().includes(q) ||
            e.from_email.toLowerCase().includes(q) ||
            e.priority.toLowerCase().includes(q)
        ));

        // Only display top 12 results maximum
        setSearchResults(matches.slice(0, 12));

    }, [searchQuery, emails])

    // Close search query block on outside click
    useEffect(() => {

        const close = () => setSearchQuery('')
        
        if (searchQuery) {
            window.addEventListener('click', close)
        }
        return () => {
            window.removeEventListener('click', close)
        }
    
    }, [searchQuery]);

     /**
     * Email filtering logic
     * 
     * Applies:
        * Category filtering
        * Emotional stress filtering
        * Sorting rules
     */
    useEffect(() => {
        
        let results = [...emails];

        // Category filtering
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

        // Remove deleted
        if (showEmails !== 'sent') results = results.filter(e => !e.is_delete);
        
        // Stress-aware filtering: medium stress: remove low priority only
        if (!focusMode && emotionValue >= 40 && emotionValue <= 70) {
            results = results.filter(e =>
                getPriority(e.priority) !== 'low'
            );
        }

        // Sorting
        results = results.sort((a, b) => sortEmails(a, b, focusMode || priorityMode));

        // Focus mode limits emails shown
        if (focusMode) results = results.slice(0, 5);

        setFiltered(results);
        setScreen('emails');

    }, [emails, showEmails, focusMode, priorityMode, emotionValue]);

    // Sort function
    function sortEmails(a, b, prioritySort=false){

        const rank = {
            high: 3, 
            normal: 2, 
            low: 1
        };

        // Priority sort
        if(prioritySort) {
        
            const pa = rank[getPriority(a.priority)];
            const pb = rank[getPriority(b.priority)];

            if (pa !== pb) return pb - pa;

            if(a.starred && !b.starred) return -1;
            if(b.starred && !a.starred) return 1;
        }

        // Date sort
        const timeA = new Date(a.timestamp).getTime();
        const timeB = new Date(b.timestamp).getTime();

        if(timeB !== timeA) return timeB - timeA;

        return a.id.localeCompare(b.id);
    }

    // Keyboard shortcuts
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

        // Global layout shell
        <AppShell>
            
            {/* Top row: search bar + compose email button */}
            <div className="flex flex-row justify-between">

                {/* Search bar */}
                <div className="relative w-full">

                    <input
                        value={searchQuery}
                        onChange={(e) => {
                            e.stopPropagation()
                            setSearchQuery(e.target.value)
                        }}
                        placeholder="Search mail"
                        className="flex-1 border-[var(--f-main)] bg-[var(--baseAcc-b)] text-[var(--text-b)] outline-none shadow items-center search-bar"
                        aria-label="Search emails"
                    />
                    
                    {/* Search bar results */}
                    {searchQuery && searchResults.length > 0 && (
                        <div 
                            role="listbox"
                            aria-label="Search results"
                            className="absolute top-full w-full leading-tight border-[var(--f-main)] bg-[var(--baseAcc-b)] text-[var(--text-b)] shadow z-30 overflow-x-hidden overflow-y-auto search-bar-results"
                        >
                            {searchResults.map(mail => (

                                <motion.div
                                    key={mail.id}
                                    role="option"
                                    tabIndex={0}
                                    aria-label={`Open email from ${mail.from_name || mail.from_email}`}
                                    onClick={() => {
                                        setSelectedEmail(mail)
                                        setSearchQuery('')
                                    }}
                                    onKeyDown={(e) => {
                                        if(e.key === 'Enter' || e.key === ' ') {
                                            e.preventDefault()
                                            setSelectedEmail(mail)
                                            setSearchQuery('')
                                        }
                                    }}
                                    className="flex flex-col m-0.5 border-b border-[var(--f-main)] hover:bg-[var(--f-main)] cursor-pointer search-bar-results-show
                                    focus:outline-none 
                                    focus-visible:ring-2 
                                    focus-visible:ring-blue-500/60 
                                    focus-visible:ring-offset-0 
                                    focus-visible:shadow-[0_0_0_3px_rgba(59,130,246,0.25)]
                                    transition-all duration-150"
                                >
                                    <div className="flex flex-row justify-between font-bold">
                                        <p>{mail.from_name || mail.from_email}</p>
                                        <p>{formatDate(mail.timestamp)}</p>
                                    </div>
                                    <p className="font-semibold">{mail.subject || '(No subject)'}</p>
                                    <p className="w-full truncate">{mail.body || '(No body)'}</p>
                                </motion.div>
                            ))}
                        </div>
                    )}
                </div>

                {/* Compose email button */}
                <button
                    aria-label="Compose new email"
                    disabled={showComposer}
                    onClick={() => {
                        setShowComposer(true)
                        setSelectedEmail(null)
                    }}
                    className="prim-act-btn w-full"
                >
                    <img
                        src={ICONS[theme].add}
                        alt=""
                        aria-hidden='true'
                    />
                    <h6 className="font-semibold">Compose</h6>
                </button>
            </div>

            {/* Batch functions section / toolbar */}
            {(selectedIds.length > 0 && (!showComposer || !selectedEmail)) && (
                <div 
                    aria-label="Batch email actions"
                    role="toolbar"
                    className="flex flex-row batch-func"
                >   
                    {/* Select/unselect multiple items */}
                    <button 
                        aria-label="Select all visible emails"
                        title="Select all"
                        className="opacity-80 hover:opacity-60"
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
                            aria-hidden="true"
                            checked={selectedIds.length === filtered.length && filtered.length > 0}
                            className="
                                aspect-square accent-blue-500 
                                sm:w-[0.65rem]
                                md:w-[0.75rem]
                                lg:w-[0.85rem]
                                xl:w-[0.85rem]
                                2xl:w-[0.95rem]
                            "
                        />
                    </button>

                    {/* Mark as read */}
                    {(showEmails !== 'drafts') && ( 
                        <>                       
                            <button 
                                aria-label="Mark selected emails as read"
                                title="Mark as read"
                                className="opacity-80 hover:opacity-60"
                                onClick={() => markManyRead(selectedIds, true)}>
                                <img
                                    src={ICONS[theme].read}
                                    alt=""
                                    aria-hidden='true'
                                />
                            </button>

                            {/* Mark as unread */}
                            <button 
                                aria-label="Mark selected emails as unread"
                                title="Mark as unread"
                                className="opacity-80 hover:opacity-60"
                                onClick={() => markManyRead(selectedIds, false)}>
                                <img
                                    src={ICONS[theme].unread}
                                    alt=""
                                    aria-hidden='true'
                                />
                            </button>
                            
                            {/* Archive emails */}
                            {(showEmails !== 'sent' && showEmails !== 'archive') && (
                                <button 
                                    aria-label="Archive selected emails"
                                    title="Archive"
                                    className="opacity-80 hover:opacity-60"
                                    onClick={() => archiveMany(selectedIds)}
                                >
                                    <img
                                        src={ICONS[theme].archive}
                                        alt=""
                                        aria-hidden='true'
                                    />
                                </button>
                            )}

                            {/* Unarchive */}
                            {(showEmails === 'archive') && (
                                <button 
                                    aria-label="Unarchive selected emails"
                                    title="Unarchive"
                                    className="opacity-80 hover:opacity-60"
                                    onClick={() => unarchiveMany(selectedIds)}
                                >
                                    <img
                                        src={ICONS[theme].unarchive}
                                        alt=""
                                        aria-hidden='true'
                                    />
                                </button>
                            )}
                        </>
                    )}     

                    {/* Delete emails */}
                    <button 
                        aria-label="Delete selected emails"
                        title="Delete"
                        className="opacity-80 hover:opacity-60"
                        onClick={() => deleteMany(selectedIds)}>
                        <img
                            src={ICONS[theme].delete}
                            alt=""
                            aria-hidden='true'
                        />
                    </button>
                </div>
            )}

            {/* Main section with emails listed. Two pane setup: Email list + Reader / Composer */}
            <motion.div
                aria-label="Email workspace" 
                layout
                transition={easeTransition}
                className="flex flex-col min-h-0 h-full overflow-hidden min-w-0 z-0 grid gap-2"
                animate={{
                    gridTemplateColumns:
                        selectedEmail || showComposer
                            ? "1fr 2.5fr"
                            : "1fr 0fr"  
                }}
            >

                {/* Left pane: emails list */}
                <div role="list" aria-label="Email list" >
                    
                    {/* Table header row */}
                    {(!selectedEmail && !showComposer) ? (
                        
                        <motion.div
                            layout={false}
                            className="min-w-0"
                        >
                            {(filtered.length > 0 && selectedIds.length <= 0) && (
                                <div 
                                    aria-hidden="true"
                                    className={`${(showEmails !== 'sent' && showEmails !== 'drafts') ? 'grid grid-cols-[0.1fr_0.1fr_0.8fr_2fr_0.4fr_0.4fr]' : 'grid grid-cols-[0.1fr_0.1fr_0.8fr_2.4fr_0.4fr]'} justify-start items-center text-left email-grid border-b-[0.005rem] border-[var(--e-main)]`}
                                >
                                    <div />
                                    <div />
                                    
                                    <p>{showEmails == 'sent' ? 'To' : 'From'}</p>
                                    <p>Subject / Preview</p>
                                    <p className="text-center">Timestamp</p>
                                    {(showEmails !== 'sent' && showEmails !== 'drafts') && (    
                                        <p className="text-center">Priority</p>
                                    )}
                                </div>
                            )}

                            {/* Email rows */}
                            <AnimatePresence mode="popLayout">
                                
                                {filtered.map((mail) => (
                                
                                    <motion.div
                                        layout
                                        key={mail.id}
                                        role="listitem"
                                        aria-label={`Email from ${mail.from_email}`}
                                        className={`${(showEmails !== 'sent' && showEmails !== 'drafts') ? 'grid grid-cols-[0.1fr_0.1fr_0.8fr_2fr_0.4fr_0.4fr]' : 'grid grid-cols-[0.1fr_0.1fr_0.8fr_2.4fr_0.4fr]'} border-b-[0.005rem] border-[var(--e-main)] justify-start items-center text-left email-grid ${selectedEmail?.id === mail.id ? 'bg-[var(--f-main)]' : mail.read ? 'bg-[var(--bg)]' : 'bg-[var(--baseAcc-b)]'} hover:bg-[var(--f-main)]
                                        `}
                                        transition={{layout:easeTransition}}   
                                    >
                                        {/* Selected checkbox */}
                                        <div className="flex items-center justify-center">
                                            <input
                                                aria-label="Select email"
                                                type="checkbox"
                                                checked={selectedIds.includes(mail.id)}
                                                onChange={(e) => {
                                                    e.stopPropagation()
                                                    toggleSelect(mail.id)
                                                }}
                                                className="
                                                    aspect-square accent-blue-500
                                                    sm:w-[0.65rem]
                                                    md:w-[0.75rem]
                                                    lg:w-[0.85rem]
                                                    xl:w-[0.85rem]
                                                    2xl:w-[0.95rem]
                                                "
                                            />
                                        </div>
                                        
                                        {/* Star toggle */}
                                        <button
                                            aria-label={mail.starred 
                                                ? 'Unstar email' 
                                                : 'Star email'
                                            }
                                            className='flex items-center justify-center text-[var(--text-b)]'
                                            onClick={(e) => {
                                                e.stopPropagation();
                                                toggleStar(mail.id);
                                            }}
                                        >
                                            <h2 className="font-normal">{mail.starred ? '★' : '☆'}</h2>
                                        </button>

                                        {/* Sender */}
                                        <h6 className={`${mail.read ? 'font-thin' : 'font-semibold'}`}>
                                        {showEmails == 'sent' ? mail.isReceiver ? 'Me' : mail.to_email : mail.isSender? 'Me' : mail.from_email}</h6>
                                    
                                        {/* Clickable email preview */}
                                        <div    
                                            role="button"
                                            tabIndex={0}
                                            onClick={() => {
                                                setShowComposer(false)
                                                setSelectedEmail(mail)
                                                markAsRead(mail.id)
                                                setReadEmailCount(readEmailCount+1)
                                            }}
                                            className='cursor-pointer items-center text-left min-w-0'
                                            onKeyDown={(e) => {
                                                if (e.key === 'Enter' || e.key === ' ') {
                                                    e.preventDefault();
                                                    setShowComposer(false)
                                                    setSelectedEmail(mail)
                                                    markAsRead(mail.id)
                                                    setReadEmailCount(readEmailCount+1)
                                                }
                                            }}
                                        >
                                            <h6 className={`${mail.read ? 'font-thin' : 'font-semibold'}`}>{mail.subject}</h6>
                                            <p className={`${mail.read ? 'font-thin' : 'font-normal'} truncate`}>{mail.body}</p>
                                        </div>

                                        {/* Timestamp */}
                                        <p className="text-center">{formatDate(mail.timestamp)}</p>

                                        {/* Priority control */}
                                        {(showEmails !== 'sent' && showEmails !== 'drafts') && (
                                            <div className="flex items-center justify-center">
                                                <button 
                                                    aria-label="Change email priority"
                                                    onClick={(e) => {
                                                        e.stopPropagation()
                                                        cyclePriority(mail.id)
                                                    }}
                                                    className={`flex flex-row justify-center items-center priority-tag
                                                    ${mail.priority === 'high' ? 'bg-[var(--priorityHighc)] hover:bg-[var(--priorityHighb)] border-[var(--priorityHigha)] text-[var(--priorityHight)]' :
                                                    mail.priority === 'low' ? 'bg-[var(--priorityLowc)] hover:bg-[var(--priorityLowb)] border-[var(--priorityLowa)] text-[var(--priorityLowt)]'
                                                    : 'bg-[var(--priorityNormalc)] hover:bg-[var(--priorityNormalb)] border-[var(--priorityNormala)] text-[var(--priorityNormalt)]'}
                                                    transform transition-transform duration-300 ease-out hover:scale-105`}
                                                >
                                                        <img
                                                            src={mail.priority === 'high' ? ICONS[theme].redflag :
                                                            mail.priority === 'low' ? ICONS[theme].greyflag : ICONS[theme].yellowflag}
                                                            alt="Email priority"
                                                        />
                                                        <p className="lg:text-xs text-left">{mail.priority === 'high' ? 'High' : mail.priority === 'low' ? 'Low' : 'Normal'}</p>
                                                </button>
                                            </div>
                                        )}
                                    </motion.div>
                                ))}
                            </AnimatePresence>
                        </motion.div>
                    ) : (

                        // Email rows in second format, when email composer/reader is open 
                        <AnimatePresence className="overflow-hidden">

                            {filtered.map((mail) => (
                            
                                <motion.div
                                    key={mail.id}
                                    role="listitem"
                                    aria-label={`Email from ${mail.from_email}`}
                                    onClick={() => {
                                        setSelectedEmail(mail)
                                        markAsRead(mail.id)
                                        setReadEmailCount(readEmailCount+1)
                                    }}
                                    className={`border-y-[0.005rem] border-[var(--e-main)] justify-start items-center text-left email-grid px-1 ${selectedEmail?.id === mail.id ? 'bg-[var(--f-main)]' : mail.read ? 'bg-[var(--bg)]' : 'bg-[var(--baseAcc-b)]'} hover:bg-[var(--f-main)]`}
                                    transition={{layout:easeTransition}}
                                >
                                    {/* Email details */}
                                    <div className="flex flex-row justify-between items-center">

                                        <div className="flex flex-row items-center gap-1">
                                            
                                            {/* Small priority indicator */}
                                            <div className={`
                                                ${mail.priority === 'high' ? 'bg-[var(--priorityHigha)]' : mail.priority === 'low' ? 'bg-[var(--priorityLowa)]' : 'bg-[var(--priorityNormala)]'} rounded-full 
                                                sm:w-[0.25rem] sm:h-[0.25rem]
                                                md:w-[0.35rem] md:h-[0.35rem]
                                                lg:w-[0.5rem] lg:h-[0.5rem]
                                                xl:w-[0.5rem] xl:h-[0.5rem]
                                                2xl:w-[0.65rem] 2xl:h-[0.65rem]
                                            `} />
                                        
                                            <p className={`${mail.read ? '' : 'font-semibold'}`}>
                                        
                                            {showEmails == 'sent' ? mail.isReceiver ? 'Me' : mail.to_email : mail.isSender? 'Me' : mail.from_email}</p>
                                        
                                        </div>
                                        <p className="text-center">{formatDate(mail.timestamp)}</p>
                                    
                                    </div>

                                    <div className="grid grid-cols-[0.1fr_2fr]">
                                        <div />
                                        <div className="truncate">
                                            <p className={`${mail.read ? '' : 'font-semibold'} truncate`}>{mail.subject}</p>
                                            <p className={`${mail.read ? 'font-thin' : 'font-normal'} truncate`}>{mail.body}</p>
                                        </div>
                                    </div>
                                </motion.div>
                            ))}
                        </AnimatePresence>
                    )}
                    
                    {/* Empty state */}
                    <AnimatePresence>
                        {filtered.length === 0 && (
                            <motion.div 
                                key="empty"
                                initial={{opacity:0}}
                                animate={{opacity:1}}
                                exit={{opacity:0}}
                                className="overflow-hidden"
                            >
                                <p className="
                                    text-center
                                    sm:m-1
                                    md:m-2
                                    lg:m-4
                                    xl:m-4
                                    2xl:m-4
                                ">
                                    No emails found.
                                </p>
                            </motion.div>
                        )}
                    </AnimatePresence>
                </div>

                {/* Right pane: opened composer / reader */}
                <AnimatePresence mode="popLayout">

                    {(selectedEmail || showComposer) && (
                    
                        <motion.div
                            layout
                            key={showComposer ? 'composer' : 'reader'}
                            initial={{opacity:0, x:80}}
                            animate={{opacity:1, x:0}}
                            exit={{opacity:0, x:80}}
                            transition={easeTransition}
                            className="min-w-0 min-h-0 h-full flex flex-col overflow-hidden shadow-xl"
                            aria-label={
                                showComposer 
                                    ? 'Email composer'
                                    : 'Email reader'
                            }
                        >
                            {showComposer 
                                ? <EmailSend onClose={() => setShowComposer(false)}/> 
                                : <EmailReader />
                            }
                        </motion.div>
                    )}
                </AnimatePresence>
            </motion.div>
        </AppShell>
    );
}