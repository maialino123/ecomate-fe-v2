/**
 * R2 Upload Commands Generator
 *
 * Generates Wrangler CLI commands for uploading optimized images to R2
 *
 * Usage: pnpm generate:upload
 */

import { readdir } from 'fs/promises'
import { join, extname } from 'path'
import { writeFile } from 'fs/promises'

// Configuration
const INPUT_DIR = join(process.cwd(), 'public', 'images-optimized', 'snapshot-banner')
const OUTPUT_SCRIPT = join(process.cwd(), 'scripts', 'r2-upload-commands.sh')
const R2_BUCKET = 'ecomate-dev'
const R2_PREFIX = 'landing/banners'

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
 * Get content type based on file extension
 */
function getContentType(filename: string): string {
    const ext = extname(filename).toLowerCase()
    switch (ext) {
        case '.webp':
            return 'image/webp'
        case '.png':
            return 'image/png'
        case '.jpg':
        case '.jpeg':
            return 'image/jpeg'
        default:
            return 'application/octet-stream'
    }
}

/**
 * Generate Wrangler upload command for a file
 */
function generateUploadCommand(filename: string): string {
    const contentType = getContentType(filename)
    const relativePath = `public/images-optimized/snapshot-banner/${filename}`
    const r2Key = `${R2_PREFIX}/${filename}`

    return `wrangler r2 object put ${R2_BUCKET}/${r2Key} \\
  --file="${relativePath}" \\
  --content-type="${contentType}" \\
  --cache-control="public, max-age=31536000, immutable"`
}

/**
 * Main execution
 */
