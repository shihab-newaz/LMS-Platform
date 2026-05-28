/**
 * ButtonRoot Component
 * 
 * The main wrapper component that provides the 3D button structure and manages
 * all state, animations, and event handling. This component uses React Context
 * to share state with child components (Label, Icon, Spinner, etc.).
 * 
 * Architecture:
 * - LAYER 1 (Base): The bottom "housing" that creates 3D depth
 * - LAYER 2 (Cap): The top "keycap" that moves on click
 * - LAYER 3 (Shimmer): Animation overlay for visual feedback
 */

'use client'

import React, { useState, useRef, useCallback } from 'react'
import { useDebounce, useThrottle } from '../hooks'
import { ButtonProps } from '../types'
import { ButtonContext } from '../context/ButtonContext'
import styles from '../styles/Button.module.css'

export const ButtonRoot = React.forwardRef<HTMLButtonElement, ButtonProps>(function ButtonRoot(
    {
        children,
        onClick,
        variant = 'primary',
        size = 'md',
        color = 'cyan',
        isLoading = false,
        isError = false,
        isSuccess = false,
        debounceMs,
        throttleMs,
        disableOnClick = false,
        textColor,
        bgColor,
        glowIntensity = 'subtle',
        className = '',
        disabled,
        style,
        ...props
    },
    ref
) {
    // ========== STATE ==========
    /** Controls the shimmer animation on click */
    const [isAnimating, setIsAnimating] = useState(false)

    /** Tracks if an async onClick is currently running */
    const [isProcessing, setIsProcessing] = useState(false)

    /** Ref to clear animation timeout on unmount */
    const timeoutRef = useRef<NodeJS.Timeout | null>(null)

    // ========== EVENT HANDLERS ==========
    /**
     * Base click handler that:
     * 1. Triggers the shimmer animation
     * 2. Calls the user's onClick handler
     * 3. Optionally disables the button during async operations
     */
    const baseClickHandler = useCallback(async (e: React.MouseEvent<HTMLButtonElement>) => {
        if (!onClick) return

        // Trigger shimmer animation (double RAF ensures state reset)
        if (timeoutRef.current) clearTimeout(timeoutRef.current)
        setIsAnimating(false)
        requestAnimationFrame(() => {
            requestAnimationFrame(() => setIsAnimating(true))
        })
        timeoutRef.current = setTimeout(() => setIsAnimating(false), 600)

        // Handle async onClick with optional auto-disable
        const result = onClick(e)
        if (result instanceof Promise && disableOnClick) {
            setIsProcessing(true)
            try {
                await result
            } finally {
                setIsProcessing(false)
            }
        }
    }, [onClick, disableOnClick])

    // Apply debounce or throttle if specified
    const debouncedHandler = useDebounce(baseClickHandler, debounceMs || 0)
    const throttledHandler = useThrottle(baseClickHandler, throttleMs || 0)

    const handleClick = debounceMs
        ? debouncedHandler
        : throttleMs
            ? throttledHandler
            : baseClickHandler

    // ========== COMPUTED VALUES ==========
    const isDisabled = disabled || isLoading || isProcessing

    // Context value shared with child components
    const contextValue = {
        variant,
        size,
        color,
        glowIntensity,
        disabled: !!isDisabled,
        isLoading: !!isLoading,
        isError: !!isError,
        isSuccess: !!isSuccess,
    }

    // Build CSS class names based on props and state
    const buttonClasses = [
        styles.button,
        styles[color],
        styles[size],
        variant !== 'primary' && styles[variant],
        glowIntensity === 'strong' && styles.glowStrong,
        glowIntensity === 'none' && styles.glowNone,
        (isLoading || isProcessing) && styles.loading,
        isError && styles.error,
        isSuccess && styles.success,
        isDisabled && styles.disabled,
        className
    ].filter(Boolean).join(' ')

    // Custom CSS variables for runtime color customization
    const customStyles: React.CSSProperties = {
        ...style,
        ...(textColor && { '--text-color': textColor } as React.CSSProperties),
        ...(bgColor && { '--bg-gradient-start': bgColor, '--bg-gradient-end': bgColor } as React.CSSProperties),
    }

    // ========== RENDER ==========
    return (
        <ButtonContext.Provider value={contextValue}>
            <button
                ref={ref}
                className={buttonClasses}
                onClick={handleClick}
                disabled={isDisabled}
                aria-busy={isLoading || isProcessing}
                aria-disabled={isDisabled}
                style={customStyles}
                {...props}
            >
                {/* LAYER 1: The Base (Housing) - Creates 3D depth */}
                <div className={styles.base} />

                {/* LAYER 2: The Cap (Moving Part) - The clickable surface */}
                <div className={styles.cap}>
                    {/* Corner Markers - Decorative tech aesthetic */}
                    <span className={`${styles.cornerMarker} ${styles.topLeft}`} />
                    <span className={`${styles.cornerMarker} ${styles.topRight}`} />
                    <span className={`${styles.cornerMarker} ${styles.bottomLeft}`} />
                    <span className={`${styles.cornerMarker} ${styles.bottomRight}`} />

                    {/* Content - Render child components (Label, Icon, etc.) */}
                    <div className={styles.content}>
                        {children}
                    </div>

                    {/* LAYER 3: Shimmer Animation - Visual feedback on click */}
                    <div className={`${styles.shimmerLayer} ${isAnimating ? styles.animateGlint : ''}`} />
                </div>
            </button>
        </ButtonContext.Provider>
    )
})
