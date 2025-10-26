/**
 * 1688 SKU Data Parser
 *
 * Extracts SKU variants (with prices, stock, images) from script tags
 * containing skuMap and skuProps data structures.
 */

export interface ParsedSKUData {
  skuMap: SKUMapItem[];
  skuImages: SKUImageMap;
}

export interface SKUMapItem {
  skuId: number | string;
  specAttrs: string;
  price: string | number;
  discountPrice?: string | number;
  canBookCount?: number;
  specId?: string;
  saleCount?: number;
  promotionSku?: boolean;
}

export interface SKUImageMap {
  [name: string]: string; // SKU name → image URL
}

/**
 * Extract SKU data from script tag content
 * Looks for skuMap and skuProps JSON structures
 */
export function extractSKUDataFromScript(scriptContent: string): ParsedSKUData | null {
  console.log('[SKU Parser] Starting SKU extraction from script...');

  try {
    // Extract skuMap array
    const skuMap = extractSKUMap(scriptContent);
    if (!skuMap || skuMap.length === 0) {
      console.log('[SKU Parser] No skuMap found');
      return null;
    }

    // Extract skuProps for images
    const skuImages = extractSKUImages(scriptContent);

    console.log(`[SKU Parser] ✅ Extracted ${skuMap.length} SKUs`);

    return {
      skuMap,
      skuImages,
    };
  } catch (error) {
    console.error('[SKU Parser] Failed to extract SKU data:', error);
    return null;
  }
}

/**
 * Extract skuMap array from script content
 * skuMap contains: skuId, specAttrs, price, stock, etc.
 */
function extractSKUMap(scriptContent: string): SKUMapItem[] {
  // Strategy 1: Direct skuMap array pattern
  const patterns = [
    /"skuMap":\s*(\[[\s\S]*?\])\s*[,}]/,
    /"skuMap"\s*:\s*(\[[\s\S]*?\])\s*[,}]/,
    /skuMap\s*:\s*(\[[\s\S]*?\])\s*[,}]/,
  ];

  for (const pattern of patterns) {
    const match = scriptContent.match(pattern);
    if (match && match[1]) {
      try {
        const skuMapArray = JSON.parse(match[1]);
        if (Array.isArray(skuMapArray) && skuMapArray.length > 0) {
          console.log(`[SKU Parser] Found skuMap with ${skuMapArray.length} items`);
          return skuMapArray;
        }
      } catch (e) {
        // Try next pattern
        continue;
      }
    }
  }

  // Strategy 2: Try to extract using balanced bracket counting
  const skuMapIndex = scriptContent.indexOf('"skuMap":');
  if (skuMapIndex !== -1) {
    const extracted = extractBalancedJSON(scriptContent, skuMapIndex + '"skuMap":'.length);
    if (extracted) {
      try {
        const parsed = JSON.parse(extracted);
        if (Array.isArray(parsed) && parsed.length > 0) {
          console.log(`[SKU Parser] Found skuMap via balanced extraction: ${parsed.length} items`);
          return parsed;
        }
      } catch (e) {
        // Failed to parse
      }
    }
  }

  console.warn('[SKU Parser] Could not extract skuMap');
  return [];
}

/**
 * Extract SKU images from skuProps
 * skuProps contains variant options with images
 */
function extractSKUImages(scriptContent: string): SKUImageMap {
  const imageMap: SKUImageMap = {};

  // Strategy 1: Direct skuProps pattern
  const patterns = [
    /"skuProps":\s*(\[[\s\S]*?\])\s*[,}]/,
    /"skuProps"\s*:\s*(\[[\s\S]*?\])\s*[,}]/,
    /skuProps\s*:\s*(\[[\s\S]*?\])\s*[,}]/,
  ];

  for (const pattern of patterns) {
    const match = scriptContent.match(pattern);
    if (match && match[1]) {
      try {
        const skuPropsArray = JSON.parse(match[1]);
        if (Array.isArray(skuPropsArray)) {
          // Parse skuProps structure
          skuPropsArray.forEach((prop: any) => {
            if (Array.isArray(prop.value)) {
              prop.value.forEach((option: any) => {
                if (option.name && option.imageUrl) {
                  imageMap[option.name] = option.imageUrl;
                }
              });
            }
          });

          if (Object.keys(imageMap).length > 0) {
            console.log(`[SKU Parser] Found ${Object.keys(imageMap).length} SKU images`);
            return imageMap;
          }
        }
      } catch (e) {
        // Try next pattern
        continue;
      }
    }
  }

  // Strategy 2: Try balanced extraction
  const skuPropsIndex = scriptContent.indexOf('"skuProps":');
  if (skuPropsIndex !== -1) {
    const extracted = extractBalancedJSON(scriptContent, skuPropsIndex + '"skuProps":'.length);
    if (extracted) {
      try {
        const parsed = JSON.parse(extracted);
        if (Array.isArray(parsed)) {
          parsed.forEach((prop: any) => {
            if (Array.isArray(prop.value)) {
              prop.value.forEach((option: any) => {
                if (option.name && option.imageUrl) {
                  imageMap[option.name] = option.imageUrl;
                }
              });
            }
          });
        }
      } catch (e) {
        // Failed
      }
    }
  }

  console.log(`[SKU Parser] Extracted ${Object.keys(imageMap).length} SKU images`);
  return imageMap;
}

/**
 * Extract balanced JSON from string starting at given index
 * Handles nested objects and arrays
 */
function extractBalancedJSON(text: string, startIndex: number): string | null {
  // Skip whitespace
  let i = startIndex;
  while (i < text.length) {
    const char = text.charAt(i);
    if (!/\s/.test(char)) break;
    i++;
  }

  if (i >= text.length) return null;

  const startChar = text[i];
  if (startChar !== '[' && startChar !== '{') {
    return null;
  }

  const closingChar = startChar === '[' ? ']' : '}';
  let depth = 0;
  let inString = false;
  let escapeNext = false;

  for (let j = i; j < Math.min(i + 50000, text.length); j++) {
    const char = text[j];

    if (escapeNext) {
      escapeNext = false;
      continue;
    }

    if (char === '\\') {
      escapeNext = true;
      continue;
    }

    if (char === '"' && !escapeNext) {
      inString = !inString;
      continue;
    }

    if (!inString) {
      if (char === startChar) {
        depth++;
      } else if (char === closingChar) {
        depth--;
        if (depth === 0) {
          // Found complete JSON
          return text.substring(i, j + 1);
        }
      }
    }
  }

  return null;
}

/**
 * Clean and normalize SKU name for matching
 */
export function normalizeSKUName(name: string): string {
  return name
    .trim()
    .replace(/\s+/g, ' ')
    .toLowerCase();
}

/**
 * Find image for SKU by matching name
 */
export function findImageForSKU(skuName: string, imageMap: SKUImageMap): string | undefined {
  // Direct match
  if (imageMap[skuName]) {
    return imageMap[skuName];
  }

  // Normalized match
  const normalizedName = normalizeSKUName(skuName);
  for (const [name, imageUrl] of Object.entries(imageMap)) {
    if (normalizeSKUName(name) === normalizedName) {
      return imageUrl;
    }
  }

  // Partial match (SKU name contains image name or vice versa)
  for (const [name, imageUrl] of Object.entries(imageMap)) {
    const normalizedImageName = normalizeSKUName(name);
    if (normalizedName.includes(normalizedImageName) || normalizedImageName.includes(normalizedName)) {
      return imageUrl;
    }
  }

  return undefined;
}
