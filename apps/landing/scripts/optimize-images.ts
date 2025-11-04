/**
 * Image Optimization Script
 *
 * Converts PNG images to WebP format with multiple responsive sizes
 * and generates optimized PNG fallbacks
 *
 * Usage: pnpm optimize:images
 */

import sharp from 'sharp'
import { readdir, mkdir, stat } from 'fs/promises'
import { join, parse } from 'path'
import { existsSync } from 'fs'

// Configuration
const INPUT_DIR = join(process.cwd(), 'public', 'images', 'snapshot-banner')
const OUTPUT_DIR = join(process.cwd(), 'public', 'images-optimized', 'snapshot-banner')

// Responsive image widths
const RESPONSIVE_WIDTHS = [320, 640, 1024, 1920]

// Compression settings
const WEBP_QUALITY = 82
const WEBP_EFFORT = 6
const PNG_COMPRESSION_LEVEL = 9
const THUMBNAIL_SIZE = 64

// Colors for console output
const colors = {
    reset: '\x1b[0m',
    bright: '\x1b[1m',
    green: '\x1b[32m',
    blue: '\x1b[34m',
    yellow: '\x1b[33m',
    cyan: '\x1b[36m',
}

/**
 * Format bytes to human readable size
 */
function formatBytes(bytes: number): string {
    if (bytes === 0) return '0 Bytes'
    const k = 1024
    const sizes = ['Bytes', 'KB', 'MB']
    const i = Math.floor(Math.log(bytes) / Math.log(k))
    return Math.round((bytes / Math.pow(k, i)) * 100) / 100 + ' ' + sizes[i]
}

/**
 * Get file size in bytes
 */
async function getFileSize(filePath: string): Promise<number> {
    try {
        const stats = await stat(filePath)
        return stats.size
    } catch {
        return 0
    }
}

/**
 * Ensure output directory exists
 */
async function ensureOutputDir(): Promise<void> {
    if (!existsSync(OUTPUT_DIR)) {
        await mkdir(OUTPUT_DIR, { recursive: true })
        console.log(`${colors.green}✓${colors.reset} Created output directory: ${OUTPUT_DIR}`)
    }
}

/**
 * Get all PNG files from input directory
 */
async function getPngFiles(): Promise<string[]> {
    const files = await readdir(INPUT_DIR)
    return files.filter(file => file.toLowerCase().endsWith('.png'))
}

/**
 * Generate responsive WebP images
 */
async function generateWebPVariants(
    inputPath: string,
    baseName: string,
): Promise<{ width: number; size: number; path: string }[]> {
    const results: { width: number; size: number; path: string }[] = []

    for (const width of RESPONSIVE_WIDTHS) {
        const outputPath = join(OUTPUT_DIR, `${baseName}-${width}w.webp`)

        await sharp(inputPath)
            .resize(width, null, {
                fit: 'inside',
                withoutEnlargement: true,
            })
            .webp({
                quality: WEBP_QUALITY,
                effort: WEBP_EFFORT,
            })
            .toFile(outputPath)

        const size = await getFileSize(outputPath)
        results.push({ width, size, path: outputPath })

        console.log(
            `  ${colors.cyan}→${colors.reset} WebP ${width}w: ${colors.yellow}${formatBytes(size)}${colors.reset}`,
        )
    }

    return results
}

/**
 * Generate optimized PNG fallback
 */
async function generateOptimizedPng(inputPath: string, baseName: string): Promise<{ size: number; path: string }> {
    const outputPath = join(OUTPUT_DIR, `${baseName}.png`)

    await sharp(inputPath)
        .resize(1024, null, {
            fit: 'inside',
            withoutEnlargement: true,
        })
        .png({
            compressionLevel: PNG_COMPRESSION_LEVEL,
            palette: true,
        })
        .toFile(outputPath)

    const size = await getFileSize(outputPath)

    console.log(`  ${colors.cyan}→${colors.reset} PNG fallback: ${colors.yellow}${formatBytes(size)}${colors.reset}`)

    return { size, path: outputPath }
}

/**
 * Generate blur placeholder thumbnail
 */
async function generateThumbnail(
    inputPath: string,
    baseName: string,
): Promise<{ size: number; path: string; base64: string }> {
    const outputPath = join(OUTPUT_DIR, `${baseName}-thumb.webp`)

    const buffer = await sharp(inputPath)
        .resize(THUMBNAIL_SIZE, THUMBNAIL_SIZE, {
            fit: 'cover',
        })
        .blur(10)
        .webp({
            quality: 20,
        })
        .toBuffer()

    await sharp(buffer).toFile(outputPath)

    const size = buffer.length
    const base64 = `data:image/webp;base64,${buffer.toString('base64')}`

    console.log(`  ${colors.cyan}→${colors.reset} Thumbnail: ${colors.yellow}${formatBytes(size)}${colors.reset}`)

    return { size, path: outputPath, base64 }
}

