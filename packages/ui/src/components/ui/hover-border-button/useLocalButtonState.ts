'use client'

/**
 * Hook for managing per-button hover state
 * Prevents interference when multiple buttons are under one provider
 */

import { useRef, useState, useCallback } from 'react'
import type { HoverBorderLocalState } from './types'

export function useLocalButtonState(): HoverBorderLocalState {
    const elementRef = useRef<HTMLElement>(null)
    const [mousePosition, setMousePosition] = useState({ x: 50, y: 50 })
    const [isHovered, setIsHovered] = useState(false)

    const handleMouseMove = useCallback((e: React.MouseEvent<HTMLElement>) => {
        // Use requestAnimationFrame to throttle updates for better performance
        if (!elementRef.current) return

        requestAnimationFrame(() => {
            if (elementRef.current) {
                const rect = elementRef.current.getBoundingClientRect()
                const x = ((e.clientX - rect.left) / rect.width) * 100
                const y = ((e.clientY - rect.top) / rect.height) * 100
                setMousePosition({ x, y })
            }
        })
    }, [])

    const handleMouseEnter = useCallback(() => {
        setIsHovered(true)
    }, [])

    const handleMouseLeave = useCallback(() => {
        setIsHovered(false)
    }, [])

    return {
        elementRef,
        mousePosition,
        isHovered,
        handleMouseMove,
        handleMouseEnter,
        handleMouseLeave,
    }
}
