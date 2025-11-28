'use client'

import { Skeleton } from '@workspace/ui/components/Skeleton'

interface Product1688TableSkeletonProps {
  rows?: number
}

/**
 * Loading skeleton that matches the Product1688 table layout
 * Provides visual continuity during data fetching
 */
export const Product1688TableSkeleton = ({ rows = 10 }: Product1688TableSkeletonProps) => {
  return (
    <>
      {Array.from({ length: rows }).map((_, i) => (
        <tr key={i} className="border-b border-gray-200 dark:border-gray-700">
          {/* Checkbox */}
          <td className="px-6 py-4">
            <Skeleton className="h-4 w-4 rounded" />
          </td>

          {/* Product (image + name + link) */}
          <td className="px-6 py-4">
            <div className="flex items-center gap-3">
              <Skeleton className="h-12 w-12 rounded flex-shrink-0" />
              <div className="space-y-2 flex-1 min-w-0">
                <Skeleton className="h-4 w-48" />
                <Skeleton className="h-3 w-32" />
                <Skeleton className="h-3 w-20" />
              </div>
            </div>
          </td>

          {/* Price */}
          <td className="px-6 py-4 whitespace-nowrap">
            <Skeleton className="h-4 w-20" />
          </td>

          {/* Status */}
          <td className="px-6 py-4 whitespace-nowrap">
            <Skeleton className="h-6 w-24 rounded-full" />
          </td>

          {/* Video */}
          <td className="px-6 py-4 whitespace-nowrap">
            <Skeleton className="h-5 w-16 rounded" />
          </td>

          {/* Variants */}
          <td className="px-6 py-4 whitespace-nowrap">
            <Skeleton className="h-4 w-8" />
          </td>

          {/* Created */}
          <td className="px-6 py-4 whitespace-nowrap">
            <Skeleton className="h-4 w-24" />
          </td>

          {/* Actions */}
          <td className="px-6 py-4 sticky right-0 bg-white dark:bg-gray-800">
            <div className="flex items-center justify-end gap-2">
              <Skeleton className="h-8 w-8 rounded" />
              <Skeleton className="h-8 w-8 rounded" />
              <Skeleton className="h-8 w-8 rounded" />
            </div>
          </td>
        </tr>
      ))}
    </>
  )
}
