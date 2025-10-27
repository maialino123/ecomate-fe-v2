'use client'

import { useState, useEffect } from 'react'
import { useApi } from '@workspace/shared/providers'
import { VariantCostHistoryItem } from '@workspace/lib'
import { Loader2, History, Calendar, User } from 'lucide-react'

interface VariantCostHistoryListProps {
  productId: string
  variantSku: string
}

export function VariantCostHistoryList({ productId, variantSku }: VariantCostHistoryListProps) {
  const api = useApi()
  const [history, setHistory] = useState<VariantCostHistoryItem[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    loadHistory()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [productId, variantSku])

  const loadHistory = async () => {
    setIsLoading(true)
    setError(null)

    try {
      const response = await api.product1688.getVariantCostHistory(productId, variantSku)
      setHistory(response.history)
    } catch (err: any) {
      console.error('Failed to load cost history:', err)
      setError(err.response?.data?.message || 'Failed to load history')
    } finally {
      setIsLoading(false)
    }
  }

  const formatCurrency = (value: number, currency: string = 'VND') => {
    return new Intl.NumberFormat('vi-VN').format(value) + ` ${currency}`
  }

  const formatPercent = (value: number) => {
    return (value * 100).toFixed(1) + '%'
  }

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleString('vi-VN', {
      year: 'numeric',
      month: '2-digit',
      day: '2-digit',
      hour: '2-digit',
      minute: '2-digit',
    })
  }

  if (isLoading) {
    return (
      <div className="flex items-center justify-center py-12">
        <Loader2 className="w-6 h-6 animate-spin text-blue-600" />
        <span className="ml-2 text-gray-600 dark:text-gray-400">Loading history...</span>
      </div>
    )
  }

  if (error) {
    return (
      <div className="bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg p-4">
        <p className="text-red-800 dark:text-red-200">{error}</p>
      </div>
    )
  }

  if (history.length === 0) {
    return (
      <div className="bg-gray-50 dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg p-8 text-center">
        <History className="w-12 h-12 mx-auto mb-3 text-gray-400" />
        <p className="text-gray-600 dark:text-gray-400">No calculation history yet</p>
        <p className="text-sm text-gray-500 dark:text-gray-500 mt-1">
          Save your first calculation to see it here
        </p>
      </div>
    )
  }

  return (
    <div className="space-y-4">
      <div className="flex items-center gap-2 mb-4">
        <History className="w-5 h-5 text-gray-600 dark:text-gray-400" />
        <h4 className="font-semibold">Calculation History ({history.length})</h4>
      </div>

      <div className="space-y-3">
        {history.map((item, index) => (
          <div
            key={item.id}
            className={`border rounded-lg p-4 ${
              index === 0
                ? 'bg-blue-50 dark:bg-blue-900/20 border-blue-200 dark:border-blue-800'
                : 'bg-white dark:bg-gray-800 border-gray-200 dark:border-gray-700'
            }`}
          >
            {/* Header */}
            <div className="flex items-start justify-between mb-3">
              <div className="flex items-center gap-2 text-sm text-gray-600 dark:text-gray-400">
                <Calendar className="w-4 h-4" />
                <span>{formatDate(item.createdAt)}</span>
                {index === 0 && (
                  <span className="ml-2 px-2 py-0.5 bg-blue-100 dark:bg-blue-900 text-blue-800 dark:text-blue-200 text-xs rounded-full">
                    Latest
                  </span>
                )}
              </div>
              {item.user && (
                <div className="flex items-center gap-1 text-xs text-gray-500 dark:text-gray-500">
                  <User className="w-3 h-3" />
                  <span>
                    {item.user.firstName || item.user.lastName
                      ? `${item.user.firstName || ''} ${item.user.lastName || ''}`.trim()
                      : item.user.email}
                  </span>
                </div>
              )}
            </div>

            {/* Input Parameters */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mb-3 text-sm">
              <div className="bg-gray-50 dark:bg-gray-700/50 rounded p-2">
                <div className="text-xs text-gray-500 dark:text-gray-400 mb-1">Import Price</div>
                <div className="font-medium">{formatCurrency(item.importPrice, 'CNY')}</div>
              </div>
              <div className="bg-gray-50 dark:bg-gray-700/50 rounded p-2">
                <div className="text-xs text-gray-500 dark:text-gray-400 mb-1">Exchange Rate</div>
                <div className="font-medium">{item.exchangeRateCNY.toFixed(2)}</div>
              </div>
              <div className="bg-gray-50 dark:bg-gray-700/50 rounded p-2">
                <div className="text-xs text-gray-500 dark:text-gray-400 mb-1">Quantity</div>
                <div className="font-medium">{item.quantity}</div>
              </div>
              <div className="bg-gray-50 dark:bg-gray-700/50 rounded p-2">
                <div className="text-xs text-gray-500 dark:text-gray-400 mb-1">Profit Margin</div>
                <div className="font-medium">{formatPercent(item.profitMarginRate)}</div>
              </div>
            </div>

            {/* Shipping & Fees (collapsible) */}
            {(item.domesticShippingCN > 0 ||
              item.internationalShippingVN > 0 ||
              item.handlingFee > 0) && (
              <details className="text-sm mb-3">
                <summary className="cursor-pointer text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-gray-200">
                  View shipping & fees
                </summary>
                <div className="mt-2 grid grid-cols-3 gap-2 pl-4">
                  {item.domesticShippingCN > 0 && (
                    <div>
                      <div className="text-xs text-gray-500 dark:text-gray-400">
                        Domestic Ship (CN)
                      </div>
                      <div>{formatCurrency(item.domesticShippingCN, 'CNY')}</div>
                    </div>
                  )}
                  {item.internationalShippingVN > 0 && (
                    <div>
                      <div className="text-xs text-gray-500 dark:text-gray-400">Int'l Ship (VN)</div>
                      <div>{formatCurrency(item.internationalShippingVN)}</div>
                    </div>
                  )}
                  {item.handlingFee > 0 && (
                    <div>
                      <div className="text-xs text-gray-500 dark:text-gray-400">Handling Fee</div>
                      <div>{formatCurrency(item.handlingFee)}</div>
                    </div>
                  )}
                </div>
              </details>
            )}

            {/* Results */}
            <div className="bg-green-50 dark:bg-green-900/20 rounded-lg p-3">
              <div className="grid grid-cols-2 md:grid-cols-5 gap-3 text-sm">
                <div>
                  <div className="text-xs text-gray-600 dark:text-gray-400 mb-1">Base Cost</div>
                  <div className="font-medium">{formatCurrency(item.baseCost)}</div>
                </div>
                <div>
                  <div className="text-xs text-gray-600 dark:text-gray-400 mb-1">
                    Effective Cost
                  </div>
                  <div className="font-medium">{formatCurrency(item.effectiveCost)}</div>
                </div>
                <div className="col-span-2 md:col-span-1">
                  <div className="text-xs text-gray-600 dark:text-gray-400 mb-1">
                    Selling Price
                  </div>
                  <div className="font-bold text-green-700 dark:text-green-300">
                    {formatCurrency(item.suggestedSellingPrice)}
                  </div>
                </div>
                <div>
                  <div className="text-xs text-gray-600 dark:text-gray-400 mb-1">Net Profit</div>
                  <div className="font-medium text-green-600 dark:text-green-400">
                    {formatCurrency(item.netProfit)}
                  </div>
                </div>
                <div>
                  <div className="text-xs text-gray-600 dark:text-gray-400 mb-1">
                    Break-Even
                  </div>
                  <div className="font-medium">{formatCurrency(item.breakEvenPrice)}</div>
                </div>
              </div>
            </div>

            {/* Notes */}
            {item.notes && (
              <div className="mt-3 text-sm">
                <div className="text-xs text-gray-500 dark:text-gray-400 mb-1">Notes:</div>
                <div className="text-gray-700 dark:text-gray-300 italic">{item.notes}</div>
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  )
}
