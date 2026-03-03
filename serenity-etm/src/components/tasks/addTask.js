'use client';

import { useState, useEffect } from "react";
import { motion, AnimatePresence, easeInOut } from "framer-motion";
import useStore from "@/store/useStore";
import { useTaskStore } from "@/store/taskStore";
import { ICONS } from "@/lib/assets";

export default function AddTask() {

    const theme = useStore((s) => s.theme);
    const {addTask} = useTaskStore();

    const [open, setOpen] = useState(false);
    const [title, setTitle] = useState('');
    const [description, setDescription] = useState('');
    const [due, setDue] = useState('');
    const [priority, setPriority] = useState('low');
    const [error, setError] = useState('');

    const now = new Date();
    const nowStr = new Date(now.getTime() - now.getTimezoneOffset() * 60000).toISOString().slice(0, 16);

    const isValidDueDateTime = (value) => {
        if(!value) return false;
        return new Date(value).getTime() >= Date.now();
    }

    const submitTask = () => {

        if (!title.trim()) {
            setError('Task title is required.');
            return;
        }

        if (!isValidDueDateTime(due)) {
            setError('Please select a future date & time.');
            return;
        }

        addTask({
            title,
            description, 
            due_date: new Date(due).toISOString(),
            priority: priority || null,
            completed: false,
        });

        setTitle('');
        setDescription('');
        setDue('');
        setPriority('');
        setError('');
        setOpen(false);
    };

    return (
        <>
            {/* add task button */}
            <button
                onClick={() => setOpen(true)}
                className="prim-act-btn"
            >
                <img
                    src={ICONS[theme].add}
                    alt=""
                    aria-hidden='true'
                />
                <h6 className="font-semibold">Create</h6>
            </button>

            {/* modal */}
            <AnimatePresence>
                {open && (
                    <motion.div
                        className="fixed inset-0 bg-black/60 flex items-center justify-center z-[999]"
                        initial={{opacity: 0}}
                        animate={{opacity: 1}}
                        exit={{opacity: 0}}
                    >
                        <motion.div
                            initial={{scale: 0.8, opacity: 0}}
                            animate={{scale: 1, opacity: 1}}
                            exit={{scale: 0.8, opacity: 0}}
                            transition={{duration: 0.25, ease: 'easeInOut'}}
                            className='p-8 rounded-md w-[22rem] shadow-xl gap-2 bg-[var(--baseAcc-b)] flex flex-col items-center'
                        >
                            <h5 className='font-bold text-[var(--text-a)]'>
                                Create Task
                            </h5>

                            {error && (
                                <div className="error-message w-full">
                                    <div className="flex flex-row items-center justify-center gap-1">
                                        <img
                                            src={ICONS[theme].warning}
                                            className="bg-[var(--baseAcc-b)] rounded-full lg:p-0.5"
                                            alt=""
                                            aria-hidden='true'
                                        />
                                        <p className="font-bold">Error!</p>
                                        <p className="text-[var(--text-a)]">{error}</p>
                                    </div>
                                    <button
                                        onClick={() => setError('')}
                                    >
                                        <img
                                            src={ICONS[theme].close}
                                            className="lg:w-[1rem] aspect-square opacity-70"
                                            alt=""
                                            aria-hidden='true'
                                        />
                                    </button>
                                </div>
                            )}

                            <div className="space-y-3">
                                
                                <input
                                    type="text"
                                    value={title}
                                    onChange={(e) => {
                                        setTitle(e.target.value)
                                        setError('');
                                    }}
                                    placeholder="Task Title"
                                    className="w-full text-sm p-2 rounded border bg-[--baseAcc-b] border-[--e-main]"
                                />

                                <textarea
                                    value={description}
                                    onChange={(e) => setDescription(e.target.value)}
                                    placeholder="Short description (optional)"
                                    rows={2}
                                    className="w-full text-sm p-2 rounded border resize-none"
                                />

                                <div className="flex flex-row justify-between gap-2">
                                    <input
                                        type="datetime-local"
                                        value={due}
                                        min={nowStr}
                                        onChange={(e) => {
                                            setDue(e.target.value);
                                            setError('');
                                        }}
                                        className="w-full p-2 text-sm rounded border bg-[--baseAcc-b] border-[--e-main]"
                                    />
                                    
                                    {/* optional priority */}
                                    <select
                                        value={priority}
                                        onChange={(e) => setPriority(e.target.value)}
                                        className="w-full p-2 text-sm rounded border"
                                    >
                                        <option value=''>No Priority</option>
                                        <option value='low'>Low Priority</option>
                                        <option value='normal'>Normal Priority</option>
                                        <option value='high'>High Priority</option>
                                    </select>
                                </div>
                            </div>

                            <div className="flex justify-between gap-3 mt-5">
                                
                                <button
                                    className="error-popup-btn bg-[var(--baseAcc-b)] hover:bg-[var(--f-main)] border-[var(--f-main)] text-[var(--text-a)]"
                                    onClick={() => setOpen(false)}
                                >
                                    <h6 className="font-semibold">Close</h6>
                                </button>

                                <button
                                    className="error-popup-btn bg-[var(--baseAcc-a)] hover:bg-[var(--b-main)] border-[var(--b-main)] text-[var(--text-d)]"
                                    onClick={submitTask}
                                >
                                    <h6 className="font-semibold">Create</h6>
                                </button>
                            </div>
                        </motion.div>
                    </motion.div>
                )}
            </AnimatePresence>
        </>
    );
}