'use client'

/**
 * Button variant for HoverBorderButton
 * Renders as a <button> element with hover effects
 * Each button instance manages its own hover state to prevent interference
 */

import { cn } from '../../../lib/utils'
import { HoverBorderEffect } from './HoverBorderEffect'
import { HoverBorderBorder } from './HoverBorderBorder'
import { LocalStateProvider } from './LocalStateContext'
import { useLocalButtonState } from './useLocalButtonState'
import type { HoverBorderButtonButtonProps } from './types'

export function HoverBorderButtonButton({ children, className, disabled, ...props }: HoverBorderButtonButtonProps) {
    // Each button manages its own state
    const localState = useLocalButtonState()
    const { elementRef, handleMouseMove, handleMouseEnter, handleMouseLeave } = localState

    return (
        <LocalStateProvider value={localState}>
            <button
                ref={elementRef as React.RefObject<HTMLButtonElement>}
                onMouseMove={handleMouseMove}
                onMouseEnter={handleMouseEnter}
                onMouseLeave={handleMouseLeave}
                className={cn(
                    'relative overflow-hidden transition-all isolate',
                    disabled && 'opacity-50 cursor-not-allowed pointer-events-none',
                    className,
                )}
                disabled={disabled}
                {...props}
            >
                <HoverBorderEffect />
                <HoverBorderBorder />
                <span className="relative z-[3]">{children}</span>
            </button>
        </LocalStateProvider>
    )
}

HoverBorderButtonButton.displayName = 'HoverBorderButton.Button'
