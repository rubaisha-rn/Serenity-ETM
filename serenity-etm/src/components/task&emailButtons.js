'use client';

import React from "react";
import SidebarButton from '../components/tasks/sidebarButtons';

export const TaskButtons = React.memo(({expandedSecondary, theme, stressPalette, setShowTasks}) => (
    <>
        <SidebarButton label='All Tasks' icon='/icons/menuOpen.png' expanded={expandedSecondary} theme={theme} stressPalette={stressPalette} onClick={() => setShowTasks('all')} />
        <SidebarButton label='Today' icon='/icons/menuOpen.png' expanded={expandedSecondary} theme={theme} stressPalette={stressPalette} onClick={() => setShowTasks('today')} />
        <SidebarButton label='Upcoming' icon='/icons/menuOpen.png' expanded={expandedSecondary} theme={theme} stressPalette={stressPalette} onClick={() => setShowTasks('upcoming')} />
        <SidebarButton label='High Priority' icon='/icons/menuOpen.png' expanded={expandedSecondary} theme={theme} stressPalette={stressPalette} onClick={() => setShowTasks('priority')} />
        <SidebarButton label='Completed' icon='/icons/menuOpen.png' expanded={expandedSecondary} theme={theme} stressPalette={stressPalette} onClick={() => setShowTasks('completed')} />
    </>
));

export const EmailButtons = (({expandedSecondary, theme, stressPalette}) => (
    <>
        <SidebarButton label='Inbox' icon='/icons/menuOpen.png' expanded={expandedSecondary} theme={theme} stressPalette={stressPalette} onClick={{}} />
        <SidebarButton label='Starred' icon='/icons/menuOpen.png' expanded={expandedSecondary} theme={theme} stressPalette={stressPalette} onClick={{}} />
        <SidebarButton label='Priority' icon='/icons/menuOpen.png' expanded={expandedSecondary} theme={theme} stressPalette={stressPalette} onClick={{}} />
        <SidebarButton label='Drafts' icon='/icons/menuOpen.png' expanded={expandedSecondary} theme={theme} stressPalette={stressPalette} onClick={{}} />
        <SidebarButton label='Archive' icon='/icons/menuOpen.png' expanded={expandedSecondary} theme={theme} stressPalette={stressPalette} onClick={{}} />
    </>
));