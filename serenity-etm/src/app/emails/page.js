'use client';

import AppShell from "@/shells/appShell";
import ThinFooter from "@/components/footers/thinFooter";
import useStore from "@/store/useStore";
import { motion, AnimatePresence } from "framer-motion";
import { useEffect, useState } from "react";
import { useEmailStore } from "@/store/emailStore";
import EmailReader from "@/components/emails/emailReader";
import BreakPopup from "@/components/breakPopup";
import CalmOverlay from "@/components/calmOverlay";
import ModeBanner from "@/components/modeBanner";

export default function EmailsPage () {

    const {emails, showEmails, toggleStar, setSelectedEmail, markAsRead, readEmailCount, setReadEmailCount} = useEmailStore();

    const {emotionValue, focusMode, setFocusMode, priorityMode, expandedSecondary, expandedMain, calmMode, setScreen, setTheme} = useStore();

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
                results = results.filter(e => e.folder === 'inbox');
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
                results = results.filter(e => e.priority === 'high');
            }
        }

        results = [...results].sort((a, b) => sortEmails(a, b, priorityMode));
        setFiltered(results);
        setScreen('emails');

    }, [emails, showEmails, focusMode, priorityMode, emotionValue]);

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

                    <div className="flex-1 border-2 border-[var(--a-main)] bg-[var(--blankCard-main)] text-sm px-4 py-1.5 rounded-lg text-[var(--text-c)]">
                        Search Emails
                    </div>

                    <div className="w-full flex-1 p-2 mt-4 bg-[var(--cardB-main)] relative rounded-lg">

                        <div className="grid grid-cols-[0.25fr_1fr_1.5fr_0.25fr] gap-4 text-left">
                            <div>
                                <p className="text-xs">Starred</p>
                            </div>
                            <div>
                                <p className="text-xs">From/Timestamp</p>
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
                                    className={`p-1.5 shadow grid grid-cols-[0.25fr_1fr_1.5fr_0.25fr] gap-4 mb-1 items-center text-left rounded-sm ${mail.read ? 'bg-[var(--cardB-main)]' : 'bg-[var(--blankCard-main)]'}`}
                                    onClick={() => {
                                        setSelectedEmail(mail)
                                        markAsRead(mail.id)
                                        setReadEmailCount(readEmailCount+1)
                                    }}
                                >
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
                                        <p className="text-sm font-semibold text-[var(--text-b)]">{mail.from}</p>
                                        <p className="text-xs text-[var(--text-c)]">{new Date(mail.timestamp).toLocaleString()}</p>
                                    </div>

                                    <div>
                                        <p className="text-sm font-semibold text-[var(--text-a)]">{mail.subject}</p>
                                        <p className="text-xs text-[var(--text-c)]">{mail.body}</p>
                                    </div>

                                    <div className={`rounded-sm text-[var(--text-b)] py-0.5 px-4 text-center
                                        ${mail.priority === 'high' ? 'bg-[var(--dangerL)] px-6' : ''}
                                        ${mail.priority === 'normal' ? 'bg-[var(--warningL)]' : ''}`}>
                                        <p className="text-sm">{mail.priority}</p>
                                    </div>
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
        if(a.priority === 'high' && b.priority !== 'high') return -1;
        if(b.priority === 'high' && a.priority !== 'high') return 1;

        if(a.starred && !b.starred) return -1;
        if(b.starred && !a.starred) return 1;
    }

    const timeA = new Date(a.timestamp).getTime();
    const timeB = new Date(b.timestamp).getTime();

    if(timeB !== timeA) return timeB - timeA;

    return a.id.localeCompare(b.id);
}