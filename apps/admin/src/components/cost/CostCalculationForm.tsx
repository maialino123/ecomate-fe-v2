'use client'

import { useEffect } from 'react'
import { useForm, Controller } from 'react-hook-form'
import { Calculator } from 'lucide-react'
import { CurrencyInput } from '@workspace/ui/components/CurrencyInput'
import { CalculatePriceDto, PriceCalculationResult } from '@workspace/lib'
import { useDebounce } from '../hooks/useDebounce'
import { FormattedNumberInput } from './FormattedNumberInput'

interface CostCalculationFormProps {
    onCalculationResult: (result: PriceCalculationResult | null) => void
    onCalculationLoading: (loading: boolean) => void
}

type CostFormData = CalculatePriceDto

const DEFAULT_VALUES: CostFormData = {
    importPrice: 0,
    domesticShippingCN: 0,
    internationalShippingVN: 0,
    handlingFee: 0,
    exchangeRateCNY: 3600,
    quantity: 1,
    returnRate: 0.05,
    platformFeeRate: 0.2,
    profitMarginRate: 0.15,
}

export function CostCalculationForm({ onCalculationResult, onCalculationLoading }: CostCalculationFormProps) {
    const {
        register,
        control,
        watch,
        formState: { errors },
    } = useForm<CostFormData>({
        defaultValues: DEFAULT_VALUES,
    })

    // Watch all form values
    const formValues = watch()

    // Debounce form values to avoid too many calculations
    const debouncedValues = useDebounce(formValues, 500)

    // Client-side calculation function
    const calculatePrice = (dto: CalculatePriceDto): PriceCalculationResult | null => {
        try {
            // Input validation
            if (!dto.importPrice || dto.importPrice <= 0) return null
            if (!dto.exchangeRateCNY || dto.exchangeRateCNY <= 0) return null
            if (!dto.quantity || dto.quantity <= 0) return null

            const importPrice = dto.importPrice || 0
            const domesticShippingCN = dto.domesticShippingCN || 0
            const internationalShippingVN = dto.internationalShippingVN || 0
            const handlingFee = dto.handlingFee || 0
            const exchangeRateCNY = dto.exchangeRateCNY || 3600
            const quantity = dto.quantity || 1
            const returnRate = dto.returnRate || 0
            const platformFeeRate = dto.platformFeeRate || 0
            const profitMarginRate = dto.profitMarginRate || 0

            // Step 1: Total CNY cost
            const totalCNYCost = importPrice + domesticShippingCN

            // Step 2: Convert to VND
            const totalCNYInVND = totalCNYCost * exchangeRateCNY

            // Step 3: Total VND cost
            const totalVNDCost = totalCNYInVND + internationalShippingVN + handlingFee

            // Step 4: Base cost per unit (C₀)
            const baseCost = totalVNDCost / quantity

            // Step 5: Effective cost with return rate (C_eff)
            // Guard: returnRate cannot be 100% (would cause division by zero)
            if (returnRate >= 1) {
                console.error('Return rate cannot be 100% or higher')
                return null
            }
            const effectiveCost = baseCost / (1 - returnRate)

            // Step 6: Suggested selling price (P)
            // Guard: platformFeeRate cannot be 100% (would cause division by zero)
            if (platformFeeRate >= 1) {
                console.error('Platform fee rate cannot be 100% or higher')
                return null
            }
            const suggestedSellingPrice = (effectiveCost * (1 + profitMarginRate)) / (1 - platformFeeRate)

            // Step 7: Net profit per unit (L)
            const netProfit = suggestedSellingPrice * (1 - platformFeeRate) - effectiveCost

            // Step 8: Break-even price (P_BE)
            const breakEvenPrice = effectiveCost / (1 - platformFeeRate)

            return {
                baseCost,
                effectiveCost,
                suggestedSellingPrice,
                netProfit,
                breakEvenPrice,
                calculationBreakdown: {
                    inputs: {
                        importPriceCNY: importPrice,
                        domesticShippingCNY: domesticShippingCN,
                        internationalShippingVND: internationalShippingVN,
                        handlingFeeVND: handlingFee,
                        exchangeRateCNY,
                        quantity,
                        returnRate,
                        platformFeeRate,
                        profitMarginRate,
                    },
                    steps: {
                        totalCNYCost,
                        totalCNYInVND,
                        totalVNDCost,
                        baseCostPerUnit: baseCost,
                        effectiveCostPerUnit: effectiveCost,
                        priceBeforePlatformFee: suggestedSellingPrice * (1 - platformFeeRate),
                        suggestedPrice: suggestedSellingPrice,
                        netProfitPerUnit: netProfit,
                        breakEvenPrice,
                    },
                    percentages: {
                        profitMarginPercentage: (netProfit / effectiveCost) * 100,
                        platformFeePercentage: platformFeeRate * 100,
                        returnRatePercentage: returnRate * 100,
                    },
                },
            }
        } catch (error) {
            console.error('Calculation error:', error)
            return null
        }
    }

    // Auto-calculate when debounced values change
    useEffect(() => {
        onCalculationLoading(true)
        const result = calculatePrice(debouncedValues)
        onCalculationResult(result)
        onCalculationLoading(false)
    }, [debouncedValues, onCalculationResult, onCalculationLoading])

    return (
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700">
            <div className="bg-gradient-to-r from-blue-600 to-blue-700 px-6 py-4">
                <div className="flex items-center gap-3">
                    <Calculator className="w-6 h-6 text-white" />
                    <h3 className="text-lg font-semibold text-white">Nhập thông tin tính toán</h3>
                </div>
            </div>

            <form className="p-6 space-y-6">
                {/* Section 1: Input Costs (CNY) */}
                <div className="space-y-4">
                    <div className="flex items-center gap-2 mb-3">
                        <div className="h-1 w-1 rounded-full bg-yellow-500"></div>
                        <h4 className="text-sm font-semibold text-gray-900 dark:text-white">
                            Chi phí nhập hàng (CNY)
                        </h4>
                    </div>

                    <CurrencyInput
                        currency="CNY"
                        label="Giá nhập từ 1688/xưởng"
                        placeholder="5.2"
                        helperText="Giá nhập hàng từ nhà cung cấp (tính bằng CNY)"
                        {...register('importPrice', {
                            required: 'Giá nhập là bắt buộc',
                            min: { value: 0, message: 'Giá phải >= 0' },
                            valueAsNumber: true,
                        })}
                        error={errors.importPrice?.message}
                        required
                    />

                    <CurrencyInput
                        currency="CNY"
                        label="Phí ship nội địa Trung Quốc"
                        placeholder="10"
                        helperText="Phí vận chuyển nội địa TQ từ xưởng đến kho"
                        {...register('domesticShippingCN', {
                            min: { value: 0, message: 'Phí ship phải >= 0' },
                            valueAsNumber: true,
                        })}
                        error={errors.domesticShippingCN?.message}
                    />
                </div>

                {/* Section 2: Shipping & Handling (VND) */}
                <div className="space-y-4">
                    <div className="flex items-center gap-2 mb-3">
                        <div className="h-1 w-1 rounded-full bg-blue-500"></div>
                        <h4 className="text-sm font-semibold text-gray-900 dark:text-white">
                            Chi phí vận chuyển & xử lý (VND)
                        </h4>
                    </div>

                    <CurrencyInput
                        currency="VND"
                        label="Phí ship quốc tế (TQ → VN)"
                        placeholder="75000"
                        helperText="Phí vận chuyển từ Trung Quốc về Việt Nam"
                        {...register('internationalShippingVN', {
                            min: { value: 0, message: 'Phí ship phải >= 0' },
                            valueAsNumber: true,
                        })}
                        error={errors.internationalShippingVN?.message}
                    />

                    <CurrencyInput
                        currency="VND"
                        label="Phí xử lý / thuế / kho"
                        placeholder="50000"
                        helperText="Bao gồm thuế nhập khẩu, phí kho, đóng gói..."
                        {...register('handlingFee', {
                            min: { value: 0, message: 'Phí xử lý phải >= 0' },
                            valueAsNumber: true,
                        })}
                        error={errors.handlingFee?.message}
                    />
                </div>

                {/* Section 3: Exchange Rate & Quantity */}
                <div className="space-y-4">
                    <div className="flex items-center gap-2 mb-3">
                        <div className="h-1 w-1 rounded-full bg-purple-500"></div>
                        <h4 className="text-sm font-semibold text-gray-900 dark:text-white">Tỷ giá & Số lượng</h4>
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                        <div className="space-y-1">
                            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                                Tỷ giá CNY → VND <span className="text-red-500">*</span>
                            </label>
                            <Controller
                                name="exchangeRateCNY"
                                control={control}
                                rules={{
                                    required: 'Tỷ giá là bắt buộc',
                                    min: { value: 0, message: 'Tỷ giá phải > 0' },
                                }}
                                render={({ field }) => (
                                    <FormattedNumberInput
                                        {...field}
                                        onChange={(value) => field.onChange(value === '' ? 0 : Number(value))}
                                        className="block w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-purple-500 bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                                        placeholder="3,600"
                                    />
                                )}
                            />
                            {errors.exchangeRateCNY && (
                                <p className="text-xs text-red-600 dark:text-red-400">{errors.exchangeRateCNY.message}</p>
                            )}
                            <p className="text-xs text-gray-500 dark:text-gray-400">1 CNY = ? VND</p>
                        </div>

                        <div className="space-y-1">
                            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                                Số lượng sản phẩm <span className="text-red-500">*</span>
                            </label>
                            <Controller
                                name="quantity"
                                control={control}
                                rules={{
                                    required: 'Số lượng là bắt buộc',
                                    min: { value: 1, message: 'Số lượng phải >= 1' },
                                }}
                                render={({ field }) => (
                                    <FormattedNumberInput
                                        {...field}
                                        onChange={(value) => field.onChange(value === '' ? 1 : Number(value))}
                                        className="block w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-purple-500 bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                                        placeholder="50"
                                    />
                                )}
                            />
                            {errors.quantity && <p className="text-xs text-red-600 dark:text-red-400">{errors.quantity.message}</p>}
                            <p className="text-xs text-gray-500 dark:text-gray-400">Số sản phẩm trong lô hàng</p>
                        </div>
                    </div>
                </div>

                {/* Section 4: Business Parameters */}
                <div className="space-y-4">
                    <div className="flex items-center gap-2 mb-3">
                        <div className="h-1 w-1 rounded-full bg-green-500"></div>
                        <h4 className="text-sm font-semibold text-gray-900 dark:text-white">Tham số kinh doanh (%)</h4>
                    </div>

                    <div className="grid grid-cols-3 gap-4">
                        <div className="space-y-1">
                            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                                Tỷ lệ hoàn hàng
                            </label>
                            <div className="relative">
                                <input
                                    type="number"
                                    step="0.01"
                                    min="0"
                                    max="0.99"
                                    className="block w-full px-3 py-2 pr-8 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-green-500 dark:focus:ring-green-400 focus:border-green-500 dark:focus:border-green-400 bg-white dark:bg-gray-700 text-gray-900 dark:text-white placeholder:text-gray-400 dark:placeholder:text-gray-500"
                                    placeholder="0.05"
                                    {...register('returnRate', {
                                        min: { value: 0, message: 'Phải >= 0' },
                                        max: { value: 0.99, message: 'Phải < 100% (tối đa 99%)' },
                                        valueAsNumber: true,
                                    })}
                                />
                                <span className="absolute right-3 top-2.5 text-gray-500 dark:text-gray-400 text-sm">%</span>
                            </div>
                            {errors.returnRate && <p className="text-xs text-red-600 dark:text-red-400">{errors.returnRate.message}</p>}
                            <p className="text-xs text-gray-500 dark:text-gray-400">0.05 = 5%</p>
                        </div>

                        <div className="space-y-1">
                            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                                Phí sàn TMĐT
                            </label>
                            <div className="relative">
                                <input
                                    type="number"
                                    step="0.01"
                                    min="0"
                                    max="0.99"
                                    className="block w-full px-3 py-2 pr-8 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-green-500 dark:focus:ring-green-400 focus:border-green-500 dark:focus:border-green-400 bg-white dark:bg-gray-700 text-gray-900 dark:text-white placeholder:text-gray-400 dark:placeholder:text-gray-500"
                                    placeholder="0.20"
                                    {...register('platformFeeRate', {
                                        min: { value: 0, message: 'Phải >= 0' },
                                        max: { value: 0.99, message: 'Phải < 100% (tối đa 99%)' },
                                        valueAsNumber: true,
                                    })}
                                />
                                <span className="absolute right-3 top-2.5 text-gray-500 dark:text-gray-400 text-sm">%</span>
                            </div>
                            {errors.platformFeeRate && (
                                <p className="text-xs text-red-600 dark:text-red-400">{errors.platformFeeRate.message}</p>
                            )}
                            <p className="text-xs text-gray-500 dark:text-gray-400">0.20 = 20%</p>
                        </div>

                        <div className="space-y-1">
                            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                                Biên lợi nhuận
                            </label>
                            <div className="relative">
                                <input
                                    type="number"
                                    step="0.01"
                                    min="0"
                                    max="1"
                                    className="block w-full px-3 py-2 pr-8 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-green-500 dark:focus:ring-green-400 focus:border-green-500 dark:focus:border-green-400 bg-white dark:bg-gray-700 text-gray-900 dark:text-white placeholder:text-gray-400 dark:placeholder:text-gray-500"
                                    placeholder="0.15"
                                    {...register('profitMarginRate', {
                                        min: { value: 0, message: 'Phải >= 0' },
                                        valueAsNumber: true,
                                    })}
                                />
                                <span className="absolute right-3 top-2.5 text-gray-500 dark:text-gray-400 text-sm">%</span>
                            </div>
                            {errors.profitMarginRate && (
                                <p className="text-xs text-red-600 dark:text-red-400">{errors.profitMarginRate.message}</p>
                            )}
                            <p className="text-xs text-gray-500 dark:text-gray-400">0.15 = 15%</p>
                        </div>
                    </div>
                </div>
            </form>
        </div>
    )
}
