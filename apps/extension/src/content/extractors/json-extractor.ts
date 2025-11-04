/**
 * 1688 Product Data Extractor
 *
 * Implements multiple strategies to extract product data from 1688.com pages:
 * 1. Window global variables (React apps)
 * 2. Script tags with JSON data
 * 3. Inline script parsing
 * 4. DOM scraping (fallback)
 */

import type { Raw1688Data } from '@workspace/lib'
import { extractFromDOM } from './dom-extractor'

/**
 * Main extraction function
 * Tries multiple strategies in priority order
 */
export function extractProductData(): Raw1688Data {
    console.log('[1688 Extractor] Starting extraction...')

    let rawData: Raw1688Data | null = null

    // Strategy 1: window.__INITIAL_STATE__ (modern React apps)
    const initialState = tryExtractFromWindow('__INITIAL_STATE__')
    if (initialState) {
        console.log('[1688 Extractor] ✅ Found data in window.__INITIAL_STATE__')
        rawData = initialState
    }

    // Strategy 2: window.detailData (older pages)
    if (!rawData) {
        const detailData = tryExtractFromWindow('detailData')
        if (detailData) {
            console.log('[1688 Extractor] ✅ Found data in window.detailData')
            rawData = detailData
        }
    }

    // Strategy 3: window.offerData
    if (!rawData) {
        const offerData = tryExtractFromWindow('offerData')
        if (offerData) {
            console.log('[1688 Extractor] ✅ Found data in window.offerData')
            rawData = offerData
        }
    }

    // Strategy 4: Script tags with application/json
    if (!rawData) {
        const scriptData = tryExtractFromScriptTags()
        if (scriptData) {
            console.log('[1688 Extractor] ✅ Found data in script tags')
            rawData = scriptData
        }
    }

    // Strategy 5: Parse from inline scripts (look for JSON in script text)
    if (!rawData) {
        const inlineScriptData = tryExtractFromInlineScripts()
        if (inlineScriptData) {
            console.log('[1688 Extractor] ✅ Found data in inline scripts')
            rawData = inlineScriptData
        }
    }

    // Strategy 6: DOM scraping (fallback)
    if (!rawData) {
        console.log('[1688 Extractor] Trying DOM scraping as fallback...')
        try {
            const domData = extractFromDOM()
            console.log('[1688 Extractor] ✅ Extracted data from DOM')
            rawData = domData
        } catch (domError) {
            console.error('[1688 Extractor] DOM extraction also failed:', domError)
        }
    }

    // Extract video URL separately (may not be in main data structure)
    if (rawData) {
        const videoUrl = extractVideoUrl()
        if (videoUrl) {
            console.log('[1688 Extractor] ✅ Found video URL:', videoUrl)
            rawData._videoUrl = videoUrl
        } else {
            console.log('[1688 Extractor] ℹ️ No video found on this page')
        }
        return rawData
    }

    // All strategies failed - provide detailed error
    const debugInfo = getDebugInfo()
    console.error('[1688 Extractor] ❌ All extraction strategies failed')
    console.error('[1688 Extractor] Debug info:', debugInfo)

    throw new Error(
        'Could not extract product data from this page.\n\n' +
            'Debug Information:\n' +
            `- URL: ${debugInfo.url}\n` +
            `- Scripts found: ${debugInfo.scriptCount}\n` +
            `- Scripts with "offerId": ${debugInfo.scriptsWithOfferId}\n` +
            `- Price elements: ${debugInfo.priceElements}\n` +
            `- Images found: ${debugInfo.images}\n\n` +
            'Please ensure you are on a valid 1688 product detail page.\n' +
            'If the problem persists, please report this issue.',
    )
}

/**
 * Get debug information about the page
 */
