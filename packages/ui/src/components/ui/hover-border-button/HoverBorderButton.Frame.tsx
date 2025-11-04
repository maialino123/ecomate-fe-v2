'use client'

/**
 * Frame variant for HoverBorderButton
 * Renders as a <div> element with hover effects
 * Each frame instance manages its own hover state to prevent interference
 *
 * Use this for custom interactive elements that aren't buttons or links
 */

import { cn } from '../../../lib/utils'
import { HoverBorderEffect } from './HoverBorderEffect'
import { HoverBorderBorder } from './HoverBorderBorder'
import { LocalStateProvider } from './LocalStateContext'
import { useLocalButtonState } from './useLocalButtonState'
import type { HoverBorderFrameProps } from './types'

export function HoverBorderButtonFrame({ children, className, ...props }: HoverBorderFrameProps) {
    // Each frame manages its own state
    const localState = useLocalButtonState()
    const { elementRef, handleMouseMove, handleMouseEnter, handleMouseLeave } = localState

    return (
        <LocalStateProvider value={localState}>
            <div
                ref={elementRef as React.RefObject<HTMLDivElement>}
                onMouseMove={handleMouseMove}
                onMouseEnter={handleMouseEnter}
                onMouseLeave={handleMouseLeave}
                className={cn('relative overflow-hidden transition-all isolate', className)}
                {...props}
            >
                <HoverBorderEffect />
                <HoverBorderBorder />
                <span className="relative z-[3]">{children}</span>
            </div>
        </LocalStateProvider>
    )
}

HoverBorderButtonFrame.displayName = 'HoverBorderButton.Frame'
