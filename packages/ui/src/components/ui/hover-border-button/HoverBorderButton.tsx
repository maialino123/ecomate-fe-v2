'use client'

/**
 * Root component (Provider) for HoverBorderButton
 * Manages state and provides context to child components
 */

import { useRef, useState, useCallback } from 'react'
import { HoverBorderProvider } from './context'
import type { HoverBorderButtonProps } from './types'

export function HoverBorderButton({
    children,
    borderColor = 'rgba(255, 255, 255, 0.5)',
    borderWidth = '2px',
    glowIntensity = 0.5,
    animationDuration = 0.3,
}: HoverBorderButtonProps) {
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

    return (
        <HoverBorderProvider
            value={{
                mousePosition,
                isHovered,
                borderColor,
                borderWidth,
                glowIntensity,
                animationDuration,
                elementRef,
                handleMouseMove,
                handleMouseEnter,
                handleMouseLeave,
            }}
        >
            {children}
        </HoverBorderProvider>
    )
}

HoverBorderButton.displayName = 'HoverBorderButton'