function getDebugInfo() {
    return {
        url: window.location.href,
        scriptCount: document.querySelectorAll('script').length,
        scriptsWithOfferId: Array.from(document.querySelectorAll('script')).filter(s =>
            s.textContent?.includes('offerId'),
        ).length,
        priceElements: document.querySelectorAll('[class*="price"], [class*="Price"]').length,
        images: document.querySelectorAll('img[src*="cbu"], img[data-src*="cbu"]').length,
    }
}

/**
 * Try to extract data from window global variables
 */
function tryExtractFromWindow(key: string): Raw1688Data | null {
    try {
        const data = (window as any)[key]
        if (data && typeof data === 'object') {
            // Validate it looks like product data
            if (hasProductData(data)) {
                return data
            }
        }
    } catch (e) {
        console.warn(`[1688 Extractor] Failed to access window.${key}:`, e)
    }
    return null
}

/**
 * Try to extract from <script type="application/json"> tags
 */
function tryExtractFromScriptTags(): Raw1688Data | null {
    const scripts = document.querySelectorAll('script[type="application/json"]')

    for (const script of scripts) {
        try {
            const data = JSON.parse(script.textContent || '')
            if (hasProductData(data)) {
                return data
            }
        } catch (e) {
            // Continue to next script
            continue
        }
    }

    return null
}

/**
 * Try to extract from inline script tags (look for var/const declarations)
 */
function tryExtractFromInlineScripts(): Raw1688Data | null {
    const scripts = document.querySelectorAll('script:not([src])')

    // Common variable patterns to look for
    const patterns = [
        /var\s+__INITIAL_STATE__\s*=\s*({.+?});/s,
        /var\s+detailData\s*=\s*({.+?});/s,
        /var\s+offerData\s*=\s*({.+?});/s,
        /const\s+__INITIAL_STATE__\s*=\s*({.+?});/s,
        /window\.__INITIAL_STATE__\s*=\s*({.+?});/s,
    ]

    for (const script of scripts) {
        const content = script.textContent || ''

        for (const pattern of patterns) {
            const match = content.match(pattern)
            if (match && match[1]) {
                try {
                    const data = JSON.parse(match[1])
                    if (hasProductData(data)) {
                        return data
                    }
                } catch (e) {
                    // Continue to next pattern
                    continue
                }
            }
        }
    }

    return null
}

/**
 * Check if data object looks like valid product data
 * This helps filter out unrelated JSON data
 */
function hasProductData(data: any): boolean {
    if (!data || typeof data !== 'object') return false

    // Check for common product data fields
    const hasId = !!(data.offerId || data.productId || data.id)

    const hasTitle = !!(data.subject || data.title || data.offerTitle || data.productName)

    const hasPrice = !!(data.priceRange || data.price || data.salePrice || data.consignPrice || data.skuPrices)

    const hasImages = !!(data.image || data.images || data.offerImgList || data.mainImage)

    // Need at least ID + (title OR price OR images)
    return hasId && (hasTitle || hasPrice || hasImages)
}

/**
 * Get current page URL info
 */
export function getPageInfo() {
    const url = window.location.href
    const isDetailPage = url.includes('detail.1688.com') || url.includes('offer')

    return {
        url,
        isDetailPage,
        offerId: extractOfferIdFromUrl(url),
    }
}

/**
 * Extract offer ID from URL
 */
function extractOfferIdFromUrl(url: string): string | null {
    // URL formats:
    // https://detail.1688.com/offer/725123406270.html
    // https://m.1688.com/offer/725123406270.html
    const match = url.match(/offer[\/](\d+)/)
    return match && match[1] ? match[1] : null
}

/**
 * Extract video URL from various sources
 * Videos on 1688 can be embedded in different ways:
 * 1. Window global variables (offerVideoList, videoList, etc.)
 * 2. Script tags with video JSON data
 * 3. <video> elements in DOM
 * 4. Data attributes (data-video-src, data-src)
 */
