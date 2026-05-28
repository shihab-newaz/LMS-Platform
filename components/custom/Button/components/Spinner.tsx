/**
 * Displays a loading spinner when the button is in loading state.
 * Only renders when `isLoading` is true (via context).
 * 
 * @param text - Optional loading text to display next to spinner
 */

'use client'

import React from 'react'
import { useButtonContext } from '../context/ButtonContext'
import styles from '../styles/Button.module.css'

interface ButtonSpinnerProps {
    className?: string
    text?: string
}

export function ButtonSpinner({ className = '', text }: ButtonSpinnerProps) {
    const { isLoading } = useButtonContext()

    if (!isLoading) return null

    return (
        <>
            <div className={`${styles.spinner} ${className}`} />
            {text && <span className={styles.loadingText}>{text}</span>}
        </>
    )
}
