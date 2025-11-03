'use client'
import Image from 'next/image'
import { cn } from '@workspace/ui/lib/utils'

/**
 * Visual variants for BackgroundOrnament positioning and sizing
 */
type OrnamentVariant = 'full-width' | 'peek-left' | 'peek-right'

/**
 * Available ornament images
 */
type OrnamentImage = 'journey' | 'usp'

interface BackgroundOrnamentProps {
    /**
     * Visual variant controlling position and sizing behavior
     *
     * - `full-width`: Covers entire container (hero sections)
     * - `peek-left`: Positioned on left side with centered vertical alignment
     * - `peek-right`: Positioned on right side with centered vertical alignment
     */
    variant: OrnamentVariant
    /**
     * Which ornament image to display
     */
    image: OrnamentImage
    /**
     * Opacity override (defaults: 1 for full-width, 0.06 for peek variants)
     */
    opacity?: number
    /**
     * Additional className for fine-tuning (z-index, etc.)
     */
    className?: string
}

const imagePaths: Record<OrnamentImage, string> = {
    journey: '/images/background/journey-ornament.webp',
    usp: '/images/background/usp-ornament.webp',
}

/**
 * Variant configuration using object mapping pattern
 * Following COMPOSITION_PATTERNS.md guidelines
 */
const variantStyles: Record<
    OrnamentVariant,
    {
        positioning: string
        size: string
        opacity: number
    }
> = {
    'full-width': {
        positioning: 'inset-0',
        size: 'w-full h-full',
        opacity: 1,
    },
    'peek-left': {
        positioning: 'left-0 top-1/2 -translate-y-1/2',
        size: 'w-full h-screen max-h-screen',
        opacity: 0.06,
    },
    'peek-right': {
        positioning: 'right-0 top-1/2 -translate-y-1/2',
        size: 'w-full h-screen max-h-screen',
        opacity: 0.06,
    },
}

/**
 * BackgroundOrnament - Decorative background images
 *
 * @example Full-width hero decoration
 * ```tsx
 * <BackgroundOrnament variant="full-width" image="journey" className="z-0" />
 * ```
 *
 * @example Peeking side decorations
 * ```tsx
 * <BackgroundOrnament variant="peek-left" image="journey" />
 * <BackgroundOrnament variant="peek-right" image="usp" />
 * ```
 */
export default function BackgroundOrnament({ variant, image, opacity, className }: BackgroundOrnamentProps) {
    const config = variantStyles[variant]
    const finalOpacity = opacity ?? config.opacity

    return (
        <div
            className={cn(
                // Base styles
                'absolute pointer-events-none',
                'hidden md:block',

                // Variant-specific styles
                config.positioning,
                config.size,

                // User overrides
                className,
            )}
            style={{ opacity: finalOpacity }}
            aria-hidden="true"
        >
            <Image src={imagePaths[image]} alt="" fill className="object-contain" quality={100} priority />
        </div>
    )
}

// Export types for consumers
export type { OrnamentVariant, OrnamentImage, BackgroundOrnamentProps }
