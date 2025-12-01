'use client'

import { useState, useEffect, useMemo } from 'react'
import { X, Download, Loader2, ChevronLeft, ChevronRight, SkipForward } from 'lucide-react'
import { Button } from '@workspace/ui/components/Button'
import { Checkbox } from '@workspace/ui/components/Checkbox'
import { Progress } from '@workspace/ui/components/Progress'
import { cn } from '@workspace/ui/lib/utils'
import { Product1688Entity, Product1688Variant } from '@workspace/lib'

interface VariantSelectionModalProps {
  open: boolean
  onClose: () => void
  products: Product1688Entity[]
  currentIndex: number
  variantSelections: Map<string, string[]>
  onVariantsChange: (productId: string, variantSkus: string[]) => void
  onNext: () => void
  onPrev: () => void
  onSkip: () => void
  onComplete: () => void
  isExporting?: boolean
  isLastProduct: boolean
}

/**
 * Sequential Variant Selection Modal with Glassmorphism design
 * Shows one product at a time with progress indicator
 */
export function VariantSelectionModal({
  open,
  onClose,
  products,
  currentIndex,
  variantSelections,
  onVariantsChange,
  onNext,
  onPrev,
  onSkip,
  onComplete,
  isExporting,
  isLastProduct,
}: VariantSelectionModalProps) {
  const product = products[currentIndex]
  const variants = (product?.variants || []) as Product1688Variant[]
  const productId = product?.id || ''
  const selectedSkus = variantSelections.get(productId) || []
  const progress = products.length > 0 ? ((currentIndex + 1) / products.length) * 100 : 0

  // Toggle single variant
  const toggleVariant = (sku: string) => {
    if (!product) return
    const current = new Set(selectedSkus)
    if (current.has(sku)) {
      current.delete(sku)
    } else {
      current.add(sku)
    }
    onVariantsChange(product.id, Array.from(current))
  }

  // Select all variants
  const selectAll = () => {
    if (!product) return
    onVariantsChange(
      product.id,
      variants.map(v => v.sku)
    )
  }

  // Deselect all variants
  const deselectAll = () => {
    if (!product) return
    onVariantsChange(product.id, [])
  }

  if (!open || !product) return null

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      {/* Backdrop with blur */}
      <div className="absolute inset-0 bg-black/40 backdrop-blur-sm" onClick={onClose} />

      {/* Modal Container - Glassmorphism */}
      <div
        className={cn(
          'relative w-full max-w-xl',
          // Glass effect
          'bg-white/90 dark:bg-gray-900/90',
          'backdrop-blur-2xl backdrop-saturate-[180%]',
          'border border-white/30 dark:border-white/10',
          'rounded-3xl',
          'shadow-[0_25px_50px_rgba(0,0,0,0.25)]',
          'animate-in fade-in-0 zoom-in-95 duration-300'
        )}
      >
        {/* Header with Progress */}
        <div className="p-6 border-b border-gray-200/50 dark:border-gray-700/50">
          <div className="flex items-center justify-between mb-3">
            <h2 className="text-xl font-semibold text-gray-900 dark:text-white">
              Chọn biến thể để xuất
            </h2>
            <button
              onClick={onClose}
              className="p-2 rounded-xl hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors"
            >
              <X className="w-5 h-5 text-gray-500" />
            </button>
          </div>

          {/* Progress indicator */}
          <div className="space-y-2">
            <div className="flex items-center justify-between text-sm">
              <span className="text-gray-600 dark:text-gray-400">
                Sản phẩm {currentIndex + 1}/{products.length}
              </span>
              <span className="text-indigo-600 dark:text-indigo-400 font-medium">
                {Math.round(progress)}%
              </span>
            </div>
            <Progress value={progress} className="h-2" />
          </div>
        </div>

        {/* Content */}
        <div className="p-6 max-h-[60vh] overflow-y-auto">
          {/* Product Preview */}
          <div className="flex items-center gap-4 p-4 rounded-2xl bg-gray-100/80 dark:bg-gray-800/50 mb-6">
            <div className="relative w-20 h-20 rounded-xl overflow-hidden flex-shrink-0">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src={product.images?.[0] || '/placeholder.png'}
                alt={product.nameVi || product.nameZh}
                className="w-full h-full object-cover"
                referrerPolicy="no-referrer"
                crossOrigin="anonymous"
              />
            </div>
            <div className="min-w-0 flex-1">
              <h3 className="font-medium text-gray-900 dark:text-white line-clamp-2">
                {product.nameVi || product.nameZh}
              </h3>
              <p className="text-sm text-indigo-600 dark:text-indigo-400 font-semibold mt-1">
                ¥{product.priceMinCNY}
                {product.priceMaxCNY && product.priceMaxCNY !== product.priceMinCNY
                  ? ` - ¥${product.priceMaxCNY}`
                  : ''}
              </p>
            </div>
          </div>

          {/* Variant List */}
          {variants.length > 0 ? (
            <>
              <div className="space-y-2 mb-4">
                {variants.map(variant => (
                  <label
                    key={variant.sku}
                    className={cn(
                      'flex items-center gap-3 p-3 rounded-xl cursor-pointer',
                      'transition-all duration-200',
                      selectedSkus.includes(variant.sku)
                        ? 'bg-indigo-50 dark:bg-indigo-950/50 border border-indigo-200 dark:border-indigo-800'
                        : 'bg-gray-50 dark:bg-gray-800/30 border border-transparent hover:bg-gray-100 dark:hover:bg-gray-800/50'
                    )}
                  >
                    <Checkbox
                      isSelected={selectedSkus.includes(variant.sku)}
                      onChange={() => toggleVariant(variant.sku)}
                    />
                    {variant.image && (
                      <div className="relative w-12 h-12 rounded-lg overflow-hidden flex-shrink-0">
                        {/* eslint-disable-next-line @next/next/no-img-element */}
                        <img
                          src={variant.image}
                          alt={variant.nameVi || variant.nameZh}
                          className="w-full h-full object-cover"
                          referrerPolicy="no-referrer"
                          crossOrigin="anonymous"
                        />
                      </div>
                    )}
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-medium text-gray-900 dark:text-white truncate">
                        {variant.nameVi || variant.nameZh}
                      </p>
                      <p className="text-xs text-gray-500 dark:text-gray-400">SKU: {variant.sku}</p>
                    </div>
                    <span className="text-sm font-semibold text-indigo-600 dark:text-indigo-400 flex-shrink-0">
                      ¥{variant.price}
                    </span>
                  </label>
                ))}
              </div>

              {/* Quick actions */}
              <div className="flex items-center gap-2 mb-4">
                <button
                  onClick={selectAll}
                  className="px-3 py-1.5 text-xs font-medium rounded-lg bg-gray-100 dark:bg-gray-800 hover:bg-gray-200 dark:hover:bg-gray-700 transition-colors"
                >
                  Chọn tất cả
                </button>
                <button
                  onClick={deselectAll}
                  className="px-3 py-1.5 text-xs font-medium rounded-lg bg-gray-100 dark:bg-gray-800 hover:bg-gray-200 dark:hover:bg-gray-700 transition-colors"
                >
                  Bỏ chọn tất cả
                </button>
              </div>
            </>
          ) : (
            <div className="text-center py-8 text-gray-500 dark:text-gray-400">
              Sản phẩm này không có biến thể
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="p-6 border-t border-gray-200/50 dark:border-gray-700/50">
          <div className="flex items-center justify-between mb-4">
            <span className="text-sm text-gray-600 dark:text-gray-400">
              Đã chọn: {selectedSkus.length}/{variants.length} biến thể
            </span>
          </div>

          <div className="flex items-center justify-between gap-3">
            {/* Left: Back button */}
            <Button
              variant="outline"
              onClick={onPrev}
              isDisabled={currentIndex === 0}
              className="flex items-center gap-1"
            >
              <ChevronLeft className="w-4 h-4" />
              Quay lại
            </Button>

            {/* Right: Skip and Next/Complete */}
            <div className="flex items-center gap-2">
              <Button
                variant="ghost"
                onClick={onSkip}
                className="flex items-center gap-1 text-gray-600 dark:text-gray-400"
              >
                <SkipForward className="w-4 h-4" />
                Bỏ qua
              </Button>

              {isLastProduct ? (
                <Button
                  onClick={onComplete}
                  isDisabled={isExporting || selectedSkus.length === 0}
                  className="flex items-center gap-2 bg-indigo-600 hover:bg-indigo-700 text-white"
                >
                  {isExporting ? (
                    <>
                      <Loader2 className="w-4 h-4 animate-spin" />
                      Đang xuất...
                    </>
                  ) : (
                    <>
                      <Download className="w-4 h-4" />
                      Xem tổng kết
                    </>
                  )}
                </Button>
              ) : (
                <Button
                  onClick={onNext}
                  isDisabled={selectedSkus.length === 0}
                  className="flex items-center gap-1 bg-indigo-600 hover:bg-indigo-700 text-white"
                >
                  Tiếp tục
                  <ChevronRight className="w-4 h-4" />
                </Button>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
