'use client'
import Image from 'next/image'
import { cn } from '@workspace/ui/lib/utils'

interface BackgroundOrnamentProps {
    /**
     * Which ornament image to use
     */
    image: 'journey' | 'usp'
    /**
     * Which side to position the ornament
     */
    side: 'left' | 'right'
    /**
     * Opacity of the ornament (default: 0.06)
     */
    opacity?: number
    /**
     * Vertical position adjustment (default: 'center')
     */
    verticalAlign?: 'top' | 'center' | 'bottom'
    /**
     * Additional className
     */
    className?: string
}

const imagePaths = {
    journey: '/images/background/journey-ornament.webp',
    usp: '/images/background/usp-ornament.webp',
}

const sidePositions = {
    left: 'left-0 -translate-x-1/2',
    right: 'right-0 translate-x-1/2',
}

const verticalPositions = {
    top: 'top-20',
    center: 'top-1/2 -translate-y-1/2',
    bottom: 'bottom-20',
}

export default function BackgroundOrnament({
    image,
    side,
    opacity = 0.06,
    verticalAlign = 'center',
    className,
}: BackgroundOrnamentProps) {
    return (
        <div
            className={cn(
                'absolute pointer-events-none',
                'hidden xl:block', // Hide on mobile/tablet, show on xl screens (1280px+)
                sidePositions[side],
                verticalPositions[verticalAlign],
                className,
            )}
            style={{
                opacity,
                width: '600px',
                height: '600px',
                maxWidth: '40vw',
                maxHeight: '40vw',
            }}
        >
            <Image src={imagePaths[image]} alt="" fill className="object-contain" priority={false} quality={90} />
        </div>
    )
}
