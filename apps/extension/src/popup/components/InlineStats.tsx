/**
 * InlineStats Component
 * Compact horizontal stats bar showing key product metrics
 */

import { Chip } from '@heroui/react';

interface InlineStatsProps {
  priceTiers: number;
  skuCount: number;
  imageCount: number;
  productId: string;
  basePrice: number;
}

export function InlineStats({ priceTiers, skuCount, imageCount, productId, basePrice }: InlineStatsProps) {
  return (
    <div className="flex items-center gap-3 px-4 py-2.5 bg-content2 border-b border-divider text-sm">
      {/* Base Price */}
      <div className="flex items-center gap-2">
        <svg
          xmlns="http://www.w3.org/2000/svg"
          width="16"
          height="16"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
          className="text-primary"
        >
          <line x1="12" x2="12" y1="2" y2="22" />
          <path d="M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6" />
        </svg>
        <span className="text-xs text-default-500">Base:</span>
        <span className="text-sm font-semibold text-primary">¥{basePrice.toFixed(2)}</span>
      </div>

      {/* Separator */}
      <div className="h-4 w-px bg-divider" />

      {/* Price Tiers */}
      <div className="flex items-center gap-1.5">
        <span className="text-xs text-default-500">Tiers:</span>
        <Chip size="sm" variant="flat" color="default" className="h-5 min-w-0 px-2 text-xs">
          {priceTiers}
        </Chip>
      </div>

      {/* SKU Count */}
      <div className="flex items-center gap-1.5">
        <span className="text-xs text-default-500">SKUs:</span>
        <Chip size="sm" variant="flat" color="default" className="h-5 min-w-0 px-2 text-xs">
          {skuCount}
        </Chip>
      </div>

      {/* Images Count */}
      <div className="flex items-center gap-1.5">
        <span className="text-xs text-default-500">Images:</span>
        <Chip size="sm" variant="flat" color="default" className="h-5 min-w-0 px-2 text-xs">
          {imageCount}
        </Chip>
      </div>

      {/* Separator */}
      <div className="h-4 w-px bg-divider" />

      {/* Product ID */}
      <Chip size="sm" variant="bordered" className="h-5 min-w-0 px-2 font-mono text-xs">
        ID: {productId}
      </Chip>
    </div>
  );
}
