/**
 * 1688 Product Data Extractor
 *
 * Implements multiple strategies to extract product data from 1688.com pages:
 * 1. Window global variables (React apps)
 * 2. Script tags with JSON data
 * 3. Inline script parsing
 * 4. DOM scraping (fallback)
 */

import type { Raw1688Data } from '@workspace/lib';
import { extractFromDOM } from './dom-extractor';

/**
 * Main extraction function
 * Tries multiple strategies in priority order
 */
export function extractProductData(): Raw1688Data {
  console.log('[1688 Extractor] Starting extraction...');

  // Strategy 1: window.__INITIAL_STATE__ (modern React apps)
  const initialState = tryExtractFromWindow('__INITIAL_STATE__');
  if (initialState) {
    console.log('[1688 Extractor] ✅ Found data in window.__INITIAL_STATE__');
    return initialState;
  }

  // Strategy 2: window.detailData (older pages)
  const detailData = tryExtractFromWindow('detailData');
  if (detailData) {
    console.log('[1688 Extractor] ✅ Found data in window.detailData');
    return detailData;
  }

  // Strategy 3: window.offerData
  const offerData = tryExtractFromWindow('offerData');
  if (offerData) {
    console.log('[1688 Extractor] ✅ Found data in window.offerData');
    return offerData;
  }

  // Strategy 4: Script tags with application/json
  const scriptData = tryExtractFromScriptTags();
  if (scriptData) {
    console.log('[1688 Extractor] ✅ Found data in script tags');
    return scriptData;
  }

  // Strategy 5: Parse from inline scripts (look for JSON in script text)
  const inlineScriptData = tryExtractFromInlineScripts();
  if (inlineScriptData) {
    console.log('[1688 Extractor] ✅ Found data in inline scripts');
    return inlineScriptData;
  }

  // Strategy 6: DOM scraping (fallback)
  console.log('[1688 Extractor] Trying DOM scraping as fallback...');
  try {
    const domData = extractFromDOM();
    console.log('[1688 Extractor] ✅ Extracted data from DOM');
    return domData;
  } catch (domError) {
    console.error('[1688 Extractor] DOM extraction also failed:', domError);
  }

  // All strategies failed - provide detailed error
  const debugInfo = getDebugInfo();
  console.error('[1688 Extractor] ❌ All extraction strategies failed');
  console.error('[1688 Extractor] Debug info:', debugInfo);

  throw new Error(
    'Could not extract product data from this page.\n\n' +
    'Debug Information:\n' +
    `- URL: ${debugInfo.url}\n` +
    `- Scripts found: ${debugInfo.scriptCount}\n` +
    `- Scripts with "offerId": ${debugInfo.scriptsWithOfferId}\n` +
    `- Price elements: ${debugInfo.priceElements}\n` +
    `- Images found: ${debugInfo.images}\n\n` +
    'Please ensure you are on a valid 1688 product detail page.\n' +
    'If the problem persists, please report this issue.'
  );
}

/**
 * Get debug information about the page
 */
function getDebugInfo() {
  return {
    url: window.location.href,
    scriptCount: document.querySelectorAll('script').length,
    scriptsWithOfferId: Array.from(document.querySelectorAll('script')).filter(s =>
      s.textContent?.includes('offerId')
    ).length,
    priceElements: document.querySelectorAll('[class*="price"], [class*="Price"]').length,
    images: document.querySelectorAll('img[src*="cbu"], img[data-src*="cbu"]').length,
  };
}

/**
 * Try to extract data from window global variables
 */
function tryExtractFromWindow(key: string): Raw1688Data | null {
  try {
    const data = (window as any)[key];
    if (data && typeof data === 'object') {
      // Validate it looks like product data
      if (hasProductData(data)) {
        return data;
      }
    }
  } catch (e) {
    console.warn(`[1688 Extractor] Failed to access window.${key}:`, e);
  }
  return null;
}

/**
 * Try to extract from <script type="application/json"> tags
 */
function tryExtractFromScriptTags(): Raw1688Data | null {
  const scripts = document.querySelectorAll('script[type="application/json"]');

  for (const script of scripts) {
    try {
      const data = JSON.parse(script.textContent || '');
      if (hasProductData(data)) {
        return data;
      }
    } catch (e) {
      // Continue to next script
      continue;
    }
  }

  return null;
}

/**
 * Try to extract from inline script tags (look for var/const declarations)
 */
function tryExtractFromInlineScripts(): Raw1688Data | null {
  const scripts = document.querySelectorAll('script:not([src])');

  // Common variable patterns to look for
  const patterns = [
    /var\s+__INITIAL_STATE__\s*=\s*({.+?});/s,
    /var\s+detailData\s*=\s*({.+?});/s,
    /var\s+offerData\s*=\s*({.+?});/s,
    /const\s+__INITIAL_STATE__\s*=\s*({.+?});/s,
    /window\.__INITIAL_STATE__\s*=\s*({.+?});/s,
  ];

  for (const script of scripts) {
    const content = script.textContent || '';

    for (const pattern of patterns) {
      const match = content.match(pattern);
      if (match && match[1]) {
        try {
          const data = JSON.parse(match[1]);
          if (hasProductData(data)) {
            return data;
          }
        } catch (e) {
          // Continue to next pattern
          continue;
        }
      }
    }
  }

  return null;
}

/**
 * Check if data object looks like valid product data
 * This helps filter out unrelated JSON data
 */
function hasProductData(data: any): boolean {
  if (!data || typeof data !== 'object') return false;

  // Check for common product data fields
  const hasId = !!(
    data.offerId ||
    data.productId ||
    data.id
  );

  const hasTitle = !!(
    data.subject ||
    data.title ||
    data.offerTitle ||
    data.productName
  );

  const hasPrice = !!(
    data.priceRange ||
    data.price ||
    data.salePrice ||
    data.consignPrice ||
    data.skuPrices
  );

  const hasImages = !!(
    data.image ||
    data.images ||
    data.offerImgList ||
    data.mainImage
  );

  // Need at least ID + (title OR price OR images)
  return hasId && (hasTitle || hasPrice || hasImages);
}

/**
 * Get current page URL info
 */
export function getPageInfo() {
  const url = window.location.href;
  const isDetailPage = url.includes('detail.1688.com') || url.includes('offer');

  return {
    url,
    isDetailPage,
    offerId: extractOfferIdFromUrl(url),
  };
}

/**
 * Extract offer ID from URL
 */
function extractOfferIdFromUrl(url: string): string | null {
  // URL formats:
  // https://detail.1688.com/offer/725123406270.html
  // https://m.1688.com/offer/725123406270.html
  const match = url.match(/offer[\/](\d+)/);
  return match && match[1] ? match[1] : null;
}
