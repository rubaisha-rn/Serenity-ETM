/**
 * Task page.
 * 
 * Loads and classifies user tasks, filters tasks by categories, provides search functionality, handles batch operations, adapt task visibility based on emotional stress levels, provides layout switching and creating tasks.
 */

'use client';

import AppShell from "@/shells/appShell";
import { useTaskStore } from "@/store/taskStore";
import useStore from "@/store/useStore";
import { motion } from "framer-motion";
import { useEffect, useState } from "react";
import AddTask from "@/components/tasks/addTask";
import TaskFunctionsMenu from "@/components/tasks/gridTaskFunctions";
import formatDate from "@/components/formatDate";
import { ICONS } from "@/lib/assets";
import { supabase } from "@/lib/supabaseClient";
import { useRouter, useSearchParams } from "next/navigation";

// Ensures tasks without priorities default to 'normal'
const getPriority = (p) => p ?? 'normal';

export default function TasksPage() {

    // Router for navigation
    const router = useRouter()
    
    // Global state values
    const {loadTasks, classifyMissingTasks, tasks, toggleComplete, toggleDelete, completedTasksCount, setCompletedTasksCount, cyclePriority, cycleProgress, selectedIds, toggleSelect, clearSelection, markManyComplete, deleteMany, selectAllVisible, setShowTasks, showTasks, grid, setGrid} = useTaskStore();

    const {emotionValue, focusMode, priorityMode, setScreen} = useStore();
    const theme = useStore((s) => s.theme);

    // Filtered tasks currently being displayed
    const [filtered, setFiltered] = useState([]);

    // Search state
    const [searchQuery, setSearchQuery] = useState([]);
    const [searchResults, setSearchResults] = useState('');

    // Search parameters
    const searchParams = useSearchParams();
    const highlightId = searchParams.get('highlight');

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

            await loadTasks()
            await classifyMissingTasks()
        }

        init()

    }, [])

    // Search functionality
    useEffect(() => {

        if (!searchQuery || searchQuery.length < 1) {
            setSearchResults([]);
            return;
        }
        
        const q = searchQuery.toLowerCase();
        
        // Check against all task details
        const matches = tasks.filter(t => (
            t.title?.toLowerCase().includes(q) ||
            t.description?.toLowerCase().includes(q) ||
            t.due.toLowerCase().includes(q) ||
            t.progress.toLowerCase().includes(q) ||
            t.priority.toLowerCase().includes(q)
        ));

        // Only display top 12 results maximum
        setSearchResults(matches.slice(0, 12));

    }, [searchQuery, tasks]);

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
     * Task filtering logic
     * 
     * Applies:
        * Category filtering
        * Emotional stress filtering
        * Completion filtering
        * Sorting rules
     */
    useEffect(() => {

        let results = [...tasks];

        const today = new Date();
        today.setHours(0, 0, 0, 0);

        const tomorrow = new Date(today);
        tomorrow.setDate(today.getDate() + 1);

        // Category filtering
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

        // Remove complete tasks in all other categories
        if (showTasks !== 'completed') results = results.filter(t => !t.completed); 

        // Remove deleted tasks
        results = results.filter(t => !t.is_delete);

        // Stress-aware filtering: medium stress -> remove low priority
        // Only hide low-priority tasks if there are other available
        if (!focusMode && (emotionValue >= 40) && (emotionValue <= 70) && (results.length > 3)) {

            const hasNonLowPriority = results.some(t => getPriority(t.priority) !== 'low');

            if (hasNonLowPriority) {
                results = results.filter(t => getPriority(t.priority) !== 'low');
            }
        }

        // Sorting
        results = results.sort((a, b) => sortTasks(a, b, focusMode || priorityMode));

        // Focus mode limits tasks shown
        if (focusMode) results = results.slice(0, 3);
        
        setFiltered(results);
        setScreen('tasks');
    
    }, [tasks, showTasks, focusMode, priorityMode, emotionValue]);

    // Task sorting logic
    function sortTasks(a, b, prioritySort = false) {
        
        const rank = {
            high: 3,
            normal: 2, 
            low: 1,
        };

        // Incomplete tasks first
        if (a.completed !== b.completed) {
            return a.completed ? 1 : -1;
        }

        // Overdue tasks float to the top
        const now = Date.now();

        // Due date sort (earliest first, undated last)
        const timeA = a.due ? new Date(a.due).getTime() : Infinity;
        const timeB = b.due ? new Date(b.due).getTime() : Infinity;

        const overdueA = timeA < now;
        const overdueB = timeB < now;

        // Priority sort on priority mode
        if (prioritySort) {
            
            const pa = rank[getPriority(a.priority)];
            const pb = rank[getPriority(b.priority)];

            // Priority first
            if (pa !== pb) return pb - pa;
        }

        // Overdue first
        if (overdueA !== overdueB) return overdueA ? -1 : 1;

        // Earlier due date first
        if (timeA !== timeB) {
            return timeA - timeB;
        }

        // Final stable fallback
        return a.id.localeCompare(b.id);
    }

    // Keyboard shortcuts
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

    // Scrolling and highlighting task when it renders
    useEffect(() => {
        
        if (!highlightId) return;

        const timer = setTimeout(() => {
            
            const el = document.getElementById(`task-${highlightId}`);
                                        
            if (el) {
                el.scrollIntoView({behavior: 'smooth', block: 'center'});
                el.classList.add('ring-2', 'ring-blue-500');
                setTimeout(() => {
                    el.classList.remove('ring-2', 'ring-blue-500'); 
                }, 1200);
            }

        }, 300);

        return () => clearTimeout(timer);
    
    }, []);

    return (

        // Appshell provides global layout
        <AppShell>

            {/* Top row: search bar + buttons */}
            <div className="flex flex-row justify-between">

                {/* Search bar */}
                <div className="relative w-full">

                    <input
                        value={searchQuery}
                        aria-label="Search tasks"
                        onChange={(t) => {
                            t.stopPropagation()
                            setSearchQuery(t.target.value)
                        }}
                        placeholder="Search task"
                        className="flex-1 border-[var(--f-main)] bg-[var(--baseAcc-b)] text-[var(--text-c)] outline-none shadow items-center search-bar"
                    />
                    
                    {/* Search results */}
                    {searchQuery && searchResults.length > 0 && (
                        <div 
                            role="listbox"
                            aria-label="Search results"
                            className="absolute top-full w-full leading-tight border-[var(--f-main)] bg-[var(--baseAcc-b)] text-[var(--text-b)] shadow z-30 overflow-x-hidden overflow-y-auto search-bar-results"
                        >
                            {searchResults.map(task => (

                                <motion.div
                                    key={task.id}
                                    role="button"
                                    tabIndex={0}
                                    aria-label={`See task ${task.title}`}
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
                                            setSearchQuery('');

                                            const el = document.getElementById(`task-${task.id}`);
                                            
                                            if (el) {
                                                el.scrollIntoView({behavior: 'smooth', block: 'center'});
                                                el.classList.add('ring-2', 'ring-blue-500');
                                                setTimeout(() => {
                                                el.classList.remove('ring-2', 'ring-blue-500'); 
                                                }, 1200);
                                            }
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
                                        <p>{formatDate(task.due)}</p>
                                    </div>
                                
                                    <p className="w-full truncate">{task.description || '(No description)'}</p>
                                
                                </motion.div>
                            ))}
                        </div>
                    )}
                </div>
                
                {/* Layout toggle and create task buttons */}
                <div className="flex flex-row gap-1">

                    {/* Layout toggle */}
                    <button
                        aria-label="Toggle grid layout"
                        className="prim-act-btn task-layout-btn"
                        onClick={() => setGrid(!grid)}
                    >
                        <img
                            src={grid ? ICONS[theme].row : ICONS[theme].grid}
                            alt=""
                            aria-hidden="true"
                        />
                    </button>

                    {/* Add task button */}
                    <AddTask />

                </div>
            </div>

            {/* Batch functions section / toolbar */}
            {(selectedIds.length > 0) && (

                <div 
                    role="toolbar"
                    aria-label="Batch task actions"
                    className="flex flex-row batch-func"
                >

                    {/* Select/unselect multiple items */}
                    <button 
                        aria-label="Select all visible tasks"
                        title="Select all"
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

                    {/* Mark as complete */}
                    {showTasks !== 'completed' 
                        ? 
                            <button
                                aria-label="Mark selected tasks as complete"
                                title="Mark as complete"
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
                            // Mark as incomplete
                            <button
                                aria-label="Mark selected tasks as incomplete"
                                title="Mark as incomplete"
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

                    {/* Delete */}
                    <button 
                        aria-label="Delete selected tasks"
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

            {/* Main section with tasks listed */}
            <motion.div
                role="list" 
                aria-label="Task list" 
                layout
                transition={easeTransition}
                className="flex flex-col min-h-0 h-full overflow-hidden min-w-0 z-0 overflow-y-visible"
            >
                
                {/* Table header row */}
                {!grid && filtered.length > 0 && (
                
                    <motion.div 
                        aria-hidden="true"
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

                {/* Container morphs */}
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
                            role="listitem"
                            aria-label={`Task ${task.title}`}
                            transition={easeTransition}
                            className={`bg-[var(--baseAcc-b)] ${grid ? 'rounded-lg border-[0.005rem] border-[var(--e-main)]' : ''}`}
                        >
                            {/* Content morphs */}
                            <motion.div
                                layout
                                className={
                                    grid
                                    ? `flex flex-col gap-2 p-4 rounded-lg shadow-md h-full ${(new Date(task.due).getTime() < Date.now()) ? 'border-[0.2rem] border-[var(--priorityHigha)]' : ''}` 
                                    : `${showTasks !== 'completed' ? 'grid grid-cols-[0.1fr_1fr_2fr_0.4fr_0.8fr_0.6fr]' : 'grid grid-cols-[0.1fr_1fr_2.4fr_0.4fr_0.6fr]'} justify-start items-center text-left email-grid px-1 py-1.5 border-y-[0.005rem] border-[var(--e-main)] 
                                    ${(new Date(task.due).getTime() < Date.now()) ? 'border-[0.2rem] border-[var(--priorityHigha)]' : ''}`
                                }
                            >
                                {/* Checkbox */}
                                {!grid && (
                                    <input 
                                        aria-label="Select task"
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

                                {/* Task info */}
                                <div className={grid ? 'flex flex-row justify-between' : 'truncate'}>
                                    {!grid 
                                        ? <p className="font-semibold truncate">{task.title}</p>
                                        : <h6 className="font-semibold">{task.title}</h6>
                                    }

                                    {/* Dropdown menu */}
                                    {grid && <TaskFunctionsMenu
                                        onComplete={() => toggleComplete(task.id)}
                                        onDelete={() => toggleDelete(task.id)}
                                        completed={task.completed}
                                    />}
                                </div>

                                <p className={!grid ? "truncate" : ''}>{task.description || '(No description)'}</p>

                                <div className={grid ? `flex flex-row gap-2 items-center` : `text-center ${(new Date(task.due).getTime() < Date.now()) ? 'bg-[var(--priorityHighb)] rounded-sm' : ''}`}>
                                    {grid &&
                                        <img
                                            src={ICONS[theme].date}
                                        />
                                    }
                                    <p>{grid ? 'Due:' : ''} {formatDate(task.due)}</p>
                                </div>

                                {/* Task progress bar */}
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

                                {/* Progress button */}
                                {showTasks !== 'completed' &&
                                    <div className={grid ? 'flex flex-row gap-2 items-center' : ''}>
                                        {grid && (
                                            <p className="text-[var(--text-b)] leading-tight group-label">Progress</p>
                                        )}

                                    <div className="flex items-center justify-center">
                                            
                                            <button 
                                                aria-label="Change task progress"
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
                                                {/* Task progress indicator */}
                                                <div 
                                                    className={`rounded-full p-[0.12rem] border-[0.1rem] 
                                                    ${task.progress === 'Not started' 
                                                        ? 'bg-[var(--progressNotb)] border-[var(--progressNota)]' 
                                                        : task.progress === 'Almost complete' 
                                                        ? 'bg-[var(--progressAlmostb)] border-[var(--progressAlmosta)]' 
                                                        : 'bg-[var(--progressInb)] border-[var(--progressIna)]'}`} 
                                                />
                                                
                                                <p className="text-xs text-left whitespace-nowrap">
                                                    {task.progress === 'Not started' ? 'Not started' : task.progress === 'Almost complete' ? 'Almost complete' : 'In progress'}
                                                </p>
                                            </button>
                                        </div> 
                                    </div>
                                }

                                {/* Priority button */}
                                <div className={grid ? 'flex flex-row gap-4 items-center' : ''}>
                                    
                                    {grid && (
                                        <p className="text-[var(--text-b)] leading-tight group-label">Priority</p>
                                    )}
                                    
                                    <div className="flex items-center justify-center">
                                        
                                        <button 
                                            aria-label="Change task priority"
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
                                                    alt="Task priority"
                                                />

                                                <p className="text-xs text-left">
                                                    {task.priority === 'high' ? 'High' : task.priority === 'low' ? 'Low' : 'Normal'}
                                                </p>
                                        </button>
                                    </div>
                                </div>
                            </motion.div>
                        </motion.div>
                    ))}
                </motion.div>

                {/* Empty state */}
                {filtered.length === 0 && (
                    
                    <motion.div 
                        
                        key="empty"
                        initial={{opacity:0}}
                        animate={{opacity:1}}
                        exit={{opacity:0}}
                        transition={easeTransition}
                        className="
                            overflow-hidden
                            sm:m-1
                            md:m-2
                            lg:m-4
                            xl:m-4
                            2xl:m-4
                        ">
                        <p className="text-center">
                            No tasks found.
                        </p>

                    </motion.div>
                    
                )}
           </motion.div>
        </AppShell>
    );
}