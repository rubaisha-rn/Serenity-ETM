'use client';

import React from "react";
import TasksSidebarButton from '../components/tasks/sidebarButtons';
import EmailsSidebarButton from "./emails/sidebarButtons";

export const TaskButtons = React.memo(({expandedSecondary, setShowTasks}) => (
    <>
        <TasksSidebarButton label='All Tasks' shortLabel='all' icon='/icons/tasks.png' expanded={expandedSecondary} onClick={() => setShowTasks('all')} />
        <TasksSidebarButton label='Today' shortLabel='today' icon='/icons/tasks/today.png' expanded={expandedSecondary} onClick={() => setShowTasks('today')} />
        <TasksSidebarButton label='Upcoming' shortLabel='upcoming' icon='/icons/tasks/upcoming.png' expanded={expandedSecondary} onClick={() => setShowTasks('upcoming')} />
        <TasksSidebarButton label='High Priority' shortLabel='priority' icon='/icons/tasks/priority.png' expanded={expandedSecondary} onClick={() => setShowTasks('priority')} />
        <TasksSidebarButton label='Completed' shortLabel='completed' icon='/icons/tasks/completed.png' expanded={expandedSecondary} onClick={() => setShowTasks('completed')} />
    </>
));

export const EmailButtons = React.memo(({expandedSecondary, setShowEmails}) => (
    <>
        <EmailsSidebarButton label='Inbox' shortLabel='inbox' icon='/icons/email.png' expanded={expandedSecondary} onClick={() => setShowEmails('inbox')} />
        <EmailsSidebarButton label='Starred' shortLabel='starred' icon='/icons/emails/starred.png' expanded={expandedSecondary} onClick={() => setShowEmails('starred')} />
        <EmailsSidebarButton label='High Priority' shortLabel='priority' icon='/icons/tasks/priority.png' expanded={expandedSecondary} onClick={() => setShowEmails('priority')} />
        <EmailsSidebarButton label='Sent' shortLabel='sent' icon='/icons/emails/sent.png' expanded={expandedSecondary} onClick={() => setShowEmails('sent')} />
        <EmailsSidebarButton label='Drafts' shortLabel='drafts' icon='/icons/emails/draft.png' expanded={expandedSecondary} onClick={() => setShowEmails('drafts')} />
        <EmailsSidebarButton label='Archive' shortLabel='archive' icon='/icons/emails/archive.png' expanded={expandedSecondary} onClick={() => setShowEmails('archive')} />
    </>
));