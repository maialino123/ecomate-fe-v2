'use client'

import { Product1688Variant } from '@workspace/lib'
import { Package, Calculator, TrendingUp } from 'lucide-react'

interface VariantCardProps {
  variant: Product1688Variant
  basePrice: number
  onClick?: () => void
}

export function VariantCard({ variant, basePrice, onClick }: VariantCardProps) {
  return (
    <div
      className={`bg-white dark:bg-gray-800 rounded-lg shadow p-4 hover:shadow-md transition-shadow ${
        onClick ? 'cursor-pointer hover:border-blue-500 border border-transparent' : ''
      }`}
      onClick={onClick}
    >
      <div className="flex gap-4">
        {/* Variant Image */}
        <div className="flex-shrink-0">
          {variant.image ? (
            <img
              src={variant.image}
              alt={variant.nameZh}
              className="w-24 h-24 object-cover rounded-lg"
              referrerPolicy="no-referrer"
              crossOrigin="anonymous"
            />
          ) : (
            <div className="w-24 h-24 bg-gray-100 dark:bg-gray-700 rounded-lg flex items-center justify-center">
              <Package className="w-8 h-8 text-gray-400" />
            </div>
          )}
        </div>

        {/* Variant Details */}
        <div className="flex-1 min-w-0">
          {/* Name */}
          <div className="mb-2">
            <h4 className="font-medium text-gray-900 dark:text-white truncate">{variant.nameZh}</h4>
            {variant.nameVi && (
              <p className="text-sm text-gray-600 dark:text-gray-400 truncate">{variant.nameVi}</p>
            )}
          </div>

          {/* Attributes */}
          {variant.attributes && Object.keys(variant.attributes).length > 0 && (
            <div className="flex flex-wrap gap-1 mb-2">
              {Object.entries(variant.attributes).map(([key, value]) => (
                <span
                  key={key}
                  className="inline-flex items-center px-2 py-0.5 rounded text-xs bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300"
                >
                  {key}: {value}
                </span>
              ))}
            </div>
          )}

          {/* Price and Stock */}
          <div className="flex items-center justify-between">
            <div>
              <span className="text-lg font-semibold text-gray-900 dark:text-white">
                ¥{variant.price || basePrice}
              </span>
              {variant.sku && (
                <span className="ml-2 text-xs text-gray-500 dark:text-gray-400">SKU: {variant.sku}</span>
              )}
            </div>
            {variant.stock !== undefined && (
              <span className="text-sm text-gray-600 dark:text-gray-400">Stock: {variant.stock}</span>
            )}
          </div>

          {/* Cost Calculation Info */}
          {variant.costCalculation && (
            <div className="mt-3 pt-3 border-t border-gray-200 dark:border-gray-700">
              <div className="flex items-center justify-between text-sm">
                <div className="flex items-center gap-1 text-green-600 dark:text-green-400">
                  <TrendingUp className="w-4 h-4" />
                  <span className="font-medium">
                    {new Intl.NumberFormat('vi-VN').format(
                      variant.costCalculation.suggestedSellingPrice
                    )}{' '}
                    VND
                  </span>
                </div>
                <div className="text-xs text-gray-500 dark:text-gray-400">
                  Profit: +
                  {new Intl.NumberFormat('vi-VN').format(variant.costCalculation.netProfit)} VND
                </div>
              </div>
            </div>
          )}

          {/* Calculator Icon Hint */}
          {onClick && (
            <div className="mt-2 flex items-center gap-1 text-xs text-blue-600 dark:text-blue-400">
              <Calculator className="w-3 h-3" />
              <span>Click to calculate cost</span>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
