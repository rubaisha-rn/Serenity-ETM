'use client';

import Header from "@/components/header";
import Image from "next/image";
import AppShell from "@/shells/appShell";
import ThinFooter from "@/components/footers/thinFooter";
import PrototypeTag from '@/components/prototypeTag';
import { useTaskStore } from "@/store/taskStore";
import useStore from "@/store/useStore";
import { motion } from "framer-motion";

export default function TasksPage() {

    const {tasks, toggleComplete} = useTaskStore();
    const {emotionValue, focusMode, expandedSecondary, expandedMain} = useStore();

    const filtered = tasks.filter((t) =>
        focusMode ? t.priority === 'high' : true
    );

    const sorted = focusMode
        ? [...filtered].sort((a, b) => Number(a.completed) - Number(b.completed))
        : filtered;

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