/**
 * Dashboard screen
 * 
 * Displays weekly focus activity chart, current day's inferred mood, top three priority emails and tasks.
 */
'use client';

import { useEffect, useMemo } from "react";
import { useRouter } from "next/navigation";
import AppShell from "@/shells/appShell";
import useStore from "@/store/useStore";
import { useTaskStore } from "@/store/taskStore";
import { useEmailStore } from "@/store/emailStore";
import { ResponsiveContainer, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip } from "recharts";
import { motion } from "framer-motion";
import { supabase } from "@/lib/supabaseClient";
import { ICONS } from "@/lib/assets";
import formatDate from "@/components/formatDate";

// Weekly focus grouping used to populate the weekly focus triggers bar chart
function getWeeklyFocusCounts(triggers) {

    const days = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
    const counts = {Sun:0, Mon:0, Tue:0, Wed:0, Thu:0, Fri:0, Sat:0}; 

    // Get date for exactly a week ago
    const now = new Date();
    const weekAgo = new Date();
    weekAgo.setDate(now.getDate() - 6);

    // Map triggers to each day
    triggers.forEach(ts => {
        const d = new Date(ts);
        if (d >= weekAgo) {
            counts[days[d.getDay()]]++;
        }
    });

    return days.map(day => ({
        day,
        count: counts[day]
    }));
}

// Today's mood based on focus activation score
function getTodayFocusCount(triggers) {

    const today = new Date().toDateString();
    
    return triggers.filter(ts => new Date(ts).toDateString() === today).length;
}

// Priority sort
function sortByPriority(items) {
    
    const rank = {high: 3, normal: 2, low: 1};

    // Items sorted based on priority sliced to three
    return [...items]
        .sort((a, b) => {
            const pa = rank[a.priority ?? 'normal'];
            const pb = rank[b.priority ?? 'normal'];
            return pb - pa;
        })
        .slice(0, 3);
}

