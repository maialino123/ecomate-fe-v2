'use client'

import { X, Languages, Loader2, Download } from 'lucide-react'
import { Button } from '@workspace/ui/components/Button'

interface Product1688BulkActionsProps {
  selectedCount: number
  onTranslateAll: () => void
  onExportSelected: () => void
  onClearSelection: () => void
  isTranslating?: boolean
  isExporting?: boolean
}

/**
 * Bulk actions toolbar that appears when rows are selected
 * Supports batch translation and export to Excel
 */
export const Product1688BulkActions = ({
  selectedCount,
  onTranslateAll,
  onExportSelected,
  onClearSelection,
  isTranslating,
  isExporting,
}: Product1688BulkActionsProps) => {
  if (selectedCount === 0) return null

  return (
    <div className="flex items-center gap-4 rounded-lg border border-blue-200 bg-blue-50 dark:border-blue-900 dark:bg-blue-950/50 px-4 py-3 mb-4">
      <span className="text-sm font-medium text-blue-800 dark:text-blue-200">
        {selectedCount} sản phẩm đã chọn
      </span>

      <div className="flex items-center gap-2 ml-auto">
        <Button
          size="sm"
          variant="outline"
          onClick={onTranslateAll}
          isDisabled={isTranslating || isExporting}
          className="border-blue-300 text-blue-700 hover:bg-blue-100 dark:border-blue-700 dark:text-blue-300 dark:hover:bg-blue-900"
        >
          {isTranslating ? (
            <Loader2 className="h-4 w-4 mr-1.5 animate-spin" />
          ) : (
            <Languages className="h-4 w-4 mr-1.5" />
          )}
          {isTranslating ? 'Đang dịch...' : 'Dịch tất cả'}
        </Button>

        <Button
          size="sm"
          variant="outline"
          onClick={onExportSelected}
          isDisabled={isTranslating || isExporting}
          className="border-indigo-300 text-indigo-700 hover:bg-indigo-100 dark:border-indigo-700 dark:text-indigo-300 dark:hover:bg-indigo-900"
        >
          {isExporting ? (
            <Loader2 className="h-4 w-4 mr-1.5 animate-spin" />
          ) : (
            <Download className="h-4 w-4 mr-1.5" />
          )}
          {isExporting ? 'Đang xuất...' : `Xuất Excel (${selectedCount})`}
        </Button>

        <Button
          size="sm"
          variant="ghost"
          onClick={onClearSelection}
          className="text-blue-700 hover:bg-blue-100 dark:text-blue-300 dark:hover:bg-blue-900"
        >
          <X className="h-4 w-4" />
          <span className="sr-only">Bỏ chọn</span>
        </Button>
      </div>
    </div>
  )
}
