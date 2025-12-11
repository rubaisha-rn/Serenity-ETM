'use client';

import React from "react";
import SidebarButton from '../components/tasks/sidebarButtons';

export const TaskButtons = React.memo(({expandedSecondary, theme, stressPalette, setShowTasks}) => (
    <>
        <SidebarButton label='All Tasks' shortLabel='all' icon='/icons/tasks.png' expanded={expandedSecondary} theme={theme} stressPalette={stressPalette} onClick={() => setShowTasks('all')} />
        <SidebarButton label='Today' shortLabel='today' icon='/icons/tasks/today.png' expanded={expandedSecondary} theme={theme} stressPalette={stressPalette} onClick={() => setShowTasks('today')} />
        <SidebarButton label='Upcoming' shortLabel='upcoming' icon='/icons/tasks/upcoming.png' expanded={expandedSecondary} theme={theme} stressPalette={stressPalette} onClick={() => setShowTasks('upcoming')} />
        <SidebarButton label='High Priority' shortLabel='priority' icon='/icons/tasks/priority.png' expanded={expandedSecondary} theme={theme} stressPalette={stressPalette} onClick={() => setShowTasks('priority')} />
        <SidebarButton label='Completed' shortLabel='completed' icon='/icons/tasks/completed.png' expanded={expandedSecondary} theme={theme} stressPalette={stressPalette} onClick={() => setShowTasks('completed')} />
    </>
));

export const EmailButtons = (({expandedSecondary, theme, stressPalette}) => (
    <>
        <SidebarButton label='Inbox' shortLabel='' icon='/icons/menuOpen.png' expanded={expandedSecondary} theme={theme} stressPalette={stressPalette} onClick={{}} />
        <SidebarButton label='Starred' shortLabel='' icon='/icons/menuOpen.png' expanded={expandedSecondary} theme={theme} stressPalette={stressPalette} onClick={{}} />
        <SidebarButton label='Priority' shortLabel='' icon='/icons/menuOpen.png' expanded={expandedSecondary} theme={theme} stressPalette={stressPalette} onClick={{}} />
        <SidebarButton label='Drafts' shortLabel='' icon='/icons/menuOpen.png' expanded={expandedSecondary} theme={theme} stressPalette={stressPalette} onClick={{}} />
        <SidebarButton label='Archive' shortLabel='' icon='/icons/menuOpen.png' expanded={expandedSecondary} theme={theme} stressPalette={stressPalette} onClick={{}} />
    </>
));