export default function DashboardPage () {

    // Global states
    const theme = useStore((s) => s.theme);
    const {focusTriggers, loadFocusTriggers, setScreen} = useStore();
    const {emails, loadEmails, classifyMissingEmails, setSelectedEmail, markAsRead, readEmailCount, setReadEmailCount, setShowComposer} = useEmailStore();
    const {tasks, loadTasks, classifyMissingTasks, setGrid} = useTaskStore();

    // Navigation
    const router = useRouter();

    // Init
    useEffect(() => {
        
        const init = async () => {
                    
            const {data} = await supabase.auth.getSession();

            // No session? re-route to sign in page
            if (!data.session) {
                router.push('/signin');
                return;
            }

            // Load and classify email and tasks, load focus triggers
            await Promise.all([
                loadEmails(),
                loadTasks(),
                classifyMissingEmails(),
                classifyMissingTasks(),
                loadFocusTriggers()
            ])
        }

        init();

    }, [])

    // Get mood label and colour from today's focus count
    function getMoodFromFocusCount(count) {
        
        if (count === 0) return {label: 'Calm', colour: theme === 'light' ? 'bg-blue-600 bg-opacity-60' : 'bg-blue-900 opacity-80'};
        
        if (count === 1) return {label: 'Stable', colour: theme === 'light' ? 'bg-green-600 bg-opacity-60' : 'bg-green-900'}
        
        if (count === 2) return {label: 'Alert', colour: theme === 'light' ? 'bg-yellow-600 bg-opacity-60' : 'bg-yellow-900'}
        
        if (count <= 4) return {label: 'Stressed', colour: theme === 'light' ? 'bg-orange-600 bg-opacity-60' : 'bg-orange-800 opacity-80'}
        
        return {label: 'Overwhelmed', colour: theme === 'light' ? 'bg-red-600 bg-opacity-60' : 'bg-red-900'}
    }

    // Memoized data calculations
    const weeklyFocusData = useMemo(
        () => getWeeklyFocusCounts(focusTriggers || []),
        [focusTriggers]
    );

    const todayFocusCount = useMemo(
        () => getTodayFocusCount(focusTriggers || []),
        [focusTriggers]
    );

    const todayMood = useMemo(
        () => getMoodFromFocusCount(todayFocusCount),
        [todayFocusCount]
    );

    const topPriorityEmails = useMemo(
        () => sortByPriority(
            (emails || []).filter(e =>
                !e.is_delete && e.folder !== 'archive'
            )
        ),
        [emails]
    );

    const topPriorityTasks = useMemo(
        () => sortByPriority(
            (tasks || []).filter(t =>
                !t.is_delete && !t.completed
            )
        ),
        [tasks]
    );

    // Animation easing
    const easeTransition = {
        duration: 0.65,
        ease: [0.16, 1, 0.3, 1]
    };

    return (

        // Global layout
        <AppShell>

            <div 
                className="flex flex-col min-h-0 h-screen overflow-x-hidden overflow-y-auto min-w-0 z-0 dashboard"
                aria-labelledby="dashboard-heading"
            >
                {/* Hidden heading for screen readers */}
                <h1 id="dashboard-heading" className="sr-only">Dashboard overview</h1>
                
                {/* Left section */}
                <div className="flex flex-col sm:gap-2 md:gap-3 lg:gap-4 xl:gap-4 2xl:gap-4">

                    {/* Weekly focus chart */}
                    <section 
                        className="focus-chart-outer bg-[var(--baseAcc-b)] border-[var(--focusModeInt)]"
                        role="region"
                        aria-labelledby="weekly-focus-heading"
                    >
                        
                        <h4 
                            id="weekly-focus-heading"
                            className="font-bold text-center my-1 text-[var(--text-a)]"
                        >
                                Focus Mode This Week
                        </h4>
                        
                        {/* Screen reader chart summary */}
                        <p className="sr-only">Bar chart showing focus activations for each day over the past week</p>

                        {/* Screen reader alternatives */}
                        <ul className="sr-only">
                            {weeklyFocusData.map(d => (
                                <li key={d.day}>
                                    {d.day}: {d.count} activations
                                </li>
                            ))}
                        </ul>

                        <div className="focus-chart-inner">
                            
                            <ResponsiveContainer width="100%" height="100%">
                            
                                <BarChart data={weeklyFocusData}>

                                    {/* background */}
                                    <CartesianGrid 
                                        strokeDasharray="4 4" 
                                        stroke="var(--e-main)"
                                    />

                                    {/* x-axis (days) */}
                                    <XAxis
                                        dataKey='day'
                                        tick={{fill: 'var(--text-b)', fontSize: 10}}
                                        axisLine={false}
                                        tickLine={false}
                                    />

                                    {/* y axis */}
                                    <YAxis
                                        allowDecimals={false}
                                        tick={{fill: 'var(--text-b)', fontSize: 10}}
                                        axisLine={false}
                                        tickLine={false}
                                    />

                                    {/* tooltip */}
                                    <Tooltip
                                        contentStyle={{
                                            backgroundColor: 'var(--baseAcc-b)',
                                            border: '1px solid var(--f-main)',
                                            borderRadius: '6px',
                                        }}
                                    />

                                    {/* bars */}
                                    <Bar
                                        dataKey='count'
                                        radius={[8, 8, 0, 0]}
                                        fill={`${todayFocusCount > 4 ? 'var(--focusMode)' : 'var(--focusModeHover)'}`}
                                        animationDuration={800}
                                    />

                                </BarChart>

                                {/* If no data is found */}
                                {weeklyFocusData.length === 0 && (
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
                                        ">No data found.</p>
                                    </motion.div>
                                )}
                            </ResponsiveContainer>
                        </div>
                    </section>

                    {/* Bottom row: mood + priority emails */}
                    <div className="flex flex-row dashboard-bottom-row">

                        {/* Mood */}
                        <div
                            role="region"
                            aria-labelledby="today-mood-heading" 
                            className={`mood-outer text-white border-[var(--priorityLowb)] bg-[var(--baseAcc-b)]`}
                        >
                            <div className={`flex flex-col mood-inner ${todayMood.colour} justify-between`}>
                                
                                <h6 
                                    id="today-mood-heading" className="opacity-80"
                                >
                                    Today's Mood
                                </h6>

                                <h1 
                                    className="sm:text-xl md:text-2xl lg:text-3xl xl:text-3xl 2xl:text-4xl font-bold mt-1"
                                >
                                    {todayMood.label}
                                </h1>

                                <p className="mt-2">
                                    {todayFocusCount} focus activations today.
                                </p>

                            </div>
                        </div>

                        {/* Emails */}
                        <div 
                            role="region"
                            aria-labelledby="priority-emails-heading"
                            className={`flex flex-col email-outer text-white border-[var(--progressNotc)] bg-[var(--baseAcc-b)]`}
                        >

                            <h6 
                                id="priority-emails-heading"
                                className="font-bold text-center text-[var(--text-a)]"
                            >
                                My Priority Emails
                            </h6>

                            <div className="dashboard-email-grid text-[var(--text-c)] sm:px-1 md:px-1 lg:px-2 xl:px-2 2xl:px-4">
                                <p className="group-label">From</p>
                                <p className="group-label">Subject</p>
                                <p className="group-label">Date</p>
                            </div>

                            {topPriorityEmails.map((mail) => (
                                <motion.button
                                    key={mail.id}
                                    role="button"
                                    tabIndex={0}
                                    aria-label="Emails"
                                    className="bg-[var(--bg)] email-inner text-[var(--text-b)]"
                                    onClick={() => {
                                        setScreen('email');
                                        router.push('/emails');
                                        setShowComposer(false)
                                        setSelectedEmail(mail)
                                        markAsRead(mail.id)
                                        setReadEmailCount(readEmailCount+1)
                                    }}
                                    onKeyDown={(e) => {
                                        if (e.key === 'Enter' || e.key === ' ') {
                                            e.preventDefault();
                                            setScreen('email');
                                            router.push('/emails');
                                            setShowComposer(false)
                                            setSelectedEmail(mail)
                                            markAsRead(mail.id)
                                            setReadEmailCount(readEmailCount+1)
                                        }
                                    }}
                                >
                                    <div className="dashboard-email-grid">
                                        <p className="truncate">{mail.from_name || mail.from_email}</p>
                                        <p className="truncate">{mail.subject || '(No subject)'}</p>
                                        <p>{formatDate(mail.timestamp)}</p>
                                    </div>
                                </motion.button>
                            ))}

                            {/* In case no emails are found */}
                            {topPriorityEmails.length === 0 && (
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
                                    ">No emails found.</p>
                                </motion.div>
                            )}

                        </div>
                    </div>
                </div>

                {/* Right section: tasks */}
                <div 
                    role="region"
                    aria-labelledby="priority-tasks-heading"
                    className={`task-outer flex flex-col text-white bg-[var(--baseAcc-b)] border-[var(--priorityNormalb)]`}
                >

                    <h6 
                        id="priority-tasks-heading"
                        className="font-bold text-center text-[var(--text-a)]"
                    >
                        My Priority Tasks
                    </h6>
                        
                    <motion.div
                        layout
                        transition={easeTransition}
                        className="flex flex-col task-inner text-[var(--text-a)]"
                    >
                        {topPriorityTasks.map((task) => (
                            <motion.button
                                id={`task-${task.id}`}
                                key={task.id}
                                role="button"
                                tabIndex={0}
                                aria-labelledby="Tasks"
                                layout
                                transition={easeTransition}
                                className={`bg-[var(--baseAcc-b)] rounded-lg`}
                                onClick={() => {

                                    setScreen('tasks');
                                    router.push(`/tasks?highlight=${task.id}`);
                                    setGrid(true);
                                }}
                                onKeyDown={(e) => {
                                    if(e.key === 'Enter' || e.key === ' ') {

                                        setScreen('tasks');
                                        router.push(`/tasks?highlight=${task.id}`);
                                        setGrid(true);
                                    }
                                }}
                            >
                                {/* Content morphs */}
                                <motion.div
                                    layout
                                    className='flex flex-col task-box'
                                >
                                    {/* Task details */}
                                    <h6 className="font-semibold">{task.title}</h6>
                                    <p className="truncate">{task.description || '(No description)'}</p>
    
                                    <div className="flex flex-row gap-1 items-center">
                                        <img
                                            src={ICONS[theme].date}
                                        />
                                        <p>Due: {formatDate(task.due)}</p>
                                    </div>

                                    {/* Progress label */}
                                    <div className='flex flex-row gap-2 items-center'>
                                        
                                        <p className="text-[var(--text-b)] leading-tight group-label">Progress</p>

                                        <div 
                                            className={`flex flex-row justify-center items-center progress-tag 
                                            ${task.progress === 'Not started' ? 'bg-[var(--progressNotc)] border-[var(--progressNota)] text-[var(--progressNott)]' :
                                            task.progress === 'Almost complete' ? 'bg-[var(--progressAlmostc)] border-[var(--progressAlmosta)] text-[var(--progressAlmostt)]'
                                            : 'bg-[var(--progressInc)] border-[var(--progressIna)] text-[var(--progressInt)]'}`}>

                                            <div className={`rounded-full p-[0.12rem] border-[0.1rem] 
                                                ${task.progress === 'Not started' ? 'bg-[var(--progressNotb)] border-[var(--progressNota)]' :
                                                task.progress === 'Almost complete' ? 'bg-[var(--progressAlmostb)] border-[var(--progressAlmosta)]' : 'bg-[var(--progressInb)] border-[var(--progressIna)]'}`} />
                                                
                                                <p className="text-xs text-left whitespace-nowrap">{task.progress === 'Not started' ? 'Not started' : task.progress === 'Almost complete' ? 'Almost complete' : 'In progress'}</p>
                                        </div> 
                                    </div>
                                    
                                    {/* Priority label */}
                                    <div className='flex flex-row gap-4 items-center'>
                                        
                                        <p className="text-[var(--text-b)] leading-tight group-label">Priority</p>

                                        <div 
                                            className={`flex flex-row justify-center items-center priority-tag
                                            ${task.priority === 'high' ? 'bg-[var(--priorityHighc)] border-[var(--priorityHigha)] text-[var(--priorityHight)]' :
                                            task.priority === 'low' ? 'bg-[var(--priorityLowc)] border-[var(--priorityLowa)] text-[var(--priorityLowt)]'
                                            : 'bg-[var(--priorityNormalc)] border-[var(--priorityNormala)] text-[var(--priorityNormalt)]'}`}>
                                            
                                            <img
                                                src={task.priority === 'high' ? ICONS[theme].redflag :
                                                task.priority === 'low' ? ICONS[theme].greyflag : ICONS[theme].yellowflag}
                                            />
                                            <p className="text-xs text-left">{task.priority === 'high' ? 'High' : task.priority === 'low' ? 'Low' : 'Normal'}</p>

                                        </div>
                                    </div>
                                </motion.div>
                            </motion.button>
                        ))}

                        {/* If no tasks are found */}
                        {topPriorityTasks.length === 0 && (
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
                </div>
            </div>
        </AppShell>    
    );
}
