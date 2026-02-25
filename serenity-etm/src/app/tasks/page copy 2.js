'use client';

import AppShell from "@/shells/appShell";
import { useTaskStore } from "@/store/taskStore";
import useStore from "@/store/useStore";
import { motion, AnimatePresence } from "framer-motion";
import { useEffect, useState } from "react";
import AddTask from "@/components/tasks/addTask";
import BreakPopup from "@/components/breakPopup";

import { ICONS } from "@/lib/assets";
import { supabase } from "@/lib/supabaseClient";
import { useRouter } from "next/navigation";

const getPriority = (p) => p ?? 'normal';

export default function TasksPage() {

    const router = useRouter()
    
    const {loadTasks, classifyMissingTasks, tasks, toggleComplete, completedTasksCount, setCompletedTasksCount, cyclePriority, cycleProgress} = useTaskStore();
    const {emotionValue, focusMode, priorityMode, setShowTasks, showTasks, sdkActive, setCalmMode, theme, setTheme, setScreen} = useStore();
    const [sorted, setSorted] = useState([]);
    const [grid, setGrid] = useState(false);

    const easeTransition = {
        duration: 0.65,
        ease: [0.16, 1, 0.3, 1]
    };

    // session init
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

    useEffect(() => {

        if (emotionValue > 85 && sdkActive) setCalmMode(true);
        
        let results = [...tasks];

        const today = new Date();
        today.setHours(0, 0, 0, 0);

        const tomorrow = new Date(today);
        tomorrow.setDate(today.getDate() + 1);

        // category filtering
        if (showTasks === 'today') {
            results = results.filter(t => {
                if (!t.due) return false;
                const taskDate = new Date(t.due);
                return taskDate >= today && taskDate < tomorrow && !t.completed;
            });
        }
        else if (showTasks === 'completed') {
            results = results.filter(t => t.completed);
        }
        else if (showTasks === 'priority') {
            results = results.filter(t => t.priority === 'high' && !t.completed);
        }
        else if (showTasks === 'upcoming') {
            results = results.filter(t => {
                if (!t.due || t.completed) return false;
                const taskDate = new Date(t.due);
                return taskDate >= today;
            });
        } 

        // medium stress -> remove low priority
        if (!focusMode && emotionValue >= 40 && emotionValue <= 70) {
            results = results.filter(t => getPriority(t.priority) !== 'low');
        }

        // sorting
        results = results.sort((a, b) => sortTasks(a, b, focusMode || priorityMode));

        // focus mode limit
        if (focusMode) {
            results = results
                .filter(t => t.priority !== 'low' && !t.completed)
                .slice(0, 3);
        }

        setSorted(results);
        setScreen('tasks');
    
    }, [tasks, showTasks, focusMode, priorityMode, emotionValue]);

    // sorting function
    function sortTasks(a, b, prioritySort = false) {
        const rank = {
            high: 3,
            normal: 2, 
            low: 1,
        };

        // incomplete tasks first
        if (a.completed !== b.completed) {
            return a.completed ? 1 : -1;
        }

        // priority sort
        if (prioritySort) {
            
            const pa = rank[getPriority(a.priority)];
            const pb = rank[getPriority(b.priority)];

            // priority first
            if (pa !== pb) return pb - pa;
        }

        // overdue tasks float to the top
        const now = Date.now();

        // due date sort (earliest first, undated last)
        const timeA = a.due ? new Date(a.due).getTime() : Infinity;
        const timeB = b.due ? new Date(b.due).getTime() : Infinity;

        const overdueA = timeA < now;
        const overdueB = timeB < now;

        if (overdueA !== overdueB) return overdueA ? -1 : 1;

        // secondary priority when not in priority mode
        if (!prioritySort) {

            const pa = rank[getPriority(a.priority)];
            const pb = rank[getPriority(b.priority)];

            // priority first
            if (pa !== pb) return pb - pa;
        }

        // final stable fallback
        return a.id.localeCompare(b.id);
    }

    // theme sync
    useEffect(() => {
        const darkModeEnabled = document.documentElement.classList.contains('dark');
        setTheme(darkModeEnabled ? 'dark' : 'light');
    }, []);

    // keyboard shortcuts
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

    // date format
    function formatTaskDate(timestamp) {
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

    return (
        <AppShell>
            {/* top row: search bar and add task button */}
            <div className="flex flex-row justify-between">

                {/* search bar */}
                <div className="relative">

                    {/* search bar input */}
                    <input
                        placeholder="Search tasks"
                        className="search-bar"
                    />
                </div>

                {/* add task button */}
                <div className="flex flex-row gap-2">
                    <button
                        onClick={() => setGrid(!grid)}
                        className="bg-red-900 text-white text-xs rounded hover:bg-red-700 px-2"
                    >
                        {grid ? 'Grid' : 'Row'}
                    </button>
                    <AddTask />
                </div>
            </div>

            {/* batch functions section */}
            {!grid && (
                <div className="batch-func">
                    <button
                        className="batch-func-btn-hover"
                    >
                        {showTasks === 'completed' ? 'Mark as incomplete' : 'Mark as complete'}
                    </button>
                    <button
                        className="batch-func-btn-hover"
                    >
                        Delete
                    </button>
                </div>
            )}

            {/* main section with tasks listed */}
            <motion.div 
                layout
                className={`main-content grid grid-cols-3 gap-2 overflow-y-visible`}
                transition={easeTransition}
            >
                {(tasks.length !== 0 && !grid) && (
                    <div className={`${(showTasks !== 'completed' ) ? 'grid grid-cols-[0.1fr_0.8fr_2fr_0.4fr_0.4fr_0.65fr]' : 'grid grid-cols-[0.1fr_0.8fr_2.4fr_0.4fr_0.4fr]'} email-grid border-b-[0.005rem] border-[var(--e-main)] col-span-3`}>
                            <div />
                            <p>Title</p>
                            <p>Description</p>
                            <p>Due</p>
                            <p>Priority</p>
                            {(showTasks !== 'completed') && (
                                <p>Progress</p>
                            )}
                    </div>
                )}

                {sorted.map((task, i) => (
                    <motion.div
                        layout
                        key={i}
                        className={`bg-[var(--baseAcc-b)] ${
                            grid ? "border-[0.08rem] border-[var(--f-main)] rounded-lg p-4 col-span-1 min-h-0 h-[45vh] mx-1 my-0.5 shadow-md shadow-black/10" : "col-span-3"
                        }`}
                        transition={{layout:easeTransition}}
                    >
                        {grid 
                        ?   <div className="flex flex-col gap-2">
                                
                                <div className="flex flex-row justify-between">
                                    <h5 className="font-semibold">{task.title}</h5>
                                    <button>
                                        <h5 className="font-bold rotate-90">...</h5>
                                    </button>
                                </div>

                                <p>{task.description}</p>
                                
                                <div className="flex flex-row justify-between">
                                    <p>Created: {formatTaskDate(task.created_at)}</p>
                                    <p>Due: {formatTaskDate(task.due)}</p>
                                </div>

                                <div className="bg-black/5 h-1 my-2 rounded-full">
                                    <div className={`bg-blue-300 h-1 rounded-full 
                                        ${task.progress === 'Not started' ? 'w-1' : task.progress === 'In progress' ? 'w-1/2' : 'w-11/12'}`} />
                                </div>
                                
                                <div className="flex flex-row justify-between">
                                    {/* task progress: not started, in progress, almost complete*/}
                                    <button
                                        onClick={(e) => {
                                            e.stopPropagation()
                                            cycleProgress(task.id)
                                        }}
                                    >
                                        <p>Progress: {task.progress}</p>
                                    </button>

                                    {/* task priority: high, normal, low */}
                                    <button>
                                        <p>Priority: {task.priority}</p>
                                    </button>
                                </div>
                            </div> 
                        :   <div className={`${(showTasks !== 'completed' ) ? 'grid grid-cols-[0.1fr_0.8fr_2fr_0.4fr_0.4fr_0.65fr]' : 'grid grid-cols-[0.1fr_0.8fr_2.4fr_0.4fr_0.4fr]'} email-grid py-2 border-b-[0.005rem] border-[var(--e-main)]`}>
                                <div className="flex items-center justify-center">
                                    <input
                                        type="checkbox"
                                        onChange={(e) => {
                                            e.stopPropagation()
                                        }}
                                        className="lg:w-[0.85rem] aspect-square accent-blue-500"
                                    />
                                </div>

                                <p>{task.title}</p>
                                <p className="truncate">{task.description} {task.description} {task.description} {task.description}</p>
                                <p>{formatTaskDate(task.due)}</p>
                                
                                <div className="flex items-center justify-center">
                                    <button 
                                        onClick={(e) => {
                                            e.stopPropagation()
                                            cyclePriority(task.id)
                                        }}
                                        className={`priority-tag
                                        ${task.priority === 'high' ? 'bg-[var(--priorityHighc)] hover:bg-[var(--priorityHighb)] border-[var(--priorityHigha)] text-[var(--priorityHight)]' :
                                        task.priority === 'low' ? 'bg-[var(--priorityLowc)] hover:bg-[var(--priorityLowb)] border-[var(--priorityLowa)] text-[var(--priorityLowt)]'
                                        : 'bg-[var(--priorityNormalc)] hover:bg-[var(--priorityNormalb)] border-[var(--priorityNormala)] text-[var(--priorityNormalt)]'}
                                        transform transition-transform duration-300 ease-out hover:scale-105`}
                                    >
                                            <img
                                                src={task.priority === 'high' ? ICONS[theme].redflag :
                                                task.priority === 'low' ? ICONS[theme].greyflag : ICONS[theme].yellowflag}
                                                className="lg:w-3 aspect-square"
                                            />
                                            <p className="text-xs text-left">{task.priority === 'high' ? 'High' : task.priority === 'low' ? 'Low' : 'Normal'}</p>
                                    </button>
                                </div>

                                <div className="flex items-center justify-center">
                                    <button 
                                        onClick={(e) => {
                                            e.stopPropagation()
                                            cycleProgress(task.id)
                                        }}
                                        className={`progress-tag 
                                        ${task.progress === 'Not started' ? 'bg-[var(--progressNotc)] hover:bg-[var(--progressNotb)] border-[var(--progressNota)] text-[var(--progressNott)]' :
                                        task.progress === 'Almost complete' ? 'bg-[var(--progressAlmostc)] hover:bg-[var(--progressAlmostb)] border-[var(--progressAlmosta)] text-[var(--progressAlmostt)]'
                                        : 'bg-[var(--progressInc)] hover:bg-[var(--progressInb)] border-[var(--progressIna)] text-[var(--progressInt)]'}
                                        transform transition-transform duration-300 ease-out hover:scale-105`}
                                    >
                                            <img
                                                src={task.priority === 'high' ? ICONS[theme].redflag :
                                                task.priority === 'low' ? ICONS[theme].greyflag : ICONS[theme].yellowflag}
                                                className="lg:w-3 aspect-square"
                                            />
                                            <p className="text-xs text-left whitespace-nowrap">{task.progress === 'Not started' ? 'Not started' : task.progress === 'Almost complete' ? 'Almost complete' : 'In progress'}</p>
                                    </button>
                                </div>

                            </div>
                        }
                    </motion.div>
                ))}    
            </motion.div>

        </AppShell>
    );
}