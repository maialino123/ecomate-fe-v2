'use client'

import { PriceCalculationResult } from '@workspace/lib'
import { TrendingUp, DollarSign, AlertTriangle, CheckCircle } from 'lucide-react'

interface CalculationResultProps {
    result: PriceCalculationResult | null
    loading?: boolean
}

export function CalculationResult({ result, loading }: CalculationResultProps) {
    if (loading) {
        return (
            <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700 p-6">
                <div className="animate-pulse space-y-4">
                    <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-3/4"></div>
                    <div className="h-8 bg-gray-200 dark:bg-gray-700 rounded"></div>
                    <div className="h-8 bg-gray-200 dark:bg-gray-700 rounded"></div>
                    <div className="h-8 bg-gray-200 dark:bg-gray-700 rounded"></div>
                </div>
            </div>
        )
    }

    if (!result) {
        return (
            <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700 p-6">
                <div className="text-center py-12">
                    <DollarSign className="w-16 h-16 text-gray-300 dark:text-gray-600 mx-auto mb-4" />
                    <p className="text-gray-500 dark:text-gray-400">
                        Nhập thông tin bên trái để xem kết quả tính toán
                    </p>
                </div>
            </div>
        )
    }

    const formatCurrency = (value: number) => {
        return new Intl.NumberFormat('vi-VN', {
            style: 'currency',
            currency: 'VND',
            minimumFractionDigits: 0,
            maximumFractionDigits: 0,
        }).format(value)
    }

    const isProfitable = result.netProfit > 0
    const profitMarginPercentage = result.calculationBreakdown.percentages.profitMarginPercentage

    return (
        <div className="space-y-6">
            {/* Main Results */}
            <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700 overflow-hidden">
                <div className="bg-gradient-to-r from-blue-600 to-blue-700 px-6 py-4">
                    <h3 className="text-lg font-semibold text-white">Kết quả tính toán</h3>
                </div>

                <div className="p-6 space-y-4">
                    {/* Suggested Selling Price */}
                    <div className="bg-blue-50 dark:bg-blue-900/20 border-2 border-blue-200 dark:border-blue-800 rounded-lg p-4">
                        <div className="flex items-center justify-between">
                            <div>
                                <p className="text-sm text-blue-700 dark:text-blue-300 mb-1">Giá bán đề xuất</p>
                                <p className="text-3xl font-bold text-blue-900 dark:text-blue-100">
                                    {formatCurrency(result.suggestedSellingPrice)}
                                </p>
                            </div>
                            <TrendingUp className="w-12 h-12 text-blue-600 dark:text-blue-400" />
                        </div>
                    </div>

                    {/* Net Profit */}
                    <div
                        className={`border-2 rounded-lg p-4 ${
                            isProfitable
                                ? 'bg-green-50 dark:bg-green-900/20 border-green-200 dark:border-green-800'
                                : 'bg-red-50 dark:bg-red-900/20 border-red-200 dark:border-red-800'
                        }`}
                    >
                        <div className="flex items-center justify-between">
                            <div>
                                <p
                                    className={`text-sm mb-1 ${
                                        isProfitable
                                            ? 'text-green-700 dark:text-green-300'
                                            : 'text-red-700 dark:text-red-300'
                                    }`}
                                >
                                    Lợi nhuận ròng / sản phẩm
                                </p>
                                <p
                                    className={`text-2xl font-bold ${
                                        isProfitable
                                            ? 'text-green-900 dark:text-green-100'
                                            : 'text-red-900 dark:text-red-100'
                                    }`}
                                >
                                    {formatCurrency(result.netProfit)}
                                </p>
                                <p
                                    className={`text-sm mt-1 ${
                                        isProfitable
                                            ? 'text-green-600 dark:text-green-400'
                                            : 'text-red-600 dark:text-red-400'
                                    }`}
                                >
                                    Biên lợi nhuận: {profitMarginPercentage.toFixed(2)}%
                                </p>
                            </div>
                            {isProfitable ? (
                                <CheckCircle className="w-10 h-10 text-green-600 dark:text-green-400" />
                            ) : (
                                <AlertTriangle className="w-10 h-10 text-red-600 dark:text-red-400" />
                            )}
                        </div>
                    </div>

                    {/* Cost Details */}
                    <div className="grid grid-cols-1 gap-3">
                        <div className="flex justify-between items-center py-2 border-b border-gray-200 dark:border-gray-700">
                            <span className="text-sm text-gray-600 dark:text-gray-400">Giá vốn cơ bản (C₀)</span>
                            <span className="font-semibold text-gray-900 dark:text-white">
                                {formatCurrency(result.baseCost)}
                            </span>
                        </div>
                        <div className="flex justify-between items-center py-2 border-b border-gray-200 dark:border-gray-700">
                            <span className="text-sm text-gray-600 dark:text-gray-400">
                                Giá vốn hiệu dụng (C_eff)
                            </span>
                            <span className="font-semibold text-gray-900 dark:text-white">
                                {formatCurrency(result.effectiveCost)}
                            </span>
                        </div>
                        <div className="flex justify-between items-center py-2 border-b border-gray-200 dark:border-gray-700">
                            <span className="text-sm text-gray-600 dark:text-gray-400">Giá hòa vốn (P_BE)</span>
                            <span className="font-semibold text-gray-900 dark:text-white">
                                {formatCurrency(result.breakEvenPrice)}
                            </span>
                        </div>
                    </div>
                </div>
            </div>

            {/* Detailed Breakdown */}
            <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700">
                <div className="px-6 py-4 border-b border-gray-200 dark:border-gray-700">
                    <h4 className="text-sm font-semibold text-gray-900 dark:text-white">Chi tiết tính toán</h4>
                </div>
                <div className="p-6">
                    <div className="space-y-2 text-sm">
                        <div className="flex justify-between">
                            <span className="text-gray-600 dark:text-gray-400">Tổng chi phí CNY</span>
                            <span className="font-mono text-gray-900 dark:text-white">
                                ¥{result.calculationBreakdown.steps.totalCNYCost.toFixed(2)}
                            </span>
                        </div>
                        <div className="flex justify-between">
                            <span className="text-gray-600 dark:text-gray-400">Quy đổi sang VND</span>
                            <span className="font-mono text-gray-900 dark:text-white">
                                {formatCurrency(result.calculationBreakdown.steps.totalCNYInVND)}
                            </span>
                        </div>
                        <div className="flex justify-between">
                            <span className="text-gray-600 dark:text-gray-400">Tổng chi phí VND</span>
                            <span className="font-mono text-gray-900 dark:text-white">
                                {formatCurrency(result.calculationBreakdown.steps.totalVNDCost)}
                            </span>
                        </div>
                        <div className="flex justify-between">
                            <span className="text-gray-600 dark:text-gray-400">Số lượng</span>
                            <span className="font-mono text-gray-900 dark:text-white">
                                {result.calculationBreakdown.inputs.quantity} cái
                            </span>
                        </div>
                        <div className="pt-2 mt-2 border-t border-gray-200 dark:border-gray-700 flex justify-between">
                            <span className="text-gray-600 dark:text-gray-400">Tỷ lệ hoàn hàng</span>
                            <span className="font-mono text-gray-900 dark:text-white">
                                {result.calculationBreakdown.percentages.returnRatePercentage.toFixed(2)}%
                            </span>
                        </div>
                        <div className="flex justify-between">
                            <span className="text-gray-600 dark:text-gray-400">Phí sàn TMĐT</span>
                            <span className="font-mono text-gray-900 dark:text-white">
                                {result.calculationBreakdown.percentages.platformFeePercentage.toFixed(2)}%
                            </span>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}
