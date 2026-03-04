/**
 * Task management store using Zustand.
 * 
 * Manages:
    * Task CRUD operations (supabase)
    * Multi-select actions (complete/delete)
    * Local UI states (grid/list, filters)
    * Priority classification
    * Task progress updates
 */

import { create } from "zustand";
import { supabase } from "@/lib/supabaseClient";

export const useTaskStore = create((set, get) => ({

    /**
     * UI state accessors and mutators
     */

    // Filter mode for tasks
    showTasks: 'all',
    setShowTasks: (showTasks) => set({showTasks}),

    // Count of completed tasks per session
    completedTasksCount: 0,
    setCompletedTasksCount: (count) => set({completedTasksCount: count}),

    // Layout mode
    grid: true, 
    setGrid: (grid) => set({grid}),

    /**
     * Task selection logic
     */

    // Currently selected task IDs for bulk operations
    selectedIds: [],

    // Toggle select for multiple IDs. if task is already selected, remove it, otherwise add it.
    toggleSelect: (id) =>
        set(state => ({
            selectedIds: state.selectedIds.includes(id)
                ? state.selectedIds.filter(x => x !== id)
                : [...state.selectedIds, id]
        })),

    // Clear all selected
    clearSelection: () => set({selectedIds: []}),

    // Select all visible tasks
    selectAllVisible: (ids) => set({selectedIds: ids}),

    /**
     * Bulk actions
     */

    // Mark many as complete
    markManyComplete: async (ids, complete=true) => {
        
        if (!ids.length) return

        // Mark multiple complete in db
        await supabase
            .from('tasks')
            .update({completed: complete})
            .in('id', ids)

        // Reset selection and reload tasks
        get().clearSelection()
        get().loadTasks()
    },

    // Soft delete multiple tasks
    deleteMany: async (ids) => {
   
        if (!ids.length) return

        // Soft delete multiple tasks
        await supabase
            .from('tasks')
            .update({is_delete: true})
            .in('id', ids)

        get().clearSelection()
        get().loadTasks()
    },

    /**
     * Task data
     */

    // All loaded tasks
    tasks: [],

    /**
     * AI/Rules classification
     * Automatic priority on tasks missing priority tags using backend API.
     */
    classifyMissingTasks: async () => {

        const {data: sessionData} = await supabase.auth.getSession();
        if (!sessionData.session) return;

        const tasks = get().tasks;

        // Only on tasks without priorities or with AI/rules are priority source
        const unclassified = tasks.filter(
            t => (t.priority_src === 'rules' || t.priority === 'null')
        );

        if (unclassified.length === 0) return;

        try {

            const results = await Promise.all(
                unclassified.map(async (task) => {
            
                    try {

                        // Send task text and title to classification API
                        const res = await fetch('/api/classify', {
                            method: 'POST',
                            headers: {'Content-Type': 'application/json'},
                            body: JSON.stringify({
                                text: `${task.title ?? ""} ${task.description ?? ""}`
                            })
                        });

                        const data = await res.json();

                        // Get tasks priority classifications for update
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

            // Remove boolean results as those are failed classifications
            const validUpdates = results.filter(Boolean);

            // If not results, return
            if (validUpdates.length === 0) return;

            // Update db safely. only overwrites tasks where priority is still null
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

            // Update local state
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

    /**
     * Load tasks
     * Fetch tasks from supabase and normalise fields for consistent UI
     */
    loadTasks : async () => {
        
        // Load tasks ordered according to due date
        const {data, error} = await supabase
            .from('tasks')
            .select('*')
            .order('due_date', {ascending: false})

        if (!error) {
            const normalised = data.map(t => ({
                ...t,

                // Ensure default values exists
                completed: t.completed ?? false,

                // Use timestamp fallback
                timestamp: t.timestamp || t.created_at,

                // Default priority
                priority: t.priority || 'low',

                // Due date
                due: t.due_date,
                
                // Soft delete flag
                is_delete: t.is_delete ?? false
            }))

            set({tasks: normalised})
        }
        else {
            console.error('Task fetch error:', error)
        }
    },
    
    /**
     * Create task
     */
    addTask: async (task) => {

        const {data: sessionData} = await supabase.auth.getSession()
        if (!sessionData.session) return
        
        // Insert task in db
        const {data, error} = await supabase
            .from('tasks')
            .insert([{
                user_id: sessionData.session.user.id,
                ...task,
                completed: false,

                // If no priority, rules/AI would classify it upon load
                priority_src: task.priority ? 'user' : 'rules',
            }])
            .select();

        console.log('Task insertion result:', {data, error});

        get().loadTasks()
    },

    /**
     * Task state updates
     */

    // Toggle completion of a task
    toggleComplete: async (id) => {

        const task = get().tasks.find(t => t.id === id)
        if (!task) return
        
        // Mark as completed in db
        await supabase
            .from('tasks')
            .update({
                completed: !task.completed
            })
            .eq('id', id)

        get().loadTasks()
    },

    // Soft delete of a task
    toggleDelete: async (id) => {

        const task = get().tasks.find(t => t.id === id)
        if (!task) return
        
        // Mark as delete in db
        await supabase
            .from('tasks')
            .update({
                is_delete: true
            })
            .eq('id', id)

        get().loadTasks()
    },

    // Priority management cycle through low -> normal -> high -> low
    cyclePriority: async (id) => {
        
        // Find current task
        const tasks = get().tasks;
        const task = tasks.find(t => t.id === id);
        if (!task) return;

        // Find index in priority cycle
        const order = ['low', 'normal', 'high'];
        const current = task.priority ?? 'normal';
        const currentIndex = order.indexOf(current);

        // Define next priority in cycle
        const nextPriority = order[(currentIndex + 1) % order.length];

        // Update priority locally 
        set({
            tasks: tasks.map(t =>
                t.id === id
                ? {...t, priority: nextPriority, priority_src: 'user'}
                : t
            )
        });

        // Update priority in db
        const {error} = await supabase
            .from('tasks')
            .update({
                priority: nextPriority,
                priority_src: 'user'
            })
            .eq('id', id)

        // Rollback if db update fails
        if (error) {
            console.log('Priority update failed.', error);
            set({tasks});
        }
    },

    // Progress management cycles through 'not started' -> 'in progress' -> 'almost completed'
    cycleProgress: async (id) => {
        
        // Find current task
        const tasks = get().tasks;
        const task = tasks.find(t => t.id === id);
        if (!task) return;

        // Find its index in progress cycle
        const order = ['Not started', 'In progress', 'Almost complete'];
        const current = task.progress ?? 'Not started';
        const currentIndex = order.indexOf(current);

        // Find next progress cycle index
        const nextProgress = order[(currentIndex + 1) % order.length];

        // Update locally 
        set({
            tasks: tasks.map(t =>
                t.id === id
                ? {...t, progress: nextProgress}
                : t
            )
        });

        // Update in db
        const {error} = await supabase
            .from('tasks')
            .update({
                progress: nextProgress
            })
            .eq('id', id)

        // Rollback if db update fails
        if (error) {
            console.log('Progress update failed.', error);
            set({tasks});
        }
    },
}));