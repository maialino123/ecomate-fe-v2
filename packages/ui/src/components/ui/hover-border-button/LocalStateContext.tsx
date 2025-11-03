'use client'

/**
 * Local state context for individual button instances
 * Provides per-button state to Effect and Border subcomponents
 */

import { useContext } from 'react'
import { createSafeContext } from '@workspace/lib'
import type { HoverBorderLocalState } from './types'

/**
 * Provider, hook, and raw context for local button state
 * Each Button/Link component creates its own provider instance
 */
export const [LocalStateProvider, useLocalState, LocalStateContext] =
    createSafeContext<HoverBorderLocalState>('HoverBorderLocalState')

/**
 * Optional hook that returns local state if available, null otherwise
 * Useful for Effect/Border components that can work in both contexts
 */
export function useOptionalLocalState(): HoverBorderLocalState | null {
    const context = useContext(LocalStateContext)
    return context ?? null
}

/**
 * Hook that returns local state with safe defaults
 * Used by Effect/Border to gracefully handle usage outside Button/Link
 */
export function useLocalStateOrDefault(): HoverBorderLocalState {
    const localState = useOptionalLocalState()

    // If no local state, return safe defaults (non-interactive but visible)
    if (!localState) {
        return {
            mousePosition: { x: 50, y: 50 },
            isHovered: false,
            elementRef: { current: null },
            handleMouseMove: () => {},
            handleMouseEnter: () => {},
            handleMouseLeave: () => {},
        }
    }

    return localState
}
