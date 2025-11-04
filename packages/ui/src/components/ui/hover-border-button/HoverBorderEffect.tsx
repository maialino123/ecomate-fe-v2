'use client'

/**
 * Gradient overlay effect component
 * Renders the radial gradient that follows the mouse
 * Uses local state for position/hover and shared context for styling config
 *
 * Can be used both inside Button/Link (interactive) or standalone (static)
 */

import { motion } from 'framer-motion'
import { useHoverBorder } from './context'
import { useLocalStateOrDefault } from './LocalStateContext'
import type { HoverBorderEffectProps } from './types'

export function HoverBorderEffect(_props: HoverBorderEffectProps) {
    // Get per-button state from local context (or defaults if outside Button/Link)
    const { mousePosition, isHovered } = useLocalStateOrDefault()
    // Get shared styling config from global context
    const { borderColor, glowIntensity, animationDuration } = useHoverBorder()

    const borderGradientStyle = {
        background: `radial-gradient(circle at ${mousePosition.x}% ${mousePosition.y}%, ${borderColor} 0%, transparent 70%)`,
        opacity: isHovered ? glowIntensity : 0,
        transition: `opacity ${animationDuration}s ease-in-out`,
        willChange: 'opacity',
    }

    return (
        <motion.div
            className="absolute inset-0 pointer-events-none z-[1]"
            style={borderGradientStyle}
            initial={{ opacity: 0 }}
            animate={{ opacity: isHovered ? glowIntensity : 0 }}
            transition={{ duration: animationDuration }}
        />
    )
}

HoverBorderEffect.displayName = 'HoverBorderButton.Effect'
