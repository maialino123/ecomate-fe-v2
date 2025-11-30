'use client'

import type { PaginationState, OnChangeFn } from '@tanstack/react-table'
import { Button } from '@workspace/ui/components/Button'

interface Product1688TablePaginationProps {
  pagination: PaginationState
  onPaginationChange: OnChangeFn<PaginationState>
  totalRows: number
}

export const Product1688TablePagination = ({
  pagination,
  onPaginationChange,
  totalRows,
}: Product1688TablePaginationProps) => {
  const { pageIndex, pageSize } = pagination
  const totalPages = Math.ceil(totalRows / pageSize)
  const currentPage = pageIndex + 1

  // Don't render if there's only one page or no pages
  if (totalPages <= 1) return null

  const handlePreviousPage = () => {
    onPaginationChange(prev => ({
      ...prev,
      pageIndex: prev.pageIndex - 1,
    }))
  }

  const handleNextPage = () => {
    onPaginationChange(prev => ({
      ...prev,
      pageIndex: prev.pageIndex + 1,
    }))
  }

  return (
    <div className="px-6 py-4 border-t border-gray-200 dark:border-gray-700 flex items-center justify-between bg-white dark:bg-gray-800">
      <div className="text-sm text-gray-600 dark:text-gray-400">
        Page {currentPage} of {totalPages}
      </div>
      <div className="flex gap-2">
        <Button
          onClick={handlePreviousPage}
          isDisabled={currentPage <= 1}
          variant="outline"
          size="sm"
        >
          Previous
        </Button>
        <Button
          onClick={handleNextPage}
          isDisabled={currentPage >= totalPages}
          variant="outline"
          size="sm"
        >
          Next
        </Button>
      </div>
    </div>
  )
}
