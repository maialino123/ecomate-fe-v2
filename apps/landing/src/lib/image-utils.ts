/**
 * Image Utilities
 *
 * Helper functions for working with optimized images from R2 CDN
 */

// R2 CDN Configuration
const CDN_BASE_URL = 'https://cdn.ecomatehome.com'
const IMAGE_PREFIX = 'landing/banners'

// Responsive image widths (must match those in optimize-images.ts)
const RESPONSIVE_WIDTHS = [320, 640, 1024, 1920]

/**
 * Image source set configuration for responsive images
 */
export interface ImageSourceSet {
    src: string
    srcSet: string
    sizes: string
}

/**
 * Get the CDN URL for an optimized image
 *
 * @param imagePath - Base image path (e.g., 'living-room' or 'kitchen-room')
 * @param width - Optional specific width (default: 1024)
 * @param format - Image format (default: 'webp')
 * @returns Full CDN URL
 *
 * @example
 * ```ts
 * getOptimizedImageUrl('living-room') // 'https://cdn.ecomatehome.com/landing/banners/living-room-1024w.webp'
 * getOptimizedImageUrl('living-room', 640) // 'https://cdn.ecomatehome.com/landing/banners/living-room-640w.webp'
 * ```
 */
export function getOptimizedImageUrl(imagePath: string, width: number = 1024, format: 'webp' | 'png' = 'webp'): string {
    // Remove any existing extension or size suffix
    const baseName = imagePath.replace(/\.(png|jpg|jpeg|webp)$/i, '').replace(/-(320w|640w|1024w|1920w)$/i, '')

    // For PNG fallback, don't add width suffix
    if (format === 'png') {
        return `${CDN_BASE_URL}/${IMAGE_PREFIX}/${baseName}.png`
    }

    // Add width suffix for WebP
    return `${CDN_BASE_URL}/${IMAGE_PREFIX}/${baseName}-${width}w.${format}`
}

/**
 * Generate srcSet string for responsive images
 *
 * @param imagePath - Base image path
 * @param format - Image format (default: 'webp')
 * @returns srcSet string for use in <img> or Next.js Image component
 *
 * @example
 * ```ts
 * getImageSrcSet('living-room')
 * // Returns: 'https://cdn.ecomatehome.com/landing/banners/living-room-320w.webp 320w,
 * //           https://cdn.ecomatehome.com/landing/banners/living-room-640w.webp 640w, ...'
 * ```
 */
export function getImageSrcSet(imagePath: string, format: 'webp' | 'png' = 'webp'): string {
    return RESPONSIVE_WIDTHS.map(width => `${getOptimizedImageUrl(imagePath, width, format)} ${width}w`).join(', ')
}

/**
 * Get complete image configuration for Next.js Image component
 *
 * @param imagePath - Base image path
 * @param options - Optional configuration
 * @returns Object with src, srcSet, and sizes configured
 *
 * @example
 * ```ts
 * const imageConfig = getResponsiveImageConfig('living-room')
 * <Image {...imageConfig} alt="Living room" />
 * ```
 */
export function getResponsiveImageConfig(
    imagePath: string,
    options?: {
        defaultWidth?: number
        format?: 'webp' | 'png'
        customSizes?: string
    },
): ImageSourceSet {
    const { defaultWidth = 1024, format = 'webp', customSizes } = options || {}

    return {
        src: getOptimizedImageUrl(imagePath, defaultWidth, format),
        srcSet: getImageSrcSet(imagePath, format),
        sizes: customSizes || '(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 40vw',
    }
}

/**
 * Get blur placeholder data URL
 *
 * @param imagePath - Base image path
 * @returns Data URL for blur placeholder thumbnail
 *
 * Note: This returns the CDN URL for the thumbnail.
 * For inline base64, you'll need to generate it during build time.
 */
export function getBlurPlaceholder(imagePath: string): string {
    const baseName = imagePath.replace(/\.(png|jpg|jpeg|webp)$/i, '').replace(/-(320w|640w|1024w|1920w)$/i, '')

    return `${CDN_BASE_URL}/${IMAGE_PREFIX}/${baseName}-thumb.webp`
}

/**
 * Convert old local image path to new CDN path
 *
 * @param localPath - Old local path (e.g., '/images/snapshot-banner/living-room.png')
 * @returns New base path for CDN (e.g., 'living-room')
 *
 * @example
 * ```ts
 * convertLocalPathToCDN('/images/snapshot-banner/living-room.png') // 'living-room'
 * ```
 */
export function convertLocalPathToCDN(localPath: string): string {
    return localPath.replace(/^\/images\/snapshot-banner\//, '').replace(/\.(png|jpg|jpeg|webp)$/i, '')
}

/**
 * Check if image should be loaded from CDN
 *
 * Can be used to gradually migrate to CDN or provide fallback
 */
export function shouldUseCDN(): boolean {
    // In development, can toggle this via environment variable
    if (typeof window === 'undefined') {
        return process.env.NEXT_PUBLIC_USE_CDN_IMAGES !== 'false'
    }

    return true
}

/**
 * Get image URL with automatic CDN/local fallback
 *
 * @param imagePath - Image path (can be old local path or new CDN path)
 * @param width - Optional width
 * @returns Image URL (CDN or local based on configuration)
 */
export function getImageUrl(imagePath: string, width: number = 1024): string {
    // If it's already a CDN path (no leading slash), use it
    if (!imagePath.startsWith('/')) {
        return getOptimizedImageUrl(imagePath, width)
    }

    // Convert local path to CDN if enabled
    if (shouldUseCDN()) {
        const cdnPath = convertLocalPathToCDN(imagePath)
        return getOptimizedImageUrl(cdnPath, width)
    }

    // Fallback to local path
    return imagePath
}

/**
 * Image configuration constants for reuse across components
 */
export const IMAGE_CONFIGS = {
    // Tour card images
    tourCard: {
        sizes: '(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 40vw',
        quality: {
            mobile: 75,
            desktop: 85,
        },
    },

    // Hero/banner images
    hero: {
        sizes: '100vw',
        quality: {
            mobile: 80,
            desktop: 90,
        },
    },

    // Thumbnail images
    thumbnail: {
        sizes: '(max-width: 640px) 50vw, (max-width: 1024px) 33vw, 25vw',
        quality: {
            mobile: 70,
            desktop: 80,
        },
    },
} as const

/**
 * Get quality setting based on device
 */
export function getImageQuality(type: keyof typeof IMAGE_CONFIGS = 'tourCard'): number {
    if (typeof window === 'undefined') return IMAGE_CONFIGS[type].quality.desktop

    const isMobile = window.innerWidth < 768
    return isMobile ? IMAGE_CONFIGS[type].quality.mobile : IMAGE_CONFIGS[type].quality.desktop
}
