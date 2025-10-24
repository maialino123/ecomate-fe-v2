/**
 * DOM-based 1688 Product Data Extractor
 *
 * Fallback extraction strategy that scrapes product data directly from DOM
 * when JSON data is not available in window variables or script tags.
 */

import type { Raw1688Data } from '@workspace/lib';
import { extractSKUDataFromScript } from './sku-parser';

/**
 * Extract product data from DOM elements
 * This is a fallback strategy when JSON data is not available
 */
export function extractFromDOM(): Raw1688Data {
  console.log('[1688 DOM Extractor] Starting DOM extraction...');

  const productId = extractProductIdFromURL();
  const title = extractTitleFromDOM();
  const images = extractImagesFromDOM();
  const prices = extractPricesFromDOM();
  const supplier = extractSupplierFromDOM();

  // Try to extract SKU data from script tags
  let skuData = null;
  try {
    const scripts = Array.from(document.querySelectorAll('script:not([src])'));
    const skuScript = scripts.find(s =>
      s.textContent?.includes('skuMap') && s.textContent?.includes('skuProps')
    );

    if (skuScript && skuScript.textContent) {
      skuData = extractSKUDataFromScript(skuScript.textContent);
      if (skuData && skuData.skuMap.length > 0) {
        console.log(`[1688 DOM Extractor] ✅ Found ${skuData.skuMap.length} SKUs in script`);
      }
    }
  } catch (error) {
    console.warn('[1688 DOM Extractor] SKU script parsing failed:', error);
  }

  // Build Raw1688Data object compatible with normalizer
  const rawData: Raw1688Data = {
    // Product ID (required)
    offerId: productId,
    productId: productId,

    // Title (required)
    subject: title,
    title: title,

    // Images (required)
    image: images,
    images: images,

    // Prices (required)
    priceRange: prices.tiers.length > 0 ? prices.tiers : undefined,
    price: prices.basePrice,

    // Supplier info (optional)
    sellerName: supplier.name,
    companyName: supplier.name,
    sellerId: supplier.id,

    // SKU data (if extracted from script)
    _skuMap: skuData?.skuMap,
    _skuImages: skuData?.skuImages,

    // Source metadata
    _extractionMethod: 'dom-scraping',
  };

  console.log('[1688 DOM Extractor] ✅ Extraction complete:', {
    productId,
    title: title.substring(0, 50) + '...',
    imagesCount: images.length,
    pricesCount: prices.tiers.length,
  });

  return rawData;
}

/**
 * Extract product ID from URL
 */
function extractProductIdFromURL(): string {
  const url = window.location.href;

  // URL formats:
  // https://detail.1688.com/offer/725123406270.html
  // https://m.1688.com/offer/725123406270.html
  const match = url.match(/offer[\/](\d+)/);

  if (!match || !match[1]) {
    throw new Error('Could not extract product ID from URL');
  }

  return match[1];
}

/**
 * Extract product title from DOM
 * Tries multiple strategies to find the title
 */
function extractTitleFromDOM(): string {
  console.log('[1688 DOM Extractor] Extracting title...');

  // Strategy 1: Common class patterns for product title
  const titleSelectors = [
    '.offer-title',
    '[class*="detail-title"]',
    '[class*="product-title"]',
    '[class*="subject"]',
    'h1.title',
    'h1[class*="title"]',
  ];

  for (const selector of titleSelectors) {
    const element = document.querySelector(selector);
    if (element && element.textContent?.trim()) {
      const title = element.textContent.trim();
      console.log(`[1688 DOM Extractor] Found title via selector: ${selector}`);
      return title;
    }
  }

  // Strategy 2: Find h1 tags (excluding company/seller names)
  const h1Elements = document.querySelectorAll('h1');
  for (const h1 of h1Elements) {
    const text = h1.textContent?.trim();
    if (text && text.length > 10 && text.length < 200) {
      // Likely a product title
      console.log('[1688 DOM Extractor] Found title via h1 element');
      return text;
    }
  }

  // Strategy 3: Meta tags
  const ogTitle = document.querySelector('meta[property="og:title"]');
  if (ogTitle && ogTitle.getAttribute('content')) {
    const title = ogTitle.getAttribute('content')!.trim();
    console.log('[1688 DOM Extractor] Found title via og:title meta tag');
    return title;
  }

  // Strategy 4: Document title (last resort, remove site suffix)
  const docTitle = document.title.split('-')[0]?.split('_')[0]?.trim();
  if (docTitle && docTitle.length > 5) {
    console.log('[1688 DOM Extractor] Using document title (fallback)');
    return docTitle;
  }

  throw new Error('Could not extract product title from DOM');
}

/**
 * Extract product images from DOM
 */
function extractImagesFromDOM(): string[] {
  console.log('[1688 DOM Extractor] Extracting images...');

  const imageUrls = new Set<string>();

  // Strategy 1: Images with 1688 CDN URLs
  const cdnImages = document.querySelectorAll<HTMLImageElement>('img[src*="cbu"], img[src*="1688"]');
  cdnImages.forEach((img) => {
    const src = img.src || img.getAttribute('data-src') || img.getAttribute('data-lazy-src');
    if (src && src.includes('cbu')) {
      imageUrls.add(normalizeImageUrl(src));
    }
  });

  // Strategy 2: Images in common gallery/preview containers
  const gallerySelectors = [
    '.offer-image img',
    '[class*="gallery"] img',
    '[class*="preview"] img',
    '[class*="image-list"] img',
    '[class*="thumb"] img',
  ];

  gallerySelectors.forEach((selector) => {
    const images = document.querySelectorAll<HTMLImageElement>(selector);
    images.forEach((img) => {
      const src = img.src || img.getAttribute('data-src') || img.getAttribute('data-lazy-src');
      if (src) {
        imageUrls.add(normalizeImageUrl(src));
      }
    });
  });

  // Strategy 3: All images with data-src attribute (lazy loading)
  const lazyImages = document.querySelectorAll<HTMLImageElement>('img[data-src]');
  lazyImages.forEach((img) => {
    const src = img.getAttribute('data-src');
    if (src && (src.includes('cbu') || src.includes('1688'))) {
      imageUrls.add(normalizeImageUrl(src));
    }
  });

  const images = Array.from(imageUrls).filter(Boolean);

  if (images.length === 0) {
    throw new Error('Could not find product images');
  }

  console.log(`[1688 DOM Extractor] Found ${images.length} images`);
  return images;
}

