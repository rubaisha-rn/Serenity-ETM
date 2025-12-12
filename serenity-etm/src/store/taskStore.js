import { create } from "zustand";

export const useTaskStore = create((set) => ({
    
    tasks: [
        {
            id: '1',
            title: "Finish Prototype's UI",
            created: '10-12-2025',
            due: '07-12-2025',
            priority: 'high',
            completed: false,
        },
        {
            id: '2',
            title: "Clean Inbox Demonstration",
            created: '10-12-2025',
            due: '02-01-2026',
            priority: 'low',
            completed: false,
        },
        {
            id: '3',
            title: "Testing Task",
            created: '10-12-2025',
            due: '05-01-2026',
            priority: 'medium',
            completed: true,
        },
        {
            id: '4',
            title: "Finish Prototype's UI",
            created: '10-12-2025',
            due: '15-12-2025',
            priority: 'high',
            completed: false,
        },
        {
            id: '5',
            title: "Clean Inbox Demonstration",
            created: '01-12-2025',
            due: '10-01-2026',
            priority: 'low',
            completed: false,
        },
        {
            id: '6',
            title: "Testing Task",
            created: '10-12-2025',
            due: '12-01-2026',
            priority: 'medium',
            completed: true,
        },
        {
            id: '7',
            title: "Finish Prototype's UI",
            created: '10-12-2025',
            due: '12-12-2025',
            priority: 'high',
            completed: false,
        },
        {
            id: '8',
            title: "Clean Inbox Demonstration",
            created: '10-12-2025',
            due: '12-12-2026',
            priority: 'high',
            completed: false,
        },
    ],

    addTask: (task) => 
        set ((state) => ({
            tasks: [...state.tasks, task],
        })),

    toggleComplete: (id) => 
        set((state) => ({
            tasks: state.tasks.map((t) => 
                t.id === id ? {...t, completed: !t.completed } : t
            ),
        })),

    updateTask: (id, updated) =>
        set((state) => ({
            tasks: state.tasks.map((t) =>
                t.id === id ? {...t, ...updated} : t
            ),
        })),
}));