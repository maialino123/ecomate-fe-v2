'use client'

import { useEffect, useState } from 'react'

export type ScreenSize = 'mobile' | 'tablet' | 'small-laptop' | 'desktop'

interface MediaQueryResult {
    screenSize: ScreenSize
    isMobile: boolean
    isTablet: boolean
    isSmallLaptop: boolean
    isDesktop: boolean
    width: number
}

/**
 * Custom hook để detect screen size và window width
 * Breakpoints:
 * - mobile: < 768px
 * - tablet: 768px - 1024px
 * - small-laptop: 1024px - 1920px
 * - desktop: > 1920px
 */
export function useMediaQuery(): MediaQueryResult {
    const [windowWidth, setWindowWidth] = useState<number>(
        typeof window !== 'undefined' ? window.innerWidth : 2560,
    )

    useEffect(() => {
        // Handler để update width khi resize
        const handleResize = () => {
            setWindowWidth(window.innerWidth)
        }

        // Add event listener
        window.addEventListener('resize', handleResize)

        // Set initial width
        handleResize()

        // Cleanup
        return () => window.removeEventListener('resize', handleResize)
    }, [])

    // Determine screen size based on width
    const getScreenSize = (width: number): ScreenSize => {
        if (width < 768) return 'mobile'
        if (width < 1024) return 'tablet'
        if (width < 1920) return 'small-laptop'
        return 'desktop'
    }

    const screenSize = getScreenSize(windowWidth)

    return {
        screenSize,
        isMobile: screenSize === 'mobile',
        isTablet: screenSize === 'tablet',
        isSmallLaptop: screenSize === 'small-laptop',
        isDesktop: screenSize === 'desktop',
        width: windowWidth,
    }
}

/**
 * Hook đơn giản để check xem có nên render 3D model hay không
 * Returns true nếu screen size > 1920px (desktop)
 */
export function useShouldRender3D(): boolean {
    const { isDesktop } = useMediaQuery()
    return isDesktop
}