/**
 * Normalize image URL to HTTPS with proper format
 */
function normalizeImageUrl(url: string): string {
  let normalized = url.trim();

  // Remove thumbnail size suffixes (e.g., _50x50.jpg, _sum.jpg)
  normalized = normalized.replace(/_(50x50|60x60|sum|thumbnail)\.(jpg|png|webp)/gi, '.$2');

  // Add HTTPS protocol if missing
  if (normalized.startsWith('//')) {
    normalized = 'https:' + normalized;
  } else if (!normalized.startsWith('http')) {
    normalized = 'https:' + normalized;
  }

  // Ensure .jpg extension if no extension present
  if (!normalized.match(/\.(jpg|jpeg|png|webp|gif)($|\?)/i)) {
    normalized += '.jpg';
  }

  // Remove query parameters that are for thumbnails
  normalized = normalized.replace(/(\.(jpg|png|webp))_\d+x\d+/gi, '$1');

  return normalized;
}

/**
 * Extract prices from DOM
 * Returns base price and price tiers if available
 */
function extractPricesFromDOM(): { basePrice: number; tiers: Array<{ minQty: number; price: number }> } {
  console.log('[1688 DOM Extractor] Extracting prices...');

  const prices: number[] = [];
  const tiers: Array<{ minQty: number; price: number }> = [];

  // Strategy 1: Find elements with "price" in class name
  const priceElements = document.querySelectorAll('[class*="price"], [class*="Price"]');

  priceElements.forEach((element) => {
    const text = element.textContent || '';

    // Extract numbers (including decimal)
    const matches = text.match(/(\d+\.?\d*)/g);
    if (matches) {
      matches.forEach((match) => {
        const num = parseFloat(match);
        // Filter out unrealistic prices (too small or too large)
        if (num > 0.01 && num < 1000000) {
          prices.push(num);
        }
      });
    }
  });

  // Strategy 2: Look for price range tables
  const priceRangeSelectors = [
    '[class*="price-range"]',
    '[class*="price-tier"]',
    '[class*="ladder"]',
    'table[class*="price"]',
  ];

  priceRangeSelectors.forEach((selector) => {
    const containers = document.querySelectorAll(selector);
    containers.forEach((container) => {
      const rows = container.querySelectorAll('tr, [class*="row"]');
      rows.forEach((row) => {
        const text = row.textContent || '';

        // Try to find quantity and price pattern
        // e.g., "1-99 件 ¥12.50" or "≥100 ¥10.00"
        const qtyPriceMatch = text.match(/(\d+)[-≥\+]?\s*(?:件|pcs|pieces)?\s*[¥￥]?\s*(\d+\.?\d*)/i);
        if (qtyPriceMatch && qtyPriceMatch[1] && qtyPriceMatch[2]) {
          const minQty = parseInt(qtyPriceMatch[1]);
          const price = parseFloat(qtyPriceMatch[2]);
          if (minQty > 0 && price > 0) {
            tiers.push({ minQty, price });
          }
        }
      });
    });
  });

  // Get base price (smallest price found, or first price)
  const uniquePrices = Array.from(new Set(prices)).sort((a, b) => a - b);
  const basePrice = uniquePrices.length > 0 ? uniquePrices[0] : undefined;

  if (!basePrice) {
    throw new Error('Could not extract price from DOM');
  }

  // If no tiers found, create a default tier with base price
  if (tiers.length === 0) {
    tiers.push({ minQty: 1, price: basePrice });
  } else {
    // Sort tiers by minQty
    tiers.sort((a, b) => a.minQty - b.minQty);
  }

  console.log(`[1688 DOM Extractor] Found base price: ¥${basePrice}, ${tiers.length} price tiers`);

  return { basePrice, tiers };
}

/**
 * Extract supplier/seller information from DOM
 */
function extractSupplierFromDOM(): { name?: string; id?: string } {
  console.log('[1688 DOM Extractor] Extracting supplier info...');

  let name: string | undefined;
  let id: string | undefined;

  // Try to find company/seller name
  const supplierSelectors = [
    '[class*="company-name"]',
    '[class*="seller-name"]',
    '[class*="shop-name"]',
    '[class*="store-name"]',
    '.company-info h1',
    '.company-info h2',
  ];

  for (const selector of supplierSelectors) {
    const element = document.querySelector(selector);
    if (element && element.textContent?.trim()) {
      name = element.textContent.trim();
      console.log('[1688 DOM Extractor] Found supplier name:', name);
      break;
    }
  }

  // Try to extract seller ID from links
  const sellerLinks = document.querySelectorAll('a[href*="company"], a[href*="shop"], a[href*="winport"]');
  for (const link of sellerLinks) {
    const href = link.getAttribute('href') || '';
    const idMatch = href.match(/(?:company|shop|winport).*?(\d+)/);
    if (idMatch && idMatch[1]) {
      id = idMatch[1];
      console.log('[1688 DOM Extractor] Found supplier ID:', id);
      break;
    }
  }

  return { name, id };
}
