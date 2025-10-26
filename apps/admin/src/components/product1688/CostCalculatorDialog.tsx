import { useState, useEffect } from 'react'
import { useForm, Controller } from 'react-hook-form'
import { useApi } from '@workspace/shared/providers'
import {
  Product1688Variant,
  SaveCostCalculationRequest,
  CostCalculationResult,
} from '@workspace/lib'
import { CurrencyInput } from '@workspace/ui/components/CurrencyInput'
import { Button } from '@workspace/ui/components/Button'
import { Loader2, Calculator, TrendingUp, History } from 'lucide-react'
import { VariantCostHistoryList } from './VariantCostHistoryList'
import { FormattedNumberInput } from '../cost/FormattedNumberInput'

interface CostCalculatorDialogProps {
  productId: string
  variant: Product1688Variant
  isOpen: boolean
  onClose: () => void
  onSuccess?: () => void
}

type CostFormData = {
  importPrice: number
  domesticShippingCN: number
  internationalShippingVN: number
  handlingFee: number
  exchangeRateCNY: number
  quantity: number
  returnRate: number
  platformFeeRate: number
  profitMarginRate: number
  notes: string
}

export function CostCalculatorDialog({
  productId,
  variant,
  isOpen,
  onClose,
  onSuccess,
}: CostCalculatorDialogProps) {
  const api = useApi()
  const [isLoading, setIsLoading] = useState(false)
  const [showHistory, setShowHistory] = useState(false)
  const [result, setResult] = useState<CostCalculationResult | null>(
    variant.costCalculation || null
  )

  // Form handling with react-hook-form
  const {
    register,
    control,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<CostFormData>({
    defaultValues: {
      importPrice: variant.price || 0,
      domesticShippingCN: 0,
      internationalShippingVN: 0,
      handlingFee: 0,
      exchangeRateCNY: 3600,
      quantity: 1,
      returnRate: 0.05,
      platformFeeRate: 0.2,
      profitMarginRate: 0.15,
      notes: '',
    },
  })

  // Reset form when variant changes
  useEffect(() => {
    reset({
      importPrice: variant.price || 0,
      domesticShippingCN: 0,
      internationalShippingVN: 0,
      handlingFee: 0,
      exchangeRateCNY: 3600,
      quantity: 1,
      returnRate: 0.05,
      platformFeeRate: 0.2,
      profitMarginRate: 0.15,
      notes: '',
    })
    setResult(variant.costCalculation || null)
  }, [variant, reset])

  const onSubmit = async (data: CostFormData) => {
    setIsLoading(true)

    try {
      const requestData: SaveCostCalculationRequest = {
        product1688Id: productId,
        variantSku: variant.sku,
        importPrice: data.importPrice,
        domesticShippingCN: data.domesticShippingCN,
        internationalShippingVN: data.internationalShippingVN,
        handlingFee: data.handlingFee,
        exchangeRateCNY: data.exchangeRateCNY,
        quantity: data.quantity,
        returnRate: data.returnRate,
        platformFeeRate: data.platformFeeRate,
        profitMarginRate: data.profitMarginRate,
        notes: data.notes || undefined,
      }

      const response = await api.product1688.saveVariantCostCalculation(requestData)

      if (response.success) {
        setResult(response.result)
        onSuccess?.()
        // Show success message briefly then switch to history view
        setTimeout(() => {
          setShowHistory(true)
        }, 500)
      }
    } catch (error: any) {
      console.error('Failed to calculate cost:', error)
      alert(error.response?.data?.message || 'Failed to calculate cost')
    } finally {
      setIsLoading(false)
    }
  }

  const formatCurrency = (value: number, currency: string = 'VND') => {
    return new Intl.NumberFormat('vi-VN').format(value) + ` ${currency}`
  }

  if (!isOpen) return null

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white dark:bg-gray-800 rounded-lg max-w-4xl w-full max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="sticky top-0 bg-gradient-to-r from-blue-600 to-blue-700 px-6 py-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <Calculator className="w-6 h-6 text-white" />
            <div>
              <h3 className="text-lg font-semibold text-white">Tính toán giá bán</h3>
              <p className="text-sm text-blue-100">
                {variant.nameVi || variant.nameZh} ({variant.sku})
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="text-white hover:text-blue-100 text-2xl leading-none"
          >
            ×
          </button>
        </div>

        <div className="p-6">
          {!showHistory ? (
            <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
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
                  label="Giá nhập từ 1688"
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
                  <h4 className="text-sm font-semibold text-gray-900 dark:text-white">
                    Tỷ giá & Số lượng
                  </h4>
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
                      <p className="text-xs text-red-600 dark:text-red-400">
                        {errors.exchangeRateCNY.message}
                      </p>
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
                    {errors.quantity && (
                      <p className="text-xs text-red-600 dark:text-red-400">
                        {errors.quantity.message}
                      </p>
                    )}
                    <p className="text-xs text-gray-500 dark:text-gray-400">Số sản phẩm trong lô hàng</p>
                  </div>
                </div>
              </div>

              {/* Section 4: Business Parameters */}
              <div className="space-y-4">
                <div className="flex items-center gap-2 mb-3">
                  <div className="h-1 w-1 rounded-full bg-green-500"></div>
                  <h4 className="text-sm font-semibold text-gray-900 dark:text-white">
                    Tham số kinh doanh (%)
                  </h4>
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
                      <span className="absolute right-3 top-2.5 text-gray-500 dark:text-gray-400 text-sm">
                        %
                      </span>
                    </div>
                    {errors.returnRate && (
                      <p className="text-xs text-red-600 dark:text-red-400">
                        {errors.returnRate.message}
                      </p>
                    )}
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
                      <span className="absolute right-3 top-2.5 text-gray-500 dark:text-gray-400 text-sm">
                        %
                      </span>
                    </div>
                    {errors.platformFeeRate && (
                      <p className="text-xs text-red-600 dark:text-red-400">
                        {errors.platformFeeRate.message}
                      </p>
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
                      <span className="absolute right-3 top-2.5 text-gray-500 dark:text-gray-400 text-sm">
                        %
                      </span>
                    </div>
                    {errors.profitMarginRate && (
                      <p className="text-xs text-red-600 dark:text-red-400">
                        {errors.profitMarginRate.message}
                      </p>
                    )}
                    <p className="text-xs text-gray-500 dark:text-gray-400">0.15 = 15%</p>
                  </div>
                </div>
              </div>

              {/* Notes */}
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Ghi chú (Tùy chọn)
                </label>
                <textarea
                  rows={2}
                  placeholder="Thêm ghi chú về tính toán này..."
                  className="block w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                  {...register('notes')}
                />
              </div>

              {/* Results Section */}
              {result && (
                <div className="bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800 rounded-lg p-4">
                  <div className="flex items-center gap-2 mb-3">
                    <TrendingUp className="w-5 h-5 text-green-600 dark:text-green-400" />
                    <h4 className="font-semibold text-green-900 dark:text-green-100">
                      Kết quả tính toán
                    </h4>
                  </div>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-3 text-sm">
                    <div>
                      <span className="text-gray-600 dark:text-gray-400">Giá vốn cơ bản:</span>
                      <span className="font-medium ml-2">{formatCurrency(result.baseCost)}</span>
                    </div>
                    <div>
                      <span className="text-gray-600 dark:text-gray-400">Giá vốn hiệu quả:</span>
                      <span className="font-medium ml-2">
                        {formatCurrency(result.effectiveCost)}
                      </span>
                    </div>
                    <div className="col-span-2 border-t border-green-200 dark:border-green-800 pt-2">
                      <span className="text-gray-600 dark:text-gray-400">Giá bán đề xuất:</span>
                      <span className="font-bold ml-2 text-lg text-green-700 dark:text-green-300">
                        {formatCurrency(result.suggestedSellingPrice)}
                      </span>
                    </div>
                    <div>
                      <span className="text-gray-600 dark:text-gray-400">Lợi nhuận ròng:</span>
                      <span className="font-medium ml-2 text-green-600 dark:text-green-400">
                        {formatCurrency(result.netProfit)}
                      </span>
                    </div>
                    <div>
                      <span className="text-gray-600 dark:text-gray-400">Giá hòa vốn:</span>
                      <span className="font-medium ml-2">
                        {formatCurrency(result.breakEvenPrice)}
                      </span>
                    </div>
                  </div>
                </div>
              )}

              {/* Action Buttons */}
              <div className="flex gap-3 justify-end pt-4 border-t border-gray-200 dark:border-gray-700">
                <Button onClick={() => setShowHistory(true)} variant="outline" size="sm">
                  <History className="w-4 h-4 mr-2" />
                  Xem lịch sử
                </Button>
                <Button type="submit" isDisabled={isLoading} variant="default" size="sm">
                  {isLoading ? (
                    <>
                      <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                      Đang tính...
                    </>
                  ) : (
                    <>
                      <Calculator className="w-4 h-4 mr-2" />
                      Tính toán & Lưu
                    </>
                  )}
                </Button>
              </div>
            </form>
          ) : (
            <div className="space-y-4">
              <Button onClick={() => setShowHistory(false)} variant="outline" size="sm">
                ← Quay lại máy tính
              </Button>
              <VariantCostHistoryList productId={productId} variantSku={variant.sku} />
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