function extractVideoUrl(): string | null {
    console.log('[1688 Video Extractor] Attempting to extract video URL...')

    // Strategy 1: Check window globals for video data
    const videoFromWindow = extractVideoFromWindowGlobals()
    if (videoFromWindow) {
        console.log('[1688 Video Extractor] ✅ Found video in window globals')
        return videoFromWindow
    }

    // Strategy 2: Check script tags for video data
    const videoFromScripts = extractVideoFromScripts()
    if (videoFromScripts) {
        console.log('[1688 Video Extractor] ✅ Found video in script tags')
        return videoFromScripts
    }

    // Strategy 3: Check DOM for video elements (will be implemented in dom-extractor)
    const videoFromDOM = extractVideoFromDOM()
    if (videoFromDOM) {
        console.log('[1688 Video Extractor] ✅ Found video in DOM')
        return videoFromDOM
    }

    console.log('[1688 Video Extractor] ℹ️ No video URL found')
    return null
}

/**
 * Extract video URL from window global variables
 */
function extractVideoFromWindowGlobals(): string | null {
    try {
        // Common video data locations in 1688 pages
        const windowObj = window as any

        // Check __INITIAL_STATE__.offerVideoList
        if (windowObj.__INITIAL_STATE__?.offerVideoList) {
            const videoList = windowObj.__INITIAL_STATE__.offerVideoList
            if (Array.isArray(videoList) && videoList.length > 0) {
                const videoUrl = videoList[0]?.videoUrl || videoList[0]?.url
                if (videoUrl && isValid1688VideoUrl(videoUrl)) {
                    return normalizeVideoUrl(videoUrl)
                }
            }
        }

        // Check __INITIAL_STATE__.videoList
        if (windowObj.__INITIAL_STATE__?.videoList) {
            const videoList = windowObj.__INITIAL_STATE__.videoList
            if (Array.isArray(videoList) && videoList.length > 0) {
                const videoUrl = videoList[0]?.videoUrl || videoList[0]?.url
                if (videoUrl && isValid1688VideoUrl(videoUrl)) {
                    return normalizeVideoUrl(videoUrl)
                }
            }
        }

        // Check detailData.videoUrl
        if (windowObj.detailData?.videoUrl) {
            const videoUrl = windowObj.detailData.videoUrl
            if (isValid1688VideoUrl(videoUrl)) {
                return normalizeVideoUrl(videoUrl)
            }
        }

        // Check detailData.videoList
        if (windowObj.detailData?.videoList) {
            const videoList = windowObj.detailData.videoList
            if (Array.isArray(videoList) && videoList.length > 0) {
                const videoUrl = videoList[0]?.videoUrl || videoList[0]?.url
                if (videoUrl && isValid1688VideoUrl(videoUrl)) {
                    return normalizeVideoUrl(videoUrl)
                }
            }
        }

        // Check offerData.videoUrl
        if (windowObj.offerData?.videoUrl) {
            const videoUrl = windowObj.offerData.videoUrl
            if (isValid1688VideoUrl(videoUrl)) {
                return normalizeVideoUrl(videoUrl)
            }
        }

        // Check offerData.offerVideoList
        if (windowObj.offerData?.offerVideoList) {
            const videoList = windowObj.offerData.offerVideoList
            if (Array.isArray(videoList) && videoList.length > 0) {
                const videoUrl = videoList[0]?.videoUrl || videoList[0]?.url
                if (videoUrl && isValid1688VideoUrl(videoUrl)) {
                    return normalizeVideoUrl(videoUrl)
                }
            }
        }

        // Check window.videoInfo
        if (windowObj.videoInfo?.url) {
            const videoUrl = windowObj.videoInfo.url
            if (isValid1688VideoUrl(videoUrl)) {
                return normalizeVideoUrl(videoUrl)
            }
        }

        // Check window.productVideo
        if (windowObj.productVideo?.url) {
            const videoUrl = windowObj.productVideo.url
            if (isValid1688VideoUrl(videoUrl)) {
                return normalizeVideoUrl(videoUrl)
            }
        }
    } catch (e) {
        console.warn('[1688 Video Extractor] Error extracting from window globals:', e)
    }

    return null
}

