'use client';

import AppShell from "@/shells/appShell";
import ThinFooter from "@/components/footers/thinFooter";
import { useTaskStore } from "@/store/taskStore";
import useStore from "@/store/useStore";
import { motion, AnimatePresence } from "framer-motion";
import { useEffect, useState } from "react";
import AddTask from "@/components/tasks/addTask";
import ModeBanner from "@/components/modeBanner";
import BreakPopup from "@/components/breakPopup";
import CalmOverlay from "@/components/calmOverlay";

import { ICONS } from "@/lib/assets";
import { supabase } from "@/lib/supabaseClient";
import { useRouter } from "next/navigation";

export default function TasksPage() {

    const router = useRouter()
    const {loadTasks, classifyMissingTasks, tasks, toggleComplete, completedTasksCount, setCompletedTasksCount} = useTaskStore();

    useEffect(() => {
        const init = async () => {
            const {data} = await supabase.auth.getSession()

            if (!data.session) {
                router.push('/login')
                return
            }

            await loadTasks()
            await classifyMissingTasks()
        }

        init()
    }, [])

    
    const {emotionValue, focusMode, setFocusMode, priorityMode, expandedSecondary, setExpandedSecondary, expandedMain, setShowTasks, showTasks, calmMode, sdkActive, setCalmMode, theme, setTheme, setScreen} = useStore();
    const [sorted, setSorted] = useState([]);

    useEffect(() => {

        let results = tasks;

        if(emotionValue > 70) {

            setFocusMode(true);
            results = results.filter((t) => t.priority === 'high').slice(0,3);

        } else {

            if (priorityMode) {
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
                    const taskDate = t.due ? new Date(t.due) : null;
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
                    const taskDate = t.due ? new Date(t.due) : null;
                    if(!taskDate) return false;
                    if (t.completed) return false;
                    return taskDate >= today;
                });
            }
        }

        results = [...results].sort((a,b) => sortTasks(a, b, priorityMode));
        setSorted(results);
        setScreen('tasks');

        if (emotionValue > 85 && sdkActive) setCalmMode(true);
    
    }, [tasks, showTasks, focusMode, priorityMode, emotionValue]);

    const secondaryWidth = expandedSecondary ? 210 : 54;
    const contentMargin = 38 + secondaryWidth;

    useEffect(() => {
        const darkModeEnabled = document.documentElement.classList.contains('dark');
        setTheme(darkModeEnabled ? 'dark' : 'light');
    }, []);

    useEffect(() => {
        const handleKeyDown = (e) => {
            const tag = e.target.tagName;
                if (tag === 'INPUT' || tag === 'TEXTAREA') return;
                
                switch (e.key.toLowerCase()) {
                    case '1':
                        setShowTasks('all')
                        break;
                    
                    case '2':
                        setShowTasks('today')
                        break;
                    
                    case '3':
                        setShowTasks('upcoming')
                        break;

                    case '4':
                        setShowTasks('priority')
                        break;
                    
                    case '5':
                        setShowTasks('completed')
                        break;
                    
                    default:
                        break;
                }
            };

        window.addEventListener('keydown', handleKeyDown);
        return () => window.removeEventListener('keydown', handleKeyDown);
    }, []);

    return (
        <div className={`relative h-screen`}>

            <ModeBanner mode={focusMode ? 'focus' : priorityMode ? 'priority' : null} />
            
            {completedTasksCount >= 3 && emotionValue >= 70 && (
                <BreakPopup
                    scenario= 'tasks'
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

                    <motion.div className='transition-all duration-300 mr-10 p-2 flex flex-col'
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
                        <div className="flex flex-row justify-between">
                            <div className="relative">
                                <div className="flex-1 border-[0.1rem] border-[var(--baseAcc-e)] bg-[var(--baseAcc-g)] text-sm px-4 py-1 rounded-md text-[var(--text-a)] outline-none w-[50vw] shadow
                                    focus:outline-none
                                    focus-visible:ring-2
                                    focus-visible:ring-offset-2
                                    focus-visible:ring-blue-500">
                                    Search Tasks
                                </div>
                            </div>

                            <AddTask/>
                        </div>

                        <div className="my-2 rounded-md shadow min-h-screen bg-[var(--baseAcc-g)] py-2">

                            <div className="w-full flex-1 bg-none justify-start grid grid-cols-[0.20fr_1.8fr_0.35fr_0.35fr] gap-4 text-left">
                                <div/>
                                <div>
                                    <p className="group-label">Tasks</p>
                                </div>
                                <div>
                                    <p className="group-label">Due Date</p>
                                </div>
                                <div>
                                    <p className="group-label">Priority</p>
                                </div>
                            </div>

                            <AnimatePresence>
                                {sorted.map((task) => {
                                    
                                    const formattedDate = task.due
                                        ? new Date(task.due).toLocaleString(undefined, {
                                            day: '2-digit',
                                            month: 'short',
                                            year: 'numeric',
                                            hour: 'numeric',
                                            minute: '2-digit',
                                            hour12: true
                                        }) 
                                        : '';

                                    return (
                                        <motion.div
                                            key={task.id}
                                            layout
                                            layoutTransition={{type: 'spring', stiffness: 500, damping: 40}}
                                            initial={{opacity: 0, y:10}}
                                            animate={{opacity: 1, 
                                                y: 0,
                                            }}
                                            exit={{opacity: 0, y: -10}}
                                            transition={{duration: 0.3}}
                                            className={`px-4 py-0.5 grid grid-cols-[0.20fr_1.8fr_0.35fr_0.35fr] border-t-[0.05rem] border-b-[0.05rem] border-[var(--baseAcc-f)] gap-4 items-center justify-start ${task.completed ? 'bg-[var(--bg)]' : ''}`}
                                        >

                                            <div>
                                                <input
                                                    type='checkbox'
                                                    id='accept'
                                                    checked={task.completed}
                                                    onChange={() => {
                                                        toggleComplete(task.id)
                                                        if (!task.completed){
                                                        setCompletedTasksCount(completedTasksCount+1)}
                                                    }}
                                                    className='w-3.5 h-3.5 accent-blue-500'
                                                />
                                            </div>
                                            <div>
                                                <p className={`text-sm`}>
                                                    {task.title}
                                                </p>
                                            </div>
                                            <div>
                                                <p className={`text-sm`}>
                                                    {formattedDate}
                                                </p>
                                            </div>
                                            <div className={`rounded-sm p-0.5 w-full flex flex-row justify-center items-center gap-1 border-[0.05rem] border-[var(--baseAcc-f)] 
                                                ${task.priority === 'high' ? 'bg-[var(--dangerL)] text-[var(--danger)]' : 
                                                task.priority === 'medium' ? 'bg-[var(--warningL)] text-[var(--warning)]' : 'bg-[var(--successL)] text-[var(--success)]'}`}>
                                                    <img
                                                        src={task.priority === 'high' ? ICONS[theme].redflag : task.priority === 'medium' ? ICONS[theme].yellowflag : ICONS[theme].greenflag}
                                                        className="w-3 h-3 shrink-0"
                                                    />
                                                <p className={`text-xs text-left`}>
                                                    {task.priority === 'high' ? 'High' : task.priority === 'medium' ? 'Medium' : 'Low'}
                                                </p>
                                            </div>
                                        </motion.div>
                                    )
                                })}
                            </AnimatePresence>  
                        </div>
                    </motion.div>
                </AppShell>
            </div>

            <ThinFooter />

        </div>
    );
}

function sortTasks(a, b, priorityMode) {
    const priorityOrder = {high: 3, medium: 2, low: 1};

    // completed status
    if (a.completed !== b.completed) return a.completed ? 1 : -1;

    // parse sort
    const dateA = a.due ? new Date(a.due).getTime() : Infinity;
    const dateB = b.due ? new Date(b.due).getTime() : Infinity;

    // priority numbers
    const pA = priorityOrder[a.priority] || 0;
    const pB = priorityOrder[b.priority] || 0;

    // priority mode on
    if(priorityMode) {

        if (pA !== pB) return pB - pA; // sort by priority 
        if (dateA !== dateB) return dateA - dateB; // sort by date
        return 0;
    } 
    else {
        
        if (dateA !== dateB) return dateA - dateB; // sort by date
        if (pA !== pB) return pB - pA; // sort by priority
        return 0;
    }
}