'use client';

import Header from "@/components/header";
import Image from "next/image";
import AppShell from "@/shells/appShell";
import ThinFooter from "@/components/footers/thinFooter";
import PrototypeTag from '@/components/prototypeTag';
import { useTaskStore } from "@/store/taskStore";
import useStore from "@/store/useStore";
import { motion } from "framer-motion";
import { useEffect, useState } from "react";
import AddTask from "@/components/tasks/addTask";
import { ZCOOL_KuaiLe } from "next/font/google";

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
            
            if (showTasks === 'today') {
                results = results.filter((t) => t.due === today);
            }
            else if (showTasks === 'completed') {
                results = results.filter((t) => t.completed);
            }
            else if (showTasks === 'priority') {
                results = results.filter((t) => t.priority === 'high');
            }
            else if (showTasks === 'upcoming') {
                results = results.filter((t) => t.due >= today);
            }
        }
        results.sort(sortTasks);
        setSorted(results);
    }, [tasks, showTasks, focusMode, priorityMode, emotionValue]);

    const mainWidth = expandedMain ? 220 : 40;
    const secondaryWidth = expandedSecondary ? 200 : 40;
    const contentMargin = mainWidth + secondaryWidth;

    return (
        <div className="bg-light-mid-bg">

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

                <motion.div className='space y-3 transition-all duration-300'
                    style={{marginLeft: contentMargin}}
                >
                    <AddTask />

                    {focusMode && (
                        <div className="p-3 rounded-xl bg-red-100 text-red-800 text-sm">
                            Smart Focus Mode: Showing only urgent tasks.
                        </div>
                    )}

                    {sorted.map((task) => (
                        <motion.div
                            key={task.id}
                            initial={{opacity: 0, y:10}}
                            animate={{opacity: 1, y: 0}}
                            className="p-4 bg-white rounded-xl shadow flex items-center justify-between"
                        >
                            <div>
                                <p className={`font-medium ${task.completed ? 'line-through' : ''}`}>
                                    {task.title}
                                </p>
                                <p className="text-xs text-gray-500">Due: {task.due}</p>
                            </div>

                            <button
                                onClick={() => toggleComplete(task.id)}
                                className="px-3 py-1 text-sm rounded-md bg-gray-200 hover:bg-gray-300"
                            >
                                {task.completed ? 'Undo' : 'Done'}
                            </button>
                        </motion.div>
                    ))}
                </motion.div>

            </AppShell>

            <ThinFooter />

        </div>
    );
}

function sortTasks(a, b) {
    const priorityOrder = {high: 3, medium: 2, low: 1};

    if (priorityOrder[b.priority] !== priorityOrder[a.priority]) {
        return priorityOrder[b.priority] - priorityOrder[a.priority];
    }

    const dateA = new Date(a.due).getTime();
    const dateB = new Date(b.due).getTime();
    if (dateA !== dateB) return dateA-dateB;

    if(a.completed !== b.completed) return a.completed ? 1 : -1;

    return 0;
}