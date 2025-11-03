'use client'
import { motion } from 'framer-motion'

interface BackgroundPathsProps {
    opacity?: number
    strokeColor?: string
}

export default function BackgroundPaths({ opacity = 0.12, strokeColor = 'rgb(100, 116, 139)' }: BackgroundPathsProps) {
    // 5 optimized curved paths for performance
    // Designed for 1920x1080 viewBox to cover full screen vertically
    const paths = [
        {
            id: 1,
            d: 'M-200 100C200 150 600 200 960 300C1320 400 1600 500 2100 600',
            duration: 25,
        },
        {
            id: 2,
            d: 'M-300 250C100 280 500 320 960 450C1420 580 1700 680 2200 800',
            duration: 30,
        },
        {
            id: 3,
            d: 'M-250 400C150 420 550 480 960 600C1370 720 1650 840 2150 1000',
            duration: 28,
        },
        {
            id: 4,
            d: 'M-350 180C50 220 450 280 960 380C1470 480 1750 580 2250 700',
            duration: 32,
        },
        {
            id: 5,
            d: 'M-280 320C120 360 520 420 960 520C1400 620 1680 740 2180 880',
            duration: 27,
        },
    ]

    return (
        <div className="absolute inset-0 pointer-events-none overflow-hidden">
            <svg className="w-full h-full" viewBox="0 0 1920 1080" fill="none" preserveAspectRatio="xMidYMid slice">
                <title>Background Paths</title>
                {paths.map(path => (
                    <motion.path
                        key={path.id}
                        d={path.d}
                        stroke={strokeColor}
                        strokeWidth={2.2}
                        fill="none"
                        initial={{ pathLength: 0.3, opacity: 0 }}
                        animate={{
                            pathLength: 1,
                            opacity: [0.3, opacity, 0.3],
                        }}
                        transition={{
                            duration: path.duration,
                            repeat: Infinity,
                            ease: 'easeInOut',
                        }}
                        style={{
                            willChange: 'opacity',
                        }}
                    />
                ))}
            </svg>
        </div>
    )
}