/**
 * Process a single image file
 */
async function processImage(filename: string): Promise<void> {
    const inputPath = join(INPUT_DIR, filename)
    const { name: baseName } = parse(filename)

    const originalSize = await getFileSize(inputPath)

    console.log(
        `\n${colors.bright}${colors.blue}Processing:${colors.reset} ${filename} ${colors.yellow}(${formatBytes(originalSize)})${colors.reset}`,
    )

    // Generate all variants
    const webpVariants = await generateWebPVariants(inputPath, baseName)
    const pngFallback = await generateOptimizedPng(inputPath, baseName)
    const thumbnail = await generateThumbnail(inputPath, baseName)

    // Calculate total size and savings
    const totalWebPSize = webpVariants.reduce((sum, v) => sum + v.size, 0)
    const allVariantsSize = totalWebPSize + pngFallback.size + thumbnail.size
    const savingsPercent = Math.round(((originalSize - totalWebPSize) / originalSize) * 100)

    console.log(
        `  ${colors.green}✓${colors.reset} Total WebP: ${colors.yellow}${formatBytes(totalWebPSize)}${colors.reset} ${colors.green}(${savingsPercent}% smaller)${colors.reset}`,
    )
    console.log(
        `  ${colors.green}✓${colors.reset} All variants: ${colors.yellow}${formatBytes(allVariantsSize)}${colors.reset}`,
    )
}

/**
 * Main execution
 */
async function main(): Promise<void> {
    console.log(`${colors.bright}${colors.cyan}
┌─────────────────────────────────────────┐
│   Image Optimization Script             │
│   Converting PNG → WebP + Responsive    │
└─────────────────────────────────────────┘
${colors.reset}`)

    try {
        // Ensure output directory exists
        await ensureOutputDir()

        // Get all PNG files
        const pngFiles = await getPngFiles()

        if (pngFiles.length === 0) {
            console.log(`${colors.yellow}⚠ No PNG files found in ${INPUT_DIR}${colors.reset}`)
            return
        }

        console.log(`${colors.cyan}Found ${pngFiles.length} PNG files to process${colors.reset}`)

        // Process each image
        let totalOriginalSize = 0
        let totalOptimizedSize = 0

        for (const file of pngFiles) {
            const inputPath = join(INPUT_DIR, file)
            const originalSize = await getFileSize(inputPath)
            totalOriginalSize += originalSize

            await processImage(file)
        }

        // Calculate output directory size
        const outputFiles = await readdir(OUTPUT_DIR)
        for (const file of outputFiles) {
            const size = await getFileSize(join(OUTPUT_DIR, file))
            totalOptimizedSize += size
        }

        // Summary
        const totalSavings = totalOriginalSize - totalOptimizedSize
        const totalSavingsPercent = Math.round((totalSavings / totalOriginalSize) * 100)

        console.log(`\n${colors.bright}${colors.green}
┌─────────────────────────────────────────┐
│   Optimization Complete!                │
└─────────────────────────────────────────┘${colors.reset}`)

        console.log(`
${colors.bright}Summary:${colors.reset}
  Original total:    ${colors.yellow}${formatBytes(totalOriginalSize)}${colors.reset}
  Optimized total:   ${colors.yellow}${formatBytes(totalOptimizedSize)}${colors.reset}
  Savings:           ${colors.green}${formatBytes(totalSavings)} (${totalSavingsPercent}%)${colors.reset}
  Files generated:   ${colors.cyan}${outputFiles.length}${colors.reset}
  Output directory:  ${colors.cyan}${OUTPUT_DIR}${colors.reset}

${colors.bright}Responsive sizes generated:${colors.reset}
  ${RESPONSIVE_WIDTHS.map(w => `${w}w`).join(', ')}

${colors.bright}Next steps:${colors.reset}
  1. Run: ${colors.cyan}pnpm generate:upload${colors.reset}
  2. Upload to R2: ${colors.cyan}bash scripts/r2-upload-commands.sh${colors.reset}
  3. Verify: ${colors.cyan}wrangler r2 object list ecomate-dev --prefix=landing/banners/${colors.reset}
`)
    } catch (error) {
        console.error(`${colors.bright}${colors.yellow}Error:${colors.reset}`, error)
        process.exit(1)
    }
}

// Run the script
main()
