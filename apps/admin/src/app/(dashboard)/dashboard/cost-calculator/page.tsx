'use client'

import { useState } from 'react'
import { PriceCalculationResult } from '@workspace/lib'
import { CostCalculationForm } from '../../../../components/cost/CostCalculationForm'
import { CalculationResult } from '../../../../components/cost/CalculationResult'
import { FormulaGuide } from '../../../../components/cost/FormulaGuide'

export default function CostCalculatorPage() {
    const [calculationResult, setCalculationResult] = useState<PriceCalculationResult | null>(null)
    const [isCalculating, setIsCalculating] = useState(false)

    return (
        <div className="space-y-6">
            {/* Page Header */}
            <div>
                <h2 className="text-3xl font-bold text-gray-900 dark:text-white">Cost Calculator</h2>
                <p className="text-gray-600 dark:text-gray-400 mt-1">
                    Tính toán giá bán sản phẩm dropshipping từ Trung Quốc
                </p>
            </div>

            {/* Main Content - 2 Column Layout */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                {/* Left: Input Form */}
                <div>
                    <CostCalculationForm
                        onCalculationResult={setCalculationResult}
                        onCalculationLoading={setIsCalculating}
                    />
                </div>

                {/* Right: Results */}
                <div>
                    <CalculationResult result={calculationResult} loading={isCalculating} />
                </div>
            </div>

            {/* Formula Guide - Bottom Section */}
            <FormulaGuide />
        </div>
    )
}
