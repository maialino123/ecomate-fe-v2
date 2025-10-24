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
    <div className="flex items-center gap-2 px-3 py-2 bg-content2 border-b border-divider text-xs">
      {/* Base Price */}
      <div className="flex items-center gap-1.5">
        <svg
          xmlns="http://www.w3.org/2000/svg"
          width="14"
          height="14"
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
        <span className="text-[10px] text-default-500">Base:</span>
        <span className="text-xs font-semibold text-primary">¥{basePrice.toFixed(2)}</span>
      </div>

      {/* Separator */}
      <div className="h-3 w-px bg-divider" />

      {/* Price Tiers */}
      <div className="flex items-center gap-1">
        <span className="text-[10px] text-default-500">Tiers:</span>
        <Chip size="sm" variant="flat" color="default" className="h-4 min-w-0 px-1.5 text-[10px]">
          {priceTiers}
        </Chip>
      </div>

      {/* SKU Count */}
      <div className="flex items-center gap-1">
        <span className="text-[10px] text-default-500">SKUs:</span>
        <Chip size="sm" variant="flat" color="default" className="h-4 min-w-0 px-1.5 text-[10px]">
          {skuCount}
        </Chip>
      </div>

      {/* Images Count */}
      <div className="flex items-center gap-1">
        <span className="text-[10px] text-default-500">Images:</span>
        <Chip size="sm" variant="flat" color="default" className="h-4 min-w-0 px-1.5 text-[10px]">
          {imageCount}
        </Chip>
      </div>

      {/* Separator */}
      <div className="h-3 w-px bg-divider" />

      {/* Product ID */}
      <Chip size="sm" variant="bordered" className="h-4 min-w-0 px-1.5 font-mono text-[10px]">
        ID: {productId}
      </Chip>
    </div>
  );
}
