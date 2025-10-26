import {
  Product1688,
  Product1688Schema,
  PriceTier,
  SKUVariation,
  Raw1688Data,
} from '../types/product-1688';

/**
 * Normalize raw 1688 product data to our standardized schema
 * @param raw - Raw data extracted from 1688 page
 * @param sourceUrl - URL of the 1688 product page
 * @returns Validated Product1688 object
 */
export function normalize1688Product(
  raw: Raw1688Data,
  sourceUrl: string
): Product1688 {
  const normalized: Product1688 = {
    sourceUrl,
    productId: extractProductId(raw, sourceUrl),
    title: extractTitle(raw),
    description: extractDescription(raw),
    priceTiers: extractPriceTiers(raw),
    currency: 'CNY',
    skus: extractSKUs(raw),
    weight: extractWeight(raw),
    shippingTemplateId: extractShippingTemplateId(raw),
    images: {
      main: extractMainImages(raw),
      detail: extractDetailImages(raw),
    },
    supplierId: extractSupplierId(raw),
    supplierName: extractSupplierName(raw),
    categoryId: extractCategoryId(raw),
    categoryName: extractCategoryName(raw),
    extractedAt: new Date().toISOString(),
    extractedBy: 'ecomate-extension',
  };

  // Validate with Zod schema
  return Product1688Schema.parse(normalized);
}

/**
 * Extract product ID from raw data or URL
 */
function extractProductId(raw: Raw1688Data, url: string): string {
  // Try multiple sources
  if (raw.offerId) return String(raw.offerId);
  if (raw.productId) return String(raw.productId);
  if (raw.id) return String(raw.id);

  // Fallback: extract from URL
  // URL format: https://detail.1688.com/offer/725123406270.html
  const match = url.match(/offer[\/](\d+)/);
  if (match && match[1]) return match[1];

  throw new Error('Could not extract product ID');
}

/**
 * Extract product title
 */
function extractTitle(raw: Raw1688Data): string {
  const title = raw.subject || raw.title || raw.offerTitle || raw.productName || '';
  if (!title) throw new Error('Product title not found');
  return String(title).trim();
}

/**
 * Extract product description
 */
function extractDescription(raw: Raw1688Data): string | undefined {
  const desc = raw.description || raw.desc;
  return desc ? String(desc) : undefined;
}

/**
 * Extract price tiers from raw data
 * 1688 typically has quantity-based pricing
 */
function extractPriceTiers(raw: Raw1688Data): PriceTier[] {
  const tiers: PriceTier[] = [];

  // Strategy 1: priceRange array
  if (Array.isArray(raw.priceRange)) {
    raw.priceRange.forEach((tier: any) => {
      tiers.push({
        minQty: Number(tier.startQuantity || tier.begin || 1),
        maxQty: tier.endQuantity || tier.end ? Number(tier.endQuantity || tier.end) : undefined,
        price: Number(tier.price || tier.value),
      });
    });
  }

  // Strategy 2: skuPrices array
  if (Array.isArray(raw.skuPrices) && tiers.length === 0) {
    raw.skuPrices.forEach((sku: any) => {
      if (sku.price) {
        tiers.push({
          minQty: 1,
          price: Number(sku.price),
        });
      }
    });
  }

  // Strategy 3: Simple price field
  if (tiers.length === 0 && (raw.price || raw.salePrice)) {
    tiers.push({
      minQty: 1,
      price: Number(raw.price || raw.salePrice),
    });
  }

  // Strategy 4: consignPrice or referencePrice
  if (tiers.length === 0 && (raw.consignPrice || raw.referencePrice)) {
    tiers.push({
      minQty: 1,
      price: Number(raw.consignPrice || raw.referencePrice),
    });
  }

  if (tiers.length === 0) {
    throw new Error('No price information found');
  }

  return tiers;
}

/**
 * Extract SKU variations
 */
function extractSKUs(raw: Raw1688Data): SKUVariation[] {
  const skus: SKUVariation[] = [];

  // Strategy 0: From parsed skuMap (NEW - highest priority)
  // This comes from script tag parsing via sku-parser.ts
  if (raw._skuMap && Array.isArray(raw._skuMap)) {
    raw._skuMap.forEach((sku: any) => {
      skus.push({
        skuId: String(sku.skuId || ''),
        attributes: parseSpecAttrs(sku.specAttrs),
        price: sku.price ? Number(sku.price) : (sku.discountPrice ? Number(sku.discountPrice) : undefined),
        stock: sku.canBookCount ? Number(sku.canBookCount) : undefined,
        image: findImageForSKUName(sku.specAttrs, raw._skuImages),
      });
    });

    if (skus.length > 0) {
      console.log(`[Normalizer] Extracted ${skus.length} SKUs from _skuMap`);
      return skus;
    }
  }

  // Strategy 1: skuInfoMap (existing)
  if (raw.skuInfoMap && typeof raw.skuInfoMap === 'object') {
    Object.entries(raw.skuInfoMap).forEach(([skuId, skuInfo]: [string, any]) => {
      skus.push({
        skuId,
        attributes: extractSkuAttributes(skuInfo),
        price: skuInfo.price ? Number(skuInfo.price) : undefined,
        stock: skuInfo.canBookCount || skuInfo.stock ? Number(skuInfo.canBookCount || skuInfo.stock) : undefined,
        image: skuInfo.skuImage || skuInfo.image || undefined,
      });
    });
  }

  // Strategy 2: skuProps array (existing)
  if (Array.isArray(raw.skuProps) && skus.length === 0) {
    raw.skuProps.forEach((prop: any) => {
      if (Array.isArray(prop.value)) {
        prop.value.forEach((val: any) => {
          skus.push({
            skuId: val.id ? String(val.id) : undefined,
            attributes: { [prop.name || prop.prop]: val.name || val.text },
            image: val.imageUrl || val.image || undefined,
          });
        });
      }
    });
  }

  return skus;
}

