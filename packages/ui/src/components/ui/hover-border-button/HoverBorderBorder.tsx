'use client'

/**
 * Border frame component
 * Renders the actual border lines that appear on hover
 * Uses local state for hover and shared context for styling config
 */

import { cn } from '../../../lib/utils'
import { useHoverBorder } from './context'
import { useLocalState } from './LocalStateContext'
import type { HoverBorderBorderProps } from './types'

export function HoverBorderBorder(_props: HoverBorderBorderProps) {
    // Get per-button hover state from local context
    const { isHovered } = useLocalState()
    // Get shared styling config from global context
    const { borderColor, borderWidth, animationDuration } = useHoverBorder()

    return (
        <div
            className={cn(
                'absolute inset-0 pointer-events-none z-[2] rounded-[inherit] opacity-0 transition-opacity',
                isHovered && 'opacity-100',
            )}
            style={{
                background: `
          linear-gradient(to right, ${borderColor}, transparent) top / 100% ${borderWidth},
          linear-gradient(to bottom, ${borderColor}, transparent) right / ${borderWidth} 100%,
          linear-gradient(to left, ${borderColor}, transparent) bottom / 100% ${borderWidth},
          linear-gradient(to top, ${borderColor}, transparent) left / ${borderWidth} 100%
        `,
                backgroundRepeat: 'no-repeat',
                mixBlendMode: 'screen',
                transition: `opacity ${animationDuration}s ease-in-out`,
            }}
        />
    )
}

HoverBorderBorder.displayName = 'HoverBorderButton.Border'
