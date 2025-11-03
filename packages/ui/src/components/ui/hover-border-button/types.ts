/**
 * Type definitions for HoverBorderButton compound component
 */

import type { ComponentPropsWithoutRef, PropsWithChildren } from 'react'

/**
 * Context value shared across all HoverBorderButton subcomponents
 */
export interface HoverBorderContextValue {
    /** Current mouse position as percentage (0-100) */
    mousePosition: { x: number; y: number }
    /** Whether the button is currently hovered */
    isHovered: boolean
    /** Border color (rgba, hex, etc.) */
    borderColor: string
    /** Border width in CSS units */
    borderWidth: string
    /** Glow effect intensity (0-1) */
    glowIntensity: number
    /** Animation duration in seconds */
    animationDuration: number
    /** Ref to the button/link element for position calculations */
    elementRef: React.RefObject<HTMLElement | null>
    /** Mouse event handlers */
    handleMouseMove: (e: React.MouseEvent<HTMLElement>) => void
    handleMouseEnter: () => void
    handleMouseLeave: () => void
}

/**
 * Props for the root HoverBorderButton component (Provider)
 */
export interface HoverBorderButtonProps extends PropsWithChildren {
    /** Border color for hover effect */
    borderColor?: string
    /** Border width */
    borderWidth?: string
    /** Glow intensity (0-1) */
    glowIntensity?: number
    /** Animation duration in seconds */
    animationDuration?: number
}

/**
 * Props for HoverBorderButton.Button variant
 */
// eslint-disable-next-line @typescript-eslint/no-empty-object-type
export interface HoverBorderButtonButtonProps extends ComponentPropsWithoutRef<'button'> {}

/**
 * Props for HoverBorderButton.Link variant
 */
// eslint-disable-next-line @typescript-eslint/no-empty-object-type
export interface HoverBorderButtonLinkProps extends ComponentPropsWithoutRef<'a'> {}

/**
 * Props for HoverBorderButton.Frame (visual container)
 */
// eslint-disable-next-line @typescript-eslint/no-empty-object-type
export interface HoverBorderFrameProps extends ComponentPropsWithoutRef<'div'> {}

/**
 * Props for HoverBorderButton.Effect (gradient overlay)
 */
// eslint-disable-next-line @typescript-eslint/no-empty-object-type
export interface HoverBorderEffectProps {}

/**
 * Props for HoverBorderButton.Border (border frame)
 */
// eslint-disable-next-line @typescript-eslint/no-empty-object-type
export interface HoverBorderBorderProps {}
