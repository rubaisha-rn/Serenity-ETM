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

export default function TasksPage() {

    const {tasks, toggleComplete} = useTaskStore();
    const {emotionValue, focusMode, setFocusMode, priorityMode, expandedSecondary, expandedMain, showTasks} = useStore();
    const [sorted, setSorted] = useState([]);

    useEffect(() => {
        let results = tasks;
        const today = new Date().toISOString().split('T')[0];

        if(emotionValue > 70) {

            setFocusMode(true);
            results = results.filter((t) => t.priority === 'high').slice(0,3);
            results = results.sort(sortTasks);

        } else {

            if (priorityMode) {
                results = results.filter((t) => t.priority === 'high');
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
            today.setDate(today.getDate() + 1);
            
            if (showTasks === 'today') {
                results = results.filter((t) => {
                    if (!t.due) return false;
                    const [day, month, year] = t.due.split('-');
                    const taskDate = new Date(`${year}-${month}-${day}`);
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
                    if (!t.due) return false;
                    const [day, month, year] = t.due.split('-');
                    const taskDate = new Date(`${year}-${month}-${day}`);
                    taskDate.setHours(0, 0, 0, 0);
                    return taskDate.getTime() >= today.getTime();
                });
            }
        }
        results.sort(sortTasks);
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
                    <div className="absolute bottom-2 right-100 z-30">
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
                                        className={`p-4 rounded-xl shadow
                                        grid grid-cols-[40px_3fr_100px_100px] gap-4 items-center text-left ${task.completed ? `${completedTasksClasses[theme][stressPalette]}` : 'bg-white-200'}`}
                                    >

                                        <div>
                                            <input
                                                type='checkbox'
                                                id='accept'
                                                checked={task.completed}
                                                onChange={() => toggleComplete(task.id)}
                                                className='w-4 h-4 accent-blue-500'
                                            />
                                        </div>
                                        <div>
                                            <p className={`font-medium ${task.completed ? 'line-through text-gray-400' : ''}`}>
                                                {task.title}
                                            </p>
                                        </div>
                                        <div>
                                            <p className={`font-medium ${task.completed ? 'line-through text-gray-400' : ''}`}>
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

function sortTasks(a, b) {
    const priorityOrder = {high: 3, medium: 2, low: 1};

    if (a.completed !== b.completed) return a.completed ? 1 : -1;

    if (priorityOrder[b.priority] !== priorityOrder[a.priority]) {
        return priorityOrder[b.priority] - priorityOrder[a.priority];
    }

    const dateA = new Date(a.due).getTime();
    const dateB = new Date(b.due).getTime();
    if (dateA !== dateB) return dateA-dateB;

    if(a.completed !== b.completed) return a.completed ? 1 : -1;

    return 0;
}