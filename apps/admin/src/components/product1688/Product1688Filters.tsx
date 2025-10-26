import { Product1688Status, QueryProduct1688Request } from '@workspace/lib'
import { Search } from 'lucide-react'

interface Product1688FiltersProps {
  filters: QueryProduct1688Request
  onFiltersChange: (filters: QueryProduct1688Request) => void
}

export function Product1688Filters({ filters, onFiltersChange }: Product1688FiltersProps) {
  return (
    <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-4 space-y-4">
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {/* Search */}
        <div>
          <label className="block text-sm font-medium mb-2">Search</label>
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
            <input
              type="text"
              value={filters.search || ''}
              onChange={e => onFiltersChange({ ...filters, search: e.target.value || undefined })}
              placeholder="Search by name or URL..."
              className="w-full pl-10 pr-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700"
            />
          </div>
        </div>

        {/* Status Filter */}
        <div>
          <label className="block text-sm font-medium mb-2">Status</label>
          <select
            value={filters.status || ''}
            onChange={e => onFiltersChange({ ...filters, status: (e.target.value as Product1688Status) || undefined })}
            className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700"
          >
            <option value="">All Status</option>
            <option value={Product1688Status.PENDING_REVIEW}>Pending Review</option>
            <option value={Product1688Status.TRANSLATED}>Translated</option>
            <option value={Product1688Status.APPROVED}>Approved</option>
            <option value={Product1688Status.REJECTED}>Rejected</option>
          </select>
        </div>

        {/* Sort By */}
        <div>
          <label className="block text-sm font-medium mb-2">Sort By</label>
          <select
            value={filters.sortBy || 'createdAt'}
            onChange={e =>
              onFiltersChange({ ...filters, sortBy: e.target.value as QueryProduct1688Request['sortBy'] })
            }
            className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700"
          >
            <option value="createdAt">Created Date</option>
            <option value="updatedAt">Updated Date</option>
            <option value="priceMinCNY">Price (Low to High)</option>
            <option value="nameZh">Name (A-Z)</option>
          </select>
        </div>
      </div>

      {/* Order */}
      <div className="flex items-center gap-2">
        <label className="flex items-center gap-2 text-sm">
          <input
            type="checkbox"
            checked={filters.sortOrder === 'asc'}
            onChange={e => onFiltersChange({ ...filters, sortOrder: e.target.checked ? 'asc' : 'desc' })}
            className="rounded"
          />
          <span>Ascending Order</span>
        </label>
      </div>
    </div>
  )
}
