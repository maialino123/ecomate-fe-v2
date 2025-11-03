'use client'

/**
 * Link variant for HoverBorderButton
 * Renders as an <a> element with hover effects
 * Each link instance manages its own hover state to prevent interference
 */

import { cn } from '../../../lib/utils'
import { HoverBorderEffect } from './HoverBorderEffect'
import { HoverBorderBorder } from './HoverBorderBorder'
import { LocalStateProvider } from './LocalStateContext'
import { useLocalButtonState } from './useLocalButtonState'
import type { HoverBorderButtonLinkProps } from './types'

export function HoverBorderButtonLink({ children, className, ...props }: HoverBorderButtonLinkProps) {
    // Each link manages its own state
    const localState = useLocalButtonState()
    const { elementRef, handleMouseMove, handleMouseEnter, handleMouseLeave } = localState

    return (
        <LocalStateProvider value={localState}>
            <a
                ref={elementRef as React.RefObject<HTMLAnchorElement>}
                onMouseMove={handleMouseMove}
                onMouseEnter={handleMouseEnter}
                onMouseLeave={handleMouseLeave}
                className={cn('relative overflow-hidden transition-all isolate', className)}
                {...props}
            >
                <HoverBorderEffect />
                <HoverBorderBorder />
                <span className="relative z-[3]">{children}</span>
            </a>
        </LocalStateProvider>
    )
}

HoverBorderButtonLink.displayName = 'HoverBorderButton.Link'
