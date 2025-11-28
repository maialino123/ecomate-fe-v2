'use client'

import type { QueryProduct1688Request } from '@workspace/lib'
import { Product1688Filters } from '../../../../../components/product1688'
import type { UseProduct1688TableStateReturn } from '../_hooks/useProduct1688TableState'

// Re-export return type for external use
export type { UseProduct1688TableStateReturn }

interface Product1688TableToolbarProps {
  tableState: UseProduct1688TableStateReturn
}

export const Product1688TableToolbar = ({ tableState }: Product1688TableToolbarProps) => {
  const { queryParams, setStatusFilter, setSearchFilter, onSortingChange } = tableState

  // Adapter: Convert old filter interface to new table state
  const handleFiltersChange = (newFilters: QueryProduct1688Request) => {
    // Handle status change
    if (newFilters.status !== queryParams.status) {
      setStatusFilter(newFilters.status)
    }

    // Handle search change
    if (newFilters.search !== queryParams.search) {
      setSearchFilter(newFilters.search)
    }

    // Handle sort change
    if (newFilters.sortBy !== queryParams.sortBy || newFilters.sortOrder !== queryParams.sortOrder) {
      onSortingChange([
        {
          id: newFilters.sortBy || 'createdAt',
          desc: newFilters.sortOrder !== 'asc',
        },
      ])
    }
  }

  return <Product1688Filters filters={queryParams} onFiltersChange={handleFiltersChange} />
}
