// add image sizes according to window
'use client'

import {motion, AnimatePresence} from 'framer-motion'
import { useState, useRef, useEffect } from 'react'
import { ICONS } from '@/lib/assets'
import useStore from '@/store/useStore'

import { useFloating, offset, flip, shift, autoUpdate, useDismiss, useRole, useInteractions, FloatingPortal } from '@floating-ui/react'

export default function TaskFunctionsMenu({onComplete, onDelete}) {

    const {theme} = useStore();
    const [open, setOpen] = useState(false);

    const {refs, floatingStyles, context} = useFloating({
        placement: 'bottom-end',
        open,
        onOpenChange: setOpen,
        whileElementsMounted: autoUpdate,
        middleware: [
            offset(6),
            flip(),
            shift({padding: 8})
        ],
    });

    const dismiss = useDismiss(context)
    const role = useRole(context, {role: 'menu'})

    const {getReferenceProps, getFloatingProps} = useInteractions([
        dismiss, role
    ])

    return (
        <>
            {/* trigger button */}
            <button 
                ref={refs.setReference}
                type='button'
                {...getReferenceProps({
                    onClick: () => setOpen(v => !v)
                })}
            >
                <span className='rotate-90 font-semibold leading-none'>...</span>
            </button>

            {/* menu */}
            <AnimatePresence>
                {open && (
                    <FloatingPortal>
                        <motion.div
                            ref={refs.setFloating}
                            style={floatingStyles}
                            {...getFloatingProps()}
                            initial={{opacity: 0, scale: 0.96}}
                            animate={{opacity: 1, scale: 1}}
                            exit={{opacity: 0, scale: 0.96}}
                            transition={{duration: 0.12}}
                            className='bg-[var(--f-main)] z-[9999] w-44 rounded-xl'
                        >
                            {/* settings */}
                            <button
                                className='side-bar-menuitem border-b-[0.02rem] border-b-black/15 bg-[var(--f-main)] hover:bg-[var(--e-main)] text-[var(--text-a)]'
                                onClick={() => {
                                    onComplete()
                                    setOpen(false)
                                }}
                            >
                                <img
                                    src={ICONS[theme].markcomplete}
                                    className='lg:w-4 aspect-square'
                                    aria-hidden="true"
                                    alt=''
                                />
                                <h6>
                                    Mark complete
                                </h6>
                            </button>

                            {/* sign out */}
                            <button
                                className='side-bar-menuitem bg-[var(--f-main)] hover:bg-[var(--e-main)] text-[var(--text-a)]'
                                onClick={() => {
                                    onDelete()
                                    setOpen(false)
                                }}
                            >
                                <img
                                    src={ICONS[theme].delete}
                                    className='lg:w-4 aspect-square'
                                    aria-hidden="true"
                                    alt=''
                                />
                                <h6>
                                    Delete
                                </h6>
                            </button>
                        </motion.div>
                    </FloatingPortal>
                )}
            </AnimatePresence>
        </>
    )
}