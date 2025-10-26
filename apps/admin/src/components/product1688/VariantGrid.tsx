'use client'

import { useState } from 'react'
import { Product1688Variant } from '@workspace/lib'
import { VariantCard } from './VariantCard'
import { CostCalculatorDialog } from './CostCalculatorDialog'

interface VariantGridProps {
  productId: string
  variants: Product1688Variant[]
  basePrice: number
  onUpdate?: () => void
}

export function VariantGrid({ productId, variants, basePrice, onUpdate }: VariantGridProps) {
  const [selectedVariant, setSelectedVariant] = useState<Product1688Variant | null>(null)
  const [isCalculatorOpen, setIsCalculatorOpen] = useState(false)

  const handleVariantClick = (variant: Product1688Variant) => {
    setSelectedVariant(variant)
    setIsCalculatorOpen(true)
  }

  const handleCalculatorClose = () => {
    setIsCalculatorOpen(false)
    setSelectedVariant(null)
  }

  const handleCalculatorSuccess = () => {
    onUpdate?.()
  }

  if (!variants || variants.length === 0) {
    return (
      <div className="text-center py-8 text-gray-500 dark:text-gray-400">No variants available</div>
    )
  }

  return (
    <>
      <div className="space-y-4">
        <div>
          <h3 className="text-lg font-semibold mb-1">Product Variants</h3>
          <p className="text-sm text-gray-600 dark:text-gray-400">
            {variants.length} variants available - Click to calculate cost
          </p>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {variants.map((variant, index) => (
            <VariantCard
              key={variant.sku || index}
              variant={variant}
              basePrice={basePrice}
              onClick={() => handleVariantClick(variant)}
            />
          ))}
        </div>
      </div>

      {/* Cost Calculator Dialog */}
      {selectedVariant && (
        <CostCalculatorDialog
          productId={productId}
          variant={selectedVariant}
          isOpen={isCalculatorOpen}
          onClose={handleCalculatorClose}
          onSuccess={handleCalculatorSuccess}
        />
      )}
    </>
  )
}
