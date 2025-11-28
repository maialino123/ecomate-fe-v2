import { useState, useMemo, useCallback } from 'react'
import type {
  PaginationState,
  SortingState,
  ColumnFiltersState,
  RowSelectionState,
  OnChangeFn,
} from '@tanstack/react-table'
import type { QueryProduct1688Request, Product1688Status } from '@workspace/lib'

/** Default page size for product list */
const DEFAULT_PAGE_SIZE = 20

export interface UseProduct1688TableStateReturn {
  // TanStack Table states
  pagination: PaginationState
  sorting: SortingState
  columnFilters: ColumnFiltersState
  rowSelection: RowSelectionState

  // State setters (TanStack Table compatible)
  onPaginationChange: OnChangeFn<PaginationState>
  onSortingChange: OnChangeFn<SortingState>
  onColumnFiltersChange: OnChangeFn<ColumnFiltersState>
  onRowSelectionChange: OnChangeFn<RowSelectionState>

  // API query params (derived)
  queryParams: QueryProduct1688Request

  // Helper methods
  resetFilters: () => void
  setStatusFilter: (status: Product1688Status | undefined) => void
  setSearchFilter: (search: string | undefined) => void
}

export const useProduct1688TableState = (): UseProduct1688TableStateReturn => {
  // TanStack Table states
  const [pagination, setPagination] = useState<PaginationState>({
    pageIndex: 0, // 0-indexed for TanStack Table
    pageSize: DEFAULT_PAGE_SIZE,
  })

  const [sorting, setSorting] = useState<SortingState>([
    { id: 'createdAt', desc: true },
  ])

  const [columnFilters, setColumnFilters] = useState<ColumnFiltersState>([])

  const [rowSelection, setRowSelection] = useState<RowSelectionState>({})

  // Convert TanStack Table state to API query params
  const queryParams = useMemo((): QueryProduct1688Request => {
    // Extract status filter
    const statusFilter = columnFilters.find(f => f.id === 'status')
    const searchFilter = columnFilters.find(f => f.id === 'search')

    // Convert sorting
    const sort = sorting[0] // Single column sort

    return {
      page: pagination.pageIndex + 1, // API uses 1-indexed pages
      limit: pagination.pageSize,
      sortBy: (sort?.id as QueryProduct1688Request['sortBy']) ?? 'createdAt',
      sortOrder: sort?.desc ? 'desc' : 'asc',
      status: statusFilter?.value as Product1688Status | undefined,
      search: searchFilter?.value as string | undefined,
    }
  }, [pagination, sorting, columnFilters])

  // Helper: Reset all filters
  const resetFilters = useCallback(() => {
    setColumnFilters([])
    setPagination(prev => ({ ...prev, pageIndex: 0 }))
  }, [])

  // Helper: Set status filter
  const setStatusFilter = useCallback((status: Product1688Status | undefined) => {
    setColumnFilters(prev => {
      const filtered = prev.filter(f => f.id !== 'status')
      if (status) {
        return [...filtered, { id: 'status', value: status }]
      }
      return filtered
    })
    setPagination(prev => ({ ...prev, pageIndex: 0 })) // Reset to first page
  }, [])

  // Helper: Set search filter
  const setSearchFilter = useCallback((search: string | undefined) => {
    setColumnFilters(prev => {
      const filtered = prev.filter(f => f.id !== 'search')
      if (search) {
        return [...filtered, { id: 'search', value: search }]
      }
      return filtered
    })
    setPagination(prev => ({ ...prev, pageIndex: 0 })) // Reset to first page
  }, [])

  return {
    pagination,
    sorting,
    columnFilters,
    rowSelection,
    onPaginationChange: setPagination,
    onSortingChange: setSorting,
    onColumnFiltersChange: setColumnFilters,
    onRowSelectionChange: setRowSelection,
    queryParams,
    resetFilters,
    setStatusFilter,
    setSearchFilter,
  }
}
