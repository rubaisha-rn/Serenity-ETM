// complete
'use client';

import React from "react";
import TasksSidebarButton from '../components/tasks/sidebarButtons';
import EmailsSidebarButton from "./emails/sidebarButtons";
import { ICONS } from "@/lib/assets";
import useStore from "@/store/useStore";

const theme = useStore.getState().theme;

export const TaskButtons = React.memo(({expandedSecondary, setShowTasks}) => {

    const theme = useStore((s) => s.theme);

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

    return (
        <div className={`flex flex-col ${expandedSecondary ? 'gap-6' : 'gap-2'}`}>
            {taskGroups.map((group) => (
                <div key={group.label} className={`flex flex-col gap-1`}>
                    {expandedSecondary && (    
                        <div className="text-[var(--text-b)] leading-tight group-label">
                            {group.label}
                        </div>
                    )}

                    {group.buttons.map((btn) => (
                        <TasksSidebarButton key={btn.key} label={btn.label} shortLabel={btn.key} icon={btn.icon} shortcut={btn.shortcut} expanded={expandedSecondary} onClick={() => setShowTasks(btn.key)} />
                    ))}
                </div>
            ))}
        </div>
    );
});

export const EmailButtons = React.memo(({expandedSecondary, setShowEmails}) => {

    const theme = useStore((s) => s.theme);
    
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
        <div className={`flex flex-col ${expandedSecondary ? 'gap-6' : 'gap-2'}`}>
            {emailGroups.map((group) => (
                <div key={group.label} className={`flex flex-col gap-1`}>
                    {expandedSecondary && (
                        <div className="text-[var(--text-b)] leading-tight group-label">
                            {group.label}
                        </div>
                    )}

                    {group.buttons.map((btn) => (
                        <EmailsSidebarButton key={btn.key} label={btn.label} shortLabel={btn.key} icon={btn.icon} shortcut={btn.shortcut} expanded={expandedSecondary} onClick={() => setShowEmails(btn.key)} />
                    ))}
                </div>
            ))}
        </div>
    );
});