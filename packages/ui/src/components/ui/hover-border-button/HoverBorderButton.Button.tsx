'use client'

/**
 * Button variant for HoverBorderButton
 * Renders as a <button> element with hover effects
 */

import { cn } from '../../../lib/utils'
import { useHoverBorder } from './context'
import { HoverBorderEffect } from './HoverBorderEffect'
import { HoverBorderBorder } from './HoverBorderBorder'
import type { HoverBorderButtonButtonProps } from './types'

export function HoverBorderButtonButton({ children, className, disabled, ...props }: HoverBorderButtonButtonProps) {
    const { elementRef, handleMouseMove, handleMouseEnter, handleMouseLeave } = useHoverBorder()

    return (
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
    )
}

HoverBorderButtonButton.displayName = 'HoverBorderButton.Button'
