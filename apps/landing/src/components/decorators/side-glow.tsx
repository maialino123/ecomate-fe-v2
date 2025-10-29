'use client'
import { motion } from 'framer-motion'
import { cn } from '@workspace/ui/lib/utils'

interface SideGlowDecoratorProps {
    /**
     * Side of the glow: 'left' | 'right' | 'top' | 'bottom'
     */
    side?: 'left' | 'right' | 'top' | 'bottom'
    /**
     * Color of the glow: 'emerald' | 'blue' | 'purple' | 'orange'
     */
    color?: 'emerald' | 'blue' | 'purple' | 'orange'
    /**
     * Height/Width percentage (default: 60)
     */
    size?: number
    /**
     * Opacity of the glow (default: 0.1)
     */
    opacity?: number
    /**
     * Whether to animate the glow with pulse effect
     */
    animate?: boolean
    /**
     * Blur amount in pixels (default: 96)
     */
    blur?: number
    /**
     * Additional className
     */
    className?: string
}

const colorClasses = {
    emerald: 'from-emerald-500/40 via-emerald-600/20 to-transparent',
    blue: 'from-blue-500/40 via-blue-600/20 to-transparent',
    purple: 'from-purple-500/40 via-purple-600/20 to-transparent',
    orange: 'from-orange-500/40 via-orange-600/20 to-transparent',
}

const sideStyles = {
    left: (size: number) => ({
        left: 0,
        top: '50%',
        transform: 'translateY(-50%)',
        width: '40%',
        height: `${size}%`,
    }),
    right: (size: number) => ({
        right: 0,
        top: '50%',
        transform: 'translateY(-50%)',
        width: '40%',
        height: `${size}%`,
    }),
    top: (size: number) => ({
        top: 0,
        left: '50%',
        transform: 'translateX(-50%)',
        width: `${size}%`,
        height: '40%',
    }),
    bottom: (size: number) => ({
        bottom: 0,
        left: '50%',
        transform: 'translateX(-50%)',
        width: `${size}%`,
        height: '40%',
    }),
}

const gradientDirection = {
    left: 'bg-gradient-to-r',
    right: 'bg-gradient-to-l',
    top: 'bg-gradient-to-b',
    bottom: 'bg-gradient-to-t',
}

export default function SideGlowDecorator({
    side = 'left',
    color = 'emerald',
    size = 60,
    opacity = 0.06,
    animate = true,
    blur = 96,
    className,
}: SideGlowDecoratorProps) {
    const Component = animate ? motion.div : 'div'

    const animationProps = animate
        ? {
              initial: { opacity: 0 },
              animate: { opacity: 1 },
              transition: { duration: 2, delay: 0.5 },
          }
        : {}

    return (
        <Component
            {...animationProps}
            className={cn('absolute pointer-events-none', gradientDirection[side], colorClasses[color], className)}
            style={{
                ...sideStyles[side](size),
                opacity,
                filter: `blur(${blur}px)`,
            }}
        />
    )
}