/**
 * Parse specAttrs string to attributes object
 * Example: "02款红黑四段（盒装）" → { "规格": "02款红黑四段（盒装）" }
 */
function parseSpecAttrs(specAttrs: string): Record<string, string> {
  if (!specAttrs) return {};

  // For now, treat the entire specAttrs as a single "规格" (specification) attribute
  // In the future, we could parse more complex patterns if needed
  return { "规格": specAttrs };
}

/**
 * Find image URL for SKU by name matching
 */
function findImageForSKUName(skuName: string, skuImages?: any): string | undefined {
  if (!skuImages || typeof skuImages !== 'object') return undefined;

  // Direct match
  if (skuImages[skuName]) {
    return skuImages[skuName];
  }

  // Normalized match (case-insensitive, trimmed)
  const normalizedName = skuName.trim().toLowerCase();
  for (const [name, imageUrl] of Object.entries(skuImages)) {
    if (name.trim().toLowerCase() === normalizedName) {
      return imageUrl as string;
    }
  }

  // Partial match (contains)
  for (const [name, imageUrl] of Object.entries(skuImages)) {
    const normalizedImageName = name.trim().toLowerCase();
    if (normalizedName.includes(normalizedImageName) || normalizedImageName.includes(normalizedName)) {
      return imageUrl as string;
    }
  }

  return undefined;
}

/**
 * Extract SKU attributes from SKU info
 */
function extractSkuAttributes(skuInfo: any): Record<string, string> {
  const attributes: Record<string, string> = {};

  if (skuInfo.specAttrs) {
    Object.entries(skuInfo.specAttrs).forEach(([key, value]) => {
      attributes[key] = String(value);
    });
  }

  if (skuInfo.attributes) {
    Object.entries(skuInfo.attributes).forEach(([key, value]) => {
      attributes[key] = String(value);
    });
  }

  return attributes;
}

/**
 * Extract main product images
 */
function extractMainImages(raw: Raw1688Data): string[] {
  const images: string[] = [];

  // Strategy 1: image array
  if (Array.isArray(raw.image)) {
    images.push(...raw.image.map((img: any) => normalizeImageUrl(img)));
  }

  // Strategy 2: images array
  if (Array.isArray(raw.images) && images.length === 0) {
    images.push(...raw.images.map((img: any) => normalizeImageUrl(img)));
  }

  // Strategy 3: offerImgList
  if (Array.isArray(raw.offerImgList) && images.length === 0) {
    images.push(...raw.offerImgList.map((img: any) => normalizeImageUrl(img)));
  }

  // Strategy 4: mainImage
  if (raw.mainImage && images.length === 0) {
    images.push(normalizeImageUrl(raw.mainImage));
  }

  if (images.length === 0) {
    throw new Error('No product images found');
  }

  return images.filter(Boolean);
}

/**
 * Extract detail images (from product description)
 */
function extractDetailImages(raw: Raw1688Data): string[] {
  const images: string[] = [];

  if (Array.isArray(raw.detailImages)) {
    images.push(...raw.detailImages.map((img: any) => normalizeImageUrl(img)));
  }

  if (Array.isArray(raw.descImages)) {
    images.push(...raw.descImages.map((img: any) => normalizeImageUrl(img)));
  }

  return images.filter(Boolean);
}

/**
 * Normalize image URL (ensure HTTPS, full URL)
 */
function normalizeImageUrl(img: any): string {
  let url = typeof img === 'string' ? img : img.url || img.src || '';

  // Add protocol if missing
  if (url.startsWith('//')) {
    url = 'https:' + url;
  } else if (url.startsWith('/')) {
    url = 'https://cbu01.alicdn.com' + url;
  }

  // Add .jpg extension if missing (common for 1688)
  if (url && !url.match(/\.(jpg|jpeg|png|webp)($|\?)/i)) {
    url += '.jpg';
  }

  return url;
}

/**
 * Extract product weight (if available)
 */
function extractWeight(raw: Raw1688Data): number | undefined {
  if (raw.weight) return Number(raw.weight);
  if (raw.netWeight) return Number(raw.netWeight);
  if (raw.grossWeight) return Number(raw.grossWeight);
  return undefined;
}

/**
 * Extract shipping template ID
 */
function extractShippingTemplateId(raw: Raw1688Data): string | undefined {
  return raw.freightTemplateId || raw.shippingTemplateId || undefined;
}

/**
 * Extract supplier ID
 */
function extractSupplierId(raw: Raw1688Data): string | undefined {
  return raw.sellerId || raw.supplierId || raw.memberId || undefined;
}

/**
 * Extract supplier name
 */
function extractSupplierName(raw: Raw1688Data): string | undefined {
  return raw.sellerName || raw.supplierName || raw.companyName || undefined;
}

/**
 * Extract category ID
 */
function extractCategoryId(raw: Raw1688Data): string | undefined {
  return raw.categoryId || raw.catId || undefined;
}

/**
 * Extract category name
 */
function extractCategoryName(raw: Raw1688Data): string | undefined {
  return raw.categoryName || raw.catName || undefined;
}
