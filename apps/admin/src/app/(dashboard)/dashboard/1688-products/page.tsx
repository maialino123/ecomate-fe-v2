'use client'

import { useCallback, useMemo, useState } from 'react'
import { useApi } from '@workspace/shared/providers'
import { useProduct1688List, useProduct1688Prefetch, useProduct1688Translate } from '@workspace/lib'
import { Button } from '@workspace/ui/components/Button'
import { ProtectedRoute } from '../../../../lib/protected-route'
import { useProduct1688TableState } from './_hooks'
import {
  Product1688Table,
  product1688Columns,
  Product1688TablePagination,
  Product1688TableToolbar,
  Product1688BulkActions,
} from './_components'

function Product1688ListPageContent() {
  const api = useApi()
  const [isBulkTranslating, setIsBulkTranslating] = useState(false)

  // Use new table state hook
  const tableState = useProduct1688TableState()

  // Existing data fetching hook (with performance optimizations)
  const { data, isLoading, error, refetch } = useProduct1688List({
    api,
    query: tableState.queryParams,
  })

  // Calculate pagination info
  const total = data?.total ?? 0
  const currentPage = tableState.queryParams.page ?? 1
  const pageSize = tableState.queryParams.limit ?? 20
  const hasNextPage = currentPage * pageSize < total

  // Prefetch next page for instant navigation
  useProduct1688Prefetch({
    api,
    query: tableState.queryParams,
    hasNextPage,
  })

  // Check if any filters are active
  const hasFilters = useMemo(() => {
    const { status, search } = tableState.queryParams
    return !!(status || search)
  }, [tableState.queryParams])

  // Clear all filters
  const handleClearFilters = useCallback(() => {
    tableState.onColumnFiltersChange([])
  }, [tableState])

  // Get selected row count
  const selectedRowIds = Object.keys(tableState.rowSelection).filter(
    id => tableState.rowSelection[id]
  )
  const selectedCount = selectedRowIds.length

  // Bulk translate mutation
  const translateMutation = useProduct1688Translate({
    api,
    onSuccess: () => {
      refetch()
    },
  })

  // Handle bulk translate
  const handleBulkTranslate = useCallback(async () => {
    if (selectedRowIds.length === 0) return

    setIsBulkTranslating(true)
    try {
      // Translate each selected product sequentially
      for (const id of selectedRowIds) {
        await translateMutation.mutateAsync({ id, options: {} })
      }
      // Clear selection after successful bulk translate
      tableState.onRowSelectionChange({})
    } finally {
      setIsBulkTranslating(false)
    }
  }, [selectedRowIds, translateMutation, tableState])

  // Clear row selection
  const handleClearSelection = useCallback(() => {
    tableState.onRowSelectionChange({})
  }, [tableState])

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

  const products = data?.data ?? []

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-3xl font-bold text-gray-900 dark:text-white">1688 Products</h2>
          <p className="text-gray-600 dark:text-gray-400 mt-1">{total} sản phẩm</p>
        </div>
      </div>

      {/* Filters Toolbar */}
      <Product1688TableToolbar tableState={tableState} />

      {/* Bulk Actions Toolbar */}
      <Product1688BulkActions
        selectedCount={selectedCount}
        onTranslateAll={handleBulkTranslate}
        onClearSelection={handleClearSelection}
        isTranslating={isBulkTranslating}
      />

      {/* TanStack Table */}
      <div>
        <Product1688Table
          data={products}
          columns={product1688Columns}
          totalRows={total}
          isLoading={isLoading}
          onRefetch={refetch}
          pagination={tableState.pagination}
          sorting={tableState.sorting}
          columnFilters={tableState.columnFilters}
          rowSelection={tableState.rowSelection}
          onPaginationChange={tableState.onPaginationChange}
          onSortingChange={tableState.onSortingChange}
          onColumnFiltersChange={tableState.onColumnFiltersChange}
          onRowSelectionChange={tableState.onRowSelectionChange}
          hasFilters={hasFilters}
          onClearFilters={handleClearFilters}
        />

        {/* Pagination */}
        <Product1688TablePagination
          pagination={tableState.pagination}
          onPaginationChange={tableState.onPaginationChange}
          totalRows={total}
        />
      </div>
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
