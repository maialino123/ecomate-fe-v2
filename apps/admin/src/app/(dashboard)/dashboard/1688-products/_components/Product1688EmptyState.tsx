'use client'

import { Package, Search, Download, BookOpen } from 'lucide-react'
import { Button } from '@workspace/ui/components/Button'

interface Product1688EmptyStateProps {
  hasFilters?: boolean
  onClearFilters?: () => void
}

/**
 * Empty state component for Product1688 list
 * Shows different messages based on whether filters are applied
 */
export const Product1688EmptyState = ({
  hasFilters,
  onClearFilters,
}: Product1688EmptyStateProps) => {
  // Show "no results" message when filters are applied
  if (hasFilters) {
    return (
      <tr>
        <td colSpan={7} className="px-6 py-16">
          <div className="flex flex-col items-center justify-center text-center">
            <Search className="h-12 w-12 text-gray-400 dark:text-gray-500 mb-4" />
            <h3 className="text-lg font-medium text-gray-900 dark:text-white">
              Không tìm thấy sản phẩm
            </h3>
            <p className="text-sm text-gray-500 dark:text-gray-400 mt-1 mb-4 max-w-sm">
              Không có sản phẩm nào phù hợp với bộ lọc của bạn. Thử thay đổi từ khóa tìm kiếm hoặc bộ lọc.
            </p>
            {onClearFilters && (
              <Button variant="outline" onClick={onClearFilters}>
                Xóa bộ lọc
              </Button>
            )}
          </div>
        </td>
      </tr>
    )
  }

  // Show "get started" message when no products exist
  return (
    <tr>
      <td colSpan={7} className="px-6 py-16">
        <div className="flex flex-col items-center justify-center text-center">
          <Package className="h-12 w-12 text-gray-400 dark:text-gray-500 mb-4" />
          <h3 className="text-lg font-medium text-gray-900 dark:text-white">
            Chưa có sản phẩm 1688
          </h3>
          <p className="text-sm text-gray-500 dark:text-gray-400 mt-1 mb-6 max-w-md">
            Sử dụng Chrome Extension để lấy thông tin sản phẩm từ 1688.com và đồng bộ về hệ thống quản lý.
          </p>
          <div className="flex flex-col sm:flex-row gap-3">
            <Button variant="outline" asChild>
              <a
                href="https://chrome.google.com/webstore"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2"
              >
                <Download className="h-4 w-4" />
                Cài Extension
              </a>
            </Button>
            <Button variant="ghost" asChild>
              <a
                href="/docs/1688-extension"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2"
              >
                <BookOpen className="h-4 w-4" />
                Xem hướng dẫn
              </a>
            </Button>
          </div>
        </div>
      </td>
    </tr>
  )
}
