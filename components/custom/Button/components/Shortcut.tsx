/**
 * Displays a keyboard shortcut hint in the bottom-right corner of the button.
 * Useful for power users who prefer keyboard navigation.
 */

'use client'

import React from 'react'
import styles from '../styles/Button.module.css'

interface ButtonShortcutProps extends React.HTMLAttributes<HTMLSpanElement> {
    children: React.ReactNode
}

export function ButtonShortcut({ children, className = '', ...props }: ButtonShortcutProps) {
    return (
        <span className={`${styles.shortcutBadge} ${className}`} {...props}>
            {children}
        </span>
    )
}
