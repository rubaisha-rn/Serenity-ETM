import { create } from "zustand";
import { supabase } from "@/lib/supabaseClient";
import { complex } from "framer-motion";

export const useTaskStore = create((set, get) => ({

    tasks: [],
    completedTasksCount: 0,

    classifyMissingTasks: async () => {

        const tasks = get().tasks
        const unclassified = tasks.filter(
            t => t.priority_src == 'ai'
        )

        for (const task of unclassified) {
            const res = await fetch('/api/classify', {
                method: "POST",
                headers: {'Content-Type': 'application/json'},
                body: JSON.stringify({
                    text: `$task$ ${task.title} ${task.description}`
                })
            })

            const result = await res.json()

            await supabase
                .from('tasks')
                .update({
                    priority: result.priority
                })
                .eq('id', task.id)
        }

        get().loadTasks()
    },

    loadTasks : async () => {
        const {data, error} = await supabase
            .from('tasks')
            .select('*')
            .order('due_date', {ascending: false})

        if (!error) {
            const normalised = data.map(t => ({
                ...t,

                completed: t.completed ?? false,
                timestamp: t.timestamp || t.created_at,
                priority: t.priority || 'low',
                due: t.due_date,
                due_display: t.due_date 
                    ? formatToDDMMYY(t.due_date)
                    : null,
            }))

            set({tasks: normalised})
        }
        else {
            console.error('Task fetch error:', error)
        }
    },
    
    addTask: async (task) => {

        const {data: sessionData} = await supabase.auth.getSession()
        if (!sessionData.session) return
        
        await supabase
            .from('tasks')
            .insert([{
                user_id: sessionData.session.user.id,
                ...task,
                completed: false,
                
                priority: null,
                priority_src: 'ai',
            }])

        get().loadTasks()
    },

    toggleComplete: async (id) => {

        const task = get().tasks.find(t => t.id === id)
        if (!task) return
        
        await supabase
            .from('tasks')
            .update({
                completed: !task.completed
            })
            .eq('id', id)

        get().loadTasks()
    },

    updateTask: async (id, updated) => {

        await supabase
            .from('tasks')
            .update({
                updated
            })
            .eq('id', id)

        get().loadTasks()
    },

    setCompletedTasksCount: (count) => set({completedTasksCount: count}),
}));

function formatToDDMMYY(dateStr) {
    const [year, month, day] = dateStr.split('-')
    return `${day}-${month}-${year}`
}