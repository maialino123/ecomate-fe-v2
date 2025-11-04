'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { useApi } from '@workspace/shared/providers'
import { useProduct1688List, useProduct1688Delete, QueryProduct1688Request, Product1688Status } from '@workspace/lib'
import { formatDateTime } from '@workspace/shared/utils'
import { Loader2, Eye, Trash2, ExternalLink, Video, CheckCircle2, Clock, XCircle } from 'lucide-react'
import { Button } from '@workspace/ui/components/Button'
import { Badge } from '@workspace/ui/components/Badge'
import { ProtectedRoute } from '../../../../lib/protected-route'
import {
    Product1688StatusBadge,
    Product1688Filters,
    TranslateDialog,
    ApproveDialog,
    RejectDialog,
} from '../../../../components/product1688'

function Product1688ListPageContent() {
    const router = useRouter()
    const api = useApi()
    const [filters, setFilters] = useState<QueryProduct1688Request>({
        page: 1,
        limit: 20,
        sortBy: 'createdAt',
        sortOrder: 'desc',
    })
    const [deleteId, setDeleteId] = useState<string | null>(null)

    const { data, isLoading, error, refetch } = useProduct1688List({ api, query: filters })

    const deleteMutation = useProduct1688Delete({
        api,
        onSuccess: () => {
            setDeleteId(null)
            refetch()
        },
    })

    if (isLoading) {
        return (
            <div className="flex items-center justify-center py-12">
                <Loader2 className="w-8 h-8 animate-spin text-blue-500" />
            </div>
        )
    }

    if (error) {
        return (
            <div className="text-center py-12">
                <p className="text-red-500">Failed to load products</p>
                <Button onClick={() => refetch()} className="mt-4">
                    Retry
                </Button>
            </div>
        )
    }

    const products = data?.data || []
    const total = data?.total || 0
    const totalPages = Math.ceil(total / (filters.limit || 20))

    return (
        <div className="space-y-6">
            {/* Header */}
            <div className="flex items-center justify-between">
                <div>
                    <h2 className="text-3xl font-bold text-gray-900 dark:text-white">1688 Products</h2>
                    <p className="text-gray-600 dark:text-gray-400 mt-1">{total} total products</p>
                </div>
            </div>

            {/* Filters */}
            <Product1688Filters filters={filters} onFiltersChange={setFilters} />

            {/* Table */}
            <div className="bg-white dark:bg-gray-800 rounded-lg shadow overflow-hidden">
                <div className="overflow-x-auto">
                    <table className="w-full">
                        <thead className="bg-gray-50 dark:bg-gray-700">
                            <tr>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider max-w-sm">
                                    Product
                                </th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider w-28">
                                    Price (CNY)
                                </th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider w-32">
                                    Status
                                </th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider w-28">
                                    Video
                                </th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider w-24">
                                    Variants
                                </th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider w-36">
                                    Created
                                </th>
                                <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider w-48 sticky right-0 bg-gray-50 dark:bg-gray-700">
                                    Actions
                                </th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-200 dark:divide-gray-700">
                            {products.length === 0 ? (
                                <tr>
                                    <td colSpan={7} className="px-6 py-12 text-center text-gray-500 dark:text-gray-400">
                                        No products found
                                    </td>
                                </tr>
                            ) : (
                                products.map(product => (
                                    <tr key={product.id} className="group hover:bg-gray-50 dark:hover:bg-gray-700">
                                        <td className="px-6 py-4 max-w-sm">
                                            <div className="flex items-start gap-3">
                                                {product.thumbnail && (
                                                    <img
                                                        src={product.thumbnail}
                                                        alt={product.nameZh}
                                                        className="w-12 h-12 object-cover rounded flex-shrink-0"
                                                        referrerPolicy="no-referrer"
                                                        crossOrigin="anonymous"
                                                    />
                                                )}
                                                <div className="flex-1 min-w-0">
                                                    <div className="text-sm font-medium text-gray-900 dark:text-white truncate">
                                                        {product.nameVi || product.nameZh}
                                                    </div>
                                                    {product.nameVi && (
                                                        <div className="text-xs text-gray-500 dark:text-gray-400 truncate">
                                                            {product.nameZh}
                                                        </div>
                                                    )}
                                                    <a
                                                        href={product.originalUrl}
                                                        target="_blank"
                                                        rel="noopener noreferrer"
                                                        className="text-xs text-blue-600 hover:text-blue-800 dark:text-blue-400 flex items-center gap-1 mt-1"
                                                    >
                                                        1688 Link <ExternalLink className="w-3 h-3" />
                                                    </a>
                                                </div>
                                            </div>
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 dark:text-white w-28">
                                            {product.priceMinCNY}
                                            {product.priceMaxCNY && product.priceMaxCNY !== product.priceMinCNY && (
                                                <> - {product.priceMaxCNY}</>
                                            )}
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap w-32">
                                            <Product1688StatusBadge status={product.status} />
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap w-28">
                                            {product.dubbedVideoUrl ? (
                                                <Badge
                                                    variant="default"
                                                    className="bg-green-500 text-white flex items-center gap-1 w-fit"
                                                >
                                                    <CheckCircle2 className="w-3 h-3" />
                                                    Đã dịch
                                                </Badge>
                                            ) : product.videoStatus === 'PROCESSING' ||
                                              product.videoStatus === 'QUEUED' ? (
                                                <Badge variant="secondary" className="flex items-center gap-1 w-fit">
                                                    <Clock className="w-3 h-3" />
                                                    Đang xử lý
                                                </Badge>
                                            ) : product.videoStatus === 'FAILED' ? (
                                                <Badge variant="destructive" className="flex items-center gap-1 w-fit">
                                                    <XCircle className="w-3 h-3" />
                                                    Thất bại
                                                </Badge>
                                            ) : product.originalVideoUrl ? (
                                                <Badge variant="secondary" className="flex items-center gap-1 w-fit">
                                                    <Video className="w-3 h-3" />
                                                    Có video
                                                </Badge>
                                            ) : (
                                                <span className="text-gray-400 text-xs">-</span>
                                            )}
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-400 w-24">
                                            {product.variantCount}
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-400 w-36">
                                            {formatDateTime(product.createdAt)}
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium w-48 sticky right-0 bg-white dark:bg-gray-800 group-hover:bg-gray-50 dark:group-hover:bg-gray-700 shadow-[-4px_0_6px_-1px_rgba(0,0,0,0.1)] dark:shadow-[-4px_0_6px_-1px_rgba(0,0,0,0.3)]">
                                            <div className="flex items-center justify-end gap-2">
                                                {/* View Details */}
                                                <button
                                                    onClick={() =>
                                                        router.push(`/dashboard/1688-products/${product.id}`)
                                                    }
                                                    className="text-blue-600 hover:text-blue-900 dark:text-blue-400 dark:hover:text-blue-300"
                                                    title="View Details"
                                                >
                                                    <Eye className="w-4 h-4" />
                                                </button>

                                                {/* Translate (if not translated) */}
                                                {product.status === Product1688Status.PENDING_REVIEW && (
                                                    <TranslateDialog
                                                        productId={product.id}
                                                        productName={product.nameVi || product.nameZh}
                                                        onSuccess={refetch}
                                                    />
                                                )}

                                                {/* Approve (if translated) */}
                                                {(product.status === Product1688Status.TRANSLATED ||
                                                    product.status === Product1688Status.REJECTED) && (
                                                    <ApproveDialog product={product} onSuccess={refetch} />
                                                )}

                                                {/* Reject (if not approved) */}
                                                {product.status !== Product1688Status.APPROVED && (
                                                    <RejectDialog product={product} onSuccess={refetch} />
                                                )}

                                                {/* Delete */}
                                                <button
                                                    onClick={() => setDeleteId(product.id)}
                                                    className="text-red-600 hover:text-red-900 dark:text-red-400 dark:hover:text-red-300"
                                                    title="Delete"
                                                >
                                                    <Trash2 className="w-4 h-4" />
                                                </button>
                                            </div>
                                        </td>
                                    </tr>
                                ))
                            )}
                        </tbody>
                    </table>
                </div>

                {/* Pagination */}
                {totalPages > 1 && (
                    <div className="px-6 py-4 border-t border-gray-200 dark:border-gray-700 flex items-center justify-between">
                        <div className="text-sm text-gray-600 dark:text-gray-400">
                            Page {filters.page} of {totalPages}
                        </div>
                        <div className="flex gap-2">
                            <Button
                                onClick={() => setFilters({ ...filters, page: (filters.page || 1) - 1 })}
                                isDisabled={(filters.page || 1) <= 1}
                                variant="outline"
                                size="sm"
                            >
                                Previous
                            </Button>
                            <Button
                                onClick={() => setFilters({ ...filters, page: (filters.page || 1) + 1 })}
                                isDisabled={(filters.page || 1) >= totalPages}
                                variant="outline"
                                size="sm"
                            >
                                Next
                            </Button>
                        </div>
                    </div>
                )}
            </div>

            {/* Delete Confirmation Dialog */}
            {deleteId && (
                <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
                    <div className="bg-white dark:bg-gray-800 rounded-lg p-6 max-w-md w-full mx-4">
                        <h3 className="text-lg font-semibold mb-4 text-red-600 dark:text-red-400">Delete Product</h3>
                        <p className="text-sm text-gray-600 dark:text-gray-400 mb-4">
                            Are you sure you want to delete this product? This action cannot be undone.
                        </p>
                        <div className="flex gap-2">
                            <Button
                                onClick={() => deleteMutation.mutate(deleteId)}
                                isDisabled={deleteMutation.isPending}
                                variant="destructive"
                                className="flex-1"
                            >
                                {deleteMutation.isPending ? <Loader2 className="w-4 h-4 animate-spin" /> : 'Delete'}
                            </Button>
                            <Button onClick={() => setDeleteId(null)} variant="outline" className="flex-1">
                                Cancel
                            </Button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    )
}

// Wrap with ProtectedRoute
export default function Product1688ListPage() {
    return (
        <ProtectedRoute requiredRoles={['OWNER', 'ADMIN', 'STAFF']}>
            <Product1688ListPageContent />
        </ProtectedRoute>
    )
}