async function main(): Promise<void> {
    console.log(`${colors.bright}${colors.cyan}
┌─────────────────────────────────────────┐
│   R2 Upload Commands Generator          │
└─────────────────────────────────────────┘
${colors.reset}`)

    try {
        // Read optimized images directory
        const files = await readdir(INPUT_DIR)
        const imageFiles = files.filter(file =>
            /\.(webp|png|jpg|jpeg)$/i.test(file)
        )

        if (imageFiles.length === 0) {
            console.log(`${colors.yellow}⚠ No image files found in ${INPUT_DIR}${colors.reset}`)
            console.log(`${colors.yellow}  Run 'pnpm optimize:images' first${colors.reset}`)
            return
        }

        console.log(`${colors.cyan}Found ${imageFiles.length} image files${colors.reset}\n`)

        // Group files by base name for better organization
        const filesByImage = imageFiles.reduce((acc, file) => {
            const baseName = file.split('-')[0] + (file.split('-')[1] || '')
            const key = baseName.replace(/-(320w|640w|1024w|1920w|thumb).*$/, '')
            if (!acc[key]) acc[key] = []
            acc[key].push(file)
            return acc
        }, {} as Record<string, string[]>)

        // Generate bash script
        let scriptContent = `#!/bin/bash
#
# R2 Upload Script
# Generated automatically by generate-upload-commands.ts
#
# This script uploads optimized images to Cloudflare R2
#
# Prerequisites:
#   - Wrangler CLI installed: npm install -g wrangler
#   - Authenticated: wrangler login
#
# Usage:
#   bash scripts/r2-upload-commands.sh
#

set -e  # Exit on error

echo "======================================"
echo "  Uploading images to R2..."
echo "  Bucket: ${R2_BUCKET}"
echo "  Prefix: ${R2_PREFIX}"
echo "======================================"
echo ""

# Color codes for output
GREEN='\\033[0;32m'
BLUE='\\033[0;34m'
NC='\\033[0m' # No Color

`

        let commandCount = 0

        // Generate commands grouped by image
        for (const [imageName, files] of Object.entries(filesByImage)) {
            scriptContent += `# ${imageName}\n`
            scriptContent += `echo "\${BLUE}Uploading ${imageName}...\${NC}"\n\n`

            // Sort files: responsive sizes first, then PNG, then thumbnail
            const sortedFiles = files.sort((a, b) => {
                if (a.includes('-320w')) return -1
                if (b.includes('-320w')) return 1
                if (a.includes('-640w')) return -1
                if (b.includes('-640w')) return 1
                if (a.includes('-1024w')) return -1
                if (b.includes('-1024w')) return 1
                if (a.includes('-1920w')) return -1
                if (b.includes('-1920w')) return 1
                if (a.endsWith('.png')) return -1
                if (b.endsWith('.png')) return 1
                return 0
            })

            for (const file of sortedFiles) {
                scriptContent += generateUploadCommand(file) + '\n'
                scriptContent += `echo "\${GREEN}✓\${NC} Uploaded ${file}"\n\n`
                commandCount++

                console.log(`  ${colors.cyan}→${colors.reset} ${file}`)
            }

            scriptContent += '\n'
        }

        // Add verification commands
        scriptContent += `
echo ""
echo "======================================"
echo "  Upload Complete!"
echo "======================================"
echo ""
echo "Verifying uploads..."
echo ""

# List uploaded files
wrangler r2 object list ${R2_BUCKET} --prefix="${R2_PREFIX}/"

echo ""
echo "======================================"
echo "  All Done!"
echo "======================================"
echo ""
echo "Next steps:"
echo "  1. Verify files at: https://cdn.ecomatehome.com/${R2_PREFIX}/"
echo "  2. Update Next.js config and components"
echo "  3. Test on dev server: pnpm dev"
echo ""
`

        // Write to file
        await writeFile(OUTPUT_SCRIPT, scriptContent, { mode: 0o755 })

        console.log(`\n${colors.bright}${colors.green}
┌─────────────────────────────────────────┐
│   Script Generated Successfully!        │
└─────────────────────────────────────────┘${colors.reset}`)

        console.log(`
${colors.bright}Summary:${colors.reset}
  Files to upload:   ${colors.cyan}${imageFiles.length}${colors.reset}
  Commands generated: ${colors.cyan}${commandCount}${colors.reset}
  Output script:     ${colors.cyan}${OUTPUT_SCRIPT}${colors.reset}
  R2 Bucket:         ${colors.cyan}${R2_BUCKET}${colors.reset}
  R2 Prefix:         ${colors.cyan}${R2_PREFIX}${colors.reset}

${colors.bright}Next steps:${colors.reset}
  1. Review the script: ${colors.cyan}cat ${OUTPUT_SCRIPT}${colors.reset}
  2. Make it executable: ${colors.cyan}chmod +x ${OUTPUT_SCRIPT}${colors.reset} (Linux/Mac)
  3. Authenticate Wrangler: ${colors.cyan}wrangler login${colors.reset}
  4. Run upload script: ${colors.cyan}bash ${OUTPUT_SCRIPT}${colors.reset}

${colors.bright}Windows users:${colors.reset}
  Use Git Bash or WSL to run the script, or run commands manually
`)

        // Also generate a Windows batch file
        const batchScript = join(process.cwd(), 'scripts', 'r2-upload-commands.bat')
        let batchContent = `@echo off
REM R2 Upload Script (Windows)
REM Generated automatically

echo ======================================
echo   Uploading images to R2...
echo   Bucket: ${R2_BUCKET}
echo   Prefix: ${R2_PREFIX}
echo ======================================
echo.

`

        for (const [imageName, files] of Object.entries(filesByImage)) {
            batchContent += `REM ${imageName}\n`
            batchContent += `echo Uploading ${imageName}...\n`

            for (const file of files) {
                const contentType = getContentType(file)
                const relativePath = `public\\images-optimized\\snapshot-banner\\${file}`
                const r2Key = `${R2_PREFIX}/${file}`

                batchContent += `wrangler r2 object put ${R2_BUCKET}/${r2Key} --file="${relativePath}" --content-type="${contentType}" --cache-control="public, max-age=31536000, immutable"\n`
                batchContent += `echo   Done: ${file}\n`
            }
            batchContent += '\n'
        }

        batchContent += `
echo.
echo ======================================
echo   Upload Complete!
echo ======================================
echo.

wrangler r2 object list ${R2_BUCKET} --prefix="${R2_PREFIX}/"

echo.
echo Next steps:
echo   1. Verify files at: https://cdn.ecomatehome.com/${R2_PREFIX}/
echo   2. Update Next.js config and components
echo   3. Test on dev server: pnpm dev
echo.
pause
`

        await writeFile(batchScript, batchContent)
        console.log(`${colors.green}✓${colors.reset} Also generated Windows batch file: ${colors.cyan}${batchScript}${colors.reset}\n`)

    } catch (error) {
        console.error(`${colors.bright}${colors.yellow}Error:${colors.reset}`, error)
        process.exit(1)
    }
}

// Run the script
main()
