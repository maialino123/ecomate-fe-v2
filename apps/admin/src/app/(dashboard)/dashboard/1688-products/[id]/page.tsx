'use client'

import { useParams, useRouter } from 'next/navigation'
import { useApi } from '@workspace/shared/providers'
import { useProduct1688Detail, Product1688Status } from '@workspace/lib'
import { formatDateTime } from '@workspace/shared/utils'
import { Loader2, ArrowLeft, ExternalLink } from 'lucide-react'
import { Button } from '@workspace/ui/components/Button'
import { ProtectedRoute } from '../../../../../lib/protected-route'
import {
  Product1688StatusBadge,
  TranslateDialog,
  ApproveDialog,
  RejectDialog,
} from '../../../../../components/product1688'

function Product1688DetailPageContent() {
  const params = useParams()
  const router = useRouter()
  const api = useApi()
  const id = params.id as string

  const { data: product, isLoading, error, refetch } = useProduct1688Detail({ api, id })

  if (isLoading) {
    return (
      <div className="flex items-center justify-center py-12">
        <Loader2 className="w-8 h-8 animate-spin text-blue-500" />
      </div>
    )
  }

  if (error || !product) {
    return (
      <div className="text-center py-12">
        <p className="text-red-500">Failed to load product details</p>
        <Button onClick={() => refetch()} className="mt-4">
          Retry
        </Button>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <button
            onClick={() => router.push('/dashboard/1688-products')}
            className="text-gray-600 hover:text-gray-900 dark:text-gray-400 dark:hover:text-gray-200"
          >
            <ArrowLeft className="w-6 h-6" />
          </button>
          <div>
            <h2 className="text-3xl font-bold text-gray-900 dark:text-white">Product Details</h2>
            <p className="text-gray-600 dark:text-gray-400 mt-1">1688 Product Information</p>
          </div>
        </div>

        <div className="flex items-center gap-2">
          {product.status === Product1688Status.PENDING_REVIEW && (
            <TranslateDialog productId={product.id} onSuccess={refetch} />
          )}
          {(product.status === Product1688Status.TRANSLATED || product.status === Product1688Status.REJECTED) && (
            <ApproveDialog product={product} onSuccess={refetch} />
          )}
          {product.status !== Product1688Status.APPROVED && <RejectDialog product={product} onSuccess={refetch} />}
        </div>
      </div>

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
                  className="text-blue-600 hover:text-blue-800 dark:text-blue-400 flex items-center gap-1"
                >
                  {product.originalUrl} <ExternalLink className="w-4 h-4" />
                </a>
              </div>
            </div>
          </div>

          {/* Images Gallery */}
          {product.images && product.images.length > 0 && (
            <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-6">
              <h3 className="text-lg font-semibold mb-4">Images</h3>
              <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                {product.images.map((image, index) => (
                  <img
                    key={index}
                    src={image}
                    alt={`Product image ${index + 1}`}
                    className="w-full h-48 object-cover rounded-lg"
                    referrerPolicy="no-referrer"
                    crossOrigin="anonymous"
                  />
                ))}
              </div>
            </div>
          )}

          {/* Variants */}
          {product.variants && product.variants.length > 0 && (
            <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-6">
              <h3 className="text-lg font-semibold mb-4">Variants ({product.variantCount})</h3>
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead className="bg-gray-50 dark:bg-gray-700">
                    <tr>
                      <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase">
                        Chinese Name
                      </th>
                      <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase">
                        Vietnamese Name
                      </th>
                      <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase">
                        SKU
                      </th>
                      <th className="px-4 py-2 text-right text-xs font-medium text-gray-500 dark:text-gray-400 uppercase">
                        Price (CNY)
                      </th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-200 dark:divide-gray-700">
                    {product.variants.map((variant, index) => (
                      <tr key={index}>
                        <td className="px-4 py-3 text-sm text-gray-900 dark:text-white">{variant.nameZh}</td>
                        <td className="px-4 py-3 text-sm text-gray-900 dark:text-white">{variant.nameVi || '-'}</td>
                        <td className="px-4 py-3 text-sm text-gray-500 dark:text-gray-400">{variant.sku || '-'}</td>
                        <td className="px-4 py-3 text-sm text-gray-900 dark:text-white text-right">
                          {variant.price || product.priceMinCNY}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
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
    </div>
  )
}

// Wrap with ProtectedRoute
export default function Product1688DetailPage() {
  return (
    <ProtectedRoute requiredRoles={['OWNER', 'ADMIN', 'STAFF']}>
      <Product1688DetailPageContent />
    </ProtectedRoute>
  )
}
