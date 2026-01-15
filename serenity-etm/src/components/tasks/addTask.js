'use client';

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import useStore from "@/store/useStore";
import { useTaskStore } from "@/store/taskStore";

export default function AddTask() {

    const {setTheme} = useStore();
    const {addTask} = useTaskStore();

    const [open, setOpen] = useState(false);
    const [title, setTitle] = useState('');
    const [due, setDue] = useState('');
    const [priority, setPriority] = useState('low');
    const [error, setError] = useState('');

    useEffect(() => {
        const darkModeEnabled = document.documentElement.classList.contains('dark');
        setTheme(darkModeEnabled ? 'dark' : 'light');
    }, []);

    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const todayStr = today.toISOString().split('T')[0];

    const isValidDate = (dateStr) => {
        if(!dateStr) return false;
        
        const selected = new Date(dateStr);
        selected.setHours(0, 0, 0, 0);

        if (isNaN(selected.getTime())) return false;

        return selected >= today;
    }

    const submitTask = () => {
        if (!title.trim()) {
            setError('Task title is required.');
            return;
        };

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

    return (
        <>
            {/* add task button */}
            <motion.button
                whileHover={{scale: 1.05}}
                whileTap={{scale: 0.95}}
                onClick={() => setOpen(true)}
                className={`px-4 py-1.5 rounded-lg bg-[var(--acc-main)] hover:bg-[var(--accHover-main)] border-2 border-[var(--a-main)] text-sm text-[var(--text-d)]`}
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
                            className={`p-6 rounded-xl w-80 shadow-xl bg-[var(--bg-main)]`}
                        >
                            <h2 className={`text-lg font-semi-bold mb-4 text-[var(--text-a)]`}>
                                Add New Task
                            </h2>

                            <div className="space-y-3">
                                <input
                                    type="text"
                                    value={title}
                                    onChange={(e) => setTitle(e.target.value)}
                                    placeholder="Task Title"
                                    className="w-full text-sm p-2 rounded-md border focus:outline-none"
                                />

                                <input
                                    type="date"
                                    value={due}
                                    min={new Date().toISOString().split('T')[0]}
                                    onChange={(e) => setDue(e.target.value)}
                                    placeholder="Task Title"
                                    className="w-full p-2 text-sm rounded-md border focus:outline-none"
                                />

                                <select
                                    value={priority}
                                    onChange={(e) => setPriority(e.target.value)}
                                    className="w-full p-2 text-sm rounded-md border focus:outline-none"
                                >
                                    <option value='low'>Low Priority</option>
                                    <option value='medium'>Medium Priority</option>
                                    <option value='high'>High Priority</option>
                                </select>
                            </div>

                            {error && (
                                <p className="text-xs text-[var(--danger)] mt-1">{error}</p>
                            )}

                            <div className="flex justify-end gap-3 mt-5">
                                
                                <button
                                    className="px-3 py-1 text-sm bg-[var(--icons-main)] hover:bg-[var(--iconsHover-main)] rounded-md"
                                    onClick={() => setOpen(false)}
                                >
                                    Cancel
                                </button>

                                <button
                                    className="px-3 py-1 text-sm bg-[var(--a-main)] hover:bg-[var(--aHover-main)] rounded-md"
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