'use client'

import { X, Download, Edit2, Loader2, Trash2 } from 'lucide-react'
import { Button } from '@workspace/ui/components/Button'
import { cn } from '@workspace/ui/lib/utils'
import { Product1688Entity, Product1688Variant } from '@workspace/lib'

interface PreExportSummaryTableProps {
  open: boolean
  onClose: () => void
  products: Product1688Entity[]
  variantSelections: Map<string, string[]>
  skippedProducts: Set<string>
  onRemoveProduct: (productId: string) => void
  onEditProduct: (productId: string) => void
  onExport: () => void
  isExporting: boolean
}

/**
 * Pre-Export Summary Table with Glassmorphism design
 * Shows all configured products before final export
 */
export function PreExportSummaryTable({
  open,
  onClose,
  products,
  variantSelections,
  skippedProducts,
  onRemoveProduct,
  onEditProduct,
  onExport,
  isExporting,
}: PreExportSummaryTableProps) {
  // Filter out skipped products
  const configuredProducts = products.filter(p => !skippedProducts.has(p.id))

  // Calculate totals
  const totalProducts = configuredProducts.length
  const totalVariants = configuredProducts.reduce((sum, p) => {
    const selected = variantSelections.get(p.id) || []
    return sum + selected.length
  }, 0)

  if (!open) return null

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      {/* Backdrop with blur */}
      <div className="absolute inset-0 bg-black/40 backdrop-blur-sm" onClick={onClose} />

      {/* Modal Container - Glassmorphism */}
      <div
        className={cn(
          'relative w-full max-w-2xl',
          // Glass effect
          'bg-white/90 dark:bg-gray-900/90',
          'backdrop-blur-2xl backdrop-saturate-[180%]',
          'border border-white/30 dark:border-white/10',
          'rounded-3xl',
          'shadow-[0_25px_50px_rgba(0,0,0,0.25)]',
          'animate-in fade-in-0 zoom-in-95 duration-300'
        )}
      >
        {/* Header */}
        <div className="p-6 border-b border-gray-200/50 dark:border-gray-700/50">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-xl font-semibold text-gray-900 dark:text-white">
                Xác nhận xuất Excel
              </h2>
              <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">
                Đã chọn {totalProducts} sản phẩm với {totalVariants} biến thể
              </p>
            </div>
            <button
              onClick={onClose}
              className="p-2 rounded-xl hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors"
            >
              <X className="w-5 h-5 text-gray-500" />
            </button>
          </div>
        </div>

        {/* Content - Scrollable Table */}
        <div className="p-6 max-h-[50vh] overflow-y-auto">
          {configuredProducts.length > 0 ? (
            <div className="space-y-3">
              {configuredProducts.map((product, index) => {
                const variants = (product.variants || []) as Product1688Variant[]
                const selectedSkus = variantSelections.get(product.id) || []

                return (
                  <div
                    key={product.id}
                    className={cn(
                      'flex items-center gap-4 p-4 rounded-2xl',
                      'bg-gray-50 dark:bg-gray-800/30',
                      'border border-gray-100 dark:border-gray-700/50'
                    )}
                  >
                    {/* Index */}
                    <div className="w-8 h-8 rounded-full bg-indigo-100 dark:bg-indigo-900/50 flex items-center justify-center flex-shrink-0">
                      <span className="text-sm font-semibold text-indigo-600 dark:text-indigo-400">
                        {index + 1}
                      </span>
                    </div>

                    {/* Product Image */}
                    <div className="relative w-14 h-14 rounded-xl overflow-hidden flex-shrink-0">
                      {/* eslint-disable-next-line @next/next/no-img-element */}
                      <img
                        src={product.images?.[0] || '/placeholder.png'}
                        alt={product.nameVi || product.nameZh}
                        className="w-full h-full object-cover"
                        referrerPolicy="no-referrer"
                        crossOrigin="anonymous"
                      />
                    </div>

                    {/* Product Info */}
                    <div className="flex-1 min-w-0">
                      <h4 className="font-medium text-gray-900 dark:text-white truncate">
                        {product.nameVi || product.nameZh}
                      </h4>
                      <div className="flex items-center gap-3 mt-1 text-sm">
                        <span className="text-indigo-600 dark:text-indigo-400 font-medium">
                          {selectedSkus.length}/{variants.length} biến thể
                        </span>
                        <span className="text-gray-500 dark:text-gray-400">
                          ¥{product.priceMinCNY}
                          {product.priceMaxCNY && product.priceMaxCNY !== product.priceMinCNY
                            ? ` - ¥${product.priceMaxCNY}`
                            : ''}
                        </span>
                      </div>
                    </div>

                    {/* Actions */}
                    <div className="flex items-center gap-1 flex-shrink-0">
                      <button
                        onClick={() => onEditProduct(product.id)}
                        className="p-2 rounded-lg hover:bg-gray-200 dark:hover:bg-gray-700 transition-colors"
                        title="Sửa lại"
                      >
                        <Edit2 className="w-4 h-4 text-gray-500 dark:text-gray-400" />
                      </button>
                      <button
                        onClick={() => onRemoveProduct(product.id)}
                        className="p-2 rounded-lg hover:bg-red-100 dark:hover:bg-red-900/30 transition-colors"
                        title="Xóa khỏi danh sách"
                      >
                        <Trash2 className="w-4 h-4 text-red-500" />
                      </button>
                    </div>
                  </div>
                )
              })}
            </div>
          ) : (
            <div className="text-center py-12 text-gray-500 dark:text-gray-400">
              <p>Không có sản phẩm nào được chọn</p>
              <p className="text-sm mt-1">Vui lòng quay lại và chọn ít nhất một sản phẩm</p>
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="p-6 border-t border-gray-200/50 dark:border-gray-700/50">
          <div className="flex items-center justify-between">
            <div className="text-sm text-gray-600 dark:text-gray-400">
              <span className="font-medium text-gray-900 dark:text-white">{totalVariants}</span> biến
              thể từ <span className="font-medium text-gray-900 dark:text-white">{totalProducts}</span>{' '}
              sản phẩm
            </div>

            <div className="flex items-center gap-3">
              <Button variant="outline" onClick={onClose}>
                Hủy
              </Button>
              <Button
                onClick={onExport}
                isDisabled={isExporting || totalProducts === 0}
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
                    Xuất Excel
                  </>
                )}
              </Button>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
