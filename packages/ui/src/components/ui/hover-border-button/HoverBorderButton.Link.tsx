'use client'

/**
 * Link variant for HoverBorderButton
 * Renders as an <a> element with hover effects
 */

import { cn } from '../../../lib/utils'
import { useHoverBorder } from './context'
import { HoverBorderEffect } from './HoverBorderEffect'
import { HoverBorderBorder } from './HoverBorderBorder'
import type { HoverBorderButtonLinkProps } from './types'

export function HoverBorderButtonLink({ children, className, ...props }: HoverBorderButtonLinkProps) {
    const { elementRef, handleMouseMove, handleMouseEnter, handleMouseLeave } = useHoverBorder()

    return (
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
    )
}

HoverBorderButtonLink.displayName = 'HoverBorderButton.Link'
