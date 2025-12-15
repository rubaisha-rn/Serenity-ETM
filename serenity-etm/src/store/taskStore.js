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
            title: "Complete Work Tasks",
            created: '10-12-2025',
            due: '02-01-2026',
            priority: 'low',
            completed: false,
        },
        {
            id: '3',
            title: "Complete Color Scheme",
            created: '10-12-2025',
            due: '05-01-2026',
            priority: 'medium',
            completed: true,
        },
        {
            id: '4',
            title: "Finish Prototype",
            created: '10-12-2025',
            due: '15-12-2025',
            priority: 'high',
            completed: false,
        },
        {
            id: '5',
            title: "Develop Strategy Plan",
            created: '01-12-2025',
            due: '10-01-2026',
            priority: 'low',
            completed: false,
        },
        {
            id: '6',
            title: "Write Literature Review",
            created: '10-12-2025',
            due: '12-01-2026',
            priority: 'medium',
            completed: true,
        },
        {
            id: '7',
            title: "Finish Course",
            created: '10-12-2025',
            due: '12-12-2025',
            priority: 'medium',
            completed: false,
        },
        {
            id: '8',
            title: "Make Presentation",
            created: '10-12-2025',
            due: '12-12-2025',
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

    completedTasksCount: 0,
    setCompletedTasksCount: (count) => set({completedTasksCount: count}),
}));