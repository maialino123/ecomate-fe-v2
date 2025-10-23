'use client'

import { useEffect, useState } from 'react'

/**
 * Hook to track client-side hydration status
 * Returns false during SSR and first render, true after hydration completes
 *
 * This is useful for preventing hydration mismatches when using
 * localStorage, sessionStorage, or other browser-only APIs
 *
 * @example
 * ```tsx
 * const isHydrated = useHydration()
 *
 * if (!isHydrated) {
 *   return <div>Loading...</div>
 * }
 *
 * return <div>{someLocalStorageValue}</div>
 * ```
 */
export function useHydration() {
    const [isHydrated, setIsHydrated] = useState(false)

    useEffect(() => {
        setIsHydrated(true)
    }, [])

    return isHydrated
}
