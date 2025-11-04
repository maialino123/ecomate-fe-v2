'use client'

import { useParams, useRouter } from 'next/navigation'
import { useApi } from '@workspace/shared/providers'
import { useProduct1688Detail, Product1688Status } from '@workspace/lib'
import { Loader2, ArrowLeft } from 'lucide-react'
import { Button } from '@workspace/ui/components/Button'
import { ProtectedRoute } from '../../../../../lib/protected-route'
import {
  TranslateDialog,
  ApproveDialog,
  RejectDialog,
  Product1688Tabs,
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
            <TranslateDialog
              productId={product.id}
              productName={product.nameVi || product.nameZh}
              onSuccess={refetch}
            />
          )}
          {(product.status === Product1688Status.TRANSLATED || product.status === Product1688Status.REJECTED) && (
            <ApproveDialog product={product} onSuccess={refetch} />
          )}
          {product.status !== Product1688Status.APPROVED && <RejectDialog product={product} onSuccess={refetch} />}
        </div>
      </div>

      {/* Tabs */}
      <Product1688Tabs product={product} onRefetch={refetch} />
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
