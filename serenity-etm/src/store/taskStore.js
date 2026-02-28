import { create } from "zustand";
import { supabase } from "@/lib/supabaseClient";

export const useTaskStore = create((set, get) => ({

    selectedIds: [],

    toggleSelect: (id) =>
        set(state => ({
            selectedIds: state.selectedIds.includes(id)
                ? state.selectedIds.filter(x => x !== id)
                : [...state.selectedIds, id]
        })),

    clearSelection: () => set({selectedIds: []}),

    selectAllVisible: (ids) => set({selectedIds: ids}),

    markManyComplete: async (ids, complete=true) => {
        if (!ids.length) return

        await supabase
            .from('tasks')
            .update({completed: complete})
            .in('id', ids)

        get().clearSelection()
        get().loadTasks()
    },

    deleteMany: async (ids) => {
   
        if (!ids.length) return

        await supabase
            .from('tasks')
            .update({is_delete: true})
            .in('id', ids)

        get().clearSelection()
        get().loadTasks()
    },

    tasks: [],
    completedTasksCount: 0,

    classifyMissingTasks: async () => {

        const {data: sessionData} = await supabase.auth.getSession();
        if (!sessionData.session) return;

        const tasks = get().tasks;

        const unclassified = tasks.filter(
            t => (t.priority_src === 'rules' || t.priority === 'null')
        );

        if (unclassified.length === 0) return;

        try {
            const results = await Promise.all(
                unclassified.map(async (task) => {
                    try {
                        const res = await fetch('/api/classify', {
                            method: 'POST',
                            headers: {'Content-Type': 'application/json'},
                            body: JSON.stringify({
                                text: `${task.title ?? ""} ${task.description ?? ""}`
                            })
                        });

                        const data = await res.json();

                        return {
                            id: task.id,
                            priority: data.priority,
                            priority_src: 'rules'
                        };
                    }
                    catch {
                        return null;
                    }
                })
            );

            const validUpdates = results.filter(Boolean);

            if (validUpdates.length === 0) return;

            // safe db update - not overwriting user
            for (const update of validUpdates) {
                await supabase
                    .from('tasks')
                    .update({
                        priority: update.priority,
                        priority_src: update.priority_src
                    })
                    .eq('id', update.id)
                    .is('priority', null);
            }

            // update local state
            const updatedTasks = tasks.map(task => {
                const match = validUpdates.find(u => u.id === task.id);
                return match ? {...task, ...match} : task;
            });

            set({tasks: updatedTasks});
        }
        catch (err) {
            console.log("Classification failed.", err);
        }
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
                is_delete: t.is_delete ?? false
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
        
        const {data, error} = await supabase
            .from('tasks')
            .insert([{
                user_id: sessionData.session.user.id,
                ...task,
                completed: false,
                priority_src: task.priority ? 'user' : 'rules',
            }])
            .select();

        console.log('Task insertion result:', {data, error});

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

    toggleDelete: async (id) => {

        const task = get().tasks.find(t => t.id === id)
        if (!task) return
        
        await supabase
            .from('tasks')
            .update({
                is_delete: true
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

    cyclePriority: async (id) => {
        
        const tasks = get().tasks;
        const task = tasks.find(t => t.id === id);
        if (!task) return;

        const order = ['low', 'normal', 'high'];
        const current = task.priority ?? 'normal';
        const currentIndex = order.indexOf(current);

        const nextPriority = order[(currentIndex + 1) % order.length];

        set({
            tasks: tasks.map(t =>
                t.id === id
                ? {...t, priority: nextPriority, priority_src: 'user'}
                : t
            )
        });

        const {error} = await supabase
            .from('tasks')
            .update({
                priority: nextPriority,
                priority_src: 'user'
            })
            .eq('id', id)

        if (error) {
            console.log('Priority update failed.', error);
            set({tasks});
        }
    },

    cycleProgress: async (id) => {
        
        const tasks = get().tasks;
        const task = tasks.find(t => t.id === id);
        if (!task) return;

        const order = ['Not started', 'In progress', 'Almost complete'];
        const current = task.progress ?? 'Not started';
        const currentIndex = order.indexOf(current);

        const nextProgress = order[(currentIndex + 1) % order.length];

        set({
            tasks: tasks.map(t =>
                t.id === id
                ? {...t, progress: nextProgress}
                : t
            )
        });

        const {error} = await supabase
            .from('tasks')
            .update({
                progress: nextProgress
            })
            .eq('id', id)

        if (error) {
            console.log('Progress update failed.', error);
            set({tasks});
        }
    },

    setCompletedTasksCount: (count) => set({completedTasksCount: count}),
}));

function formatToDDMMYY(dateStr) {
    const [year, month, day] = dateStr.split('-')
    return `${day}-${month}-${year}`
}