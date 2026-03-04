/**
 * Render navigation buttons for email and task screens inside the secondary sidebar. 
 */

'use client';

import React from "react";
import TasksSidebarButton from '../components/tasks/sidebarButtons';
import EmailsSidebarButton from "./emails/sidebarButtons";
import { ICONS } from "@/lib/assets";
import useStore from "@/store/useStore";

/**
 * Task button group component
 * 
 * Renders task navigation buttons inside secondary sidebar on tasks screen.
 */
export const TaskButtons = React.memo(({expandedSecondary, setShowTasks}) => {

    // Access theme so ensure re-render when theme changes
    const theme = useStore((s) => s.theme);

    /**
     * Task button configuration grouped by categories.
     * 
     * Each group contains a label and buttons.
     * Each button defines its own label, key, icon, keyboard shortcut.
     */
    const taskGroups = [
        {
            label: 'Overview',
            buttons: [
                {label: 'All Tasks', key: 'all', icon: ICONS[theme].alltasks, shortcut: '1'},
            ],
        },
        {
            label: 'Schedule',
            buttons: [
                {label: 'Today', key: 'today', icon: ICONS[theme].today, shortcut: '2'},
                {label: 'Upcoming', key: 'upcoming', icon: ICONS[theme].upcoming, shortcut: '3'},
            ],
        },
        {
            label: 'Priority',
            buttons: [
                {label: 'Important', key: 'priority', icon: ICONS[theme].priority, shortcut: '4'},
            ],
        },
        {
            label: 'Status',
            buttons: [
                {label: 'Completed', key: 'completed', icon: ICONS[theme].completed, shortcut: '5'},
            ],
        },
    ];

    // Render task sidebar buttons
    return (

        // Container depending on sidebar's expansion. Contains all buttons
        <div className={`flex flex-col ${expandedSecondary ? 'gap-6' : 'gap-2'}`}>

            {taskGroups.map((group) => (
            
                // Render a button
                <div key={group.label} className={`flex flex-col gap-1`}>

                    {/* If expanded, show categories, else only show icons */}
                    {expandedSecondary && (    
                        <div className="text-[var(--text-b)] leading-tight group-label">
                            {group.label}
                        </div>
                    )}

                    {/* Render each button inside its group */}
                    {group.buttons.map((btn) => (
                        <TasksSidebarButton 
                            key={btn.key} 
                            label={btn.label} 
                            shortLabel={btn.key} 
                            icon={btn.icon} 
                            shortcut={btn.shortcut} 
                            expanded={expandedSecondary} 

                            // Button's function
                            onClick={() => setShowTasks(btn.key)} 
                        />
                    ))}
                </div>
            ))}
        </div>
    );
});

/**
 * Email button group component
 * 
 * Render email navigation buttons inside secondary sidebar.
 */
export const EmailButtons = React.memo(({expandedSecondary, setShowEmails}) => {

    // Theme to update icons accordingly
    const theme = useStore((s) => s.theme);
    
    /**
     * Email button configuration grouped by category
     */
    const emailGroups = [
        {
            label: 'Incoming',
            buttons: [
                {label: 'Inbox', key: 'inbox', icon: ICONS[theme].mail, shortcut: '1'},
                {label: 'Starred', key: 'starred', icon: ICONS[theme].star, shortcut: '2'},
                {label: 'Important', key: 'priority', icon: ICONS[theme].priority, shortcut: '3'},
            ],
        },
        {
            label: 'Outgoing',
            buttons: [
                {label: 'Sent', key: 'sent', icon: ICONS[theme].send, shortcut: '4'},
                {label: 'Drafts', key: 'drafts', icon: ICONS[theme].drafts, shortcut: '5'},
            ],
        },
        {
            label: 'Archived',
            buttons: [
                {label: 'Archive', key: 'archive', icon: ICONS[theme].archive, shortcut: '6'},
            ],
        },
    ];

    return (

        // Main container displaying buttons according to sidebar's expansion
        <div className={`flex flex-col ${expandedSecondary ? 'gap-6' : 'gap-2'}`}>

            {emailGroups.map((group) => (
            
                // Each button is rendered
                <div key={group.label} className={`flex flex-col gap-1`}>

                    {/* Show category labels only if sidebar is expanded, else only display icons */}
                    {expandedSecondary && (
                        <div className="text-[var(--text-b)] leading-tight group-label">
                            {group.label}
                        </div>
                    )}

                    {/* Render each button */}
                    {group.buttons.map((btn) => (
                        <EmailsSidebarButton 
                            key={btn.key} 
                            label={btn.label} 
                            shortLabel={btn.key} 
                            icon={btn.icon} 
                            shortcut={btn.shortcut} 
                            expanded={expandedSecondary} 
                            
                            // Button function
                            onClick={() => setShowEmails(btn.key)} 
                        />
                    ))}
                </div>
            ))}
        </div>
    );
});