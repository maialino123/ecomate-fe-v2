'use client'

import type { ColumnDef } from '@tanstack/react-table'
import { createColumnHelper } from '@tanstack/react-table'
import type { Product1688Entity } from '@workspace/lib'
import { formatDateTime } from '@workspace/shared/utils'
import { ExternalLink, Video, CheckCircle2, Clock, XCircle } from 'lucide-react'
import { Badge } from '@workspace/ui/components/Badge'
import { Product1688StatusBadge } from '../../../../../components/product1688'
import { ProductTableActions } from './ProductTableActions'

const columnHelper = createColumnHelper<Product1688Entity>()

// Extend TableMeta to include refetch function
declare module '@tanstack/react-table' {
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  interface TableMeta<TData> {
    refetch?: () => void
  }
}

// Product cell component
const ProductCell = ({ product }: { product: Product1688Entity }) => (
  <div className="flex items-start gap-3 w-full overflow-hidden">
    {product.thumbnail && (
      <img
        src={product.thumbnail}
        alt={product.nameZh}
        className="w-12 h-12 object-cover rounded flex-shrink-0"
        referrerPolicy="no-referrer"
        crossOrigin="anonymous"
      />
    )}
    <div className="flex-1 min-w-0 overflow-hidden">
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
)

// Video status cell component
const VideoStatusCell = ({ product }: { product: Product1688Entity }) => {
  const { dubbedVideoUrl, videoStatus, originalVideoUrl } = product

  if (dubbedVideoUrl) {
    return (
      <Badge variant="default" className="bg-green-500 text-white flex items-center gap-1 w-fit">
        <CheckCircle2 className="w-3 h-3" />
        <span className="text-xs">Dubbed</span>
      </Badge>
    )
  }

  if (videoStatus === 'PROCESSING' || videoStatus === 'QUEUED') {
    return (
      <Badge variant="secondary" className="flex items-center gap-1 w-fit">
        <Clock className="w-3 h-3" />
        <span className="text-xs">Processing</span>
      </Badge>
    )
  }

  if (videoStatus === 'FAILED') {
    return (
      <Badge variant="destructive" className="flex items-center gap-1 w-fit">
        <XCircle className="w-3 h-3" />
        <span className="text-xs">Failed</span>
      </Badge>
    )
  }

  if (originalVideoUrl) {
    return (
      <Badge variant="secondary" className="flex items-center gap-1 w-fit">
        <Video className="w-3 h-3" />
        <span className="text-xs">Has Video</span>
      </Badge>
    )
  }

  return <span className="text-gray-400 text-xs">-</span>
}

// TanStack Table column definitions with mixed value types require 'any'
export const product1688Columns: ColumnDef<Product1688Entity, any>[] = [
  // Checkbox column for row selection
  columnHelper.display({
    id: 'select',
    header: ({ table }) => (
      <input
        type="checkbox"
        checked={table.getIsAllPageRowsSelected()}
        onChange={table.getToggleAllPageRowsSelectedHandler()}
        className="h-4 w-4 rounded border-gray-300 text-blue-600 focus:ring-blue-500 cursor-pointer"
        aria-label="Select all"
      />
    ),
    cell: ({ row }) => (
      <input
        type="checkbox"
        checked={row.getIsSelected()}
        onChange={row.getToggleSelectedHandler()}
        className="h-4 w-4 rounded border-gray-300 text-blue-600 focus:ring-blue-500 cursor-pointer"
        aria-label="Select row"
      />
    ),
    size: 40,
    enableSorting: false,
  }),

  // Product column (thumbnail + name + link)
  columnHelper.accessor(row => row.nameVi || row.nameZh, {
    id: 'product',
    header: 'Product',
    cell: ({ row }) => <ProductCell product={row.original} />,
    size: 240,
    minSize: 180,
    enableSorting: true,
    enableColumnFilter: true,
  }),

  // Price column
  columnHelper.accessor('priceMinCNY', {
    id: 'price',
    header: 'Price (CNY)',
    cell: ({ row }) => {
      const { priceMinCNY, priceMaxCNY } = row.original
      return (
        <span className="text-sm text-gray-900 dark:text-white whitespace-nowrap">
          {priceMinCNY}
          {priceMaxCNY && priceMaxCNY !== priceMinCNY && <> - {priceMaxCNY}</>}
        </span>
      )
    },
    size: 112,
    enableSorting: true,
    enableColumnFilter: false,
  }),

  // Status column
  columnHelper.accessor('status', {
    id: 'status',
    header: 'Status',
    cell: ({ getValue }) => <Product1688StatusBadge status={getValue()} />,
    size: 128,
    enableSorting: true,
    enableColumnFilter: true,
    filterFn: 'equals',
  }),

  // Video column (display only)
  columnHelper.display({
    id: 'video',
    header: 'Video',
    cell: ({ row }) => <VideoStatusCell product={row.original} />,
    size: 112,
    enableSorting: false,
  }),

  // Variant count column
  columnHelper.accessor('variantCount', {
    id: 'variants',
    header: 'Variants',
    cell: ({ getValue }) => (
      <span className="text-sm text-gray-500 dark:text-gray-400">{getValue()}</span>
    ),
    size: 80,
    enableSorting: false,
  }),

  // Created date column
  columnHelper.accessor('createdAt', {
    id: 'createdAt',
    header: 'Created',
    cell: ({ getValue }) => (
      <span className="text-sm text-gray-500 dark:text-gray-400 whitespace-nowrap">
        {formatDateTime(getValue())}
      </span>
    ),
    size: 144,
    enableSorting: true,
  }),

  // Actions column (sticky)
  columnHelper.display({
    id: 'actions',
    header: () => <span className="sr-only">Actions</span>,
    cell: ({ row, table }) => (
      <ProductTableActions
        product={row.original}
        onRefetch={() => table.options.meta?.refetch?.()}
      />
    ),
    size: 200,
    enableSorting: false,
  }),
]
