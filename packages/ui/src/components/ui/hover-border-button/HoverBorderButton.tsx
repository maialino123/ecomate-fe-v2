'use client'

/**
 * Root component (Provider) for HoverBorderButton
 * Provides shared configuration to child components
 * Individual button state is now managed per-button to avoid interference
 */

import { HoverBorderProvider } from './context'
import type { HoverBorderButtonProps } from './types'

export function HoverBorderButton({
    children,
    borderColor = 'rgba(255, 255, 255, 0.5)',
    borderWidth = '2px',
    glowIntensity = 0.5,
    animationDuration = 0.3,
}: HoverBorderButtonProps) {
    return (
        <HoverBorderProvider
            value={{
                borderColor,
                borderWidth,
                glowIntensity,
                animationDuration,
            }}
        >
            {children}
        </HoverBorderProvider>
    )
}

HoverBorderButton.displayName = 'HoverBorderButton'
