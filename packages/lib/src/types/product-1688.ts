import { z } from 'zod';

/**
 * Price tier schema for 1688 products
 * Represents quantity-based pricing tiers
 */
export const PriceTierSchema = z.object({
  minQty: z.number().int().positive(),
  maxQty: z.number().int().positive().optional(),
  price: z.number().positive(),
});

export type PriceTier = z.infer<typeof PriceTierSchema>;

/**
 * SKU variation schema
 * Represents product variations (color, size, etc.)
 */
export const SKUVariationSchema = z.object({
  attributes: z.record(z.string(), z.string()), // e.g., { "颜色": "红色", "尺寸": "L" }
  price: z.number().positive().optional(),
  stock: z.number().int().nonnegative().optional(),
  skuId: z.string().optional(),
  image: z.string().url().optional(),
});

export type SKUVariation = z.infer<typeof SKUVariationSchema>;

/**
 * Main 1688 product schema (normalized)
 * This is the standardized format after extraction from 1688
 */
export const Product1688Schema = z.object({
  // Source information
  sourceUrl: z.string().url(),
  productId: z.string(),

  // Basic product info
  title: z.string(),
  description: z.string().optional(),

  // Pricing (required)
  priceTiers: z.array(PriceTierSchema).min(1),
  currency: z.literal('CNY').default('CNY'),

  // SKU variations (optional)
  skus: z.array(SKUVariationSchema).default([]),

  // Logistics
  weight: z.number().positive().optional(), // kg
  shippingTemplateId: z.string().optional(),

  // Images
  images: z.object({
    main: z.array(z.string().url()).min(1),
    detail: z.array(z.string().url()).default([]),
  }),

  // Supplier info
  supplierId: z.string().optional(),
  supplierName: z.string().optional(),

  // Category
  categoryId: z.string().optional(),
  categoryName: z.string().optional(),

  // Metadata
  extractedAt: z.string().datetime(),
  extractedBy: z.literal('ecomate-extension').default('ecomate-extension'),
});

export type Product1688 = z.infer<typeof Product1688Schema>;

/**
 * Raw data type from 1688 (for type safety during extraction)
 * This represents the unknown structure we'll encounter on 1688 pages
 */
export interface Raw1688Data {
  // This will be populated based on actual 1688 JSON structure
  // during implementation of the content script extractor
  [key: string]: any;
}

/**
 * Extraction result wrapper
 */
export interface ExtractionResult {
  success: boolean;
  data?: Product1688;
  error?: string;
  rawData?: Raw1688Data;
}
