'use client'

import { Product1688Variant } from '@workspace/lib'
import { VariantCard } from './VariantCard'

interface VariantGridProps {
  variants: Product1688Variant[]
  basePrice: number
}

export function VariantGrid({ variants, basePrice }: VariantGridProps) {
  if (!variants || variants.length === 0) {
    return (
      <div className="text-center py-8 text-gray-500 dark:text-gray-400">No variants available</div>
    )
  }

  return (
    <div className="space-y-4">
      <div>
        <h3 className="text-lg font-semibold mb-1">Product Variants</h3>
        <p className="text-sm text-gray-600 dark:text-gray-400">{variants.length} variants available</p>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {variants.map((variant, index) => (
          <VariantCard key={variant.sku || index} variant={variant} basePrice={basePrice} />
        ))}
      </div>
    </div>
  )
}
