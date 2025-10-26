'use client'

import { Product1688Entity, Product1688Status } from '@workspace/lib'
import { formatDateTime } from '@workspace/shared/utils'
import { ExternalLink } from 'lucide-react'
import { Product1688StatusBadge } from './Product1688StatusBadge'

interface OverviewTabProps {
  product: Product1688Entity
}

export function OverviewTab({ product }: OverviewTabProps) {
  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
      {/* Main Content */}
      <div className="lg:col-span-2 space-y-6">
        {/* Product Info */}
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-6">
          <div className="flex items-start justify-between mb-4">
            <h3 className="text-lg font-semibold">Product Information</h3>
            <Product1688StatusBadge status={product.status} />
          </div>

          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-600 dark:text-gray-400 mb-1">
                Chinese Name
              </label>
              <p className="text-gray-900 dark:text-white">{product.nameZh}</p>
            </div>

            {product.nameVi && (
              <div>
                <label className="block text-sm font-medium text-gray-600 dark:text-gray-400 mb-1">
                  Vietnamese Name
                </label>
                <p className="text-gray-900 dark:text-white">{product.nameVi}</p>
              </div>
            )}

            {product.descriptionZh && (
              <div>
                <label className="block text-sm font-medium text-gray-600 dark:text-gray-400 mb-1">
                  Chinese Description
                </label>
                <p className="text-gray-900 dark:text-white whitespace-pre-wrap">{product.descriptionZh}</p>
              </div>
            )}

            {product.descriptionVi && (
              <div>
                <label className="block text-sm font-medium text-gray-600 dark:text-gray-400 mb-1">
                  Vietnamese Description
                </label>
                <p className="text-gray-900 dark:text-white whitespace-pre-wrap">{product.descriptionVi}</p>
              </div>
            )}

            <div>
              <label className="block text-sm font-medium text-gray-600 dark:text-gray-400 mb-1">
                Original URL
              </label>
              <a
                href={product.originalUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="text-blue-600 hover:text-blue-800 dark:text-blue-400 flex items-center gap-1 break-all"
              >
                {product.originalUrl} <ExternalLink className="w-4 h-4 flex-shrink-0" />
              </a>
            </div>
          </div>
        </div>

        {/* Thumbnail Preview */}
        {product.thumbnail && (
          <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-6">
            <h3 className="text-lg font-semibold mb-4">Thumbnail</h3>
            <img
              src={product.thumbnail}
              alt="Product thumbnail"
              className="w-full max-w-md rounded-lg"
              referrerPolicy="no-referrer"
              crossOrigin="anonymous"
            />
          </div>
        )}
      </div>

      {/* Sidebar */}
      <div className="space-y-6">
        {/* Price & Cost */}
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-6">
          <h3 className="text-lg font-semibold mb-4">Pricing</h3>
          <div className="space-y-3">
            <div>
              <label className="block text-sm font-medium text-gray-600 dark:text-gray-400 mb-1">
                Price Range (CNY)
              </label>
              <p className="text-gray-900 dark:text-white font-medium">
                {product.priceMinCNY}
                {product.priceMaxCNY && product.priceMaxCNY !== product.priceMinCNY && (
                  <> - {product.priceMaxCNY}</>
                )}
              </p>
            </div>

            {product.costCalculation && (
              <>
                <div>
                  <label className="block text-sm font-medium text-gray-600 dark:text-gray-400 mb-1">
                    Exchange Rate (CNY)
                  </label>
                  <p className="text-gray-900 dark:text-white font-medium">
                    {product.costCalculation.exchangeRateCNY?.toLocaleString()}
                  </p>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-600 dark:text-gray-400 mb-1">
                    Final Price (VND)
                  </label>
                  <p className="text-gray-900 dark:text-white font-medium">
                    {product.costCalculation.finalPriceVND?.toLocaleString()}
                  </p>
                </div>
              </>
            )}
          </div>
        </div>

        {/* Supplier Info */}
        {product.supplierName && (
          <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-6">
            <h3 className="text-lg font-semibold mb-4">Supplier</h3>
            <div className="space-y-2">
              <div>
                <label className="block text-sm font-medium text-gray-600 dark:text-gray-400 mb-1">Name</label>
                <p className="text-gray-900 dark:text-white">{product.supplierName}</p>
              </div>
              {product.supplierId1688 && (
                <div>
                  <label className="block text-sm font-medium text-gray-600 dark:text-gray-400 mb-1">
                    Supplier ID
                  </label>
                  <p className="text-gray-900 dark:text-white">{product.supplierId1688}</p>
                </div>
              )}
            </div>
          </div>
        )}

        {/* Rejection Info */}
        {product.status === Product1688Status.REJECTED && (
          <div className="bg-red-50 dark:bg-red-900/20 rounded-lg shadow p-6">
            <h3 className="text-lg font-semibold mb-4 text-red-600 dark:text-red-400">Rejection Details</h3>
            <div className="space-y-3">
              <div>
                <label className="block text-sm font-medium text-red-700 dark:text-red-400 mb-1">Reason</label>
                <p className="text-red-900 dark:text-red-300">
                  {product.rejectionReason?.replace(/_/g, ' ') || 'N/A'}
                </p>
              </div>
              {product.rejectedAt && (
                <div>
                  <label className="block text-sm font-medium text-red-700 dark:text-red-400 mb-1">
                    Rejected At
                  </label>
                  <p className="text-red-900 dark:text-red-300">{formatDateTime(product.rejectedAt)}</p>
                </div>
              )}
              {product.rejectedByUser && (
                <div>
                  <label className="block text-sm font-medium text-red-700 dark:text-red-400 mb-1">
                    Rejected By
                  </label>
                  <p className="text-red-900 dark:text-red-300">{product.rejectedByUser.email}</p>
                </div>
              )}
            </div>
          </div>
        )}

        {/* Metadata */}
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-6">
          <h3 className="text-lg font-semibold mb-4">Metadata</h3>
          <div className="space-y-3 text-sm">
            <div>
              <label className="block text-gray-600 dark:text-gray-400 mb-1">Created</label>
              <p className="text-gray-900 dark:text-white">{formatDateTime(product.createdAt)}</p>
            </div>
            <div>
              <label className="block text-gray-600 dark:text-gray-400 mb-1">Updated</label>
              <p className="text-gray-900 dark:text-white">{formatDateTime(product.updatedAt)}</p>
            </div>
            {product.createdByUser && (
              <div>
                <label className="block text-gray-600 dark:text-gray-400 mb-1">Created By</label>
                <p className="text-gray-900 dark:text-white">{product.createdByUser.email}</p>
              </div>
            )}
            {product.reviewedByUser && (
              <div>
                <label className="block text-gray-600 dark:text-gray-400 mb-1">Reviewed By</label>
                <p className="text-gray-900 dark:text-white">{product.reviewedByUser.email}</p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}
