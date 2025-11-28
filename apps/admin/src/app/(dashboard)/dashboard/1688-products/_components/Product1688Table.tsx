'use client'

import { useMemo } from 'react'
import {
  useReactTable,
  getCoreRowModel,
  flexRender,
  type ColumnDef,
  type PaginationState,
  type SortingState,
  type ColumnFiltersState,
  type RowSelectionState,
  type OnChangeFn,
} from '@tanstack/react-table'
import type { Product1688Entity } from '@workspace/lib'
import { cn } from '@workspace/ui/lib/utils'
import { Product1688TableSkeleton } from './Product1688TableSkeleton'
import { Product1688EmptyState } from './Product1688EmptyState'

interface Product1688TableProps {
  data: Product1688Entity[]
  // TanStack Table columns with mixed value types
  columns: ColumnDef<Product1688Entity, any>[]
  totalRows: number
  isLoading?: boolean
  onRefetch?: () => void

  // State from useProduct1688TableState
  pagination: PaginationState
  sorting: SortingState
  columnFilters: ColumnFiltersState
  rowSelection: RowSelectionState

  // State setters (TanStack Table compatible)
  onPaginationChange: OnChangeFn<PaginationState>
  onSortingChange: OnChangeFn<SortingState>
  onColumnFiltersChange: OnChangeFn<ColumnFiltersState>
  onRowSelectionChange: OnChangeFn<RowSelectionState>

  // Empty state props
  hasFilters?: boolean
  onClearFilters?: () => void
}

// Column-specific classNames for cells
const getCellClassName = (columnId: string) => {
  const base = 'px-6 py-4'

  switch (columnId) {
    case 'select':
      return cn(base, 'w-10')
    case 'product':
      return cn(base, 'max-w-[240px] overflow-hidden')
    case 'actions':
      return cn(
        base,
        'sticky right-0 z-20',
        'bg-white dark:bg-gray-800 group-hover:bg-gray-50 dark:group-hover:bg-gray-700',
        'border-l border-gray-200 dark:border-gray-600',
        'shadow-[-8px_0_12px_-4px_rgba(0,0,0,0.15)] dark:shadow-[-8px_0_12px_-4px_rgba(0,0,0,0.4)]',
        'text-right overflow-visible'
      )
    case 'price':
    case 'status':
    case 'video':
    case 'variants':
    case 'createdAt':
      return cn(base, 'whitespace-nowrap')
    default:
      return base
  }
}

// Column-specific classNames for headers
const getHeaderClassName = (columnId: string) => {
  const base =
    'px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider'

  switch (columnId) {
    case 'select':
      return cn(base, 'w-10')
    case 'actions':
      return cn(base, 'sticky right-0 z-20 bg-gray-50 dark:bg-gray-700 border-l border-gray-200 dark:border-gray-600 text-right')
    default:
      return base
  }
}

export const Product1688Table = ({
  data,
  columns,
  totalRows,
  isLoading,
  onRefetch,
  pagination,
  sorting,
  columnFilters,
  rowSelection,
  onPaginationChange,
  onSortingChange,
  onColumnFiltersChange,
  onRowSelectionChange,
  hasFilters,
  onClearFilters,
}: Product1688TableProps) => {
  const pageCount = useMemo(
    () => Math.ceil(totalRows / pagination.pageSize),
    [totalRows, pagination.pageSize]
  )

  const table = useReactTable({
    data,
    columns,
    pageCount,

    // Server-side configuration
    manualPagination: true,
    manualSorting: true,
    manualFiltering: true,

    // Critical for server-side pagination: prevents resetting to page 0 when data changes
    // Without this, page would reset after every API response
    autoResetPageIndex: false,

    // State
    state: {
      pagination,
      sorting,
      columnFilters,
      rowSelection,
    },

    // State setters
    onPaginationChange,
    onSortingChange,
    onColumnFiltersChange,
    onRowSelectionChange,

    // Row model
    getCoreRowModel: getCoreRowModel(),

    // Row selection
    enableRowSelection: true,
    getRowId: row => row.id, // Use database ID

    // Pass refetch function via meta
    meta: {
      refetch: onRefetch,
    },
  })

  return (
    <div className="bg-white dark:bg-gray-800 rounded-lg shadow">
      <div className="overflow-x-auto overflow-y-visible">
        <table className="w-full table-fixed">
          <thead className="bg-gray-50 dark:bg-gray-700">
            {table.getHeaderGroups().map(headerGroup => (
              <tr key={headerGroup.id}>
                {headerGroup.headers.map(header => (
                  <th
                    key={header.id}
                    className={getHeaderClassName(header.column.id)}
                    style={{
                      width: header.column.columnDef.size,
                      minWidth: header.column.columnDef.minSize,
                      maxWidth: header.column.columnDef.maxSize,
                    }}
                  >
                    {header.isPlaceholder
                      ? null
                      : flexRender(header.column.columnDef.header, header.getContext())}
                  </th>
                ))}
              </tr>
            ))}
          </thead>
          <tbody className="divide-y divide-gray-200 dark:divide-gray-700">
            {isLoading ? (
              // Loading skeleton
              <Product1688TableSkeleton rows={pagination.pageSize} />
            ) : table.getRowModel().rows.length === 0 ? (
              // Empty state with helpful CTAs
              <Product1688EmptyState hasFilters={hasFilters} onClearFilters={onClearFilters} />
            ) : (
              // Data rows
              table.getRowModel().rows.map(row => (
                <tr key={row.id} className="group hover:bg-gray-50 dark:hover:bg-gray-700">
                  {row.getVisibleCells().map(cell => (
                    <td
                      key={cell.id}
                      className={getCellClassName(cell.column.id)}
                      style={{
                        width: cell.column.columnDef.size,
                        minWidth: cell.column.columnDef.minSize,
                        maxWidth: cell.column.columnDef.maxSize,
                      }}
                    >
                      {flexRender(cell.column.columnDef.cell, cell.getContext())}
                    </td>
                  ))}
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  )
}
