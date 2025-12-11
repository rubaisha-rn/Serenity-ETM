// 'use client';

import { useState, useEffect, use } from "react";
import { motion, AnimatePresence } from "framer-motion";
import useStore from "@/store/useStore";
import { useTaskStore } from "@/store/taskStore";
import { useRouter } from "next/navigation";

export default function AddTask() {

    const router = useRouter();

    const {emotionValue} = useStore();
    const {addTask} = useTaskStore();
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

    const [open, setOpen] = useState(false);

    const [title, setTitle] = useState('');
    const [due, setDue] = useState('');
    const [priority, setPriority] = useState('low');

    const submitTask = () => {
        if (!title.trim()) return;

        addTask({
            title, 
            due,
            created: new Date().toISOString().split('T')[0],
            priority,
            completed: false,
            id: crypto.randomUUID(),
        });

        setTitle('');
        setDue('');
        setPriority('low');
        setOpen(false);
    };

    const palette = {
        bg: {
            light: {
                low: 'bg-light-low-card',
                mid: 'bg-light-mid-card',
                high: 'bg-light-high-card',
            },
            dark: {},
        },
        acc: {
            light: {
                low: 'bg-light-low-acc hover:bg-light-low-accHover',
                mid: 'bg-light-mid-acc hover:bg-light-mid-accHover',
                high: 'bg-light-high-acc hover:bg-light-high-accHover',
            },
            dark: {},
        },
        text: {
            light: 'text-light-textA',
            dark: '',
        },
    };

    if (!palette) return null;

    return (
        <>
            {/* add task button */}
            <motion.button
                whileHover={{scale: 1.05}}
                whileTap={{scale: 0.95}}
                onClick={() => setOpen(true)}
                className={`px-4 py-2 rounded-lg ${palette.acc[theme][stressPalette]} text-sm`}
            >
                + Add Task
            </motion.button>

            {/* modal */}
            <AnimatePresence>
                {open && (
                    <motion.div
                        className="fixed inset-0 bg-black bg-opacity-30 backdrop-blur-sm flex items-center justify-center z-50"
                        initial={{opacity: 0}}
                        animate={{opacity: 1}}
                        exit={{opacity: 0}}
                    >
                        <motion.div
                            initial={{scale: 0.8, opacity: 0}}
                            animate={{scale: 1, opacity: 1}}
                            exit={{scale: 0.8, opacity: 0}}
                            transition={{type:'spring', stiffness: 200, damping: 20}}
                            className={`p-6 rounded-xl w-80 shadow-xl ${palette.bg[theme][stressPalette]}`}
                        >
                            <h2 className={`text-lg font-semi-bold mb-4 ${palette.text[theme]}`}>
                                Add New Task
                            </h2>

                            <div className="space-y-3">
                                <input
                                    type="text"
                                    value={title}
                                    onChange={(e) => setTitle(e.target.value)}
                                    placeholder="Task Title"
                                    className="w-full p-2 rounded-md border focus:outline-none"
                                />

                                <input
                                    type="date"
                                    value={due}
                                    onChange={(e) => setDue(e.target.value)}
                                    placeholder="Task Title"
                                    className="w-full p-2 rounded-md border focus:outline-none"
                                />

                                <select
                                    value={priority}
                                    onChange={(e) => setPriority(e.target.value)}
                                    className="w-full p-2 rounded-md border focus:outline-none"
                                >
                                    <option value='low'>Low Priority</option>
                                    <option value='medium'>Medium Priority</option>
                                    <option value='high'>High Priority</option>
                                </select>
                            </div>

                            <div className="flex justify-end gap-3 mt-5">
                                <button
                                    className="px-3 py-1 text-sm bg-gray-200 rounded-md"
                                    onClick={() => setOpen(false)}
                                >
                                    Cancel
                                </button>

                                <button
                                    className="px-3 py-1 text-sm bg-gray-200 rounded-md"
                                    onClick={submitTask}
                                >
                                    Add
                                </button>

                            </div>

                        </motion.div>
                    </motion.div>
                )}
            </AnimatePresence>
        </>
    );
}