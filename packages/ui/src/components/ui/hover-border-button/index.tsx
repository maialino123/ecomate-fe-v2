'use client'

/**
 * HoverBorderButton - Compound Component with Composition Pattern
 *
 * A button/link component with an animated border effect that follows the mouse.
 * Built using composition pattern for maximum flexibility and reusability.
 *
 * @example
 * ```tsx
 * // New composition API (recommended)
 * <HoverBorderButton borderColor="rgba(16, 185, 129, 0.8)" glowIntensity={0.7}>
 *   <HoverBorderButton.Button onClick={handleClick} className="px-8 py-4">
 *     Click me
 *   </HoverBorderButton.Button>
 * </HoverBorderButton>
 *
 * // Link variant
 * <HoverBorderButton>
 *   <HoverBorderButton.Link href="/page" target="_blank">
 *     Visit page
 *   </HoverBorderButton.Link>
 * </HoverBorderButton>
 *
 * // Frame variant (for custom div wrappers)
 * <HoverBorderButton>
 *   <HoverBorderButton.Frame className="px-8 py-4">
 *     Custom interactive div
 *   </HoverBorderButton.Frame>
 * </HoverBorderButton>
 *
 * // Old API (deprecated but supported for backward compatibility)
 * <HoverBorderButtonLegacy
 *   onClick={handleClick}
 *   borderColor="rgba(16, 185, 129, 0.8)"
 * >
 *   Click me
 * </HoverBorderButtonLegacy>
 * ```
 */

import { HoverBorderButton as Root } from './HoverBorderButton'
import { HoverBorderButtonButton } from './HoverBorderButton.Button'
import { HoverBorderButtonLink } from './HoverBorderButton.Link'
import { HoverBorderButtonFrame } from './HoverBorderButton.Frame'
import { HoverBorderEffect } from './HoverBorderEffect'
import { HoverBorderBorder } from './HoverBorderBorder'
import { useHoverBorder } from './context'

// Compound component with subcomponents
export const HoverBorderButton = Object.assign(Root, {
    Button: HoverBorderButtonButton,
    Link: HoverBorderButtonLink,
    Frame: HoverBorderButtonFrame,
    Effect: HoverBorderEffect,
    Border: HoverBorderBorder,
})

// Export hooks for custom components
export { useHoverBorder }

// Export local state hooks for advanced custom compositions
export { useOptionalLocalState, useLocalStateOrDefault, LocalStateProvider } from './LocalStateContext'
export { useLocalButtonState } from './useLocalButtonState'

// Export types
export type {
    HoverBorderButtonProps,
    HoverBorderButtonButtonProps,
    HoverBorderButtonLinkProps,
    HoverBorderFrameProps,
    HoverBorderContextValue,
    HoverBorderLocalState,
} from './types'

// Backward compatibility: Legacy component that mimics old API
// @deprecated Use the new composition API instead
import React, { type ReactNode } from 'react'

interface HoverBorderButtonLegacyProps {
    children: ReactNode
    onClick?: () => void
    className?: string
    disabled?: boolean
    href?: string
    target?: string
    rel?: string
    borderColor?: string
    borderWidth?: string
    glowIntensity?: number
    animationDuration?: number
    as?: 'button' | 'a'
}

/**
 * Legacy HoverBorderButton component for backward compatibility
 * @deprecated Use the new composition API instead:
 *
 * ```tsx
 * // Instead of:
 * <HoverBorderButtonLegacy as="button" onClick={...}>
 *
 * // Use:
 * <HoverBorderButton>
 *   <HoverBorderButton.Button onClick={...}>
 * </HoverBorderButton>
 * ```
 */
export const HoverBorderButtonLegacy = React.forwardRef<
    HTMLButtonElement | HTMLAnchorElement,
    HoverBorderButtonLegacyProps
>(function HoverBorderButtonLegacy(
    {
        children,
        onClick,
        className,
        disabled,
        href,
        target,
        rel,
        borderColor,
        borderWidth,
        glowIntensity,
        animationDuration,
        as = 'button',
    },
    _ref,
) {
    // Show deprecation warning in development
    if (process.env.NODE_ENV === 'development') {
        console.warn(
            'HoverBorderButtonLegacy is deprecated. Please use the new composition API:\n' +
                '<HoverBorderButton><HoverBorderButton.Button>...</HoverBorderButton.Button></HoverBorderButton>',
        )
    }

    return (
        <Root
            borderColor={borderColor}
            borderWidth={borderWidth}
            glowIntensity={glowIntensity}
            animationDuration={animationDuration}
        >
            {as === 'a' || href ? (
                <HoverBorderButtonLink href={href} target={target} rel={rel} className={className} onClick={onClick}>
                    {children}
                </HoverBorderButtonLink>
            ) : (
                <HoverBorderButtonButton onClick={onClick} className={className} disabled={disabled}>
                    {children}
                </HoverBorderButtonButton>
            )}
        </Root>
    )
})

HoverBorderButtonLegacy.displayName = 'HoverBorderButtonLegacy'
