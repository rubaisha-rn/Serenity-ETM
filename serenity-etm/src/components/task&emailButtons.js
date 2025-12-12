'use client';

import React from "react";
import TasksSidebarButton from '../components/tasks/sidebarButtons';
import EmailsSidebarButton from "./emails/sidebarButtons";

export const TaskButtons = React.memo(({expandedSecondary, theme, stressPalette, setShowTasks}) => (
    <>
        <TasksSidebarButton label='All Tasks' shortLabel='all' icon='/icons/tasks.png' expanded={expandedSecondary} theme={theme} stressPalette={stressPalette} onClick={() => setShowTasks('all')} />
        <TasksSidebarButton label='Today' shortLabel='today' icon='/icons/tasks/today.png' expanded={expandedSecondary} theme={theme} stressPalette={stressPalette} onClick={() => setShowTasks('today')} />
        <TasksSidebarButton label='Upcoming' shortLabel='upcoming' icon='/icons/tasks/upcoming.png' expanded={expandedSecondary} theme={theme} stressPalette={stressPalette} onClick={() => setShowTasks('upcoming')} />
        <TasksSidebarButton label='High Priority' shortLabel='priority' icon='/icons/tasks/priority.png' expanded={expandedSecondary} theme={theme} stressPalette={stressPalette} onClick={() => setShowTasks('priority')} />
        <TasksSidebarButton label='Completed' shortLabel='completed' icon='/icons/tasks/completed.png' expanded={expandedSecondary} theme={theme} stressPalette={stressPalette} onClick={() => setShowTasks('completed')} />
    </>
));

export const EmailButtons = React.memo(({expandedSecondary, theme, stressPalette, setShowEmails}) => (
    <>
        <EmailsSidebarButton label='Inbox' shortLabel='inbox' icon='/icons/menuOpen.png' expanded={expandedSecondary} theme={theme} stressPalette={stressPalette} onClick={() => setShowEmails('inbox')} />
        <EmailsSidebarButton label='Starred' shortLabel='starred' icon='/icons/menuOpen.png' expanded={expandedSecondary} theme={theme} stressPalette={stressPalette} onClick={() => setShowEmails('starred')} />
        <EmailsSidebarButton label='Priority' shortLabel='priority' icon='/icons/menuOpen.png' expanded={expandedSecondary} theme={theme} stressPalette={stressPalette} onClick={() => setShowEmails('priority')} />
        <EmailsSidebarButton label='Sent' shortLabel='sent' icon='/icons/menuOpen.png' expanded={expandedSecondary} theme={theme} stressPalette={stressPalette} onClick={() => setShowEmails('sent')} />
        <EmailsSidebarButton label='Drafts' shortLabel='drafts' icon='/icons/menuOpen.png' expanded={expandedSecondary} theme={theme} stressPalette={stressPalette} onClick={() => setShowEmails('drafts')} />
        <EmailsSidebarButton label='Archive' shortLabel='archive' icon='/icons/menuOpen.png' expanded={expandedSecondary} theme={theme} stressPalette={stressPalette} onClick={() => setShowEmails('archive')} />
    </>
));