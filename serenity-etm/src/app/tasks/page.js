'use client';

import Header from "@/components/header";
import Image from "next/image";
import AppShell from "@/shells/appShell";
import ThinFooter from "@/components/footers/thinFooter";
import PrototypeTag from '@/components/prototypeTag';
import { useTaskStore } from "@/store/taskStore";
import useStore from "@/store/useStore";
import { motion, AnimatePresence } from "framer-motion";
import { useEffect, useState } from "react";
import AddTask from "@/components/tasks/addTask";
import ModeBanner from "@/components/modeBanner";
import BreakPopup from "@/components/breakPopup";
import CalmOverlay from "@/components/calmOverlay";

export default function TasksPage() {

    const {tasks, toggleComplete, completedTasksCount, setCompletedTasksCount} = useTaskStore();
    const {emotionValue, focusMode, setFocusMode, priorityMode, expandedSecondary, expandedMain, showTasks, calmMode} = useStore();
    const [sorted, setSorted] = useState([]);

    useEffect(() => {

        let results = tasks;

        if(emotionValue > 70) {

            setFocusMode(true);
            results = results.filter((t) => t.priority === 'high').slice(0,3);

        } else {

            if (priorityMode) {
                // results = results.filter((t) => t.priority !== 'low');
                results = [...results].sort((a,b) => sortTasks(a, b, priorityMode));
            }

            if (emotionValue >= 50 && emotionValue <= 70) {
                results = results.filter((t) => t.priority != 'low');
            }

            if (focusMode) {
                results = results.filter((t) => t.priority === 'high').slice(0,3);
            }

            const today = new Date();
            today.setHours(0, 0, 0, 0);

            const tomorrow = new Date(today);
            tomorrow.setDate(today.getDate() + 1);
            
            if (showTasks === 'today') {
                results = results.filter((t) => {
                    const taskDate = parseDDMMYYYY(t.due);
                    if(!taskDate) return false;
                    return taskDate >= today && taskDate < tomorrow;
                });
            }
            else if (showTasks === 'completed') {
                results = results.filter((t) => t.completed);
            }
            else if (showTasks === 'priority') {
                results = results.filter((t) => t.priority === 'high');
            }
            else if (showTasks === 'upcoming') {
                results = results.filter((t) => {
                    const taskDate = parseDDMMYYYY(t.due);
                    if(!taskDate) return false;
                    return taskDate >= today;
                });
            }
        }

        results = [...results].sort((a,b) => sortTasks(a, b, priorityMode));
        setSorted(results);
    
    }, [tasks, showTasks, focusMode, priorityMode, emotionValue]);

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

    const completedTasksClasses = {
        light: {
            low: 'bg-light-low-icons bg-opacity-20',
            mid: 'bg-light-mid-icons bg-opacity-20',
            high: 'bg-light-high-icons bg-opacity-20',
        },
        dark: {},
    }

    return (
        <div className={`${bgClasses[theme][stressPalette]} relative h-screen`}>

            <PrototypeTag/>
            
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

            <ModeBanner mode={focusMode ? 'focus' : priorityMode ? 'priority' : null} />

            {completedTasksCount >= 3 && emotionValue >= 70 && (
                <BreakPopup
                    scenario= 'tasks'
                    durationMs={20000}
                    onAcknowledge={() => setCompletedTasksCount(0)}
                />
            )}

            <AnimatePresence>
                {calmMode && (
                    <motion.div
                        key='calm-overlay-wrapper'
                        initial={{opacity: 0}}
                        animate={{opacity: 1}}
                        exit={{opacity: 0}}
                        transition={{ duration: 0.6, ease: 'easeInOut'}}
                        className="fixed inset-0 bg-black bg-opacity-40 z-[9999] pointer-events-auto"
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
                    <div className="mb-6">
                        <AddTask />
                    </div>

                    <div className={`w-full flex-1 px-4 py-6 ${cardClasses[theme][stressPalette]} shadow-xl relative rounded-lg`}>

                        <h1 className={`${textCClasses[theme]} font-Roboto font-bold my-2`}>My Tasks</h1>

                        <div className="grid grid-cols-[40px_3fr_100px_100px] gap-4 items-center text-left">
                            <div>
                                <p className="text-xs">Tasks</p>
                            </div>
                            <div/>
                            <div>
                                <p className="text-xs">Due Date</p>
                            </div>
                            <div>
                                <p className="text-xs">Priority</p>
                            </div>
                        </div>

                        <AnimatePresence>
                            {sorted.map((task) => {
                                
                                const formattedDate = (() => {
                                    if (!task.due) return '';
                                    const [day, month, year] = task.due.split('-');
                                    if (!day || !month || !year) return '';
                                    const monthNames = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
                                    return `${monthNames[parseInt(month, 10) -1]} ${parseInt(day, 10)}`
                                })();

                                return (
                                    <motion.div
                                        key={task.id}
                                        layout
                                        layoutTransition={{type: 'spring', stiffness: 500, damping: 40}}
                                        initial={{opacity: 0, y:10}}
                                        animate={{opacity: 1, 
                                            y: 0,
                                            scale: task.completed ? 0.95 : 1,
                                        }}
                                        exit={{opacity: 0, y: -10}}
                                        transition={{duration: 0.3}}
                                        className={`p-3 rounded-xl shadow
                                        grid grid-cols-[40px_3fr_100px_100px] gap-4 mb-1 items-center text-left ${task.completed ? `${completedTasksClasses[theme][stressPalette]}` : 'bg-white'}`}
                                    >

                                        <div>
                                            <input
                                                type='checkbox'
                                                id='accept'
                                                checked={task.completed}
                                                onChange={() => {
                                                    toggleComplete(task.id)
                                                    setCompletedTasksCount(completedTasksCount+1)
                                                }}
                                                className='w-4 h-4 accent-blue-500'
                                            />
                                        </div>
                                        <div>
                                            <p className={`text-sm ${task.completed ? 'line-through text-gray-400' : ''}`}>
                                                {task.title}
                                            </p>
                                        </div>
                                        <div>
                                            <p className={`text-sm ${task.completed ? 'line-through text-gray-400' : ''}`}>
                                                {formattedDate}
                                            </p>
                                        </div>
                                        <div className={`rounded-sm text-black text-sm p-0.5 text-center 
                                            ${task.priority === 'high' ? 'bg-red-500 bg-opacity-30' : ''}
                                            ${task.priority === 'medium' ? 'bg-yellow-300 bg-opacity-30' : ''}
                                            ${task.priority === 'low' ? 'bg-green-300 bg-opacity-30' : ''}`}>
                                            <p className={`font-medium ${task.completed ? 'line-through text-gray-400' : ''}`}>
                                                {task.priority}
                                            </p>
                                        </div>
                                        
                                    </motion.div>
                                )
                            })}
                        </AnimatePresence>  

                    </div>
                </motion.div>

            </AppShell>

            <ThinFooter />

        </div>
    );
}

function sortTasks(a, b, priorityMode) {
    const priorityOrder = {high: 3, medium: 2, low: 1};

    // completed status
    if (a.completed !== b.completed) return a.completed ? 1 : -1;

    // parse sort
    const dateA = parseDDMMYYYY(a.due)?.getTime() ?? Infinity;
    const dateB = parseDDMMYYYY(b.due)?.getTime() ?? Infinity;

    // priority numbers
    const pA = priorityOrder[a.priority] || 0;
    const pB = priorityOrder[b.priority] || 0;

    // priority mode on
    if(priorityMode) {

        if (pA !== pB) return pB - pA;
        if (dateA !== dateB) return dateA - dateB;
        return 0;
    } 
    else {
        
        if (dateA !== dateB) return dateA - dateB;
        if (pA !== pB) return pB - pA;
        return 0;
    }
}

function parseDDMMYYYY(dateStr) {
    if (!dateStr) return null;

    const clean = dateStr.trim();
    const parts = clean.split('-');

    if(parts.length !== 3) return null;

    let [day, month, year] = parts.map(p => p.trim());

    if (year.length === 2) {
        year = '20' + year;
    }

    day = Number(day);
    month = Number(month);
    year = Number(year);

    return new Date(year, month-1, day);
}