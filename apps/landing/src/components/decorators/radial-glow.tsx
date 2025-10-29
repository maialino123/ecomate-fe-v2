'use client'
import { motion } from 'framer-motion'
import { cn } from '@workspace/ui/lib/utils'

interface RadialGlowDecoratorProps {
    /**
     * Position of the glow: 'center' | 'top' | 'bottom' | 'left' | 'right'
     */
    position?:
        | 'center'
        | 'top'
        | 'bottom'
        | 'left'
        | 'right'
        | 'top-left'
        | 'top-right'
        | 'bottom-left'
        | 'bottom-right'
    /**
     * Color of the glow: 'emerald' | 'blue' | 'purple' | 'orange'
     */
    color?: 'emerald' | 'blue' | 'purple' | 'orange'
    /**
     * Size of the glow in pixels (default: 400)
     */
    size?: number
    /**
     * Opacity of the glow (default: 0.15)
     */
    opacity?: number
    /**
     * Whether to animate the glow with pulse effect
     */
    animate?: boolean
    /**
     * Blur amount in pixels (default: 128)
     */
    blur?: number
    /**
     * Additional className
     */
    className?: string
}

const positionClasses = {
    center: 'top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2',
    top: 'top-0 left-1/2 -translate-x-1/2 -translate-y-1/2',
    bottom: 'bottom-0 left-1/2 -translate-x-1/2 translate-y-1/2',
    left: 'top-1/2 left-0 -translate-x-1/2 -translate-y-1/2',
    right: 'top-1/2 right-0 translate-x-1/2 -translate-y-1/2',
    'top-left': 'top-0 left-0 -translate-x-1/2 -translate-y-1/2',
    'top-right': 'top-0 right-0 translate-x-1/2 -translate-y-1/2',
    'bottom-left': 'bottom-0 left-0 -translate-x-1/2 translate-y-1/2',
    'bottom-right': 'bottom-0 right-0 translate-x-1/2 translate-y-1/2',
}

const colorClasses = {
    emerald: 'bg-emerald-500',
    blue: 'bg-blue-500',
    purple: 'bg-purple-500',
    orange: 'bg-orange-500',
}

export default function RadialGlowDecorator({
    position = 'center',
    color = 'emerald',
    size = 400,
    opacity = 0.06,
    animate = true,
    blur = 128,
    className,
}: RadialGlowDecoratorProps) {
    const Component = animate ? motion.div : 'div'

    const animationProps = animate
        ? {
              initial: { opacity: 0, scale: 0.8 },
              animate: { opacity: 1, scale: 1 },
              transition: { duration: 1.5, delay: 0.2 },
          }
        : {}

    return (
        <Component
            {...animationProps}
            className={cn('absolute pointer-events-none', positionClasses[position], className)}
            style={{
                width: size,
                height: size,
            }}
        >
            <div
                className={cn('w-full h-full rounded-full', colorClasses[color], animate && 'animate-pulse')}
                style={{
                    opacity,
                    filter: `blur(${blur}px)`,
                }}
            />
        </Component>
    )
}
