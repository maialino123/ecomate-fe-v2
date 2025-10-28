import { useState, useEffect } from 'react'

export interface DeviceCapabilities {
    isLowEndDevice: boolean
    prefersReducedMotion: boolean
    isMobile: boolean
    effectiveConnectionType: '2g' | '3g' | '4g' | 'slow-2g' | 'unknown'
    deviceMemory: number
}

/**
 * Hook to detect device capabilities for adaptive performance
 * Returns device specs to adjust animation complexity
 */
export function useDeviceCapabilities(): DeviceCapabilities {
    const [capabilities, setCapabilities] = useState<DeviceCapabilities>({
        isLowEndDevice: false,
        prefersReducedMotion: false,
        isMobile: false,
        effectiveConnectionType: '4g',
        deviceMemory: 8,
    })

    useEffect(() => {
        // Only run on client
        if (typeof window === 'undefined') return

        // Check connection
        const connection =
            (navigator as any).connection || (navigator as any).mozConnection || (navigator as any).webkitConnection
        const effectiveType = connection?.effectiveType || '4g'

        // Check device memory (default 8GB if not supported)
        const memory = (navigator as any).deviceMemory || 8

        // Check if reduced motion is preferred
        const prefersReduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches

        // Check if mobile
        const isMobileDevice = /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(
            navigator.userAgent,
        )

        // Determine if low-end device based on memory and connection
        const isLowEnd = memory < 4 || effectiveType === '2g' || effectiveType === 'slow-2g'

        setCapabilities({
            isLowEndDevice: isLowEnd,
            prefersReducedMotion: prefersReduced,
            isMobile: isMobileDevice,
            effectiveConnectionType: effectiveType,
            deviceMemory: memory,
        })
    }, [])

    return capabilities
}
