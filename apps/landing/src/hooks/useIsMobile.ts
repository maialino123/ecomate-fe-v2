/**
 * useIsMobile Hook
 *
 * Detects if the current viewport is mobile (<768px)
 * Uses window.matchMedia for efficient viewport detection
 */

'use client'

import { useState, useEffect } from 'react'

export function useIsMobile(breakpoint: number = 768): boolean {
    const [isMobile, setIsMobile] = useState(false)

    useEffect(() => {
        // Check if window is defined (client-side only)
        if (typeof window === 'undefined') return

        // Create media query
        const mediaQuery = window.matchMedia(`(max-width: ${breakpoint - 1}px)`)

        // Set initial value
        setIsMobile(mediaQuery.matches)

        // Handler for media query changes
        const handleChange = (e: MediaQueryListEvent) => {
            setIsMobile(e.matches)
        }

        // Add listener
        mediaQuery.addEventListener('change', handleChange)

        // Cleanup
        return () => {
            mediaQuery.removeEventListener('change', handleChange)
        }
    }, [breakpoint])

    return isMobile
}
