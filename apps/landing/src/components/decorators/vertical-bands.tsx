'use client'
import { motion } from 'framer-motion'
import { cn } from '@workspace/ui/lib/utils'

interface Band {
    /**
     * Color of the band: 'emerald' | 'blue' | 'purple' | 'orange'
     */
    color: 'emerald' | 'blue' | 'purple' | 'orange'
    /**
     * Position percentage (0-100)
     */
    position: number
    /**
     * Width percentage (default: 30)
     */
    width?: number
}

interface VerticalBandsDecoratorProps {
    /**
     * Array of bands to render
     */
    bands: Band[]
    /**
     * Opacity of the bands (default: 0.08)
     */
    opacity?: number
    /**
     * Whether to animate the bands
     */
    animate?: boolean
    /**
     * Blur amount in pixels (default: 80)
     */
    blur?: number
    /**
     * Additional className
     */
    className?: string
}

const colorClasses = {
    emerald: 'bg-gradient-to-b from-emerald-500/40 via-emerald-600/20 to-transparent',
    blue: 'bg-gradient-to-b from-blue-500/40 via-blue-600/20 to-transparent',
    purple: 'bg-gradient-to-b from-purple-500/40 via-purple-600/20 to-transparent',
    orange: 'bg-gradient-to-b from-orange-500/40 via-orange-600/20 to-transparent',
}

export default function VerticalBandsDecorator({
    bands,
    opacity = 0.04,
    animate = true,
    blur = 80,
    className,
}: VerticalBandsDecoratorProps) {
    return (
        <div className={cn('absolute inset-0 overflow-hidden pointer-events-none', className)}>
            {bands.map((band, index) => {
                const Component = animate ? motion.div : 'div'
                const animationProps = animate
                    ? {
                          initial: { opacity: 0, x: -50 },
                          whileInView: { opacity: 1, x: 0 },
                          transition: { duration: 1.5, delay: index * 0.2 },
                          viewport: { once: true },
                      }
                    : {}

                return (
                    <Component
                        key={index}
                        {...animationProps}
                        className={cn('absolute h-full', colorClasses[band.color])}
                        style={{
                            left: `${band.position}%`,
                            width: `${band.width || 30}%`,
                            opacity,
                            filter: `blur(${blur}px)`,
                            transform: 'translateX(-50%)',
                        }}
                    />
                )
            })}
        </div>
    )
}
