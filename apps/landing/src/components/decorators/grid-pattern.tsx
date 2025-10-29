'use client'
import { motion } from 'framer-motion'
import { cn } from '@workspace/ui/lib/utils'

interface GridPatternDecoratorProps {
    /**
     * Pattern type: 'dots' | 'lines' | 'grid'
     */
    pattern?: 'dots' | 'lines' | 'grid'
    /**
     * Color of the pattern: 'emerald' | 'blue' | 'purple' | 'white'
     */
    color?: 'emerald' | 'blue' | 'purple' | 'white'
    /**
     * Size of the grid cells in pixels (default: 40)
     */
    cellSize?: number
    /**
     * Opacity of the pattern (default: 0.05)
     */
    opacity?: number
    /**
     * Whether to animate the pattern
     */
    animate?: boolean
    /**
     * Additional className
     */
    className?: string
}

const colorValues = {
    emerald: 'rgb(16, 185, 129)',
    blue: 'rgb(59, 130, 246)',
    purple: 'rgb(168, 85, 247)',
    white: 'rgb(255, 255, 255)',
}

const getPatternStyle = (pattern: 'dots' | 'lines' | 'grid', color: string, cellSize: number) => {
    const colorValue = colorValues[color as keyof typeof colorValues]

    switch (pattern) {
        case 'dots':
            return {
                backgroundImage: `radial-gradient(circle at 1px 1px, ${colorValue} 1px, transparent 0)`,
                backgroundSize: `${cellSize}px ${cellSize}px`,
            }
        case 'lines':
            return {
                backgroundImage: `linear-gradient(${colorValue} 1px, transparent 1px), linear-gradient(90deg, ${colorValue} 1px, transparent 1px)`,
                backgroundSize: `${cellSize}px ${cellSize}px`,
            }
        case 'grid':
            return {
                backgroundImage: `
                    linear-gradient(${colorValue} 1px, transparent 1px),
                    linear-gradient(90deg, ${colorValue} 1px, transparent 1px),
                    linear-gradient(${colorValue} 2px, transparent 2px),
                    linear-gradient(90deg, ${colorValue} 2px, transparent 2px)
                `,
                backgroundSize: `${cellSize}px ${cellSize}px, ${cellSize}px ${cellSize}px, ${cellSize * 5}px ${cellSize * 5}px, ${cellSize * 5}px ${cellSize * 5}px`,
            }
        default:
            return {}
    }
}

export default function GridPatternDecorator({
    pattern = 'dots',
    color = 'white',
    cellSize = 40,
    opacity = 0.12,
    animate = false,
    className,
}: GridPatternDecoratorProps) {
    const Component = animate ? motion.div : 'div'

    const animationProps = animate
        ? {
              initial: { opacity: 0 },
              animate: { opacity: 1 },
              transition: { duration: 1.5, delay: 0.3 },
          }
        : {}

    return (
        <Component
            {...animationProps}
            className={cn('absolute inset-0 pointer-events-none', className)}
            style={{
                ...getPatternStyle(pattern, color, cellSize),
                opacity,
            }}
        />
    )
}