/**
 * Extract video URL from script tags
 */
function extractVideoFromScripts(): string | null {
    try {
        const scripts = document.querySelectorAll('script:not([src])')

        for (const script of scripts) {
            const content = script.textContent || ''

            // Skip if doesn't contain video-related keywords
            if (!content.includes('video')) continue

            // Try to find video URLs in the script
            // Pattern 1: videoUrl: "..."
            const urlPattern1 = /videoUrl\s*:\s*["']([^"']+)["']/g
            let match = urlPattern1.exec(content)
            if (match && match[1] && isValid1688VideoUrl(match[1])) {
                return normalizeVideoUrl(match[1])
            }

            // Pattern 2: "url": "..." (in video context)
            const urlPattern2 = /"url"\s*:\s*["']([^"']+)["']/g
            while ((match = urlPattern2.exec(content)) !== null) {
                if (match[1] && isValid1688VideoUrl(match[1])) {
                    return normalizeVideoUrl(match[1])
                }
            }

            // Pattern 3: videoList: [...]
            const videoListPattern = /videoList\s*:\s*\[(.*?)\]/gs
            const videoListMatch = videoListPattern.exec(content)
            if (videoListMatch && videoListMatch[1]) {
                const urlInList = /"(?:videoUrl|url)"\s*:\s*["']([^"']+)["']/.exec(videoListMatch[1])
                if (urlInList && urlInList[1] && isValid1688VideoUrl(urlInList[1])) {
                    return normalizeVideoUrl(urlInList[1])
                }
            }
        }
    } catch (e) {
        console.warn('[1688 Video Extractor] Error extracting from scripts:', e)
    }

    return null
}

/**
 * Extract video URL from DOM elements
 * Basic implementation - will be enhanced in dom-extractor.ts
 */
function extractVideoFromDOM(): string | null {
    try {
        // Look for <video> elements with src
        const videoElements = document.querySelectorAll<HTMLVideoElement>('video[src]')
        for (const video of videoElements) {
            if (video.src && isValid1688VideoUrl(video.src)) {
                return normalizeVideoUrl(video.src)
            }
        }

        // Look for <video> elements with data-src
        const lazyVideos = document.querySelectorAll<HTMLElement>('video[data-src]')
        for (const video of lazyVideos) {
            const dataSrc = video.getAttribute('data-src')
            if (dataSrc && isValid1688VideoUrl(dataSrc)) {
                return normalizeVideoUrl(dataSrc)
            }
        }

        // Look for elements with data-video-src
        const videoDataElements = document.querySelectorAll<HTMLElement>('[data-video-src]')
        for (const elem of videoDataElements) {
            const videoSrc = elem.getAttribute('data-video-src')
            if (videoSrc && isValid1688VideoUrl(videoSrc)) {
                return normalizeVideoUrl(videoSrc)
            }
        }
    } catch (e) {
        console.warn('[1688 Video Extractor] Error extracting from DOM:', e)
    }

    return null
}

/**
 * Validate if URL looks like a valid 1688/Taobao video URL
 */
function isValid1688VideoUrl(url: string): boolean {
    if (!url || typeof url !== 'string') return false

    // Common 1688/Taobao video URL patterns
    const videoPatterns = [
        /cloud\.video\.taobao\.com/i,
        /video\.1688\.com/i,
        /gw\.alicdn\.com.*\.mp4/i,
        /alicdn\.com.*video/i,
        /\.mp4$/i,
        /\.m3u8$/i,
    ]

    return videoPatterns.some(pattern => pattern.test(url))
}

/**
 * Normalize video URL (ensure https, remove extra params, etc.)
 */
function normalizeVideoUrl(url: string): string {
    // Ensure https
    if (url.startsWith('//')) {
        url = 'https:' + url
    } else if (url.startsWith('http://')) {
        url = url.replace('http://', 'https://')
    }

    // Remove trailing spaces
    url = url.trim()

    return url
}
