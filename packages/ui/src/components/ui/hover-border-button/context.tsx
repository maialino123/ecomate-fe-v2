'use client'

/**
 * Context for HoverBorderButton compound component
 * Manages shared state for hover effects and mouse position tracking
 */

import { createSafeContext } from '@workspace/lib'
import type { HoverBorderContextValue } from './types'

/**
 * Provider, hook, and raw context for HoverBorderButton
 *
 * @example
 * ```tsx
 * function CustomButton() {
 *   const { isHovered, borderColor } = useHoverBorder()
 *   return <div style={{ color: isHovered ? borderColor : 'inherit' }}>...</div>
 * }
 * ```
 */
export const [HoverBorderProvider, useHoverBorder, HoverBorderContext] =
    createSafeContext<HoverBorderContextValue>('HoverBorder')
