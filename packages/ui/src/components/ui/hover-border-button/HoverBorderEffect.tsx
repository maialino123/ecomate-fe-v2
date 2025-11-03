'use client'

/**
 * Gradient overlay effect component
 * Renders the radial gradient that follows the mouse
 */

import { motion } from 'framer-motion'
import { useHoverBorder } from './context'
import type { HoverBorderEffectProps } from './types'

export function HoverBorderEffect(_props: HoverBorderEffectProps) {
    const { mousePosition, isHovered, borderColor, glowIntensity, animationDuration } = useHoverBorder()

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
