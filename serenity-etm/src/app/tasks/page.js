// complete
'use client';

import AppShell from "@/shells/appShell";
import { useTaskStore } from "@/store/taskStore";
import useStore from "@/store/useStore";
import { motion } from "framer-motion";
import { useEffect, useState } from "react";
import AddTask from "@/components/tasks/addTask";
import TaskFunctionsMenu from "@/components/tasks/gridTaskFunctions";

import { ICONS } from "@/lib/assets";
import { supabase } from "@/lib/supabaseClient";
import { useRouter } from "next/navigation";

const getPriority = (p) => p ?? 'normal';

export default function TasksPage() {

    const router = useRouter()
    
    const {loadTasks, classifyMissingTasks, tasks, toggleComplete, toggleDelete, completedTasksCount, setCompletedTasksCount, cyclePriority, cycleProgress, selectedIds, toggleSelect, clearSelection, markManyComplete, deleteMany, selectAllVisible} = useTaskStore();
    const {emotionValue, focusMode, priorityMode, setShowTasks, showTasks, sdkActive, setCalmMode, theme, setTheme, setScreen} = useStore();

    const [filtered, setFiltered] = useState([]);
    const [grid, setGrid] = useState(true);

    const [searchQuery, setSearchQuery] = useState([]);
    const [searchResults, setSearchResults] = useState('');

    const [popup, setPopup] = useState(false);

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

    // search
    useEffect(() => {

        if (searchQuery.length < 1) {
            setSearchResults([]);
            return;
        }
        
        const q = searchQuery.toLowerCase();
            
        const matches = tasks.filter(t => (
            t.title?.toLowerCase().includes(q) ||
            t.description?.toLowerCase().includes(q) ||
            t.due.toLowerCase().includes(q) ||
            t.progress.toLowerCase().includes(q) ||
            t.priority.toLowerCase().includes(q)
        ));

        setSearchResults(matches.slice(0, 12));
    }, [searchQuery, tasks]);

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

    useEffect(() => {

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
                return taskDate >= today && taskDate < tomorrow;
            });
        }
        else if (showTasks === 'completed') {
            results = results.filter(t => t.completed);
        }
        else if (showTasks === 'priority') {
            results = results.filter(t => t.priority === 'high');
        }
        else if (showTasks === 'upcoming') {
            results = results.filter(t => {
                if (!t.due) return false;
                const taskDate = new Date(t.due);
                return taskDate >= today;
            });
        }

        // only show incomplete tasks in all other categories
        if (showTasks !== 'completed') results = results.filter(t => !t.completed); 

        // remove deleted
        results = results.filter(t => !t.is_delete);

        // medium stress -> remove low priority
        if (!focusMode && emotionValue >= 40 && emotionValue <= 70) {
            results = results.filter(t => getPriority(t.priority) !== 'low');
        }

        // sorting
        results = results.sort((a, b) => sortTasks(a, b, focusMode || priorityMode));

        // focus mode limit
        if (focusMode) results = results.slice(0, 3);
        
        setFiltered(results);
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

        // overdue tasks float to the top
        const now = Date.now();

        // due date sort (earliest first, undated last)
        const timeA = a.due ? new Date(a.due).getTime() : Infinity;
        const timeB = b.due ? new Date(b.due).getTime() : Infinity;

        const overdueA = timeA < now;
        const overdueB = timeB < now;

        // priority sort on priority mode
        if (prioritySort) {
            
            const pa = rank[getPriority(a.priority)];
            const pb = rank[getPriority(b.priority)];

            // priority first
            if (pa !== pb) return pb - pa;
        }

        // overdue first
        if (overdueA !== overdueB) return overdueA ? -1 : 1;

        // earlier due date first
        if (timeA !== timeB) {
            return timeA - timeB;
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

            {/* top row: search bar + add task button */}
            <div className="flex flex-row justify-between">

                {/* search bar */}
                <div className="relative w-full">

                    {/* search bar input */}
                    <input
                        value={searchQuery}
                        onChange={(t) => {
                            t.stopPropagation()
                            setSearchQuery(t.target.value)
                        }}
                        placeholder="Search task"
                        className="flex-1 border-[var(--f-main)] bg-[var(--baseAcc-b)] text-[var(--text-c)] outline-none shadow items-center search-bar"
                    />
                    
                    {/* search bar results */}
                    {searchQuery && searchResults.length > 0 && (
                        <div className="absolute top-full w-full leading-tight border-[var(--f-main)] bg-[var(--baseAcc-b)] text-[var(--text-b)] shadow z-30 overflow-x-hidden overflow-y-auto search-bar-results">
                            {searchResults.map(task => (
                                <motion.div
                                    key={task.id}
                                    role="button"
                                    onClick={() => {
                                        setSearchQuery('');

                                        const el = document.getElementById(`task-${task.id}`);
                                        if (el) {
                                            el.scrollIntoView({behavior: 'smooth', block: 'center'});
                                            el.classList.add('ring-2', 'ring-blue-500');
                                            setTimeout(() => {
                                               el.classList.remove('ring-2', 'ring-blue-500'); 
                                            }, 1200);
                                        }
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
                                        <p>{task.title}</p>
                                        <p>{formatTaskDate(task.due)}</p>
                                    </div>
                                    <p className="w-full truncate">{task.description || '(No description)'}</p>
                                </motion.div>
                            ))}
                        </div>
                    )}
                </div>

                <div className="flex flex-row gap-1">
                    <button
                        className="prim-act-btn task-layout-btn"
                        onClick={() => setGrid(!grid)}
                    >
                        <img
                            src={grid ? ICONS[theme].row : ICONS[theme].grid}
                        />
                    </button>

                    {/* add task button */}
                    <AddTask />
                </div>
            </div>

            {/* batch functions section */}
            {(selectedIds.length > 0) && (
                <div className="flex flex-row batch-func">
                    <button 
                        className="opacity-80 hover:opacity-60 "
                        onClick={() => {
                        if (selectedIds.length === filtered.length) {
                            clearSelection()
                        }
                        else {
                            selectAllVisible(filtered.map(t => t.id))
                        }
                    }}>
                        <input
                            type="checkbox"
                            readOnly
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

                    {showTasks !== 'completed' ? 
                        <button
                            className="opacity-80 hover:opacity-60"
                            onClick={() => {
                                markManyComplete(selectedIds);
                                setCompletedTasksCount(completedTasksCount+selectedIds.length);  
                            }}
                        >
                            <img
                                src={ICONS[theme].markcomplete}
                                alt=""
                                aria-hidden='true'
                            />
                        </button>
                        : 
                        <button
                            className="opacity-80 hover:opacity-60"
                            onClick={() => markManyComplete(selectedIds, false)}
                        >
                            <img
                                src={ICONS[theme].markincomplete}
                                alt=""
                                aria-hidden='true'
                            />
                        </button>
                    }

                    <button 
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

            {/* main section with tasks listed */}
            <motion.div 
                layout
                transition={easeTransition}
                className="flex flex-col min-h-0 h-full overflow-hidden min-w-0 z-0 overflow-y-visible"
            >
                {/* header */}
                {!grid && filtered.length > 0 && (
                    <motion.div 
                        layout
                        transition={easeTransition}
                        className={`${showTasks !== 'completed' ? 'grid grid-cols-[0.1fr_1fr_2fr_0.4fr_0.8fr_0.6fr]' : 'grid grid-cols-[0.1fr_1fr_2.4fr_0.4fr_0.6fr]'} border-b-[0.005rem] border-[var(--e-main)] justify-start items-center text-left email-grid`}
                    >
                            <div />
                            <p>Task</p>
                            <p>Description</p>
                            <p className="text-center">Due</p>
                            {showTasks !== 'completed' && (    
                                <p className="text-center">Progress</p>
                            )}
                            <p className="text-center">Priority</p>

                    </motion.div>
                )}

                {/* container morphs */}
                <motion.div
                    layout
                    transition={easeTransition}
                    className={
                        grid
                        ? 'grid grid-cols-3 gap-2 my-2 rounded-lg'
                        : 'flex flex-col'
                    }
                >
                    {filtered.map((task) => (
                        <motion.div
                            id={`task-${task.id}`}
                            key={task.id}
                            layout
                            transition={easeTransition}
                            className="bg-[var(--baseAcc-b)]"
                        >
                            {/* content morphs */}
                            <motion.div
                                layout
                                className={
                                    grid
                                    ? `flex flex-col gap-2 p-4 rounded-lg shadow-md h-full ${(new Date(task.due).getTime() < Date.now()) ? 'border-[0.2rem] border-[var(--priorityHigha)]' : ''}` 
                                    : `${showTasks !== 'completed' ? 'grid grid-cols-[0.1fr_1fr_2fr_0.4fr_0.8fr_0.6fr]' : 'grid grid-cols-[0.1fr_1fr_2.4fr_0.4fr_0.6fr]'} justify-start items-center text-left email-grid px-1 py-1.5 border-y-[0.005rem] border-[var(--e-main)] 
                                    ${(new Date(task.due).getTime() < Date.now()) ? 'border-[0.2rem] border-[var(--priorityHigha)]' : ''}`
                                }
                            >
                                {!grid && (
                                    <input 
                                        type="checkbox"
                                        checked={selectedIds.includes(task.id)}
                                        onChange={(t) => {
                                            t.stopPropagation()
                                            toggleSelect(task.id)
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
                                )}

                                <div className={grid ? 'flex flex-row justify-between' : ''}>
                                    {!grid 
                                    ? <p className="font-semibold">{task.title}</p>
                                    : <h6 className="font-semibold">{task.title}</h6>
                                    }
                                    {grid && <TaskFunctionsMenu
                                        onComplete={() => toggleComplete(task.id)}
                                        onDelete={() => toggleDelete(task.id)}
                                        completed={task.completed}
                                    />}
                                </div>

                                <p className={!grid ? "truncate" : ''}>{task.description}</p>

                                <div className={grid ? `flex flex-row gap-2 items-center` : `text-center ${(new Date(task.due).getTime() < Date.now()) ? 'bg-[var(--priorityHighb)] rounded-sm' : ''}`}>
                                    {grid &&
                                            <img
                                                src={ICONS[theme].date}
                                            />
                                    }
                                    <p>{formatTaskDate(task.due)}</p>
                                </div>

                                {grid && (
                                    <div className="w-full h-1 bg-black/10 rounded-full my-2">
                                        <div className={`h-1 bg-blue-500 rounded-full ${
                                            task.progress === 'Not started'
                                            ? 'w-1'
                                            : task.progress === 'In progress'
                                            ? 'w-1/2'
                                            : 'w-11/12'
                                        }`} />
                                    </div>
                                )}

                                {showTasks !== 'completed' &&
                                    <div className={grid ? 'flex flex-row gap-2 items-center' : ''}>
                                        {grid && (
                                            <p className="text-[var(--text-b)] leading-tight group-label">Progress</p>
                                        )}
                                    <div className="flex items-center justify-center">
                                            <button 
                                                onClick={(e) => {
                                                    e.stopPropagation()
                                                    cycleProgress(task.id)
                                                }}
                                                className={`flex flex-row justify-center items-center progress-tag 
                                                ${task.progress === 'Not started' ? 'bg-[var(--progressNotc)] hover:bg-[var(--progressNotb)] border-[var(--progressNota)] text-[var(--progressNott)]' :
                                                task.progress === 'Almost complete' ? 'bg-[var(--progressAlmostc)] hover:bg-[var(--progressAlmostb)] border-[var(--progressAlmosta)] text-[var(--progressAlmostt)]'
                                                : 'bg-[var(--progressInc)] hover:bg-[var(--progressInb)] border-[var(--progressIna)] text-[var(--progressInt)]'}
                                                transform transition-transform duration-300 ease-out hover:scale-105`}
                                            >
                                                    <div className={`rounded-full p-[0.12rem] border-[0.1rem] 
                                                    ${task.progress === 'Not started' ? 'bg-[var(--progressNotb)] border-[var(--progressNota)]' :
                                                    task.progress === 'Almost complete' ? 'bg-[var(--progressAlmostb)] border-[var(--progressAlmosta)]' : 'bg-[var(--progressInb)] border-[var(--progressIna)]'}`} />
                                                    <p className="text-xs text-left whitespace-nowrap">{task.progress === 'Not started' ? 'Not started' : task.progress === 'Almost complete' ? 'Almost complete' : 'In progress'}</p>
                                            </button>
                                        </div> 
                                    </div>
                                }
                                
                                <div className={grid ? 'flex flex-row gap-4 items-center' : ''}>
                                    {grid && (
                                        <p className="text-[var(--text-b)] leading-tight group-label">Priority</p>
                                    )}
                                    <div className="flex items-center justify-center">
                                        <button 
                                            onClick={(e) => {
                                                e.stopPropagation()
                                                cyclePriority(task.id)
                                            }}
                                            className={`flex flex-row justify-center items-center priority-tag
                                            ${task.priority === 'high' ? 'bg-[var(--priorityHighc)] hover:bg-[var(--priorityHighb)] border-[var(--priorityHigha)] text-[var(--priorityHight)]' :
                                            task.priority === 'low' ? 'bg-[var(--priorityLowc)] hover:bg-[var(--priorityLowb)] border-[var(--priorityLowa)] text-[var(--priorityLowt)]'
                                            : 'bg-[var(--priorityNormalc)] hover:bg-[var(--priorityNormalb)] border-[var(--priorityNormala)] text-[var(--priorityNormalt)]'}
                                            transform transition-transform duration-300 ease-out hover:scale-105`}
                                        >
                                                <img
                                                    src={task.priority === 'high' ? ICONS[theme].redflag :
                                                    task.priority === 'low' ? ICONS[theme].greyflag : ICONS[theme].yellowflag}
                                                />
                                                <p className="text-xs text-left">{task.priority === 'high' ? 'High' : task.priority === 'low' ? 'Low' : 'Normal'}</p>
                                        </button>
                                    </div>
                                </div>
                            </motion.div>
                        </motion.div>
                    ))}
                </motion.div>

                {filtered.length === 0 && (
                    <motion.div 
                        key="empty"
                        initial={{opacity:0}}
                        animate={{opacity:1}}
                        exit={{opacity:0}}
                        className="overflow-hidden">
                        <p className="
                            text-center 
                            sm:m-1
                            md:m-2
                            lg:m-4
                            xl:m-4
                            2xl:m-4
                        ">No tasks found.</p>
                    </motion.div>
                )}

           </motion.div>
        </AppShell>
    );
}