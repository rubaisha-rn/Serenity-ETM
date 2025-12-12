'use client';

import Header from "@/components/header";
import Image from "next/image";
import AppShell from "@/shells/appShell";
import ThinFooter from "@/components/footers/thinFooter";
import PrototypeTag from '@/components/prototypeTag';
import useStore from "@/store/useStore";
import { motion, AnimatePresence } from "framer-motion";
import { useEffect, useState } from "react";
import { useEmailStore } from "@/store/emailStore";
import EmailReader from "@/components/emails/emailReader";

export default function EmailsPage () {

    const {emails, showEmails, toggleStar, setSelectedEmail, markAsRead} = useEmailStore();

    const {emotionValue, focusMode, setFocusMode, priorityMode, expandedSecondary, expandedMain} = useStore();

    const mainWidth = expandedMain ? 220 : 40;
    const secondaryWidth = expandedSecondary ? 200 : 40;
    const contentMargin = mainWidth + secondaryWidth;

    const stress01 = emotionValue / 100;
    const [stressPalette, setStressPalette] = useState('low');
    const [theme, setTheme] = useState('light'); 

    useEffect(() => {
        const darkModeEnabled = document.documentElement.classList.contains('dark');
        setTheme(darkModeEnabled ? 'dark' : 'light');
    }, []);

    useEffect(() => {
        if (stress01 !== undefined) {
            if (stress01 < 0.33) setStressPalette('low');
            else if (stress01 < 0.66) setStressPalette('mid');
            else setStressPalette('high');}
    }, [stress01]);

    const bgClasses = {
        light: {
            low: 'bg-light-low-bg',
            mid: 'bg-light-mid-bg',
            high: 'bg-light-high-bg',
        },
        dark: {},
    };

    const cardClasses = {
        light: {
            low: 'bg-light-low-blankCard',
            mid: 'bg-light-mid-card',
            high: 'bg-light-high-card',
        },
        dark: {},
    };

    const textAClasses = {
        light: 'text-light-textA',
        dark: '',
    };

    const textBClasses = {
        light: 'text-light-textB',
        dark: '',
    };

    const textCClasses = {
        light: 'text-light-textC',
        dark: '',
    };

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

    }, [emails, showEmails, focusMode, priorityMode, emotionValue]);

    return (
        <div className={`${bgClasses[theme][stressPalette]} relative h-screen`}>
            
            <Header
                title="Serenity ETM"
                logo={<Image
                    src="/logo/logo.png"
                    alt='Serenity ETM Logo'
                    width={18}
                    height={18}
                    priority
                />}
                sticky
            />

            <PrototypeTag/>
            
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
                    <div className={`w-full flex-1 px-4 py-6 ${cardClasses[theme][stressPalette]} shadow-xl relative rounded-lg`}>
                        <h1 className={`${textCClasses[theme]} font-Roboto font-bold my-2`}>My Emails</h1>

                        <AnimatePresence>
                            {filtered.map((mail) => (
                                <motion.div
                                    key={mail.id}
                                    layout
                                    layoutTransition={{type: 'spring', stiffness: 500, damping: 40}}
                                    initial={{opacity: 0, y:10}}
                                    animate={{opacity: 1, y: 0,}}
                                    transition={{duration: 0.3}}
                                    className={`p-3 rounded-xl shadow
                                    grid grid-cols-[0.25fr_1fr_1.5fr_0.25fr] gap-4 mb-1 items-center text-left ${mail.read ? 'bg-gray-400' : 'bg-white'}`}
                                    onClick={() => {
                                        setSelectedEmail(mail)
                                        markAsRead(mail.id)
                                    }}
                                >
                                    <div>
                                        <button
                                            className="px-3 py-1 text-sm rounded-md bg-gray-200"
                                            onClick={(e) => {
                                                e.stopPropagation();
                                                toggleStar(mail.id);
                                            }}
                                        >
                                            {mail.starred ? '★' : '☆'}
                                        </button>
                                    </div>

                                    <div>
                                        <p className="text-sm font-semibold">{mail.from}</p>
                                        <p className="text-xs">{new Date(mail.timestamp).toLocaleString()}</p>
                                    </div>

                                    <div>
                                        <p className="text-sm font-semibold">{mail.subject}</p>
                                        <p className="text-xs">{mail.body}</p>
                                    </div>

                                    <div>
                                        <p className="text-sm font-semibold">{mail.priority}</p>
                                    </div>
                                </motion.div>
                            ))}

                            {filtered.length === 0 && (
                                <p>No emails found.</p>
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